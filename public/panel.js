/* Panel local de seguimiento: datos subjetivos, sin recomendaciones clínicas. */
(function () {
  'use strict';

  var PANEL_VERSION = 1;
  var MAX_RECORDS = 1000;
  var form = document.getElementById('panel-form');
  var dateInput = document.getElementById('entry-date');
  var activityInput = document.getElementById('entry-activity');
  var painInput = document.getElementById('entry-pain');
  var noteInput = document.getElementById('entry-note');
  var saveButton = document.getElementById('save-entry');
  var cancelButton = document.getElementById('cancel-edit');
  var panelError = document.getElementById('panel-error');
  var historyBody = document.getElementById('history-body');
  var historyTable = document.getElementById('history-table-container');
  var emptyHistory = document.getElementById('empty-history');
  var storageNotice = document.getElementById('storage-notice');
  var safetyReminder = document.getElementById('safety-reminder');
  var activityOptions = document.getElementById('activity-options');
  var clearDataButton = document.getElementById('clear-data');
  var clearStatus = document.getElementById('clear-status');
  var records = [];
  var editingId = null;

  function localDateString(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  function isValidDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    var date = new Date(value + 'T00:00:00');
    return !Number.isNaN(date.getTime()) && localDateString(date) === value;
  }

  function normalizeRecord(item) {
    if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !isValidDate(item.date)) return null;
    var pain = Number(item.pain);
    if (!Number.isInteger(pain) || pain < 0 || pain > 10) return null;
    var activity = typeof item.activity === 'string' ? item.activity.trim().slice(0, 120) : '';
    var note = typeof item.note === 'string' ? item.note.trim().slice(0, 500) : '';
    return { id: item.id.slice(0, 80), date: item.date, activity: activity, pain: pain, note: note };
  }

  function normalizeRecords(data) {
    if (!Array.isArray(data)) return [];
    return data.map(normalizeRecord).filter(Boolean).slice(0, MAX_RECORDS);
  }

  function clearErrors() {
    Array.prototype.slice.call(document.querySelectorAll('.field-error')).forEach(function (error) {
      error.textContent = '';
      error.hidden = true;
    });
    Array.prototype.slice.call(form.querySelectorAll('[aria-invalid="true"]')).forEach(function (field) {
      field.removeAttribute('aria-invalid');
    });
    panelError.textContent = '';
    panelError.hidden = true;
  }

  function showError(name, message) {
    var error = document.getElementById('error-' + name);
    var input = document.getElementById('entry-' + name);
    if (error) {
      error.textContent = message;
      error.hidden = false;
    }
    if (input) input.setAttribute('aria-invalid', 'true');
  }

  function readForm() {
    clearErrors();
    var valid = true;
    var date = dateInput.value;
    var activity = activityInput.value.trim();
    var pain = Number(painInput.value);
    var note = noteInput.value.trim();
    if (!isValidDate(date) || date > localDateString(new Date())) {
      valid = false;
      showError('date', 'Selecciona una fecha válida que no sea futura.');
    }
    if (activity.length > 120) {
      valid = false;
      showError('activity', 'La actividad debe tener 120 caracteres o menos.');
    }
    if (!Number.isInteger(pain) || pain < 0 || pain > 10) {
      valid = false;
      showError('pain', 'Indica un número entero entre 0 y 10.');
    }
    if (note.length > 500) {
      valid = false;
      showError('note', 'La nota debe tener 500 caracteres o menos.');
    }
    if (!valid) {
      panelError.textContent = 'Revisa los campos señalados antes de guardar.';
      panelError.hidden = false;
      return null;
    }
    return { date: date, activity: activity, pain: pain, note: note };
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return 'record-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
  }

  function saveRecords() {
    var result = window.FitCasaStorage.write(window.FitCasaStorage.KEYS.panel, PANEL_VERSION, records);
    if (!result.saved) {
      storageNotice.textContent = 'La persistencia no está disponible. El panel seguirá funcionando durante esta sesión, pero no conservará los cambios al recargar.';
      storageNotice.classList.add('warning');
      storageNotice.hidden = false;
    }
  }

  function formatDate(value) {
    var parts = value.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  function sortRecords(list) {
    return list.slice().sort(function (a, b) {
      return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
    });
  }

  function actionButton(label, className, id, handler) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = className || '';
    button.textContent = label;
    button.dataset.id = id;
    button.addEventListener('click', handler);
    return button;
  }

  function render() {
    historyBody.replaceChildren();
    var sorted = sortRecords(records);
    emptyHistory.hidden = sorted.length !== 0;
    historyTable.hidden = sorted.length === 0;
    updateSafetyReminder();
    sorted.forEach(function (record) {
      var row = document.createElement('tr');
      var date = document.createElement('td');
      date.textContent = formatDate(record.date);
      row.appendChild(date);
      var activity = document.createElement('td');
      activity.textContent = record.activity || 'No indicada';
      row.appendChild(activity);
      var pain = document.createElement('td');
      pain.textContent = String(record.pain) + ' de 10';
      row.appendChild(pain);
      var note = document.createElement('td');
      note.textContent = record.note || 'Sin nota';
      row.appendChild(note);
      var actions = document.createElement('td');
      actions.className = 'record-actions';
      actions.appendChild(actionButton('Editar', 'secondary', record.id, startEdit));
      actions.appendChild(actionButton('Eliminar', 'danger', record.id, deleteRecord));
      row.appendChild(actions);
      historyBody.appendChild(row);
    });
  }

  function resetForm() {
    form.reset();
    dateInput.value = localDateString(new Date());
    editingId = null;
    saveButton.textContent = 'Guardar entrada';
    cancelButton.hidden = true;
    clearErrors();
  }

  function startEdit(event) {
    var record = records.find(function (item) { return item.id === event.currentTarget.dataset.id; });
    if (!record) return;
    editingId = record.id;
    dateInput.value = record.date;
    activityInput.value = record.activity;
    painInput.value = String(record.pain);
    noteInput.value = record.note;
    saveButton.textContent = 'Guardar cambios';
    cancelButton.hidden = false;
    document.getElementById('entry-heading').focus();
  }

  function deleteRecord(event) {
    var id = event.currentTarget.dataset.id;
    if (!window.confirm('¿Eliminar esta entrada del historial?')) return;
    records = records.filter(function (record) { return record.id !== id; });
    saveRecords();
    render();
    if (editingId === id) resetForm();
  }

  function clearSavedData() {
    if (!window.confirm('¿Borrar las respuestas y todos los registros guardados en este navegador?')) return;
    var result = window.FitCasaStorage.removeAll();
    records = [];
    resetForm();
    render();
    clearStatus.textContent = result.removed ? 'Se borraron las respuestas y los registros guardados.' : 'No fue posible borrar los datos guardados.';
    updateSafetyReminder();
  }

  function loadRecords() {
    var stored = window.FitCasaStorage.read(window.FitCasaStorage.KEYS.panel, PANEL_VERSION, normalizeRecords);
    if (!stored.available) {
      storageNotice.textContent = 'La persistencia no está disponible en este navegador. Puedes usar el panel durante esta sesión.';
      storageNotice.classList.add('warning');
      storageNotice.hidden = false;
    } else if (stored.reason === 'corrupt' || stored.reason === 'unknown-version') {
      storageNotice.textContent = 'No se pudo recuperar el historial guardado. Puedes continuar y guardarlo de nuevo.';
      storageNotice.classList.add('warning');
      storageNotice.hidden = false;
    }
    records = stored.value || [];
    render();
  }

  function init() {
    dateInput.max = localDateString(new Date());
    resetForm();
    loadRecords();
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = readForm();
      if (!data) return;
      if (editingId) {
        records = records.map(function (record) {
          return record.id === editingId ? { id: editingId, date: data.date, activity: data.activity, pain: data.pain, note: data.note } : record;
        });
      } else {
        records.push({ id: createId(), date: data.date, activity: data.activity, pain: data.pain, note: data.note });
      }
      records = normalizeRecords(records);
      saveRecords();
      render();
      resetForm();
      document.getElementById('history-heading').focus();
    });
    cancelButton.addEventListener('click', resetForm);
    clearDataButton.addEventListener('click', clearSavedData);
    loadActivityOptions();
  }

  /* Sugerencias de actividad desde la biblioteca, para vincular el registro
     con el ejercicio realizado. Si la biblioteca no carga, el campo sigue
     aceptando texto libre. */
  function loadActivityOptions() {
    if (!activityOptions || !window.fetch) return;
    fetch('ejercicios.json').then(function (response) {
      if (!response.ok) throw new Error('sin biblioteca');
      return response.json();
    }).then(function (data) {
      if (!Array.isArray(data)) return;
      var names = data
        .filter(function (item) { return item && typeof item.name === 'string'; })
        .map(function (item) { return item.name; });
      names.forEach(function (name) {
        var option = document.createElement('option');
        option.value = name;
        activityOptions.appendChild(option);
      });
    }).catch(function () {
      /* Sin biblioteca el campo sigue siendo de texto libre. */
    });
  }

  /* Recordatorio de seguridad: se enfatiza (sin animación) cuando el registro
     muestra dolor alto o un aumento respecto al anterior. */
  function updateSafetyReminder() {
    if (!safetyReminder) return;
    var sorted = sortRecords(records);
    if (!sorted.length) {
      safetyReminder.classList.remove('destacado');
      return;
    }
    var latest = sorted[0];
    var previous = sorted[1];
    var emphasis = latest.pain >= 7 || (previous && latest.pain > previous.pain);
    safetyReminder.classList.toggle('destacado', !!emphasis);
  }

  init();
}());
