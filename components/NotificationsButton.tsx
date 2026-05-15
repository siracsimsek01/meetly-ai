'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, BellOff, Check } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { activityEvents } from '@/lib/mock/activity';
import { formatRelative } from '@/lib/format';
import { cn } from '@/lib/utils';

const NotificationsButton = () => {
  const router = useRouter();
  const initial = activityEvents.slice(0, 5).map((e) => e.id);
  const [unread, setUnread] = useState(new Set(initial));

  const items = activityEvents.slice(0, 5);
  const markAll = () => setUnread(new Set());
  const markOne = (id: string) => {
    setUnread((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
  };

  const count = unread.size;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="icon-btn relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-mint-400 px-1 text-[9px] font-bold text-ink-950 ring-2 ring-ink-950">
              {count}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <header className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <div>
            <p className="font-display text-sm font-semibold text-white">
              Notifications
            </p>
            <p className="text-[11px] text-muted">
              {count > 0 ? `${count} unread` : 'You’re all caught up'}
            </p>
          </div>
          {count > 0 && (
            <button
              onClick={markAll}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-mint-300 transition hover:bg-white/[0.05]"
            >
              <Check className="h-3 w-3" /> Mark all read
            </button>
          )}
        </header>

        <ul className="max-h-72 overflow-y-auto py-1">
          {items.length === 0 ? (
            <li className="flex flex-col items-center gap-2 px-4 py-8 text-center text-xs text-muted-soft">
              <BellOff className="h-5 w-5 text-muted" />
              No notifications yet.
            </li>
          ) : (
            items.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => {
                    markOne(e.id);
                    router.push('/previous');
                  }}
                  className={cn(
                    'flex w-full items-start gap-2.5 px-4 py-2.5 text-left text-xs transition hover:bg-white/[0.03]',
                    unread.has(e.id) && 'bg-mint-400/[0.04]',
                  )}
                >
                  {unread.has(e.id) && (
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-400" />
                  )}
                  <div className={cn('flex-1', !unread.has(e.id) && 'pl-3.5')}>
                    <p className="text-white">
                      <span className="font-semibold">{e.actor}</span>{' '}
                      <span className="text-muted-soft">{e.target}</span>
                    </p>
                    <p className="text-[10px] text-muted">
                      {formatRelative(e.occurredAt)}
                    </p>
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsButton;
