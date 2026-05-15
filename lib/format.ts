import {
  format,
  formatDistanceToNowStrict,
  isSameDay as dfnsIsSameDay,
} from 'date-fns';
import type { Call } from '@stream-io/video-react-sdk';

export const formatRelative = (d: Date): string =>
  formatDistanceToNowStrict(d, { addSuffix: true });

export const formatTimeRange = (start: Date, durationMin: number): string => {
  const end = new Date(start.getTime() + durationMin * 60 * 1000);
  return `${format(start, 'HH:mm')} – ${format(end, 'HH:mm')}`;
};

export const formatDayKey = (d: Date): string => format(d, 'yyyy-MM-dd');

export const isSameDay = dfnsIsSameDay;

export const meetingDatesFrom = (
  calls: Call[] | undefined,
): Date[] => {
  if (!calls) return [];
  return calls
    .map((c) => (c.state.startsAt ? new Date(c.state.startsAt) : null))
    .filter((d): d is Date => d !== null);
};

export const formatClock = (d: Date): string =>
  d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
