'use client';

import { useRouter } from 'next/navigation';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import {
  CalendarPlus,
  LinkIcon,
  PlaySquare,
  Sparkles,
} from 'lucide-react';

import HomeCard from './HomeCard';
import Loader from './Loader';
import { useMeetingActions } from '@/providers/MeetingActionsProvider';

const MeetingTypeList = () => {
  const router = useRouter();
  const { openNew, openJoin, openSchedule } = useMeetingActions();
  const client = useStreamVideoClient();
  const { user } = useUser();

  if (!client || !user) return <Loader />;

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        icon={Sparkles}
        title="New meeting"
        description="Spin up an instant room"
        tone="mint"
        handleClick={openNew}
      />
      <HomeCard
        icon={LinkIcon}
        title="Join meeting"
        description="Paste any invite link"
        tone="ink"
        handleClick={openJoin}
      />
      <HomeCard
        icon={CalendarPlus}
        title="Schedule"
        description="Plan a future session"
        tone="coral"
        handleClick={openSchedule}
      />
      <HomeCard
        icon={PlaySquare}
        title="Recordings"
        description="Replay & search past calls"
        tone="amber"
        handleClick={() => router.push('/recordings')}
      />
    </section>
  );
};

export default MeetingTypeList;
