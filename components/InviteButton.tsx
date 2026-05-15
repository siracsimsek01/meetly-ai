'use client';

import { useState } from 'react';
import { useCall } from '@stream-io/video-react-sdk';
import {
  Check,
  Copy,
  Mail,
  MessageSquare,
  UserPlus,
} from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { meetingLink } from '@/lib/url';
import { cn } from '@/lib/utils';

const InviteButton = () => {
  const call = useCall();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!call) return null;

  const link = meetingLink(call.id);
  const title =
    (call.state.custom?.description as string | undefined) ?? 'Meetly AI meeting';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast({ title: 'Link copied to clipboard' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Could not copy link' });
    }
  };

  const mailto = `mailto:?subject=${encodeURIComponent(
    `Join me on Meetly AI: ${title}`,
  )}&body=${encodeURIComponent(`Join the meeting: ${link}`)}`;

  const sms = `sms:?&body=${encodeURIComponent(
    `Join me on Meetly AI: ${link}`,
  )}`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="control-btn icon-btn-mint"
          aria-label="Invite participants"
        >
          <UserPlus className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        side="top"
        sideOffset={12}
        className="w-80 p-0"
      >
        <header className="border-b border-white/5 px-4 py-3">
          <p className="font-display text-sm font-semibold text-white">
            Invite to meeting
          </p>
          <p className="mt-0.5 truncate text-[11px] text-muted">{title}</p>
        </header>

        <div className="space-y-2 p-3">
          <button
            type="button"
            onClick={copyLink}
            className={cn(
              'group flex w-full items-center gap-3 overflow-hidden rounded-2xl border px-3 py-2.5 text-left transition',
              copied
                ? 'border-mint-400/40 bg-mint-400/10 text-mint-200'
                : 'border-white/5 bg-white/[0.03] text-muted-soft hover:bg-white/[0.06] hover:text-white',
            )}
          >
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition',
                copied
                  ? 'bg-mint-400/25 text-mint-300'
                  : 'bg-mint-400/15 text-mint-300 group-hover:bg-mint-400/25',
              )}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </span>
            <span className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="text-xs font-semibold text-white">
                {copied ? 'Link copied!' : 'Copy meeting link'}
              </span>
              <span className="text-[10px] text-muted">
                Paste it anywhere to invite someone
              </span>
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={mailto}
              className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2 text-xs text-white transition hover:bg-white/[0.06]"
            >
              <Mail className="h-4 w-4 text-muted-soft" />
              Email
            </a>
            <a
              href={sms}
              className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2 text-xs text-white transition hover:bg-white/[0.06]"
            >
              <MessageSquare className="h-4 w-4 text-muted-soft" />
              SMS
            </a>
          </div>

          <div className="rounded-2xl border border-white/5 bg-ink-900/60 p-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted">
              Meeting ID
            </p>
            <p className="mt-1 break-all font-mono text-[11px] leading-tight text-white">
              {call.id}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InviteButton;
