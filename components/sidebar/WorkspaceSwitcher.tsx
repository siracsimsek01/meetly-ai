'use client';

import { Check, ChevronsUpDown } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { cn } from '@/lib/utils';

const accentBg: Record<string, string> = {
  mint: 'bg-mint-400 text-ink-950',
  coral: 'bg-coral-500 text-white',
  amber: 'bg-amber-400 text-ink-950',
};

interface WorkspaceSwitcherProps {
  collapsed?: boolean;
}

const WorkspaceSwitcher = ({ collapsed }: WorkspaceSwitcherProps) => {
  const { active, workspaces, setActive } = useWorkspace();

  if (collapsed) {
    return (
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-2xl font-semibold transition hover:scale-105',
                  accentBg[active.accent],
                )}
                aria-label="Switch workspace"
              >
                {active.initial}
              </button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">{active.name}</TooltipContent>
        </Tooltip>
        <PopoverContent side="right" align="start" className="w-56">
          <WorkspaceList workspaces={workspaces} activeId={active.id} onPick={setActive} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-2 text-left transition hover:bg-white/[0.06]"
        >
          <span
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl font-semibold',
              accentBg[active.accent],
            )}
          >
            {active.initial}
          </span>
          <span className="flex flex-1 flex-col leading-tight">
            <span className="text-sm font-semibold text-white">{active.name}</span>
            <span className="text-[11px] text-muted">{active.members} members</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 text-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64">
        <WorkspaceList workspaces={workspaces} activeId={active.id} onPick={setActive} />
      </PopoverContent>
    </Popover>
  );
};

const WorkspaceList = ({
  workspaces,
  activeId,
  onPick,
}: {
  workspaces: ReturnType<typeof useWorkspace>['workspaces'];
  activeId: string;
  onPick: (id: string) => void;
}) => (
  <div className="flex flex-col gap-1 p-1">
    <p className="px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-muted">
      Workspaces
    </p>
    {workspaces.map((w) => (
      <button
        key={w.id}
        type="button"
        onClick={() => onPick(w.id)}
        className="flex items-center gap-3 rounded-xl px-2 py-2 text-left text-sm text-white transition hover:bg-white/[0.05]"
      >
        <span
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold',
            accentBg[w.accent],
          )}
        >
          {w.initial}
        </span>
        <span className="flex flex-1 flex-col">
          <span className="text-sm leading-tight">{w.name}</span>
          <span className="text-[11px] text-muted">{w.members} members</span>
        </span>
        {w.id === activeId && <Check className="h-4 w-4 text-mint-300" />}
      </button>
    ))}
  </div>
);

export default WorkspaceSwitcher;
