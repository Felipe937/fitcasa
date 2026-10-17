import React, { useRef, useState, useEffect, useMemo } from 'react';
import { PanelRecord, ConsentRegistry, DOC_VERSIONS } from '../types';
import { loadRegistry } from '../components/ConsentGuard';
import { EXERCISES_DATA } from '../data/exercisesData';
import {
  readStorage,
  writeStorage,
  removeAllStorage,
  removeConsentStorage,
  STORAGE_KEYS,
  PANEL_STORAGE_VERSION,
} from '../utils/storage';

const PAIN_MIN = 0;
const PAIN_MAX = 10;
const PAIN_ALERT_FROM = 7;
const ACTIVITY_MAX = 120;
const NOTE_MAX = 500;

const AVAILABILITY_TEXT =
  'La persistencia no está disponible en este navegador. Puedes usar el panel durante esta sesión, pero el registro se perderá al recargar la página.';
const WRITE_FAILURE_TEXT =
  'La persistencia no está disponible. El panel sigue funcionando durante esta sesión, pero no conservará los cambios al recargar.';
const RECOVERY_FAILURE_TEXT =
  'No se pudo recuperar el historial guardado. Puedes continuar y volver a guardarlo.';
const SAVED_TEXT = 'Registro guardado en este dispositivo';
const SAVED_EDIT_TEXT = 'Cambios guardados en este dispositivo';
const DELETED_TEXT = 'Entrada eliminada del historial';

type RangeFilter = 'todos' | 'ultimos-7-dias' | 'este-mes';
type PainTone = 'bajo' | 'medio' | 'alto';
type FieldErrors = Record<string, string>;

const FIELD_ORDER = ['date', 'activity', 'pain', 'note'] as const;
type FieldName = (typeof FIELD_ORDER)[number];

const RANGE_OPTIONS: { value: RangeFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'ultimos-7-dias', label: 'Últimos 7 días' },
  { value: 'este-mes', label: 'Este mes' },
];

function localDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidDate(value: string): boolean {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && localDateString(date) === value;
}

function formatDate(value: string): string {
  const parts = value.split('-');
  if (parts.length !== 3) return value;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatDateLong(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return formatDate(value);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** Desplaza una fecha ISO un número de días sin depender de la zona horaria. */
function shiftDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  return localDateString(date);
}

function painLabel(value: number): string {
  if (value === PAIN_MIN) return 'Sin molestia';
  if (value <= 3) return 'Molestia leve';
  if (value <= 6) return 'Molestia moderada';
  if (value <= 9) return 'Dolor intenso';
  return 'Dolor muy intenso';
}

function painTone(value: number): PainTone {
  if (value <= 3) return 'bajo';
  if (value <= 6) return 'medio';
  return 'alto';
}

function withoutKey(errors: FieldErrors, key: string): FieldErrors {
  if (!(key in errors)) return errors;
  const next = { ...errors };
  delete next[key];
  return next;
}

/** Consulta de medios con lectura inicial sincrónica, sin destello en el primer render. */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => window.matchMedia(query).matches);

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(list.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

function normalizeRecord(item: unknown): PanelRecord | null {
  if (!item || typeof item !== 'object') return null;
  const it = item as Partial<PanelRecord>;
  if (typeof it.id !== 'string' || !isValidDate(it.date || '')) return null;
  const pain = Number(it.pain);
  if (!Number.isInteger(pain) || pain < 0 || pain > 10) return null;
  const activity = typeof it.activity === 'string' ? it.activity.trim().slice(0, ACTIVITY_MAX) : '';
  const note = typeof it.note === 'string' ? it.note.trim().slice(0, NOTE_MAX) : '';
  const exerciseId = typeof it.exerciseId === 'string' ? it.exerciseId : undefined;
  return { id: it.id.slice(0, 80), date: it.date!, activity, pain, note, exerciseId };
}

function normalizeRecords(data: unknown): PanelRecord[] {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeRecord).filter((r): r is PanelRecord => r !== null).slice(0, 1000);
}

function joinIds(...ids: (string | false | undefined)[]): string | undefined {
  const list = ids.filter((id): id is string => typeof id === 'string');
  return list.length > 0 ? list.join(' ') : undefined;
}

