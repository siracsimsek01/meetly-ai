'use client';

import { Check, Download } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface InstallAppButtonProps {
  collapsed?: boolean;
}

const InstallAppButton = ({ collapsed }: InstallAppButtonProps) => {
  const { status, prompt, canInstall } = useInstallPrompt();
  const { toast } = useToast();

  if (status === 'unsupported') {
    // Don't render at all when the browser hasn't surfaced an install prompt
    // and we're not running standalone — keeps the UI honest.
    if (!canInstall) return null;
  }

  const handleClick = async () => {
    if (status === 'installed') {
      toast({
        title: 'Meetly AI is installed',
        description: 'Open it from your dock, Start menu, or home screen.',
      });
      return;
    }
    if (!canInstall) {
      toast({
        title: 'Install not available here',
        description:
          'Use a Chromium-based browser on desktop or Android, and serve over HTTPS to install.',
      });
      return;
    }
    const outcome = await prompt();
    if (outcome === 'accepted') {
      toast({ title: 'Installing Meetly AI…' });
    }
  };

  const installed = status === 'installed';
  const label = installed ? 'Installed' : 'Install app';
  const Icon = installed ? Check : Download;

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-2xl border border-white/5 transition',
              installed
                ? 'bg-mint-400/20 text-mint-300'
                : 'bg-white/[0.03] text-muted-soft hover:bg-mint-400/15 hover:text-mint-200',
            )}
            aria-label={label}
          >
            <Icon className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'group flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition',
        installed
          ? 'border-mint-400/30 bg-mint-400/10 text-mint-200'
          : 'border-white/5 bg-white/[0.02] text-muted-soft hover:border-mint-400/30 hover:bg-white/[0.05] hover:text-white',
      )}
    >
      <span
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-xl',
          installed
            ? 'bg-mint-400/20 text-mint-300'
            : 'bg-mint-400/15 text-mint-300 group-hover:bg-mint-400/25',
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex flex-1 flex-col leading-tight">
        <span className="text-xs font-semibold text-white">{label}</span>
        <span className="text-[11px] text-muted">
          {installed
            ? 'Launch from your dock or home screen'
            : 'Run Meetly AI as a desktop / mobile app'}
        </span>
      </span>
    </button>
  );
};

export default InstallAppButton;
