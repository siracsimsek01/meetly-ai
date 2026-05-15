'use client';

import { use, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  BackgroundFiltersProvider,
  StreamCall,
  StreamTheme,
} from '@stream-io/video-react-sdk';

import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetCallById';

const Meeting = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { isLoaded } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(id);

  if (!isLoaded || isCallLoading) return <Loader />;

  if (!call) {
    return (
      <main className="flex h-screen w-full items-center justify-center px-6">
        <div className="surface-panel max-w-md p-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-white">
            Call not found
          </h1>
          <p className="mt-2 text-sm text-muted-soft">
            This meeting link is invalid or the session has ended.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          <BackgroundFiltersProvider backgroundBlurLevel="medium">
            {!isSetupComplete ? (
              <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
            ) : (
              <MeetingRoom />
            )}
          </BackgroundFiltersProvider>
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
