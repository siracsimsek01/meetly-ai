'use client';

import { useUser } from '@clerk/nextjs';
import { ArrowUpRight, CalendarClock, Radio, Users2 } from 'lucide-react';

import { useNow } from '@/hooks/useNow';
import { formatClock, formatRelative } from '@/lib/format';
import type { AgendaItem } from '@/lib/mock/types';

interface HeroPanelProps {
  nextMeeting?: AgendaItem;
  totalToday?: number;
  teammatesOnline?: number;
}

const greeting = (d: Date) => {
  const h = d.getHours();
  if (h < 5) return 'evening';
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
};

const HeroPanel = ({
  nextMeeting,
  totalToday = 0,
  teammatesOnline = 0,
}: HeroPanelProps) => {
  const { user } = useUser();
  const now = useNow(30_000);

  const firstName = user?.firstName || user?.username || 'there';
  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(now);

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/5">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-mint-400/20 via-ink-900 to-coral-500/10" />
      <div className="absolute -right-32 -top-32 -z-10 h-[480px] w-[480px] rounded-full bg-mint-400/15 blur-[120px]" />
      <div className="absolute -bottom-40 -left-20 -z-10 h-[420px] w-[420px] rounded-full bg-coral-500/10 blur-[140px]" />
      <div className="absolute inset-0 -z-10 bg-noise opacity-30 mix-blend-overlay" />

      <div className="relative grid gap-8 p-8 md:grid-cols-[1.4fr_1fr] md:gap-12 md:p-12">
        <div className="flex flex-col justify-between gap-10">
          <div className="space-y-4">
            <span className="pill pill-active w-fit">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-mint-400" />
              {nextMeeting
                ? `Next up · ${nextMeeting.title}`
                : `${totalToday} meetings today`}
            </span>
            <h1 className="font-display text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Good {greeting(now)}, {firstName}.
            </h1>
            <p className="max-w-xl text-base text-muted-soft md:text-lg">
              Your room is calm and ready. Jump into something instant, join a
              link, or peek at what&apos;s on the calendar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="pill">
              <CalendarClock className="h-3.5 w-3.5" /> {date}
            </span>
            <span className="pill">
              <Radio className="h-3.5 w-3.5 text-mint-300" />
              {totalToday} meetings · today
            </span>
            <span className="pill">
              <Users2 className="h-3.5 w-3.5" /> {teammatesOnline} teammates online
            </span>
          </div>
        </div>

        <div className="relative flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/5 bg-white/[0.03] p-7 backdrop-blur-xl md:items-end md:p-8">
          <div className="flex w-full items-center justify-between md:flex-col md:items-end md:gap-2">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Now</p>
            <p className="font-display text-6xl font-bold tabular-nums leading-none text-white md:text-7xl">
              {formatClock(now)}
            </p>
          </div>
          <div className="w-full space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Next on calendar
            </p>
            {nextMeeting ? (
              <a
                href={nextMeeting.href ?? '/upcoming'}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-ink-900/60 p-4 transition hover:border-mint-400/30"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    {nextMeeting.title}
                  </p>
                  <p className="text-xs text-muted-soft">
                    {nextMeeting.participants} invited ·{' '}
                    {formatRelative(nextMeeting.start)}
                  </p>
                </div>
                <span className="icon-btn icon-btn-mint">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            ) : (
              <div className="rounded-2xl border border-white/5 bg-ink-900/60 p-4 text-sm text-muted-soft">
                You have nothing scheduled. Plan something below.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPanel;
