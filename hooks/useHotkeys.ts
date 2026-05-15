'use client';

import { useEffect } from 'react';

export type Hotkey = {
  combo: string;
  handler: (e: KeyboardEvent) => void;
  allowInInputs?: boolean;
};

const isEditable = (el: EventTarget | null): boolean => {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    el.isContentEditable
  );
};

const matches = (combo: string, e: KeyboardEvent): boolean => {
  const parts = combo.toLowerCase().split('+').map((p) => p.trim());
  const wantMeta = parts.includes('mod') || parts.includes('cmd') || parts.includes('ctrl');
  const wantShift = parts.includes('shift');
  const wantAlt = parts.includes('alt');
  const key = parts[parts.length - 1];

  const metaOk = wantMeta ? e.metaKey || e.ctrlKey : !e.metaKey && !e.ctrlKey;
  const shiftOk = wantShift ? e.shiftKey : !e.shiftKey;
  const altOk = wantAlt ? e.altKey : !e.altKey;
  const keyOk = e.key.toLowerCase() === key;

  return metaOk && shiftOk && altOk && keyOk;
};

export const useHotkeys = (hotkeys: Hotkey[]): void => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      for (const hk of hotkeys) {
        if (!hk.allowInInputs && isEditable(e.target)) continue;
        if (matches(hk.combo, e)) {
          e.preventDefault();
          hk.handler(e);
          return;
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hotkeys]);
};
