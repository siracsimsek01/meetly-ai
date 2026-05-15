'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';

import { usePersistedBoolean } from '@/hooks/usePersistedString';

const STORAGE_KEY = 'meetly:focus';

type FocusContextValue = {
  focus: boolean;
  setFocus: (v: boolean) => void;
  toggle: () => void;
};

const FocusModeContext = createContext<FocusContextValue | null>(null);

export const FocusModeProvider = ({ children }: { children: ReactNode }) => {
  const [focus, setFocus, toggle] = usePersistedBoolean(STORAGE_KEY, false);

  useEffect(() => {
    document.body.dataset.focus = focus ? 'on' : 'off';
  }, [focus]);

  const value = useMemo<FocusContextValue>(
    () => ({ focus, setFocus, toggle }),
    [focus, setFocus, toggle],
  );

  return (
    <FocusModeContext.Provider value={value}>
      {children}
    </FocusModeContext.Provider>
  );
};

export const useFocusMode = () => {
  const ctx = useContext(FocusModeContext);
  if (!ctx) throw new Error('useFocusMode must be used inside FocusModeProvider');
  return ctx;
};
