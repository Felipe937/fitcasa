import React, { useState, useCallback, useEffect } from 'react';
import { PageRoute } from '../components/Header';
import { PausaPlayer } from '../components/PausaPlayer';

type Modo = 'de-pie' | 'sentado' | 'libre';

type OptionGlyphKind = 'duration' | Modo;

interface PausasActivasPageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

const DURATION_OPTIONS = [
  { value: 120, label: '2 minutos (120 s)' },
  { value: 180, label: '3 minutos (180 s)' },
] as const;

const MODO_OPTIONS = [
  { value: 'de-pie', label: 'De pie / En movimiento' },
  { value: 'sentado', label: 'Sentado' },
  { value: 'libre', label: 'Libre (sin indicaciones)' },
] as const;

const OptionGlyph: React.FC<{ kind: OptionGlyphKind }> = ({ kind }) => {
  if (kind === 'duration') {
    return (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5v5l3 1.75" />
      </svg>
    );
  }

  if (kind === 'de-pie') {
    return (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="M12 20V6" />
        <path d="m7.5 10.5 4.5-4.5 4.5 4.5" />
        <path d="M7 20h10" />
      </svg>
    );
  }

  if (kind === 'sentado') {
    return (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="M3 13.5c3-2.5 6-2.5 9 0s6 2.5 9 0" />
        <path d="M4 19h16" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M5 12a7 7 0 0 1 12.3-4.55M19 12a7 7 0 0 1-12.3 4.55" />
      <path d="M17 4.5v3.75h-3.75M7 19.5v-3.75h3.75" />
    </svg>
  );
};

/**
 * Escultura abstracta de cuatro capas con profundidad real (CSS 3D).
 * No representa anatomía ni figuras humanas: es una forma que acompaña el
 * cambio de ritmo. El color y la atmósfera los fija la clase de estado.
 */
const MovementSculpture: React.FC = () => (
  <figure className="movement-sculpture">
    <div className="movement-sculpture__marco">
      <div className="movement-sculpture__escena" aria-hidden="true">
        <span className="movement-sculpture__capa movement-sculpture__capa--orbita-a" />
        <span className="movement-sculpture__capa movement-sculpture__capa--orbita-b" />
        <span className="movement-sculpture__capa movement-sculpture__capa--banda" />
        <span className="movement-sculpture__capa movement-sculpture__capa--nucleo" />
      </div>
      <span className="movement-sculpture__estado" aria-hidden="true" />
      <span className="movement-sculpture__sello">PAUSA / PRESENCIA</span>
    </div>
    <figcaption className="movement-sculpture__pie">
      Una forma abstracta para acompañar el cambio de ritmo: suave, abierta y sin representar anatomía.
    </figcaption>
  </figure>
);

export const PausasActivasPage: React.FC<PausasActivasPageProps> = ({ onNavigate }) => {
  const [durationSeconds, setDurationSeconds] = useState<number>(120);
  const [modo, setModo] = useState<Modo>('de-pie');
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [endTime, setEndTime] = useState<number | null>(null);

  const remainingSeconds = Math.max(0, durationSeconds - elapsedSeconds);
  const timerState = isFinished ? 'finalizada' : isRunning ? 'en-curso' : elapsedSeconds > 0 ? 'en-pausa' : 'preparacion';

  const handleStart = useCallback(() => {
    const now = Date.now();
    const targetEndTime = now + remainingSeconds * 1000;
    setEndTime(targetEndTime);
    setIsRunning(true);
    setIsFinished(false);
  }, [remainingSeconds]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
    setEndTime(null);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsFinished(false);
    setElapsedSeconds(0);
    setEndTime(null);
  }, []);

  const handleFinish = useCallback(() => {
    setIsRunning(false);
    setIsFinished(true);
    setElapsedSeconds(durationSeconds);
    setEndTime(null);
  }, [durationSeconds]);

  useEffect(() => {
    let intervalId: number;
    if (isRunning && !isFinished) {
      intervalId = window.setInterval(() => {
        const now = Date.now();
        if (endTime) {
          const remaining = Math.ceil((endTime - now) / 1000);
          if (remaining <= 0) {
            handleFinish();
          } else {
            setElapsedSeconds(durationSeconds - remaining);
          }
        }
      }, 250);
    }
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [isRunning, isFinished, endTime, durationSeconds, handleFinish]);

  const handleNavigateToPanel = useCallback(() => {
    onNavigate('panel');
    const today = new Date().toISOString().split('T')[0];
    setTimeout(() => {
      const dateInput = document.getElementById('entry-date') as HTMLInputElement;
      const activityInput = document.getElementById('entry-activity') as HTMLInputElement;
      if (dateInput) {
        dateInput.value = today;
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (activityInput) {
        activityInput.value = `Pausa activa de movilidad (${Math.ceil(durationSeconds / 60)} min)`;
        activityInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 100);
  }, [onNavigate, durationSeconds]);

  return (
    <main id="contenido" tabIndex={-1} className={`pausas-activas-page pausas-activas-page--${timerState} container`}>
      <header className="pausas-activas-header">
        <a
          href="#inicio"
          className="pausas-activas-volver"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('inicio');
          }}
        >
          ← Volver al inicio
        </a>

        <div className="pausas-activas-hero">
          <div className="pausas-activas-hero__copy">
            <span className="pausas-activas-context">DESCANSOS DE MOVIMIENTO</span>
            <h1 className="pausas-activas-titulo">
              <span>Pausas</span>{' '}
              <span>activas</span>
            </h1>
            <p className="pausas-activas-subtitulo">
              Una herramienta sencilla para romper el sedentarismo durante el estudio o trabajo,
              facilitando descansos breves de 2 a 3 minutos sin forzar la espalda.
            </p>
            <div className="pausas-activas-hero__meta" aria-label="Duración disponible">
              <span>2–3 min</span>
              <span aria-hidden="true">·</span>
              <span>Movimiento cotidiano</span>
            </div>
          </div>
          <MovementSculpture />
        </div>

        <div className="pausas-activas-aviso" role="note">
          <svg className="pausas-activas-aviso-icono" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M12 3.6 2.6 20h18.8L12 3.6Z" />
            <path d="M12 10v4.5" />
            <path d="M12 17.6h.01" />
          </svg>
          <div>
            <strong>Recordatorio:</strong> Este temporizador promueve la movilidad general cotidiana.
            No constituye una prescripción clínica ni una rutina correctiva para la escoliosis.
            Muévete siempre en tu rango de comodidad sin forzar ninguna postura.
          </div>
        </div>
      </header>

      <section className="pausas-activas-config" aria-labelledby="config-heading">
        <div className="pausas-activas-config__intro">
          <p className="pausas-activas-marker">Antes de empezar</p>
          <h2 id="config-heading">Elige tu ritmo</h2>
          <p>Una decisión pequeña para que la pausa se sienta posible hoy.</p>
        </div>

        <div className="pausas-activas-config__fields">
          <fieldset className="pausas-activas-fieldset">
            <legend className="pausas-activas-legend">Duración</legend>
            <div className="pausas-activas-options" role="radiogroup" aria-label="Duración de la pausa">
              {DURATION_OPTIONS.map((opt) => (
                <label key={opt.value} className="pausas-activas-option">
                  <input
                    type="radio"
                    name="duration"
                    value={opt.value}
                    checked={durationSeconds === opt.value}
                    onChange={() => setDurationSeconds(opt.value)}
                    disabled={isRunning || isFinished}
                  />
                  <span className="pausas-activas-option__glyph"><OptionGlyph kind="duration" /></span>
                  <span className="pausas-activas-option__copy">{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="pausas-activas-fieldset">
            <legend className="pausas-activas-legend">Modalidad cotidiana</legend>
            <div className="pausas-activas-options" role="radiogroup" aria-label="Modalidad de la pausa">
              {MODO_OPTIONS.map((opt) => (
                <label key={opt.value} className="pausas-activas-option">
                  <input
                    type="radio"
                    name="modo"
                    value={opt.value}
                    checked={modo === opt.value}
                    onChange={() => setModo(opt.value as Modo)}
                    disabled={isRunning || isFinished}
                  />
                  <span className="pausas-activas-option__glyph"><OptionGlyph kind={opt.value} /></span>
                  <span className="pausas-activas-option__copy">{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      <section className={`pausas-activas-timer pausas-activas-timer--${timerState}`} aria-labelledby="timer-heading">
        <div className="pausas-activas-timer__heading">
          <div>
            <p className="pausas-activas-marker">Tu pausa</p>
            <h2 id="timer-heading">Quédate aquí un momento</h2>
          </div>
          <span className="pausas-activas-timer__state" aria-live="polite">
            {timerState === 'en-curso' ? 'En curso' : timerState === 'en-pausa' ? 'En pausa' : timerState === 'finalizada' ? 'Completada' : 'Lista para empezar'}
          </span>
        </div>
        <PausaPlayer
          durationSeconds={durationSeconds}
          modo={modo}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onRegisterInPanel={handleNavigateToPanel}
          onNavigate={onNavigate}
          isRunning={isRunning}
          isFinished={isFinished}
          elapsedSeconds={elapsedSeconds}
          remainingSeconds={remainingSeconds}
        />
      </section>
    </main>
  );
};

export default PausasActivasPage;
