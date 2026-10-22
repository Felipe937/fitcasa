import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Columna vertebral explorable del hero de escoliosis.
 *
 * Tres vistas esquemáticas (frontal, lateral y rotación axial) que se cambian
 * conmutando capas, más una inclinación 3D controlada por arrastre (ratón y
 * táctil) y por flechas del teclado.
 *
 * Regla clínica: las vistas muestran la anatomía escoliótica en distintos
 * planos. NINGUNA vista muestra la curva enderezándose, corrigiéndose ni
 * pasando de curvada a recta, ni existe comparativa antes/después.
 */

type Vista = 'frontal' | 'lateral' | 'rotacion';

interface Giro {
  x: number;
  y: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const ETIQUETAS_VISTA: Record<Vista, string> = {
  frontal: 'Vista frontal',
  lateral: 'Vista lateral',
  rotacion: 'Rotación vertebral',
};

/** Vista frontal: columna en S con arco de Cobb (esquema del propio repo). */
const VistaFrontal: React.FC = () => (
  <svg
    className="scoliosis-vista"
    viewBox="0 0 420 580"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="cfront-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--color-salvia-claro)" />
        <stop offset="42%" stopColor="var(--color-secundario)" />
        <stop offset="100%" stopColor="var(--color-secundario-oscuro)" />
      </linearGradient>
      <linearGradient id="cfront-disco" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--color-primario-oscuro)" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#051412" stopOpacity="0.9" />
      </linearGradient>
      <radialGradient id="cfront-glow" cx="50%" cy="45%" r="62%">
        <stop offset="0%" stopColor="var(--color-salvia-claro)" stopOpacity="0.2" />
        <stop offset="60%" stopColor="var(--color-salvia-claro)" stopOpacity="0.05" />
        <stop offset="100%" stopColor="var(--color-salvia-claro)" stopOpacity="0" />
      </radialGradient>
      <pattern id="cfront-grid" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.1" fill="var(--color-salvia-claro)" opacity="0.16" />
      </pattern>
      <filter id="cfront-blur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
      <g id="cfront-vert">
        <rect x="-45" y="-7" width="18" height="10" rx="5" fill="var(--color-secundario)" />
        <rect x="27" y="-7" width="18" height="10" rx="5" fill="var(--color-secundario)" />
        <path d="M 22 -4 L 54 4 L 22 12 Z" fill="var(--color-secundario-oscuro)" />
        <rect x="-29" y="-15" width="58" height="30" rx="13" fill="url(#cfront-grad)" />
        <rect x="-25" y="-15" width="50" height="4.5" rx="2.25" fill="var(--color-superficie)" opacity="0.5" />
      </g>
    </defs>

    <rect width="420" height="580" fill="url(#cfront-grid)" />
    <circle cx="210" cy="290" r="215" fill="url(#cfront-glow)" />

    <ellipse cx="210" cy="554" rx="124" ry="12" fill="#000" opacity="0.32" filter="url(#cfront-blur)" />
    <line x1="210" y1="40" x2="210" y2="540" stroke="var(--color-salvia-claro)" strokeWidth="1.5" strokeDasharray="5 7" opacity="0.4" />

    <g fill="none" stroke="var(--color-salvia-claro)" opacity="0.15" strokeLinecap="round">
      <path d="M 216 342 C 156 332 116 364 102 416" strokeWidth="2.8" />
      <path d="M 222 308 C 164 298 124 328 112 378" strokeWidth="2.8" />
      <path d="M 226 274 C 172 266 138 294 124 342" strokeWidth="2.6" />
      <path d="M 204 342 C 264 332 304 364 318 416" strokeWidth="2.8" />
      <path d="M 198 308 C 256 298 296 328 308 378" strokeWidth="2.8" />
      <path d="M 194 274 C 248 266 282 294 296 342" strokeWidth="2.6" />
    </g>

    <path
      d="M 210 534 C 188 466 242 404 216 344 C 188 288 238 234 212 174 C 200 138 202 104 212 70"
      fill="none"
      stroke="var(--color-primario-oscuro)"
      strokeWidth="5"
      strokeDasharray="2 10"
      opacity="0.55"
    />

