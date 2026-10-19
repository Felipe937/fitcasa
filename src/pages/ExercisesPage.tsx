import React, { useState, useMemo, useEffect, useRef } from 'react';
import { EXERCISES_DATA } from '../data/exercisesData';
import {
  durationLabels,
  difficultyLabels,
  equipmentLabels,
  zoneLabels,
  categoryLabels,
} from '../data/exerciseLabels';
import { Exercise, Duration, Difficulty, ExerciseCategory } from '../types';
import { getExerciseVideo } from '../data/exerciseVideos';
import { ProductoRecomendado } from '../components/ProductoRecomendado';
import { getProductosByEjercicioId } from '../data/productos';

const difficultyOrder: Record<Difficulty, number> = {
  principiante: 1,
  intermedio: 2,
  avanzado: 3,
};

const normalizeText = (value: string) =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const categoryModifier: Record<string, string> = {
  actividad_general: 'actividad',
  cuidado_postural: 'postural',
  psse_supervisado: 'psse',
};

/**
 * Ilustración cinemática abstracta para el Hero:
 * Refleja vectores de movimiento humano, fluidez postural y biomecánica
 * en la paleta oficial (salvia, verde bosque y terracota).
 */
const IlustracionCinematica = React.forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="exercise-hero__visual" aria-hidden="true">
    <svg
      viewBox="0 0 460 300"
      className="exercise-hero__svg"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
      role="presentation"
    >
      <defs>
        <pattern id="hero-mov-grid" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.1" fill="var(--color-secundario)" opacity="0.18" />
        </pattern>
      </defs>

      {/* Malla nanométrica de referencia */}
      <rect width="460" height="300" fill="url(#hero-mov-grid)" rx="16" />
      <circle cx="240" cy="150" r="125" fill="var(--color-fondo-verde)" opacity="0.72" />

      {/* Trayectorias cinemáticas continuas de energía */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Curva de propulsión principal */}
        <path
          d="M 50 240 C 120 210 180 75 300 85 C 375 92 410 160 435 225"
          stroke="var(--color-secundario)"
          strokeWidth="3.2"
          opacity="0.9"
        />
        {/* Trayectoria de oscilación secundaria */}
        <path
          d="M 80 260 C 145 230 195 125 310 125 C 375 125 400 185 425 245"
          stroke="var(--color-secundario)"
          strokeWidth="1.8"
          strokeDasharray="4 6"
          opacity="0.65"
        />
        {/* Vector de alineación axial y plano transversal */}
        <path
          d="M 160 195 C 205 155 250 135 315 155"
          stroke="var(--color-terciario)"
          strokeWidth="2.2"
          opacity="0.8"
        />

        {/* Nodos cinemáticos articulares */}
        <circle cx="160" cy="195" r="4.5" fill="var(--color-terciario)" />
        <circle cx="240" cy="145" r="5" fill="var(--color-primario)" />
        <circle cx="315" cy="155" r="4.5" fill="var(--color-secundario-oscuro)" />
      </g>

      {/* Esquema cinemático de postura dinámica en zancada */}
      <g stroke="var(--color-primario)" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.8">
        {/* Cabeza */}
        <circle cx="260" cy="90" r="13" fill="var(--color-fondo-verde)" strokeWidth="2" />
        {/* Columna dinámica */}
        <path d="M 256 103 C 252 135 244 165 234 190" />
        {/* Extremidad superior anterior */}
        <path d="M 252 130 L 290 140 L 320 125" />
        {/* Extremidad superior posterior */}
        <path d="M 252 130 L 222 145 L 196 170" />
        {/* Extremidad inferior posterior (empuje) */}
        <path d="M 234 190 L 210 230 L 180 265" />
        {/* Extremidad inferior anterior (apoyo) */}
        <path d="M 234 190 L 270 225 L 295 268" />
      </g>

      {/* Anotaciones científicas sutiles */}
      <g fill="var(--color-secundario-oscuro)" fontSize="10" fontWeight="800" letterSpacing="0.08em">
        <text x="24" y="38">VECTOR CINEMÁTICO</text>
        <text x="325" y="280">CADENCIA Y CONTROL</text>
      </g>

      {/* Arco angular de amplitud de movimiento */}
      <g stroke="var(--color-terciario)" strokeWidth="1.2" opacity="0.7">
        <path d="M 230 190 L 255 190 A 25 25 0 0 1 245 212" fill="none" />
      </g>
    </svg>
  </div>
));

IlustracionCinematica.displayName = 'IlustracionCinematica';

/**
 * Póster artístico sofisticado con profundidad por capas SVG para cada categoría:
 *  - actividad_general: dinamismo, vectores cinéticos de fuerza y propulsión.
 *  - cuidado_postural: curvaturas armónicas, alineación espinal y descompresión.
 *  - psse_supervisado: autocorrección activa tridimensional, planos estabilizadores.
 */
