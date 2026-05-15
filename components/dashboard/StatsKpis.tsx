'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck,
  Clock,
  PlaySquare,
  Timer,
  type LucideIcon,
} from 'lucide-react';

import { useGetCalls } from '@/hooks/useGetCalls';
import { useCallRecordings } from '@/hooks/useCallRecordings';
import { mergeKpis } from '@/lib/mock/kpis';
import { cn } from '@/lib/utils';

type KpiCard = {
  label: string;
  value: string;
  delta: { dir: 'up' | 'down'; pct: number };
  icon: LucideIcon;
  tone: 'mint' | 'coral' | 'amber' | 'ink';
  href: string;
};

const tones: Record<KpiCard['tone'], string> = {
  mint: 'bg-mint-400/15 text-mint-300',
  coral: 'bg-coral-500/15 text-coral-400',
  amber: 'bg-amber-400/15 text-amber-400',
  ink: 'bg-white/[0.06] text-muted-soft',
};

const isThisWeek = (d: Date) => {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  return d >= monday;
};

const StatsKpis = () => {
  const { upcomingCalls, endedCalls } = useGetCalls();
  const { recordings } = useCallRecordings();

  const stats = useMemo(() => {
    const realCount =
      (upcomingCalls?.filter((c) => c.state.startsAt && isThisWeek(new Date(c.state.startsAt))).length ?? 0) +
      (endedCalls?.filter((c) => c.state.startsAt && isThisWeek(new Date(c.state.startsAt))).length ?? 0);

    return mergeKpis({
      meetingsThisWeek: realCount || undefined,
      recordings: recordings.length || undefined,
    });
  }, [upcomingCalls, endedCalls, recordings]);

  const cards: KpiCard[] = [
    {
      label: 'Meetings this week',
      value: String(stats.meetingsThisWeek),
      delta: { dir: 'up', pct: 12 },
      icon: CalendarCheck,
      tone: 'mint',
      href: '/upcoming',
    },
    {
      label: 'Avg duration',
      value: `${stats.avgDurationMin}m`,
      delta: { dir: 'down', pct: 8 },
      icon: Clock,
      tone: 'ink',
      href: '/previous',
    },
    {
      label: 'Minutes saved',
      value: `${stats.minutesSaved}`,
      delta: { dir: 'up', pct: 22 },
      icon: Timer,
      tone: 'amber',
      href: '/schedule',
    },
    {
      label: 'Recordings',
      value: String(stats.recordings),
      delta: { dir: 'up', pct: 5 },
      icon: PlaySquare,
      tone: 'coral',
      href: '/recordings',
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map((c) => (
        <Link
          key={c.label}
          href={c.href}
          className="surface-card group relative flex flex-col gap-3 overflow-hidden p-4 transition hover:border-mint-400/30 hover:bg-white/[0.04]"
        >
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-xl transition group-hover:scale-105',
                tones[c.tone],
              )}
            >
              <c.icon className="h-4 w-4" />
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                c.delta.dir === 'up'
                  ? 'bg-mint-400/15 text-mint-300'
                  : 'bg-coral-500/15 text-coral-400',
              )}
            >
              {c.delta.dir === 'up' ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {c.delta.pct}%
            </span>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-white tabular-nums">
              {c.value}
            </p>
            <p className="text-xs text-muted-soft">{c.label}</p>
          </div>
        </Link>
      ))}
    </section>
  );
};

export default StatsKpis;
