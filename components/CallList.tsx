'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { CalendarClock, History, PlaySquare, Sparkles } from 'lucide-react';

import Loader from './Loader';
import MeetingCard from './MeetingCard';
import { useGetCalls } from '@/hooks/useGetCalls';
import { meetingLink } from '@/lib/url';

type CallListType = 'ended' | 'upcoming' | 'recordings';

const config: Record<
  CallListType,
  {
    icon: typeof CalendarClock;
    tone: 'mint' | 'amber' | 'ink';
    empty: string;
    cta?: string;
  }
> = {
  ended: {
    icon: History,
    tone: 'ink',
    empty: 'No previous calls yet — your finished sessions show up here.',
  },
  upcoming: {
    icon: CalendarClock,
    tone: 'mint',
    empty: 'No upcoming calls. Schedule one from the home screen.',
    cta: 'Join',
  },
  recordings: {
    icon: PlaySquare,
    tone: 'amber',
    empty: 'No recordings yet. Recorded sessions land here automatically.',
    cta: 'Play',
  },
};

const CallList = ({ type }: { type: CallListType }) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'recordings':
        return recordings;
      case 'upcoming':
        return upcomingCalls;
      default:
        return [];
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
      );

      const list = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(list);
    };

    if (type === 'recordings') {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  if (isLoading) return <Loader />;

  const calls = getCalls();
  const { icon, tone, empty, cta } = config[type];

  if (!calls || calls.length === 0) {
    return (
      <div className="surface-card flex flex-col items-center gap-3 px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-400/15 text-mint-300">
          <Sparkles className="h-5 w-5" />
        </span>
        <p className="max-w-md text-base text-muted-soft">{empty}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {calls.map((meeting: Call | CallRecording) => (
        <MeetingCard
          key={(meeting as Call).id ?? (meeting as CallRecording).filename}
          icon={icon}
          tone={tone}
          title={
            (meeting as Call).state?.custom?.description ||
            (meeting as CallRecording).filename?.substring(0, 24) ||
            'Untitled meeting'
          }
          date={
            (meeting as Call).state?.startsAt?.toLocaleString() ||
            (meeting as CallRecording).start_time?.toLocaleString() ||
            ''
          }
          isPreviousMeeting={type === 'ended'}
          link={
            type === 'recordings'
              ? (meeting as CallRecording).url
              : meetingLink((meeting as Call).id)
          }
          showPlayIcon={type === 'recordings'}
          buttonText={cta}
          handleClick={
            type === 'recordings'
              ? () => router.push(`${(meeting as CallRecording).url}`)
              : () => router.push(`/meeting/${(meeting as Call).id}`)
          }
        />
      ))}
    </div>
  );
};

export default CallList;