    <g fill="url(#cfront-disco)">
      <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(198 496) rotate(-2)" />
      <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(198 458) rotate(3)" />
      <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(202 420) rotate(8)" />
      <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(209 382) rotate(11)" />
      <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(217 344) rotate(10)" />
      <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(222 306) rotate(3)" />
      <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(220 268) rotate(-6)" />
      <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(213 230) rotate(-11)" />
      <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(205 192) rotate(-10)" />
      <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(199 154) rotate(-5)" />
      <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(199 116) rotate(3)" />
    </g>

    <g>
      <use href="#cfront-vert" transform="translate(198 514) rotate(-3)" />
      <use href="#cfront-vert" transform="translate(197 476) rotate(0)" />
      <use href="#cfront-vert" transform="translate(199 438) rotate(6)" />
      <use href="#cfront-vert" transform="translate(205 400) rotate(10)" />
      <use href="#cfront-vert" transform="translate(213 362) rotate(12)" />
      <use href="#cfront-vert" transform="translate(221 324) rotate(8)" />
      <use href="#cfront-vert" transform="translate(223 286) rotate(-3)" />
      <use href="#cfront-vert" transform="translate(217 248) rotate(-10)" />
      <use href="#cfront-vert" transform="translate(209 210) rotate(-12)" />
      <use href="#cfront-vert" transform="translate(201 172) rotate(-9)" />
      <use href="#cfront-vert" transform="translate(197 134) rotate(0)" />
      <use href="#cfront-vert" transform="translate(201 96) rotate(6)" />
    </g>

    <line x1="160" y1="210" x2="265" y2="188" stroke="var(--color-salvia-claro)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
    <line x1="165" y1="365" x2="275" y2="385" stroke="var(--color-salvia-claro)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

    <path d="M 210 314 L 276 314 A 66 66 0 0 0 256 374" fill="none" stroke="var(--color-terciario)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 256 374 L 261 364 M 256 374 L 249 367" fill="none" stroke="var(--color-terciario)" strokeWidth="2" strokeLinecap="round" />

    <g transform="translate(284, 314)">
      <rect
        className="scoliosis-vista__pastilla"
        x="-4"
        y="-12"
        width="94"
        height="34"
        rx="6"
        fill="var(--color-primario-oscuro)"
        opacity="0.75"
      />
      <text x="0" y="3" fill="var(--color-salvia-claro)" fontSize="11" fontWeight="800" letterSpacing="0.06em">ÁNGULO COBB</text>
      <text x="0" y="17" fill="var(--color-terciario)" fontSize="10.5" fontWeight="700">Evaluación tridimensional</text>
    </g>

    <g fill="var(--color-salvia-claro)" fontSize="10.5" fontWeight="800" letterSpacing="0.08em" opacity="0.8">
      <text x="32" y="104" textAnchor="start">C1–C7 CERVICAL</text>
      <text x="24" y="302" textAnchor="start">T1–T12 TORÁCICA</text>
      <text x="32" y="504" textAnchor="start">L1–L5 LUMBAR</text>
    </g>
  </svg>
);

