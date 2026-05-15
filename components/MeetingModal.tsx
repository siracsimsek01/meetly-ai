'use client';

import { ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  icon?: LucideIcon;
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  className,
  children,
  handleClick,
  buttonText,
  icon: Icon,
}: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 rounded-3xl border border-white/5 bg-ink-850/95 p-8 text-white backdrop-blur-2xl">
        <div className="flex items-start gap-4">
          {Icon && (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mint-400/15 text-mint-300">
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </span>
          )}
          <div className={cn('space-y-1.5', className)}>
            <DialogTitle className="font-display text-2xl font-semibold leading-tight">
              {title}
            </DialogTitle>
            {subtitle ? (
              <DialogDescription className="text-sm text-muted-soft">
                {subtitle}
              </DialogDescription>
            ) : (
              <DialogDescription className="sr-only">
                {title}
              </DialogDescription>
            )}
          </div>
        </div>

        {children && <div className="flex flex-col gap-5">{children}</div>}

        <Button
          onClick={handleClick}
          className="h-12 w-full rounded-full bg-mint-400 text-base font-semibold text-ink-950 transition hover:bg-mint-300"
        >
          {buttonText || 'Confirm'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
