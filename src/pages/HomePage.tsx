import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PageRoute } from '../components/Header';
import { readStorage, STORAGE_KEYS, PANEL_STORAGE_VERSION } from '../utils/storage';
import { PanelRecord } from '../types';
import { EXERCISES_DATA } from '../data/exercisesData';
import {
  durationLabels,
  zoneLabels,
} from '../data/exerciseLabels';

interface HomePageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [recordCount, setRecordCount] = useState<number>(0);

  useEffect(() => {
    const res = readStorage<PanelRecord[]>(
      STORAGE_KEYS.panel,
      PANEL_STORAGE_VERSION,
      (data) => (Array.isArray(data) ? (data as PanelRecord[]) : [])
    );
    if (res.available && res.value) {
      setRecordCount(res.value.length);
    }
  }, []);

  /**
   * Entrada progresiva del recorrido de programas: se observa la seccion una sola vez
   * y se anade `is-visible`. Sin la clase, el CSS deja todo visible.
   */
  const programasRef = useRef<HTMLElement | null>(null);
  const [programasInView, setProgramasInView] = useState(false);

  useEffect(() => {
    const el = programasRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setProgramasInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setProgramasInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /**
   * Entrada progresiva de la sección beneficios: animación al entrar en viewport.
   */
  const beneficiosRef = useRef<HTMLElement | null>(null);
  const [beneficiosInView, setBeneficiosInView] = useState(false);

  useEffect(() => {
    const el = beneficiosRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setBeneficiosInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setBeneficiosInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /**
   * Entrada progresiva de la seccion "Como funciona": animaciones al entrar en viewport.
   */
  const comoFuncionaRef = useRef<HTMLElement | null>(null);
  const [comoFuncionaInView, setComoFuncionaInView] = useState(false);

  /**
   * Entrada progresiva de la sección escoliosis: animación escalonada al entrar en viewport.
   */
  const escoliosisRef = useRef<HTMLElement | null>(null);
  const [escoliosisInView, setEscoliosisInView] = useState(false);

  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const heroEscenaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = comoFuncionaRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setComoFuncionaInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setComoFuncionaInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = escoliosisRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setEscoliosisInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setEscoliosisInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /**
   * Estado de pausa para la animacion continua de la escultura (>5s).
   */
  const [animacionPausada, setAnimacionPausada] = useState(false);
  const [heroPausada, setHeroPausada] = useState(false);
  const heroPausedRef = useRef(false);
  heroPausedRef.current = heroPausada;

  /**
   * Tilt interactivo del hero: inclina .hero-escena siguiendo al puntero fino.
   * En táctil/teclado (sin puntero fino) la escena gira ambientalmente solo con CSS.
   * Con prefers-reduced-motion: reduce no hay tilt, ni giro, ni requestAnimationFrame.
   * El listener y el frame se limpian al desmontar.
   */
  useEffect(() => {
    const visual = heroVisualRef.current;
    const escena = heroEscenaRef.current;
    if (!visual || !escena) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');

    let frame: number | null = null;

    const aplicarTransform = (x: number, y: number) => {
      const max = parseFloat(getComputedStyle(escena).getPropertyValue('--tilt-max') || '6');
      const vx = Math.min(max, Math.max(-max, x));
      const vy = Math.min(max, Math.max(-max, y));
      escena.style.transform = `rotateX(${vx}deg) rotateY(${vy}deg)`;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reduce.matches || !fine.matches || heroPausedRef.current) return;
      const rect = visual.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const max = parseFloat(getComputedStyle(escena).getPropertyValue('--tilt-max') || '6');
      // rotateX sigue el eje vertical del puntero; rotateY sigue el horizontal.
      const x = ((event.clientY - cy) / (rect.height / 2)) * max;
      const y = ((event.clientX - cx) / (rect.width / 2)) * max;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        aplicarTransform(x, y);
        frame = null;
      });
    };

    const onPointerLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        escena.style.transition = 'transform 600ms var(--curva-suave)';
        escena.style.transform = 'rotateX(0) rotateY(0)';
        frame = null;
        escena.style.transition = '';
      });
    };

    const aplicarGiroAmbiental = () => {
      if (reduce.matches || fine.matches || heroPausedRef.current) return;
      escena.classList.add('hero-escena--giro-ambiental');
    };

    visual.addEventListener('pointermove', onPointerMove, { passive: true });
    visual.addEventListener('pointerleave', onPointerLeave, { passive: true });
    if (!reduce.matches && !fine.matches) aplicarGiroAmbiental();

    return () => {
      visual.removeEventListener('pointermove', onPointerMove);
      visual.removeEventListener('pointerleave', onPointerLeave);
      if (frame) cancelAnimationFrame(frame);
      escena.classList.remove('hero-escena--giro-ambiental');
      escena.style.transform = '';
    };
  }, [heroPausada]);

  /**
   * Reinicia la escena cuando se pausa o reanuda el hero.
   */
  useEffect(() => {
    const escena = heroEscenaRef.current;
    if (!escena) return;
    escena.style.transform = '';
    if (heroPausada) {
      escena.classList.remove('hero-escena--giro-ambiental');
    }
  }, [heroPausada]);

  /**
   * Tilt 3D interactivo en las tarjetas de beneficios: inclina cada tarjeta
   * siguiendo al puntero fino. Solo en escritorio con puntero fino y sin
   * prefers-reduced-motion: reduce. Los listeners se limpian al desmontar.
   */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');

    if (reduce.matches || !fine.matches) return;

    const cards = document.querySelectorAll<HTMLElement>('#beneficios [data-depth]');
    if (cards.length === 0) return;

    const articles = Array.from(cards).map((card) => card.querySelector('article')).filter((a): a is HTMLElement => a !== null);

    const cleanupFunctions: (() => void)[] = [];

    articles.forEach((article) => {
      const onPointerMove = (event: PointerEvent) => {
        if (reduce.matches || !fine.matches) return;
        const rect = article.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const max = 4; // Rango de ±4°, más suave que el hero
        const x = ((event.clientY - cy) / (rect.height / 2)) * max;
        const y = ((event.clientX - cx) / (rect.width / 2)) * max;
        article.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
      };

      const onPointerEnter = () => {
        article.style.willChange = 'transform';
      };

      const onPointerLeave = () => {
        article.style.transition = 'transform 300ms var(--curva-suave)';
        article.style.transform = 'rotateX(0) rotateY(0)';
        setTimeout(() => {
          article.style.transition = '';
          article.style.willChange = '';
        }, 300);
      };

      article.addEventListener('pointermove', onPointerMove, { passive: true });
      article.addEventListener('pointerenter', onPointerEnter, { passive: true });
      article.addEventListener('pointerleave', onPointerLeave, { passive: true });

      cleanupFunctions.push(() => {
        article.removeEventListener('pointermove', onPointerMove);
        article.removeEventListener('pointerenter', onPointerEnter);
        article.removeEventListener('pointerleave', onPointerLeave);
      });
    });

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, []);

  /**
   * Cifras de la biblioteca calculadas desde los datos reales, no escritas a
   * mano: si la colección cambia, estas tarjetas dejan de mentir solas.
   */
  const biblioteca = useMemo(() => {
    const total = EXERCISES_DATA.length;
    const sinEquipamiento = EXERCISES_DATA.filter(
      (e) => e.equipment.length > 0 && e.equipment.every((eq) => eq === 'ninguno')
    ).length;
    const zonas = new Set(EXERCISES_DATA.flatMap((e) => e.zone)).size;
    const postural = EXERCISES_DATA.filter((e) => e.category === 'cuidado_postural').length;
    // El primer ejercicio de cuidado postural es el que ilustramos: encaja con
    // el encuadre de la portada en lugar de ser un ejercicio cualquiera.
    const destacado =
      EXERCISES_DATA.find((e) => e.category === 'cuidado_postural') ?? EXERCISES_DATA[0];
    // Muestra de la portada: los tres primeros, con sus datos reales.
    const muestra = EXERCISES_DATA.slice(0, 3);
    return { total, sinEquipamiento, zonas, postural, destacado, muestra };
  }, []);

  const ir = (page: PageRoute) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <>
      {/* Hero */}
      <section id="inicio" className="hero" aria-labelledby="titulo-inicio" tabIndex={-1} data-paused={heroPausada}>
        <div className="container hero-layout">
          <div className="hero-copy">
            <p className="hero-insignia">
              <span className="hero-insignia__punto" aria-hidden="true" />
              Movimiento guiado y consciente en casa
            </p>
            <h1 id="titulo-inicio" className="hero-titular">
              Muévete mejor <em>desde casa</em>, a tu ritmo
            </h1>
            <p className="hero-lead">
              Explora ejercicios generales, organiza tu actividad y registra cómo te sientes. Sin
              cuenta, sin equipamiento y sin enviar tus datos a ningún servidor.
            </p>
            <div className="hero-actions">
              <a href="#ejercicios" className="btn hero-cta" onClick={ir('ejercicios')}>
                Explorar ejercicios
              </a>
              <a href="#quiz" className="btn secondary hero-cta" onClick={ir('quiz')}>
                Organizar mi actividad
              </a>
            </div>
            <a href="#escoliosis" className="hero-enlace" onClick={ir('escoliosis')}>
              ¿Buscas información sobre escoliosis? Leer la guía completa
              <span aria-hidden="true"> →</span>
            </a>
            <ul className="hero-datos" aria-label="Cómo funciona FitCasa con tus datos">
              <li>Sin cuenta</li>
              <li>{biblioteca.sinEquipamiento === biblioteca.total ? 'Sin equipamiento' : `${biblioteca.sinEquipamiento} de ${biblioteca.total} sin equipamiento`}</li>
              <li>Tus datos se quedan en tu navegador</li>
            </ul>
            <button
              type="button"
              className="hero-pausa"
              aria-label={heroPausada ? 'Reanudar movimiento' : 'Pausar movimiento'}
              aria-pressed={heroPausada}
              onClick={() => setHeroPausada((p) => !p)}
            >
              {heroPausada ? (
                <>
                  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" width="18" height="18">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Reanudar movimiento
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" width="18" height="18">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                  Pausar movimiento
                </>
              )}
            </button>
          </div>

          {/* Composición visual 3D editorial: figura escultórica con profundidad */ }
          <div className="hero-visual" data-depth>
            <figure className="hero-escena" aria-hidden="true">
              {/* Capa de fondo: malla de puntos */}
              <div className="hero-escena__fondo-malla" aria-hidden="true" />

              {/* Capa intermedia: formas abstractas flotantes */}
              <div className="hero-escena__formas" aria-hidden="true">
                <div className="hero-escena__forma hero-escena__forma--1" />
                <div className="hero-escena__forma hero-escena__forma--2" />
                <div className="hero-escena__forma hero-escena__forma--3" />
                <div className="hero-escena__forma hero-escena__forma--4" />
              </div>

              {/* Capa principal: figura escultórica central */}
              <div className="hero-escena__figura" aria-hidden="true">
                <svg
                  className="hero-escena__silhueta"
                  viewBox="0 0 400 500"
                  preserveAspectRatio="xMidYMid slice"
                  focusable="false"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="grad-figura" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-primario)" stopOpacity="0.95" />
                      <stop offset="50%" stopColor="var(--color-primario-oscuro)" stopOpacity="0.98" />
                      <stop offset="100%" stopColor="var(--color-secundario-oscuro)" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="grad-figura-brillo" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--color-salvia-claro)" stopOpacity="0" />
                      <stop offset="30%" stopColor="var(--color-salvia-claro)" stopOpacity="0.15" />
                      <stop offset="50%" stopColor="var(--color-salvia-claro)" stopOpacity="0.08" />
                      <stop offset="70%" stopColor="var(--color-salvia-claro)" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="var(--color-salvia-claro)" stopOpacity="0" />
                    </linearGradient>
                    <filter id="sombra-suave" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="12" stdDeviation="20" floodColor="var(--color-primario-oscuro)" floodOpacity="0.25" />
                    </filter>
                  </defs>

                  {/* Sombra de contacto en el suelo */}
                  <ellipse
                    cx="200"
                    cy="470"
                    rx="120"
                    ry="18"
                    fill="var(--color-primario-oscuro)"
                    opacity="0.15"
                    filter="url(#sombra-suave)"
                  />

                  {/* Cuerpo principal - torso y columna */}
                  <g filter="url(#sombra-suave)">
                    {/* Piernas */}
                    <path
                      d="M165 420 Q155 480 170 500 L190 500 Q205 480 195 420 Z"
                      fill="url(#grad-figura)"
                      stroke="var(--color-primario-oscuro)"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M235 420 Q245 480 230 500 L210 500 Q195 480 205 420 Z"
                      fill="url(#grad-figura)"
                      stroke="var(--color-primario-oscuro)"
                      strokeWidth="1.5"
                    />

                    {/* Torso */}
                    <path
                      d="M155 420 Q140 380 145 280 Q148 220 165 180 Q200 150 235 180 Q252 220 255 280 Q258 380 245 420 Z"
                      fill="url(#grad-figura)"
                      stroke="var(--color-primario-oscuro)"
                      strokeWidth="1.5"
                    />

                    {/* Columna vertebral - curva elegante */}
                    <path
                      d="M200 180 Q198 200 198 230 Q200 260 200 290 Q202 320 202 350 Q200 380 200 400"
                      fill="none"
                      stroke="var(--color-salvia-claro)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.85"
                    />

                    {/* Brazos */}
                    <path
                      d="M155 220 Q120 200 90 240 Q80 260 100 280 Q130 250 150 240"
                      fill="url(#grad-figura)"
                      stroke="var(--color-primario-oscuro)"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M245 220 Q280 200 310 240 Q320 260 300 280 Q270 250 250 240"
                      fill="url(#grad-figura)"
                      stroke="var(--color-primario-oscuro)"
                      strokeWidth="1.5"
                    />

                    {/* Cabeza */}
                    <ellipse
                      cx="200"
                      cy="140"
                      rx="32"
                      ry="40"
                      fill="url(#grad-figura)"
                      stroke="var(--color-primario-oscuro)"
                      strokeWidth="1.5"
                    />

                    {/* Brillo sutil en el torso */}
                    <path
                      d="M180 200 Q190 220 190 280 Q185 320 180 350"
                      fill="none"
                      stroke="url(#grad-figura-brillo)"
                      strokeWidth="20"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  </g>

                  {/* Elementos flotantes decorativos alrededor */}
                  <g opacity="0.4" fill="var(--color-secundario)">
                    <circle cx="80" cy="120" r="4" />
                    <circle cx="340" cy="100" r="3" />
                    <circle cx="60" cy="300" r="5" />
                    <circle cx="360" cy="280" r="3" />
                    <circle cx="50" cy="420" r="4" />
                    <circle cx="370" cy="400" r="3" />
                  </g>

                  {/* Líneas de energía/movimiento sutiles */}
                  <g stroke="var(--color-salvia-claro)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" fill="none">
                    <path d="M120 300 Q140 280 150 260 Q160 240 170 220" />
                    <path d="M280 300 Q260 280 250 260 Q240 240 230 220" />
                    <path d="M100 380 Q120 360 140 340" strokeDasharray="4 8" />
                    <path d="M300 380 Q280 360 260 340" strokeDasharray="4 8" />
                  </g>
                </svg>
              </div>

              {/* Partículas de luz flotantes */}
              <div className="hero-escena__particulas" aria-hidden="true">
                <span style={{top: '15%', left: '10%', animationDelay: '0s'}} />
                <span style={{top: '25%', left: '85%', animationDelay: '1s'}} />
                <span style={{top: '45%', left: '5%', animationDelay: '2s'}} />
                <span style={{top: '65%', left: '90%', animationDelay: '0.5s'}} />
                <span style={{top: '80%', left: '20%', animationDelay: '1.5s'}} />
                <span style={{top: '20%', left: '70%', animationDelay: '2.5s'}} />
                <span style={{top: '55%', left: '75%', animationDelay: '3s'}} />
                <span style={{top: '75%', left: '10%', animationDelay: '1s'}} />
              </div>
            </figure>

            {/* Datos flotantes */}
            <div className="hero-mini hero-mini--a">
              <strong>{biblioteca.total}</strong>
              <span>ejercicios en la biblioteca</span>
            </div>
            <div className="hero-mini hero-mini--b">
              <strong>{biblioteca.postural}</strong>
              <span>de {biblioteca.total} son de cuidado postural</span>
            </div>
          </div>
        </div>
      </section>

