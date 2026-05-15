import type { ActivityEvent } from './types';

const minutesAgo = (m: number) => new Date(Date.now() - m * 60 * 1000);

export const activityEvents: ActivityEvent[] = [
  { id: 'a1', type: 'summary', actor: 'Meetly AI', target: 'Q2 strategy sync', occurredAt: minutesAgo(4) },
  { id: 'a2', type: 'joined', actor: 'Sara Lin', target: 'Design review', occurredAt: minutesAgo(8) },
  { id: 'a3', type: 'recording', actor: 'Apollo standup', target: 'is ready to replay', occurredAt: minutesAgo(22) },
  { id: 'a4', type: 'mention', actor: 'Marcus Hale', target: 'mentioned you in #engineering', occurredAt: minutesAgo(38) },
  { id: 'a5', type: 'scheduled', actor: 'Ava Park', target: 'a meeting for Friday', occurredAt: minutesAgo(63) },
  { id: 'a6', type: 'note', actor: 'You', target: 'pinned the QBR room', occurredAt: minutesAgo(95) },
  { id: 'a7', type: 'left', actor: 'Jonas Reed', target: 'Pre-launch sync', occurredAt: minutesAgo(130) },
  { id: 'a8', type: 'summary', actor: 'Meetly AI', target: '1:1 with Mei', occurredAt: minutesAgo(190) },
  { id: 'a9', type: 'joined', actor: 'Theo Bennet', target: 'All hands', occurredAt: minutesAgo(240) },
  { id: 'a10', type: 'recording', actor: 'Onboarding session', target: 'is ready to replay', occurredAt: minutesAgo(360) },
];