/** Vista lateral: curvas sagitales (lordosis/cifosis). */
const VistaLateral: React.FC = () => (
  <svg
    className="scoliosis-vista"
    viewBox="0 0 420 580"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="clat-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--color-salvia-claro)" />
        <stop offset="45%" stopColor="var(--color-secundario)" />
        <stop offset="100%" stopColor="var(--color-secundario-oscuro)" />
      </linearGradient>
      <pattern id="clat-grid" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.1" fill="var(--color-salvia-claro)" opacity="0.16" />
      </pattern>
      <filter id="clat-blur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>

    <rect width="420" height="580" fill="url(#clat-grid)" />
    <ellipse cx="210" cy="552" rx="120" ry="12" fill="#000" opacity="0.3" filter="url(#clat-blur)" />

    <line x1="120" y1="46" x2="120" y2="540" stroke="var(--color-salvia-claro)" strokeWidth="1.5" strokeDasharray="5 7" opacity="0.4" />

    <path
      d="M 216 62 C 240 112 246 168 222 222 C 198 276 186 332 202 384 C 218 436 248 486 236 540"
      fill="none"
      stroke="var(--color-primario-oscuro)"
      strokeWidth="4.5"
      strokeDasharray="2 9"
      opacity="0.5"
    />

    <g fill="url(#clat-grad)" stroke="var(--color-salvia-claro)" strokeWidth="0.75" strokeOpacity="0.4">
      <rect x="196" y="66" width="40" height="26" rx="9" transform="rotate(6 216 79)" />
      <rect x="200" y="100" width="40" height="26" rx="9" transform="rotate(3 220 113)" />
      <rect x="202" y="134" width="40" height="26" rx="9" transform="rotate(0 222 147)" />
      <rect x="202" y="168" width="40" height="26" rx="9" transform="rotate(-2 222 181)" />
      <rect x="202" y="202" width="40" height="26" rx="9" transform="rotate(-4 222 215)" />
      <rect x="204" y="236" width="40" height="26" rx="9" transform="rotate(-7 224 249)" />
      <rect x="206" y="270" width="40" height="26" rx="9" transform="rotate(-9 226 283)" />
      <rect x="210" y="304" width="40" height="26" rx="9" transform="rotate(-10 230 317)" />
      <rect x="214" y="338" width="40" height="26" rx="9" transform="rotate(-9 234 351)" />
      <rect x="218" y="372" width="40" height="26" rx="9" transform="rotate(-7 238 385)" />
      <rect x="222" y="406" width="40" height="26" rx="9" transform="rotate(-4 242 419)" />
      <rect x="224" y="440" width="40" height="26" rx="9" transform="rotate(-1 244 453)" />
      <rect x="224" y="474" width="40" height="26" rx="9" transform="rotate(2 244 487)" />
      <rect x="220" y="508" width="40" height="26" rx="9" transform="rotate(5 240 521)" />
    </g>

    <g fill="var(--color-salvia-claro)" fontSize="10.5" fontWeight="800" letterSpacing="0.08em" opacity="0.85">
      <text x="262" y="120" textAnchor="start">CERVICAL</text>
      <text x="150" y="300" textAnchor="start">TORÁCICA</text>
      <text x="262" y="470" textAnchor="start">LUMBAR</text>
    </g>
    <g fill="var(--color-salvia-claro)" fontSize="9.5" fontWeight="700" opacity="0.7">
      <text x="262" y="134" textAnchor="start">lordosis</text>
      <text x="150" y="314" textAnchor="start">cifosis</text>
      <text x="262" y="484" textAnchor="start">lordosis</text>
    </g>

    <g fill="var(--color-salvia-claro)" opacity="0.5">
      <circle cx="58" cy="60" r="2.2" />
      <circle cx="362" cy="120" r="2" />
      <circle cx="352" cy="500" r="2.2" />
    </g>
  </svg>
);

/** Vista axial: rotación del cuerpo vertebral vista desde arriba. */
const VistaRotacion: React.FC = () => (
  <svg
    className="scoliosis-vista"
    viewBox="0 0 420 580"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="crot-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--color-salvia-claro)" />
        <stop offset="45%" stopColor="var(--color-secundario)" />
        <stop offset="100%" stopColor="var(--color-secundario-oscuro)" />
      </linearGradient>
      <pattern id="crot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.1" fill="var(--color-salvia-claro)" opacity="0.16" />
      </pattern>
    </defs>

    <rect width="420" height="580" fill="url(#crot-grid)" />

    <g fill="none" stroke="var(--color-terciario)" strokeWidth="2.5" strokeLinecap="round" opacity="0.9">
      <path d="M 128 208 A 150 150 0 1 1 292 208" />
      <path d="M 292 208 l -12 -2 l 6 12 z" fill="var(--color-terciario)" stroke="none" />
    </g>
    <text x="210" y="196" textAnchor="middle" fill="var(--color-terciario-oscuro)" fontSize="10.5" fontWeight="800" letterSpacing="0.08em">
      ROTACIÓN
    </text>

    <ellipse cx="210" cy="392" rx="92" ry="66" fill="url(#crot-grad)" />
    <ellipse cx="210" cy="392" rx="92" ry="66" fill="none" stroke="var(--color-salvia-claro)" strokeWidth="0.75" opacity="0.4" />

    <circle cx="210" cy="290" r="32" fill="var(--color-primario-oscuro)" opacity="0.14" />
    <circle cx="210" cy="290" r="32" fill="none" stroke="var(--color-salvia-claro)" strokeWidth="1" opacity="0.5" />

    <path d="M 182 276 L 210 168 L 238 276 Z" fill="var(--color-secundario)" />
    <path d="M 182 276 L 210 168 L 238 276" fill="none" stroke="var(--color-salvia-claro)" strokeWidth="0.75" opacity="0.4" />

    <path d="M 180 292 L 118 306 L 186 322 Z" fill="var(--color-secundario)" />
    <path d="M 240 292 L 302 306 L 234 322 Z" fill="var(--color-secundario)" />

    <circle cx="210" cy="392" r="120" fill="none" stroke="var(--color-salvia-claro)" strokeWidth="1" opacity="0.25" />

    <g fill="var(--color-salvia-claro)" fontSize="10.5" fontWeight="800" letterSpacing="0.08em" opacity="0.85">
      <text x="210" y="520" textAnchor="middle">VISTA AXIAL</text>
    </g>
    <text x="210" y="536" textAnchor="middle" fill="var(--color-salvia-claro)" fontSize="9.5" fontWeight="700" opacity="0.75">
      rotación del cuerpo vertebral
    </text>
  </svg>
);

