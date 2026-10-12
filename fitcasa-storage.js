/* Persistencia local versionada y tolerante a fallos para FitCasa. */
(function (global) {
  'use strict';

  var KEYS = {
    quiz: 'fitcasa.quiz.v1',
    panel: 'fitcasa.panel.v1'
  };

  function getStorage() {
    try {
      return global.localStorage;
    } catch (error) {
      return null;
    }
  }

  function read(key, version, normalize) {
    var storage = getStorage();
    if (!storage) return { available: false, value: null, reason: 'unavailable' };

    try {
      var raw = storage.getItem(key);
      if (!raw) return { available: true, value: null, reason: 'missing' };
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== version) {
        return { available: true, value: null, reason: 'unknown-version' };
      }
      return { available: true, value: normalize(parsed.data), reason: 'ok' };
    } catch (error) {
      return { available: true, value: null, reason: 'corrupt' };
    }
  }

  function write(key, version, data) {
    var storage = getStorage();
    if (!storage) return { available: false, saved: false };
    try {
      storage.setItem(key, JSON.stringify({ version: version, data: data }));
      return { available: true, saved: true };
    } catch (error) {
      return { available: true, saved: false };
    }
  }

  function removeAll() {
    var storage = getStorage();
    if (!storage) return { available: false, removed: false };
    try {
      storage.removeItem(KEYS.quiz);
      storage.removeItem(KEYS.panel);
      return { available: true, removed: true };
    } catch (error) {
      return { available: true, removed: false };
    }
  }

  global.FitCasaStorage = {
    KEYS: KEYS,
    read: read,
    write: write,
    removeAll: removeAll
  };
}(window));