const PosterArt: React.FC<{ category?: ExerciseCategory }> = ({ category }) => {
  const mod = categoryModifier[category || 'actividad_general'];

  return (
    <span className={`exercise-media__arte exercise-media--${mod}`} aria-hidden="true">
      <svg viewBox="0 0 320 180" focusable="false" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={`puntos-${mod}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.3" fill="currentColor" opacity="0.18" />
          </pattern>
        </defs>

        {/* Superficie base con textura nanométrica */}
        <rect width="320" height="180" fill="currentColor" opacity="0.06" />
        <rect x="170" y="15" width="135" height="70" fill={`url(#puntos-${mod})`} />

        {/* CUIDADO POSTURAL Y MOVILIDAD: curvas raquídeas y expansión torácica */}
        {mod === 'postural' && (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Curva de alineación espinal fluida */}
            <path d="M 36 150 C 85 110 115 65 162 46 C 205 28 250 55 285 135" strokeWidth="2.8" opacity="0.65" />
            {/* Eje de descompresión axial */}
            <path d="M 162 35 L 162 155" strokeWidth="1.2" strokeDasharray="3 5" opacity="0.4" />
            {/* Arcos de expansión torácica bilateral */}
            <path d="M 125 90 C 145 75 180 75 200 90" strokeWidth="2" opacity="0.5" />
            <path d="M 115 115 C 145 95 180 95 210 115" strokeWidth="1.6" opacity="0.4" />
            {/* Marcadores de centro neutral */}
            <circle cx="162" cy="46" r="3.5" fill="currentColor" opacity="0.75" />
            <circle cx="162" cy="100" r="3" fill="currentColor" opacity="0.6" />
            <circle cx="162" cy="140" r="3.5" fill="currentColor" opacity="0.75" />
          </g>
        )}

        {/* ACTIVIDAD FÍSICA GENERAL: dinamismo, plano de fuerza y propulsión */}
        {mod === 'actividad' && (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Plano de apoyo horizontal */}
            <path d="M 30 140 H 180" strokeWidth="2.5" opacity="0.6" />
            {/* Vector dinámico de flexión y empuje */}
            <path d="M 65 140 L 78 80 L 138 60 L 190 95" strokeWidth="2.2" opacity="0.65" />
            {/* Masa gravitacional en aceleración */}
            <circle cx="138" cy="60" r="7.5" fill="currentColor" opacity="0.25" strokeWidth="2" />
            {/* Ondas de propulsión cinemática */}
            <path d="M 195 50 C 230 50 265 75 290 120" strokeWidth="2" strokeDasharray="5 5" opacity="0.5" />
            <path d="M 215 70 C 240 70 265 90 280 130" strokeWidth="1.4" opacity="0.35" />
            {/* Vínculo de potencia */}
            <line x1="78" y1="80" x2="138" y2="105" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.4" />
          </g>
        )}

        {/* PSSE SUPERVISADO (SCHROTH / SEAS): autocorrección 3D y estabilización */}
        {mod === 'psse' && (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Eje de referencia ortostática */}
            <path d="M 50 35 V 145" strokeWidth="1.8" opacity="0.45" />
            <path d="M 50 60 H 76 M 50 90 H 90 M 50 120 H 68" strokeWidth="1.8" opacity="0.45" />
            {/* Curva de deflexión asimétrica y autocorrección guiada */}
            <path d="M 150 150 C 190 115 225 85 285 70" strokeWidth="2.6" opacity="0.7" />
            {/* Vector corrector tridimensional en ángulo opuesto */}
            <path d="M 235 60 L 205 90 M 205 90 L 218 90 M 205 90 L 205 78" strokeWidth="2" opacity="0.8" />
            {/* Cuadrante de supervisión médica */}
            <rect x="235" y="105" width="62" height="26" rx="4" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.45" />
            <circle cx="266" cy="118" r="3.5" fill="currentColor" opacity="0.6" />
          </g>
        )}
      </svg>
    </span>
  );
};

