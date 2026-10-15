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

  const MAX_SEARCH = 80;
  const SVG_NS = 'http://www.w3.org/2000/svg';

  // Mejora progresiva: sin esta clase el panel de filtros se ve siempre.
  document.documentElement.classList.add('js');

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
  const dialogCounter = dialog.querySelector('#dialog-counter');
  const dialogReview = dialog.querySelector('#dialog-review');
  const dialogBody = dialog.querySelector('#dialog-content');
  const dialogClose = dialog.querySelector('#close-dialog');
  const dialogPrev = dialog.querySelector('#dialog-prev');
  const dialogNext = dialog.querySelector('#dialog-next');

  let exercises = [];
  let currentList = [];
  let currentIndex = -1;
  let lastFocusedButton = null; // para restaurar foco al cerrar el diálogo
  let renderFrame = 0; // cancela el movimiento de foco si llega otro cambio

  // ---------- UTILIDADES ----------
  const createSvg = (paths) => {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('focusable', 'false');
    paths.forEach((d) => {
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', d);
      svg.appendChild(path);
    });
    return svg;
  };

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

  // Fila compacta de metadatos: duración (reloj) y dificultad (tres puntos).
  const createMeta = (exercise) => {
    const meta = document.createElement('div');
    meta.className = 'exercise-meta';

    const duration = document.createElement('span');
    duration.className = 'meta-cell';
    const clock = createSvg(['M12 7.5v5', 'M12 16.5h.01', 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Z']);
    clock.setAttribute('class', '');
    clock.removeAttribute('class');
    clock.classList.add('meta-icon');
    clock.setAttribute('aria-hidden', 'true');
    duration.appendChild(clock);
    duration.appendChild(document.createTextNode(durationLabels[exercise.duration] || exercise.duration));
    meta.appendChild(duration);

    const difficulty = document.createElement('span');
    difficulty.className = 'meta-cell';
    const dots = document.createElement('span');
    dots.className = 'meta-dots';
    dots.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 3; i += 1) {
      const dot = document.createElement('span');
      dot.className = 'meta-dot';
      dots.appendChild(dot);
    }
    dots.dataset.level = String(difficultyOrder[exercise.difficulty] || 0);
    difficulty.appendChild(dots);
    difficulty.appendChild(document.createTextNode(difficultyLabels[exercise.difficulty] || exercise.difficulty));
    meta.appendChild(difficulty);

    return meta;
  };

  // Glifo decorativo genérico (el mismo para todas las tarjetas: no clasifica
  // ejercicios). Se crea con DOM seguro, sin innerHTML.
  // Categorías del catálogo. Clasificación descriptiva, no clínica.
  const CATEGORY_LABELS = {
    actividad_general: 'Actividad física general',
    cuidado_postural: 'Cuidado postural y movilidad',
    psse_supervisado: 'Ejercicios específicos supervisados (PSSE)',
  };

  const categoryLabel = (exercise) => CATEGORY_LABELS[exercise.category] || '';

  const createCategoryTag = (exercise) => {
    const tag = document.createElement('span');
    tag.className = 'category-tag';
    tag.textContent = categoryLabel(exercise) || 'Sin clasificar';
    // Los PSSE se señalan explícitamente como de prescripción presencial.
    if (exercise.category === 'psse_supervisado') {
      tag.className = 'category-tag category-tag--psse';
      const note = document.createElement('span');
      note.className = 'category-note';
      note.textContent = 'Requiere prescripción y supervisión presencial';
      tag.appendChild(note);
    }
    return tag;
  };

  const createCard = (exercise) => {
    const card = document.createElement('article');
    card.className = 'exercise-card';
    // Nombre único para la transición de vista de esta tarjeta.
    if (document.startViewTransition) card.style.viewTransitionName = `card-${exercise.id}`;

    const glyph = document.createElement('span');
    glyph.className = 'exercise-glyph';
    glyph.setAttribute('aria-hidden', 'true');
    glyph.appendChild(createSvg([
      'M4 14c2.5-5.5 5.5-8 8-8s5.5 2.5 8 8',
      'M4 19h16',
    ]));
    card.appendChild(glyph);

    const title = document.createElement('h3');
    title.textContent = exercise.name;
    card.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'exercise-desc';
    desc.textContent = exercise.description;
    card.appendChild(desc);

    card.appendChild(createMeta(exercise));
    card.appendChild(createCategoryTag(exercise));
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

  // ---------- CONTADORES POR OPCIÓN (mecanismo propio, ajeno a pruneDeadOptions) ----------
  // Cuenta los ejercicios que cumpliría cada opción given el RESTO de filtros.
  const matchesFilters = (ex, criteria) => criteria.every(([key, values]) => {
    const data = ex[key];
    if (!values.length) return true;
    return Array.isArray(data) ? values.some((v) => data.includes(v)) : values.includes(data);
  });

  const buildCriteria = (excludeKey) => {
    const formData = new FormData(filterForm);
    const keys = ['duration', 'difficulty', 'equipment', 'zone'];
    return keys.filter((k) => k !== excludeKey).map((k) => [k, formData.getAll(k)]);
  };

  const updateChipCounts = () => {
    filterForm.querySelectorAll('.chip-count').forEach((countEl) => {
      const input = countEl.closest('label').querySelector('input[type="checkbox"]');
      if (!input) return;
      // Ejercicios que daría esa opción con el resto de filtros activos.
      const total = exercises.filter((ex) => {
        const value = Array.isArray(ex[input.name]) ? ex[input.name] : [ex[input.name]];
        if (!value.includes(input.value)) return false;
        return matchesFilters(ex, buildCriteria(input.name));
      }).length;
      countEl.textContent = String(total);
      // Opción sin resultados y sin marcar: atenuada y desactivada.
      if (total === 0 && !input.checked) {
        countEl.closest('label').setAttribute('data-sin-resultados', 'true');
        input.setAttribute('aria-disabled', 'true');
        input.disabled = true;
      } else {
        countEl.closest('label').removeAttribute('data-sin-resultados');
        if (input.getAttribute('aria-disabled') === 'true') {
          input.removeAttribute('aria-disabled');
          // No se reactiva lo que pruneDeadOptions ya ocultó.
          if (!input.closest('label').hidden) input.disabled = false;
        }
      }
    });
  };

  const clearActiveFilter = (inputName, inputValue) => {
    const input = filterForm.querySelector(`input[name="${inputName}"][value="${inputValue}"]`);
    if (!input) return;
    // Posición del chip que se va a quitar, medida antes de re-renderizar.
    const before = Array.prototype.slice.call(activeFiltersEl.querySelectorAll('.active-filter-tag'));
    const index = before.findIndex((chip) => chip.dataset.key === inputName && chip.dataset.value === inputValue);
    const neighbour = index === -1 ? null : (before[index + 1] || before[index - 1]);
    const neighbourKey = neighbour ? neighbour.dataset.key : null;
    const neighbourValue = neighbour ? neighbour.dataset.value : null;
    input.checked = false;
    applyFilters();
    // El foco pasa al chip que ocupa su posición tras el re-render.
    let target = searchInput;
    if (neighbourKey) {
      const after = Array.prototype.slice.call(activeFiltersEl.querySelectorAll('.active-filter-tag'));
      const match = after.find((chip) => chip.dataset.key === neighbourKey && chip.dataset.value === neighbourValue);
      if (match) target = match;
    }
    focusLater(target);
  };

  // Mueve el foco cuando el DOM ya está actualizado (la transición de vista
  // actualiza el DOM de forma síncrona dentro de su callback).
  const focusLater = (element) => {
    renderFrame += 1;
    const frame = renderFrame;
    var run = function () {
      if (frame !== renderFrame) return;
      if (element && typeof element.focus === 'function') element.focus();
    };
    if (typeof Promise === 'function') Promise.resolve().then(run);
    else run();
  };

  const renderActiveFilters = () => {
    activeFiltersEl.replaceChildren();
    const formData = new FormData(filterForm);
    const chips = [];

    const addChip = (key, value, visibleLabel, accessibleLabel, onRemove) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'active-filter-tag';
      chip.dataset.key = key;
      chip.dataset.value = value;
      chip.setAttribute('aria-label', accessibleLabel);
      chip.textContent = `${visibleLabel} ×`;
      chip.addEventListener('click', onRemove);
      activeFiltersEl.appendChild(chip);
      chips.push(chip);
      return chip;
    };

    const groups = {
      duration: durationLabels,
      difficulty: difficultyLabels,
      equipment: equipmentLabels,
      zone: zoneLabels,
    };

    ['duration', 'difficulty', 'equipment', 'zone'].forEach((key) => {
      formData.getAll(key).forEach((v) => {
        const text = groups[key][v] || v;
        addChip(key, v, text, `Quitar filtro: ${text}`, () => clearActiveFilter(key, v));
      });
    });

    if (searchInput.value.trim()) {
      const text = searchInput.value.trim();
      addChip('search', '', `Búsqueda: ${text}`, `Quitar búsqueda: ${text}`, () => {
        searchInput.value = '';
        applyFilters();
        focusLater(searchInput);
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
        applyFilters();
        focusLater(searchInput);
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

  const render = (list, options) => {
    currentList = list;
    const animate = !!(options && options.animate);
    exerciseListEl.replaceChildren();
    exerciseListEl.setAttribute('aria-busy', 'false');
    // La animación de entrada solo se aplica en el primer render; el resto de
    // cambios se animan con la transición de vista (clase animar-cambio).
    if (animate) {
      exerciseListEl.classList.add('animar-entrada');
      exerciseListEl.classList.remove('animar-cambio');
    } else {
      exerciseListEl.classList.remove('animar-entrada');
      exerciseListEl.classList.add('animar-cambio');
    }
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
        applyFilters();
        focusLater(searchInput);
      });
      exerciseListEl.appendChild(clearFiltersBtn);
    } else {
      const fragment = document.createDocumentFragment();
      list.forEach((ex) => fragment.appendChild(createCard(ex)));
      exerciseListEl.appendChild(fragment);
    }
    // Actualizar contador con role="status"
    resultCountEl.textContent = `${list.length} ejercicio${list.length !== 1 ? 's' : ''} encontrado${list.length !== 1 ? 's' : ''}`;
    // Primero se refrescan los estados de las opciones (reactiva las que
    // volvieron a tener resultados) y después se leen para pintar chips.
    updateChipCounts();
    renderActiveFilters();
    updateFiltersToggle();
  };

  const prefersReducedMotion = () => !!(window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const supportsViewTransition = () => !!(document.startViewTransition && !prefersReducedMotion());

  // Envuelve el render en una transición de vista; sin soporte (o con reduce)
  // el cambio es instantáneo, como antes.
  const runRender = (list, options) => {
    if (!supportsViewTransition()) {
      render(list, options);
      return;
    }
    const transition = document.startViewTransition(() => render(list, options));
    transition.finished.catch(() => {});
  };

  const applyFilters = (options) => {
    const filtered = applyFiltersTo([]);
    runRender(filtered, options || { animate: false });
    syncUrl();
  };

  const syncUrl = () => {
    const params = new URLSearchParams();
    const formData = new FormData(filterForm);
    // Guardar cada filtro sólo si tiene al menos un valor seleccionado
    ['duration', 'difficulty', 'equipment', 'zone'].forEach((key) => {
      const values = formData.getAll(key);
      if (values.length) params.set(key, values.join(','));
    });
    if (searchInput.value) params.set('search', searchInput.value.trim().slice(0, MAX_SEARCH));
    if (orderSelect.value) params.set('order', orderSelect.value);

    const query = params.toString();
    const newUrl = query ? `${location.pathname}?${query}` : location.pathname;
    history.replaceState(null, '', newUrl);
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
    // Se parte del estado limpio: al recargar con filtros no quedan marcas viejas.
    filterForm.reset();
    searchInput.value = '';
    // Valores válidos de ordenación: se leen de las propias <option>.
    const validOrders = Array.prototype.map.call(orderSelect.options, (option) => option.value);
    orderSelect.value = validOrders[0] || 'name';
    // Restaurar filtros (se ignoran los valores de opciones ocultas)
    ['duration', 'difficulty', 'equipment', 'zone'].forEach((key) => {
      const val = params.get(key);
      if (val) {
        const values = val.split(',');
        values.forEach((v) => {
          const input = filterForm.querySelector(`input[name="${key}"][value="${v}"]`);
          if (input && !input.disabled && !(input.closest('label') && input.closest('label').hidden)) input.checked = true;
        });
      }
    });
    if (params.get('search')) searchInput.value = params.get('search').trim().slice(0, MAX_SEARCH);
    if (params.get('order') && validOrders.includes(params.get('order'))) {
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
    runRender(applyFiltersTo([]), { animate: true });
  };

  // Filtra y ordena la lista indicada (por defecto, todos los ejercicios).
  const applyFiltersTo = (base) => {
    const formData = new FormData(filterForm);
    const searchTerm = normalizeText(searchInput.value.trim());
    const selectedDuration = formData.getAll('duration');
    const selectedDifficulty = formData.getAll('difficulty');
    const selectedEquipment = formData.getAll('equipment');
    const selectedZone = formData.getAll('zone');

    const filtered = (base.length ? base : exercises).filter((ex) => {
      if (selectedDuration.length && !selectedDuration.includes(ex.duration)) return false;
      if (selectedDifficulty.length && !selectedDifficulty.includes(ex.difficulty)) return false;
      if (selectedEquipment.length && !selectedEquipment.some(eq => ex.equipment.includes(eq))) return false;
      if (selectedZone.length && !selectedZone.some(z => ex.zone.includes(z))) return false;
      if (searchTerm && !normalizeText(ex.name).includes(searchTerm) && !normalizeText(ex.description).includes(searchTerm)) return false;
      return true;
    });

    const order = orderSelect.value;
    if (order === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    } else if (order === 'difficulty') {
      filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    } else if (order === 'duration') {
      const durOrder = { corta: 1, media: 2, larga: 3 };
      filtered.sort((a, b) => durOrder[a.duration] - durOrder[b.duration]);
    }
    return filtered;
  };

  const setDialogNavLabels = () => {
    const prev = currentList[currentIndex - 1];
    const next = currentList[currentIndex + 1];
    dialogPrev.textContent = 'Anterior';
    dialogNext.textContent = 'Siguiente';
    if (prev) {
      const label = document.createElement('span');
      label.className = 'sr-only';
      label.textContent = `: ${prev.name}`;
      dialogPrev.appendChild(label);
    }
    if (next) {
      const label = document.createElement('span');
      label.className = 'sr-only';
      label.textContent = `: ${next.name}`;
      dialogNext.appendChild(label);
    }
  };

  // Fundido corto al cambiar de ejercicio dentro del diálogo.
  const animateDialog = (direction) => {
    if (prefersReducedMotion()) return;
    dialogBody.classList.remove('dialog-enter-next', 'dialog-enter-prev');
    void dialogBody.offsetWidth;
    dialogBody.classList.add(direction === 'prev' ? 'dialog-enter-prev' : 'dialog-enter-next');
  };

  const renderDialog = (index, direction) => {
    const ex = currentList[index];
    if (!ex) return;
    currentIndex = index;
    dialogTitle.textContent = ex.name;
    dialogBody.replaceChildren();
    const frag = document.createDocumentFragment();
    if (MOSTRAR_IMAGENES && ex.image) {
      const image = document.createElement('img');
      image.className = 'exercise-image';
      image.src = ex.image;
      image.alt = typeof ex.imageAlt === 'string' ? ex.imageAlt : '';
      image.loading = 'lazy';
      image.addEventListener('error', () => image.remove());
      frag.appendChild(image);
    }
    const pDesc = document.createElement('p');
    pDesc.textContent = ex.description;
    frag.appendChild(pDesc);
    frag.appendChild(createMeta(ex));
    frag.appendChild(createCategoryTag(ex));
    frag.appendChild(createTags(ex));
    if (ex.adaptation && ex.adaptation.notes) {
      const hAdapt = document.createElement('h3');
      hAdapt.textContent = 'Nota general de adaptación';
      frag.appendChild(hAdapt);
      const adapt = document.createElement('p');
      adapt.textContent = ex.adaptation.notes;
      frag.appendChild(adapt);
    }
    dialogBody.appendChild(frag);
    dialogCounter.textContent = `${currentIndex + 1} de ${currentList.length}`;
    dialogReview.textContent = `Estado de revisión: ${ex.clinicalReview}`;
    const psseNote = document.createElement('p');
    psseNote.className = 'dialog-psse';
    psseNote.hidden = ex.category !== 'psse_supervisado';
    psseNote.textContent = 'Este tipo de ejercicio requiere valoración y enseñanza por un fisioterapeuta formado.';
    dialogBody.appendChild(psseNote);
    dialogPrev.disabled = currentIndex <= 0;
    dialogNext.disabled = currentIndex >= currentList.length - 1;
    setDialogNavLabels();
    if (direction) animateDialog(direction);
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
  // Cambios discretos (casillas, orden, limpiezas) y escritura frecuente
  // (buscador, debounce corto): ambos con replaceState.
  filterForm.addEventListener('change', applyFilters);
  searchInput.addEventListener('input', () => {
    // debounce simple: 150 ms
    clearTimeout(searchInput._debounce);
    searchInput._debounce = setTimeout(applyFilters, 150);
  });
  orderSelect.addEventListener('change', applyFilters);
  clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    filterForm.reset();
    searchInput.value = '';
    applyFilters();
    focusLater(searchInput);
  });
  filtersToggle.addEventListener('click', () => {
    const open = filtersPanel.classList.toggle('abierto');
    filtersToggle.setAttribute('aria-expanded', String(open));
  });
  dialogClose.addEventListener('click', closeDialog);
  dialogPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
      renderDialog(currentIndex - 1, 'prev');
      dialogTitle.focus();
    }
  });
  dialogNext.addEventListener('click', () => {
    if (currentIndex >= 0 && currentIndex < currentList.length - 1) {
      renderDialog(currentIndex + 1, 'next');
      dialogTitle.focus();
    }
  });
  // El <dialog> ya cierra con Escape; el foco se restaura en el evento "close"
  // a la tarjeta del ejercicio que se estaba viendo.
  dialog.addEventListener('close', () => {
    const current = currentList[currentIndex];
    let target = null;
    if (current) {
      const buttons = exerciseListEl.querySelectorAll('button[data-id]');
      for (let i = 0; i < buttons.length; i += 1) {
        if (buttons[i].dataset.id === current.id) { target = buttons[i]; break; }
      }
    }
    if (!target) target = lastFocusedButton;
    if (target) target.focus();
  });
  // Cerrar al hacer click fuera del contenido pero dentro del elemento <dialog>
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeDialog();
  });

  // ---------- INICIALIZACIÓN ----------
  document.addEventListener('DOMContentLoaded', loadExercises);
})();
