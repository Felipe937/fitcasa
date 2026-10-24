import { useEffect, useState, useCallback, useRef } from 'react';
import { PageRoute } from '../components/Header';
import { Exercise, PlanSession } from '../types';
import { EXERCISES_DATA } from '../data/exercisesData';
import { readPlanStorage } from '../utils/storage';

interface GuidedSessionPageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

// Temporary storage key for passing session ID to this page
const TEMP_SESSION_KEY = 'fitcasa.temp-session-id';

const DURATION_SECONDS: Record<string, number> = {
  corta: 120,  // 2 minutos
  media: 300,  // 5 minutos
  larga: 600,  // 10 minutos
};

const GuidedSessionPage: React.FC<GuidedSessionPageProps> = ({ onNavigate }) => {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [durationLabel, setDurationLabel] = useState('00:00');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number | null>(null);

  // Load session data from storage
  useEffect(() => {
    try {
      const tempSessionId = localStorage.getItem(TEMP_SESSION_KEY);
      if (!tempSessionId) {
        setError('No se especificó una sesión para iniciar. Por favor, selecciona una sesión desde tu plan.');
        setLoading(false);
        return;
      }

      const planRes = readPlanStorage();
      if (!planRes.available || !planRes.value) {
        setError('No se pudo cargar el plan. Por favor, genera un plan primero.');
        setLoading(false);
        return;
      }

      const plan = planRes.value;
      let targetSession: PlanSession | null = null;

      // Find the session by ID
      for (const week of plan.weeks) {
        const session = week.sessions.find(s => s.id === tempSessionId);
        if (session) {
          targetSession = session;
          break;
        }
      }

      if (!targetSession) {
        setError('No se encontró la sesión especificada en tu plan.');
        setLoading(false);
        return;
      }

      // Get the first exercise from the session
      if (targetSession.exercises.length === 0) {
        setError('Esta sesión no tiene ejercicios asignados.');
        setLoading(false);
        return;
      }

      const sessionExercise = targetSession.exercises[0];
      const exercise = EXERCISES_DATA.find(e => e.id === sessionExercise.exerciseId);

      if (!exercise) {
        setError('No se encontró el ejercicio especificado.');
        setLoading(false);
        return;
      }

      setCurrentExercise(exercise);
      setLoading(false);

      // Clean up temp storage
      localStorage.removeItem(TEMP_SESSION_KEY);
    } catch (err) {
      setError('Ocurrió un error al cargar la sesión.');
      setLoading(false);
    }
  }, []);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }, []);

  // Start timer based on exercise duration
  const startTimer = useCallback(() => {
    if (!currentExercise) return;

    const duration = currentExercise.duration;
    const totalSeconds = DURATION_SECONDS[duration] || 120;

    setTimer(totalSeconds);
    setIsRunning(true);
    setDurationLabel(formatTime(totalSeconds));

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const now = Date.now();
    endTimeRef.current = now + totalSeconds * 1000;

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const remaining = Math.ceil((endTimeRef.current! - currentTime) / 1000);

      if (remaining <= 0) {
        setTimer(0);
        setDurationLabel('00:00');
        setIsRunning(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        setTimer(remaining);
        setDurationLabel(formatTime(remaining));
      }
    }, 100);
  }, [currentExercise, formatTime]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    endTimeRef.current = null;
  }, []);

  // Resume timer
  const resumeTimer = useCallback(() => {
    if (timer <= 0) return;

    setIsRunning(true);

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const now = Date.now();
    endTimeRef.current = now + timer * 1000;

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const remaining = Math.ceil((endTimeRef.current! - currentTime) / 1000);

      if (remaining <= 0) {
        setTimer(0);
        setDurationLabel('00:00');
        setIsRunning(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        setTimer(remaining);
        setDurationLabel(formatTime(remaining));
      }
    }, 100);
  }, [timer, formatTime]);

  // Reset timer
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    endTimeRef.current = null;
    if (currentExercise) {
      const duration = currentExercise.duration;
      const totalSeconds = DURATION_SECONDS[duration] || 120;
      setTimer(totalSeconds);
      setDurationLabel(formatTime(totalSeconds));
    }
  }, [currentExercise, formatTime]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <main id="contenido" tabIndex={-1} className="guided-session-page container">
        <p>Cargando sesión...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main id="contenido" tabIndex={-1} className="guided-session-page container">
        <div className="guided-session-error" role="alert">
          <p>{error}</p>
          <button
            type="button"
            className="btn"
            onClick={() => onNavigate('plan')}
          >
            Ir a mi plan
          </button>
        </div>
      </main>
    );
  }

  if (!currentExercise) {
    return (
      <main id="contenido" tabIndex={-1} className="guided-session-page container">
        <p>No hay ejercicio seleccionado.</p>
        <button
          type="button"
          className="btn"
          onClick={() => onNavigate('plan')}
        >
          Ir a mi plan
        </button>
      </main>
    );
  }

  const durationMinutes = Math.ceil((DURATION_SECONDS[currentExercise.duration] || 120) / 60);

  return (
    <main id="contenido" tabIndex={-1} className="guided-session-page container">
      <header className="guided-session-header">
        <a
          href="#plan"
          className="guided-session-back"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('plan');
          }}
        >
          ← Volver al plan
        </a>
        <h1 className="guided-session-title">Práctica guiada</h1>
      </header>

      <section className="guided-session-content">
        <div className="guided-session-exercise">
          <h2 className="guided-session-exercise-name">{currentExercise.name}</h2>
          <p className="guided-session-exercise-description">{currentExercise.description}</p>

          <div className="guided-session-meta">
            <div className="guided-session-meta-item">
              <span className="guided-session-meta-label">Duración orientativa:</span>
              <span className="guided-session-meta-value">{currentExercise.duration} ({durationMinutes} min)</span>
            </div>
            <div className="guided-session-meta-item">
              <span className="guided-session-meta-label">Dificultad:</span>
              <span className="guided-session-meta-value">{currentExercise.difficulty}</span>
            </div>
            <div className="guided-session-meta-item">
              <span className="guided-session-meta-label">Zonas:</span>
              <span className="guided-session-meta-value">{currentExercise.zone.join(', ')}</span>
            </div>
          </div>

          {currentExercise.adaptation?.notes && (
            <div className="guided-session-adaptation">
              <p className="guided-session-adaptation-label">Adaptación:</p>
              <p className="guided-session-adaptation-text">{currentExercise.adaptation.notes}</p>
            </div>
          )}
        </div>

        <div className="guided-session-timer">
          <div className="guided-session-timer-display">
            <span className="guided-session-timer-label">Tiempo restante</span>
            <span className="guided-session-timer-value" aria-live="polite">
              {durationLabel}
            </span>
          </div>

          <div className="guided-session-controls">
            {!isRunning && timer === 0 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={startTimer}
              >
                Iniciar
              </button>
            )}
            {isRunning && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={pauseTimer}
              >
                Pausar
              </button>
            )}
            {!isRunning && timer > 0 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={resumeTimer}
              >
                Reanudar
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetTimer}
            >
              Reiniciar
            </button>
          </div>
        </div>

        <div className="guided-session-disclaimer" role="note">
          <svg className="guided-session-disclaimer-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M12 3.6 2.6 20h18.8L12 3.6Z" />
            <path d="M12 10v4.5" />
            <path d="M12 17.6h.01" />
          </svg>
          <p>
            <strong>Orientación de duración, no indicación clínica.</strong> Adapta el tiempo a tu ritmo.
            Si sientes dolor, incomodidad o cualquier síntoma inusual, detén la actividad inmediatamente.
          </p>
        </div>
      </section>
    </main>
  );
};

export default GuidedSessionPage;
