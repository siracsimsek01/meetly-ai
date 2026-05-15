import { type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  compact?: boolean;
  className?: string;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  compact,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      'surface-card flex flex-col items-center gap-3 text-center',
      compact ? 'px-4 py-8' : 'px-6 py-12',
      className,
    )}
  >
    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint-400/15 text-mint-300">
      <Icon className="h-5 w-5" />
    </span>
    <div className="space-y-1">
      <p className="text-sm font-semibold text-white">{title}</p>
      {description && (
        <p className="max-w-sm text-xs text-muted-soft">{description}</p>
      )}
    </div>
    {action}
  </div>
);

export default EmptyState;
