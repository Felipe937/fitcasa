import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PageRoute } from './Header';
import {
  buscarRegla,
  RESPUESTA_FALLBACK,
  type ReglaAsistente,
} from '../data/assistant-rules';
import '../styles/navigation-assistant.css';

interface NavigationAssistantProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

const NOMBRE_DESTINO: Record<PageRoute, string> = {
  ejercicios: 'Biblioteca de ejercicios',
  'guided-session': 'Sesión guiada',
  quiz: 'Cuestionario',
  panel: 'Panel de seguimiento',
  plan: 'Mi Plan',
  apoya: 'Apoya a FitCasa',
  'pausas-activas': 'Pausas activas',
  escoliosis: 'Guía de escoliosis',
  actualidad: 'Actualidad',
  privacidad: 'Política de privacidad',
  terminos: 'Términos',
  'salud-indicadores': 'Cuerpo y salud',
  'cuerpo-y-salud': 'Cuerpo y salud',
  alimentacion: 'Alimentación',
  inicio: 'Inicio',
};

const SUGERENCIAS = [
  '¿Qué ejercicios hay?',
  '¿Qué ejercicios me convienen?',
  '¿Cómo es mi plan semanal?',
  '¿Dónde está el panel de seguimiento?',
] as const;

export const NavigationAssistant: React.FC<NavigationAssistantProps> = ({
  onNavigate,
}) => {
  const [open, setOpen] = useState(false);
  const [respondiendo, setRespondiendo] = useState(false);
  const [regla, setRegla] = useState<ReglaAsistente | null>(null);

  const btnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const abrir = useCallback(() => {
    setRespondiendo(false);
    setRegla(null);
    setOpen(true);
  }, []);

  const cerrar = useCallback(() => {
    setRespondiendo(false);
    setRegla(null);
    setOpen(false);
  }, []);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (open && event.key === 'Escape') {
        event.preventDefault();
        cerrar();
        btnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [open, cerrar]);

  useEffect(() => {
    if (open && !respondiendo) {
      inputRef.current?.focus();
    }
  }, [open, respondiendo]);

  const ejecutarBusqueda = useCallback(
    (texto: string) => {
      const rule = buscarRegla(texto);
      setRegla(rule ?? null);
      setRespondiendo(true);
      inputRef.current?.blur();
    },
    []
  );

  const handleSugerencia = useCallback(
    (texto: string) => () => {
      ejecutarBusqueda(texto);
    },
    [ejecutarBusqueda]
  );

  const handleEnviar = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      const texto = inputRef.current?.value.trim() ?? '';
      if (!texto) return;
      ejecutarBusqueda(texto);
    },
    [ejecutarBusqueda]
  );

  const handleIrADestino = useCallback(() => {
    if (!regla?.destino) return;
    onNavigate(regla.destino);
    cerrar();
    btnRef.current?.focus();
  }, [regla, onNavigate, cerrar]);

  const handleNuevaPregunta = useCallback(() => {
    setRespondiendo(false);
    setRegla(null);
    inputRef.current?.focus();
  }, []);

  const destinoLabel = regla?.destino ? NOMBRE_DESTINO[regla.destino] : null;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="nav-assistant-btn"
        aria-label="Asistente de navegación: abre el panel de ayuda"
        aria-expanded={open}
        aria-hidden={open}
        tabIndex={open ? -1 : 0}
        onClick={abrir}
      >
        Asistente
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </button>

      {open && (
        <div
          className="nav-assistant-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Asistente de navegación"
        >
          <button
            type="button"
            className="nav-assistant-cerrar"
            aria-label="Cerrar asistente"
            onClick={() => {
              cerrar();
              btnRef.current?.focus();
            }}
          >
            Cerrar
          </button>

          {!respondiendo ? (
            <>
              <p className="nav-assistant-saludo">
                Hola. ¿En qué te puedo ayudar?
              </p>
              <ul className="nav-assistant-sugerencias" role="list">
                {SUGERENCIAS.map((texto) => (
                  <li key={texto}>
                    <button
                      type="button"
                      className="nav-assistant-sugerencia"
                      onClick={handleSugerencia(texto)}
                    >
                      {texto}
                    </button>
                  </li>
                ))}
              </ul>
              <form className="nav-assistant-form" onSubmit={handleEnviar}>
                <input
                  ref={inputRef}
                  type="text"
                  className="nav-assistant-input"
                  placeholder="Escribe tu pregunta..."
                  autoComplete="off"
                  spellCheck={false}
                />
                <button type="submit" className="nav-assistant-enviar">
                  Enviar
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="nav-assistant-respuesta">
                {regla?.respuesta ?? RESPUESTA_FALLBACK}
              </p>
              {regla?.destino && destinoLabel && (
                <button
                  type="button"
                  className="nav-assistant-ir"
                  onClick={handleIrADestino}
                >
                  Ir a {destinoLabel}
                </button>
              )}
              <button
                type="button"
                className="nav-assistant-nueva"
                onClick={handleNuevaPregunta}
              >
                Nueva pregunta
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default NavigationAssistant;