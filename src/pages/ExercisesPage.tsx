import React, { useState, useMemo, useEffect, useRef } from 'react';
import { EXERCISES_DATA } from '../data/exercisesData';
import { Exercise, Duration, Difficulty, ExerciseCategory } from '../types';

const difficultyOrder: Record<Difficulty, number> = {
  principiante: 1,
  intermedio: 2,
  avanzado: 3,
};

const durationLabels: Record<Duration, string> = {
  corta: '≤10 min',
  media: '10–20 min',
  larga: '>20 min',
};

const difficultyLabels: Record<Difficulty, string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

const equipmentLabels: Record<string, string> = {
  ninguno: 'Sin equipamiento',
  bandas: 'Bandas elásticas',
  peso: 'Pesas/Mancuernas',
  colchoneta: 'Colchoneta',
};

const zoneLabels: Record<string, string> = {
  piernas: 'Piernas',
  glúteos: 'Glúteos',
  cadera: 'Cadera',
  aductores: 'Aductores',
  core: 'Core',
  lumbar: 'Zona lumbar',
  torax: 'Tórax',
  hombros: 'Hombros',
};

const categoryLabels: Record<ExerciseCategory, string> = {
  actividad_general: 'Actividad física general',
  cuidado_postural: 'Cuidado postural y movilidad',
  psse_supervisado: 'Específico supervisado (PSSE)',
};

