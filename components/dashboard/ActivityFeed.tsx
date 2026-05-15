'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AtSign,
  CalendarPlus,
  Filter,
  FileText,
  LogIn,
  LogOut,
  PlaySquare,
  StickyNote,
  type LucideIcon,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { activityEvents } from '@/lib/mock/activity';
import type { ActivityEvent, ActivityEventType } from '@/lib/mock/types';
import { formatRelative } from '@/lib/format';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const iconFor: Record<ActivityEventType, LucideIcon> = {
  joined: LogIn,
  left: LogOut,
  summary: FileText,
  recording: PlaySquare,
  scheduled: CalendarPlus,
  mention: AtSign,
  note: StickyNote,
};

const toneFor: Record<ActivityEventType, string> = {
  joined: 'bg-mint-400/15 text-mint-300',
  left: 'bg-white/[0.06] text-muted-soft',
  summary: 'bg-amber-400/15 text-amber-400',
  recording: 'bg-coral-500/15 text-coral-400',
  scheduled: 'bg-mint-400/15 text-mint-300',
  mention: 'bg-amber-400/15 text-amber-400',
  note: 'bg-white/[0.06] text-muted-soft',
};

const phraseFor: Record<ActivityEventType, string> = {
  joined: 'joined',
  left: 'left',
  summary: 'summarized',
  recording: '',
  scheduled: 'scheduled',
  mention: '',
  note: '',
};

const FILTERS: { id: ActivityEventType | 'all'; label: string }[] = [
  { id: 'all', label: 'All activity' },
  { id: 'joined', label: 'Joins & leaves' },
  { id: 'mention', label: 'Mentions' },
  { id: 'summary', label: 'AI summaries' },
  { id: 'recording', label: 'Recordings' },
  { id: 'scheduled', label: 'Scheduled' },
];

const ActivityFeed = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');

  const filtered = useMemo<ActivityEvent[]>(() => {
    if (filter === 'all') return activityEvents;
    // Combine joined + left under the same filter for readability.
    if (filter === 'joined') {
      return activityEvents.filter((e) => e.type === 'joined' || e.type === 'left');
    }
    return activityEvents.filter((e) => e.type === filter);
  }, [filter]);

  const handleClick = (e: ActivityEvent) => {
    switch (e.type) {
      case 'recording':
        router.push('/recordings');
        break;
      case 'scheduled':
        router.push('/schedule');
        break;
      case 'summary':
      case 'mention':
      case 'joined':
      case 'left':
        router.push('/previous');
        break;
      default:
        toast({
          title: e.actor,
          description: `${phraseFor[e.type] ?? ''} ${e.target}`.trim(),
        });
    }
  };

  const activeLabel = FILTERS.find((f) => f.id === filter)?.label ?? 'All';

  return (
    <section className="surface-card flex flex-col gap-4 p-5">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">
            Activity feed
          </h3>
          <p className="text-xs text-muted-soft">
            What&apos;s happening across your workspace.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="pill inline-flex items-center gap-1.5 transition hover:border-mint-400/30 hover:text-mint-200">
            <Filter className="h-3.5 w-3.5" /> {activeLabel}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-2xl border border-white/5 bg-ink-850/95 p-1 text-white backdrop-blur-xl"
          >
            {FILTERS.map((f) => (
              <DropdownMenuItem
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  'cursor-pointer rounded-xl px-3 py-2 text-sm',
                  filter === f.id
                    ? 'bg-mint-400/15 text-mint-300'
                    : 'text-muted-soft focus:bg-white/[0.05] focus:text-white',
                )}
              >
                {f.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center text-sm text-muted-soft">
          Nothing here yet — try a different filter.
        </div>
      ) : (
        <ol className="flex flex-col gap-2">
          {filtered.map((e) => {
            const Icon = iconFor[e.type];
            const verb = phraseFor[e.type];
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => handleClick(e)}
                  className="flex w-full items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-left transition hover:border-mint-400/30 hover:bg-white/[0.04]"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneFor[e.type]}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <p className="text-sm text-white">
                      <span className="font-semibold">{e.actor}</span>{' '}
                      {verb && <span className="text-muted-soft">{verb} </span>}
                      <span className="text-muted-soft">{e.target}</span>
                    </p>
                    <p className="text-[11px] text-muted">
                      {formatRelative(e.occurredAt)}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
};

export default ActivityFeed;
