import { Metadata } from 'next';
import { ReactNode } from 'react';

import StreamVideoProvider from '@/providers/StreamClientProvider';
import { MeetingActionsProvider } from '@/providers/MeetingActionsProvider';
import { MeetingsDataProvider } from '@/providers/MeetingsDataProvider';
import { CommandPaletteProvider } from '@/providers/CommandPaletteProvider';

export const metadata: Metadata = {
  title: 'Meetly AI',
  description: 'Video meetings, calmer.',
  icons: {
    icon: '/images/logo.svg',
  },
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <StreamVideoProvider>
        <MeetingsDataProvider>
          <MeetingActionsProvider>
            <CommandPaletteProvider>{children}</CommandPaletteProvider>
          </MeetingActionsProvider>
        </MeetingsDataProvider>
      </StreamVideoProvider>
    </main>
  );
};

export default RootLayout;
