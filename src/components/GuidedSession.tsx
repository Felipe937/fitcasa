import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Exercise, Duration } from '../types';
import { PosterArt } from '../pages/ExercisesPage';
import { durationLabels } from '../data/exerciseLabels';

type SessionState = 'idle' | 'running' | 'paused' | 'completed';

interface PlanContext {
  weekNumber: number;
  sessionNumber: number;
}

interface GuidedSessionProps {
  exercise: Exercise;
  planContext?: PlanContext;
  onComplete?: (durationSeconds: number) => void;
  onCancel?: () => void;
  onNavigateToPanel?: (exerciseId: string) => void;
  onReturnToPlan?: () => void;
  onReturnToLibrary?: () => void;
}

const DURATION_SECONDS: Record<Duration, number> = {
  corta: 300,
  media: 600,
  larga: 900,
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const twoDigits = (value: number) => (value < 10 ? `0${value}` : `${value}`);
  return `${twoDigits(mins)}:${twoDigits(secs)}`;
};

const estadoRevision = (exercise: Exercise): string => {
  if (!exercise.clinicalMetadata) return 'Sin revisión clínica registrada';
  if (exercise.clinicalMetadata.reviewStatus === 'revisado_profesional') {
    return 'Revisado profesionalmente';
  }
  if (exercise.clinicalMetadata.reviewStatus === 'en_revision') {
    return 'En revisión documental';
  }
  return 'Estado no registrado';
};

