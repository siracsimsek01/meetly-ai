'use client';

import { usePersistedBoolean } from './usePersistedString';

const STORAGE_KEY = 'meetly:sidebar:collapsed';

export const useSidebarCollapse = () => {
  const [collapsed, , toggle] = usePersistedBoolean(STORAGE_KEY, false);
  return { collapsed, toggle, mounted: true };
};
