import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-400/40 focus-visible:ring-offset-0',
  {
    variants: {
      variant: {
        default:
          'bg-mint-400 text-ink-950 hover:bg-mint-300',
        secondary:
          'border border-white/5 bg-white/[0.04] text-white hover:bg-white/[0.08]',
        destructive:
          'bg-coral-500 text-white shadow-[0_15px_40px_-10px_rgba(255,83,64,0.6)] hover:bg-coral-400',
        outline:
          'border border-white/10 bg-transparent text-white hover:bg-white/[0.05]',
        ghost: 'text-muted-soft hover:bg-white/[0.05] hover:text-white',
        link: 'text-mint-300 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-7 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
