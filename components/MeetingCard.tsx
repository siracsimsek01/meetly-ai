'use client';

import Image from 'next/image';
import { type LucideIcon, Copy, Play } from 'lucide-react';

import { Button } from './ui/button';
import { avatarImages } from '@/constants';
import { useToast } from './ui/use-toast';
import { cn } from '@/lib/utils';

interface MeetingCardProps {
  title: string;
  date: string;
  icon: LucideIcon;
  isPreviousMeeting?: boolean;
  buttonText?: string;
  showPlayIcon?: boolean;
  handleClick: () => void;
  link: string;
  tone?: 'mint' | 'amber' | 'ink';
}

const toneRing: Record<NonNullable<MeetingCardProps['tone']>, string> = {
  mint: 'before:bg-mint-400/40',
  amber: 'before:bg-amber-400/35',
  ink: 'before:bg-white/10',
};

const toneBadge: Record<NonNullable<MeetingCardProps['tone']>, string> = {
  mint: 'bg-mint-400/15 text-mint-300',
  amber: 'bg-amber-400/15 text-amber-400',
  ink: 'bg-white/[0.06] text-muted-soft',
};

const MeetingCard = ({
  icon: Icon,
  title,
  date,
  isPreviousMeeting,
  buttonText,
  showPlayIcon,
  handleClick,
  link,
  tone = 'mint',
}: MeetingCardProps) => {
  const { toast } = useToast();

  return (
    <article
      className={cn(
        'relative flex w-full flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/5 bg-ink-850/80 p-6 backdrop-blur-md transition hover:border-white/10',
        'before:pointer-events-none before:absolute before:-right-20 before:-top-20 before:h-56 before:w-56 before:rounded-full before:blur-[80px]',
        toneRing[tone],
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <span
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-2xl',
            toneBadge[tone],
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <span className="pill">{isPreviousMeeting ? 'Past' : 'Upcoming'}</span>
      </header>

      <div className="space-y-1.5">
        <h3 className="font-display text-xl font-semibold text-white">
          {title}
        </h3>
        <p className="text-sm text-muted-soft">{date}</p>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {avatarImages.slice(0, 4).map((img, index) => (
              <Image
                key={index}
                src={img}
                alt="attendee"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border-2 border-ink-850 object-cover"
              />
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink-850 bg-white/[0.05] text-[10px] font-semibold text-muted-soft">
              +5
            </div>
          </div>
        </div>

        {!isPreviousMeeting && (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleClick}
              className="h-10 gap-2 rounded-full bg-mint-400 px-5 text-sm font-semibold text-ink-950 hover:bg-mint-300"
            >
              {showPlayIcon && <Play className="h-4 w-4" />}
              {buttonText || 'Join'}
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({ title: 'Link copied' });
              }}
              className="h-10 gap-2 rounded-full border border-white/5 bg-white/[0.04] px-4 text-sm text-white hover:bg-white/[0.07]"
            >
              <Copy className="h-4 w-4" /> Copy
            </Button>
          </div>
        )}
      </footer>
    </article>
  );
};

export default MeetingCard;
