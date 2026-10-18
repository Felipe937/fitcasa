import React, { useState, useCallback, useEffect } from 'react';
import { PageRoute } from '../components/Header';
import { PausaPlayer } from '../components/PausaPlayer';

type Modo = 'de-pie' | 'sentado' | 'libre';

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

export const PausasActivasPage: React.FC<PausasActivasPageProps> = ({ onNavigate }) => {
  const [durationSeconds, setDurationSeconds] = useState<number>(120);
  const [modo, setModo] = useState<Modo>('de-pie');
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [endTime, setEndTime] = useState<number | null>(null);

  const remainingSeconds = Math.max(0, durationSeconds - elapsedSeconds);

  const handleStart = useCallback(() => {
    const now = Date.now();
    const targetEndTime = endTime ?? now + remainingSeconds * 1000;
    setEndTime(targetEndTime);
    setIsRunning(true);
    setIsFinished(false);
  }, [endTime, remainingSeconds]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
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
  }, [onNavigate]);

  return (
    <main id="contenido" tabIndex={-1} className="pausas-activas-page container">
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

        <span className="pausas-activas-kicker">DESCANSOS DE MOVIMIENTO</span>
        <h1 className="pausas-activas-titulo">Pausas activas</h1>
        <p className="pausas-activas-subtitulo">
          Una herramienta sencilla para romper el sedentarismo durante el estudio o trabajo,
          facilitando descansos breves de 2 a 3 minutos sin forzar la espalda.
        </p>

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
        <h2 id="config-heading" className="sr-only">Configuración de la pausa</h2>

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
                <span>{opt.label}</span>
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
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className="pausas-activas-timer" aria-labelledby="timer-heading">
        <h2 id="timer-heading" className="sr-only">Temporizador</h2>
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