export const ExercisesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'todas'>('todas');
  const [orderSelect, setOrderSelect] = useState<'name' | 'difficulty' | 'duration'>('name');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Dialog state
  const [activeModalExerciseIndex, setActiveModalExerciseIndex] = useState<number | null>(null);
  const lastFocusedEl = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playbackRate, setPlaybackRate] = useState<'0.5' | '1'>('1');
  const [loopOn, setLoopOn] = useState(false);
  const activeFiltersRef = useRef<HTMLDivElement | null>(null);
  const shouldRestoreFocus = useRef(false);
  const exerciseListRef = useRef<HTMLElement | null>(null);
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const hasReadUrlRef = useRef(false);
  const [urlStateReady, setUrlStateReady] = useState(false);
  const [listIsVisible, setListIsVisible] = useState(false);

  // Check URL params on initial load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const dur = params.get('duration');
      if (dur) setSelectedDuration(dur.split(','));
      const diff = params.get('difficulty');
      if (diff) setSelectedDifficulty(diff.split(','));
      const eq = params.get('equipment');
      if (eq) setSelectedEquipment(eq.split(','));
      const z = params.get('zone');
      if (z) setSelectedZone(z.split(','));
      const cat = params.get('category');
      if (cat && ['actividad_general', 'cuidado_postural', 'psse_supervisado'].includes(cat)) {
        setSelectedCategory(cat as ExerciseCategory);
      }
      const s = params.get('search');
      if (s) setSearchTerm(s);
      const o = params.get('order');
      if (o && ['name', 'difficulty', 'duration'].includes(o)) {
        setOrderSelect(o as 'name' | 'difficulty' | 'duration');
      }
    } catch {
      // Ignored
    } finally {
      hasReadUrlRef.current = true;
      setUrlStateReady(true);
    }
  }, []);

  // Mantiene filtros y orden compartibles sin recargar ni interrumpir el foco.
  useEffect(() => {
    if (!hasReadUrlRef.current || !urlStateReady || typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    ['duration', 'difficulty', 'equipment', 'zone', 'category', 'search', 'order'].forEach((key) => params.delete(key));
    if (selectedDuration.length) params.set('duration', selectedDuration.join(','));
    if (selectedDifficulty.length) params.set('difficulty', selectedDifficulty.join(','));
    if (selectedEquipment.length) params.set('equipment', selectedEquipment.join(','));
    if (selectedZone.length) params.set('zone', selectedZone.join(','));
    if (selectedCategory !== 'todas') params.set('category', selectedCategory);
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (orderSelect !== 'name') params.set('order', orderSelect);

    const query = params.toString();
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`,
    );
  }, [urlStateReady, searchTerm, selectedDuration, selectedDifficulty, selectedEquipment, selectedZone, selectedCategory, orderSelect]);

  // El contenido ya está en el DOM: el observador solo activa su entrada visual.
  useEffect(() => {
    const list = exerciseListRef.current;
    if (!list || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setListIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setListIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );

    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  // Parallax corto y pasivo para dar profundidad sin desplazar el contenido.
  useEffect(() => {
    const visual = heroVisualRef.current;
    if (!visual || typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return;

    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      const rect = visual.getBoundingClientRect();
      const progress = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / Math.max(window.innerHeight, 1);
      const offset = Math.max(-6, Math.min(6, progress * 6));
      visual.style.setProperty('--hero-parallax-y', `${offset.toFixed(2)}px`);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Filter & sort
  const filteredExercises = useMemo(() => {
    const term = normalizeText(searchTerm.trim());
    const list = EXERCISES_DATA.filter((ex) => {
      if (selectedDuration.length && !selectedDuration.includes(ex.duration)) return false;
      if (selectedDifficulty.length && !selectedDifficulty.includes(ex.difficulty)) return false;
      if (selectedEquipment.length && !selectedEquipment.some((eq) => ex.equipment.includes(eq))) return false;
      if (selectedZone.length && !selectedZone.some((z) => ex.zone.includes(z))) return false;
      if (selectedCategory !== 'todas' && ex.category !== selectedCategory) return false;
      if (
        term &&
        !normalizeText(ex.name).includes(term) &&
        !normalizeText(ex.description).includes(term)
      ) {
        return false;
      }
      return true;
    });

    if (orderSelect === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    } else if (orderSelect === 'difficulty') {
      list.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    } else if (orderSelect === 'duration') {
      const durOrder = { corta: 1, media: 2, larga: 3 };
      list.sort((a, b) => durOrder[a.duration] - durOrder[b.duration]);
    }
    return list;
  }, [searchTerm, selectedDuration, selectedDifficulty, selectedEquipment, selectedZone, selectedCategory, orderSelect]);

  // Contadores por categoría calculados a partir de los datos reales
  const categoryCounts = useMemo(() => {
    const counts = {
      todas: EXERCISES_DATA.length,
      actividad_general: 0,
      cuidado_postural: 0,
      psse_supervisado: 0,
    };
    EXERCISES_DATA.forEach((ex) => {
      if (ex.category && ex.category in counts) {
        counts[ex.category]++;
      }
    });
    return counts;
  }, []);

  // Available options
  const availableOptions = useMemo(() => {
    const duration = new Set<string>();
    const difficulty = new Set<string>();
    const equipment = new Set<string>();
    const zone = new Set<string>();
    EXERCISES_DATA.forEach((ex) => {
      duration.add(ex.duration);
      difficulty.add(ex.difficulty);
      ex.equipment.forEach((item) => equipment.add(item));
      ex.zone.forEach((item) => zone.add(item));
    });
    return { duration, difficulty, equipment, zone };
  }, []);

  const totalActiveFilterCount =
    selectedDuration.length +
    selectedDifficulty.length +
    selectedEquipment.length +
    selectedZone.length +
    (selectedCategory !== 'todas' ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedDuration([]);
    setSelectedDifficulty([]);
    setSelectedEquipment([]);
    setSelectedZone([]);
    setSelectedCategory('todas');
    setOrderSelect('name');
  };

  // Al quitar un filtro con el teclado el foco no debe caer en <body>
  useEffect(() => {
    if (!shouldRestoreFocus.current) return;
    shouldRestoreFocus.current = false;
    const siguiente = activeFiltersRef.current?.querySelector<HTMLButtonElement>('.active-filter-tag');
    if (siguiente) {
      siguiente.focus();
      return;
    }
    const limpiar = document.getElementById('clear-all-filters') as HTMLButtonElement | null;
    if (limpiar) {
      limpiar.focus();
      return;
    }
    const toggle = document.getElementById('filters-toggle') as HTMLButtonElement | null;
    if (toggle && toggle.offsetParent !== null) toggle.focus();
    else document.getElementById('search-input')?.focus();
  }, [totalActiveFilterCount]);

  const quitarFiltro = (cambio: () => void) => {
    shouldRestoreFocus.current = true;
    cambio();
  };

  const handleOpenDialog = (index: number, e: React.MouseEvent<HTMLElement>) => {
    lastFocusedEl.current = e.currentTarget;
    setActiveModalExerciseIndex(index);
  };

  const handleCloseDialog = () => {
    setActiveModalExerciseIndex(null);
    if (lastFocusedEl.current) {
      lastFocusedEl.current.focus();
    }
  };

  // <dialog> nativo
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (activeModalExerciseIndex !== null) {
      if (!dlg.open) dlg.showModal();
    } else if (dlg.open) {
      dlg.close();
    }
  }, [activeModalExerciseIndex]);

  // Anterior / Siguiente con teclado
  useEffect(() => {
    if (activeModalExerciseIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.closest('video') || target.closest('input, select, textarea'))) return;
      if (e.key === 'ArrowLeft' && activeModalExerciseIndex > 0) {
        e.preventDefault();
        setActiveModalExerciseIndex(activeModalExerciseIndex - 1);
      } else if (e.key === 'ArrowRight' && activeModalExerciseIndex < filteredExercises.length - 1) {
        e.preventDefault();
        setActiveModalExerciseIndex(activeModalExerciseIndex + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalExerciseIndex, filteredExercises.length]);

  // Limpieza de vídeo
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = Number(playbackRate);
    v.loop = loopOn;
    return () => {
      v.pause();
      v.removeAttribute('src');
      v.load();
    };
  }, [activeModalExerciseIndex, playbackRate, loopOn]);

  const activeModalExercise: Exercise | null =
    activeModalExerciseIndex !== null ? filteredExercises[activeModalExerciseIndex] || null : null;

  const activeModalVideo = getExerciseVideo(activeModalExercise?.id || '');

  // Renderizado del medidor visual de dificultad accesible
  const renderDifficultyIndicator = (diff: Difficulty) => {
    const level = difficultyOrder[diff] || 1;
    return (
      <span className="exercise-difficulty" title={`Dificultad: ${difficultyLabels[diff]}`}>
        <span className="exercise-difficulty__label">{difficultyLabels[diff]}</span>
        <span className="exercise-difficulty__meter" aria-hidden="true">
          <span className={`exercise-difficulty__bar ${level >= 1 ? 'is-active' : ''}`} />
          <span className={`exercise-difficulty__bar ${level >= 2 ? 'is-active' : ''}`} />
          <span className={`exercise-difficulty__bar ${level >= 3 ? 'is-active' : ''}`} />
        </span>
      </span>
    );
  };

  // Renderizado de duración con icono
  const renderDurationBadge = (dur: Duration) => (
    <span className="exercise-duration">
      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 4.5v3.8l2.5 1.4" strokeLinecap="round" />
      </svg>
      <span>{durationLabels[dur] || dur}</span>
    </span>
  );

  return (
    <main id="contenido" tabIndex={-1} className="exercise-main">
      {/* ── 1. HERO EDITORIAL ASIMÉTRICO ── */}
      <section className="exercise-hero" aria-labelledby="biblioteca-titulo">
        <div className="exercise-hero__inner">
          <div className="exercise-hero__texto">
            <p className="exercise-hero__insignia">
              <span className="exercise-hero__insignia-punto" aria-hidden="true" />
              Catálogo de movimiento · Peso corporal
            </p>

            <h1 id="biblioteca-titulo" className="exercise-hero__titulo">
              Biblioteca de ejercicios
            </h1>

            <p className="exercise-hero__lead">
              Colección educativa de ejercicios generales ejecutables con el propio peso corporal. No constituye prescripción médica ni sustituye una valoración individual.
            </p>

            {/* Métrica viva calculada de datos reales */}
            <div className="exercise-hero__stats">
              <div className="exercise-hero__stat-item">
                <span className="exercise-hero__stat-num">{EXERCISES_DATA.length}</span>
                <span className="exercise-hero__stat-label">ejercicios curados</span>
              </div>
              <div className="exercise-hero__stat-divisor" aria-hidden="true" />
              <div className="exercise-hero__stat-item">
                <span className="exercise-hero__stat-num">0</span>
                <span className="exercise-hero__stat-label">equipamiento requerido</span>
              </div>
              <div className="exercise-hero__stat-divisor" aria-hidden="true" />
              <div className="exercise-hero__stat-item">
                <span className="exercise-hero__stat-num">3</span>
                <span className="exercise-hero__stat-label">enfoques de trabajo</span>
              </div>
            </div>
          </div>

          <IlustracionCinematica ref={heroVisualRef} />
        </div>
      </section>

      <div className="exercise-cuerpo">
        {/* Categorización del catálogo transparente */}
        <details className="catalogo">
          <summary className="catalogo__summary">
            <div className="catalogo__summary-header">
              <h2 className="catalogo__titulo" id="cat-heading">
                Categorización transparente del catálogo
              </h2>
              <span className="catalogo__badge">Guía clínica</span>
            </div>
            <span className="catalogo__resumen">
              Tres grupos: actividad física general, cuidado postural y movilidad, y métodos específicos supervisados (PSSE).
            </span>
          </summary>
          <div className="catalogo__rejilla">
            <div className="catalogo__item catalogo__item--actividad">
              <strong>1. Actividad física general</strong>
              <p className="catalogo__texto">
                Ejercicios estándar de fuerza y resistencia con peso corporal para toda la población.
              </p>
            </div>
            <div className="catalogo__item catalogo__item--postural">
              <strong>2. Cuidado postural y movilidad</strong>
              <p className="catalogo__texto">
                Estiramientos, apertura torácica y estabilización de columna y pelvis.
              </p>
            </div>
            <div className="catalogo__item catalogo__item--psse">
              <strong>3. Específicos supervisados (PSSE)</strong>
              <p className="catalogo__texto">
                Métodos tipo Schroth o SEAS. Requieren valoración y enseñanza presencial por un fisioterapeuta certificado.
              </p>
            </div>
          </div>
        </details>

        {/* Pestañas rápidas de filtrado por categoría */}
        <nav className="category-tabs" aria-label="Filtrar por categoría principal">
          <button
            type="button"
            className={`category-tab ${selectedCategory === 'todas' ? 'is-active' : ''}`}
            onClick={() => setSelectedCategory('todas')}
            aria-pressed={selectedCategory === 'todas'}
          >
            <span>Todas</span>
            <span className="category-tab__count">{categoryCounts.todas}</span>
          </button>
          <button
            type="button"
            className={`category-tab ${selectedCategory === 'actividad_general' ? 'is-active' : ''}`}
            onClick={() => setSelectedCategory('actividad_general')}
            aria-pressed={selectedCategory === 'actividad_general'}
          >
            <span>Actividad general</span>
            <span className="category-tab__count">{categoryCounts.actividad_general}</span>
          </button>
          <button
            type="button"
            className={`category-tab ${selectedCategory === 'cuidado_postural' ? 'is-active' : ''}`}
            onClick={() => setSelectedCategory('cuidado_postural')}
            aria-pressed={selectedCategory === 'cuidado_postural'}
          >
            <span>Cuidado postural</span>
            <span className="category-tab__count">{categoryCounts.cuidado_postural}</span>
          </button>
          <button
            type="button"
            className={`category-tab ${selectedCategory === 'psse_supervisado' ? 'is-active' : ''}`}
            onClick={() => setSelectedCategory('psse_supervisado')}
            aria-pressed={selectedCategory === 'psse_supervisado'}
          >
            <span>PSSE supervisado</span>
            <span className="category-tab__count">{categoryCounts.psse_supervisado}</span>
          </button>
        </nav>

        {/* Barra de herramientas: Búsqueda, ordenación y toggles de filtros */}
        <section className="toolbar" aria-label="Herramientas de búsqueda y orden">
          <div className="toolbar-search">
            <label htmlFor="search-input" className="sr-only">
              Buscar ejercicios
            </label>
            <div className="toolbar-search__caja">
              <svg className="toolbar-search__icono" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="5.5" />
                <path d="M13 13l4.5 4.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                id="search-input"
                name="exercise-search"
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, zona o descripción…"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="toolbar-search__clear"
                  aria-label="Borrar término de búsqueda"
                  onClick={() => setSearchTerm('')}
                >
                  Borrar
                </button>
              )}
            </div>
          </div>

          <div className="toolbar-order">
            <label htmlFor="order-select">Ordenar por</label>
            <select
              id="order-select"
              value={orderSelect}
              onChange={(e) => setOrderSelect(e.target.value as 'name' | 'difficulty' | 'duration')}
            >
              <option value="name">Nombre (A–Z)</option>
              <option value="difficulty">Dificultad</option>
              <option value="duration">Duración</option>
            </select>
          </div>

          <button
            type="button"
            id="filters-toggle"
            className={`btn secondary ${filtersOpen ? 'is-open' : ''}`}
            aria-expanded={filtersOpen}
            aria-controls="filters-panel"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M3 5h14M6 10h8M9 15h2" strokeLinecap="round" />
            </svg>
            <span>{totalActiveFilterCount > 0 ? `Filtros (${totalActiveFilterCount})` : 'Filtros avanzados'}</span>
          </button>
        </section>

        {/* Chips de filtros activos */}
        {totalActiveFilterCount > 0 && (
          <div
            id="active-filters"
            className="active-filters"
            aria-label="Filtros aplicados"
            role="region"
            ref={activeFiltersRef}
          >
            {selectedCategory !== 'todas' && (
              <button
                type="button"
                className="active-filter-tag"
                aria-label={`Quitar filtro categoría: ${categoryLabels[selectedCategory]}`}
                onClick={() => quitarFiltro(() => setSelectedCategory('todas'))}
              >
                {categoryLabels[selectedCategory]} · Quitar
              </button>
            )}

            {selectedDuration.map((dur) => (
              <button
                key={`dur-${dur}`}
                type="button"
                className="active-filter-tag"
                aria-label={`Quitar filtro: ${durationLabels[dur as Duration] || dur}`}
                onClick={() => quitarFiltro(() => setSelectedDuration((prev) => prev.filter((x) => x !== dur)))}
              >
                {durationLabels[dur as Duration] || dur} · Quitar
              </button>
            ))}

            {selectedDifficulty.map((diff) => (
              <button
                key={`diff-${diff}`}
                type="button"
                className="active-filter-tag"
                aria-label={`Quitar filtro: ${difficultyLabels[diff as Difficulty] || diff}`}
                onClick={() => quitarFiltro(() => setSelectedDifficulty((prev) => prev.filter((x) => x !== diff)))}
              >
                {difficultyLabels[diff as Difficulty] || diff} · Quitar
              </button>
            ))}

            {selectedEquipment.map((eq) => (
              <button
                key={`eq-${eq}`}
                type="button"
                className="active-filter-tag"
                aria-label={`Quitar filtro: ${equipmentLabels[eq] || eq}`}
                onClick={() => quitarFiltro(() => setSelectedEquipment((prev) => prev.filter((x) => x !== eq)))}
              >
                {equipmentLabels[eq] || eq} · Quitar
              </button>
            ))}

            {selectedZone.map((z) => (
              <button
                key={`z-${z}`}
                type="button"
                className="active-filter-tag"
                aria-label={`Quitar filtro: ${zoneLabels[z] || z}`}
                onClick={() => quitarFiltro(() => setSelectedZone((prev) => prev.filter((x) => x !== z)))}
              >
                {zoneLabels[z] || z} · Quitar
              </button>
            ))}

            {searchTerm.trim() && (
              <button
                type="button"
                className="active-filter-tag"
                aria-label={`Quitar búsqueda: ${searchTerm.trim()}`}
                onClick={() => quitarFiltro(() => setSearchTerm(''))}
              >
                Búsqueda: “{searchTerm.trim()}” · Quitar
              </button>
            )}

            <button type="button" id="clear-all-filters" className="active-filters__clear-all" onClick={() => quitarFiltro(clearAllFilters)}>
              Limpiar todo
            </button>
          </div>
        )}

        {/* Panel de filtros avanzados colapsable */}
        <section
          id="filters-panel"
          className={`filters-panel ${filtersOpen ? 'abierto' : ''}`}
          aria-label="Filtros de la biblioteca"
          aria-hidden={!filtersOpen}
        >
          <form id="filter-form" onSubmit={(e) => e.preventDefault()}>
            <div className="filter-group">
              <fieldset>
                <legend>Duración</legend>
                <div className="choice-list">
                  {(['corta', 'media', 'larga'] as Duration[]).map((dur) => (
                    <label key={dur} className="chip">
                      <input
                        type="checkbox"
                        name="duration"
                        value={dur}
                        checked={selectedDuration.includes(dur)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSelectedDuration((prev) =>
                            checked ? [...prev, dur] : prev.filter((x) => x !== dur)
                          );
                        }}
                      />
                      <span>{durationLabels[dur]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend>Dificultad</legend>
                <div className="choice-list">
                  {(['principiante', 'intermedio', 'avanzado'] as Difficulty[]).map((diff) => (
                    <label key={diff} className="chip">
                      <input
                        type="checkbox"
                        name="difficulty"
                        value={diff}
                        checked={selectedDifficulty.includes(diff)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSelectedDifficulty((prev) =>
                            checked ? [...prev, diff] : prev.filter((x) => x !== diff)
                          );
                        }}
                      />
                      <span>{difficultyLabels[diff]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend>Equipamiento</legend>
                <div className="choice-list">
                  {['ninguno', 'bandas', 'peso', 'colchoneta'].map((eq) => {
                    const isAvailable = availableOptions.equipment.has(eq);
                    return (
                      <label key={eq} className="chip" style={!isAvailable ? { display: 'none' } : undefined}>
                        <input
                          type="checkbox"
                          name="equipment"
                          value={eq}
                          disabled={!isAvailable}
                          checked={selectedEquipment.includes(eq)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setSelectedEquipment((prev) =>
                              checked ? [...prev, eq] : prev.filter((x) => x !== eq)
                            );
                          }}
                        />
                        <span>{equipmentLabels[eq] || eq}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend>Zona corporal</legend>
                <div className="choice-list">
                  {[
                    'piernas',
                    'glúteos',
                    'cadera',
                    'aductores',
                    'core',
                    'lumbar',
                    'torax',
                    'hombros',
                  ].map((z) => (
                    <label key={z} className="chip">
                      <input
                        type="checkbox"
                        name="zone"
                        value={z}
                        checked={selectedZone.includes(z)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSelectedZone((prev) =>
                            checked ? [...prev, z] : prev.filter((x) => x !== z)
                          );
                        }}
                      />
                      <span>{zoneLabels[z] || z}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="filters-panel__footer">
              <button
                type="button"
                id="clear-filters"
                className="btn secondary"
                onClick={clearAllFilters}
              >
                Restablecer filtros
              </button>
            </div>
          </form>
        </section>

        {/* Contador de resultados */}
        <div className="result-counter-bar">
          <p id="result-count" role="status" className="result-counter">
            Mostrando <strong>{filteredExercises.length}</strong> {filteredExercises.length === 1 ? 'ejercicio' : 'ejercicios'}
            {totalActiveFilterCount > 0 ? ' (filtrados)' : ' del catálogo'}
          </p>
        </div>

        {/* ── 2. CATÁLOGO CURADO DE TARJETAS ── */}
        <section
          id="exercise-list"
          ref={exerciseListRef}
          className={`exercise-grid ${listIsVisible ? 'is-visible' : ''}`}
          aria-busy="false"
          aria-live="polite"
        >
          {filteredExercises.length === 0 ? (
            <div className="exercise-empty-state" role="status">
              <div className="exercise-empty-state__icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="24" cy="24" r="20" strokeDasharray="4 4" />
                  <path d="M16 28c2.5-3 5-4.5 8-4.5s5.5 1.5 8 4.5" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="2" fill="currentColor" />
                  <circle cx="30" cy="18" r="2" fill="currentColor" />
                </svg>
              </div>
              <h3 className="exercise-empty-state__title">No se encontraron ejercicios</h3>
              <p className="exercise-empty-state__desc">
                No hay coincidencias con los filtros aplicados. Prueba a buscar con otros términos o restablece los criterios.
              </p>
              <button type="button" className="btn secondary" onClick={clearAllFilters}>
                Restablecer todos los filtros
              </button>
            </div>
          ) : (
            filteredExercises.map((exercise, index) => {
              const video = getExerciseVideo(exercise.id);
              const mod = categoryModifier[exercise.category || 'actividad_general'];
              // Variación rítmica editorial: cuando no hay filtros activos, el primer ejercicio adquiere estatus destacado en desktop
              const isFeatured = index === 0 && totalActiveFilterCount === 0;

              return (
                <article
                  key={exercise.id}
                  className={`exercise-card exercise-card--${mod} ${isFeatured ? 'exercise-card--destacada' : ''}`}
                  style={{ '--card-index': index } as React.CSSProperties}
                >
                  <div className={`exercise-media exercise-media--${mod}`}>
                    <PosterArt category={exercise.category} />
                    {video.hasVideo ? (
                      <button
                        type="button"
                        className="exercise-media__velo"
                        data-id={exercise.id}
                        aria-label={`Ver demostración de ${exercise.name}`}
                        onClick={(e) => handleOpenDialog(index, e)}
                      >
                        <span className="exercise-media__play" aria-hidden="true">
                          <svg viewBox="0 0 24 24" focusable="false">
                            <path d="M8 5.5v13l11-6.5Z" />
                          </svg>
                        </span>
                      </button>
                    ) : (
                      <p className="exercise-media__estado">Demostración en preparación</p>
                    )}
                  </div>

                  <div className="exercise-card__contenido">
                    <div className="exercise-card__encabezado">
                      <span className={`category-tag category-tag--${mod}`}>
                        {categoryLabels[exercise.category || 'actividad_general']}
                      </span>
                      {renderDurationBadge(exercise.duration)}
                    </div>

                    <h3 className="exercise-card__titulo">{exercise.name}</h3>
                    <p className="exercise-desc">{exercise.description}</p>

                    <div className="exercise-meta">
                      {renderDifficultyIndicator(exercise.difficulty)}
                    </div>

                    <div className="exercise-tags">
                      {exercise.zone.map((z) => (
                        <span key={z} className="exercise-tag">
                          {zoneLabels[z] || z}
                        </span>
                      ))}
                      {exercise.equipment
                        .filter((eq) => eq !== 'ninguno')
                        .map((eq) => (
                          <span key={eq} className="exercise-tag exercise-tag--equipment">
                            {equipmentLabels[eq] || eq}
                          </span>
                        ))}
                    </div>

                    <button
                      type="button"
                      className="btn exercise-card__cta"
                      data-id={exercise.id}
                      onClick={(e) => handleOpenDialog(index, e)}
                    >
                      <span>Ver detalle y ejercicio</span>
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* ── 3. MODAL DE DETALLE EN MODO CINE (<dialog> nativo) ── */}
        {activeModalExercise && (
          <dialog
            ref={dialogRef}
            id="exercise-dialog"
            aria-labelledby="dialog-title"
            onClose={handleCloseDialog}
            onClick={(e) => {
              if (e.target === dialogRef.current) handleCloseDialog();
            }}
          >
            <div className="dialog-cabecera">
              <div>
                <span className={`category-tag category-tag--${categoryModifier[activeModalExercise.category || 'actividad_general']}`}>
                  {categoryLabels[activeModalExercise.category || 'actividad_general']}
                </span>
                <h2 id="dialog-title" tabIndex={-1}>
                  {activeModalExercise.name}
                </h2>
              </div>
              <button
                type="button"
                id="close-dialog"
                className="btn secondary dialog-close-btn"
                onClick={handleCloseDialog}
                aria-label="Cerrar detalle"
              >
                Cerrar
              </button>
            </div>

            {activeModalVideo.hasVideo ? (
              <>
                <video
                  key={activeModalExercise.id}
                  ref={videoRef}
                  className="dialog-video"
                  src={activeModalVideo.src}
                  poster={activeModalVideo.poster}
                  controls
                  playsInline
                  preload="none"
                  aria-label={`Demostración de ${activeModalExercise.name}`}
                >
                  Tu navegador no puede reproducir este vídeo.
                </video>
                <div className="dialog-video-controls">
                  <div className="dialog-video-controls__grupo">
                    <span id="velocidad-label">Velocidad</span>
                    <div role="group" aria-labelledby="velocidad-label">
                      <button
                        type="button"
                        aria-pressed={playbackRate === '0.5'}
                        onClick={() => setPlaybackRate('0.5')}
                      >
                        0,5×
                      </button>
                      <button
                        type="button"
                        aria-pressed={playbackRate === '1'}
                        onClick={() => setPlaybackRate('1')}
                      >
                        1×
                      </button>
                    </div>
                  </div>
                  <div className="dialog-video-controls__grupo">
                    <button
                      type="button"
                      id="toggle-loop"
                      aria-pressed={loopOn}
                      onClick={() => setLoopOn((v) => !v)}
                    >
                      {loopOn ? 'Bucle activado' : 'Repetir en bucle'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="dialog-sin-video">
                <span className="exercise-media__estado-inline" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path
                      d="M4 6.5h16v11H4z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinejoin="round"
                    />
                    <path d="M10 9.8v4.4l4-2.2Z" fill="currentColor" />
                  </svg>
                </span>
                <span>
                  <strong>Demostración próximamente</strong>
                  <span>
                    La demostración en vídeo de este ejercicio todavía no está publicada.
                  </span>
                </span>
              </p>
            )}

            <div id="dialog-content">
              <p className="dialog-descripcion">{activeModalExercise.description}</p>

              <div className="exercise-meta dialog-meta">
                <span className="exercise-meta-item">
                  Duración: {durationLabels[activeModalExercise.duration] || activeModalExercise.duration}
                </span>
                <span className="exercise-meta-item">
                  Dificultad: {difficultyLabels[activeModalExercise.difficulty] || activeModalExercise.difficulty}
                </span>
              </div>

              <div className="exercise-tags dialog-tags">
                {activeModalExercise.zone.map((z) => (
                  <span key={z} className="exercise-tag">
                    {zoneLabels[z] || z}
                  </span>
                ))}
                {activeModalExercise.equipment
                  .filter((eq) => eq !== 'ninguno')
                  .map((eq) => (
                    <span key={eq} className="exercise-tag exercise-tag--equipment">
                      {equipmentLabels[eq] || eq}
                    </span>
                  ))}
              </div>

              {/* Sugerencia de equipamiento relacionado */}
              {(() => {
                const productosRelacionados = getProductosByEjercicioId(activeModalExercise.id);
                if (productosRelacionados.length > 0) {
                  return (
                    <div className="exercise-equipamiento-sugerido">
                      <h4 className="exercise-equipamiento-sugerido__titulo">
                        Material sugerido para este ejercicio
                      </h4>
                      <div className="exercise-equipamiento-sugerido__grid">
                        {productosRelacionados.map((producto) => (
                          <ProductoRecomendado key={producto.id} producto={producto} variant="inline" />
                        ))}
                      </div>
                      <p className="exercise-equipamiento-sugerido__nota">
                        El equipamiento es opcional y no sustituye la supervisión profesional. Prioriza siempre tu confort y seguridad.
                      </p>
                    </div>
                  );
                }
                return null;
              })()}

              {activeModalExercise.adaptation && activeModalExercise.adaptation.notes && (
                <div className="notice warning dialog-notice">
                  <strong>Nota general de adaptación:</strong> {activeModalExercise.adaptation.notes}
                </div>
              )}

              {/* Metadatos Clínicos Auditables */}
              {activeModalExercise.clinicalMetadata && (
                <div className="clinical-sheet">
                  <h3 className="clinical-sheet__titulo">Ficha de revisión documental</h3>
                  <div className="clinical-sheet__cuerpo">
                    <p className="m-0">
                      <strong>Estado de la ficha:</strong>{' '}
                      <span
                        className="font-medium"
                        style={{
                          color:
                            activeModalExercise.clinicalMetadata.reviewStatus === 'revisado_profesional'
                              ? 'var(--color-secundario-oscuro)'
                              : 'var(--color-foco)',
                        }}
                      >
                        {activeModalExercise.clinicalMetadata.reviewStatus === 'revisado_profesional'
                          ? 'Revisión documental completada'
                          : 'En proceso de revisión documental'}
                      </span>
                      {activeModalExercise.clinicalMetadata.reviewedBy && (
                        <span> · {activeModalExercise.clinicalMetadata.reviewedBy}</span>
                      )}
                      {activeModalExercise.clinicalMetadata.reviewDate && (
                        <span> ({activeModalExercise.clinicalMetadata.reviewDate})</span>
                      )}
                    </p>
                    <p className="clinical-sheet__disclaimer">
                      Esta ficha recoge el contenido publicado y sus fuentes. No constituye una validación clínica por parte de un profesional sanitario.
                    </p>

                    {activeModalExercise.clinicalMetadata.precautions &&
                      activeModalExercise.clinicalMetadata.precautions.length > 0 && (
                        <div className="clinical-sheet__seccion">
                          <strong>Precauciones para escoliosis / postura:</strong>
                          <ul>
                            {activeModalExercise.clinicalMetadata.precautions.map((prec, i) => (
                              <li key={i}>{prec}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {activeModalExercise.clinicalMetadata.contraindications &&
                      activeModalExercise.clinicalMetadata.contraindications.length > 0 && (
                        <div className="clinical-sheet__seccion">
                          <strong>Contraindicaciones relativas:</strong>
                          <ul>
                            {activeModalExercise.clinicalMetadata.contraindications.map((contra, i) => (
                              <li key={i}>{contra}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {activeModalExercise.clinicalMetadata.evidenceReferences &&
                      activeModalExercise.clinicalMetadata.evidenceReferences.length > 0 && (
                        <div className="clinical-sheet__seccion">
                          <strong>Fuentes de evidencia:</strong>
                          <ul>
                            {activeModalExercise.clinicalMetadata.evidenceReferences.map((ref, i) => (
                              <li key={i}>
                                {ref.title} — <em>{ref.source}</em>
                                {ref.url && (
                                  <>
                                    {' '}
                                    <a
                                      href={ref.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="underline"
                                    >
                                      [Ver enlace]
                                    </a>
                                  </>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              )}

              <p className="dialog-aviso-clinico">
                Información general orientativa, no sustituye la prescripción de un profesional sanitario.
              </p>

              <p className="small-print">
                Clasificación de catálogo: <strong>{activeModalExercise.clinicalReview || 'pendiente'}</strong>. Ninguna ficha sustituye la supervisión de un fisioterapeuta o médico.
              </p>
            </div>

            <div className="dialog-nav">
              <button
                type="button"
                id="dialog-prev"
                className="btn secondary"
                disabled={activeModalExerciseIndex === null || activeModalExerciseIndex <= 0}
                onClick={() => {
                  if (activeModalExerciseIndex !== null && activeModalExerciseIndex > 0) {
                    setActiveModalExerciseIndex(activeModalExerciseIndex - 1);
                  }
                }}
              >
                ← Anterior
              </button>

              <button
                type="button"
                id="dialog-next"
                className="btn secondary"
                disabled={
                  activeModalExerciseIndex === null ||
                  activeModalExerciseIndex >= filteredExercises.length - 1
                }
                onClick={() => {
                  if (
                    activeModalExerciseIndex !== null &&
                    activeModalExerciseIndex < filteredExercises.length - 1
                  ) {
                    setActiveModalExerciseIndex(activeModalExerciseIndex + 1);
                  }
                }}
              >
                Siguiente →
              </button>
            </div>
          </dialog>
        )}
      </div>
    </main>
  );
};

export default ExercisesPage;
