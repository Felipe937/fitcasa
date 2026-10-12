/* Motor determinista y accesible de sugerencias de FitCasa. */
(function () {
  'use strict';

  var QUIZ_VERSION = 1;
  var TOTAL_STEPS = 3;
  var currentStep = 1;
  var exercises = [];

  var form = document.getElementById('quiz-form');
  var steps = Array.prototype.slice.call(document.querySelectorAll('[data-step]'));
  var nextButton = document.getElementById('quiz-next');
  var backButton = document.getElementById('quiz-back');
  var submitButton = document.getElementById('quiz-submit');
  var quizError = document.getElementById('quiz-error');
  var progressText = document.getElementById('quiz-progress-text');
  var progressBar = document.querySelector('[role="progressbar"]');
  var progressValue = document.getElementById('quiz-progress-value');
  var answerSummary = document.getElementById('answer-summary');
  var resultsSection = document.getElementById('quiz-results');
  var resultsContent = document.getElementById('results-content');
  var storageNotice = document.getElementById('storage-notice');
  var clearDataButton = document.getElementById('clear-data');
  var clearStatus = document.getElementById('clear-status');

  var allowed = {
    objective: ['movilidad', 'fuerza', 'bienestar'],
    days: ['1', '2', '3', '4', '5', '6', '7'],
    time: ['10', '20', '30'],
    level: ['principiante', 'intermedio', 'avanzado'],
    equipment: ['ninguno', 'bandas', 'peso', 'colchoneta'],
    safety: ['si', 'no']
  };

  var objectiveZones = {
    movilidad: ['torax', 'hombros', 'cadera', 'lumbar', 'piernas'],
    fuerza: ['piernas', 'glúteos', 'core', 'lumbar', 'hombros'],
    bienestar: null
  };

  function isAllowed(value, list) {
    return typeof value === 'string' && list.indexOf(value) !== -1;
  }

  function normalizeExercise(item) {
    if (!item || typeof item !== 'object') return null;
    if (typeof item.id !== 'string' || typeof item.name !== 'string' || typeof item.description !== 'string') return null;
    if (!['corta', 'media', 'larga'].includes(item.duration)) return null;
    if (!['principiante', 'intermedio', 'avanzado'].includes(item.difficulty)) return null;
    if (!Array.isArray(item.equipment) || !Array.isArray(item.zone)) return null;
    var equipment = item.equipment.filter(function (value) { return typeof value === 'string'; });
    var zone = item.zone.filter(function (value) { return typeof value === 'string'; });
    if (!equipment.length || !zone.length) return null;
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      duration: item.duration,
      difficulty: item.difficulty,
      equipment: equipment,
      zone: zone,
      adaptation: item.adaptation && typeof item.adaptation.notes === 'string' ? item.adaptation.notes : ''
    };
  }

  function normalizeAnswers(data) {
    if (!data || typeof data !== 'object') return null;
    var equipment = Array.isArray(data.equipment) ? data.equipment.filter(function (value) {
      return isAllowed(value, allowed.equipment);
    }) : [];
    var answers = {
      objective: data.objective,
      days: data.days,
      time: data.time,
      level: data.level,
      equipment: Array.from(new Set(equipment)),
      surgeryNoAuthorization: data.surgeryNoAuthorization,
      clinicalRestriction: data.clinicalRestriction,
      concerningSymptoms: data.concerningSymptoms
    };
    if (!isAllowed(answers.objective, allowed.objective) || !isAllowed(answers.days, allowed.days) || !isAllowed(answers.time, allowed.time) || !isAllowed(answers.level, allowed.level)) return null;
    if (!answers.equipment.length || !isAllowed(answers.surgeryNoAuthorization, allowed.safety) || !isAllowed(answers.clinicalRestriction, allowed.safety) || !isAllowed(answers.concerningSymptoms, allowed.safety)) return null;
    return answers;
  }

  function getAnswers() {
    var data = new FormData(form);
    return normalizeAnswers({
      objective: data.get('objective'),
      days: data.get('days'),
      time: data.get('time'),
      level: data.get('level'),
      equipment: data.getAll('equipment'),
      surgeryNoAuthorization: data.get('surgeryNoAuthorization'),
      clinicalRestriction: data.get('clinicalRestriction'),
      concerningSymptoms: data.get('concerningSymptoms')
    });
  }

  function safetyBlock(answers) {
    var reasons = [];
    if (answers.surgeryNoAuthorization === 'si') reasons.push('una cirugía de columna sin autorización para retomar la actividad');
    if (answers.clinicalRestriction === 'si') reasons.push('una restricción de ejercicio indicada por un profesional sanitario');
    if (answers.concerningSymptoms === 'si') reasons.push('síntomas preocupantes como dolor nuevo, intenso o creciente, debilidad o entumecimiento');
    return reasons;
  }

  function durationOptions(time) {
    if (time === '10') return ['corta'];
    if (time === '20') return ['corta', 'media'];
    return ['corta', 'media', 'larga'];
  }

  function levelOrder(level) {
    return { principiante: 1, intermedio: 2, avanzado: 3 }[level] || 0;
  }

  /* Función pura: no lee el DOM, no escribe almacenamiento y no usa aleatoriedad. */
  function generateSuggestions(answers, availableExercises) {
    var safeAnswers = normalizeAnswers(answers);
    if (!safeAnswers) return { blocked: true, reason: 'Las respuestas no están completas o no son válidas.', days: [] };

    var blockedReasons = safetyBlock(safeAnswers);
    if (blockedReasons.length) {
      return { blocked: true, reasons: blockedReasons, days: [] };
    }

    var zones = objectiveZones[safeAnswers.objective];
    var durations = durationOptions(safeAnswers.time);
    var maxLevel = levelOrder(safeAnswers.level);
    var equipment = safeAnswers.equipment.indexOf('ninguno') !== -1 ? ['ninguno'] : safeAnswers.equipment;
    var validExercises = Array.isArray(availableExercises) ? availableExercises.map(normalizeExercise).filter(Boolean) : [];
    var compatible = validExercises.filter(function (exercise) {
      var objectiveMatches = !zones || exercise.zone.some(function (zone) { return zones.indexOf(zone) !== -1; });
      var equipmentMatches = exercise.equipment.every(function (item) { return equipment.indexOf(item) !== -1; });
      return objectiveMatches && durations.indexOf(exercise.duration) !== -1 && levelOrder(exercise.difficulty) <= maxLevel && equipmentMatches;
    });

    var days = Number(safeAnswers.days);
    if (compatible.length < days) {
      return { blocked: false, insufficient: true, available: compatible.length, requested: days, days: [] };
    }

    return {
      blocked: false,
      insufficient: false,
      available: compatible.length,
      requested: days,
      days: compatible.slice(0, days).map(function (exercise, index) {
        return { number: index + 1, exercise: exercise };
      })
    };
  }

  function setStatus(element, message, type) {
    element.textContent = message;
    element.classList.toggle('warning', type === 'warning');
    element.classList.toggle('danger', type === 'danger');
    element.hidden = !message;
  }

  function clearErrors() {
    Array.prototype.slice.call(document.querySelectorAll('.field-error')).forEach(function (error) {
      error.textContent = '';
      error.hidden = true;
    });
    Array.prototype.slice.call(form.querySelectorAll('[aria-invalid="true"]')).forEach(function (field) {
      field.removeAttribute('aria-invalid');
    });
    setStatus(quizError, '', '');
  }

  function showFieldError(name, message) {
    var error = document.getElementById('error-' + name);
    if (error) {
      error.textContent = message;
      error.hidden = false;
    }
    Array.prototype.slice.call(form.querySelectorAll('[name="' + name + '"]')).forEach(function (field) {
      field.setAttribute('aria-invalid', 'true');
    });
  }

  function validateStep(step) {
    clearErrors();
    var valid = true;
    if (step === 1) {
      ['objective', 'days', 'time', 'level'].forEach(function (name) {
        var value = form.querySelector('[name="' + name + '"]:checked');
        if (!value) {
          valid = false;
          showFieldError(name, 'Selecciona una opción para continuar.');
        }
      });
      if (!form.querySelectorAll('[name="equipment"]:checked').length) {
        valid = false;
        showFieldError('equipment', 'Selecciona al menos una opción.');
      }
    }
    if (step === 2) {
      ['surgeryNoAuthorization', 'clinicalRestriction', 'concerningSymptoms'].forEach(function (name) {
        if (!form.querySelector('[name="' + name + '"]:checked')) {
          valid = false;
          showFieldError(name, 'Selecciona Sí o No para continuar.');
        }
      });
    }
    if (!valid) setStatus(quizError, 'Revisa los campos señalados antes de continuar.', 'warning');
    return valid;
  }

  function labelFor(name, value) {
    var input = form.querySelector('[name="' + name + '"][value="' + value + '"]');
    if (!input || !input.parentElement) return value;
    return input.parentElement.textContent.trim();
  }

  function renderAnswerSummary(answers) {
    answerSummary.replaceChildren();
    var title = document.createElement('h3');
    title.textContent = 'Tus respuestas';
    answerSummary.appendChild(title);
    var list = document.createElement('ul');
    var entries = [
      ['Objetivo', labelFor('objective', answers.objective)],
      ['Días por semana', labelFor('days', answers.days)],
      ['Tiempo por sesión', labelFor('time', answers.time)],
      ['Nivel', labelFor('level', answers.level)],
      ['Equipamiento', answers.equipment.map(function (value) { return labelFor('equipment', value); }).join(', ')],
      ['Cirugía sin autorización', labelFor('surgeryNoAuthorization', answers.surgeryNoAuthorization)],
      ['Restricción clínica', labelFor('clinicalRestriction', answers.clinicalRestriction)],
      ['Síntomas preocupantes', labelFor('concerningSymptoms', answers.concerningSymptoms)]
    ];
    entries.forEach(function (entry) {
      var item = document.createElement('li');
      item.textContent = entry[0] + ': ' + entry[1];
      list.appendChild(item);
    });
    answerSummary.appendChild(list);
  }

  function renderResults(result) {
    resultsContent.replaceChildren();
    if (result.blocked) {
      var block = document.createElement('div');
      block.className = 'notice danger';
      var heading = document.createElement('h3');
      heading.textContent = 'No se generó una propuesta automática';
      block.appendChild(heading);
      var text = document.createElement('p');
      text.textContent = result.reasons ? 'La generación está bloqueada por: ' + result.reasons.join('; ') + '.' : result.reason;
      block.appendChild(text);
      var recommendation = document.createElement('p');
      recommendation.textContent = 'Consulta con tu equipo sanitario antes de retomar o elegir actividad. Ante síntomas repentinos o graves, busca atención urgente.';
      block.appendChild(recommendation);
      resultsContent.appendChild(block);
    } else if (result.insufficient) {
      var insufficient = document.createElement('div');
      insufficient.className = 'notice warning';
      insufficient.textContent = 'No hay suficientes ejercicios compatibles para organizar ' + result.requested + ' días con estas respuestas. No se muestra una propuesta incompleta. Puedes volver atrás y ajustar solo las preferencias de actividad, sin cambiar respuestas de seguridad para evitar un bloqueo.';
      resultsContent.appendChild(insufficient);
    } else {
      var intro = document.createElement('p');
      intro.textContent = 'Esta propuesta usa ' + result.available + ' opciones compatibles de la biblioteca y no repite ejercicios dentro de ella.';
      resultsContent.appendChild(intro);
      var grid = document.createElement('div');
      grid.className = 'plan-grid';
      result.days.forEach(function (day) {
        var card = document.createElement('article');
        card.className = 'plan-day';
        var title = document.createElement('h3');
        title.textContent = 'Día ' + day.number;
        card.appendChild(title);
        var name = document.createElement('p');
        name.textContent = day.exercise.name;
        card.appendChild(name);
        var description = document.createElement('p');
        description.textContent = day.exercise.description;
        card.appendChild(description);
        var meta = document.createElement('p');
        meta.className = 'small-print';
        meta.textContent = 'Duración: ' + day.exercise.duration + '. Nivel de la biblioteca: ' + day.exercise.difficulty + '.';
        card.appendChild(meta);
        grid.appendChild(card);
      });
      resultsContent.appendChild(grid);
      var safety = document.createElement('p');
      safety.className = 'notice warning';
      safety.textContent = 'Detén la actividad si aparece dolor intenso, debilidad, entumecimiento u otros síntomas inusuales y consulta con un profesional. La etiqueta de la biblioteca no sustituye una valoración individual.';
      resultsContent.appendChild(safety);
    }
    resultsSection.hidden = false;
    document.getElementById('results-heading').focus();
  }

  function updateStep() {
    steps.forEach(function (step) { step.hidden = Number(step.dataset.step) !== currentStep; });
    var title = currentStep === 1 ? 'actividad' : currentStep === 2 ? 'preguntas de seguridad' : 'revisar y generar';
    progressText.textContent = 'Paso ' + currentStep + ' de ' + TOTAL_STEPS + ': ' + title + '.';
    progressBar.setAttribute('aria-valuenow', String(currentStep));
    progressValue.style.width = (currentStep / TOTAL_STEPS * 100) + '%';
    backButton.hidden = currentStep === 1;
    nextButton.hidden = currentStep === TOTAL_STEPS;
    submitButton.hidden = currentStep !== TOTAL_STEPS;
  }

  function animateStep(stepPanel) {
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !window.requestAnimationFrame || !stepPanel) return;
    stepPanel.classList.remove('step-enter', 'step-enter-active');
    stepPanel.classList.add('step-enter');
    window.requestAnimationFrame(function () {
      stepPanel.classList.add('step-enter-active');
    });
    window.setTimeout(function () {
      stepPanel.classList.remove('step-enter', 'step-enter-active');
    }, 280);
  }

  function goToStep(step) {
    currentStep = step;
    updateStep();
    animateStep(steps.filter(function (stepPanel) { return Number(stepPanel.dataset.step) === step; })[0]);
    var heading = document.getElementById('step-' + (step === 1 ? 'one' : step === 2 ? 'two' : 'three') + '-heading');
    if (heading) heading.focus();
  }

  function restoreAnswers() {
    var stored = window.FitCasaStorage.read(window.FitCasaStorage.KEYS.quiz, QUIZ_VERSION, normalizeAnswers);
    if (!stored.available) {
      setStatus(storageNotice, 'La persistencia no está disponible en este navegador. Puedes usar el cuestionario durante esta sesión.', 'warning');
      return;
    }
    if (stored.reason === 'corrupt' || stored.reason === 'unknown-version') {
      setStatus(storageNotice, 'No se pudieron recuperar las respuestas guardadas. Puedes continuar y guardarlas de nuevo.', 'warning');
    }
    if (!stored.value) return;
    Object.keys(stored.value).forEach(function (name) {
      var values = Array.isArray(stored.value[name]) ? stored.value[name] : [stored.value[name]];
      values.forEach(function (value) {
        var input = form.querySelector('[name="' + name + '"][value="' + value + '"]');
        if (input) input.checked = true;
      });
    });
  }

  function saveAnswers(answers) {
    var result = window.FitCasaStorage.write(window.FitCasaStorage.KEYS.quiz, QUIZ_VERSION, answers);
    if (!result.saved) setStatus(storageNotice, 'La persistencia no está disponible. Las respuestas solo se conservarán durante esta sesión.', 'warning');
  }

  function clearSavedData() {
    if (!window.confirm('¿Borrar las respuestas y todos los registros guardados en este navegador?')) return;
    var result = window.FitCasaStorage.removeAll();
    clearStatus.textContent = result.removed ? 'Se borraron las respuestas y los registros guardados.' : 'No fue posible borrar los datos guardados.';
  }

  function loadExercises() {
    return fetch('ejercicios.json').then(function (response) {
      if (!response.ok) throw new Error('No se pudo cargar la biblioteca de ejercicios.');
      return response.json();
    }).then(function (data) {
      exercises = Array.isArray(data) ? data : [];
      if (!exercises.length) throw new Error('La biblioteca de ejercicios no contiene opciones válidas.');
    });
  }

  function init() {
    restoreAnswers();
    updateStep();
    nextButton.addEventListener('click', function () {
      if (!validateStep(currentStep)) return;
      if (currentStep === 1) goToStep(2);
      else if (currentStep === 2) goToStep(3);
      var answers = getAnswers();
      if (answers) renderAnswerSummary(answers);
    });
    backButton.addEventListener('click', function () {
      if (currentStep > 1) goToStep(currentStep - 1);
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!validateStep(2) || !validateStep(1)) return;
      var answers = getAnswers();
      if (!answers) {
        setStatus(quizError, 'No se pudieron validar las respuestas.', 'warning');
        return;
      }
      saveAnswers(answers);
      renderResults(generateSuggestions(answers, exercises));
    });
    clearDataButton.addEventListener('click', clearSavedData);
    loadExercises().catch(function (error) {
      setStatus(quizError, error.message, 'danger');
      nextButton.disabled = true;
      submitButton.disabled = true;
    });
  }

  window.FitCasaQuiz = { generateSuggestions: generateSuggestions, normalizeExercise: normalizeExercise };
  init();
}());
