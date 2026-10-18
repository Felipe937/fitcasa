import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PageRoute } from '../components/Header';
import { QuizAnswers, UserPlan } from '../types';
import { EXERCISES_DATA } from '../data/exercisesData';
import {
  readPlanStorage,
  writePlanStorage,
  readStorage,
  STORAGE_KEYS,
  QUIZ_STORAGE_VERSION,
} from '../utils/storage';
import { generatePlan, markSessionCompleted, getPlanProgress, getWeekProgress, areAnswersEqual } from '../utils/planGenerator';
import { normalizeAnswers } from '../utils/quizEngine';

interface PlanPageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
  onStorageCleared?: () => void;
}

const OBJECTIVE_LABELS: Record<string, string> = {
  movilidad: 'Movilidad suave',
  fuerza: 'Fuerza y estabilidad',
  bienestar: 'Actividad general y bienestar',
};

const TIME_LABELS: Record<string, string> = {
  '10': 'Hasta 10 minutos',
  '20': 'Entre 10 y 20 minutos',
  '30': 'Más de 20 minutos',
};

const DAYS_LABELS: Record<string, string> = {
  '1': '1 día',
  '2': '2 días',
  '3': '3 días',
  '4': '4 días',
  '5': '5 días',
  '6': '6 días',
  '7': '7 días',
};

