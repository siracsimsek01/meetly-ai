import { Metadata } from 'next';
import { ReactNode } from 'react';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Meetly AI',
  description: 'A modern, focused space for video meetings.',
  icons: {
    icon: '/images/logo.svg',
  },
};

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 px-4 pb-10 sm:px-6 lg:px-8">
        <Navbar />
        <div className="mx-auto w-full max-w-7xl pt-2">{children}</div>
      </main>
    </div>
  );
};

export default HomeLayout;
