'use client';

import { useContext } from 'react';

import { CommandPaletteContext } from '@/providers/CommandPaletteProvider';

export const useCommandPalette = () => {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error(
      'useCommandPalette must be used inside CommandPaletteProvider',
    );
  }
  return ctx;
};
