'use client';

import { useCallback, useSyncExternalStore } from 'react';

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const onStorage = () => callback();
  window.addEventListener('storage', onStorage);
  return () => window.removeEventListener('storage', onStorage);
};

const readKey = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const getServerSnapshot = (): string | null => null;

/**
 * Reads/writes a string value to localStorage with proper SSR + hydration
 * safety. Uses useSyncExternalStore so React knows the store is external.
 */
export const usePersistedString = (
  key: string,
  fallback: string,
): readonly [string, (value: string) => void] => {
  const getSnapshot = useCallback(() => readKey(key), [key]);

  const value =
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) ??
    fallback;

  const set = useCallback(
    (next: string) => {
      try {
        window.localStorage.setItem(key, next);
        window.dispatchEvent(new StorageEvent('storage', { key }));
      } catch {
        // ignore
      }
    },
    [key],
  );

  return [value, set] as const;
};

export const usePersistedBoolean = (
  key: string,
  fallback = false,
): readonly [boolean, (v: boolean) => void, () => void] => {
  const [raw, set] = usePersistedString(key, fallback ? '1' : '0');
  const value = raw === '1';

  const setBool = useCallback((v: boolean) => set(v ? '1' : '0'), [set]);
  const toggle = useCallback(() => set(value ? '0' : '1'), [set, value]);

  return [value, setBool, toggle] as const;
};
