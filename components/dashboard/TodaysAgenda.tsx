'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarClock, Users2 } from 'lucide-react';

import { useGetCalls } from '@/hooks/useGetCalls';
import { useNow } from '@/hooks/useNow';
import { mergeAgenda } from '@/lib/mock/agenda';
import { formatTimeRange } from '@/lib/format';
import { useToast } from '@/components/ui/use-toast';
import { useMeetingActions } from '@/providers/MeetingActionsProvider';
import { cn } from '@/lib/utils';
import EmptyState from './EmptyState';

const DAY_START_HOUR = 7;
const DAY_END_HOUR = 21;
const HOUR_HEIGHT = 72;
const MIN_BLOCK_HEIGHT = 44;
const BLOCK_GAP = 4;

const TodaysAgenda = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { openSchedule } = useMeetingActions();
  const { upcomingCalls } = useGetCalls();
  const now = useNow(60_000);

  const agenda = useMemo(() => mergeAgenda(upcomingCalls), [upcomingCalls]);
  const todayAgenda = useMemo(
    () =>
      agenda.filter((m) => {
        const d = new Date(m.start);
        const today = new Date();
        return (
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
      }),
    [agenda],
  );

  const nowOffsetPx = useMemo(() => {
    const minutes =
      (now.getHours() - DAY_START_HOUR) * 60 + now.getMinutes();
    if (minutes < 0) return -1;
    if (minutes > (DAY_END_HOUR - DAY_START_HOUR) * 60) return -1;
    return (minutes / 60) * HOUR_HEIGHT;
  }, [now]);

  return (
    <section className="surface-card flex flex-col gap-4 p-5">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">
            Today&apos;s agenda
          </h3>
          <p className="text-xs text-muted-soft">
            {todayAgenda.length} meetings planned · {DAY_START_HOUR}:00 – {DAY_END_HOUR}:00
          </p>
        </div>
        <button
          onClick={() => router.push('/schedule')}
          className="pill transition hover:border-mint-400/30 hover:text-mint-200"
        >
          Full schedule
        </button>
      </header>

      {todayAgenda.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="Nothing on the books"
          description="You have an open day. Plan a meeting whenever you're ready."
          compact
          action={
            <button
              onClick={openSchedule}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-mint-400 px-4 py-2 text-xs font-semibold text-ink-950 transition hover:bg-mint-300"
            >
              Schedule a meeting
            </button>
          }
        />
      ) : (
        <div
          className="relative overflow-hidden rounded-2xl border border-white/5 bg-ink-900/60"
          style={{ height: (DAY_END_HOUR - DAY_START_HOUR) * HOUR_HEIGHT }}
        >
          {/* hour grid */}
          {Array.from({ length: DAY_END_HOUR - DAY_START_HOUR + 1 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 flex items-start gap-2 text-[10px] text-muted"
              style={{ top: i * HOUR_HEIGHT }}
            >
              <span className="w-14 shrink-0 pl-2 pt-1 text-right font-medium tabular-nums">
                {`${DAY_START_HOUR + i}`.padStart(2, '0')}:00
              </span>
              <span className="mt-1.5 h-px flex-1 bg-white/5" />
            </div>
          ))}

          {/* meetings */}
          {todayAgenda.map((m) => {
            const startMin =
              (m.start.getHours() - DAY_START_HOUR) * 60 + m.start.getMinutes();
            if (
              startMin < 0 ||
              startMin > (DAY_END_HOUR - DAY_START_HOUR) * 60
            ) {
              return null;
            }
            const top = (startMin / 60) * HOUR_HEIGHT;
            const height = Math.max(
              (m.durationMin / 60) * HOUR_HEIGHT - BLOCK_GAP,
              MIN_BLOCK_HEIGHT,
            );
            const isReal = m.source === 'real';
            return (
              <button
                key={m.id}
                onClick={() => {
                  if (m.href) router.push(m.href);
                  else
                    toast({
                      title: m.title,
                      description: `Sample agenda item · ${formatTimeRange(
                        m.start,
                        m.durationMin,
                      )}. Real meetings can be joined from this timeline.`,
                    });
                }}
                className={cn(
                  'absolute left-[72px] right-3 flex flex-col gap-1 rounded-xl border px-3 py-2 text-left transition',
                  isReal
                    ? 'border-mint-400/30 bg-mint-400/10 hover:bg-mint-400/15'
                    : 'border-white/5 bg-white/[0.04] hover:bg-white/[0.06]',
                )}
                style={{ top, height }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-white">{m.title}</p>
                  {isReal && (
                    <span className="text-[9px] uppercase tracking-wider text-mint-300">
                      Real
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-soft">
                  <span>{formatTimeRange(m.start, m.durationMin)}</span>
                  <span className="inline-flex items-center gap-1">
                    <Users2 className="h-3 w-3" /> {m.participants}
                  </span>
                </div>
              </button>
            );
          })}

          {/* now line */}
          {nowOffsetPx >= 0 && (
            <div
              className="pointer-events-none absolute left-[64px] right-3 flex items-center gap-2"
              style={{ top: nowOffsetPx }}
            >
              <span className="-ml-1 h-2 w-2 rounded-full bg-coral-500 shadow-[0_0_10px_rgba(255,83,64,0.7)]" />
              <span className="h-px flex-1 bg-coral-500/70" />
              <span className="rounded-full bg-coral-500/15 px-2 py-0.5 text-[10px] font-semibold text-coral-400">
                Now
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default TodaysAgenda;
