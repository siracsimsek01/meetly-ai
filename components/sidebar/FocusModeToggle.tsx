'use client';

import { Moon } from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFocusMode } from '@/providers/FocusModeProvider';
import { cn } from '@/lib/utils';

interface FocusModeToggleProps {
  collapsed?: boolean;
}

const FocusModeToggle = ({ collapsed }: FocusModeToggleProps) => {
  const { focus, toggle } = useFocusMode();

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={toggle}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-2xl border border-white/5 transition',
              focus
                ? 'bg-mint-400/20 text-mint-300'
                : 'bg-white/[0.03] text-muted-soft hover:bg-white/[0.07] hover:text-white',
            )}
            aria-label="Toggle focus mode"
          >
            <Moon className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {focus ? 'Focus on' : 'Focus mode'}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Moon
          className={cn(
            'h-4 w-4',
            focus ? 'text-mint-300' : 'text-muted-soft',
          )}
        />
        <span className="text-xs font-medium text-white">Focus mode</span>
      </div>
      <Switch checked={focus} onCheckedChange={toggle} />
    </label>
  );
};

export default FocusModeToggle;
