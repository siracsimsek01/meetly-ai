'use client';

import Link from 'next/link';
import { Radio } from 'lucide-react';

import { useGetCalls } from '@/hooks/useGetCalls';

interface LiveIndicatorCardProps {
  collapsed?: boolean;
}

const LiveIndicatorCard = ({ collapsed }: LiveIndicatorCardProps) => {
  const { upcomingCalls } = useGetCalls();

  const now = new Date();
  const live = upcomingCalls?.find((c) => {
    const start = c.state.startsAt ? new Date(c.state.startsAt) : null;
    if (!start) return false;
    const diffMin = (start.getTime() - now.getTime()) / 60_000;
    return diffMin < 5 && diffMin > -60;
  });

  if (!live) {
    if (collapsed) return null;
    return (
      <div className="surface-card flex flex-col gap-3 p-4">
        <span className="pill pill-active w-fit">Pro tip</span>
        <p className="text-sm text-muted-soft">
          Press <kbd className="rounded bg-white/10 px-1 text-xs">⌘K</kbd> to
          jump to any meeting in seconds.
        </p>
      </div>
    );
  }

  const title =
    (live.state.custom?.description as string | undefined) ?? 'Live meeting';

  if (collapsed) {
    return (
      <Link
        href={`/meeting/${live.id}`}
        className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-mint-400/20 text-mint-300"
        aria-label={`Rejoin ${title}`}
      >
        <Radio className="h-4 w-4" />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse-soft rounded-full bg-mint-400 ring-2 ring-ink-950" />
      </Link>
    );
  }

  return (
    <Link
      href={`/meeting/${live.id}`}
      className="surface-card flex flex-col gap-2 border-mint-400/30 bg-mint-400/10 p-4 transition hover:bg-mint-400/15"
    >
      <span className="pill pill-active w-fit">
        <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-mint-400" />
        Live now
      </span>
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-muted-soft">Tap to rejoin</p>
    </Link>
  );
};

export default LiveIndicatorCard;
