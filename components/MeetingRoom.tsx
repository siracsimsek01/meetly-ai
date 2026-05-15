'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import {
  ChevronDown,
  LayoutGrid,
  Maximize2,
  MessageSquare,
  Sparkles,
  Users,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import EndCallButton from './EndCallButton';
import InviteButton from './InviteButton';
import Loader from './Loader';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const layouts: { id: CallLayoutType; label: string }[] = [
  { id: 'grid', label: 'Grid' },
  { id: 'speaker-left', label: 'Speaker left' },
  { id: 'speaker-right', label: 'Speaker right' },
];

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();

  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  const activeLayout = layouts.find((l) => l.id === layout)?.label ?? 'Speaker';

  return (
    <section className="relative flex h-screen w-full flex-col text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="icon-btn"
            aria-label="Back to home"
          >
            <ChevronDown className="h-5 w-5 rotate-90" />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted">
              Live session
            </span>
            <h1 className="font-display text-lg font-semibold leading-tight">
              {isPersonalRoom ? 'Personal room' : 'Design meeting'}
            </h1>
          </div>
          <span className="pill pill-active ml-2">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-mint-400" />
            Live
          </span>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <span className="pill">
            <Sparkles className="h-3.5 w-3.5 text-mint-300" />
            Auto layout · {activeLayout}
          </span>
        </div>
      </header>

      {/* Stage */}
      <div className="relative flex flex-1 overflow-hidden px-3 pb-3 sm:px-6 sm:pb-6">
        <div className="relative flex-1 overflow-hidden rounded-[28px] border border-white/5 bg-ink-900/60 p-3 sm:p-4">
          <CallLayout />
        </div>

        <aside
          className={cn(
            'ml-2 hidden h-full w-[320px] flex-col transition-all',
            showParticipants ? 'show-block flex' : 'hidden',
          )}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </aside>
      </div>

      {/* Control bar */}
      <footer className="pointer-events-none px-3 pb-6 sm:px-6">
        <div className="pointer-events-auto mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-white/5 bg-ink-900/85 px-3 py-2.5 backdrop-blur-xl">
          <CallControls onLeave={() => router.push('/')} />

          <span className="mx-1 hidden h-6 w-px bg-white/5 sm:block" />

          <InviteButton />

          <DropdownMenu>
            <DropdownMenuTrigger
              className="control-btn"
              aria-label="Change layout"
            >
              <LayoutGrid className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="mt-2 rounded-2xl border border-white/5 bg-ink-850/95 p-1 text-white backdrop-blur-xl"
            >
              {layouts.map((l) => (
                <DropdownMenuItem
                  key={l.id}
                  onClick={() => setLayout(l.id)}
                  className={cn(
                    'cursor-pointer rounded-xl px-3 py-2 text-sm',
                    layout === l.id
                      ? 'bg-mint-400/15 text-mint-300'
                      : 'text-muted-soft focus:bg-white/[0.05] focus:text-white',
                  )}
                >
                  {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => setShowParticipants((prev) => !prev)}
            className={cn(
              'control-btn',
              showParticipants && 'bg-mint-400/15 text-mint-300',
            )}
            aria-label="Toggle participants"
          >
            <Users className="h-5 w-5" />
          </button>

          <button className="control-btn" aria-label="Open chat">
            <MessageSquare className="h-5 w-5" />
          </button>

          <CallStatsButton />

          <button className="control-btn" aria-label="Fullscreen">
            <Maximize2 className="h-5 w-5" />
          </button>

          {!isPersonalRoom && (
            <>
              <span className="mx-1 hidden h-6 w-px bg-white/5 sm:block" />
              <EndCallButton />
            </>
          )}
        </div>
      </footer>
    </section>
  );
};

export default MeetingRoom;