{/* Beneficios */}
      <section
        id="beneficios"
        aria-labelledby="titulo-beneficios"
        tabIndex={-1}
        ref={beneficiosRef}
        className={`container seccion beneficios-entrada${beneficiosInView ? ' is-visible' : ''}`}
      >
        <div className="beneficios-hero" aria-hidden="true">
          <div className="beneficios-atmosfera" />
          <figure className="beneficios-escultura" aria-hidden="true">
            <svg
              className="beneficios-escultura__svg"
              viewBox="0 0 400 500"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="grad-escultura" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-secundario)" stopOpacity="0.85" />
                  <stop offset="35%" stopColor="var(--color-secundario-oscuro)" stopOpacity="0.95" />
                  <stop offset="70%" stopColor="var(--color-primario)" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--color-primario-oscuro)" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="grad-escultura-brillo" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--color-salvia-claro)" stopOpacity="0" />
                  <stop offset="25%" stopColor="var(--color-salvia-claro)" stopOpacity="0.18" />
                  <stop offset="50%" stopColor="var(--color-salvia-claro)" stopOpacity="0.08" />
                  <stop offset="75%" stopColor="var(--color-salvia-claro)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="var(--color-salvia-claro)" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="grad-sombra-contacto" cx="50%" cy="100%" r="50%">
                  <stop offset="0%" stopColor="var(--color-primario-oscuro)" stopOpacity="0.22" />
                  <stop offset="60%" stopColor="var(--color-primario-oscuro)" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="var(--color-primario-oscuro)" stopOpacity="0" />
                </radialGradient>
                <filter id="sombra-escultura" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="16" stdDeviation="24" floodColor="var(--color-primario-oscuro)" floodOpacity="0.28" />
                </filter>
                <filter id="brillo-sutil" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feSpecularLighting surfaceScale="2" specularConstant="0.4" specularExponent="20" lightingColor="var(--color-salvia-claro)" result="specOut">
                    <fePointLight x="200" y="-100" z="200" />
                  </feSpecularLighting>
                  <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specIn" />
                  <feComposite in="SourceGraphic" in2="specIn" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
                </filter>
              </defs>

              {/* Sombra de contacto en el suelo */}
              <ellipse
                cx="200"
                cy="475"
                rx="130"
                ry="22"
                fill="url(#grad-sombra-contacto)"
                filter="url(#sombra-escultura)"
              />

              {/* Forma escultórica principal: equilibrio y movimiento */}
              <g filter="url(#sombra-escultura)">
                {/* Base escultórica: forma orgánica que sugiere equilibrio */}
                <path
                  d="M200 420 
                     Q 140 400  120 340 
                     Q 100 280  130 220 
                     Q 160 160  200 130 
                     Q 240 160  280 220 
                     Q 310 280  290 340 
                     Q 270 400  230 420 Z"
                  fill="url(#grad-escultura)"
                  stroke="var(--color-primario-oscuro)"
                  strokeWidth="1.2"
                  filter="url(#sombra-escultura)"
                />

                {/* Núcleo central: eje de equilibrio */}
                <path
                  d="M200 180 
                     Q 202 220  200 250 
                     Q 198 280  200 310 
                     Q 202 340  200 370 
                     Q 198 400  200 400"
                  fill="none"
                  stroke="url(#grad-escultura-brillo)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.7"
                  strokeLinejoin="round"
                />

                {/* Anillos de equilibrio: sugieren movimiento y centro de gravedad */}
                <g opacity="0.35" stroke="var(--color-salvia-claro)" strokeWidth="1.5" fill="none" strokeLinecap="round">
                  <ellipse cx="200" cy="300" rx="85" ry="28" />
                  <ellipse cx="200" cy="260" rx="65" ry="22" />
                  <ellipse cx="200" cy="220" rx="45" ry="16" />
                </g>

                {/* Puntos de anclaje: sugerencia de puntos de contacto y apoyo */}
                <g fill="var(--color-salvia-claro)" opacity="0.55">
                  <circle cx="135" cy="340" r="4" />
                  <circle cx="265" cy="340" r="4" />
                  <circle cx="155" cy="260" r="3" />
                  <circle cx="245" cy="260" r="3" />
                  <circle cx="180" cy="200" r="3" />
                  <circle cx="220" cy="200" r="3" />
                </g>

                {/* Línea de energía central: columna vertebral estilizada */}
                <path
                  d="M200 130 
                     Q 200 160  200 190 
                     Q 200 220  200 250 
                     Q 200 280  200 310 
                     Q 200 340  200 370"
                  fill="none"
                  stroke="var(--color-salvia-claro)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.25"
                  strokeDasharray="4 6"
                />

                {/* Halo superior: corona de luz */}
                <ellipse
                  cx="200"
                  cy="125"
                  rx="45"
                  ry="18"
                  fill="url(#grad-escultura-brillo)"
                  opacity="0.5"
                />
              </g>

              {/* Partículas de energía flotantes alrededor */}
              <g opacity="0.25" fill="var(--color-secundario)">
                <circle cx="85" cy="110" r="3" />
                <circle cx="330" cy="95" r="2.5" />
                <circle cx="55" cy="280" r="3.5" />
                <circle cx="355" cy="265" r="2.5" />
                <circle cx="45" cy="400" r="3" />
                <circle cx="365" cy="385" r="2.5" />
                <circle cx="95" cy="380" r="2" />
                <circle cx="325" cy="410" r="2.5" />
              </g>

              {/* Líneas de flujo energético */}
              <g stroke="var(--color-salvia-claro)" strokeWidth="1.2" strokeLinecap="round" opacity="0.2" fill="none">
                <path d="M110 320 Q 130 300  145 275 Q 160 250  175 225" />
                <path d="M290 320 Q 270 300  255 275 Q 240 250  225 225" />
                <path d="M95 390 Q 115 370  135 345" strokeDasharray="3 6" />
                <path d="M305 390 Q 285 370  265 345" strokeDasharray="3 6" />
              </g>

              {/* Paths de trazo que se dibujan al revelar la sección (Fase C) */}
              <g className="beneficios-escultura__trazos" stroke="var(--color-secundario)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6">
                <path
                  d="M80 180 Q 120 150 160 170 Q 200 190 240 160 Q 280 130 320 160"
                  strokeDasharray="300"
                  strokeDashoffset="300"
                  style={{ animation: 'dibujar-trazo 1s var(--curva-suave) 0.2s forwards' }}
                />
                <path
                  d="M70 300 Q 100 280 130 310 Q 160 340 200 320 Q 240 300 270 330 Q 300 360 330 340"
                  strokeDasharray="280"
                  strokeDashoffset="280"
                  style={{ animation: 'dibujar-trazo 1.1s var(--curva-suave) 0.4s forwards' }}
                />
                <path
                  d="M100 420 Q 140 400 180 430 Q 220 460 260 430 Q 300 400 340 420"
                  strokeDasharray="260"
                  strokeDashoffset="260"
                  style={{ animation: 'dibujar-trazo 0.9s var(--curva-suave) 0.6s forwards' }}
                />
                <path
                  d="M150 140 Q 180 120 210 145 Q 240 170 270 145 Q 300 120 330 140"
                  strokeDasharray="220"
                  strokeDashoffset="220"
                  style={{ animation: 'dibujar-trazo 0.8s var(--curva-suave) 0.8s forwards' }}
                />
                <path
                  d="M50 250 Q 90 230 130 255 Q 170 280 210 255 Q 250 230 290 255 Q 330 280 370 255"
                  strokeDasharray="340"
                  strokeDashoffset="340"
                  style={{ animation: 'dibujar-trazo 1.2s var(--curva-suave) 1s forwards' }}
                />
                <path
                  d="M60 380 Q 100 360 140 385 Q 180 410 220 385 Q 260 360 300 385 Q 340 410 380 385"
                  strokeDasharray="320"
                  strokeDashoffset="320"
                  style={{ animation: 'dibujar-trazo 1s var(--curva-suave) 1.2s forwards' }}
                />
              </g>

              <style>{`
                @keyframes dibujar-trazo {
                  to { stroke-dashoffset: 0; }
                }
                @media (prefers-reduced-motion: reduce) {
                  .beneficios-escultura__trazos path {
                    stroke-dashoffset: 0 !important;
                    animation: none !important;
                  }
                }
              `}</style>
            </svg>
          </figure>

          {/* Capas atmosféricas de fondo */}
          <div className="beneficios-capas-atmosfericas" aria-hidden="true">
            <div className="beneficios-capa beneficios-capa--1" />
            <div className="beneficios-capa beneficios-capa--2" />
            <div className="beneficios-capa beneficios-capa--3" />
            <div className="beneficios-malla-luz" />
          </div>
        </div>

        <header className="beneficios-header">
          <h2 id="titulo-beneficios">Beneficios del ejercicio en casa</h2>
          <p className="beneficios-subtitulo">
            El movimiento consciente transforma tu día a día. Cada beneficio nace de la constancia,
            no de la intensidad.
          </p>
        </header>

        <ul className="beneficios-grid">
          {/* Protagonista: ocupa 2x2 de la retícula en escritorio. */}
          <li className="beneficio beneficio--destacado" data-depth>
            <article>
              <svg className="beneficio__icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 3.5 19 6v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="m9.5 12 1.8 1.8 3.4-3.6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h3>Seguridad ante todo</h3>
              <p>
                FitCasa es un recurso educativo y no sustituye la valoración de un profesional de
                la salud. Cada ejercicio declara su duración y su nivel para que elijas con
                criterio, y conviene detener la actividad ante dolor o síntomas inusuales.
              </p>
              <a className="card-link" href="#escoliosis" onClick={ir('escoliosis')}>
                Leer la guía de escoliosis
              </a>
            </article>
          </li>

          {/* Tercera columna, fila 1. */}
          <li className="beneficio" data-depth>
            <article>
              <svg className="beneficio__icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 11.5 12 4l8 7.5" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M6.5 10v9.5h4.5v-5h2v5h4.5V10" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h3>Comodidad sin desplazamientos</h3>
              <p>
                Entrena en tu hogar con horarios flexibles. Los {biblioteca.total} ejercicios de la
                biblioteca se hacen con tu propio cuerpo, sin material ni desplazamientos.
              </p>
              <a className="card-link" href="#ejercicios" onClick={ir('ejercicios')}>
                Explorar la biblioteca
              </a>
            </article>
          </li>

          {/* Tercera columna, fila 2. */}
          <li className="beneficio" data-depth>
            <article>
              <svg className="beneficio__icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 20h16" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M7 20v-5" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 20V9" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M17 20V6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h3>Progresión controlada y gradual</h3>
              <p>
                Cada ejercicio indica su duración y su nivel de exigencia para que comieces
                desde tu punto de partida real y avances con serenidad.
              </p>
              <a className="card-link" href="#ejercicios" onClick={ir('ejercicios')}>
                Ver duraciones y niveles
              </a>
            </article>
          </li>

          {/* Fila 3 apaisada, ancho completo. */}
          <li className="beneficio beneficio--ancho">
            <article>
              <svg className="beneficio__icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 8h9" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M17 8h3" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M4 16h3" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M11 16h9" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="15" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="9" cy="16" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h3>Adaptabilidad a tu nivel</h3>
              <p>
                Filtra por zona corporal o responde el cuestionario para recibir una propuesta
                adaptada a tus tiempos y preferencias. Es una orientación educativa, no un plan
                clínico.
              </p>
              <a className="card-link" href="#quiz" onClick={ir('quiz')}>
                Obtener orientación
              </a>
            </article>
          </li>
        </ul>
      </section>

