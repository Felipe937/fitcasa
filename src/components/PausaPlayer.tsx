import React, { useState, useEffect } from 'react';
import { PageRoute } from '../components/Header';

type Modo = 'de-pie' | 'sentado' | 'libre';

interface PausaPlayerProps {
  durationSeconds: number;
  modo: Modo;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onRegisterInPanel?: () => void;
  onNavigate?: (page: PageRoute, sectionId?: string) => void;
  isRunning: boolean;
  isFinished: boolean;
  elapsedSeconds: number;
  remainingSeconds: number;
}

const MODO_LABELS: Record<Modo, string> = {
  'de-pie': 'De pie / En movimiento',
  sentado: 'Sentado',
  libre: 'Libre (sin indicaciones)',
};

const MODO_DESCRIPTIONS: Record<Modo, string> = {
  'de-pie':
    'Caminar suave, soltar brazos, mirar a lo lejos y estirar suavemente la coronilla hacia el techo (elongación axial libre).',
  sentado:
    'Círculos suaves con los hombros, apertura suave de pecho, respiraciones lentas y profundas, apoyar pies firmes en el suelo.',
  libre:
    'Elige tu propio descanso. No hay indicaciones visuales; muévete como te resulte cómodo.',
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const twoDigits = (value: number) => value < 10 ? `0${value}` : `${value}`;
  return `${twoDigits(mins)}:${twoDigits(secs)}`;
};

