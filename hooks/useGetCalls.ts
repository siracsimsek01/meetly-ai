'use client';

import { useMeetingsData } from '@/providers/MeetingsDataProvider';

// Compatibility shim: reads from the single shared MeetingsDataProvider so we
// don't fire `queryCalls` once per consumer (which previously caused 429s
// against Stream).
export const useGetCalls = () => {
  const {
    endedCalls,
    upcomingCalls,
    callRecordings,
    isLoading,
  } = useMeetingsData();

  return { endedCalls, upcomingCalls, callRecordings, isLoading };
};
