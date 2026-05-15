'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useUser } from '@clerk/nextjs';
import {
  type Call,
  type CallRecording,
  useStreamVideoClient,
} from '@stream-io/video-react-sdk';

type MeetingsDataValue = {
  calls: Call[];
  upcomingCalls: Call[];
  endedCalls: Call[];
  callRecordings: Call[];
  recordings: CallRecording[];
  isLoading: boolean;
  isLoadingRecordings: boolean;
};

const MeetingsDataContext = createContext<MeetingsDataValue | null>(null);

const RECORDING_BATCH_SIZE = 5;
const RECORDING_CALL_CAP = 20;

export const MeetingsDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const client = useStreamVideoClient();

  const [calls, setCalls] = useState<Call[]>([]);
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState(false);

  useEffect(() => {
    if (!client || !user?.id) return;

    let cancelled = false;
    const loadCalls = async () => {
      setIsLoading(true);
      try {
        const { calls: fetched } = await client.queryCalls({
          sort: [{ field: 'starts_at', direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          },
        });
        if (!cancelled) setCalls(fetched);
      } catch (error) {
        console.error('[MeetingsDataProvider] queryCalls failed', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadCalls();
    return () => {
      cancelled = true;
    };
  }, [client, user?.id]);

  // Stream rate-limits aggressive fan-out. Cap the calls we ask recordings for
  // to the most recent N and batch them 5 at a time so we never have more than
  // a handful of in-flight requests.
  useEffect(() => {
    if (calls.length === 0) {
      setRecordings([]);
      return;
    }

    let cancelled = false;
    const loadRecordings = async () => {
      setIsLoadingRecordings(true);
      try {
        const candidates = calls.slice(0, RECORDING_CALL_CAP);
        const all: CallRecording[] = [];

        for (let i = 0; i < candidates.length; i += RECORDING_BATCH_SIZE) {
          if (cancelled) return;
          const batch = candidates.slice(i, i + RECORDING_BATCH_SIZE);
          const results = await Promise.all(
            batch.map((c) =>
              c.queryRecordings().catch((err) => {
                console.warn('[MeetingsDataProvider] queryRecordings failed', err);
                return { recordings: [] as CallRecording[] };
              }),
            ),
          );
          for (const r of results) all.push(...r.recordings);
        }

        if (!cancelled) setRecordings(all);
      } finally {
        if (!cancelled) setIsLoadingRecordings(false);
      }
    };

    loadRecordings();
    return () => {
      cancelled = true;
    };
  }, [calls]);

  const value = useMemo<MeetingsDataValue>(() => {
    const now = new Date();
    const endedCalls = calls.filter(({ state: { startsAt, endedAt } }) => {
      return (startsAt && new Date(startsAt) < now) || !!endedAt;
    });
    const upcomingCalls = calls.filter(({ state: { startsAt } }) => {
      return startsAt && new Date(startsAt) > now;
    });
    return {
      calls,
      upcomingCalls,
      endedCalls,
      callRecordings: calls,
      recordings,
      isLoading,
      isLoadingRecordings,
    };
  }, [calls, recordings, isLoading, isLoadingRecordings]);

  return (
    <MeetingsDataContext.Provider value={value}>
      {children}
    </MeetingsDataContext.Provider>
  );
};

export const useMeetingsData = (): MeetingsDataValue => {
  const ctx = useContext(MeetingsDataContext);
  if (ctx) return ctx;
  // Fallback for components rendered outside the provider (e.g. auth pages
  // or unit tests). Keeps the hook safe to call anywhere.
  return {
    calls: [],
    upcomingCalls: [],
    endedCalls: [],
    callRecordings: [],
    recordings: [],
    isLoading: false,
    isLoadingRecordings: false,
  };
};
