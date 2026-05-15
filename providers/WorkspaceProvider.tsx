'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

import { usePersistedString } from '@/hooks/usePersistedString';
import {
  defaultWorkspaceId,
  workspaces,
} from '@/lib/mock/workspaces';
import type { Workspace } from '@/lib/mock/types';

const STORAGE_KEY = 'meetly:workspace';

type WorkspaceContextValue = {
  active: Workspace;
  workspaces: Workspace[];
  setActive: (id: string) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [activeId, setActiveId] = usePersistedString(
    STORAGE_KEY,
    defaultWorkspaceId,
  );

  const setActive = useCallback(
    (id: string) => {
      if (workspaces.some((w) => w.id === id)) setActiveId(id);
    },
    [setActiveId],
  );

  const value = useMemo<WorkspaceContextValue>(() => {
    const active =
      workspaces.find((w) => w.id === activeId) ?? workspaces[0];
    return {
      active,
      workspaces,
      setActive,
    };
  }, [activeId, setActive]);

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used inside WorkspaceProvider');
  return ctx;
};
