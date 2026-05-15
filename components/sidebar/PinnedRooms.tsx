'use client';

import Link from 'next/link';
import { Pin } from 'lucide-react';

import { pinnedRooms } from '@/lib/mock/pinnedRooms';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const dotColor: Record<string, string> = {
  mint: 'bg-mint-400',
  coral: 'bg-coral-500',
  amber: 'bg-amber-400',
};

interface PinnedRoomsProps {
  collapsed?: boolean;
}

const PinnedRooms = ({ collapsed }: PinnedRoomsProps) => {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 py-1">
        {pinnedRooms.map((r) => (
          <Tooltip key={r.id}>
            <TooltipTrigger asChild>
              <Link
                href={r.href}
                className="group flex h-10 w-10 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] transition hover:bg-white/[0.06]"
              >
                <span className={cn('h-2.5 w-2.5 rounded-full', dotColor[r.color])} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{r.name}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {pinnedRooms.map((r) => (
        <Link
          key={r.id}
          href={r.href}
          className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-muted-soft transition hover:bg-white/[0.04] hover:text-white"
        >
          <span className={cn('h-2 w-2 rounded-full', dotColor[r.color])} />
          <span className="flex-1 truncate">{r.name}</span>
          <Pin className="h-3.5 w-3.5 text-muted" />
        </Link>
      ))}
    </div>
  );
};

export default PinnedRooms;
