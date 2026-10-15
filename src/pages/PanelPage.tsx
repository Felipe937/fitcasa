import React, { useState, useEffect } from 'react';
import { PanelRecord } from '../types';
import { EXERCISES_DATA } from '../data/exercisesData';
import {
  readStorage,
  writeStorage,
  removeAllStorage,
  STORAGE_KEYS,
  PANEL_STORAGE_VERSION,
} from '../utils/storage';

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

function normalizeRecord(item: unknown): PanelRecord | null {
  if (!item || typeof item !== 'object') return null;
  const it = item as Partial<PanelRecord>;
  if (typeof it.id !== 'string' || !isValidDate(it.date || '')) return null;
  const pain = Number(it.pain);
  if (!Number.isInteger(pain) || pain < 0 || pain > 10) return null;
  const activity = typeof it.activity === 'string' ? it.activity.trim().slice(0, 120) : '';
  const note = typeof it.note === 'string' ? it.note.trim().slice(0, 500) : '';
  const exerciseId = typeof it.exerciseId === 'string' ? it.exerciseId : undefined;
  return { id: it.id.slice(0, 80), date: it.date!, activity, pain, note, exerciseId };
}

function normalizeRecords(data: unknown): PanelRecord[] {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeRecord).filter((r): r is PanelRecord => r !== null).slice(0, 1000);
}

