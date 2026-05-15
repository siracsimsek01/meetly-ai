'use client';

import { ArrowUpRight, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface HomeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: 'mint' | 'coral' | 'amber' | 'ink';
  handleClick: () => void;
}

const toneStyles: Record<NonNullable<HomeCardProps['tone']>, string> = {
  mint: 'group-hover:border-mint-400/40 group-hover:shadow-[0_25px_60px_-30px_rgba(54,240,182,0.45)]',
  coral:
    'group-hover:border-coral-400/40 group-hover:shadow-[0_25px_60px_-30px_rgba(255,83,64,0.4)]',
  amber:
    'group-hover:border-amber-400/40 group-hover:shadow-[0_25px_60px_-30px_rgba(255,181,71,0.35)]',
  ink: 'group-hover:border-white/15 group-hover:shadow-panel',
};

const iconTone: Record<NonNullable<HomeCardProps['tone']>, string> = {
  mint: 'bg-mint-400 text-ink-950',
  coral: 'bg-coral-500 text-white',
  amber: 'bg-amber-400 text-ink-950',
  ink: 'bg-white/10 text-white',
};

const HomeCard = ({
  icon: Icon,
  title,
  description,
  tone = 'ink',
  handleClick,
}: HomeCardProps) => {
  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'group relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-3xl border border-white/5 bg-ink-850/80 p-6 text-left transition duration-300 backdrop-blur-md',
        toneStyles[tone],
      )}
    >
      <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/[0.04] text-muted-soft transition group-hover:bg-white/[0.1] group-hover:text-white">
        <ArrowUpRight className="h-4 w-4" />
      </div>

      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:scale-105',
          iconTone[tone],
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={2.4} />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-display text-lg font-semibold text-white">
          {title}
        </h3>
        <p className="text-sm text-muted-soft">{description}</p>
      </div>
    </button>
  );
};

export default HomeCard;
