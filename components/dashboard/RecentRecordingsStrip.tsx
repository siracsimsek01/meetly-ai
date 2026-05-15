'use client';

import Link from 'next/link';
import { PlaySquare } from 'lucide-react';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useCallRecordings } from '@/hooks/useCallRecordings';
import EmptyState from './EmptyState';
import { StripSkeleton } from './DashboardSkeleton';

const formatDuration = (start?: string, end?: string): string => {
  if (!start || !end) return '—';
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const min = Math.max(1, Math.round(ms / 60_000));
  return `${min}m`;
};

const RecentRecordingsStrip = () => {
  const { recordings, isLoading } = useCallRecordings();

  return (
    <section className="surface-card flex flex-col gap-4 p-5">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">
            Recent recordings
          </h3>
          <p className="text-xs text-muted-soft">
            Replay or share your latest sessions.
          </p>
        </div>
        <Link
          href="/recordings"
          className="pill transition hover:border-mint-400/30 hover:text-mint-200"
        >
          See all
        </Link>
      </header>

      {isLoading ? (
        <StripSkeleton />
      ) : recordings.length === 0 ? (
        <EmptyState
          icon={PlaySquare}
          title="No recordings yet"
          description="When you record a meeting, the replay shows up here."
          compact
        />
      ) : (
        <ScrollArea className="-mx-1">
          <div className="flex gap-3 px-1 pb-3">
            {recordings.slice(0, 8).map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="group flex w-64 shrink-0 flex-col gap-2 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-mint-400/30"
              >
                <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-mint-400/15 via-ink-800 to-coral-500/10">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition group-hover:scale-110">
                    <PlaySquare className="h-5 w-5" />
                  </span>
                  <span className="absolute bottom-2 right-2 rounded-full bg-ink-950/80 px-2 py-0.5 text-[10px] text-white">
                    {formatDuration(r.start_time, r.end_time)}
                  </span>
                </div>
                <p className="line-clamp-1 text-sm font-medium text-white">
                  {r.filename?.substring(0, 36) || 'Recording'}
                </p>
                <p className="text-[11px] text-muted-soft">
                  {r.start_time
                    ? new Date(r.start_time).toLocaleString()
                    : 'Unknown date'}
                </p>
              </a>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </section>
  );
};

export default RecentRecordingsStrip;
