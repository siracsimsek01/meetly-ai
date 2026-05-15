'use client';

import { Search } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { cn } from '@/lib/utils';

interface CommandTriggerButtonProps {
  collapsed?: boolean;
}

const CommandTriggerButton = ({ collapsed }: CommandTriggerButtonProps) => {
  const { toggle } = useCommandPalette();

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={toggle}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] text-muted-soft transition hover:bg-white/[0.07] hover:text-white"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Search ⌘K</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'flex w-full items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2 text-left text-sm text-muted-soft transition hover:bg-white/[0.06] hover:text-white',
      )}
    >
      <Search className="h-4 w-4 text-muted" />
      <span className="flex-1">Search…</span>
      <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] tracking-wider text-muted-soft">
        ⌘K
      </kbd>
    </button>
  );
};

export default CommandTriggerButton;
