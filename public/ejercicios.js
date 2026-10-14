// ejercicios.js – Lógica de la biblioteca de ejercicios
// © FitCasa – 2026 – Código sin dependencias ni frameworks

(() => {
  // Configuración de mapeo de dificultad para ordenación
  const difficultyOrder = {
    principiante: 1,
    intermedio: 2,
    avanzado: 3,
  };

  const durationLabels = {
    corta: '≤10 min',
    media: '10-20 min',
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

  // Normaliza texto para comparar sin distinción de acentos ni mayúsculas.
  const normalizeText = (value) => String(value).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Referencias a elementos del DOM
  const resultCountEl = document.getElementById('result-count');
  const exerciseListEl = document.getElementById('exercise-list');
  const activeFiltersEl = document.getElementById('active-filters');
  const filterForm = document.getElementById('filter-form');
  const searchInput = document.getElementById('search-input');
  const orderSelect = document.getElementById('order-select');
  const clearBtn = document.getElementById('clear-filters');
  const dialog = document.getElementById('exercise-dialog');
  const dialogTitle = dialog.querySelector('h2');
  const dialogBody = dialog.querySelector('#dialog-content');
  const dialogClose = dialog.querySelector('#close-dialog');

  let exercises = [];
  let lastFocusedButton = null;

  // ---------- UTILIDADES ----------
  const createPlaceholder = () => {
    const placeholder = document.createElement('div');
    placeholder.className = 'exercise-image-placeholder';
    placeholder.textContent = 'Imagen no disponible';
    return placeholder;
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

  const createCard = (exercise) => {
    const card = document.createElement('article');
    card.className = 'exercise-card';
    card.setAttribute('data-reveal', '');

    const title = document.createElement('h3');
    title.textContent = exercise.name;
    card.appendChild(title);

    if (exercise.image) {
      const img = document.createElement('img');
      img.className = 'exercise-image';
      img.src = exercise.image;
      img.alt = '';
      img.loading = 'lazy';
      img.addEventListener('error', () => {
        img.replaceWith(createPlaceholder());
      });
      card.appendChild(img);
    } else {
      card.appendChild(createPlaceholder());
    }

    const desc = document.createElement('p');
    desc.textContent = exercise.description;
    card.appendChild(desc);

    const meta = document.createElement('div');
    meta.className = 'exercise-meta';
    meta.appendChild(createMetaItem('Duración', durationLabels[exercise.duration] || exercise.duration));
    meta.appendChild(createMetaItem('Dificultad', difficultyLabels[exercise.difficulty] || exercise.difficulty));
    card.appendChild(meta);

    const tags = document.createElement('div');
    tags.className = 'exercise-tags';
    if (Array.isArray(exercise.zone)) {
      exercise.zone.forEach(z => {
        tags.appendChild(createTag(zoneLabels[z] || z));
      });
    }
    if (Array.isArray(exercise.equipment)) {
      exercise.equipment.forEach(eq => {
        tags.appendChild(createTag(equipmentLabels[eq] || eq));
      });
    }
    card.appendChild(tags);

    if (exercise.adaptation && exercise.adaptation.notes) {
      const adapt = document.createElement('div');
      adapt.className = 'exercise-adaptation';
      adapt.textContent = `Nota general de adaptación: ${exercise.adaptation.notes}`;
      card.appendChild(adapt);
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Ver instrucciones';
    btn.dataset.id = exercise.id;
    btn.addEventListener('click', openDialog);
    card.appendChild(btn);

    return card;
  };

  const renderActiveFilters = () => {
    activeFiltersEl.replaceChildren();
    const formData = new FormData(filterForm);
    const hasFilters = formData.getAll('duration').length > 0 ||
                      formData.getAll('difficulty').length > 0 ||
                      formData.getAll('equipment').length > 0 ||
                      formData.getAll('zone').length > 0 ||
                      searchInput.value.trim() !== '';

    if (!hasFilters) return;

    const createFilterTag = (label, value, inputName, inputValue) => {
      const tag = document.createElement('span');
      tag.className = 'active-filter-tag';
      tag.textContent = `${label}: ${value} `;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.setAttribute('aria-label', `Eliminar filtro ${label}: ${value}`);
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => {
        const input = filterForm.querySelector(`input[name="${inputName}"][value="${inputValue}"]`);
        if (input) {
          input.checked = false;
          applyFilters();
        }
      });
      tag.appendChild(removeBtn);
      return tag;
    };

    formData.getAll('duration').forEach(v => {
      activeFiltersEl.appendChild(createFilterTag('Duración', durationLabels[v] || v, 'duration', v));
    });
    formData.getAll('difficulty').forEach(v => {
      activeFiltersEl.appendChild(createFilterTag('Dificultad', difficultyLabels[v] || v, 'difficulty', v));
    });
    formData.getAll('equipment').forEach(v => {
      activeFiltersEl.appendChild(createFilterTag('Equipamiento', equipmentLabels[v] || v, 'equipment', v));
    });
    formData.getAll('zone').forEach(v => {
      activeFiltersEl.appendChild(createFilterTag('Zona', zoneLabels[v] || v, 'zone', v));
    });

    if (searchInput.value.trim()) {
      const tag = document.createElement('span');
      tag.className = 'active-filter-tag';
      tag.textContent = `Búsqueda: ${searchInput.value.trim()} `;
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.setAttribute('aria-label', 'Eliminar búsqueda');
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => {
        searchInput.value = '';
        applyFilters();
      });
      tag.appendChild(removeBtn);
      activeFiltersEl.appendChild(tag);
    }
  };

  const render = (list) => {
    exerciseListEl.replaceChildren();
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
        applyFilters();
      });
      exerciseListEl.appendChild(clearFiltersBtn);
    } else {
      const fragment = document.createDocumentFragment();
      list.forEach((ex) => fragment.appendChild(createCard(ex)));
      exerciseListEl.appendChild(fragment);
    }
    if (window.FitCasaMotion) window.FitCasaMotion.observe(exerciseListEl);
    resultCountEl.textContent = `${list.length} ejercicio${list.length !== 1 ? 's' : ''} encontrado${list.length !== 1 ? 's' : ''}`;
    renderActiveFilters();
  };

  const applyFilters = () => {
    const formData = new FormData(filterForm);
    const searchTerm = normalizeText(searchInput.value.trim());
    const selectedDuration = formData.getAll('duration');
    const selectedDifficulty = formData.getAll('difficulty');
    const selectedEquipment = formData.getAll('equipment');
    const selectedZone = formData.getAll('zone');

    let filtered = exercises.filter((ex) => {
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

    render(filtered);
    syncUrl();
  };

  const syncUrl = () => {
    const params = new URLSearchParams();
    const formData = new FormData(filterForm);
    ['duration', 'difficulty', 'equipment', 'zone'].forEach((key) => {
      const values = formData.getAll(key);
      if (values.length) params.set(key, values.join(','));
    });
    if (searchInput.value) params.set('search', searchInput.value.trim());
    if (orderSelect.value) params.set('order', orderSelect.value);

    const query = params.toString();
    const newUrl = query ? `${location.pathname}?${query}` : location.pathname;
    history.replaceState(null, '', newUrl);
  };

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
  };

  const restoreFromUrl = () => {
    const params = new URLSearchParams(location.search);
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
    if (params.get('search')) searchInput.value = params.get('search');
    if (params.get('order')) orderSelect.value = params.get('order');
  };

  const loadExercises = async () => {
    resultCountEl.textContent = 'Cargando ejercicios...';
    exerciseListEl.replaceChildren();
    const loadingMsg = document.createElement('p');
    loadingMsg.textContent = 'Cargando ejercicios...';
    loadingMsg.setAttribute('role', 'status');
    exerciseListEl.appendChild(loadingMsg);

    try {
      const resp = await fetch('ejercicios.json');
      if (!resp.ok) throw new Error('Error al cargar los datos de ejercicios');
      exercises = await resp.json();
    } catch (err) {
      exerciseListEl.replaceChildren();
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

  const openDialog = (e) => {
    const id = e.currentTarget.dataset.id;
    const ex = exercises.find((item) => item.id === id);
    if (!ex) return;
    lastFocusedButton = e.currentTarget;
    dialogTitle.textContent = ex.name;
    dialogBody.replaceChildren();
    const frag = document.createDocumentFragment();

    if (ex.image) {
      const img = document.createElement('img');
      img.className = 'exercise-image';
      img.src = ex.image;
      img.alt = '';
      img.loading = 'lazy';
      img.addEventListener('error', () => {
        img.replaceWith(createPlaceholder());
      });
      frag.appendChild(img);
    } else {
      frag.appendChild(createPlaceholder());
    }

    const pDesc = document.createElement('p');
    pDesc.textContent = ex.description;
    frag.appendChild(pDesc);

    const meta = document.createElement('div');
    meta.className = 'exercise-meta';
    meta.appendChild(createMetaItem('Duración', durationLabels[ex.duration] || ex.duration));
    meta.appendChild(createMetaItem('Dificultad', difficultyLabels[ex.difficulty] || ex.difficulty));
    frag.appendChild(meta);

    const tags = document.createElement('div');
    tags.className = 'exercise-tags';
    if (Array.isArray(ex.zone)) {
      ex.zone.forEach(z => {
        tags.appendChild(createTag(zoneLabels[z] || z));
      });
    }
    if (Array.isArray(ex.equipment)) {
      ex.equipment.forEach(eq => {
        tags.appendChild(createTag(equipmentLabels[eq] || eq));
      });
    }
    frag.appendChild(tags);

    if (ex.adaptation && ex.adaptation.notes) {
      const adapt = document.createElement('div');
      adapt.className = 'exercise-adaptation';
      adapt.textContent = `Nota general de adaptación: ${ex.adaptation.notes}`;
      frag.appendChild(adapt);
    }

    const review = document.createElement('p');
    review.textContent = `Estado de revisión: ${ex.clinicalReview}`;
    frag.appendChild(review);

    dialogBody.appendChild(frag);
    dialog.showModal();
    dialog.focus();
  };

  const closeDialog = () => {
    dialog.close();
  };

  // ---------- EVENTOS ----------
  filterForm.addEventListener('change', applyFilters);
  searchInput.addEventListener('input', () => {
    clearTimeout(searchInput._debounce);
    searchInput._debounce = setTimeout(applyFilters, 300);
  });
  orderSelect.addEventListener('change', applyFilters);
  clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    filterForm.reset();
    applyFilters();
  });
  dialogClose.addEventListener('click', closeDialog);
  dialog.addEventListener('close', () => {
    if (lastFocusedButton) lastFocusedButton.focus();
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeDialog();
  });

  // ---------- INICIALIZACIÓN ----------
  document.addEventListener('DOMContentLoaded', loadExercises);
})();