const normalizeText = (value: string) =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

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
  const dialogRef = useRef<HTMLDivElement | null>(null);

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

  const handleOpenDialog = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    lastFocusedEl.current = e.currentTarget;
    setActiveModalExerciseIndex(index);
  };

  const handleCloseDialog = () => {
    setActiveModalExerciseIndex(null);
    if (lastFocusedEl.current) {
      lastFocusedEl.current.focus();
    }
  };

  // Keyboard accessibility for modal
  useEffect(() => {
    if (activeModalExerciseIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseDialog();
      } else if (e.key === 'ArrowLeft') {
        if (activeModalExerciseIndex > 0) {
          setActiveModalExerciseIndex(activeModalExerciseIndex - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (activeModalExerciseIndex < filteredExercises.length - 1) {
          setActiveModalExerciseIndex(activeModalExerciseIndex + 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalExerciseIndex, filteredExercises.length]);

  const activeModalExercise: Exercise | null =
    activeModalExerciseIndex !== null ? filteredExercises[activeModalExerciseIndex] || null : null;

  return (
    <main id="contenido" tabIndex={-1} className="container exercise-main">
      <h1 className="texto-3xl">Biblioteca de ejercicios</h1>
      <p className="page-lead">
        Colección educativa de ejercicios generales ejecutables con el propio peso corporal. No constituye prescripción médica ni sustituye una valoración individual.
      </p>

      {/* Categorización transparente de ejercicios */}
      <section className="notice notice-info my-6" aria-labelledby="cat-heading">
        <h2 id="cat-heading" className="text-base font-bold m-0 mb-2">
          Categorización transparente del catálogo
        </h2>
        <div className="grid gap-3 sm:grid-cols-3 text-sm">
          <div className="p-3 bg-[var(--color-superficie)] rounded-[var(--radio-sm)] border border-[var(--color-borde)]">
            <strong>1. Actividad física general:</strong>
            <p className="m-0 mt-1 text-[var(--color-texto-suave)]">
              Ejercicios estándar de fuerza y resistencia con peso corporal para toda la población.
            </p>
          </div>
          <div className="p-3 bg-[var(--color-superficie)] rounded-[var(--radio-sm)] border border-[var(--color-borde)]">
            <strong>2. Cuidado postural y movilidad:</strong>
            <p className="m-0 mt-1 text-[var(--color-texto-suave)]">
              Estiramientos, apertura torácica y estabilización de columna y pelvis.
            </p>
          </div>
          <div className="p-3 bg-[var(--color-superficie)] rounded-[var(--radio-sm)] border border-[var(--color-borde)]">
            <strong>3. Específicos supervisados (PSSE):</strong>
            <p className="m-0 mt-1 text-[var(--color-texto-suave)]">
              Métodos tipo Schroth o SEAS. Requieren valoración y enseñanza presencial por un fisioterapeuta certificado.
            </p>
          </div>
        </div>
      </section>

      <p className="equipment-note">
        Nota de equipamiento: todos los ejercicios actuales de la biblioteca se realizan con el propio peso corporal (sin equipamiento).
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
      <div id="active-filters" className="active-filters" aria-label="Filtros aplicados" role="region">
        {selectedCategory !== 'todas' && (
          <button
            type="button"
            className="active-filter-tag"
            aria-label={`Quitar filtro categoría: ${categoryLabels[selectedCategory]}`}
            onClick={() => setSelectedCategory('todas')}
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
            onClick={() => setSelectedDuration((prev) => prev.filter((x) => x !== dur))}
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
            onClick={() => setSelectedDifficulty((prev) => prev.filter((x) => x !== diff))}
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
            onClick={() => setSelectedEquipment((prev) => prev.filter((x) => x !== eq))}
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
            onClick={() => setSelectedZone((prev) => prev.filter((x) => x !== z))}
          >
            {zoneLabels[z] || z} ×
          </button>
        ))}

        {searchTerm.trim() && (
          <button
            type="button"
            className="active-filter-tag"
            aria-label={`Quitar búsqueda: ${searchTerm.trim()}`}
            onClick={() => setSearchTerm('')}
          >
            Búsqueda: {searchTerm.trim()} ×
          </button>
        )}

        {totalActiveFilterCount > 0 && (
          <button type="button" className="btn secondary" onClick={clearAllFilters}>
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
                  <label key={dur}>
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
                    {durationLabels[dur]}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>Dificultad</legend>
              <div className="choice-list">
                {(['principiante', 'intermedio', 'avanzado'] as Difficulty[]).map((diff) => (
                  <label key={diff}>
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
                    {difficultyLabels[diff]}
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
                    <label key={eq} style={!isAvailable ? { display: 'none' } : undefined}>
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
                      {equipmentLabels[eq] || eq}
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
                  <label key={z}>
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
                    {zoneLabels[z] || z}
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
      <p id="result-count" role="status" className="font-semibold text-lg my-4">
        {filteredExercises.length} ejercicio{filteredExercises.length !== 1 ? 's' : ''} encontrado{filteredExercises.length !== 1 ? 's' : ''}
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
          filteredExercises.map((exercise, index) => (
            <article key={exercise.id} className="exercise-card">
              <span className="exercise-glyph" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M4 14c2.5-5.5 5.5-8 8-8s5.5 2.5 8 8" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 19h16" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>

              {/* Categoría destacada */}
              <div className="mb-2">
                <span
                  className="inline-block text-xs font-semibold px-2 py-0.5 rounded"
                  style={{
                    backgroundColor:
                      exercise.category === 'cuidado_postural'
                        ? 'var(--color-fondo-verde)'
                        : 'var(--color-fondo-azul)',
                    color:
                      exercise.category === 'cuidado_postural'
                        ? 'var(--color-secundario-oscuro)'
                        : 'var(--color-primario-oscuro)',
                  }}
                >
                  {categoryLabels[exercise.category || 'actividad_general']}
                </span>
              </div>

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
                Ver detalle
              </button>
            </article>
          ))
        )}
      </section>

      {/* Detail Dialog / Modal */}
      {activeModalExercise && (
        <div
          className="dialog-backdrop"
          onClick={handleCloseDialog}
          role="presentation"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(23, 38, 48, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            ref={dialogRef}
            id="exercise-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--color-superficie)',
              maxWidth: '42rem',
              width: '100%',
              borderRadius: 'var(--radio-lg)',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--sombra-flotante)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{
                    backgroundColor:
                      activeModalExercise.category === 'cuidado_postural'
                        ? 'var(--color-fondo-verde)'
                        : 'var(--color-fondo-azul)',
                    color:
                      activeModalExercise.category === 'cuidado_postural'
                        ? 'var(--color-secundario-oscuro)'
                        : 'var(--color-primario-oscuro)',
                  }}
                >
                  {categoryLabels[activeModalExercise.category || 'actividad_general']}
                </span>
                <h2 id="dialog-title" tabIndex={-1} style={{ margin: '0.25rem 0 0 0' }}>
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

            <div id="dialog-content" style={{ marginTop: '1.25rem' }}>
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
                      <strong>Estado de revisión:</strong>{' '}
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
                          ? 'Revisado profesionalmente'
                          : 'En proceso de revisión documental'}
                      </span>
                      {activeModalExercise.clinicalMetadata.reviewedBy && (
                        <span> · {activeModalExercise.clinicalMetadata.reviewedBy}</span>
                      )}
                      {activeModalExercise.clinicalMetadata.reviewDate && (
                        <span> ({activeModalExercise.clinicalMetadata.reviewDate})</span>
                      )}
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

              <p className="small-print" style={{ color: 'var(--color-texto-suave)' }}>
                Clasificación de catálogo: <strong>{activeModalExercise.clinicalReview || 'pendiente'}</strong>. Ninguna ficha sustituye la supervisión de un fisioterapeuta o médico.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1.5rem',
                borderTop: '1px solid var(--color-borde)',
                paddingTop: '1rem',
              }}
            >
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
          </div>
        </div>
      )}
    </main>
  );
};
