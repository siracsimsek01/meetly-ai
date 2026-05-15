import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors',
  {
    variants: {
      variant: {
        default: 'border-white/5 bg-white/[0.03] text-muted-soft',
        mint: 'border-mint-400/30 bg-mint-400/15 text-mint-300',
        coral: 'border-coral-500/30 bg-coral-500/15 text-coral-400',
        amber: 'border-amber-400/30 bg-amber-400/15 text-amber-400',
        solid: 'border-transparent bg-mint-400 text-ink-950',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
