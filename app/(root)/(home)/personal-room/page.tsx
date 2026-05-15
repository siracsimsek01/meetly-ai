'use client';

import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Copy, Sparkles, UserSquare2, Video } from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useGetCallById } from '@/hooks/useGetCallById';
import { meetingLink } from '@/lib/url';

const Row = ({
  label,
  value,
  copyable,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) => {
  const { toast } = useToast();
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-5 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-[0.25em] text-muted">
          {label}
        </span>
        <span className="mt-1 text-base font-medium text-white">{value}</span>
      </div>
      {copyable && (
        <button
          onClick={() => {
            navigator.clipboard.writeText(value);
            toast({ title: 'Copied to clipboard' });
          }}
          className="inline-flex items-center gap-2 self-start rounded-full border border-white/5 bg-white/[0.04] px-4 py-2 text-xs text-muted-soft transition hover:bg-white/[0.08] hover:text-white"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </button>
      )}
    </div>
  );
};

const PersonalRoom = () => {
  const { user } = useUser();
  const meetingId = user?.id;
  const { toast } = useToast();
  const client = useStreamVideoClient();
  const router = useRouter();

  const inviteLink = meetingId
    ? meetingLink(meetingId, { personal: true })
    : '';
  const { call } = useGetCallById(meetingId!);

  const startRoom = async () => {
    if (!client || !user) return;

    if (!call) {
      const newCall = client.call('default', meetingId!);
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    router.push(`/meeting/${meetingId}?personal=true`);
  };

  return (
    <section className="flex flex-col gap-8 pt-2 text-white">
      <PageHeader
        icon={UserSquare2}
        eyebrow="Always-on"
        title="Personal room"
        description="Your dedicated space. Same link forever — share it with whoever, whenever."
      />

      <div className="grid gap-3 md:grid-cols-2">
        <Row
          label="Topic"
          value={`${user?.username || user?.firstName || 'You'}'s meeting room`}
        />
        <Row label="Meeting ID" value={meetingId ?? '—'} copyable />
        <div className="md:col-span-2">
          <Row label="Invite link" value={inviteLink} copyable />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={startRoom}
          className="h-12 gap-2 rounded-full bg-mint-400 px-6 text-sm font-semibold text-ink-950 hover:bg-mint-300"
        >
          <Video className="h-4 w-4" /> Start meeting
        </Button>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(inviteLink);
            toast({ title: 'Invite link copied' });
          }}
          className="h-12 gap-2 rounded-full border border-white/5 bg-white/[0.04] px-6 text-sm text-white hover:bg-white/[0.07]"
        >
          <Sparkles className="h-4 w-4" /> Copy invite
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoom;
