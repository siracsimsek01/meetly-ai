'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import { Loader2, MessageSquare, UserPlus, Users2, Video } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { team } from '@/lib/mock/team';
import type { PresenceStatus, TeammatePresence } from '@/lib/mock/types';
import { cn } from '@/lib/utils';

const statusColor: Record<PresenceStatus, string> = {
  online: 'bg-mint-400',
  busy: 'bg-coral-500',
  idle: 'bg-amber-400',
  offline: 'bg-white/15',
};

const statusLabel: Record<PresenceStatus, string> = {
  online: 'Available',
  busy: 'In a meeting',
  idle: 'Idle',
  offline: 'Offline',
};

const TeamPresence = () => {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { toast } = useToast();
  const [selected, setSelected] = useState<TeammatePresence | null>(null);
  const [starting, setStarting] = useState(false);

  const online = team.filter((t) => t.status === 'online').length;

  const startOneOnOne = async () => {
    if (!client || !user || !selected) return;
    setStarting(true);
    try {
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      await call.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: { description: `1:1 with ${selected.name}` },
        },
      });
      toast({
        title: '1:1 room ready',
        description: `Sharing link with ${selected.name}…`,
      });
      router.push(`/meeting/${call.id}`);
      setSelected(null);
    } catch (err) {
      toast({
        title: 'Could not start meeting',
        description: err instanceof Error ? err.message : 'Try again.',
      });
    } finally {
      setStarting(false);
    }
  };

  const message = () => {
    if (!selected) return;
    toast({
      title: 'Direct messages',
      description: `Chat with ${selected.name} is coming soon.`,
    });
  };

  const invite = () => {
    if (!selected) return;
    toast({
      title: 'Invite sent',
      description: `Invitation queued for ${selected.name}.`,
    });
    setSelected(null);
  };

  return (
    <>
      <section className="surface-card flex flex-col gap-4 p-5">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-white">
              Team presence
            </h3>
            <p className="text-xs text-muted-soft">
              {online} of {team.length} online — click to start a 1:1.
            </p>
          </div>
          <span className="pill">
            <Users2 className="h-3.5 w-3.5" /> {team.length}
          </span>
        </header>

        <div className="grid grid-cols-5 gap-2">
          {team.map((t) => (
            <Tooltip key={t.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setSelected(t)}
                  className="relative inline-flex transition hover:scale-105"
                  aria-label={`${t.name} — ${statusLabel[t.status]}`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={t.avatar} alt={t.name} />
                    <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-ink-850',
                      statusColor[t.status],
                    )}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{t.name}</p>
                <p className="text-[10px] text-muted-soft">
                  {t.role} · {statusLabel[t.status]}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </section>

      <Dialog
        open={selected !== null}
        onOpenChange={(o) => !o && setSelected(null)}
      >
        <DialogContent className="flex w-full max-w-[440px] flex-col gap-5 rounded-3xl border border-white/5 bg-ink-850/95 p-7 text-white backdrop-blur-2xl">
          {selected && (
            <>
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={selected.avatar} alt={selected.name} />
                  <AvatarFallback>{selected.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="font-display text-xl font-semibold">
                    {selected.name}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-soft">
                    {selected.role} ·{' '}
                    <span className="inline-flex items-center gap-1">
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          statusColor[selected.status],
                        )}
                      />
                      {statusLabel[selected.status]}
                    </span>
                  </DialogDescription>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button
                  onClick={startOneOnOne}
                  disabled={starting || selected.status === 'offline'}
                  className="h-11 gap-2 rounded-full"
                >
                  {starting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Video className="h-4 w-4" />
                  )}
                  Start 1:1
                </Button>
                <Button
                  variant="secondary"
                  onClick={message}
                  className="h-11 gap-2 rounded-full"
                >
                  <MessageSquare className="h-4 w-4" /> Message
                </Button>
                <Button
                  variant="secondary"
                  onClick={invite}
                  className="h-11 gap-2 rounded-full sm:col-span-2"
                >
                  <UserPlus className="h-4 w-4" /> Invite to next meeting
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeamPresence;
