import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse-soft rounded-2xl bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.04] bg-[length:200%_100%]',
        className,
      )}
      style={{
        animation: 'shimmer 2.4s linear infinite',
      }}
      {...props}
    />
  );
}

export { Skeleton };
