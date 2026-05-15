'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactDatePicker from 'react-datepicker';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import { CalendarPlus, CopyCheck, LinkIcon, Video } from 'lucide-react';

import MeetingModal from './MeetingModal';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import { useMeetingActions } from '@/providers/MeetingActionsProvider';
import { meetingLink } from '@/lib/url';

const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};

/**
 * Global host for the New / Join / Schedule meeting modals. Mounted once by
 * MeetingActionsProvider so the actions work from any page — the home cards,
 * the command palette, the sidebar, the schedule page, etc.
 */
const MeetingActionsDialogs = () => {
  const router = useRouter();
  const { state, close } = useMeetingActions();
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();

  // No Stream client / no user → don't render. The dialogs only make sense
  // for authenticated, connected users.
  if (!client || !user) return null;

  const shareLink = callDetail?.id ? meetingLink(callDetail.id) : '';

  const resetAndClose = () => {
    setValues(initialValues);
    setCallDetail(undefined);
    close();
  };

  const createMeeting = async () => {
    try {
      if (!values.dateTime) {
        toast({ title: 'Please select a date and time' });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) throw new Error('Failed to create meeting');
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Meeting';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: { description },
        },
      });
      setCallDetail(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
        resetAndClose();
        toast({ title: 'Meeting created', description });
        return;
      }
      toast({ title: 'Meeting scheduled', description });
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to create meeting' });
    }
  };

  const joinByLink = () => {
    const raw = values.link.trim();
    if (!raw) {
      toast({ title: 'Paste a meeting link first' });
      return;
    }
    try {
      // Accept both absolute meeting URLs and bare IDs.
      const candidate = raw.startsWith('http') ? new URL(raw).pathname : raw;
      const match = candidate.match(/meeting\/([^/?#]+)/);
      const id = match ? match[1] : candidate.replace(/^\//, '');
      if (!id) {
        toast({ title: 'That link doesn’t look like a meeting URL' });
        return;
      }
      resetAndClose();
      router.push(`/meeting/${id}`);
    } catch {
      toast({ title: 'That link doesn’t look like a meeting URL' });
    }
  };

  return (
    <>
      {/* Schedule — form, then confirmation with copy link */}
      {!callDetail ? (
        <MeetingModal
          isOpen={state === 'isScheduleMeeting'}
          onClose={resetAndClose}
          title="Schedule a meeting"
          subtitle="Add a short description and pick a time."
          handleClick={createMeeting}
          buttonText="Create meeting"
          icon={CalendarPlus}
        >
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.25em] text-muted">
              Description
            </label>
            <Textarea
              placeholder="What is this meeting about?"
              value={values.description}
              className="min-h-[96px] rounded-2xl border-white/5 bg-white/[0.03] focus-visible:border-mint-400/40 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.25em] text-muted">
              Date &amp; time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy · h:mm aa"
              className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-2.5 text-sm text-white focus:border-mint-400/40 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={state === 'isScheduleMeeting'}
          onClose={resetAndClose}
          title="Meeting scheduled"
          subtitle="Share the link with whoever should join."
          handleClick={() => {
            navigator.clipboard.writeText(shareLink);
            toast({ title: 'Link copied' });
          }}
          icon={CopyCheck}
          buttonText="Copy meeting link"
        />
      )}

      {/* Join by link */}
      <MeetingModal
        isOpen={state === 'isJoiningMeeting'}
        onClose={resetAndClose}
        title="Join a meeting"
        subtitle="Paste the invite link or meeting ID below."
        buttonText="Join now"
        icon={LinkIcon}
        handleClick={joinByLink}
      >
        <Input
          placeholder="https://meetly-ai.app/meeting/abc-defg"
          value={values.link}
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="rounded-2xl border-white/5 bg-white/[0.03] py-6 text-base focus-visible:border-mint-400/40 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>

      {/* Instant meeting */}
      <MeetingModal
        isOpen={state === 'isInstantMeeting'}
        onClose={resetAndClose}
        title="Start an instant meeting"
        subtitle="Spin up a room and share the link from inside."
        buttonText="Start meeting"
        icon={Video}
        handleClick={createMeeting}
      />
    </>
  );
};

export default MeetingActionsDialogs;
