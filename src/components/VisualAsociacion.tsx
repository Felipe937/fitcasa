import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Visual conceptual de la página de Actualidad.
 *
 * Reglas de honestidad conceptual que gobiernan este componente:
 * - No dibuja relaciones entre genes: los dos picos son independientes y no
 *   están unidos por ninguna línea.
 * - No dibuja una escala: las alturas no son datos. El rótulo lo dice de forma
 *   visible, en el pie de la figura.
 * - No usa una leyenda de color: los dos picos comparten forma y color, y cada
 *   uno lleva su propio rótulo de texto.
 * - Todo el arte es SVG y CSS propio, generado en el código.
 */

const LIMITE_INCLINACION = 9; // grados en el eje X
const LIMITE_GIRO = 13; // grados en el eje Y
const PASO = 4; // grados por pulsación de teclado o de botón
const SUAVIZADO = 0.16; // factor de interpolación por fotograma

/** Altura del eje de referencia de la ilustración (en unidades de viewBox). */
const EJE_Y = 268;

export const VisualAsociacion: React.FC = () => {
  const escenaRef = useRef<HTMLDivElement>(null);
  const [pausado, setPausado] = useState(false);
  const estado = useRef({ actual: { x: 0, y: 0 }, objetivo: { x: 0, y: 0 }, frame: 0 });

  /** Escribe la inclinación en variables CSS: la escena no re-renderiza. */
  const escribir = useCallback(() => {
    const escena = escenaRef.current;
    if (!escena) return;
    const { actual } = estado.current;
    escena.style.setProperty('--tx', `${actual.x.toFixed(2)}deg`);
    escena.style.setProperty('--ty', `${actual.y.toFixed(2)}deg`);
  }, []);

  const animar = useCallback(() => {
    const e = estado.current;
    e.frame = 0;
    const { actual, objetivo } = e;
    const nx = actual.x + (objetivo.x - actual.x) * SUAVIZADO;
    const ny = actual.y + (objetivo.y - actual.y) * SUAVIZADO;
    actual.x = Math.abs(objetivo.x - nx) < 0.05 ? objetivo.x : nx;
    actual.y = Math.abs(objetivo.y - ny) < 0.05 ? objetivo.y : ny;
    escribir();
    if (actual.x !== objetivo.x || actual.y !== objetivo.y) {
      e.frame = requestAnimationFrame(animar);
    }
  }, [escribir]);

  const fijarObjetivo = useCallback((x: number, y: number) => {
    const e = estado.current;
    e.objetivo = {
      x: Math.max(-LIMITE_INCLINACION, Math.min(LIMITE_INCLINACION, x)),
      y: Math.max(-LIMITE_GIRO, Math.min(LIMITE_GIRO, y)),
    };
    if (!e.frame) e.frame = requestAnimationFrame(animar);
  }, [animar]);

  // Inclinación suave al puntero fino. En táctil no se registra: el dedo
  // pertenece a la página y el gesto vertical debe seguir desplazando.
  useEffect(() => {
    const escena = escenaRef.current;
    if (!escena) return undefined;
    const marco = escena.closest('.visual-asociacion__marco');
    if (!(marco instanceof HTMLElement)) return undefined;

    const punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!punteroFino.matches || reducir.matches) return undefined;

    const alMover = (evento: PointerEvent) => {
      const caja = marco.getBoundingClientRect();
      if (caja.width === 0 || caja.height === 0) return;
      const dx = (evento.clientX - caja.left) / caja.width - 0.5;
      const dy = (evento.clientY - caja.top) / caja.height - 0.5;
      fijarObjetivo(-dy * LIMITE_INCLINACION * 2, dx * LIMITE_GIRO * 2);
    };
    const alSalir = () => fijarObjetivo(0, 0);

    marco.addEventListener('pointermove', alMover, { passive: true });
    marco.addEventListener('pointerleave', alSalir, { passive: true });
    return () => {
      marco.removeEventListener('pointermove', alMover);
      marco.removeEventListener('pointerleave', alSalir);
      if (estado.current.frame) cancelAnimationFrame(estado.current.frame);
    };
  }, [fijarObjetivo]);

  /** Giro con teclado: las flechas mueven la vista, como en la columna de escoliosis. */
  const alPulsarTecla = (evento: React.KeyboardEvent<HTMLDivElement>) => {
    const { actual } = estado.current;
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let x = actual.x;
    let y = actual.y;

    switch (evento.key) {
      case 'ArrowLeft': y += PASO; break;
      case 'ArrowRight': y -= PASO; break;
      case 'ArrowUp': x += PASO; break;
      case 'ArrowDown': x -= PASO; break;
      case 'Home': x = 0; y = 0; break;
      default: return;
    }

    evento.preventDefault();
    if (reducir) {
      // Sin animación: la vista cambia de golpe pero la información no se pierde.
      estado.current.actual = { x, y };
      estado.current.objetivo = { x, y };
      escribir();
      return;
    }
    fijarObjetivo(x, y);
  };

  const girar = (dx: number, dy: number) => {
    const { actual } = estado.current;
    fijarObjetivo(actual.x + dy, actual.y + dx);
  };

  return (
    <figure
      className={`visual-asociacion${pausado ? ' visual-asociacion--pausado' : ''}`}
      data-reveal="science-visual"
    >
      <div className="visual-asociacion__marco">
        <div
          ref={escenaRef}
          className="visual-asociacion__escena"
          role="img"
          tabIndex={0}
          aria-label="Ilustración conceptual de un paisaje de asociación con dos picos separados, rotulados cerca de GAK y cerca de KLF12. Las alturas no representan datos y los dos picos no se relacionan entre sí."
          aria-describedby="visual-asociacion-instruccion"
          onKeyDown={alPulsarTecla}
        >
          <div className="visual-asociacion__deriva">
            {/* Capa 1 · fondo: el suelo y la penumbra de cada pico. */}
            <div className="visual-asociacion__capa visual-asociacion__capa--fondo">
              <svg viewBox="0 0 640 360" aria-hidden="true" focusable="false">
                <g className="visual-asociacion__penumbra" transform="translate(200 118)">
                  <ellipse cx="0" cy="0" rx="168" ry="98" />
                </g>
                <g className="visual-asociacion__penumbra" transform="translate(440 118)">
                  <ellipse cx="0" cy="0" rx="168" ry="98" />
                </g>
                <line
                  className="visual-asociacion__eje"
                  x1="56" y1={EJE_Y} x2="584" y2={EJE_Y}
                />
              </svg>
            </div>

            {/* Capa 2 · picos: dos siluetas idénticas, sin relación entre ellas. */}
            <div className="visual-asociacion__capa visual-asociacion__capa--picos">
              <svg viewBox="0 0 640 360" aria-hidden="true" focusable="false">
                <g transform="translate(200 118)">
                  <path
                    className="visual-asociacion__pico"
                    d="M -104 150 C -58 150 -46 0 0 0 C 46 0 58 150 104 150 Z"
                  />
                </g>
                <g transform="translate(440 118)">
                  <path
                    className="visual-asociacion__pico"
                    d="M -104 150 C -58 150 -46 0 0 0 C 46 0 58 150 104 150 Z"
                  />
                </g>
              </svg>
            </div>

            {/* Capa 3 · marcas: el punto señalado y su rótulo. */}
            <div className="visual-asociacion__capa visual-asociacion__capa--marcas">
              <svg viewBox="0 0 640 360" aria-hidden="true" focusable="false">
                <line className="visual-asociacion__guia" x1="200" y1="132" x2="200" y2={EJE_Y} />
                <line className="visual-asociacion__guia" x1="440" y1="132" x2="440" y2={EJE_Y} />
                <g className="visual-asociacion__marca" transform="translate(200 118)">
                  <circle className="visual-asociacion__marca-anillo" cx="0" cy="0" r="15" />
                  <circle className="visual-asociacion__marca-nucleo" cx="0" cy="0" r="8" />
                </g>
                <g className="visual-asociacion__marca" transform="translate(440 118)">
                  <circle className="visual-asociacion__marca-anillo" cx="0" cy="0" r="15" />
                  <circle className="visual-asociacion__marca-nucleo" cx="0" cy="0" r="8" />
                </g>
              </svg>
              <span className="visual-asociacion__rotulo visual-asociacion__rotulo--gak">
                cerca de GAK
              </span>
              <span className="visual-asociacion__rotulo visual-asociacion__rotulo--klf12">
                cerca de KLF12
              </span>
            </div>
          </div>
        </div>
        <span className="visual-asociacion__sello">Conceptual</span>
      </div>

      <div className="visual-asociacion__barra">
        <div className="visual-asociacion__giro" role="group" aria-label="Girar la ilustración">
          <button
            type="button"
            className="visual-asociacion__boton"
            onClick={() => girar(-PASO, 0)}
            aria-label="Girar la ilustración a la izquierda"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className="visual-asociacion__boton"
            onClick={() => girar(PASO, 0)}
            aria-label="Girar la ilustración a la derecha"
          >
            <span aria-hidden="true">→</span>
          </button>
          <button
            type="button"
            className="visual-asociacion__boton"
            onClick={() => girar(0, PASO)}
            aria-label="Inclinar la ilustración hacia arriba"
          >
            <span aria-hidden="true">↑</span>
          </button>
          <button
            type="button"
            className="visual-asociacion__boton"
            onClick={() => girar(0, -PASO)}
            aria-label="Inclinar la ilustración hacia abajo"
          >
            <span aria-hidden="true">↓</span>
          </button>
        </div>
        <button
          type="button"
          className="visual-asociacion__pausa"
          onClick={() => setPausado((valor) => !valor)}
        >
          {pausado ? 'Reanudar movimiento' : 'Pausar movimiento'}
        </button>
        <p className="sr-only" id="visual-asociacion-instruccion" aria-live="polite">
          {pausado
            ? 'Movimiento pausado.'
            : 'Ilustración conceptual. Con el teclado, las flechas giran la vista y Inicio la recentra.'}
        </p>
      </div>

      <figcaption className="visual-asociacion__pie">
        <p className="visual-asociacion__nota">Forma ilustrativa; las alturas no son datos.</p>
        <p className="visual-asociacion__detalle">
          El estudio describió asociaciones en regiones cercanas a <strong>GAK</strong> y a{' '}
          <strong>KLF12</strong>. La ilustración las presenta por separado, sin sugerir relación
          entre ellas ni incluir valores con escala.
        </p>
      </figcaption>
    </figure>
  );
};

export default VisualAsociacion;
