import { StorageResult } from '../types';

export const STORAGE_KEYS = {
  quiz: 'fitcasa.quiz.v1',
  panel: 'fitcasa.panel.v1',
  /**
   * Registro de decisiones sobre los documentos legales. Clave propia y
   * versionada: el esquema cambió en v2 para poder guardar una decisión por
   * documento, con su versión de contenido y su fecha.
   */
  consent: 'fitcasa.consent.v2',
  /** Clave del esquema anterior, solo se limpia para no dejar restos. */
  consentLegacy: 'fitcasa.consent.v1',
} as const;

export const QUIZ_STORAGE_VERSION = 1;
export const PANEL_STORAGE_VERSION = 1;
export const CONSENT_STORAGE_VERSION = 2;

function getStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStorage<T>(
  key: string,
  version: number,
  normalize: (data: unknown) => T | null
): StorageResult<T> {
  const storage = getStorage();
  if (!storage) return { available: false, value: null, reason: 'unavailable' };

  try {
    const raw = storage.getItem(key);
    if (!raw) return { available: true, value: null, reason: 'missing' };
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== version) {
      return { available: true, value: null, reason: 'unknown-version' };
    }
    const normalized = normalize(parsed.data);
    return { available: true, value: normalized, reason: normalized !== null ? 'ok' : 'corrupt' };
  } catch {
    return { available: true, value: null, reason: 'corrupt' };
  }
}

export function writeStorage<T>(
  key: string,
  version: number,
  data: T
): { available: boolean; saved: boolean } {
  const storage = getStorage();
  if (!storage) return { available: false, saved: false };
  try {
    storage.setItem(key, JSON.stringify({ version, data }));
    return { available: true, saved: true };
  } catch {
    return { available: true, saved: false };
  }
}

export function removeAllStorage(): { available: boolean; removed: boolean } {
  const storage = getStorage();
  if (!storage) return { available: false, removed: false };
  try {
    storage.removeItem(STORAGE_KEYS.quiz);
    storage.removeItem(STORAGE_KEYS.panel);
    storage.removeItem(STORAGE_KEYS.consent);
    storage.removeItem(STORAGE_KEYS.consentLegacy);
    return { available: true, removed: true };
  } catch {
    return { available: true, removed: false };
  }
}

/**
 * Borra solo el registro de decisiones legales, sin tocar el historial del
 * panel ni las respuestas del cuestionario. Rechazar una nueva versión no debe
 * borrar datos: solo dejar de conceder acceso a las funciones protegidas.
 */
export function removeConsentStorage(): { available: boolean; removed: boolean } {
  const storage = getStorage();
  if (!storage) return { available: false, removed: false };
  try {
    storage.removeItem(STORAGE_KEYS.consent);
    storage.removeItem(STORAGE_KEYS.consentLegacy);
    return { available: true, removed: true };
  } catch {
    return { available: true, removed: false };
  }
}