export const PanelPage: React.FC<{ onStorageCleared?: () => void }> = ({
  onStorageCleared,
}) => {
  const today = localDateString(new Date());
  const isWide = useMediaQuery('(min-width: 48rem)');

  const [records, setRecords] = useState<PanelRecord[]>([]);
  const [date, setDate] = useState<string>(today);
  const [activity, setActivity] = useState<string>('');
  const [pain, setPain] = useState<number | null>(null);
  const [note, setNote] = useState<string>('');
  const [exerciseId, setExerciseId] = useState<string>('');
  const [autoActivity, setAutoActivity] = useState<string | null>(null);
  const [unlinkNotice, setUnlinkNotice] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>('');
  const [storageNotice, setStorageNotice] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [clearStatus, setClearStatus] = useState<string>('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<PanelRecord | null>(null);

  const [range, setRange] = useState<RangeFilter>('todos');
  const [search, setSearch] = useState<string>('');
  const [consent, setConsent] = useState<ConsentRegistry | null>(null);
  const [consentResetStatus, setConsentResetStatus] = useState<string>('');

  const dateRef = useRef<HTMLInputElement>(null);
  const activityRef = useRef<HTMLInputElement>(null);
  const painRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const clearTriggerRef = useRef<HTMLButtonElement>(null);
  const statusTimer = useRef<number | null>(null);

  useEffect(() => {
    const res = readStorage<PanelRecord[]>(
      STORAGE_KEYS.panel,
      PANEL_STORAGE_VERSION,
      normalizeRecords
    );

    if (!res.available) {
      setStorageNotice(AVAILABILITY_TEXT);
    } else if (res.reason === 'corrupt' || res.reason === 'unknown-version') {
      setStorageNotice(RECOVERY_FAILURE_TEXT);
    }

    if (res.value) {
      setRecords(res.value);
    }

    // Registro de aceptación legal ya guardado, si lo hay.
    setConsent(loadRegistry());
  }, []);

  useEffect(() => {
    return () => {
      if (statusTimer.current !== null) window.clearTimeout(statusTimer.current);
    };
  }, []);

  useEffect(() => {
    if (confirmClear) confirmRef.current?.focus();
  }, [confirmClear]);

  // El botón disparador se desmonta mientras la confirmación está abierta, así que
  // el foco se devuelve en un efecto, no de forma síncrona al cerrar.
  const confirmWasOpen = useRef(false);
  useEffect(() => {
    if (confirmWasOpen.current && !confirmClear) clearTriggerRef.current?.focus();
    confirmWasOpen.current = confirmClear;
  }, [confirmClear]);

  const announce = (text: string) => {
    if (statusTimer.current !== null) window.clearTimeout(statusTimer.current);
    setStatusMessage(text);
    statusTimer.current = window.setTimeout(() => {
      setStatusMessage('');
      statusTimer.current = null;
    }, 9000);
  };

  const saveUpdatedRecords = (newRecords: PanelRecord[]) => {
    setRecords(newRecords);
    const writeRes = writeStorage(STORAGE_KEYS.panel, PANEL_STORAGE_VERSION, newRecords);
    if (!writeRes.saved) {
      setStorageNotice(WRITE_FAILURE_TEXT);
    }
  };

  /**
   * Vacía los campos del formulario. No toca la aceptación de los documentos:
   * esa decisión vive en su propia clave y solo se retira desde «Privacidad y
   * borrado», de forma explícita.
   */
  const resetForm = () => {
    setDate(today);
    setActivity('');
    setPain(null);
    setNote('');
    setExerciseId('');
    setAutoActivity(null);
    setUnlinkNotice(false);
    setEditingId(null);
    setFieldErrors({});
    setFormError('');
  };

  /** Retira la aceptación sin borrar el historial. Deja de dar acceso. */
  const handleWithdrawConsent = () => {
    removeConsentStorage();
    setConsent(null);
    setConsentResetStatus(
      'Se retiró tu aceptación y ya no puedes volver a entrar al panel ni al cuestionario hasta registrarla de nuevo. Tus registros y respuestas se conservan.'
    );
    onStorageCleared?.();
  };

  const cancelEdit = () => resetForm();

  const clearFieldError = (key: FieldName) => {
    setFieldErrors((prev) => withoutKey(prev, key));
  };

  const handleActivityChange = (value: string) => {
    // Editar a mano el texto autocompletado corta el vínculo con el ejercicio
    // para no guardar una asociación que ya no describe lo que se hizo.
    if (exerciseId && autoActivity !== value) {
      setExerciseId('');
      setAutoActivity(null);
      setUnlinkNotice(true);
    }
    setActivity(value);
    clearFieldError('activity');
  };

  const handleSelectExercise = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setExerciseId(selectedId);
    setUnlinkNotice(false);
    if (!selectedId) {
      setAutoActivity(null);
      return;
    }
    const found = EXERCISES_DATA.find((ex) => ex.id === selectedId);
    if (found) {
      setAutoActivity(found.name);
      setActivity(found.name);
      clearFieldError('activity');
    }
  };

  const handlePainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    if (Number.isInteger(next) && next >= PAIN_MIN && next <= PAIN_MAX) {
      setPain(next);
      clearFieldError('pain');
    }
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!isValidDate(date) || date > today) {
      errors.date = 'Selecciona una fecha válida que no sea posterior a hoy.';
    }
    if (activity.length > ACTIVITY_MAX) {
      errors.activity = `La actividad debe tener ${ACTIVITY_MAX} caracteres o menos.`;
    }
    if (pain === null) {
      errors.pain =
        'Indica tu dolor percibido desplazando el control o con las flechas del teclado. El 0 es una respuesta válida: significa “sin molestia”.';
    }
    if (note.length > NOTE_MAX) {
      errors.note = `La nota debe tener ${NOTE_MAX} caracteres o menos.`;
    }

    return errors;
  };

  const focusFirstError = (errors: FieldErrors) => {
    const refs: Record<FieldName, React.RefObject<HTMLInputElement | HTMLTextAreaElement>> = {
      date: dateRef,
      activity: activityRef,
      pain: painRef,
      note: noteRef,
    };
    const first = FIELD_ORDER.find((key) => key in errors);
    if (first) refs[first].current?.focus();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError('Revisa los campos señalados antes de guardar.');
      focusFirstError(errors);
      return;
    }
    setFieldErrors({});
    setFormError('');

    const savedPain = pain as number;
    const linkedId = exerciseId || undefined;

    if (editingId) {
      const updated = records.map((rec) =>
        rec.id === editingId
          ? {
              id: editingId,
              date,
              activity: activity.trim(),
              pain: savedPain,
              note: note.trim(),
              exerciseId: linkedId,
            }
          : rec
      );
      saveUpdatedRecords(updated);
      announce(SAVED_EDIT_TEXT);
    } else {
      const newId =
        window.crypto && typeof window.crypto.randomUUID === 'function'
          ? window.crypto.randomUUID()
          : `record-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

      const newRec: PanelRecord = {
        id: newId,
        date,
        activity: activity.trim(),
        pain: savedPain,
        note: note.trim(),
        exerciseId: linkedId,
      };
      saveUpdatedRecords([...records, newRec]);
      announce(SAVED_TEXT);
    }

    resetForm();
  };

  const handleStartEdit = (record: PanelRecord) => {
    const linkedName =
      record.exerciseId !== undefined
        ? EXERCISES_DATA.find((ex) => ex.id === record.exerciseId)?.name
        : undefined;
    const stillMatches = linkedName !== undefined && linkedName === record.activity;

    setEditingId(record.id);
    setDate(record.date);
    setActivity(record.activity);
    setPain(record.pain);
    setNote(record.note);
    setExerciseId(stillMatches ? record.exerciseId! : '');
    setAutoActivity(stillMatches ? record.activity : null);
    setUnlinkNotice(false);
    setFieldErrors({});
    setFormError('');
    // La aceptación vive en su propia clave, no en el registro: se refleja la
    // que hay guardada, sea cual sea.
    setConsent(loadRegistry());

    const entryHeading = document.getElementById('entry-heading');
    if (entryHeading) entryHeading.focus();
  };

  const handleRequestDelete = (record: PanelRecord) => {
    setRecordToDelete(record);
  };

  const handleConfirmDelete = () => {
    if (!recordToDelete) return;
    const id = recordToDelete.id;
    const filtered = records.filter((rec) => rec.id !== id);
    saveUpdatedRecords(filtered);
    if (editingId === id) {
      resetForm();
    }
    setRecordToDelete(null);
    announce(DELETED_TEXT);
  };

  const handleCancelDelete = () => {
    setRecordToDelete(null);
  };

  const handleClearAll = () => {
    const res = removeAllStorage();
    if (statusTimer.current !== null) window.clearTimeout(statusTimer.current);
    setStatusMessage('');
    statusTimer.current = null;
    setRecords([]);
    resetForm();
    setConfirmClear(false);
    setConsentResetStatus('');
    onStorageCleared?.();
    setClearStatus(
      res.removed
        ? 'Se borraron las respuestas y todos los registros guardados en este dispositivo.'
        : 'No fue posible borrar los datos guardados.'
    );
  };

  const cancelClear = () => setConfirmClear(false);

  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)),
    [records]
  );

  const filteredRecords = useMemo(() => {
    const weekStart = shiftDays(today, -6);
    const currentMonth = today.slice(0, 7);
    const query = search.trim().toLowerCase();

    return sortedRecords.filter((record) => {
      if (range === 'ultimos-7-dias' && record.date < weekStart) return false;
      if (range === 'este-mes' && !record.date.startsWith(currentMonth)) return false;
      if (query !== '' && !record.activity.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [sortedRecords, range, search, today]);

  const latest = sortedRecords[0];
  const linkedName = exerciseId
    ? EXERCISES_DATA.find((ex) => ex.id === exerciseId)?.name ?? ''
    : '';
  const painValue = pain ?? PAIN_MIN;
  const showPainAlert = pain !== null && pain >= PAIN_ALERT_FROM;

  const linkStatusText = exerciseId
    ? `Actividad vinculada a “${linkedName}” de la biblioteca. Si editas el texto, se guardará sin esta asociación.`
    : unlinkNotice
      ? 'Has editado el texto: la actividad se guardará sin vincular a un ejercicio de la biblioteca.'
      : 'Este campo es opcional: puedes escribir una actividad libre sin vincularla a la biblioteca.';

  const painStyle = {
    '--panel-relleno': `${(painValue / PAIN_MAX) * 100}%`,
  } as React.CSSProperties;

  const painClasses = [
    'panel-dolor',
    pain === null ? 'panel-dolor--sin-indicar' : '',
    showPainAlert ? 'panel-dolor--alto' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const readoutClasses = [
    'panel-dolor__lectura',
    pain === null ? 'panel-dolor__lectura--pendiente' : '',
    showPainAlert ? 'panel-dolor__lectura--alto' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <main id="contenido" tabIndex={-1} className="container app-main panel-page">
      <header className="panel-page__cabecera">
        <p className="panel-page__eyebrow">Seguimiento personal</p>
        <div className="panel-page__motivo" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M12 2L1 21h22L12 2zm0 4.5v9l7-4.5z" />
            <path d="M12 11.5v4.5" />
            <path d="M12 17.6h.01" />
          </svg>
        </div>
        <h1 className="panel-page__titulo">Tu registro de bienestar</h1>
        <p className="panel-page__pildora">
          <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
            <ellipse cx="12" cy="5.5" rx="7" ry="2.75" />
            <path d="M5 5.5v6c0 1.52 3.13 2.75 7 2.75s7-1.23 7-2.75v-6" />
            <path d="M5 11.5v6c0 1.52 3.13 2.75 7 2.75s7-1.23 7-2.75v-6" />
          </svg>
          Guardado en este dispositivo (local)
        </p>
        <p className="panel-page__intro">
          Este es tu diario privado de actividad y sensación personal. No necesitas introducir tu nombre, datos de
          contacto ni información identificable: cada entrada se guarda solo en el navegador de este dispositivo.
        </p>
      </header>

      <div className="panel-alerta" role="note">
        <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
          <path d="M12 3.6 2.6 20h18.8L12 3.6Z" />
          <path d="M12 10v4.5" />
          <path d="M12 17.6h.01" />
        </svg>
        <div>
          <p className="panel-estado-fuerte">Recordatorio esencial de seguridad</p>
          <p>
            Si notas un aumento persistente del dolor o síntomas neurológicos (adormecimiento, pérdida de fuerza o
            mareo), suspende de inmediato la actividad y consulta a tu equipo médico.
          </p>
        </div>
      </div>

      <p className="panel-page__slot" role="status" aria-live="polite">
        {storageNotice && (
          <span className="panel-estado">
            <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5" />
              <path d="M12 7.6h.01" />
            </svg>
            <span>{storageNotice}</span>
          </span>
        )}
      </p>

      <section className="panel-page__resumen" aria-labelledby="resumen-heading">
        <h2 id="resumen-heading" className="panel-page__seccion-titulo">
          Resumen
        </h2>
        <p className="panel-page__seccion-nota">
          Un vistazo a lo que has anotado hasta ahora. Es un resumen informativo de tus propias anotaciones, no una
          evaluación de progreso ni una medida de resultado clínico.
        </p>
        <dl className="panel-metricas">
          <div className="panel-metrica panel-metrica--numero">
            <dt>Registros guardados</dt>
            <dd>{records.length}</dd>
          </div>
          <div className="panel-metrica">
            <dt>Fecha del último registro</dt>
            <dd>{latest ? formatDateLong(latest.date) : 'Sin registros'}</dd>
          </div>
          <div className="panel-metrica">
            <dt>Última actividad</dt>
            <dd>{latest ? latest.activity || 'Sin indicar' : 'Ninguna registrada'}</dd>
          </div>
        </dl>
      </section>

      <section className="app-card" aria-labelledby="entry-heading">
        <h2 id="entry-heading" tabIndex={-1}>
          {editingId ? 'Editar entrada' : 'Registrar una entrada'}
        </h2>
        <p className="app-intro">
          Anota la actividad que hayas hecho y cómo te sentiste. Todos los campos son opcionales salvo el dolor
          percibido, que debes elegir de forma consciente para poder guardar.
        </p>

        <form id="panel-form" className="panel-form" noValidate onSubmit={handleSubmit}>
          {/* Grupo: Actividad */}
          <div className="panel-form__grupo">
            <h3 className="panel-form__grupo-titulo">Actividad</h3>

            <div className="panel-form__campo">
              <label className="panel-form__etiqueta" htmlFor="entry-date">
                Fecha
              </label>
              <input
                ref={dateRef}
                type="date"
                id="entry-date"
                name="date"
                className="panel-campo"
                required
                max={today}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  clearFieldError('date');
                }}
                aria-invalid={fieldErrors.date ? true : undefined}
                aria-describedby={joinIds('date-help', fieldErrors.date && 'error-date')}
              />
              <p id="date-help" className="panel-pista">
                No se admiten fechas futuras.
              </p>
              {fieldErrors.date && (
                <p id="error-date" className="panel-error">
                  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7.5v5" />
                    <path d="M12 16h.01" />
                  </svg>
                  <span>{fieldErrors.date}</span>
                </p>
              )}
            </div>

            <div className="panel-form__campo">
              <label className="panel-form__etiqueta" htmlFor="exercise-quick-select">
                Vincular ejercicio de la biblioteca <span className="small-print">(opcional)</span>
              </label>
              <select
                id="exercise-quick-select"
                className="panel-campo"
                value={exerciseId}
                onChange={handleSelectExercise}
                aria-describedby="exercise-link-status"
              >
                <option value="">Selecciona un ejercicio de la biblioteca…</option>
                {EXERCISES_DATA.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.category === 'cuidado_postural' ? 'Postural' : 'General'})
                  </option>
                ))}
              </select>
              <p id="exercise-link-status" className="panel-pista">
                {linkStatusText}
              </p>
            </div>

            <div className="panel-form__campo panel-form__campo--ancho">
              <label className="panel-form__etiqueta" htmlFor="entry-activity">
                Actividad realizada <span className="small-print">(opcional o personalizada)</span>
              </label>
              <input
                ref={activityRef}
                type="text"
                id="entry-activity"
                name="activity"
                className="panel-campo"
                maxLength={ACTIVITY_MAX}
                autoComplete="off"
                value={activity}
                onChange={(e) => handleActivityChange(e.target.value)}
                placeholder="Ej. Sentadilla con peso corporal, caminata suave, estiramiento…"
                aria-invalid={fieldErrors.activity ? true : undefined}
                aria-describedby={joinIds('activity-help', fieldErrors.activity && 'error-activity')}
              />
              <p id="activity-help" className="panel-pista">
                Si eliges un ejercicio de la biblioteca, el nombre se rellena solo.
                <span className="panel-contador" aria-hidden="true">
                  {' '}
                  · {activity.length}/{ACTIVITY_MAX}
                </span>
              </p>
              {fieldErrors.activity && (
                <p id="error-activity" className="panel-error">
                  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7.5v5" />
                    <path d="M12 16h.01" />
                  </svg>
                  <span>{fieldErrors.activity}</span>
                </p>
              )}
            </div>
          </div>

          {/* Grupo: Sensaciones */}
          <div className="panel-form__grupo">
            <h3 className="panel-form__grupo-titulo">Sensaciones</h3>

            <div className="panel-form__campo panel-form__campo--ancho">
              <div className={painClasses} role="group" aria-labelledby="pain-label">
                <span className="panel-form__etiqueta panel-dolor__etiqueta" id="pain-label">
                  Dolor percibido, de 0 a 10
                </span>
                <div className="panel-dolor__cabecera">
                  <span className="panel-pista panel-dolor__pista">
                    Es tu percepción subjetiva del dolor, no una medición diagnóstica.
                  </span>
                  <span className={readoutClasses}>
                    {pain === null ? 'Sin indicar' : `${pain} / ${PAIN_MAX} · ${painLabel(pain)}`}
                  </span>
                </div>
                <input
                  ref={painRef}
                  type="range"
                  id="entry-pain"
                  name="pain"
                  className="panel-dolor__rango"
                  min={PAIN_MIN}
                  max={PAIN_MAX}
                  step={1}
                  required
                  value={painValue}
                  onChange={handlePainChange}
                  style={painStyle}
                  aria-required="true"
                  aria-valuemin={PAIN_MIN}
                  aria-valuemax={PAIN_MAX}
                  aria-valuenow={painValue}
                  aria-valuetext={`Dolor percibido: ${painValue} de ${PAIN_MAX}${
                    pain === null ? ', sin indicar' : `, ${painLabel(painValue)}`
                  }`}
                  aria-invalid={fieldErrors.pain ? true : undefined}
                  aria-describedby={joinIds('pain-help', fieldErrors.pain && 'error-pain')}
                />
                <div className="panel-dolor__marcas" aria-hidden="true" />
                <div className="panel-dolor__escala" aria-hidden="true">
                  <span>0 · Sin molestia</span>
                  <span>5 · Molestia moderada</span>
                  <span>10 · Dolor muy intenso</span>
                </div>
                <p id="pain-help" className="panel-pista">
                  Usa las flechas ← → del teclado, las teclas Inicio y Fin, o desliza el control. Elige un valor aunque
                  sea 0: el 0 significa “sin molestia” y es una respuesta válida.
                </p>
                {fieldErrors.pain && (
                  <p id="error-pain" className="panel-error">
                    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7.5v5" />
                      <path d="M12 16h.01" />
                    </svg>
                    <span>{fieldErrors.pain}</span>
                  </p>
                )}
              </div>

              {showPainAlert && (
                <div className="panel-alerta" role="note" aria-live="polite">
                  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                    <path d="M12 3.6 2.6 20h18.8L12 3.6Z" />
                    <path d="M12 10v4.5" />
                    <path d="M12 17.6h.01" />
                  </svg>
                  <div>
                    <p className="panel-estado-fuerte">Aviso de precaución</p>
                    <p>
                      Ante dolor intenso, persistente, que empeora o que se acompaña de síntomas neurológicos
                      (hormigueo, debilidad o pérdida de sensibilidad), detén la actividad y consulta a un profesional
                      sanitario.
                    </p>
                    <p>El dolor que registras es una percepción subjetiva y no sustituye una valoración médica.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grupo: Nota personal */}
          <div className="panel-form__grupo">
            <h3 className="panel-form__grupo-titulo">Nota personal</h3>

            <div className="panel-form__campo panel-form__campo--ancho">
              <label className="panel-form__etiqueta" htmlFor="entry-note">
                Nota de bienestar <span className="small-print">(opcional, sensaciones o evolución)</span>
              </label>
              <textarea
                ref={noteRef}
                id="entry-note"
                name="note"
                className="panel-campo panel-campo--area"
                maxLength={NOTE_MAX}
                rows={3}
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  clearFieldError('note');
                }}
                placeholder="¿Cómo te sentiste durante o después de moverte?"
                aria-invalid={fieldErrors.note ? true : undefined}
                aria-describedby={joinIds('note-help', fieldErrors.note && 'error-note')}
              ></textarea>
              <p id="note-help" className="panel-pista">
                Sensaciones, evolución o contexto que quieras recordar.
                <span className="panel-contador" aria-hidden="true">
                  {' '}
                  · {note.length}/{NOTE_MAX}
                </span>
              </p>
              {fieldErrors.note && (
                <p id="error-note" className="panel-error">
                  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7.5v5" />
                    <path d="M12 16h.01" />
                  </svg>
                  <span>{fieldErrors.note}</span>
                </p>
              )}
            </div>

            <p className="small-print" id="entry-consent-note">
              La aceptación de los documentos se confirmó al entrar en el panel y se guarda solo en
              este dispositivo. Puedes consultarla o retirarla en{' '}
              <a href="#privacy-heading">Privacidad y borrado</a>, más abajo en esta misma página.
            </p>
          </div>

          <div className="panel-form__acciones">
            <button type="submit" id="save-entry" className="btn panel-boton">
              {editingId ? 'Guardar cambios' : 'Guardar entrada'}
            </button>
            {editingId && (
              <button type="button" id="cancel-edit" className="btn secondary panel-boton" onClick={cancelEdit}>
                Cancelar edición
              </button>
            )}
          </div>

          <p className="panel-page__slot panel-form__error-slot" role="alert">
            {formError && (
              <span className="panel-estado panel-estado--error">
                <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7.5v5" />
                  <path d="M12 16h.01" />
                </svg>
                <span>{formError}</span>
              </span>
            )}
          </p>
        </form>

        <p className="panel-page__slot" role="status" aria-live="polite">
          {statusMessage && (
            <span className="panel-estado">
              <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                <circle cx="12" cy="12" r="9" />
                <path d="m8.2 12.4 2.6 2.6 5-5.6" />
              </svg>
              <span className="panel-estado-fuerte">{statusMessage}</span>
            </span>
          )}
        </p>
      </section>

      <section className="app-card" aria-labelledby="history-heading">
        <h2 id="history-heading" tabIndex={-1}>
          Historial de actividad y bienestar
        </h2>

        {recordToDelete && (
          <div
            className="panel-confirmacion"
            role="alertdialog"
            aria-labelledby="record-delete-heading"
            aria-describedby="record-delete-body"
            tabIndex={-1}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.stopPropagation();
                handleCancelDelete();
              }
            }}
          >
            <h3 id="record-delete-heading">¿Confirmas la eliminación de esta entrada?</h3>
            <p id="record-delete-body">
              Se eliminará el registro del {formatDate(recordToDelete.date)}
              {recordToDelete.activity ? ` (${recordToDelete.activity})` : ''}. Esta acción no se puede deshacer.
            </p>
            <div className="panel-confirmacion__acciones">
              <button
                type="button"
                className="panel-peligro panel-boton"
                onClick={handleConfirmDelete}
              >
                Sí, eliminar entrada
              </button>
              <button
                type="button"
                className="btn secondary panel-boton"
                onClick={handleCancelDelete}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {sortedRecords.length > 0 && (
          <div className="panel-filtros">
            <fieldset className="panel-filtros__grupo">
              <legend className="panel-filtros__leyenda">Mostrar</legend>
              <div className="panel-filtros__opciones">
                {RANGE_OPTIONS.map((option) => (
                  <label className="panel-chip" key={option.value}>
                    <input
                      type="radio"
                      name="panel-range"
                      value={option.value}
                      checked={range === option.value}
                      onChange={() => setRange(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="panel-busqueda">
              <label htmlFor="panel-search">Buscar por actividad</label>
              <input
                type="search"
                id="panel-search"
                className="panel-campo"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Escribe parte del nombre de la actividad"
                aria-describedby="panel-search-help"
              />
              <p id="panel-search-help" className="panel-pista">
                El filtrado solo cambia lo que ves aquí: no modifica ni borra los registros guardados.
              </p>
            </div>
          </div>
        )}

        <p className="panel-resultados" role="status" aria-live="polite">
          {sortedRecords.length > 0 &&
            `Mostrando ${filteredRecords.length} de ${sortedRecords.length} ${
              sortedRecords.length === 1 ? 'registro' : 'registros'
            }.`}
        </p>

        {sortedRecords.length === 0 ? (
          <div className="panel-vacio">
            <svg aria-hidden="true" viewBox="0 0 64 64" focusable="false">
              <path d="M14 8h24a8 8 0 0 1 8 8v40H22a8 8 0 0 1-8-8V8Z" />
              <path d="M38 8v10h8" />
              <path d="M22 30h16M22 38h16M22 46h10" />
              <path d="M46 20h8a6 6 0 0 1 6 6v22a6 6 0 0 1-6 6h-4" />
            </svg>
            <p>
              Tu historial está vacío. Cuando quieras, registra tu primera entrada: con una fecha, la actividad que
              hayas hecho y cómo te has sentido. Todo se quedará aquí, en este dispositivo.
            </p>
            <a className="card-link" href="#panel-form">
              Ir al formulario
            </a>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="panel-vacio">
            <svg aria-hidden="true" viewBox="0 0 64 64" focusable="false">
              <circle cx="27" cy="27" r="16" />
              <path d="M39 39 52 52" />
            </svg>
            <p>
              Ningún registro coincide con estos filtros. Prueba con otras fechas o borra la búsqueda para volver a ver
              todo tu historial.
            </p>
            <button
              type="button"
              className="btn secondary panel-boton"
              onClick={() => {
                setRange('todos');
                setSearch('');
              }}
            >
              Quitar filtros
            </button>
          </div>
        ) : isWide ? (
          <table className="panel-tabla" id="history-table">
            <caption className="sr-only">
              Registros de actividad, dolor subjetivo y bienestar, del más reciente al más antiguo
            </caption>
            <thead>
              <tr>
                <th scope="col">Fecha</th>
                <th scope="col">Actividad</th>
                <th scope="col">Dolor percibido</th>
                <th scope="col">Bienestar / Notas</th>
                <th scope="col">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody id="history-body">
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td className="panel-tabla__fecha">
                    <time dateTime={record.date}>{formatDate(record.date)}</time>
                  </td>
                  <td className="panel-tabla__actividad">{record.activity || 'No indicada'}</td>
                  <td>
                    <span className={`panel-dolor-chip panel-dolor-chip--${painTone(record.pain)}`}>
                      {record.pain} / {PAIN_MAX} · {painLabel(record.pain)}
                    </span>
                  </td>
                  <td>{record.note || 'Sin nota'}</td>
                  <td className="panel-tabla__acciones">
                    <div className="panel-acciones">
                      <button
                        type="button"
                        className="btn secondary panel-boton"
                        onClick={() => handleStartEdit(record)}
                      >
                        Editar
                        <span className="sr-only">
                          {' '}
                          el registro del {formatDate(record.date)}
                          {record.activity ? `: ${record.activity}` : ''}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn secondary panel-boton panel-boton--peligro"
                        onClick={() => handleRequestDelete(record)}
                      >
                        Eliminar
                        <span className="sr-only">
                          {' '}
                          el registro del {formatDate(record.date)}
                          {record.activity ? `: ${record.activity}` : ''}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <ul className="panel-tarjetas" id="history-cards">
            {filteredRecords.map((record) => (
              <li className="panel-tarjeta" key={record.id}>
                <div className="panel-tarjeta__cabecera">
                  <time className="panel-tarjeta__fecha" dateTime={record.date}>
                    {formatDateLong(record.date)}
                  </time>
                  <span className={`panel-dolor-chip panel-dolor-chip--${painTone(record.pain)}`}>
                    {record.pain} / {PAIN_MAX} · {painLabel(record.pain)}
                  </span>
                </div>
                <p className="panel-tarjeta__actividad">{record.activity || 'Actividad no indicada'}</p>
                <p className="panel-tarjeta__nota">
                  <strong>Nota:</strong> {record.note || 'Sin nota'}
                </p>
                <div className="panel-acciones panel-tarjeta__acciones">
                  <button
                    type="button"
                    className="btn secondary panel-boton"
                    onClick={() => handleStartEdit(record)}
                  >
                    Editar
                    <span className="sr-only"> el registro del {formatDateLong(record.date)}</span>
                  </button>
                  <button
                    type="button"
                    className="btn secondary panel-boton panel-boton--peligro"
                    onClick={() => handleRequestDelete(record)}
                  >
                    Eliminar
                    <span className="sr-only"> el registro del {formatDateLong(record.date)}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="app-card panel-privacidad" aria-labelledby="privacy-heading">
        <h2 id="privacy-heading">Privacidad y borrado</h2>
        <div className="panel-privacidad__grupo">
          <p>
            Los registros permanecen en este navegador y en este dispositivo, en el almacenamiento local del navegador
            (<code>localStorage</code>). FitCasa no los envía a ningún servidor, no existe una cuenta asociada y esta
            herramienta no cifra ese almacenamiento. Si borras los datos del navegador, usas el modo privado o
            compartes el dispositivo, tus entradas pueden desaparecer o quedar accesibles para otras personas.
          </p>
        </div>
        <div className="panel-privacidad__grupo">
          <p className="small-print">
            FitCasa no ofrece exportar tus registros: no hay función de descarga ni copia de seguridad en ningún
            servidor. <a href="#privacidad">Lee la Política de Privacidad</a> para el detalle completo, y{' '}
            <a href="#terminos">los Términos y Condiciones</a> para las condiciones de uso y el tratamiento de tus
            datos de bienestar según la Ley 1581 de 2012.
          </p>
        </div>

        <p className="small-print" id="consent-status">
          {consent ? (
            <>
              <strong>Aceptación registrada localmente.</strong> Términos de Uso (versión{' '}
              {consent.terms.docVersion}), Política de Privacidad (versión {consent.privacy.docVersion}) y
              autorización sobre tus datos de salud (versión {consent.health.docVersion}), el{' '}
              <time dateTime={consent.terms.at}>
                {formatDateLong(consent.terms.at.slice(0, 10))}
              </time>
              , a las{' '}
              {new Date(consent.terms.at).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
              . No se guarda nada más de esta decisión y no se envía a ningún servidor.
            </>
          ) : (
            <>
              <strong>No hay aceptación registrada.</strong> Para volver a usar el panel y el
              cuestionario tendrás que confirmarla de nuevo.
            </>
          )}
        </p>

        {consent && (
          <>
            <div className="panel-privacidad__grupo">
              <p className="small-print">
                Este registro vive en el almacenamiento local de tu navegador, que no está cifrado y
                que puedes editar o borrar por tu cuenta. Acredita una trazabilidad personal, no es
                un documento firmado ni una garantía de cumplimiento legal.
              </p>
              <p className="small-print">
                <button
                  type="button"
                  id="reset-consent"
                  className="btn secondary panel-boton panel-boton--peligro"
                  onClick={handleWithdrawConsent}
                >
                  Retirar mi aceptación
                </button>
              </p>
              <p className="small-print">
                Retirarla cierra el acceso al panel y al cuestionario, pero{' '}
                <strong>no borra</strong> los registros ni las respuestas que ya habías guardado.
              </p>
            </div>
            <div className="panel-privacidad__grupo">
              <p className="small-print" id="consent-version-warning">
                Versiones vigentes: {DOC_VERSIONS.terminos} (Términos y autorización) y{' '}
                {DOC_VERSIONS.privacidad} (Privacidad). Si cambian, FitCasa volverá a pedírtelas al
                entrar.
              </p>
            </div>
          </>
        )}

        <p className="panel-page__slot" role="status" aria-live="polite">
          {consentResetStatus && (
            <span className="panel-estado">
              <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                <circle cx="12" cy="12" r="9" />
                <path d="m8.2 12.4 2.6 2.6 5-5.6" />
              </svg>
              <span>{consentResetStatus}</span>
            </span>
          )}
        </p>

        {!confirmClear ? (
          <button
            type="button"
            id="clear-data"
            ref={clearTriggerRef}
            className="btn secondary panel-boton"
            onClick={() => setConfirmClear(true)}
          >
            Borrar respuestas y registros guardados
          </button>
        ) : (
          <div
            className="panel-confirmacion"
            role="alertdialog"
            aria-labelledby="clear-confirm-heading"
            aria-describedby="clear-confirm-body"
            tabIndex={-1}
            ref={confirmRef}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.stopPropagation();
                cancelClear();
              }
            }}
          >
            <h3 id="clear-confirm-heading">¿Confirmas el borrado?</h3>
            <p id="clear-confirm-body">
              Esto borrará todo tu historial de actividad y las respuestas guardadas en este dispositivo. No se puede
              deshacer y no existe ninguna copia en un servidor. También se retira tu aceptación de los documentos
              legales, así que esta pantalla volverá a pedirla antes de dejarte usar el panel o el cuestionario.
            </p>
            <div className="panel-confirmacion__acciones">
              <button type="button" className="panel-peligro panel-boton" onClick={handleClearAll}>
                Sí, borrar todo
              </button>
              <button type="button" className="btn secondary panel-boton" onClick={cancelClear}>
                Cancelar y conservar mis datos
              </button>
            </div>
          </div>
        )}

        <p className="panel-page__slot" role="status" aria-live="polite">
          {clearStatus && (
            <span className="panel-estado">
              <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                <circle cx="12" cy="12" r="9" />
                <path d="m8.2 12.4 2.6 2.6 5-5.6" />
              </svg>
              <span>{clearStatus}</span>
            </span>
          )}
        </p>
      </section>
    </main>
  );
};
export default PanelPage;
