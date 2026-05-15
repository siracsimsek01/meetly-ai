import type { Call } from '@stream-io/video-react-sdk';
import type { AgendaItem } from './types';

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const at = (hour: number, minute = 0): Date => {
  const d = startOfToday();
  d.setHours(hour, minute, 0, 0);
  return d;
};

export const mockAgenda: AgendaItem[] = [
  { id: 'm1', title: 'Daily standup', start: at(9, 0), durationMin: 30, participants: 7, source: 'mock' },
  { id: 'm2', title: 'Design review', start: at(11, 30), durationMin: 45, participants: 5, source: 'mock' },
  { id: 'm3', title: '1:1 with Mei', start: at(14, 0), durationMin: 30, participants: 2, source: 'mock' },
  { id: 'm4', title: 'Pre-launch sync', start: at(16, 30), durationMin: 60, participants: 9, source: 'mock' },
];

export const mergeAgenda = (
  upcoming: Call[] | undefined,
): AgendaItem[] => {
  const real: AgendaItem[] = (upcoming ?? [])
    .map((c): AgendaItem | null => {
      const start = c.state.startsAt ? new Date(c.state.startsAt) : null;
      if (!start) return null;
      return {
        id: c.id,
        title:
          (c.state.custom?.description as string | undefined) ?? 'Untitled meeting',
        start,
        durationMin: 30,
        participants: c.state.members?.length ?? 1,
        source: 'real',
        href: `/meeting/${c.id}`,
      };
    })
    .filter((item): item is AgendaItem => item !== null);

  const seen = new Set(real.map((r) => r.start.getTime()));
  const combined = [
    ...real,
    ...mockAgenda.filter((m) => !seen.has(m.start.getTime())),
  ];
  return combined.sort((a, b) => a.start.getTime() - b.start.getTime());
};
