'use client';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CollapseToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

const CollapseToggle = ({ collapsed, onToggle }: CollapseToggleProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        onClick={onToggle}
        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] text-muted-soft transition hover:bg-white/[0.07] hover:text-white"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>
    </TooltipTrigger>
    <TooltipContent side="right">
      {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    </TooltipContent>
  </Tooltip>
);

export default CollapseToggle;
