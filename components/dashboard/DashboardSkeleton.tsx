import { Skeleton } from '@/components/ui/skeleton';

export const HeroSkeleton = () => (
  <Skeleton className="h-[260px] w-full rounded-[32px]" />
);

export const QuickActionsSkeleton = () => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="h-20 rounded-2xl" />
    ))}
  </div>
);

export const TimelineSkeleton = () => (
  <div className="surface-card flex flex-col gap-3 p-5">
    <Skeleton className="h-4 w-24" />
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="h-14 rounded-xl" />
    ))}
  </div>
);

export const KpisSkeleton = () => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="h-24 rounded-2xl" />
    ))}
  </div>
);

export const StripSkeleton = () => (
  <div className="flex gap-3 overflow-hidden">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="h-36 w-64 shrink-0 rounded-2xl" />
    ))}
  </div>
);

export const ActivitySkeleton = () => (
  <div className="surface-card flex flex-col gap-3 p-5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-10 rounded-xl" />
    ))}
  </div>
);

export const CalendarSkeleton = () => (
  <Skeleton className="h-[340px] w-full rounded-3xl" />
);
