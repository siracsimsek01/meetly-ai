'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Calendar } from '@/components/ui/calendar';
import { useGetCalls } from '@/hooks/useGetCalls';
import { mergeAgenda } from '@/lib/mock/agenda';
import { formatDayKey } from '@/lib/format';

const MiniCalendar = () => {
  const router = useRouter();
  const { upcomingCalls } = useGetCalls();
  const [month, setMonth] = useState<Date>(new Date());
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  const meetingDates = useMemo(() => {
    const agenda = mergeAgenda(upcomingCalls);
    return agenda.map((m) => m.start);
  }, [upcomingCalls]);

  return (
    <section className="surface-card flex flex-col gap-2 p-4">
      <header className="flex items-center justify-between px-2">
        <h3 className="font-display text-sm font-semibold text-white">
          Calendar
        </h3>
        <button
          onClick={() => router.push('/schedule')}
          className="text-[11px] font-medium text-mint-300 hover:text-mint-200"
        >
          Open full view →
        </button>
      </header>
      <Calendar
        mode="single"
        selected={selected}
        onSelect={(date) => {
          if (!date) return;
          setSelected(date);
          router.push(`/schedule?d=${formatDayKey(date)}`);
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
    </section>
  );
};

export default MiniCalendar;
