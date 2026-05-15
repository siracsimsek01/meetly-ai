'use client';

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

import CommandPalette from '@/components/CommandPalette';
import { useHotkeys } from '@/hooks/useHotkeys';
import { useMeetingActions } from './MeetingActionsProvider';

type CommandPaletteContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
};

export const CommandPaletteContext =
  createContext<CommandPaletteContextValue | null>(null);

export const CommandPaletteProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const actions = useMeetingActions();

  const toggle = useCallback(() => setOpen((v) => !v), []);

  useHotkeys(
    useMemo(
      () => [
        { combo: 'mod+k', handler: () => toggle(), allowInInputs: true },
        {
          combo: 'n',
          handler: () => {
            setOpen(false);
            actions.openNew();
          },
        },
        {
          combo: 'j',
          handler: () => {
            setOpen(false);
            actions.openJoin();
          },
        },
        {
          combo: 'r',
          handler: () => {
            setOpen(false);
            router.push('/recordings');
          },
        },
        {
          combo: 's',
          handler: () => {
            setOpen(false);
            router.push('/schedule');
          },
        },
      ],
      [toggle, router, actions],
    ),
  );

  const value = useMemo<CommandPaletteContextValue>(
    () => ({ open, setOpen, toggle }),
    [open, toggle],
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <CommandPalette open={open} onOpenChange={setOpen} />
    </CommandPaletteContext.Provider>
  );
};