export const PausaPlayer: React.FC<PausaPlayerProps> = ({
  durationSeconds,
  modo,
  onStart,
  onPause,
  onReset,
  onRegisterInPanel,
  onNavigate,
  isRunning,
  isFinished,
  elapsedSeconds,
  remainingSeconds,
}) => {
  const progress = durationSeconds > 0 ? elapsedSeconds / durationSeconds : 0;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference * (1 - progress);
  const playerState = isFinished ? 'finished' : isRunning ? 'running' : elapsedSeconds > 0 ? 'paused' : 'ready';

  const [announcement, setAnnouncement] = useState<string>('');
  const [lastAnnouncedMinute, setLastAnnouncedMinute] = useState<number | null>(null);

  useEffect(() => {
    if (elapsedSeconds === 0) {
      setLastAnnouncedMinute(null);
    }
  }, [elapsedSeconds]);

  useEffect(() => {
    if (isRunning && !isFinished) {
      const currentMinute = Math.ceil(remainingSeconds / 60);
      if (currentMinute === 1 && lastAnnouncedMinute !== 1) {
        setAnnouncement('Queda 1 minuto de pausa');
        setLastAnnouncedMinute(1);
      }
    }
  }, [isRunning, isFinished, remainingSeconds, lastAnnouncedMinute]);

  useEffect(() => {
    if (isFinished) {
      setAnnouncement('Pausa completada');
    }
  }, [isFinished]);

  useEffect(() => {
    if (isRunning && !isFinished) {
      setAnnouncement(`Temporizador de pausa iniciado: ${Math.ceil(durationSeconds / 60)} minutos`);
    }
  }, [isRunning, durationSeconds, isFinished]);

  useEffect(() => {
    if (!isRunning && elapsedSeconds > 0 && !isFinished) {
      setAnnouncement('Temporizador pausado');
    }
  }, [isRunning, elapsedSeconds, isFinished]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (isFinished) {
        onReset();
      } else if (isRunning) {
        onPause();
      } else {
        onStart();
      }
    }
    if (e.key === 'Escape') {
      if (isRunning || elapsedSeconds > 0) {
        onPause();
      }
    }
  };

  return (
    <div
      className={`pausa-player pausa-player--${playerState}`}
      role="region"
      aria-label="Temporizador de pausa activa"
      data-state={playerState}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="pausa-player__context">
        <div className="pausa-player__modo" aria-live="polite" aria-atomic="true">
          <span className="pausa-player__modo-label">Modalidad</span>
          <strong>{MODO_LABELS[modo]}</strong>
        </div>
        <span className="pausa-player__state-label" aria-hidden="true">
          {playerState === 'running' ? 'Respira y muévete con calma' : playerState === 'paused' ? 'Puedes continuar cuando quieras' : playerState === 'finished' ? 'Buen trabajo haciendo espacio' : 'Tu tiempo empieza cuando estés listo'}
        </span>
      </div>

      {modo !== 'libre' && (
        <p className="pausa-player__descripcion" aria-live="polite" aria-atomic="true">
          {MODO_DESCRIPTIONS[modo]}
        </p>
      )}

      <div
        className="pausa-player__timer"
        role="timer"
        aria-live="off"
        aria-label={`Tiempo restante: ${formatTime(remainingSeconds)} de ${formatTime(durationSeconds)}`}
      >
        <svg
          className="pausa-player__progress-ring"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="pausa-progress-gradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-secundario)" />
              <stop offset="100%" stopColor="var(--color-terciario)" />
            </linearGradient>
          </defs>
          <circle
            className="pausa-player__progress-bg"
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="var(--color-borde)"
            strokeWidth="12"
          />
          <circle
            className="pausa-player__progress"
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#pausa-progress-gradient)"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
          <circle
            className="pausa-player__ambient-ring"
            cx="100"
            cy="100"
            r="78"
            fill="none"
            stroke="var(--color-secundario)"
            strokeWidth="1.5"
            strokeDasharray="2 9"
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div className="pausa-player__time" aria-hidden="true">
          <span className="pausa-player__time-value">{formatTime(remainingSeconds)}</span>
          <span className="pausa-player__time-total">/ {formatTime(durationSeconds)}</span>
          <span className="pausa-player__time-caption">minutos</span>
        </div>
      </div>

      <div className="pausa-player__controls" role="group" aria-label="Controles del temporizador">
        {!isFinished ? (
          <>
            {!isRunning && elapsedSeconds === 0 ? (
              <button
                type="button"
                className="btn pausa-player__btn pausa-player__btn--primary"
                onClick={onStart}
                aria-label={`Iniciar pausa de ${Math.ceil(durationSeconds / 60)} minutos`}
              >
                <svg className="pausa-player__btn-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Iniciar
              </button>
            ) : !isRunning && elapsedSeconds > 0 ? (
              <button
                type="button"
                className="btn pausa-player__btn pausa-player__btn--primary"
                onClick={onStart}
                aria-label="Reanudar pausa"
              >
                <svg className="pausa-player__btn-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Reanudar
              </button>
            ) : (
              <button
                type="button"
                className="btn pausa-player__btn pausa-player__btn--secondary"
                onClick={onPause}
                aria-label="Pausar temporizador"
              >
                <svg className="pausa-player__btn-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                Pausar
              </button>
            )}
            <button
              type="button"
              className="btn pausa-player__btn pausa-player__btn--secondary"
              onClick={onReset}
              aria-label="Reiniciar temporizador"
              disabled={elapsedSeconds === 0 && !isRunning}
            >
              <svg className="pausa-player__btn-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
              </svg>
              Reiniciar
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn pausa-player__btn pausa-player__btn--primary"
              onClick={onReset}
              aria-label="Hacer otra pausa"
            >
              <svg className="pausa-player__btn-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
              </svg>
              Otra pausa
            </button>
            <button
              type="button"
              className="btn pausa-player__btn pausa-player__btn--secondary"
              onClick={() => onNavigate?.('ejercicios')}
              aria-label="Ir a ejercicios"
            >
              <svg className="pausa-player__btn-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              Ejercicios
            </button>
            {onRegisterInPanel && (
              <button
                type="button"
                className="btn pausa-player__btn pausa-player__btn--secondary"
                onClick={onRegisterInPanel}
                aria-label="Registrar cómo me sentí en el Seguimiento"
              >
                <svg className="pausa-player__btn-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10l-5 5-3-3-1.41 1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                Registrar en Seguimiento
              </button>
            )}
          </>
        )}
      </div>

      <div
        className="pausa-player__announcer"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {announcement}
      </div>
    </div>
  );
};

export default PausaPlayer;