export const PanelPage: React.FC = () => {
  const today = localDateString(new Date());

  const [records, setRecords] = useState<PanelRecord[]>([]);
  const [date, setDate] = useState<string>(today);
  const [activity, setActivity] = useState<string>('');
  const [pain, setPain] = useState<string>('0');
  const [note, setNote] = useState<string>('');
  const [exerciseId, setExerciseId] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>('');
  const [storageNotice, setStorageNotice] = useState<string>('');
  const [clearStatus, setClearStatus] = useState<string>('');

  // Load records on mount
  useEffect(() => {
    const res = readStorage<PanelRecord[]>(
      STORAGE_KEYS.panel,
      PANEL_STORAGE_VERSION,
      normalizeRecords
    );

    if (!res.available) {
      setStorageNotice(
        'La persistencia no está disponible en este navegador. Puedes usar el panel durante esta sesión.'
      );
    } else if (res.reason === 'corrupt' || res.reason === 'unknown-version') {
      setStorageNotice(
        'No se pudo recuperar el historial guardado. Puedes continuar y guardarlo de nuevo.'
      );
    }

    if (res.value) {
      setRecords(res.value);
    }
  }, []);

  const saveUpdatedRecords = (newRecords: PanelRecord[]) => {
    setRecords(newRecords);
    const writeRes = writeStorage(STORAGE_KEYS.panel, PANEL_STORAGE_VERSION, newRecords);
    if (!writeRes.saved) {
      setStorageNotice(
        'La persistencia no está disponible. El panel seguirá funcionando durante esta sesión, pero no conservará los cambios al recargar.'
      );
    }
  };

  const resetForm = () => {
    setDate(today);
    setActivity('');
    setPain('0');
    setNote('');
    setExerciseId('');
    setEditingId(null);
    setFieldErrors({});
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!isValidDate(date) || date > today) {
      errors.date = 'Selecciona una fecha válida que no sea futura.';
    }

    if (activity.length > 120) {
      errors.activity = 'La actividad debe tener 120 caracteres o menos.';
    }

    const painNum = Number(pain);
    if (!Number.isInteger(painNum) || painNum < 0 || painNum > 10) {
      errors.pain = 'Indica un número entero entre 0 y 10.';
    }

    if (note.length > 500) {
      errors.note = 'La nota debe tener 500 caracteres o menos.';
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setFormError('Revisa los campos señalados antes de guardar.');
      return;
    }
    setFormError('');

    if (editingId) {
      const updated = records.map((rec) =>
        rec.id === editingId
          ? {
              id: editingId,
              date,
              activity: activity.trim(),
              pain: painNum,
              note: note.trim(),
              exerciseId: exerciseId || undefined,
            }
          : rec
      );
      saveUpdatedRecords(updated);
    } else {
      const newId =
        window.crypto && typeof window.crypto.randomUUID === 'function'
          ? window.crypto.randomUUID()
          : `record-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

      const newRec: PanelRecord = {
        id: newId,
        date,
        activity: activity.trim(),
        pain: painNum,
        note: note.trim(),
        exerciseId: exerciseId || undefined,
      };
      saveUpdatedRecords([...records, newRec]);
    }

    resetForm();
  };

  const handleStartEdit = (record: PanelRecord) => {
    setEditingId(record.id);
    setDate(record.date);
    setActivity(record.activity);
    setPain(String(record.pain));
    setNote(record.note);
    setExerciseId(record.exerciseId || '');
    setFieldErrors({});
    setFormError('');

    const entryHeading = document.getElementById('entry-heading');
    if (entryHeading) entryHeading.focus();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('¿Eliminar esta entrada del historial?')) return;
    const filtered = records.filter((rec) => rec.id !== id);
    saveUpdatedRecords(filtered);
    if (editingId === id) {
      resetForm();
    }
  };

  const handleClearAll = () => {
    if (!window.confirm('¿Borrar las respuestas y todos los registros guardados en este navegador?')) return;
    const res = removeAllStorage();
    setRecords([]);
    resetForm();
    setClearStatus(
      res.removed
        ? 'Se borraron las respuestas y los registros guardados.'
        : 'No fue posible borrar los datos guardados.'
    );
  };

  const handleSelectExercise = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setExerciseId(selectedId);
    if (selectedId) {
      const found = EXERCISES_DATA.find((ex) => ex.id === selectedId);
      if (found) {
        setActivity(found.name);
      }
    }
  };

  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  return (
    <main id="contenido" tabIndex={-1} className="container app-main">
      <h1 className="texto-3xl">Panel de seguimiento</h1>
      <p className="app-intro">
        Registra voluntariamente cómo te sentiste. No necesitas introducir tu nombre, datos de contacto ni información identificable.
      </p>

      {/* Recordatorio de Seguridad de Salud */}
      <div className="notice warning" role="note">
        <strong>Recordatorio esencial de seguridad:</strong> Si notas aumento persistente del dolor o síntomas neurológicos (adormecimiento, pérdida de fuerza o mareo), suspende de inmediato la actividad y consulta a tu equipo médico.
      </div>

      {storageNotice && (
        <div id="storage-notice" className="notice warning" role="status">
          {storageNotice}
        </div>
      )}

      {/* Formulario de registro */}
      <section className="app-card" aria-labelledby="entry-heading">
        <h2 id="entry-heading" tabIndex={-1}>
          {editingId ? 'Editar entrada' : 'Registrar una entrada'}
        </h2>

        <form id="panel-form" noValidate onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="entry-date">Fecha</label>
            <input
              type="date"
              id="entry-date"
              name="date"
              required
              max={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-describedby={fieldErrors.date ? 'error-date' : undefined}
            />
            {fieldErrors.date && (
              <p id="error-date" className="field-error">
                {fieldErrors.date}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="exercise-quick-select">
              Vincular ejercicio de la biblioteca <span className="small-print">(opcional)</span>
            </label>
            <select
              id="exercise-quick-select"
              value={exerciseId}
              onChange={handleSelectExercise}
              className="w-full min-h-[var(--alto-objetivo-tactil)] p-2 rounded-[var(--radio-sm)] border border-[var(--color-borde)] bg-[var(--color-superficie)]"
            >
              <option value="">Selecciona un ejercicio de la biblioteca...</option>
              {EXERCISES_DATA.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.category === 'cuidado_postural' ? 'Postural' : 'General'})
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="entry-activity">
              Actividad realizada <span className="small-print">(opcional o personalizada)</span>
            </label>
            <input
              type="text"
              id="entry-activity"
              name="activity"
              maxLength={120}
              autoComplete="off"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Ej. Sentadilla con peso corporal, caminata suave, estiramiento..."
              aria-describedby={fieldErrors.activity ? 'error-activity' : undefined}
            />
            {fieldErrors.activity && (
              <p id="error-activity" className="field-error">
                {fieldErrors.activity}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="entry-pain">Percepción subjetiva del dolor, de 0 a 10</label>
            <input
              type="number"
              id="entry-pain"
              name="pain"
              min={0}
              max={10}
              step={1}
              required
              inputMode="numeric"
              value={pain}
              onChange={(e) => setPain(e.target.value)}
              aria-describedby="pain-help error-pain"
            />
            <p id="pain-help" className="small-print">
              0 significa “sin dolor percibido” y 10 significa “el máximo dolor percibido”. No es una medición diagnóstica.
            </p>
            {fieldErrors.pain && (
              <p id="error-pain" className="field-error">
                {fieldErrors.pain}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="entry-note">
              Nota de bienestar <span className="small-print">(opcional, sensaciones o evolución)</span>
            </label>
            <textarea
              id="entry-note"
              name="note"
              maxLength={500}
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="¿Cómo te sentiste durante o después de moverte?"
              aria-describedby={fieldErrors.note ? 'error-note' : undefined}
            ></textarea>
            {fieldErrors.note && (
              <p id="error-note" className="field-error">
                {fieldErrors.note}
              </p>
            )}
          </div>

          <div className="panel-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
            <button type="submit" id="save-entry" className="btn">
              {editingId ? 'Guardar cambios' : 'Guardar entrada'}
            </button>
            {editingId && (
              <button
                type="button"
                id="cancel-edit"
                className="btn secondary"
                onClick={resetForm}
              >
                Cancelar edición
              </button>
            )}
          </div>

          {formError && (
            <div id="panel-error" className="error-box" role="alert">
              {formError}
            </div>
          )}
        </form>
      </section>

      {/* Historial */}
      <section className="app-card" aria-labelledby="history-heading">
        <h2 id="history-heading" tabIndex={-1}>
          Historial de actividad y bienestar
        </h2>

        {sortedRecords.length === 0 ? (
          <p id="empty-history" className="status-box" role="status">
            Todavía no hay registros. Completa una sesión o ejercicio para comenzar tu seguimiento.
          </p>
        ) : (
          <div id="history-table-container" className="table-wrapper overflow-x-auto">
            <table className="data-table w-full">
              <caption className="sr-only">
                Registros cronológicos de actividad, dolor subjetivo y bienestar
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
                {sortedRecords.map((record) => {
                  const painScore = record.pain;
                  const painBadgeColor =
                    painScore <= 3
                      ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                      : painScore <= 6
                      ? 'text-amber-800 bg-amber-50 border-amber-200'
                      : 'text-red-800 bg-red-50 border-red-200';

                  return (
                    <tr key={record.id}>
                      <td className="whitespace-nowrap font-medium">{formatDate(record.date)}</td>
                      <td>
                        <span className="font-semibold">{record.activity || 'No indicada'}</span>
                      </td>
                      <td>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${painBadgeColor}`}>
                          {record.pain} / 10
                        </span>
                      </td>
                      <td>{record.note || 'Sin nota'}</td>
                      <td className="record-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.875rem' }}
                          onClick={() => handleStartEdit(record)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn secondary"
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.875rem',
                            color: 'var(--color-peligro)',
                          }}
                          onClick={() => handleDelete(record.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Privacidad y borrado */}
      <section className="app-card" aria-labelledby="privacy-heading">
        <h2 id="privacy-heading">Privacidad y borrado</h2>
        <p>
          Los registros permanecen en este navegador y dispositivo, salvo que los borres o cambien las condiciones de almacenamiento. Otros usuarios del mismo dispositivo podrían acceder a ellos. FitCasa no envía estos registros a servidores ni afirma que <code>localStorage</code> los cifre.
        </p>
        <button
          type="button"
          id="clear-data"
          className="btn secondary"
          onClick={handleClearAll}
        >
          Borrar respuestas y registros guardados
        </button>
        {clearStatus && (
          <p id="clear-status" role="status" className="small-print mt-2">
            {clearStatus}
          </p>
        )}
      </section>
    </main>
  );
};
