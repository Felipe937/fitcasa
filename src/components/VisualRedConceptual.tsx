import React, { useCallback, useEffect, useRef } from 'react';

/** Grados máximos de inclinación sobre el eje X. */
const LIMITE_INCLINACION = 9;

/** Grados máximos de giro sobre el eje Y. */
const LIMITE_GIRO = 13;

/** Grados por pulsación de teclado o de botón. */
const PASO = 4;

/** Factor de interpolación por fotograma. */
const SUAVIZADO = 0.16;

/** Altura del eje de referencia de la ilustración (unidades del viewBox). */
const EJE_Y = 268;

export interface VisualRedConceptualProps {
  /** Desactiva la animación por movimiento del puntero y del teclado. */
  reducedMotion?: boolean;
}

/**
 * Visual conceptual de la página de Actualidad.
 *
 * Representa la red conceptual vinculada al contenido científico de FITCASA:
 * dos regiones científicas cercanas a GAK y KLF12, conectadas por trayectorias
 * de asociación. La ilustración no afirma escala ni relación causal.
 *
 * Comportamiento:
 * - La escena se inclina suavemente seguido del puntero en entornos de puntero
 *   fino; en pantallas táctiles se mantiene estática.
 * - Se anula la animación si el sistema operativo o la prop `reducedMotion`
 *   indican preferencia por movimiento reducido.
 * - El teclado gira la vista con las flechas y Home la centra.
 */
export const VisualRedConceptual: React.FC<VisualRedConceptualProps> = ({
  reducedMotion = false,
}) => {
  const escenaRef = useRef<HTMLDivElement>(null);
  const estado = useRef({
    actual: { x: 0, y: 0 },
    objetivo: { x: 0, y: 0 },
    frame: 0,
  });


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

    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducir.matches || reducedMotion) {
      escena.style.setProperty('--tx', '0deg');
      escena.style.setProperty('--ty', '0deg');
      return undefined;
    }

    const punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!punteroFino.matches) return undefined;

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


  /** Giro con teclado: las flechas giran la vista y Home la centra. */
  const alPulsarTecla = (evento: React.KeyboardEvent<HTMLDivElement>) => {
    const { actual } = estado.current;
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let x = actual.x;
    let y = actual.y;

    switch (evento.key) {
      case 'ArrowLeft':
        y += PASO;
        break;
      case 'ArrowRight':
        y -= PASO;
        break;
      case 'ArrowUp':
        x += PASO;
        break;
      case 'ArrowDown':
        x -= PASO;
        break;
      case 'Home':
        x = 0;
        y = 0;
        break;
      default:
        return;
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

  return (
    <figure className='visual-asociacion visual-asociacion--red' data-reveal='science-visual'>
      <div className='visual-asociacion__marco'>
        <div
          ref={escenaRef}
          className='visual-asociacion__escena'
          role='img'
          tabIndex={0}
          aria-label='Red conceptual de FITCasa con dos regiones científicas, GAK y KLF12, conectadas por trayectorias de asociación.'
          aria-describedby='visual-red-conceptual-instruccion'
          onKeyDown={alPulsarTecla}
        >
          <div className='visual-asociacion__deriva'>
            {/* Capa 1 · malla de red sutil de fondo. */}
            <div className='visual-asociacion__capa visual-asociacion__capa--fondo'>
              <svg viewBox='0 0 640 360' aria-hidden='true' focusable='false'>
                <g className='visual-asociacion__guia'>
                  <line x1='80' y1='180' x2='200' y2='150' />
                  <line x1='80' y1='180' x2='200' y2='250' />
                  <line x1='560' y1='180' x2='440' y2='150' />
                  <line x1='560' y1='180' x2='440' y2='250' />
                  <line x1='80' y1='180' x2='560' y2='180' />
                  <line x1='200' y1='150' x2='440' y2='150' />
                  <line x1='200' y1='250' x2='440' y2='250' />
                </g>
              </svg>
            </div>

            {/* Capa 2 · dos regiones científicas centradas en la red. */}
            <div className='visual-asociacion__capa visual-asociacion__capa--picos'>
              <svg viewBox='0 0 640 360' aria-hidden='true' focusable='false'>
                <circle className='visual-asociacion__pico' cx='200' cy='268' r='24' />
                <circle className='visual-asociacion__pico' cx='440' cy='268' r='24' />
                <line className='visual-asociacion__guia' x1='200' y1='132' x2='200' y2={EJE_Y} />
                <line className='visual-asociacion__guia' x1='440' y1='132' x2='440' y2={EJE_Y} />
                <g className='visual-asociacion__marca' transform='translate(200 118)'>
                  <circle className='visual-asociacion__marca-anillo' cx='0' cy='0' r='15' />
                  <circle className='visual-asociacion__marca-nucleo' cx='0' cy='0' r='8' />
                </g>
                <g className='visual-asociacion__marca' transform='translate(440 118)'>
                  <circle className='visual-asociacion__marca-anillo' cx='0' cy='0' r='15' />
                  <circle className='visual-asociacion__marca-nucleo' cx='0' cy='0' r='8' />
                </g>
              </svg>
            </div>

            {/* Capa 3 · nodos marcados y su leyenda. */}
            <div className='visual-asociacion__capa visual-asociacion__capa--marcas'>
              <svg viewBox='0 0 640 360' aria-hidden='true' focusable='false'>
                <g className='visual-asociacion__marca' transform='translate(200 118)'>
                  <circle className='visual-asociacion__marca-anillo' cx='0' cy='0' r='15' />
                  <circle className='visual-asociacion__marca-nucleo' cx='0' cy='0' r='8' />
                </g>
                <g className='visual-asociacion__marca' transform='translate(440 118)'>
                  <circle className='visual-asociacion__marca-anillo' cx='0' cy='0' r='15' />
                  <circle className='visual-asociacion__marca-nucleo' cx='0' cy='0' r='8' />
                </g>
              </svg>
              <span className='visual-asociacion__rotulo visual-asociacion__rotulo--gak'>
                cerca de GAK
              </span>
              <span className='visual-asociacion__rotulo visual-asociacion__rotulo--klf12'>
                cerca de KLF12
              </span>
            </div>
          </div>
        </div>
        <span className='visual-asociacion__sello'>Conceptual</span>
      </div>

      <p className='sr-only' id='visual-red-conceptual-instruccion' aria-live='polite'>
        Ilustración conceptual. Con el teclado, las flechas giran la vista y Home la centra.
      </p>
    </figure>
  );
};
