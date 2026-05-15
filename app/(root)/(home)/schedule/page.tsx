'use client';

import { useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users2,
  Video,
} from 'lucide-react';
import { format, parse } from 'date-fns';

import PageHeader from '@/components/PageHeader';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/dashboard/EmptyState';
import { CalendarSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { useGetCalls } from '@/hooks/useGetCalls';
import { mergeAgenda } from '@/lib/mock/agenda';
import { formatDayKey, formatTimeRange, isSameDay } from '@/lib/format';
import { useMeetingActions } from '@/providers/MeetingActionsProvider';
import { cn } from '@/lib/utils';
import type { AgendaItem } from '@/lib/mock/types';

const parseDayParam = (raw: string | null): Date => {
  if (!raw) return new Date();
  try {
    return parse(raw, 'yyyy-MM-dd', new Date());
  } catch {
    return new Date();
  }
};

const SchedulePageInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { upcomingCalls, isLoading } = useGetCalls();
  const { openSchedule } = useMeetingActions();
  const initial = parseDayParam(searchParams.get('d'));
  const [selected, setSelected] = useState<Date>(initial);
  const [month, setMonth] = useState<Date>(initial);

  const agenda = useMemo(() => mergeAgenda(upcomingCalls), [upcomingCalls]);
  const meetingDates = useMemo(() => agenda.map((m) => m.start), [agenda]);

  const dayMeetings: AgendaItem[] = useMemo(
    () => agenda.filter((m) => isSameDay(m.start, selected)),
    [agenda, selected],
  );

  const goDay = (delta: number) => {
    const d = new Date(selected);
    d.setDate(d.getDate() + delta);
    setSelected(d);
    setMonth(d);
    router.replace(`/schedule?d=${formatDayKey(d)}`);
  };

  return (
    <section className="flex flex-col gap-8 pt-2 text-white">
      <PageHeader
        icon={CalendarRange}
        eyebrow="Calendar"
        title="Schedule"
        description="A month-at-a-glance view of everything on your plate. Pick a day to drill in."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
        <div className="surface-panel flex flex-col gap-2 p-4">
          {isLoading ? (
            <CalendarSkeleton />
          ) : (
            <Calendar
              mode="single"
              selected={selected}
              onSelect={(date) => {
                if (!date) return;
                setSelected(date);
                router.replace(`/schedule?d=${formatDayKey(date)}`);
              }}
              month={month}
              onMonthChange={setMonth}
              modifiers={{ hasMeeting: meetingDates }}
              modifiersClassNames={{
                hasMeeting:
                  "[&_button]:relative [&_button]:after:content-[''] [&_button]:after:absolute [&_button]:after:bottom-1.5 [&_button]:after:left-1/2 [&_button]:after:-translate-x-1/2 [&_button]:after:h-1 [&_button]:after:w-1 [&_button]:after:rounded-full [&_button]:after:bg-mint-400",
              }}
              className="text-white"
            />
          )}
        </div>

        <div className="surface-panel flex flex-col gap-5 p-6">
          <header className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => goDay(-1)}
                className="icon-btn"
                aria-label="Previous day"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => goDay(1)}
                className="icon-btn"
                aria-label="Next day"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  {format(selected, 'EEEE')}
                </h2>
                <p className="text-sm text-muted-soft">
                  {format(selected, 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            <Button
              onClick={openSchedule}
              className="rounded-full"
              size="sm"
            >
              <Sparkles className="h-4 w-4" /> Schedule
            </Button>
          </header>

          {dayMeetings.length === 0 ? (
            <EmptyState
              icon={CalendarRange}
              title="No meetings on this day"
              description="Pick another day or schedule something new."
              action={
                <Button
                  onClick={openSchedule}
                  className="mt-2 rounded-full"
                  size="sm"
                >
                  Schedule a meeting
                </Button>
              }
            />
          ) : (
            <ol className="flex flex-col gap-3">
              {dayMeetings.map((m) => (
                <li
                  key={m.id}
                  className={cn(
                    'flex items-start gap-4 rounded-2xl border p-4 transition',
                    m.source === 'real'
                      ? 'border-mint-400/30 bg-mint-400/10 hover:border-mint-400/50'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/10',
                  )}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-mint-300">
                    <Video className="h-5 w-5" />
                  </span>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="font-display text-base font-semibold text-white">
                      {m.title}
                    </p>
                    <p className="text-xs text-muted-soft">
                      {formatTimeRange(m.start, m.durationMin)} ·{' '}
                      <span className="inline-flex items-center gap-1">
                        <Users2 className="h-3 w-3" /> {m.participants}
                      </span>
                    </p>
                  </div>
                  {m.href && (
                    <Button
                      onClick={() => router.push(m.href!)}
                      className="h-9 rounded-full"
                      size="sm"
                    >
                      Open
                    </Button>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
};

const SchedulePage = () => (
  <Suspense fallback={<CalendarSkeleton />}>
    <SchedulePageInner />
  </Suspense>
);

export default SchedulePage;
