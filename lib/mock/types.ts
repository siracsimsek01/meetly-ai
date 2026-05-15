import type { LucideIcon } from 'lucide-react';

export type Workspace = {
  id: string;
  name: string;
  initial: string;
  accent: 'mint' | 'coral' | 'amber';
  members: number;
};

export type PresenceStatus = 'online' | 'busy' | 'idle' | 'offline';

export type TeammatePresence = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: PresenceStatus;
};

export type ActivityEventType =
  | 'joined'
  | 'left'
  | 'summary'
  | 'recording'
  | 'scheduled'
  | 'mention'
  | 'note';

export type ActivityEvent = {
  id: string;
  type: ActivityEventType;
  actor: string;
  target: string;
  occurredAt: Date;
};

export type AgendaItem = {
  id: string;
  title: string;
  start: Date;
  durationMin: number;
  participants: number;
  source: 'real' | 'mock';
  href?: string;
};

export type KpiSnapshot = {
  meetingsThisWeek: number;
  avgDurationMin: number;
  minutesSaved: number;
  recordings: number;
};

export type PinnedRoom = {
  id: string;
  name: string;
  href: string;
  color: 'mint' | 'coral' | 'amber';
};

export type AiPrompt = {
  id: string;
  label: string;
  icon: LucideIcon;
};
