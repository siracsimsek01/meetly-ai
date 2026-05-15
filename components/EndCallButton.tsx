'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { PhoneOff } from 'lucide-react';

import { Button } from './ui/button';

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  return (
    <Button
      onClick={async () => {
        await call.endCall();
        router.push('/');
      }}
      className="h-12 gap-2 rounded-full bg-coral-500 px-5 text-sm font-semibold text-white shadow-[0_15px_40px_-10px_rgba(255,83,64,0.6)] hover:bg-coral-400"
    >
      <PhoneOff className="h-4 w-4" />
      End for everyone
    </Button>
  );
};

export default EndCallButton;
