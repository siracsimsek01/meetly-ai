'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';

import Loader from '@/components/Loader';
import { tokenProvider } from '@/actions/stream.actions';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (!apiKey) throw new Error('Stream API key is missing');

    // Constructing the Stream client kicks off `connectUser`, which calls
    // a Next.js server action via our `tokenProvider`. That transition must
    // not happen during render — keep it inside the effect.
    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user.id,
        name: user.username || user.id,
        image: user.imageUrl,
      },
      tokenProvider,
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVideoClient(client);

    return () => {
      client.disconnectUser();
    };
  }, [isLoaded, user]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
