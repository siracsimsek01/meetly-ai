'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import MeetingActionsDialogs from '@/components/MeetingActionsDialogs';

export type MeetingActionState =
  | 'isInstantMeeting'
  | 'isJoiningMeeting'
  | 'isScheduleMeeting'
  | undefined;

type MeetingActionsContextValue = {
  state: MeetingActionState;
  openNew: () => void;
  openJoin: () => void;
  openSchedule: () => void;
  close: () => void;
};

const MeetingActionsContext = createContext<MeetingActionsContextValue | null>(
  null,
);

export const MeetingActionsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<MeetingActionState>(undefined);

  const value = useMemo<MeetingActionsContextValue>(
    () => ({
      state,
      openNew: () => setState('isInstantMeeting'),
      openJoin: () => setState('isJoiningMeeting'),
      openSchedule: () => setState('isScheduleMeeting'),
      close: () => setState(undefined),
    }),
    [state],
  );

  return (
    <MeetingActionsContext.Provider value={value}>
      {children}
      <MeetingActionsDialogs />
    </MeetingActionsContext.Provider>
  );
};

export const useMeetingActions = () => {
  const ctx = useContext(MeetingActionsContext);
  if (!ctx) {
    throw new Error(
      'useMeetingActions must be used inside MeetingActionsProvider',
    );
  }
  return ctx;
};