{/* Programas */}
      <section
        id="programas"
        aria-labelledby="titulo-programas"
        tabIndex={-1}
        ref={programasRef}
        className={`container seccion programas-entrada${programasInView ? ' is-visible' : ''}`}
      >
        {/* Fase D: línea conectora entre los tres pasos. Se dibuja al revelar la sección. */}
        <svg
          className="programas-conectora"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          focusable="false"
          aria-hidden="true"
        >
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="var(--color-primario)"
            strokeOpacity={0.3}
            strokeWidth="2"
            fill="none"
            strokeDasharray="100"
            strokeDashoffset="100"
          />
        </svg>
        <header className="programas-header">
          <h2 id="titulo-programas">Un camino de tres pasos</h2>
          <p className="programas-subtitulo">
            Explora, orienta y registra. Tres momentos que se suceden sin prisa, en tu ritmo.
          </p>
        </header>

        <div className="programas-grid">
          {/* Trayectoria decorativa que une las tres etapas. Solo escritorio: en
              móvil y tableta el recorrido se lee por orden y por la pieza. */}
          <svg
            className="programas-trail"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M 61 8 C 67 24 67 42 62 50 C 58 58 58 76 61 92"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Paso 01 · protagonista. Escenario oscuro con la pieza escultórica
              y una muestra real de la biblioteca, sacada de los datos. */}
          <article className="programa programa--destacado">
            <figure className="programas-escena" aria-hidden="true">
              <svg
                className="programas-escena__svg"
                viewBox="0 0 380 300"
                preserveAspectRatio="xMidYMid meet"
                focusable="false"
                aria-hidden="true"
              >
                <defs>
                  <filter
                    id="programa-sombra-contacto"
                    x="-40%"
                    y="-40%"
                    width="180%"
                    height="180%"
                  >
                    <feGaussianBlur stdDeviation="5" />
                  </filter>
                </defs>

                {/* Suelo del escenario */}
                <ellipse
                  cx="190"
                  cy="274"
                  rx="150"
                  ry="14"
                  fill="var(--color-primario-oscuro)"
                  opacity="0.28"
                />

                {/* Sombras de contacto de las tres plataformas */}
                <g
                  filter="url(#programa-sombra-contacto)"
                  fill="var(--color-primario-oscuro)"
                  opacity="0.5"
                >
                  <ellipse cx="104" cy="252" rx="62" ry="10" />
                  <ellipse cx="206" cy="222" rx="50" ry="9" />
                  <ellipse cx="298" cy="178" rx="42" ry="8" />
                </g>

                {/* Plataforma 1 · origen */}
                <g>
                  <polygon points="36,206 148,206 148,244 36,244" fill="var(--color-secundario-oscuro)" />
                  <polygon points="148,206 170,232 170,270 148,244" fill="var(--color-primario-oscuro)" />
                  <polygon points="36,206 148,206 170,232 58,232" fill="var(--color-secundario)" />
                </g>

                {/* Plataforma 2 · orientación */}
                <g>
                  <polygon points="150,160 242,160 242,192 150,192" fill="var(--color-secundario)" />
                  <polygon points="242,160 262,184 262,216 242,192" fill="var(--color-secundario-oscuro)" />
                  <polygon points="150,160 242,160 262,184 170,184" fill="var(--color-salvia-claro)" />
                </g>

                {/* Plataforma 3 · cima */}
                <g>
                  <polygon points="250,116 324,116 324,144 250,144" fill="var(--color-salvia-claro)" />
                  <polygon points="324,116 342,138 342,166 324,144" fill="var(--color-secundario)" />
                  <polygon points="250,116 324,116 342,138 268,138" fill="var(--color-superficie)" />
                </g>

                {/* Cinta del recorrido que asciende por las plataformas */}
                <path
                  d="M 60 224 C 110 214 150 196 178 176 C 205 157 236 140 276 126"
                  fill="none"
                  stroke="var(--color-salvia-claro)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                <path d="M 286 124 L 266 116 L 270 134 Z" fill="var(--color-salvia-claro)" opacity="0.9" />

                {/* Acento único: esfera en la cima */}
                <circle cx="300" cy="104" r="14" fill="var(--color-terciario)" />
                <circle cx="295" cy="99" r="4.5" fill="var(--color-superficie)" opacity="0.35" />

                {/* Acentos flotantes */}
                <g fill="var(--color-salvia-claro)" opacity="0.4">
                  <circle cx="60" cy="120" r="4" />
                  <circle cx="332" cy="70" r="3" />
                  <circle cx="120" cy="80" r="2.5" />
                </g>
              </svg>
            </figure>

            <div className="programa__cuerpo">
              <header className="programa__cabecera">
                <p className="programa__foco">Explora</p>
              </header>
              <h3>Biblioteca de ejercicios</h3>
              <p className="programa__texto">
                Filtra la colección educativa por duración, dificultad, equipamiento y zona
                corporal, y abre cada ficha con su adaptación.
              </p>
              <ul className="programa__muestra" aria-label="Ejercicios de la biblioteca">
                {biblioteca.muestra.map((e) => (
                  <li key={e.id}>
                    <span className="programa__nombre">{e.name}</span>
                    <span className="programa__meta">
                      {durationLabels[e.duration]} · {zoneLabels[e.zone[0]] ?? e.zone[0]}
                    </span>
                  </li>
                ))}
              </ul>
              <a className="card-link programa__enlace" href="#ejercicios" onClick={ir('ejercicios')}>
                Abrir biblioteca
              </a>
            </div>
          </article>

          {/* Paso 02: Orienta — cuestionario de orientación:
              Actividad, Seguridad y Revisión. */}
          <article className="programa programa--orienta" aria-label="Paso 02: Orienta">
            <header className="programa__cabecera">
              <p className="programa__foco">Orienta</p>
            </header>
            <h3>Sugerencias de actividad</h3>
            <ol className="programa__pasos" aria-label="Pasos del cuestionario">
              <li>Actividad</li>
              <li>Seguridad</li>
              <li>Revisión</li>
            </ol>
            <p className="programa__texto">
              Responde el cuestionario para ordenar una propuesta educativa general basada en la
              biblioteca disponible. No es un diagnóstico ni un tratamiento personalizado.
            </p>
            <a className="card-link programa__enlace" href="#quiz" onClick={ir('quiz')}>
              Responder cuestionario
            </a>
          </article>

          {/* Paso 03: Registra — cuestionario de seguimiento */}
          <article className="programa programa--registra">
            <header className="programa__cabecera">
              <p className="programa__foco">Registra</p>
            </header>
            <h3>Seguimiento personal</h3>
            <p className="programa__texto">
              Registra actividad, dolor subjetivo y bienestar en este dispositivo.
            </p>
            <p className="programa__local">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M2 6.5L12 2L22 6.5V13L12 17.5L2 13ZM12 2l-7 4.5 2 7 8-5.5L12 2Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 10.5V7.75a3 3 0 1 1 6 0v2.75"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                Estado:{' '}
                <span id="seguimiento-badge" role="status">
                  {recordCount > 0 ? `${recordCount} entradas guardadas` : 'Seguimiento local'}
                </span>
                . Tus registros nunca salen de este navegador.
              </span>
            </p>
            <a className="card-link programa__enlace" href="#panel" onClick={ir('panel')}>
              Abrir seguimiento
            </a>
          </article>
        </div>
      </section>

      {/* Escoliosis */}
      <section id="escoliosis" ref={escoliosisRef} aria-labelledby="titulo-escoliosis" tabIndex={-1} className="container seccion">
        {/* Placa editorial: campo de tono propio, sin borde ni sombra. Las zonas
            se marcan por superficie y espacio, no por tarjetas anidadas. */}
        <div className={`escoliosis-placa ${escoliosisInView ? 'escoliosis-visible' : ''}`}>
          <div className="escoliosis-grid">
            <div className="escoliosis-texto">
              <header className="escoliosis-cabecera escoliosis-entrada-cabecera">
                <p className="escoliosis-insignia">
                  <span className="escoliosis-insignia__punto" aria-hidden="true" />
                  Enfoque postural consciente
                </p>
                <h2 id="titulo-escoliosis">Cuidado postural y enfoque en escoliosis</h2>
                {/* h3 y no p: visualmente es un subtitulo, pero para quien
                    navega por titulos sigue siendo un tema de la seccion. */}
                <h3 className="escoliosis-subtitulo">
                  Comprensión y respeto hacia cada columna vertebral
                </h3>
              </header>

              <div className="escoliosis-cuerpo escoliosis-entrada-cuerpo">
                <p>
                  La escoliosis implica curvas y rotaciones tridimensionales que varían en cada
                  persona. No existen rutinas universales ni ejercicios estándar válidos para todas
                  las curvaturas.
                </p>
                <p>
                  En FitCasa brindamos pautas divulgativas sobre higiene postural, estiramientos
                  suaves y activación muscular equilibrada, diseñadas para acompañar tu bienestar
                  cotidiano.
                </p>
              </div>

              {/* Aviso clinico. Se nombra con aria-labelledby y NO con aria-label:
                  un aria-label sustituiria el texto visible por su nombre accesible
                  y el lector de pantalla se saltaria los 282 caracteres del aviso. */}
              <div
                className="escoliosis-aviso escoliosis-entrada-aviso"
                role="note"
                aria-labelledby="escoliosis-aviso-titulo"
              >
                <span className="escoliosis-aviso__icono" aria-hidden="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 3.5 19 6v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M12 8.5v4.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 15.8h.01" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                </span>
                <p className="escoliosis-aviso__cuerpo">
                  <strong id="escoliosis-aviso-titulo">Aviso esencial de salud:</strong> Nuestros
                  contenidos tienen un propósito exclusivamente formativo y no constituyen
                  tratamiento médico ni correctivo. Consulta siempre con tu traumatólogo o
                  fisioterapeuta antes de comenzar, y suspende de inmediato la actividad si
                  experimentas dolor punzante, adormecimiento o mareos.
                </p>
              </div>

              <div className="escoliosis-acciones escoliosis-entrada-acciones">
                <a href="#escoliosis" className="btn escoliosis-cta" onClick={ir('escoliosis')}>
                  Leer guía completa de escoliosis
                </a>
                <a
                  href="#ejercicios"
                  className="escoliosis-acciones__secundario"
                  onClick={ir('ejercicios')}
                >
                  Ver ejercicios de cuidado postural
                </a>
              </div>
            </div>

            {/* Lamina editorial. Tres formas de caracter distinto —una curva
                dominante, un arco tendido y una traza punteada— sobre una
                matriz de puntos y un eje de referencia. No representa ninguna
                curvatura concreta ni un modelo anatomico. */}
            <div className="escoliosis-visual">
              <svg
                className="escoliosis-arte"
                viewBox="0 0 360 430"
                fill="none"
                aria-hidden="true"
                focusable="false"
              >
                <defs>
                  <pattern id="escoliosis-puntos" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.3" fill="var(--color-primario)" opacity="0.13" />
                  </pattern>
                  {/* Gradiente sutil para profundidad en la curva principal */}
                  <linearGradient id="escoliosis-curva-gradiente" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-primario)" stopOpacity="1" />
                    <stop offset="50%" stopColor="var(--color-primario)" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="var(--color-primario-oscuro)" stopOpacity="1" />
                  </linearGradient>
                  {/* Sombra suave para la curva principal */}
                  <filter id="escoliosis-sombra-curva" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="var(--color-primario-oscuro)" floodOpacity="0.15" />
                  </filter>
                </defs>
                <rect x="196" y="42" width="128" height="150" fill="url(#escoliosis-puntos)" />

                {/* Eje de referencia con marcas alternas: escala de atlas. */}
                <g stroke="var(--color-primario-oscuro)" strokeLinecap="round">
                  <path d="M40 64v304" strokeWidth="1" opacity="0.2" />
                  <path d="M40 100h9M40 152h18M40 204h9M40 256h18M40 308h9M40 360h18" strokeWidth="1.5" opacity="0.42" />
                </g>

                {/* 1. Curva dominante: el foco de la lamina. Con gradiente y sombra para profundidad. */}
                <path
                  className="escoliosis-curva-principal"
                  d="M164 62C228 102 118 156 182 214 246 272 136 326 219 370"
                  stroke="url(#escoliosis-curva-gradiente)"
                  strokeWidth="3.25"
                  strokeLinecap="round"
                  filter="url(#escoliosis-sombra-curva)"
                />
                {/* 2. Arco tendido: cruza en horizontal, no repite la S. */}
                <path
                  className="escoliosis-arco-secundario"
                  d="M54 306C134 346 236 258 330 306"
                  stroke="var(--color-secundario)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  opacity="0.62"
                />
                {/* 3. Traza punteada, casi vertical, en el flanco derecho. */}
                <path
                  className="escoliosis-traza-punteada"
                  d="M312 74C268 162 328 254 274 358"
                  stroke="var(--color-terciario-oscuro)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeDasharray="2 7"
                  opacity="0.5"
                />

                {/* Marcas de referencia en los puntos de inflexion. */}
                <g className="escoliosis-marcas" stroke="var(--color-primario)" strokeWidth="1" opacity="0.3">
                  <path d="M40 178h56" />
                  <path d="M40 286h104" />
                </g>
                <g className="escoliosis-nodos">
                  <circle cx="164" cy="62" r="7.5" fill="var(--color-primario)" />
                  <circle cx="134" cy="178" r="4.5" fill="var(--color-secundario-oscuro)" />
                  <circle cx="230" cy="286" r="6" fill="var(--color-primario-oscuro)" />
                  <circle cx="219" cy="370" r="5.5" fill="var(--color-terciario-oscuro)" />
                </g>
              </svg>
              <p className="escoliosis-ficha">
                <strong>Cada columna es tridimensional y única.</strong>
                <span>Sin fórmulas universales.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section
        id="como-funciona"
        ref={comoFuncionaRef}
        aria-labelledby="titulo-como-funciona"
        tabIndex={-1}
        className={`container seccion como-funciona${comoFuncionaInView ? ' is-visible' : ''}`}
      >
        <header className="como-funciona__cabecera">
          <div className="como-funciona__cabecera-texto">
            <h2 id="titulo-como-funciona" className="como-funciona__titulo">Cómo funciona FitCasa</h2>
            <p className="como-funciona__intro">
              Una experiencia en tres pasos para informarte, elegir con más contexto y observar tu
              propia práctica. No sustituye la valoración de un profesional de la salud.
            </p>
          </div>
          <div className="como-funciona__firma" aria-hidden="true">
            <svg viewBox="0 0 240 240" className="como-funciona__firma-svg" focusable="false" role="presentation">
              <defs>
                <radialGradient id="cf-firma-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--color-fondo-verde)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="var(--color-fondo)" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="120" cy="120" r="108" fill="url(#cf-firma-glow)" />
              <g className="cf-firma__anillo cf-firma__anillo--1" fill="none" stroke="var(--color-primario)" strokeWidth="2" strokeLinecap="round">
                <ellipse cx="120" cy="120" rx="98" ry="28" />
              </g>
              <g className="cf-firma__anillo cf-firma__anillo--2" fill="none" stroke="var(--color-secundario)" strokeWidth="2" strokeLinecap="round">
                <ellipse cx="120" cy="120" rx="32" ry="92" />
              </g>
              <g className="cf-firma__anillo cf-firma__anillo--3" fill="none" stroke="var(--color-terciario)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="6 4">
                <path d="M120 28 C170 28 190 70 190 120 C190 170 170 212 120 212 C70 212 50 170 50 120 C50 70 70 28 120 28" />
              </g>
              <g className="cf-firma__anillo cf-firma__anillo--4" fill="none" stroke="var(--color-primario-oscuro)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 6" opacity="0.6">
                <path d="M120 212 C70 212 50 170 50 120 C50 70 70 28 120 28 C170 28 190 70 190 120 C190 170 170 212 120 212" />
              </g>
              <g className="cf-firma__nodo" fill="var(--color-primario-oscuro)">
                <circle cx="120" cy="28" r="4" />
                <circle cx="212" cy="120" r="3.5" />
                <circle cx="120" cy="212" r="4" />
                <circle cx="28" cy="120" r="3.5" />
                <circle cx="68" cy="68" r="3" />
                <circle cx="172" cy="68" r="2.5" />
                <circle cx="172" cy="172" r="3" />
                <circle cx="68" cy="172" r="2.5" />
              </g>
            </svg>
            <button
              type="button"
              className="como-funciona__firma-pausa"
              onClick={() => setAnimacionPausada((p) => !p)}
              aria-label={animacionPausada ? 'Reanudar movimiento' : 'Pausar movimiento'}
              aria-pressed={animacionPausada}
            >
              {animacionPausada ? (
                <>
                  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" width="18" height="18">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                  Reanudar
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" width="18" height="18">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor" />
                  </svg>
                  Pausar movimiento
                </>
              )}
            </button>
          </div>
          <div className="como-funciona__rigor" role="note" aria-label="Rigor divulgativo">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 7v10" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            <span>Contenido educativo: información de referencia, no prescripción médica.</span>
          </div>
        </header>

        <ol className="pasos-trayectoria" aria-label="Recorrido guiado en tres pasos">
          <li className="paso">
            <span className="paso__marcador" aria-hidden="true">01</span>
            <span className="paso__numero-grafico" aria-hidden="true">01</span>
            <div className="paso__contenido">
              <div className="paso__icono" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M4 4h8v16H4z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  <path d="M12 4h8v16h-8z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  <path d="M8 8l3-3 3 3" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <a
                className="paso__enlace"
                href="#ejercicios"
                onClick={ir('ejercicios')}
              >
                <h3 className="paso__titulo">Explora</h3>
                <p className="paso__texto">
                  Consulta ejercicios y sus adaptaciones informativas sin asumir que una etiqueta
                  equivale a una autorización clínica.
                </p>
              </a>
            </div>
          </li>
          <li className="paso">
            <span className="paso__marcador" aria-hidden="true">02</span>
            <span className="paso__numero-grafico" aria-hidden="true">02</span>
            <div className="paso__contenido">
              <div className="paso__icono" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  <path d="M12 3v6M12 15v6M3 12h6M15 12h6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  <path d="M12 12l4-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </div>
              <a
                className="paso__enlace"
                href="#quiz"
                onClick={ir('quiz')}
              >
                <h3 className="paso__titulo">Orienta</h3>
                <p className="paso__texto">
                  Usa el cuestionario para ordenar una propuesta educativa según tu tiempo, experiencia
                  y equipamiento.
                </p>
              </a>
            </div>
          </li>
          <li className="paso">
            <span className="paso__marcador" aria-hidden="true">03</span>
            <span className="paso__numero-grafico" aria-hidden="true">03</span>
            <div className="paso__contenido">
              <div className="paso__icono" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <rect x="3" y="4" width="8" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  <rect x="11" y="4" width="4" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  <path d="M7 8l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <a
                className="paso__enlace"
                href="#panel"
                onClick={ir('panel')}
              >
                <h3 className="paso__titulo">Registra</h3>
                <p className="paso__texto">
                  Observa tu actividad y tus sensaciones en un historial local voluntario, sin crear
                  una cuenta.
                </p>
              </a>
            </div>
          </li>
        </ol>
      </section>
    </>
  );
};

export default HomePage;