export const PlanPage: React.FC<PlanPageProps> = ({ onNavigate }) => {
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [storageNotice, setStorageNotice] = useState<string>('');
  const [announcement, setAnnouncement] = useState<string>('');
  const statusTimer = useRef<number | null>(null);
  const weekTabsRef = useRef<HTMLButtonElement[]>([]);

  const announce = useCallback((text: string) => {
    if (statusTimer.current !== null) window.clearTimeout(statusTimer.current);
    setAnnouncement(text);
    statusTimer.current = window.setTimeout(() => {
      setAnnouncement('');
      statusTimer.current = null;
    }, 7000);
  }, []);

  useEffect(() => {
    const planRes = readPlanStorage();
    if (!planRes.available) {
      setStorageNotice('La persistencia no está disponible en este navegador. El plan funcionará durante esta sesión, pero no se guardará al recargar.');
    } else if (planRes.reason === 'corrupt' || planRes.reason === 'unknown-version') {
      setStorageNotice('No se pudo recuperar el plan guardado. Puedes generar uno nuevo.');
    } else if (planRes.value) {
      setPlan(planRes.value);
    }

    const quizRes = readStorage<QuizAnswers>(
      STORAGE_KEYS.quiz,
      QUIZ_STORAGE_VERSION,
      normalizeAnswers
    );
    if (quizRes.value) {
      setAnswers(quizRes.value);
    }
  }, []);

  useEffect(() => {
    if (!plan || !answers) return;
    if (!areAnswersEqual(plan.answersSnapshot, answers)) {
      setShowRegenerateConfirm(true);
    }
  }, [plan, answers]);

  const handleRegeneratePlan = useCallback(() => {
    if (!answers) return;
    const result = generatePlan(answers, EXERCISES_DATA);
    if (result.plan) {
      setPlan(result.plan);
      const writeRes = writePlanStorage(result.plan);
      if (!writeRes.saved) {
        setStorageNotice('La persistencia no está disponible. El plan solo se conservará durante esta sesión.');
      } else {
        announce('Nuevo plan generado y guardado con tus respuestas actualizadas.');
      }
    }
    setShowRegenerateConfirm(false);
    setActiveWeek(1);
  }, [answers, announce]);

  const handleKeepPlan = useCallback(() => {
    setShowRegenerateConfirm(false);
  }, []);

  const handleToggleSession = useCallback((weekNumber: number, sessionNumber: number) => {
    if (!plan) return;
    const updatedPlan = markSessionCompleted(plan, weekNumber, sessionNumber);
    setPlan(updatedPlan);
    const writeRes = writePlanStorage(updatedPlan);
    if (!writeRes.saved) {
      setStorageNotice('La persistencia no está disponible. El progreso solo se conservará durante esta sesión.');
    }
    const weekProg = getWeekProgress(updatedPlan, weekNumber);
    const globalProg = getPlanProgress(updatedPlan);
    const session = updatedPlan.weeks.find(w => w.weekNumber === weekNumber)?.sessions.find(s => s.sessionNumber === sessionNumber);
    const action = session?.completed ? 'completada' : 'desmarcada';
    announce(`Sesión ${sessionNumber} de la semana ${weekNumber} ${action}. Progreso de la semana: ${weekProg.completed}/${weekProg.total}. Progreso global: ${globalProg.completed}/${globalProg.total} (${globalProg.percentage}%).`);
  }, [plan, announce]);

  const handleNavigateToPanel = useCallback((weekNumber: number, sessionNumber: number) => {
    const session = plan?.weeks.find(w => w.weekNumber === weekNumber)?.sessions.find(s => s.sessionNumber === sessionNumber);
    if (!session) return;
    const date = new Date().toISOString().split('T')[0];
    const exerciseName = session.exercises.map(e => EXERCISES_DATA.find(ex => ex.id === e.exerciseId)?.name).filter(Boolean).join(', ');
    onNavigate('panel');
    setTimeout(() => {
      const dateInput = document.getElementById('entry-date') as HTMLInputElement;
      const activityInput = document.getElementById('entry-activity') as HTMLInputElement;
      const exerciseSelect = document.getElementById('exercise-quick-select') as HTMLSelectElement;
      if (dateInput) {
        dateInput.value = date;
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (activityInput && exerciseName) {
        activityInput.value = exerciseName;
        activityInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (exerciseSelect && session.exercises[0]) {
        exerciseSelect.value = session.exercises[0].exerciseId;
        exerciseSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, 100);
  }, [plan, onNavigate]);

  const handleGenerateInitialPlan = useCallback(() => {
    if (!answers) return;
    const result = generatePlan(answers, EXERCISES_DATA);
    if (result.plan) {
      setPlan(result.plan);
      const writeRes = writePlanStorage(result.plan);
      if (!writeRes.saved) {
        setStorageNotice('La persistencia no está disponible. El plan solo se conservará durante esta sesión.');
      }
    } else if (result.blocked) {
      // Safety block handled in UI
    } else if (result.insufficient) {
      // Insufficient handled in UI
    }
  }, [answers]);

  useEffect(() => {
    if (answers && !plan) {
      handleGenerateInitialPlan();
    }
  }, [answers, plan, handleGenerateInitialPlan]);

  const progress = plan ? getPlanProgress(plan) : { completed: 0, total: 0, percentage: 0 };

  const isBlocked = answers && safetyBlock(answers).length > 0;
  const blockReasons = answers ? safetyBlock(answers) : [];

  if (isBlocked) {
    return (
      <main id="contenido" tabIndex={-1} className="plan-page container">
        <header className="plan-page__header">
          <span className="plan-page__kicker">ORGANIZADOR PERSONAL</span>
          <h1 className="plan-page__titulo">Mi Plan de 4 Semanas</h1>
        </header>
        <div className="plan-page__bloqueo">
          <div className="plan-alerta plan-alerta--bloqueo" role="alert">
            <svg className="plan-alerta__icono" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M12 3.2 5 6v6c0 4 3 7.4 7 8.8 4-1.4 7-4.8 7-8.8V6l-7-2.8Z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <div>
              <h2>El plan no se puede generar por seguridad</h2>
              <p>Se han detectado las siguientes situaciones que requieren valoración profesional previa:</p>
              <ul>
                {blockReasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
              <p>Consulta con tu equipo sanitario antes de retomar o elegir actividad. Ante síntomas repentinos o graves, busca atención urgente.</p>
              <button
                type="button"
                className="btn secondary"
                onClick={() => onNavigate('quiz')}
              >
                Modificar cuestionario
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!answers) {
    return (
      <main id="contenido" tabIndex={-1} className="plan-page container">
        <header className="plan-page__header">
          <span className="plan-page__kicker">ORGANIZADOR PERSONAL</span>
          <h1 className="plan-page__titulo">Mi Plan de 4 Semanas</h1>
        </header>
        <div className="plan-page__vacío">
          <svg className="plan-page__vacío-icono" viewBox="0 0 64 64" focusable="false" aria-hidden="true">
            <path d="M14 8h24a8 8 0 0 1 8 8v40H22a8 8 0 0 1-8-8V8Z" />
            <path d="M38 8v10h8" />
            <path d="M22 30h16M22 38h16M22 46h10" />
            <path d="M46 20h8a6 6 0 0 1 6 6v22a6 6 0 0 1-6 6h-4" />
          </svg>
          <h2>No hay plan generado aún</h2>
          <p>Completa el cuestionario de sugerencias para que podamos crear tu plan personalizado de 4 semanas basado en tus objetivos, disponibilidad y equipamiento.</p>
          <button
            type="button"
            className="btn"
            onClick={() => onNavigate('quiz')}
          >
            Ir al cuestionario
          </button>
        </div>
      </main>
    );
  }

  const insufficientResult = generatePlan(answers, EXERCISES_DATA);
  if (insufficientResult.insufficient) {
    return (
      <main id="contenido" tabIndex={-1} className="plan-page container">
        <header className="plan-page__header">
          <span className="plan-page__kicker">ORGANIZADOR PERSONAL</span>
          <h1 className="plan-page__titulo">Mi Plan de 4 Semanas</h1>
        </header>
        <div className="plan-page__insuficiente">
          <div className="plan-alerta plan-alerta--aviso" role="note">
            <svg className="plan-alerta__icono" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M12 3.6 2.6 20h18.8L12 3.6Z" />
              <path d="M12 10v4.5" />
              <path d="M12 17.6h.01" />
            </svg>
            <div>
              <h2>No hay suficientes ejercicios compatibles</h2>
              <p>Solo hay {insufficientResult.available} ejercicios que coinciden con tus preferencias, pero necesitas {insufficientResult.requested} días por semana.</p>
              <p>Puedes volver al cuestionario y ampliar el equipamiento disponible o aumentar el tiempo por sesión para desbloquear más opciones.</p>
              <button
                type="button"
                className="btn"
                onClick={() => onNavigate('quiz')}
              >
                Ajustar preferencias
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const handleWeekKeyDown = (e: React.KeyboardEvent, weekNumber: number) => {
    const tabs = weekTabsRef.current.filter(Boolean);
    const currentIndex = tabs.findIndex((_, i) => i + 1 === weekNumber);
    let nextIndex = currentIndex;
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    tabs[nextIndex]?.focus();
    setActiveWeek(nextIndex + 1);
  };

  const activeWeekData = plan?.weeks.find(w => w.weekNumber === activeWeek);

  return (
    <main id="contenido" tabIndex={-1} className="plan-page container">
      <nav aria-label="Miga de pan" className="mb-4">
        <a
          href="#inicio"
          className="plan-page__breadcrumb-link"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('inicio');
          }}
        >
          ← Volver al inicio
        </a>
      </nav>

      <header className="plan-page__header">
        <span className="plan-page__kicker">ORGANIZADOR PERSONAL</span>
        <h1 className="plan-page__titulo">Mi Plan de 4 Semanas</h1>

        <div className="plan-page__resumen">
          <dl className="plan-page__etiquetas">
            <dt>Objetivo</dt>
            <dd>{OBJECTIVE_LABELS[answers.objective] || answers.objective}</dd>
            <dt>Días por semana</dt>
            <dd>{DAYS_LABELS[answers.days] || `${answers.days} días`}</dd>
            <dt>Tiempo por sesión</dt>
            <dd>{TIME_LABELS[answers.time] || answers.time}</dd>
          </dl>
          <button
            type="button"
            className="plan-page__revisar"
            onClick={() => onNavigate('quiz')}
          >
            Revisar o actualizar cuestionario
          </button>
        </div>
      </header>

      {storageNotice && (
        <div className="plan-page__aviso-persistencia" role="status">
          {storageNotice}
        </div>
      )}

      <div className="plan-page__aviso-salud" role="note">
        <svg className="plan-page__aviso-icono" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M12 3.6 2.6 20h18.8L12 3.6Z" />
          <path d="M12 10v4.5" />
          <path d="M12 17.6h.01" />
        </svg>
        <p>
          <strong>Recordatorio de salud:</strong> Esta guía es pedagógica y de bienestar general. No sustituye la valoración médica ni fisioterapéutica individual.
          Si durante una sesión aparece dolor nuevo, intenso o creciente, debilidad, entumecimiento u otros síntomas inusuales,
          detén la actividad y consulta a tu especialista.
        </p>
      </div>

      {showRegenerateConfirm && (
        <div className="plan-page__confirmar-regenerar" role="alertdialog" aria-labelledby="regen-heading" aria-describedby="regen-body">
          <h2 id="regen-heading">¿Generar un nuevo plan?</h2>
          <p id="regen-body">Has actualizado tus respuestas en el cuestionario. ¿Quieres generar un nuevo plan con las nuevas respuestas? Se perderá el progreso del plan actual.</p>
          <div className="plan-page__confirmar-acciones">
            <button type="button" className="btn secondary" onClick={handleKeepPlan}>
              Mantener el plan actual
            </button>
            <button type="button" className="btn" onClick={handleRegeneratePlan}>
              Generar nuevo plan
            </button>
          </div>
        </div>
      )}

      <div className="plan-page__progreso-global" role="status" aria-live="polite" aria-label={`Progreso global: ${progress.completed} de ${progress.total} sesiones completadas, ${progress.percentage} por ciento`}>
        <div className="plan-page__progreso-barra">
          <div className="plan-page__progreso-relleno" style={{ width: `${progress.percentage}%` }}></div>
        </div>
        <p className="plan-page__progreso-texto">
          {progress.completed} de {progress.total} sesiones completadas — {progress.percentage}%
        </p>
        {announcement && (
          <p className="plan-page__anuncio" aria-live="polite" aria-atomic="true">
            {announcement}
          </p>
        )}
      </div>

      <div className="plan-page__semanas" role="tablist" aria-label="Semanas del plan">
        {plan?.weeks.map((week) => {
          const weekProg = getWeekProgress(plan, week.weekNumber);
          return (
            <button
              key={week.weekNumber}
              ref={(el) => { weekTabsRef.current[week.weekNumber - 1] = el!; }}
              role="tab"
              aria-selected={activeWeek === week.weekNumber}
              aria-controls={`panel-semana-${week.weekNumber}`}
              id={`tab-semana-${week.weekNumber}`}
              className={`plan-page__semana-tab ${activeWeek === week.weekNumber ? 'plan-page__semana-tab--activa' : ''} ${weekProg.completed === weekProg.total && weekProg.total > 0 ? 'plan-page__semana-tab--completa' : ''}`}
              onClick={() => setActiveWeek(week.weekNumber)}
              onKeyDown={(e) => handleWeekKeyDown(e, week.weekNumber)}
            >
              <span className="plan-page__semana-numero">Semana {week.weekNumber}</span>
              <span className="plan-page__semana-estado">{weekProg.completed}/{weekProg.total}</span>
            </button>
          );
        })}
      </div>

      {activeWeekData && (
        <div
          role="tabpanel"
          id={`panel-semana-${activeWeekData.weekNumber}`}
          aria-labelledby={`tab-semana-${activeWeekData.weekNumber}`}
          className="plan-page__panel-semana"
          tabIndex={0}
        >
          <div className="plan-page__semana-foco">
            <h2 className="plan-page__semana-titulo">{activeWeekData.focusTitle}</h2>
            <p className="plan-page__semana-descripcion">{activeWeekData.focusDescription}</p>
          </div>

          <ul className="plan-page__sesiones" role="list">
            {activeWeekData.sessions.map((session) => {
              const exercisesDetails = session.exercises.map((se) => {
                const ex = EXERCISES_DATA.find((e) => e.id === se.exerciseId);
                return ex ? { name: ex.name, difficulty: ex.difficulty, zone: ex.zone, category: ex.category, id: ex.id } : null;
              }).filter(Boolean) as Array<{ name: string; difficulty: string; zone: string[]; category: string; id: string }>;

              return (
                <li key={session.id} className={`plan-page__sesion ${session.completed ? 'plan-page__sesion--completada' : ''}`}>
                  <div className="plan-page__sesion-cabecera">
                    <span className="plan-page__sesion-numero">Sesión {session.sessionNumber}</span>
                    <label className="plan-page__checkbox-label">
                      <input
                        type="checkbox"
                        className="plan-page__checkbox"
                        checked={session.completed}
                        onChange={() => handleToggleSession(activeWeekData.weekNumber, session.sessionNumber)}
                        aria-label={`Marcar sesión ${session.sessionNumber} de la semana ${activeWeekData.weekNumber} como ${session.completed ? 'no realizada' : 'realizada'}`}
                      />
                      <span className="plan-page__checkbox-texto">{session.completed ? 'Realizada' : 'Marcar como realizada'}</span>
                    </label>
                  </div>
                  <ul className="plan-page__ejercicios" role="list">
                    {exercisesDetails.map((ex) => (
                      <li key={ex.id} className="plan-page__ejercicio">
                        <div className="plan-page__ejercicio-info">
                          <strong>{ex.name}</strong>
                          <span className="plan-page__ejercicio-meta">
                            <span className="plan-chip plan-chip--dificultad">{ex.difficulty}</span>
                            <span className="plan-chip plan-chip--categoria">{ex.category === 'cuidado_postural' ? 'Postural' : 'General'}</span>
                            <span className="plan-chip plan-chip--zona">{ex.zone.join(', ')}</span>
                          </span>
                        </div>
                        <a
                          href={`#ejercicios?search=${encodeURIComponent(ex.name)}`}
                          className="plan-page__ejercicio-enlace"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.hash = `ejercicios`;
                          }}
                        >
                          Ver ficha
                        </a>
                      </li>
                    ))}
                  </ul>
                  <div className="plan-page__sesion-acciones">
                    <button
                      type="button"
                      className="btn secondary plan-page__btn-panel"
                      onClick={() => handleNavigateToPanel(activeWeekData.weekNumber, session.sessionNumber)}
                    >
                      Registrar sensaciones en Seguimiento
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </main>
  );
};

function safetyBlock(answers: QuizAnswers): string[] {
  const reasons: string[] = [];
  if (answers.surgeryNoAuthorization === 'si') {
    reasons.push('una cirugía de columna sin autorización para retomar la actividad');
  }
  if (answers.clinicalRestriction === 'si') {
    reasons.push('una restricción de ejercicio indicada por un profesional sanitario');
  }
  if (answers.concerningSymptoms === 'si') {
    reasons.push('síntomas preocupantes como dolor nuevo, intenso o creciente, debilidad o entumecimiento');
  }
  return reasons;
}

export default PlanPage;