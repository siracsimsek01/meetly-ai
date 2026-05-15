import { avatarImages } from '@/constants';
import type { TeammatePresence } from './types';

export const team: TeammatePresence[] = [
  { id: 't1', name: 'Sara Lin', role: 'Design lead', avatar: avatarImages[0], status: 'online' },
  { id: 't2', name: 'Marcus Hale', role: 'Engineering', avatar: avatarImages[1], status: 'busy' },
  { id: 't3', name: 'Ava Park', role: 'Product', avatar: avatarImages[2], status: 'online' },
  { id: 't4', name: 'Jonas Reed', role: 'Engineering', avatar: avatarImages[3], status: 'idle' },
  { id: 't5', name: 'Mei Tanaka', role: 'Operations', avatar: avatarImages[4], status: 'online' },
  { id: 't6', name: 'Diego Costa', role: 'Research', avatar: avatarImages[0], status: 'offline' },
  { id: 't7', name: 'Priya Ahuja', role: 'Marketing', avatar: avatarImages[1], status: 'idle' },
  { id: 't8', name: 'Theo Bennet', role: 'Engineering', avatar: avatarImages[2], status: 'online' },
  { id: 't9', name: 'Noa Klein', role: 'Design', avatar: avatarImages[3], status: 'busy' },
  { id: 't10', name: 'Yuki Sato', role: 'Engineering', avatar: avatarImages[4], status: 'online' },
];
