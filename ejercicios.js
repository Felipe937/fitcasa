// ejercicios.js – Lógica de la biblioteca de ejercicios
// © FitCasa – 2026 – Código sin dependencias ni frameworks

(() => {
  // Poner en true cuando existan los archivos en public/assets/.
  // Mientras sea false no se crea ningún <img>: cero peticiones 404.
  const MOSTRAR_IMAGENES = false;

  // Configuración de mapeo de dificultad para ordenación
  const difficultyOrder = {
    principiante: 1,
    intermedio: 2,
    avanzado: 3,
  };

  const durationLabels = {
    corta: '≤10 min',
    media: '10–20 min',
    larga: '>20 min',
  };

  const difficultyLabels = {
    principiante: 'Principiante',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado',
  };

  const equipmentLabels = {
    ninguno: 'Sin equipamiento',
    bandas: 'Bandas elásticas',
    peso: 'Pesas/Mancuernas',
    colchoneta: 'Colchoneta',
  };

  const zoneLabels = {
    piernas: 'Piernas',
    glúteos: 'Glúteos',
    cadera: 'Cadera',
    aductores: 'Aductores',
    core: 'Core',
    lumbar: 'Zona lumbar',
    torax: 'Tórax',
    hombros: 'Hombros',
  };

  // Valores admitidos en la URL. Lo que no esté aquí se ignora al restaurar.
  const VALID_URL_VALUES = {
    duration: ['corta', 'media', 'larga'],
    difficulty: ['principiante', 'intermedio', 'avanzado'],
    equipment: ['ninguno', 'bandas', 'peso', 'colchoneta'],
    zone: ['piernas', 'glúteos', 'cadera', 'aductores', 'core', 'lumbar', 'torax', 'hombros'],
    order: ['name', 'duration', 'difficulty'],
  };

  const SVG_NS = 'http://www.w3.org/2000/svg';

  // Normaliza texto para comparar sin distinción de acentos ni mayúsculas.
  const normalizeText = (value) => String(value).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Referencias a elementos del DOM
  const resultCountEl = document.getElementById('result-count');
  const exerciseListEl = document.getElementById('exercise-list');
  const activeFiltersEl = document.getElementById('active-filters');
  const filterForm = document.getElementById('filter-form');
  const filtersPanel = document.getElementById('filters-panel');
  const filtersToggle = document.getElementById('filters-toggle');
  const searchInput = document.getElementById('search-input');
  const orderSelect = document.getElementById('order-select');
  const clearBtn = document.getElementById('clear-filters');
  const equipmentNoteEl = document.getElementById('equipment-note');
  const dialog = document.getElementById('exercise-dialog');
  const dialogTitle = dialog.querySelector('h2');
  const dialogBody = dialog.querySelector('#dialog-content');
  const dialogClose = dialog.querySelector('#close-dialog');
  const dialogPrev = dialog.querySelector('#dialog-prev');
  const dialogNext = dialog.querySelector('#dialog-next');

  // Mejora progresiva: sin esta clase el panel de filtros se ve siempre.
  document.documentElement.classList.add('js');

  let exercises = [];
  let currentList = [];
  let currentIndex = -1;
  let lastFocusedButton = null; // para restaurar foco al cerrar el diálogo

  // ---------- UTILIDADES ----------
  const createMetaItem = (label, value) => {
    const item = document.createElement('span');
    item.className = 'exercise-meta-item';
    item.textContent = `${label}: ${value}`;
    return item;
  };

  const createTag = (text) => {
    const tag = document.createElement('span');
    tag.className = 'exercise-tag';
    tag.textContent = text;
    return tag;
  };

  const createTags = (exercise) => {
    const tags = document.createElement('div');
    tags.className = 'exercise-tags';
    if (Array.isArray(exercise.zone)) {
      exercise.zone.forEach((z) => {
        tags.appendChild(createTag(zoneLabels[z] || z));
      });
    }
    // El equipamiento solo se muestra si no es "ninguno".
    if (Array.isArray(exercise.equipment)) {
      exercise.equipment.forEach((eq) => {
        if (eq !== 'ninguno') tags.appendChild(createTag(equipmentLabels[eq] || eq));
      });
    }
    return tags;
  };

  const maybeCreateImage = (exercise) => {
    if (!MOSTRAR_IMAGENES || !exercise.image) return null;
    const img = document.createElement('img');
    img.className = 'exercise-image';
    img.src = exercise.image;
    img.alt = typeof exercise.imageAlt === 'string' ? exercise.imageAlt : '';
    img.loading = 'lazy';
    img.addEventListener('error', () => img.remove());
    return img;
  };

  // Glifo decorativo genérico (el mismo para todas las tarjetas: no clasifica
  // ejercicios). Se crea con DOM seguro, sin innerHTML.
  const createGlyph = () => {
    const wrap = document.createElement('span');
    wrap.className = 'exercise-glyph';
    wrap.setAttribute('aria-hidden', 'true');
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('focusable', 'false');
    const arc = document.createElementNS(SVG_NS, 'path');
    arc.setAttribute('d', 'M4 14c2.5-5.5 5.5-8 8-8s5.5 2.5 8 8');
    const base = document.createElementNS(SVG_NS, 'path');
    base.setAttribute('d', 'M4 19h16');
    svg.appendChild(arc);
    svg.appendChild(base);
    wrap.appendChild(svg);
    return wrap;
  };

  const createCard = (exercise) => {
    const card = document.createElement('article');
    card.className = 'exercise-card';

    card.appendChild(createGlyph());

    const title = document.createElement('h3');
    title.textContent = exercise.name;
    card.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'exercise-desc';
    desc.textContent = exercise.description;
    card.appendChild(desc);

    const meta = document.createElement('div');
    meta.className = 'exercise-meta';
    meta.appendChild(createMetaItem('Duración', durationLabels[exercise.duration] || exercise.duration));
    meta.appendChild(createMetaItem('Dificultad', difficultyLabels[exercise.difficulty] || exercise.difficulty));
    card.appendChild(meta);

    card.appendChild(createTags(exercise));

    // Las notas de adaptación solo aparecen en el diálogo, nunca en la tarjeta.
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn';
    btn.textContent = 'Ver detalle';
    btn.dataset.id = exercise.id;
    btn.addEventListener('click', openDialog);
    card.appendChild(btn);

    return card;
  };

  const clearActiveFilter = (inputName, inputValue) => {
    const input = filterForm.querySelector(`input[name="${inputName}"][value="${inputValue}"]`);
    if (input) {
      input.checked = false;
      applyFilters({ history: 'push' });
    }
  };

  const renderActiveFilters = () => {
    activeFiltersEl.replaceChildren();
    const formData = new FormData(filterForm);
    const chips = [];

    const addChip = (visibleLabel, accessibleLabel, onRemove) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'active-filter-tag';
      chip.setAttribute('aria-label', accessibleLabel);
      chip.textContent = `${visibleLabel} ×`;
      chip.addEventListener('click', onRemove);
      activeFiltersEl.appendChild(chip);
      chips.push(chip);
    };

    ['duration', 'difficulty', 'equipment', 'zone'].forEach((key) => {
      const groupLabel = { duration: 'Duración', difficulty: 'Dificultad', equipment: 'Equipamiento', zone: 'Zona' }[key];
      const valueLabel = { duration: durationLabels, difficulty: difficultyLabels, equipment: equipmentLabels, zone: zoneLabels }[key];
      formData.getAll(key).forEach((v) => {
        const text = valueLabel[v] || v;
        addChip(text, `Quitar filtro: ${text}`, () => clearActiveFilter(key, v));
      });
    });

    if (searchInput.value.trim()) {
      const text = searchInput.value.trim();
      addChip(`Búsqueda: ${text}`, `Quitar búsqueda: ${text}`, () => {
        searchInput.value = '';
        applyFilters({ history: 'push' });
      });
    }

    if (chips.length > 0) {
      const clearAll = document.createElement('button');
      clearAll.type = 'button';
      clearAll.className = 'btn secondary';
      clearAll.textContent = 'Limpiar todo';
      clearAll.addEventListener('click', () => {
        filterForm.reset();
        searchInput.value = '';
        applyFilters({ history: 'push' });
      });
      activeFiltersEl.appendChild(clearAll);
    }
  };

  const updateFiltersToggle = () => {
    const formData = new FormData(filterForm);
    let count = 0;
    ['duration', 'difficulty', 'equipment', 'zone'].forEach((key) => {
      count += formData.getAll(key).length;
    });
    if (searchInput.value.trim()) count += 1;
    filtersToggle.textContent = count > 0 ? `Filtros (${count})` : 'Filtros';
  };

  const render = (list) => {
    currentList = list;
    exerciseListEl.replaceChildren();
    exerciseListEl.setAttribute('aria-busy', 'false');
    // La animación de entrada se repite en cada render (también al filtrar).
    // Sin temporizadores: se quita la clase, se pinta y se reañade tras
    // forzar un reflow. Con movimiento reducido no hay animación que repetir.
    exerciseListEl.classList.remove('animar-entrada');
    if (list.length === 0) {
      const noResult = document.createElement('p');
      noResult.textContent = 'No se encontraron resultados con los filtros actuales.';
      noResult.setAttribute('role', 'status');
      exerciseListEl.appendChild(noResult);

      const clearFiltersBtn = document.createElement('button');
      clearFiltersBtn.type = 'button';
      clearFiltersBtn.className = 'btn secondary';
      clearFiltersBtn.textContent = 'Limpiar filtros';
      clearFiltersBtn.addEventListener('click', () => {
        filterForm.reset();
        searchInput.value = '';
        applyFilters({ history: 'push' });
      });
      exerciseListEl.appendChild(clearFiltersBtn);
    } else {
      const fragment = document.createDocumentFragment();
      list.forEach((ex) => fragment.appendChild(createCard(ex)));
      exerciseListEl.appendChild(fragment);
    }
    // Reflujo síncrono para reiniciar la animación de entrada.
    void exerciseListEl.offsetWidth;
    exerciseListEl.classList.add('animar-entrada');
    // Actualizar contador con role="status"
    resultCountEl.textContent = `${list.length} ejercicio${list.length !== 1 ? 's' : ''} encontrado${list.length !== 1 ? 's' : ''}`;
    renderActiveFilters();
    updateFiltersToggle();
  };

  // history: 'replace' (escritura y carga inicial), 'push' (cambios discretos
  // que se pueden deshacer) o 'none' (restaurar sin tocar el historial).
  const applyFilters = (options) => {
    const formData = new FormData(filterForm);
    const searchTerm = normalizeText(searchInput.value.trim());
    const selectedDuration = formData.getAll('duration'); // array de strings
    const selectedDifficulty = formData.getAll('difficulty');
    const selectedEquipment = formData.getAll('equipment');
    const selectedZone = formData.getAll('zone');
    // Sin filtro de adaptación: los 20 ejercicios tienen nota de adaptación,
    // así que no discriminaría nada. Se restaurará cuando los datos distingan
    // entre ejercicios con y sin adaptación.

    let filtered = exercises.filter((ex) => {
      // Duración
      if (selectedDuration.length && !selectedDuration.includes(ex.duration)) return false;
      // Dificultad
      if (selectedDifficulty.length && !selectedDifficulty.includes(ex.difficulty)) return false;
      // Equipamiento (ex.equipment es array)
      if (selectedEquipment.length && !selectedEquipment.some(eq => ex.equipment.includes(eq))) return false;
      // Zona (ex.zone es array)
      if (selectedZone.length && !selectedZone.some(z => ex.zone.includes(z))) return false;
      // Búsqueda (insensible a acentos: "gluteos" encuentra "Glúteos")
      if (searchTerm && !normalizeText(ex.name).includes(searchTerm) && !normalizeText(ex.description).includes(searchTerm)) return false;
      return true;
    });

    // Ordenamiento
    const order = orderSelect.value;
    if (order === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    } else if (order === 'difficulty') {
      filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    } else if (order === 'duration') {
      const durOrder = { corta: 1, media: 2, larga: 3 };
      filtered.sort((a, b) => durOrder[a.duration] - durOrder[b.duration]);
    }

    render(filtered);
    syncUrl(options && options.history ? options.history : 'replace');
  };

  const syncUrl = (mode) => {
    const params = new URLSearchParams();
    const formData = new FormData(filterForm);
    // Guardar cada filtro sólo si tiene al menos un valor seleccionado
    ['duration', 'difficulty', 'equipment', 'zone'].forEach((key) => {
      const values = formData.getAll(key);
      if (values.length) params.set(key, values.join(','));
    });
    if (searchInput.value) params.set('search', searchInput.value.trim());
    if (orderSelect.value) params.set('order', orderSelect.value);

    const query = params.toString();
    const newUrl = query ? `${location.pathname}?${query}` : location.pathname;
    if (mode === 'none') return;
    if (mode === 'push') history.pushState(null, '', newUrl);
    else history.replaceState(null, '', newUrl);
  };

  // Oculta las opciones de filtro que ningún ejercicio cumple (atributo hidden
  // en el label y disabled en el input) y el fieldset entero si le quedan
  // menos de 2 opciones visibles.
  const pruneDeadOptions = () => {
    const present = { duration: new Set(), difficulty: new Set(), equipment: new Set(), zone: new Set() };
    exercises.forEach((ex) => {
      if (typeof ex.duration === 'string') present.duration.add(ex.duration);
      if (typeof ex.difficulty === 'string') present.difficulty.add(ex.difficulty);
      (Array.isArray(ex.equipment) ? ex.equipment : []).forEach((value) => present.equipment.add(value));
      (Array.isArray(ex.zone) ? ex.zone : []).forEach((value) => present.zone.add(value));
    });
    Object.keys(present).forEach((key) => {
      const inputs = filterForm.querySelectorAll(`input[name="${key}"]`);
      inputs.forEach((input) => {
        const label = input.closest('label');
        if (!present[key].has(input.value)) {
          input.disabled = true;
          if (label) label.hidden = true;
        }
      });
      const fieldset = inputs.length ? inputs[0].closest('fieldset') : null;
      if (fieldset) {
        const visible = fieldset.querySelectorAll('label:not([hidden])').length;
        if (visible < 2) fieldset.hidden = true;
      }
    });
    // Nota calculada con los datos: solo si todo es sin equipamiento.
    const onlyNone = exercises.length > 0 && exercises.every((ex) =>
      Array.isArray(ex.equipment) && ex.equipment.length > 0 && ex.equipment.every((eq) => eq === 'ninguno'));
    equipmentNoteEl.hidden = !onlyNone;
  };

  const restoreFromUrl = () => {
    const params = new URLSearchParams(location.search);
    // Se parte del estado limpio para que Atrás/Adelante también desmarque.
    filterForm.reset();
    searchInput.value = '';
    orderSelect.value = 'name';
    // Restaurar filtros: se ignoran valores fuera de vocabulario y los de
    // opciones ocultas (sin ejercicios que los cumplan).
    ['duration', 'difficulty', 'equipment', 'zone'].forEach((key) => {
      const val = params.get(key);
      if (val) {
        const values = val.split(',');
        values.forEach((v) => {
          if (!VALID_URL_VALUES[key].includes(v)) return;
          const input = filterForm.querySelector(`input[name="${key}"][value="${v}"]`);
          if (input && !input.disabled && !(input.closest('label') && input.closest('label').hidden)) input.checked = true;
        });
      }
    });
    if (params.get('search')) searchInput.value = params.get('search').trim();
    if (params.get('order') && VALID_URL_VALUES.order.includes(params.get('order'))) {
      orderSelect.value = params.get('order');
    }
  };

  const renderSkeletons = () => {
    exerciseListEl.replaceChildren();
    exerciseListEl.setAttribute('aria-busy', 'true');
    for (let i = 0; i < 6; i += 1) {
      const skeleton = document.createElement('div');
      skeleton.className = 'exercise-skeleton';
      skeleton.setAttribute('aria-hidden', 'true');
      exerciseListEl.appendChild(skeleton);
    }
  };

  const loadExercises = async () => {
    resultCountEl.textContent = 'Cargando ejercicios…';
    renderSkeletons();

    try {
      const resp = await fetch('ejercicios.json');
      if (!resp.ok) throw new Error('Error al cargar los datos de ejercicios');
      exercises = await resp.json();
    } catch (err) {
      exerciseListEl.replaceChildren();
      exerciseListEl.setAttribute('aria-busy', 'false');
      const errorMessage = document.createElement('p');
      errorMessage.setAttribute('role', 'alert');
      errorMessage.textContent = 'No se pudieron cargar los ejercicios. Por favor, intenta de nuevo.';
      exerciseListEl.appendChild(errorMessage);

      const retryBtn = document.createElement('button');
      retryBtn.type = 'button';
      retryBtn.className = 'btn';
      retryBtn.textContent = 'Reintentar';
      retryBtn.addEventListener('click', loadExercises);
      exerciseListEl.appendChild(retryBtn);

      resultCountEl.textContent = 'Error al cargar';
      return;
    }

    pruneDeadOptions();
    restoreFromUrl();
    applyFilters();
  };

  const renderDialog = (index) => {
    const ex = currentList[index];
    if (!ex) return;
    currentIndex = index;
    dialogTitle.textContent = ex.name;
    dialogBody.replaceChildren();
    const frag = document.createDocumentFragment();
    const img = maybeCreateImage(ex);
    if (img) frag.appendChild(img);
    const pDesc = document.createElement('p');
    pDesc.textContent = ex.description;
    frag.appendChild(pDesc);
    const meta = document.createElement('div');
    meta.className = 'exercise-meta';
    meta.appendChild(createMetaItem('Duración', durationLabels[ex.duration] || ex.duration));
    meta.appendChild(createMetaItem('Dificultad', difficultyLabels[ex.difficulty] || ex.difficulty));
    frag.appendChild(meta);
    frag.appendChild(createTags(ex));
    if (ex.adaptation && ex.adaptation.notes) {
      const adapt = document.createElement('p');
      adapt.textContent = `Nota general de adaptación: ${ex.adaptation.notes}`;
      frag.appendChild(adapt);
    }
    const review = document.createElement('p');
    review.textContent = `Estado de revisión: ${ex.clinicalReview}`;
    frag.appendChild(review);
    dialogBody.appendChild(frag);
    dialogPrev.disabled = currentIndex <= 0;
    dialogNext.disabled = currentIndex >= currentList.length - 1;
  };

  const openDialog = (e) => {
    const id = e.currentTarget.dataset.id;
    const index = currentList.findIndex((item) => item.id === id);
    if (index === -1) return;
    // Guardar foco
    lastFocusedButton = e.currentTarget;
    renderDialog(index);
    dialog.showModal();
    // Enfocar el diálogo
    dialog.focus();
  };

  const closeDialog = () => {
    dialog.close();
  };

  // ---------- EVENTOS ----------
  // Cambios discretos (casillas, orden, limpiezas): pushState para poder
  // deshacerlos. Escritura frecuente (buscador): replaceState.
  filterForm.addEventListener('change', () => applyFilters({ history: 'push' }));
  searchInput.addEventListener('input', () => {
    // debounce simple: 300 ms
    clearTimeout(searchInput._debounce);
    searchInput._debounce = setTimeout(() => applyFilters({ history: 'replace' }), 300);
  });
  orderSelect.addEventListener('change', () => applyFilters({ history: 'push' }));
  clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    filterForm.reset();
    searchInput.value = '';
    applyFilters({ history: 'push' });
  });
  // Atrás/Adelante: restaura filtros y resultados sin tocar el historial.
  window.addEventListener('popstate', () => {
    restoreFromUrl();
    applyFilters({ history: 'none' });
  });
  filtersToggle.addEventListener('click', () => {
    const open = filtersPanel.classList.toggle('abierto');
    filtersToggle.setAttribute('aria-expanded', String(open));
  });
  dialogClose.addEventListener('click', closeDialog);
  dialogPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
      renderDialog(currentIndex - 1);
      dialogTitle.focus();
    }
  });
  dialogNext.addEventListener('click', () => {
    if (currentIndex >= 0 && currentIndex < currentList.length - 1) {
      renderDialog(currentIndex + 1);
      dialogTitle.focus();
    }
  });
  // El <dialog> ya cierra con Escape; el foco se restaura en el evento "close".
  dialog.addEventListener('close', () => {
    if (lastFocusedButton) lastFocusedButton.focus();
  });
  // Cerrar al hacer click fuera del contenido pero dentro del elemento <dialog>
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeDialog();
  });

  // ---------- INICIALIZACIÓN ----------
  document.addEventListener('DOMContentLoaded', loadExercises);
})();
