import { StorageResult } from '../types';

export const STORAGE_KEYS = {
  quiz: 'fitcasa.quiz.v1',
  panel: 'fitcasa.panel.v1',
};

export const QUIZ_STORAGE_VERSION = 1;
export const PANEL_STORAGE_VERSION = 1;

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
    return { available: true, removed: true };
  } catch {
    return { available: true, removed: false };
  }
}