export const GuidedSession: React.FC<GuidedSessionProps> = ({
  exercise,
  planContext,
  onComplete,
  onCancel,
  onNavigateToPanel,
  onReturnToPlan,
  onReturnToLibrary,
}) => {
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [referenceReached, setReferenceReached] = useState(false);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedWhenPausedRef = useRef(0);
  const announcementRef = useRef<string>('');

  const totalSeconds = DURATION_SECONDS[exercise.duration];
  const hasReferenceDuration = totalSeconds > 0;
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
  const progress = hasReferenceDuration ? elapsedSeconds / totalSeconds : 0;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference * (1 - progress);

  const speak = useCallback(
    (text: string) => {
      if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    },
    [voiceEnabled],
  );

  const announce = useCallback((text: string) => {
    announcementRef.current = text;
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const tick = useCallback(() => {
    if (sessionState !== 'running' || !startTimeRef.current) return;
    const now = Date.now();
    const activeElapsed = Math.floor((now - startTimeRef.current) / 1000);
    const next = elapsedWhenPausedRef.current + activeElapsed;
    if (next >= totalSeconds) {
      setElapsedSeconds(totalSeconds);
      setReferenceReached(true);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      announce('Se ha alcanzado el tiempo de referencia sugerido para este ejercicio');
    } else {
      setElapsedSeconds(next);
    }
  }, [sessionState, totalSeconds, elapsedWhenPausedRef, startTimeRef]);

  useEffect(() => {
    if (sessionState === 'running') {
      startTimeRef.current = Date.now();
      timerRef.current = window.setInterval(tick, 1000);
      tick();
    } else {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (sessionState === 'paused') {
        elapsedWhenPausedRef.current = elapsedSeconds;
        startTimeRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [sessionState, tick, elapsedSeconds]);

  const handleStart = () => {
    setReferenceReached(false);
    setSessionState('running');
    setElapsedSeconds(0);
    elapsedWhenPausedRef.current = 0;
    speak(`Iniciando ${exercise.name}. ${exercise.description}`);
    announce(`Sesión iniciada: ${exercise.name}`);
  };

  const handlePause = () => {
    setSessionState('paused');
    speak('Pausa');
    announce('Sesión pausada');
  };

  const handleResume = () => {
    setSessionState('running');
    speak('Continuando');
    announce('Sesión reanudada');
  };

  const handleReset = () => {
    setSessionState('idle');
    setElapsedSeconds(0);
    setReferenceReached(false);
    elapsedWhenPausedRef.current = 0;
    startTimeRef.current = null;
    speak('Reiniciando');
    announce('Sesión reiniciada');
  };

  const handleFinish = () => {
    setSessionState('completed');
    speak('Sesión finalizada');
    announce('Sesión finalizada');
    setShowCompleteDialog(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelConfirm(false);
    if (onCancel) onCancel();
  };

  const handleReturnToPlanClick = () => {
    if (onComplete) {
      onComplete(elapsedSeconds);
    }
    if (onReturnToPlan) {
      onReturnToPlan();
    }
  };

  const handleReturnToLibraryClick = () => {
    if (onReturnToLibrary) {
      onReturnToLibrary();
    }
  };

  const handleRegisterInPanel = () => {
    if (onNavigateToPanel) {
      onNavigateToPanel(exercise.id);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (sessionState === 'running' || sessionState === 'paused') {
        setShowCancelConfirm(true);
      }
    }
    if (e.key === ' ' || e.key === 'Enter') {
      if (e.target === e.currentTarget) {
        e.preventDefault();
        if (sessionState === 'idle') {
          handleStart();
        } else if (sessionState === 'running') {
          handlePause();
        } else if (sessionState === 'paused') {
          handleResume();
        }
      }
    }
  };

  const voiceAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const statusText = {
    idle: 'Lista para iniciar',
    running: 'En curso',
    paused: 'Pausada',
    completed: 'Completada',
  }[sessionState];

  return (
    <div
      className="guided-session"
      role="region"
      aria-label={`Sesión guiada: ${exercise.name}`}
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      <header className="guided-session__header">
        <button
          type="button"
          className="guided-session__back-btn"
          onClick={() => setShowCancelConfirm(true)}
          aria-label="Cancelar sesión y volver"
        >
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Cancelar
        </button>
        <div
          className="guided-session__status-badge"
          aria-live="polite"
          role="status"
          aria-atomic="true"
        >
          {statusText}
        </div>
      </header>

      <div className="guided-session__content">
        <div className="guided-session__visual">
          <PosterArt exercise={exercise} />
        </div>

        <div className="guided-session__info">
          <h1 className="guided-session__title">{exercise.name}</h1>
          <div className="guided-session__meta">
            {hasReferenceDuration && (
              <span className="guided-session__duration">
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
                {durationLabels[exercise.duration]} referencia
              </span>
            )}
            <span className="guided-session__difficulty">
              {exercise.difficulty}
            </span>
            <span className="guided-session__review" aria-label={`Estado de revisión: ${estadoRevision(exercise)}`}>
              {estadoRevision(exercise)}
            </span>
          </div>

          <p className="guided-session__description">{exercise.description}</p>

          {exercise.adaptation?.notes && (
            <div className="guided-session__adaptation">
              <h3>Adaptación</h3>
              <p>{exercise.adaptation.notes}</p>
            </div>
          )}

          {exercise.clinicalMetadata?.precautions && exercise.clinicalMetadata.precautions.length > 0 && (
            <div className="guided-session__precautions">
              <h3>Precauciones</h3>
              <ul>
                {exercise.clinicalMetadata.precautions.map((precaution, index) => (
                  <li key={index}>{precaution}</li>
                ))}
              </ul>
            </div>
          )}

          {exercise.clinicalMetadata?.contraindications && exercise.clinicalMetadata.contraindications.length > 0 && (
            <div className="guided-session__contraindications">
              <h3>Contraindicaciones</h3>
              <ul>
                {exercise.clinicalMetadata.contraindications.map((contraindication, index) => (
                  <li key={index}>{contraindication}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {hasReferenceDuration && (
          <div
            className="guided-session__timer"
            role="timer"
            aria-live="off"
            aria-label={`Tiempo transcurrido: ${formatTime(elapsedSeconds)} de ${formatTime(totalSeconds)}, referencia de ${durationLabels[exercise.duration]}`}
          >
            <svg
              className="guided-session__progress-ring"
              viewBox="0 0 200 200"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="guided-progress-gradient" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-secundario)" />
                  <stop offset="100%" stopColor="var(--color-secundario-oscuro)" />
                </linearGradient>
              </defs>
              <circle
                className="guided-session__progress-bg"
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="var(--color-borde)"
                strokeWidth="12"
              />
              <circle
                className="guided-session__progress"
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="url(#guided-progress-gradient)"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div className="guided-session__time-display">
              <span className="guided-session__time-value">{formatTime(remainingSeconds)}</span>
              <span className="guided-session__time-label">restantes de referencia</span>
            </div>
            {referenceReached && (
              <p className="guided-session__reference-note">
                Tiempo de referencia alcanzado. Puedes continuar o finalizar cuando lo decidas.
              </p>
            )}
          </div>
        )}

        <div className="guided-session__controls" role="group" aria-label="Controles de la sesión">
          {sessionState === 'idle' && (
            <button
              type="button"
              className="btn guided-session__btn guided-session__btn--primary"
              onClick={handleStart}
              aria-label={`Iniciar sesión de ${exercise.name}`}
            >
              <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Iniciar
            </button>
          )}

          {sessionState === 'running' && (
            <>
              <button
                type="button"
                className="btn guided-session__btn guided-session__btn--secondary"
                onClick={handlePause}
                aria-label="Pausar sesión"
              >
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                Pausar
              </button>
              <button
                type="button"
                className="btn guided-session__btn guided-session__btn--secondary"
                onClick={handleFinish}
                aria-label="Finalizar sesión"
              >
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                Finalizar
              </button>
            </>
          )}

          {sessionState === 'paused' && (
            <>
              <button
                type="button"
                className="btn guided-session__btn guided-session__btn--primary"
                onClick={handleResume}
                aria-label="Reanudar sesión"
              >
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Reanudar
              </button>
              <button
                type="button"
                className="btn guided-session__btn guided-session__btn--secondary"
                onClick={handleReset}
                aria-label="Reiniciar sesión"
              >
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                </svg>
                Reiniciar
              </button>
            </>
          )}

          {sessionState === 'completed' && (
            <>
              <button
                type="button"
                className="btn guided-session__btn guided-session__btn--primary"
                onClick={handleReset}
                aria-label="Repetir ejercicio"
              >
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                </svg>
                Repetir
              </button>
            </>
          )}

          {voiceAvailable && (
            <button
              type="button"
              className={`guided-session__voice-toggle ${voiceEnabled ? 'guided-session__voice-toggle--active' : ''}`}
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              aria-label={voiceEnabled ? 'Desactivar voz' : 'Activar voz'}
              aria-pressed={voiceEnabled}
            >
              <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                {voiceEnabled ? (
                  <>
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </>
                ) : (
                  <>
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </>
                )}
              </svg>
              {voiceEnabled ? 'Voz activa' : 'Activar voz'}
            </button>
          )}
        </div>

        <div
          className="guided-session__announcer"
          aria-live="polite"
          aria-atomic="true"
          role="status"
        >
          {announcementRef.current}
        </div>
      </div>

      {showCancelConfirm && (
        <div
          className="guided-session__dialog"
          role="alertdialog"
          aria-labelledby="cancel-heading"
          aria-describedby="cancel-body"
        >
          <h2 id="cancel-heading">¿Cancelar la sesión?</h2>
          <p id="cancel-body">
            Perderás el progreso actual. Puedes volver a iniciar este ejercicio desde la biblioteca cuando quieras.
          </p>
          <div className="guided-session__dialog-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() => setShowCancelConfirm(false)}
            >
              Continuar sesión
            </button>
            <button
              type="button"
              className="btn"
              onClick={handleCancelConfirm}
            >
              Cancelar y salir
            </button>
          </div>
        </div>
      )}

      {showCompleteDialog && (
        <div
          className="guided-session__dialog guided-session__dialog--success"
          role="dialog"
          aria-labelledby="complete-heading"
          aria-describedby="complete-body"
        >
          <h2 id="complete-heading">Sesión finalizada</h2>
          <p id="complete-body">
            Has finalizado la sesión de <strong>{exercise.name}</strong> ({formatTime(elapsedSeconds)} transcurridos).
          </p>
          <div className="guided-session__dialog-actions">
            {planContext && onReturnToPlan && (
              <button
                type="button"
                className="btn guided-session__dialog-btn--primary"
                onClick={handleReturnToPlanClick}
              >
                Volver al plan
              </button>
            )}
            {onReturnToLibrary && (
              <button
                type="button"
                className="btn guided-session__dialog-btn--secondary"
                onClick={handleReturnToLibraryClick}
              >
                Volver a la biblioteca
              </button>
            )}
            {onNavigateToPanel && (
              <button
                type="button"
                className="btn guided-session__dialog-btn--secondary"
                onClick={handleRegisterInPanel}
              >
                Registrar cómo me sentí
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidedSession;
