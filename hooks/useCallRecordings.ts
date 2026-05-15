'use client';

import { useMeetingsData } from '@/providers/MeetingsDataProvider';

// Compatibility shim: every consumer used to fire its own per-call
// `queryRecordings` fan-out. Now we batch + cap inside MeetingsDataProvider
// and share the result.
export const useCallRecordings = () => {
  const { recordings, isLoading, isLoadingRecordings } = useMeetingsData();
  return {
    recordings,
    isLoading: isLoading || isLoadingRecordings,
  };
};
