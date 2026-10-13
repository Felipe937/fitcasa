// ejercicios.js – Lógica de la biblioteca de ejercicios
// © FitCasa – 2026 – Código sin dependencias ni frameworks

(() => {
  // Configuración de mapeo de dificultad para ordenación
  const difficultyOrder = {
    principiante: 1,
    intermedio: 2,
    avanzado: 3,
  };

  // Normaliza texto para comparar sin distinción de acentos ni mayúsculas.
  const normalizeText = (value) => String(value).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Referencias a elementos del DOM
  const resultCountEl = document.getElementById('result-count');
  const exerciseListEl = document.getElementById('exercise-list');
  const filterForm = document.getElementById('filter-form');
  const searchInput = document.getElementById('search-input');
  const orderSelect = document.getElementById('order-select');
  const clearBtn = document.getElementById('clear-filters');
  const dialog = document.getElementById('exercise-dialog');
  const dialogTitle = dialog.querySelector('h2');
  const dialogBody = dialog.querySelector('#dialog-content');
  const dialogClose = dialog.querySelector('#close-dialog');

  let exercises = [];
  let lastFocusedButton = null; // para restaurar foco al cerrar el diálogo

  // ---------- UTILIDADES ----------
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
      // Decorativa salvo que el JSON aporte imageAlt; no se inventan descripciones.
      img.alt = typeof exercise.imageAlt === 'string' ? exercise.imageAlt : '';
      img.loading = 'lazy';
      // La carpeta assets/ no existe: si la imagen falla se retira del DOM.
      img.addEventListener('error', () => img.remove());
      card.appendChild(img);
    }

    const desc = document.createElement('p');
    desc.textContent = exercise.description;
    card.appendChild(desc);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Ver detalle';
    btn.dataset.id = exercise.id;
    btn.addEventListener('click', openDialog);
    card.appendChild(btn);

    return card;
  };

  const render = (list) => {
    // Vaciar contenedor
    exerciseListEl.replaceChildren();
    if (list.length === 0) {
      const noResult = document.createElement('p');
      noResult.textContent = 'No se encontraron resultados.';
      noResult.setAttribute('role', 'status');
      exerciseListEl.appendChild(noResult);
    } else {
      const fragment = document.createDocumentFragment();
      list.forEach((ex) => fragment.appendChild(createCard(ex)));
      exerciseListEl.appendChild(fragment);
    }
    if (window.FitCasaMotion) window.FitCasaMotion.observe(exerciseListEl);
    // Actualizar contador con aria‑live
    resultCountEl.textContent = `${list.length} ejercicio${list.length !== 1 ? 's' : ''} encontrado${list.length !== 1 ? 's' : ''}`;
  };

  const applyFilters = () => {
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
    if (searchInput.value) params.set('search', searchInput.value.trim());
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
  };

  const restoreFromUrl = () => {
    const params = new URLSearchParams(location.search);
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
    if (params.get('search')) searchInput.value = params.get('search');
    if (params.get('order')) orderSelect.value = params.get('order');
  };

  const openDialog = (e) => {
    const id = e.currentTarget.dataset.id;
    const ex = exercises.find((item) => item.id === id);
    if (!ex) return;
    // Guardar foco
    lastFocusedButton = e.currentTarget;
    // Rellenar contenido del diálogo
    dialogTitle.textContent = ex.name;
    dialogBody.replaceChildren();
    const frag = document.createDocumentFragment();
    if (ex.image) {
      const img = document.createElement('img');
      img.className = 'exercise-image';
      img.src = ex.image;
      img.alt = typeof ex.imageAlt === 'string' ? ex.imageAlt : '';
      img.loading = 'lazy';
      img.addEventListener('error', () => img.remove());
      frag.appendChild(img);
    }
    const pDesc = document.createElement('p');
    pDesc.textContent = ex.description;
    frag.appendChild(pDesc);
    if (ex.adaptation && ex.adaptation.notes) {
      const adapt = document.createElement('p');
      adapt.textContent = `Nota general de adaptación: ${ex.adaptation.notes}`;
      frag.appendChild(adapt);
    }
    const review = document.createElement('p');
    review.textContent = `Estado de revisión: ${ex.clinicalReview}`;
    frag.appendChild(review);
    dialogBody.appendChild(frag);
    dialog.showModal();
    // Enfocar el diálogo
    dialog.focus();
  };

  const closeDialog = () => {
    dialog.close();
  };

  // ---------- EVENTOS ----------
  filterForm.addEventListener('change', applyFilters);
  searchInput.addEventListener('input', () => {
    // debounce simple: 300 ms
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
  // El <dialog> ya cierra con Escape; el foco se restaura en el evento "close".
  dialog.addEventListener('close', () => {
    if (lastFocusedButton) lastFocusedButton.focus();
  });
  // Cerrar al hacer click fuera del contenido pero dentro del elemento <dialog>
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeDialog();
  });

  // ---------- INICIALIZACIÓN ----------
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const resp = await fetch('ejercicios.json');
      if (!resp.ok) throw new Error('Error al cargar datos');
      exercises = await resp.json();
    } catch (err) {
      exerciseListEl.replaceChildren();
      const errorMessage = document.createElement('p');
      errorMessage.setAttribute('role', 'alert');
      errorMessage.textContent = err.message;
      exerciseListEl.appendChild(errorMessage);
      return;
    }
    pruneDeadOptions();
    restoreFromUrl();
    applyFilters();
  });
})();
