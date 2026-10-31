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
        <path d="M12 4v16" />
        <path d="M7 9c2.5-3 7.5-3 10 0" />
      </svg>
    );
  }

  if (kind === 'sentado') {
    return (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="M8 6v8h8" />
        <path d="M6 19h12" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M12 12m-6 0a6 6 0 1 1 12 0a4 4 0 1 0 -8 0a2 2 0 1 1 4 0" />
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

  // Tilt reactivo del cursor sobre la escultura (solo mouse fino, sin movimiento reducido).
  useEffect(() => {
    const marco = document.querySelector('.movement-sculpture__marco') as HTMLElement | null;
    const escena = marco?.querySelector('.movement-sculpture__escena') as HTMLElement | null;
    if (!marco || !escena) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (reducedMotion.matches || !hoverCapable.matches) {
      marco.style.setProperty('--pausa-giro-puntero', '0deg');
      return;
    }

    let rafId = 0;
    let pendingEvent: PointerEvent | null = null;

    const applyTilt = () => {
      rafId = 0;
      const ev = pendingEvent;
      pendingEvent = null;
      if (!ev) return;
      const rect = marco.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (ev.clientX - cx) / (rect.width / 2);
      const dy = (ev.clientY - cy) / (rect.height / 2);
      const clampedX = Math.max(-1, Math.min(1, dx));
      const clampedY = Math.max(-1, Math.min(1, dy));
      const fraction = Math.max(-1, Math.min(1, (clampedX + clampedY) / 2));
      const degrees = fraction * 6;
      marco.style.setProperty('--pausa-giro-puntero', `${degrees}deg`);
    };

    const handleMove = (e: PointerEvent) => {
      pendingEvent = e;
      if (!rafId) {
        rafId = requestAnimationFrame(applyTilt);
      }
    };

    const handleLeave = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      pendingEvent = null;
      escena.style.transition = 'transform 900ms var(--curva-suave, cubic-bezier(0.2, 0.8, 0.2, 1))';
      marco.style.setProperty('--pausa-giro-puntero', '0deg');
      window.setTimeout(() => {
        escena.style.transition = '';
      }, 950);
    };

    marco.addEventListener('pointermove', handleMove, { passive: true });
    marco.addEventListener('pointerleave', handleLeave);

    return () => {
      marco.removeEventListener('pointermove', handleMove);
      marco.removeEventListener('pointerleave', handleLeave);
      if (rafId) cancelAnimationFrame(rafId);
      marco.style.removeProperty('--pausa-giro-puntero');
      escena.style.transition = '';
    };
  }, []);

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
            <span className="pausas-activas-hero__numero" aria-hidden="true">01</span>
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
