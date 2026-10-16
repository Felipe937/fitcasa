import React, { useState, useEffect } from 'react';
import { EXERCISES_DATA } from '../data/exercisesData';
import {
  QuizAnswers,
  QuizResult,
  Equipment,
  QuizObjective,
  QuizDays,
  QuizTime,
  QuizLevel,
  SafetyAnswer,
  ScoliosisContextOption,
} from '../types';
import { generateSuggestions, normalizeAnswers } from '../utils/quizEngine';
import {
  readStorage,
  writeStorage,
  removeAllStorage,
  STORAGE_KEYS,
  QUIZ_STORAGE_VERSION,
} from '../utils/storage';

export const QuizPage: React.FC<{ onStorageCleared?: () => void }> = ({
  onStorageCleared,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [objective, setObjective] = useState<QuizObjective | ''>('');
  const [days, setDays] = useState<QuizDays | ''>('');
  const [time, setTime] = useState<QuizTime | ''>('');
  const [level, setLevel] = useState<QuizLevel | ''>('');
  const [equipment, setEquipment] = useState<Equipment[]>(['ninguno']);
  const [scoliosisContext, setScoliosisContext] = useState<ScoliosisContextOption>('no_sabe');

  const [surgeryNoAuth, setSurgeryNoAuth] = useState<SafetyAnswer | ''>('');
  const [clinicalRestriction, setClinicalRestriction] = useState<SafetyAnswer | ''>('');
  const [concerningSymptoms, setConcerningSymptoms] = useState<SafetyAnswer | ''>('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [stepError, setStepError] = useState<string>('');
  const [storageNotice, setStorageNotice] = useState<{ message: string; type: 'warning' | 'info' } | null>(null);
  const [clearStatus, setClearStatus] = useState<string>('');

  const [results, setResults] = useState<QuizResult | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Restore saved quiz answers
  useEffect(() => {
    const res = readStorage<QuizAnswers>(
      STORAGE_KEYS.quiz,
      QUIZ_STORAGE_VERSION,
      normalizeAnswers
    );

    if (!res.available) {
      setStorageNotice({
        message: 'La persistencia no está disponible en este navegador. Puedes usar el cuestionario durante esta sesión.',
        type: 'warning',
      });
    } else if (res.reason === 'corrupt' || res.reason === 'unknown-version') {
      setStorageNotice({
        message: 'No se pudieron recuperar las respuestas guardadas. Puedes continuar y guardarlas de nuevo.',
        type: 'warning',
      });
    } else if (res.value) {
      const val = res.value;
      setObjective(val.objective);
      setDays(val.days);
      setTime(val.time);
      setLevel(val.level);
      setEquipment(val.equipment);
      setSurgeryNoAuth(val.surgeryNoAuthorization);
      setClinicalRestriction(val.clinicalRestriction);
      setConcerningSymptoms(val.concerningSymptoms);
      if (val.scoliosisContext) {
        setScoliosisContext(val.scoliosisContext);
      }
    }
  }, []);

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!objective) errors.objective = 'Selecciona una opción para continuar.';
    if (!days) errors.days = 'Selecciona una opción para continuar.';
    if (!time) errors.time = 'Selecciona una opción para continuar.';
    if (!level) errors.level = 'Selecciona una opción para continuar.';
    if (!equipment.length) errors.equipment = 'Selecciona al menos una opción.';

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStepError('Revisa los campos señalados antes de continuar.');
      return false;
    }
    setStepError('');
    return true;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!surgeryNoAuth) errors.surgeryNoAuthorization = 'Selecciona Sí o No para continuar.';
    if (!clinicalRestriction) errors.clinicalRestriction = 'Selecciona Sí o No para continuar.';
    if (!concerningSymptoms) errors.concerningSymptoms = 'Selecciona Sí o No para continuar.';

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStepError('Revisa los campos señalados antes de continuar.');
      return false;
    }
    setStepError('');
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }
  };

  const handleBack = () => {
    setStepError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) return;

    const answers: QuizAnswers = {
      objective: objective as QuizObjective,
      days: days as QuizDays,
      time: time as QuizTime,
      level: level as QuizLevel,
      equipment,
      surgeryNoAuthorization: surgeryNoAuth as SafetyAnswer,
      clinicalRestriction: clinicalRestriction as SafetyAnswer,
      concerningSymptoms: concerningSymptoms as SafetyAnswer,
      scoliosisContext,
    };

    const saved = writeStorage(STORAGE_KEYS.quiz, QUIZ_STORAGE_VERSION, answers);
    if (!saved.saved) {
      setStorageNotice({
        message: 'La persistencia no está disponible. Las respuestas solo se conservarán durante esta sesión.',
        type: 'warning',
      });
    }

    const output = generateSuggestions(answers, EXERCISES_DATA);
    setResults(output);
  };

  const handleClearData = () => {
    if (!window.confirm('¿Borrar las respuestas y todos los registros guardados en este navegador?')) return;
    const res = removeAllStorage();
    // Borrar los datos del sitio incluye la aceptación: hay que avisar a la
    // capa superior para que vuelva a proteger estas rutas.
    onStorageCleared?.();
    if (res.removed) {
      setObjective('');
      setDays('');
      setTime('');
      setLevel('');
      setEquipment(['ninguno']);
      setScoliosisContext('no_sabe');
      setSurgeryNoAuth('');
      setClinicalRestriction('');
      setConcerningSymptoms('');
      setResults(null);
      setCurrentStep(1);
      setClearStatus('Se borraron las respuestas y los registros guardados.');
    } else {
      setClearStatus('No fue posible borrar los datos guardados.');
    }
  };

  const handleAdjustProposal = () => {
    setResults(null);
    setCurrentStep(1);
    const stepOneEl = document.getElementById('step-one-heading');
    if (stepOneEl) stepOneEl.focus();
  };

  const handlePrintClinicalSummary = () => {
    window.print();
  };

  const objectiveLabels: Record<QuizObjective, string> = {
    movilidad: 'Movilidad suave',
    fuerza: 'Fuerza y estabilidad',
    bienestar: 'Actividad general y bienestar',
  };

  const timeLabels: Record<QuizTime, string> = {
    '10': 'Hasta 10 minutos',
    '20': 'Entre 10 y 20 minutos',
    '30': 'Más de 20 minutos',
  };

  const levelLabels: Record<QuizLevel, string> = {
    principiante: 'Principiante',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado',
  };

  const equipmentLabels: Record<Equipment, string> = {
    ninguno: 'Ninguno',
    bandas: 'Bandas elásticas',
    peso: 'Pesas o mancuernas',
    colchoneta: 'Colchoneta',
  };

  const scoliosisLabels: Record<ScoliosisContextOption, string> = {
    ninguna: 'No tengo escoliosis / No aplica',
    leve_desconocido: 'Curva leve o no conozco los grados (<20° o sin medir)',
    moderada: 'Curva moderada (entre 20° y 45°)',
    severa: 'Curva mayor o severa (>45°) o en seguimiento quirúrgico',
    no_sabe: 'No lo sé con certeza / Prefiero no indicar',
  };

  const stepTitles = ['actividad disponible', 'preguntas de seguridad', 'revisar y generar'];

  return (
    <main id="contenido" tabIndex={-1} className="container app-main">
      <h1 className="texto-3xl">Sugerencias de actividad</h1>
      <p className="app-intro">
        Responde unas preguntas generales para organizar una propuesta educativa a partir de la biblioteca disponible.
      </p>

      <div className="notice warning" role="note">
        <strong>Importante:</strong> la propuesta no es un diagnóstico, tratamiento ni prescripción médica. Una etiqueta de la biblioteca no equivale a autorización clínica individual.
      </div>

      {storageNotice && (
        <div className={`notice ${storageNotice.type}`} role="status">
          {storageNotice.message}
        </div>
      )}

      {/* Stepper Visual */}
      <nav aria-label="Progreso del cuestionario" className="my-6">
        <ol className="grid grid-cols-3 gap-2 list-none p-0 m-0">
          {[
            { num: 1, label: 'Actividad' },
            { num: 2, label: 'Seguridad' },
            { num: 3, label: 'Revisión' },
          ].map((s) => {
            const isCurrent = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <li
                key={s.num}
                className="p-3 text-center rounded-[var(--radio-sm)] border text-sm font-semibold transition-colors"
                style={{
                  borderColor: isCurrent ? 'var(--color-primario)' : 'var(--color-borde)',
                  backgroundColor: isCurrent
                    ? 'var(--color-fondo-azul)'
                    : isCompleted
                    ? 'var(--color-fondo-verde)'
                    : 'var(--color-superficie)',
                  color: isCurrent
                    ? 'var(--color-primario-oscuro)'
                    : isCompleted
                    ? 'var(--color-secundario-oscuro)'
                    : 'var(--color-texto-suave)',
                }}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span>
                  {isCompleted ? '✓ ' : `${s.num}. `}
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>

      <section className="app-card" aria-labelledby="quiz-heading">
        <h2 id="quiz-heading">Cuestionario</h2>

        <p id="quiz-progress-text" className="progress-text" aria-live="polite">
          Paso {currentStep} de 3: {stepTitles[currentStep - 1]}.
        </p>

        <div
          className="progress-track"
          role="progressbar"
          aria-labelledby="quiz-progress-text"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={currentStep}
        >
          <span
            id="quiz-progress-value"
            className="progress-value"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></span>
        </div>

        <form id="quiz-form" noValidate onSubmit={handleGenerate}>
          {/* Paso 1: Preferencias de actividad y contexto opcional */}
          {currentStep === 1 && (
            <section className="step-panel" data-step="1">
              <h3 id="step-one-heading" tabIndex={-1}>
                Paso 1 de 3: actividad disponible
              </h3>

              <fieldset aria-describedby={fieldErrors.objective ? 'error-objective' : undefined}>
                <legend>¿Cuál es tu objetivo general de actividad?</legend>
                <div className="choice-grid">
                  {(['movilidad', 'fuerza', 'bienestar'] as QuizObjective[]).map((val) => (
                    <label key={val} className="cursor-pointer">
                      <input
                        type="radio"
                        name="objective"
                        value={val}
                        checked={objective === val}
                        onChange={() => {
                          setObjective(val);
                          setFieldErrors((prev) => ({ ...prev, objective: '' }));
                        }}
                      />{' '}
                      {objectiveLabels[val]}
                    </label>
                  ))}
                </div>
                {fieldErrors.objective && (
                  <p id="error-objective" className="field-error">
                    {fieldErrors.objective}
                  </p>
                )}
              </fieldset>

              <fieldset aria-describedby={fieldErrors.days ? 'error-days' : undefined}>
                <legend>¿Cuántos días por semana tienes disponibles?</legend>
                <div className="choice-grid">
                  {(['1', '2', '3', '4', '5', '6', '7'] as QuizDays[]).map((num) => (
                    <label key={num} className="cursor-pointer">
                      <input
                        type="radio"
                        name="days"
                        value={num}
                        checked={days === num}
                        onChange={() => {
                          setDays(num);
                          setFieldErrors((prev) => ({ ...prev, days: '' }));
                        }}
                      />{' '}
                      {num} día{num !== '1' ? 's' : ''}
                    </label>
                  ))}
                </div>
                {fieldErrors.days && (
                  <p id="error-days" className="field-error">
                    {fieldErrors.days}
                  </p>
                )}
              </fieldset>

              <fieldset aria-describedby={fieldErrors.time ? 'error-time' : undefined}>
                <legend>¿Cuánto tiempo tienes por sesión?</legend>
                <div className="choice-grid">
                  {(['10', '20', '30'] as QuizTime[]).map((t) => (
                    <label key={t} className="cursor-pointer">
                      <input
                        type="radio"
                        name="time"
                        value={t}
                        checked={time === t}
                        onChange={() => {
                          setTime(t);
                          setFieldErrors((prev) => ({ ...prev, time: '' }));
                        }}
                      />{' '}
                      {timeLabels[t]}
                    </label>
                  ))}
                </div>
                {fieldErrors.time && (
                  <p id="error-time" className="field-error">
                    {fieldErrors.time}
                  </p>
                )}
              </fieldset>

              <fieldset aria-describedby={fieldErrors.level ? 'error-level' : undefined}>
                <legend>¿Cuál es tu nivel de experiencia?</legend>
                <div className="choice-grid">
                  {(['principiante', 'intermedio', 'avanzado'] as QuizLevel[]).map((lvl) => (
                    <label key={lvl} className="cursor-pointer">
                      <input
                        type="radio"
                        name="level"
                        value={lvl}
                        checked={level === lvl}
                        onChange={() => {
                          setLevel(lvl);
                          setFieldErrors((prev) => ({ ...prev, level: '' }));
                        }}
                      />{' '}
                      {levelLabels[lvl]}
                    </label>
                  ))}
                </div>
                {fieldErrors.level && (
                  <p id="error-level" className="field-error">
                    {fieldErrors.level}
                  </p>
                )}
              </fieldset>

              <fieldset aria-describedby={fieldErrors.equipment ? 'error-equipment' : undefined}>
                <legend>¿Qué equipamiento tienes disponible?</legend>
                <div className="choice-grid">
                  {(['ninguno', 'bandas', 'peso', 'colchoneta'] as Equipment[]).map((eq) => (
                    <label key={eq} className="cursor-pointer">
                      <input
                        type="checkbox"
                        name="equipment"
                        value={eq}
                        checked={equipment.includes(eq)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setEquipment((prev) =>
                            checked ? [...prev, eq] : prev.filter((x) => x !== eq)
                          );
                          setFieldErrors((prev) => ({ ...prev, equipment: '' }));
                        }}
                      />{' '}
                      {equipmentLabels[eq]}
                    </label>
                  ))}
                </div>
                {fieldErrors.equipment && (
                  <p id="error-equipment" className="field-error">
                    {fieldErrors.equipment}
                  </p>
                )}
              </fieldset>

              {/* Contexto de Escoliosis (Opcional - No prescriptivo) */}
              <fieldset className="p-4 rounded-[var(--radio-md)] border border-[var(--color-borde)] bg-[var(--color-fondo)]">
                <legend className="font-semibold text-sm">
                  Contexto sobre escoliosis o curvatura <span className="small-print">(totalmente opcional)</span>
                </legend>
                <p className="small-print text-[var(--color-texto-suave)] mb-3">
                  Esta información permite incluir pautas pedagógicas en tu propuesta. No se utiliza para prohibir ejercicios de forma automática.
                </p>
                <div className="choice-grid">
                  {(
                    [
                      'ninguna',
                      'leve_desconocido',
                      'moderada',
                      'severa',
                      'no_sabe',
                    ] as ScoliosisContextOption[]
                  ).map((opt) => (
                    <label key={opt} className="cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="scoliosisContext"
                        value={opt}
                        checked={scoliosisContext === opt}
                        onChange={() => setScoliosisContext(opt)}
                      />{' '}
                      {scoliosisLabels[opt]}
                    </label>
                  ))}
                </div>
              </fieldset>
            </section>
          )}

          {/* Paso 2: Preguntas de seguridad clínica */}
          {currentStep === 2 && (
            <section
              className="step-panel p-4 rounded-[var(--radio-md)] border-l-4 border-amber-600 bg-[var(--color-fondo-aviso)]"
              data-step="2"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl" aria-hidden="true">⚠️</span>
                <h3 id="step-two-heading" tabIndex={-1} className="m-0 font-bold">
                  Paso 2 de 3: preguntas de seguridad clínica
                </h3>
              </div>
              <p className="text-sm">
                Estas respuestas determinan si es seguro generar una propuesta automática en este momento o si requieres valoración previa. No hay una casilla para omitir un bloqueo.
              </p>

              <fieldset
                className="mt-4"
                aria-describedby={fieldErrors.surgeryNoAuthorization ? 'error-surgery' : undefined}
              >
                <legend>¿Has tenido una cirugía de columna y todavía no tienes autorización para retomar la actividad?</legend>
                <div className="choice-grid">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="surgeryNoAuthorization"
                      value="si"
                      checked={surgeryNoAuth === 'si'}
                      onChange={() => {
                        setSurgeryNoAuth('si');
                        setFieldErrors((prev) => ({ ...prev, surgeryNoAuthorization: '' }));
                      }}
                    />{' '}
                    Sí
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="surgeryNoAuthorization"
                      value="no"
                      checked={surgeryNoAuth === 'no'}
                      onChange={() => {
                        setSurgeryNoAuth('no');
                        setFieldErrors((prev) => ({ ...prev, surgeryNoAuthorization: '' }));
                      }}
                    />{' '}
                    No
                  </label>
                </div>
                {fieldErrors.surgeryNoAuthorization && (
                  <p id="error-surgery" className="field-error">
                    {fieldErrors.surgeryNoAuthorization}
                  </p>
                )}
              </fieldset>

              <fieldset
                className="mt-4"
                aria-describedby={fieldErrors.clinicalRestriction ? 'error-restriction' : undefined}
              >
                <legend>¿Tienes restricciones de ejercicio indicadas por tu profesional sanitario?</legend>
                <div className="choice-grid">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="clinicalRestriction"
                      value="si"
                      checked={clinicalRestriction === 'si'}
                      onChange={() => {
                        setClinicalRestriction('si');
                        setFieldErrors((prev) => ({ ...prev, clinicalRestriction: '' }));
                      }}
                    />{' '}
                    Sí
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="clinicalRestriction"
                      value="no"
                      checked={clinicalRestriction === 'no'}
                      onChange={() => {
                        setClinicalRestriction('no');
                        setFieldErrors((prev) => ({ ...prev, clinicalRestriction: '' }));
                      }}
                    />{' '}
                    No
                  </label>
                </div>
                {fieldErrors.clinicalRestriction && (
                  <p id="error-restriction" className="field-error">
                    {fieldErrors.clinicalRestriction}
                  </p>
                )}
              </fieldset>

              <fieldset
                className="mt-4"
                aria-describedby={fieldErrors.concerningSymptoms ? 'error-symptoms' : undefined}
              >
                <legend>
                  ¿Experimentas actualmente síntomas preocupantes como dolor nuevo, intenso o creciente, debilidad o entumecimiento?
                </legend>
                <div className="choice-grid">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="concerningSymptoms"
                      value="si"
                      checked={concerningSymptoms === 'si'}
                      onChange={() => {
                        setConcerningSymptoms('si');
                        setFieldErrors((prev) => ({ ...prev, concerningSymptoms: '' }));
                      }}
                    />{' '}
                    Sí
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="concerningSymptoms"
                      value="no"
                      checked={concerningSymptoms === 'no'}
                      onChange={() => {
                        setConcerningSymptoms('no');
                        setFieldErrors((prev) => ({ ...prev, concerningSymptoms: '' }));
                      }}
                    />{' '}
                    No
                  </label>
                </div>
                {fieldErrors.concerningSymptoms && (
                  <p id="error-symptoms" className="field-error">
                    {fieldErrors.concerningSymptoms}
                  </p>
                )}
              </fieldset>

              <div className="mt-4 p-3 rounded bg-amber-50 text-xs border border-amber-200 text-amber-900">
                <strong>Recordatorio clínico importante:</strong> si eres menor de edad en etapa de crecimiento activo o utilizas corsé ortopédico, cualquier rutina de ejercicios debe coordinarse directamente con tu médico ortopedista o fisioterapeuta especialista en escoliosis.
              </div>
            </section>
          )}

          {/* Paso 3: Revisión y Generación */}
          {currentStep === 3 && (
            <section className="step-panel" data-step="3">
              <h3 id="step-three-heading" tabIndex={-1}>
                Paso 3 de 3: revisar y generar
              </h3>
              <p>Revisa tus respuestas antes de generar la propuesta educativa.</p>

              <div id="answer-summary" className="answer-summary">
                <h4>Tus respuestas</h4>
                <ul>
                  <li>Objetivo: {objective ? objectiveLabels[objective] : 'No seleccionado'}</li>
                  <li>Días por semana: {days} {days === '1' ? 'día' : 'días'}</li>
                  <li>Tiempo por sesión: {time ? timeLabels[time] : 'No seleccionado'}</li>
                  <li>Nivel: {level ? levelLabels[level] : 'No seleccionado'}</li>
                  <li>
                    Equipamiento: {equipment.map((eq) => equipmentLabels[eq]).join(', ')}
                  </li>
                  <li>Contexto escoliosis: {scoliosisLabels[scoliosisContext]}</li>
                  <li>Cirugía sin autorización: {surgeryNoAuth === 'si' ? 'Sí' : 'No'}</li>
                  <li>Restricción clínica: {clinicalRestriction === 'si' ? 'Sí' : 'No'}</li>
                  <li>Síntomas preocupantes: {concerningSymptoms === 'si' ? 'Sí' : 'No'}</li>
                </ul>
              </div>
            </section>
          )}

          {stepError && (
            <div id="quiz-error" className="notice warning mt-4" role="alert">
              {stepError}
            </div>
          )}

          <div className="quiz-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            {currentStep > 1 && (
              <button
                type="button"
                id="quiz-back"
                className="btn secondary"
                onClick={handleBack}
              >
                Atrás
              </button>
            )}

            {currentStep < 3 && (
              <button
                type="button"
                id="quiz-next"
                className="btn"
                onClick={handleNext}
              >
                Siguiente
              </button>
            )}

            {currentStep === 3 && (
              <button type="submit" id="quiz-submit" className="btn">
                Generar propuesta
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Resultados de sugerencias */}
      {results && (
        <section id="quiz-results" className="app-card" aria-labelledby="results-heading">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 id="results-heading" tabIndex={-1} className="m-0">
              Propuesta educativa
            </h2>
            {!results.blocked && !results.insufficient && (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn secondary text-sm"
                  onClick={handleAdjustProposal}
                >
                  Ajustar propuesta
                </button>
                <button
                  type="button"
                  className="btn text-sm"
                  onClick={() => setShowExportModal(true)}
                >
                  📄 Exportar para consulta médica
                </button>
              </div>
            )}
          </div>

          <div id="results-content">
            {results.blocked ? (
              <div className="notice danger">
                <h3>No se generó una propuesta automática</h3>
                <p>
                  {results.reasons
                    ? `La generación está bloqueada por: ${results.reasons.join('; ')}.`
                    : results.reason}
                </p>
                <p>
                  Consulta con tu equipo sanitario antes de retomar o elegir actividad. Ante síntomas repentinos o graves, busca atención urgente.
                </p>
              </div>
            ) : results.insufficient ? (
              <div className="notice warning">
                <p>
                  No hay suficientes ejercicios compatibles para organizar {results.requested} días con estas respuestas. No se muestra una propuesta incompleta. Puedes volver atrás y ajustar solo las preferencias de actividad, sin cambiar respuestas de seguridad para evitar un bloqueo.
                </p>
                <button
                  type="button"
                  className="btn secondary mt-3"
                  onClick={handleAdjustProposal}
                >
                  Modificar preferencias
                </button>
              </div>
            ) : (
              <>
                {/* Bloque de contexto clínico si declaró escoliosis */}
                {results.scoliosisGuidance && (
                  <div className="notice notice-info mb-4" role="note">
                    <p className="m-0 font-medium">{results.scoliosisGuidance}</p>
                  </div>
                )}

                <p>
                  Esta propuesta usa {results.available} opciones compatibles de la biblioteca y no repite ejercicios dentro de ella.
                </p>

                <div className="plan-grid">
                  {results.days.map((day) => (
                    <article key={day.number} className="plan-day">
                      <h3>Día {day.number}</h3>
                      <p className="font-bold text-lg">{day.exercise.name}</p>
                      <p>{day.exercise.description}</p>
                      <div className="text-xs text-[var(--color-texto-suave)] space-y-1 my-2">
                        <p className="m-0">
                          <strong>Duración:</strong> {day.exercise.duration} ·{' '}
                          <strong>Nivel:</strong> {day.exercise.difficulty}
                        </p>
                        {day.exercise.adaptation?.notes && (
                          <p className="m-0 text-amber-800">
                            <strong>Adaptación:</strong> {day.exercise.adaptation.notes}
                          </p>
                        )}
                      </div>

                      <div className="mt-3">
                        <a
                          href={`#ejercicios?search=${encodeURIComponent(day.exercise.name)}`}
                          className="card-link text-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.hash = `ejercicios`;
                          }}
                        >
                          Ver ficha en biblioteca →
                        </a>
                      </div>
                    </article>
                  ))}
                </div>

                <p className="notice warning mt-4">
                  Detén la actividad si aparece dolor intenso, debilidad, entumecimiento u otros síntomas inusuales y consulta con un profesional. La etiqueta de la biblioteca no sustituye una valoración individual.
                </p>
              </>
            )}
          </div>
        </section>
      )}

      {/* Modal / Vista de Exportación para Fisioterapia */}
      {showExportModal && results && !results.blocked && (
        <div
          className="dialog-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(23, 38, 48, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="export-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              color: '#172630',
              maxWidth: '46rem',
              width: '100%',
              borderRadius: 'var(--radio-lg)',
              padding: '2rem',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--sombra-flotante)',
            }}
          >
            <div className="flex justify-between items-start border-b pb-3 mb-4">
              <div>
                <h2 id="export-title" className="text-xl font-bold m-0 text-[#245a73]">
                  FitCasa — Resumen de actividad para revisión clínica
                </h2>
                <p className="text-xs text-gray-500 m-0 mt-1">
                  Generado el {new Date().toLocaleDateString('es-ES')} para consulta con Fisioterapeuta o Traumatólogo
                </p>
              </div>
              <button
                type="button"
                className="btn secondary text-xs"
                onClick={() => setShowExportModal(false)}
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs mb-4 text-blue-900">
              <strong>Aviso para el profesional tratante:</strong> Este documento contiene una propuesta educativa de acondicionamiento físico general con peso corporal recopilada según las preferencias del paciente. No constituye prescripción médica ni plan de ejercicios específicos de escoliosis (PSSE). Su validez y dosificación deben ser supervisadas conforme al cuadro clínico individual.
            </div>

            <div className="text-xs space-y-1 mb-4 border p-3 rounded bg-gray-50">
              <p className="font-bold text-sm text-gray-800 m-0 mb-1">Perfil declarado por el paciente:</p>
              <p className="m-0"><strong>Objetivo:</strong> {objective ? objectiveLabels[objective] : ''}</p>
              <p className="m-0"><strong>Frecuencia:</strong> {days} días/semana · <strong>Tiempo por sesión:</strong> {time ? timeLabels[time] : ''}</p>
              <p className="m-0"><strong>Contexto de escoliosis:</strong> {scoliosisLabels[scoliosisContext]}</p>
              <p className="m-0"><strong>Equipamiento disponible:</strong> {equipment.join(', ')}</p>
            </div>

            <h3 className="text-sm font-bold border-b pb-1 mb-2">Propuesta de ejercicios seleccionados:</h3>
            <div className="space-y-3 mb-6">
              {results.days.map((day) => (
                <div key={day.number} className="border-b pb-2 text-xs">
                  <div className="flex justify-between font-bold text-sm text-[#245a73]">
                    <span>Día {day.number}: {day.exercise.name}</span>
                    <span>{day.exercise.duration} · {day.exercise.difficulty}</span>
                  </div>
                  <p className="m-0 text-gray-700">{day.exercise.description}</p>
                  {day.exercise.adaptation?.notes && (
                    <p className="m-0 mt-1 text-amber-800">
                      <strong>Nota de adaptación:</strong> {day.exercise.adaptation.notes}
                    </p>
                  )}
                  {day.exercise.clinicalMetadata?.precautions && (
                    <p className="m-0 text-gray-600">
                      <strong>Precauciones:</strong> {day.exercise.clinicalMetadata.precautions.join('; ')}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button
                type="button"
                className="btn secondary"
                onClick={() => setShowExportModal(false)}
              >
                Cerrar
              </button>
              <button
                type="button"
                className="btn"
                onClick={handlePrintClinicalSummary}
              >
                🖨️ Imprimir documento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacidad y borrado */}
      <section className="app-card" aria-labelledby="privacy-heading">
        <h2 id="privacy-heading">Privacidad y borrado</h2>
        <p>
          Las respuestas del cuestionario y los registros se conservan únicamente en el almacenamiento local de tu navegador. FitCasa no envía estos datos a servidores externos.
        </p>
        <button
          type="button"
          id="clear-data"
          className="btn secondary"
          onClick={handleClearData}
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
