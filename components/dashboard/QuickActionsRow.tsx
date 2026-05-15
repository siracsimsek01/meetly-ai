'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PenSquare,
  Play,
  Sparkles,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useGetCalls } from '@/hooks/useGetCalls';
import { cn } from '@/lib/utils';
import WhiteboardDialog from './WhiteboardDialog';
import SummaryDialog from './SummaryDialog';

type Tone = 'mint' | 'coral' | 'amber' | 'ink';

interface ActionTileProps {
  icon: LucideIcon;
  label: string;
  hint: string;
  tone: Tone;
  onClick: () => void;
  disabled?: boolean;
}

const toneRing: Record<Tone, string> = {
  mint: 'hover:border-mint-400/40 hover:shadow-[0_20px_50px_-30px_rgba(54,240,182,0.4)]',
  coral: 'hover:border-coral-400/40 hover:shadow-[0_20px_50px_-30px_rgba(255,83,64,0.35)]',
  amber: 'hover:border-amber-400/40 hover:shadow-[0_20px_50px_-30px_rgba(255,181,71,0.35)]',
  ink: 'hover:border-white/15',
};

const toneIcon: Record<Tone, string> = {
  mint: 'bg-mint-400/15 text-mint-300',
  coral: 'bg-coral-500/15 text-coral-400',
  amber: 'bg-amber-400/15 text-amber-400',
  ink: 'bg-white/[0.06] text-muted-soft',
};

const ActionTile = ({
  icon: Icon,
  label,
  hint,
  tone,
  onClick,
  disabled,
}: ActionTileProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'group flex flex-col items-start gap-3 rounded-2xl border border-white/5 bg-ink-850/80 p-4 text-left transition',
      'disabled:cursor-not-allowed disabled:opacity-50',
      toneRing[tone],
    )}
  >
    <span
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-xl transition group-hover:scale-105',
        toneIcon[tone],
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={2.2} />
    </span>
    <div>
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="text-xs text-muted-soft">{hint}</p>
    </div>
  </button>
);

const QuickActionsRow = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { endedCalls } = useGetCalls();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const lastCall = endedCalls?.[0];

  const sendInvite = () => {
    if (!inviteEmail) {
      toast({ title: 'Add an email first' });
      return;
    }
    toast({
      title: 'Invite sent',
      description: `Invitation queued for ${inviteEmail}`,
    });
    setInviteEmail('');
    setInviteOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <ActionTile
          icon={Play}
          tone="mint"
          label="Resume last meeting"
          hint={lastCall ? 'Rejoin your most recent room' : 'No previous calls'}
          disabled={!lastCall}
          onClick={() => lastCall && router.push(`/meeting/${lastCall.id}`)}
        />
        <ActionTile
          icon={UserPlus}
          tone="coral"
          label="Invite a teammate"
          hint="Send a one-click join link"
          onClick={() => setInviteOpen(true)}
        />
        <ActionTile
          icon={PenSquare}
          tone="amber"
          label="Open whiteboard"
          hint="Sketch and present live"
          onClick={() => setWhiteboardOpen(true)}
        />
        <ActionTile
          icon={Sparkles}
          tone="ink"
          label="Generate summary"
          hint="AI distills a recent call"
          onClick={() => setSummaryOpen(true)}
        />
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="flex w-full max-w-[480px] flex-col gap-5 rounded-3xl border border-white/5 bg-ink-850/95 p-7 text-white backdrop-blur-2xl">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral-500/15 text-coral-400">
              <UserPlus className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle className="font-display text-xl font-semibold">
                Invite a teammate
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-soft">
                We&apos;ll send them a one-click join link.
              </DialogDescription>
            </div>
          </div>
          <Input
            type="email"
            placeholder="name@team.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="rounded-2xl border-white/5 bg-white/[0.03] py-5"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setInviteOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button onClick={sendInvite} className="rounded-full">
              Send invite
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <WhiteboardDialog open={whiteboardOpen} onOpenChange={setWhiteboardOpen} />
      <SummaryDialog open={summaryOpen} onOpenChange={setSummaryOpen} />
    </>
  );
};

export default QuickActionsRow;
