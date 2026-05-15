'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('mx-auto w-fit p-3 text-white', className)}
      classNames={{
        months: 'flex flex-col gap-4',
        month: 'space-y-3',
        month_caption:
          'relative flex h-9 items-center justify-center px-1 pb-2 pt-1',
        caption_label:
          'font-display text-sm font-semibold tracking-tight text-white',
        nav: 'absolute right-1 top-1 flex items-center gap-1',
        button_previous:
          'inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] text-muted-soft transition hover:bg-white/[0.07] hover:text-white',
        button_next:
          'inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] text-muted-soft transition hover:bg-white/[0.07] hover:text-white',
        month_grid: 'border-collapse',
        weekdays: 'flex',
        weekday:
          'flex h-8 w-10 items-center justify-center text-[10px] font-medium uppercase tracking-[0.18em] text-muted',
        week: 'flex',
        day: 'group relative h-10 w-10 p-0 text-center',
        day_button: cn(
          'mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-white/80 transition',
          'hover:bg-white/[0.06] hover:text-white',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-400/40',
        ),
        selected: '',
        today: '',
        outside: 'text-muted/40 [&_button]:text-muted/40',
        disabled: '[&_button]:opacity-30',
        hidden: 'invisible',
        ...classNames,
      }}
      modifiersClassNames={{
        today:
          '[&_button]:ring-1 [&_button]:ring-inset [&_button]:ring-mint-400/50 [&_button]:text-mint-200',
        selected:
          '[&_button]:bg-mint-400 [&_button]:text-ink-950 [&_button]:font-semibold [&_button]:hover:bg-mint-300 [&_button]:ring-0',
        ...(props.modifiersClassNames ?? {}),
      }}
      components={{
        Chevron: ({ orientation, ...rest }) => {
          if (orientation === 'left')
            return <ChevronLeft className="h-4 w-4" {...rest} />;
          return <ChevronRight className="h-4 w-4" {...rest} />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
