import type { Workspace } from './types';

export const workspaces: Workspace[] = [
  { id: 'meetly', name: 'Meetly AI HQ', initial: 'M', accent: 'mint', members: 24 },
  { id: 'apollo', name: 'Apollo Labs', initial: 'A', accent: 'coral', members: 11 },
  { id: 'personal', name: 'Personal', initial: 'P', accent: 'amber', members: 1 },
];

export const defaultWorkspaceId = 'meetly';
