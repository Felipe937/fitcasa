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

/** Póster abstracto y decorativo: distingue la categoría sin inventar anatomía. */
const PosterArt: React.FC<{ category?: ExerciseCategory }> = ({ category }) => {
  const mod = categoryModifier[category || 'actividad_general'];
  return (
    <span className={`exercise-media__arte exercise-media--${mod}`} aria-hidden="true">
      <svg viewBox="0 0 320 180" focusable="false" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={`puntos-${mod}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="currentColor" opacity="0.16" />
          </pattern>
        </defs>
        <rect x="176" y="18" width="128" height="66" fill={`url(#puntos-${mod})`} />
        {mod === 'postural' && (
          <>
            <path d="M40 148C88 108 112 62 160 44" strokeWidth="2" opacity="0.5" />
            <path d="M232 44C268 74 280 112 258 148" strokeWidth="1.5" opacity="0.35" />
          </>
        )}
        {mod === 'actividad' && (
          <>
            <path d="M34 132h120" strokeWidth="2.5" opacity="0.55" />
            <path d="M74 132V74l52-18" strokeWidth="2" opacity="0.4" />
            <circle cx="126" cy="56" r="7" strokeWidth="2" opacity="0.55" />
          </>
        )}
        {mod === 'psse' && (
          <>
            <path d="M52 40v100" strokeWidth="1.5" opacity="0.4" />
            <path d="M52 66h22M52 96h34M52 126h16" strokeWidth="1.5" opacity="0.4" />
            <path d="M160 148C196 112 232 84 282 70" strokeWidth="2" opacity="0.5" />
          </>
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
    }
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

  // Al quitar un filtro con el teclado el foco no debe caer en <body>:
  // pasa al filtro siguiente, a «Limpiar todo» o al botón «Filtros».
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
    // A partir de 64rem el botón «Filtros» está oculto: cae al buscador.
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

  // El <dialog> nativo aporta foco atrapado, inertización del fondo y Escape.
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (activeModalExerciseIndex !== null) {
      if (!dlg.open) dlg.showModal();
    } else if (dlg.open) {
      dlg.close();
    }
  }, [activeModalExerciseIndex]);

  // Anterior / Siguiente con teclado, salvo dentro del reproductor o un control.
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

  // Al cerrar o cambiar de ejercicio se detiene la reproducción y se libera
  // la fuente para que el navegador deje de descargar el clip.
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

  return (
    <main id="contenido" tabIndex={-1} className="container exercise-main">
      <h1 className="texto-3xl">Biblioteca de ejercicios</h1>
      <p className="page-lead">
        Colección educativa de ejercicios generales ejecutables con el propio peso corporal. No constituye prescripción médica ni sustituye una valoración individual.
      </p>

      {/* Categorización del catálogo: plegada para no tapar la primera fila. */}
      <details className="catalogo">
        <summary className="catalogo__summary">
          <h2 className="catalogo__titulo" id="cat-heading">
            Categorización transparente del catálogo
          </h2>
          <span className="catalogo__resumen">
            Tres grupos: actividad física general, cuidado postural y movilidad, y
            métodos específicos supervisados (PSSE).
          </span>
        </summary>
        <div className="catalogo__rejilla">
          <div className="catalogo__item">
            <strong>1. Actividad física general:</strong>
            <p className="catalogo__texto">
              Ejercicios estándar de fuerza y resistencia con peso corporal para toda la población.
            </p>
          </div>
          <div className="catalogo__item">
            <strong>2. Cuidado postural y movilidad:</strong>
            <p className="catalogo__texto">
              Estiramientos, apertura torácica y estabilización de columna y pelvis.
            </p>
          </div>
          <div className="catalogo__item">
            <strong>3. Específicos supervisados (PSSE):</strong>
            <p className="catalogo__texto">
              Métodos tipo Schroth o SEAS. Requieren valoración y enseñanza presencial por un
              fisioterapeuta certificado.
            </p>
          </div>
        </div>
      </details>

      <p className="equipment-note">
        Nota de equipamiento: todos los ejercicios actuales de la biblioteca se realizan con el
        propio peso corporal (sin equipamiento).
      </p>

      {/* Toolbar */}
      <section className="toolbar" aria-label="Herramientas de búsqueda y orden">
        <div className="toolbar-search">
          <label htmlFor="search-input" className="sr-only">
            Buscar ejercicios
          </label>
          <input
            type="search"
            id="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o descripción…"
          />
        </div>

        <div className="toolbar-order">
          <label htmlFor="category-select">Categoría</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ExerciseCategory | 'todas')}
          >
            <option value="todas">Todas las categorías</option>
            <option value="actividad_general">Actividad física general</option>
            <option value="cuidado_postural">Cuidado postural y movilidad</option>
            <option value="psse_supervisado">Específico supervisado (PSSE)</option>
          </select>
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
          className="btn secondary"
          aria-expanded={filtersOpen}
          aria-controls="filters-panel"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          {totalActiveFilterCount > 0 ? `Filtros (${totalActiveFilterCount})` : 'Filtros'}
        </button>
      </section>

      {/* Active filters chips */}
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
            {categoryLabels[selectedCategory]} ×
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
            {durationLabels[dur as Duration] || dur} ×
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
            {difficultyLabels[diff as Difficulty] || diff} ×
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
            {equipmentLabels[eq] || eq} ×
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
            {zoneLabels[z] || z} ×
          </button>
        ))}

        {searchTerm.trim() && (
          <button
            type="button"
            className="active-filter-tag"
            aria-label={`Quitar búsqueda: ${searchTerm.trim()}`}
            onClick={() => quitarFiltro(() => setSearchTerm(''))}
          >
            Búsqueda: {searchTerm.trim()} ×
          </button>
        )}

        {totalActiveFilterCount > 0 && (
          <button type="button" id="clear-all-filters" className="btn secondary" onClick={() => quitarFiltro(clearAllFilters)}>
            Limpiar todo
          </button>
        )}
      </div>

      {/* Filter panel */}
      <section
        id="filters-panel"
        className={`filters-panel ${filtersOpen ? 'abierto' : ''}`}
        aria-label="Filtros de la biblioteca"
        style={filtersOpen ? { display: 'block' } : undefined}
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

          <button
            type="button"
            id="clear-filters"
            className="btn secondary"
            onClick={clearAllFilters}
          >
            Limpiar filtros
          </button>
        </form>
      </section>

      {/* Result count */}
      <p id="result-count" role="status" className="result-counter">
        {filteredExercises.length} ejercicio{filteredExercises.length !== 1 ? 's' : ''} encontrado
        {filteredExercises.length !== 1 ? 's' : ''}
      </p>

      {/* Exercise list grid */}
      <section
        id="exercise-list"
        className="exercise-grid animar-entrada"
        aria-busy="false"
        aria-live="polite"
      >
        {filteredExercises.length === 0 ? (
          <div>
            <p role="status">No se encontraron resultados con los filtros actuales.</p>
            <button type="button" className="btn secondary mt-3" onClick={clearAllFilters}>
              Limpiar filtros
            </button>
          </div>
        ) : (
          filteredExercises.map((exercise, index) => {
            const video = getExerciseVideo(exercise.id);
            const mod = categoryModifier[exercise.category || 'actividad_general'];
            return (
              <article key={exercise.id} className="exercise-card">
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
                    <p className="exercise-media__estado">Demostración próximamente</p>
                  )}
                </div>

                <span className="category-tag">
                  {categoryLabels[exercise.category || 'actividad_general']}
                </span>

                <h3>{exercise.name}</h3>
                <p className="exercise-desc">{exercise.description}</p>

                <div className="exercise-meta">
                  <span className="exercise-meta-item">
                    Duración: {durationLabels[exercise.duration] || exercise.duration}
                  </span>
                  <span className="exercise-meta-item">
                    Dificultad: {difficultyLabels[exercise.difficulty] || exercise.difficulty}
                  </span>
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
                      <span key={eq} className="exercise-tag">
                        {equipmentLabels[eq] || eq}
                      </span>
                    ))}
                </div>

                <button
                  type="button"
                  className="btn"
                  data-id={exercise.id}
                  onClick={(e) => handleOpenDialog(index, e)}
                >
                  Ver detalle y ejercicio
                </button>
              </article>
            );
          })
        )}
      </section>

      {/* Detalle en modo cine. El <dialog> nativo da foco atrapado y Escape. */}
      {activeModalExercise && (
        <dialog
          ref={dialogRef}
          id="exercise-dialog"
          aria-labelledby="dialog-title"
          onClose={handleCloseDialog}
          onClick={(e) => {
            // Solo cierra si el clic cae en el propio diálogo (fuera de su caja).
            if (e.target === dialogRef.current) handleCloseDialog();
          }}
        >
          <div className="dialog-cabecera">
            <div>
              <span className="category-tag">
                {categoryLabels[activeModalExercise.category || 'actividad_general']}
              </span>
              <h2 id="dialog-title" tabIndex={-1}>
                {activeModalExercise.name}
              </h2>
            </div>
            <button
              type="button"
              id="close-dialog"
              className="btn secondary"
              onClick={handleCloseDialog}
              aria-label="Cerrar detalle"
            >
              ✕ Cerrar
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
              <p>{activeModalExercise.description}</p>

              <div className="exercise-meta" style={{ marginTop: '1rem' }}>
                <span className="exercise-meta-item">
                  Duración: {durationLabels[activeModalExercise.duration] || activeModalExercise.duration}
                </span>
                <span className="exercise-meta-item">
                  Dificultad: {difficultyLabels[activeModalExercise.difficulty] || activeModalExercise.difficulty}
                </span>
              </div>

              <div className="exercise-tags" style={{ margin: '1rem 0' }}>
                {activeModalExercise.zone.map((z) => (
                  <span key={z} className="exercise-tag">
                    {zoneLabels[z] || z}
                  </span>
                ))}
                {activeModalExercise.equipment
                  .filter((eq) => eq !== 'ninguno')
                  .map((eq) => (
                    <span key={eq} className="exercise-tag">
                      {equipmentLabels[eq] || eq}
                    </span>
                  ))}
              </div>

              {/* Sugerencia de equipamiento relacionado */}
              {(() => {
                const productosRelacionados = getProductosByEjercicioId(activeModalExercise.id);
                if (productosRelacionados.length > 0) {
                  return (
                    <div className="exercise-equipamiento-sugerido" style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--color-fondo-verde)', border: '1px solid var(--color-borde)', borderLeft: '3px solid var(--color-secundario)', borderRadius: 'var(--radio-md)' }}>
                      <h4 style={{ margin: '0 0 0.75rem', fontSize: 'var(--texto-sm)', fontWeight: 700, color: 'var(--color-primario-oscuro)' }}>
                        Material sugerido para este ejercicio
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {productosRelacionados.map((producto) => (
                          <ProductoRecomendado key={producto.id} producto={producto} variant="inline" />
                        ))}
                      </div>
                      <p style={{ margin: '0.75rem 0 0', fontSize: 'var(--texto-xs)', color: 'var(--color-texto-suave)', fontStyle: 'italic' }}>
                        El equipamiento es opcional y no sustituye la supervisión profesional. Prioriza siempre tu confort y seguridad.
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
              {activeModalExercise.adaptation && activeModalExercise.adaptation.notes && (
                <div className="notice warning" style={{ margin: '1.25rem 0' }}>
                  <strong>Nota general de adaptación:</strong> {activeModalExercise.adaptation.notes}
                </div>
              )}

              {/* Metadatos Clínicos Auditables */}
              {activeModalExercise.clinicalMetadata && (
                <div
                  className="clinical-sheet p-4 rounded-[var(--radio-md)] border border-[var(--color-borde)] bg-[var(--color-fondo)] my-4 text-sm"
                >
                  <h3 className="text-sm font-bold m-0 mb-2">Ficha de revisión documental</h3>
                  <div className="space-y-2">
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
                    <p className="m-0">
                      Esta ficha recoge el contenido publicado y sus fuentes. No constituye
                      una validación clínica por parte de un profesional sanitario.
                    </p>

                    {activeModalExercise.clinicalMetadata.precautions &&
                      activeModalExercise.clinicalMetadata.precautions.length > 0 && (
                        <div>
                          <strong>Precauciones para escoliosis / postura:</strong>
                          <ul className="list-disc pl-5 m-0 mt-1 space-y-1">
                            {activeModalExercise.clinicalMetadata.precautions.map((prec, i) => (
                              <li key={i}>{prec}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {activeModalExercise.clinicalMetadata.contraindications &&
                      activeModalExercise.clinicalMetadata.contraindications.length > 0 && (
                        <div>
                          <strong>Contraindicaciones relativas:</strong>
                          <ul className="list-disc pl-5 m-0 mt-1 space-y-1">
                            {activeModalExercise.clinicalMetadata.contraindications.map((contra, i) => (
                              <li key={i}>{contra}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {activeModalExercise.clinicalMetadata.evidenceReferences &&
                      activeModalExercise.clinicalMetadata.evidenceReferences.length > 0 && (
                        <div>
                          <strong>Fuentes de evidencia:</strong>
                          <ul className="list-disc pl-5 m-0 mt-1 space-y-1">
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
                Información general orientativa, no sustituye la prescripción de un
                profesional sanitario.
              </p>

              <p className="small-print" style={{ color: 'var(--color-texto-suave)' }}>
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
    </main>
  );
};