/** Límites del giro: no se sale del esquema ni se pierde la lectura. */
const LIMITE_INCLINACION = 24;
const LIMITE_GIRO = 32;
const PASO = 7;
const SENSIBILIDAD = 0.3;

export const ColumnaExplorable: React.FC = () => {
  const [vista, setVista] = useState<Vista>('frontal');
  const [pausado, setPausado] = useState(false);

  // El giro vive fuera de React: se escribe en variables CSS para no
  // renderizar el árbol en cada `pointermove`.
  const raizRef = useRef<HTMLDivElement | null>(null);
  const giroElRef = useRef<HTMLDivElement | null>(null);
  const giroRef = useRef<Giro>({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const arrastreRef = useRef(false);
  const punteroRef = useRef('');
  const ultimoRef = useRef({ x: 0, y: 0 });

  const pintarGiro = useCallback(() => {
    frameRef.current = 0;
    const el = giroElRef.current;
    if (!el) return;
    const { x, y } = giroRef.current;
    el.style.setProperty('--giro-x', `${x.toFixed(2)}deg`);
    el.style.setProperty('--giro-y', `${y.toFixed(2)}deg`);
  }, []);

  const acumularGiro = useCallback(
    (dx: number, dy: number, permitirInclinacion: boolean) => {
      const g = giroRef.current;
      g.y = clamp(g.y + dx * SENSIBILIDAD, -LIMITE_GIRO, LIMITE_GIRO);
      if (permitirInclinacion) {
        g.x = clamp(g.x - dy * SENSIBILIDAD, -LIMITE_INCLINACION, LIMITE_INCLINACION);
      }
      if (!frameRef.current) frameRef.current = window.requestAnimationFrame(pintarGiro);
    },
    [pintarGiro],
  );

  /** Giro puntual (teclado o botones): se aplica y se pinta de inmediato. */
  const aplicarGiro = useCallback(
    (cambio: (g: Giro) => Giro) => {
      giroRef.current = cambio(giroRef.current);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
      pintarGiro();
    },
    [pintarGiro],
  );

  useEffect(
    () => () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const alPresionar = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    arrastreRef.current = true;
    punteroRef.current = e.pointerType;
    ultimoRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    raizRef.current?.setAttribute('data-arrastrando', 'true');
  };

  const alMover = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!arrastreRef.current) return;
    const dx = e.clientX - ultimoRef.current.x;
    const dy = e.clientY - ultimoRef.current.y;
    ultimoRef.current = { x: e.clientX, y: e.clientY };
    // En táctil el gesto vertical pertenece al scroll de la página: solo el
    // eje horizontal gira la vista y el resto se entrega al navegador.
    const permitirInclinacion = punteroRef.current !== 'touch';
    acumularGiro(dx, dy, permitirInclinacion);
  };

  const alSoltar = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!arrastreRef.current) return;
    arrastreRef.current = false;
    raizRef.current?.removeAttribute('data-arrastrando');
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const alTecla = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      aplicarGiro((g) => ({ ...g, y: clamp(g.y - PASO, -LIMITE_GIRO, LIMITE_GIRO) }));
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      aplicarGiro((g) => ({ ...g, y: clamp(g.y + PASO, -LIMITE_GIRO, LIMITE_GIRO) }));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      aplicarGiro((g) => ({ ...g, x: clamp(g.x - PASO, -LIMITE_INCLINACION, LIMITE_INCLINACION) }));
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      aplicarGiro((g) => ({ ...g, x: clamp(g.x + PASO, -LIMITE_INCLINACION, LIMITE_INCLINACION) }));
      e.preventDefault();
    }
  };

  const girar = (eje: 'x' | 'y', signo: 1 | -1) => {
    aplicarGiro((g) =>
      eje === 'y'
        ? { ...g, y: clamp(g.y + signo * PASO, -LIMITE_GIRO, LIMITE_GIRO) }
        : { ...g, x: clamp(g.x + signo * PASO, -LIMITE_INCLINACION, LIMITE_INCLINACION) },
    );
  };

  const vistas: Vista[] = ['frontal', 'lateral', 'rotacion'];

  return (
    <div className="scoliosis-columna-exp" ref={raizRef}>
      <div className={`scoliosis-columna-exp__auto${pausado ? ' esta-pausado' : ''}`}>
        <div className="scoliosis-columna-exp__giro" ref={giroElRef}>
          <div
            className="scoliosis-columna-exp__viewport"
            role="img"
            tabIndex={0}
            aria-label="Esquema ilustrativo de una columna vertebral con escoliosis. Se muestra la vista frontal, lateral o de rotación axial; la escoliosis es tridimensional. Arrastra en horizontal o usa las flechas del teclado y los botones de giro para rotar la vista. Esquema no proporcional ni diagnóstico."
            onPointerDown={alPresionar}
            onPointerMove={alMover}
            onPointerUp={alSoltar}
            onPointerCancel={alSoltar}
            onKeyDown={alTecla}
          >
            {vista === 'frontal' && <VistaFrontal />}
            {vista === 'lateral' && <VistaLateral />}
            {vista === 'rotacion' && <VistaRotacion />}
          </div>
        </div>
      </div>

      <div className="scoliosis-columna-exp__controles">
        <div className="scoliosis-columna-exp__capas" role="group" aria-label="Vista del esquema">
          {vistas.map((v) => (
            <button
              key={v}
              type="button"
              className="scoliosis-columna-exp__capa"
              aria-pressed={vista === v}
              onClick={() => setVista(v)}
            >
              {ETIQUETAS_VISTA[v]}
            </button>
          ))}
        </div>

        <div className="scoliosis-columna-exp__giro-ctrl" role="group" aria-label="Girar la vista">
          <button
            type="button"
            className="scoliosis-columna-exp__giro-btn"
            onClick={() => girar('y', -1)}
            aria-label="Girar la vista a la izquierda"
          >
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M14.5 5.5 8 12l6.5 6.5" />
            </svg>
          </button>
          <button
            type="button"
            className="scoliosis-columna-exp__giro-btn"
            onClick={() => girar('y', 1)}
            aria-label="Girar la vista a la derecha"
          >
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M9.5 5.5 16 12l-6.5 6.5" />
            </svg>
          </button>
          <button
            type="button"
            className="scoliosis-columna-exp__giro-btn"
            onClick={() => girar('x', -1)}
            aria-label="Inclinar la vista hacia arriba"
          >
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M5.5 14.5 12 8l6.5 6.5" />
            </svg>
          </button>
          <button
            type="button"
            className="scoliosis-columna-exp__giro-btn"
            onClick={() => girar('x', 1)}
            aria-label="Inclinar la vista hacia abajo"
          >
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M5.5 9.5 12 16l6.5-6.5" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="scoliosis-columna-exp__pausa"
          onClick={() => setPausado((p) => !p)}
          aria-pressed={pausado}
        >
          {pausado ? 'Reanudar movimiento' : 'Pausar movimiento'}
        </button>
      </div>

      <p className="scoliosis-columna-exp__nota">
        La escoliosis es tridimensional: combina desviación lateral y rotación axial. Cambia de vista para
        explorarla.
      </p>
      <p className="scoliosis-columna-exp__aviso">Esquema ilustrativo, no proporcional ni diagnóstico.</p>
    </div>
  );
};

export default ColumnaExplorable;
