'use client';

import { useMemo } from 'react';

import MeetingTypeList from '@/components/MeetingTypeList';
import HeroPanel from '@/components/dashboard/HeroPanel';
import QuickActionsRow from '@/components/dashboard/QuickActionsRow';
import TodaysAgenda from '@/components/dashboard/TodaysAgenda';
import MiniCalendar from '@/components/dashboard/MiniCalendar';
import StatsKpis from '@/components/dashboard/StatsKpis';
import RecentRecordingsStrip from '@/components/dashboard/RecentRecordingsStrip';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import TeamPresence from '@/components/dashboard/TeamPresence';
import AiAssistantPanel from '@/components/dashboard/AiAssistantPanel';
import {
  HeroSkeleton,
  KpisSkeleton,
  QuickActionsSkeleton,
} from '@/components/dashboard/DashboardSkeleton';
import { useGetCalls } from '@/hooks/useGetCalls';
import { mergeAgenda } from '@/lib/mock/agenda';
import { team } from '@/lib/mock/team';

const Home = () => {
  const { upcomingCalls, isLoading } = useGetCalls();
  const agenda = useMemo(() => mergeAgenda(upcomingCalls), [upcomingCalls]);
  const teammatesOnline = useMemo(
    () => team.filter((t) => t.status === 'online').length,
    [],
  );

  const nextMeeting = agenda[0];
  const totalToday = agenda.filter((m) => {
    const today = new Date();
    return (
      m.start.getDate() === today.getDate() &&
      m.start.getMonth() === today.getMonth() &&
      m.start.getFullYear() === today.getFullYear()
    );
  }).length;

  return (
    <section className="flex flex-col gap-6 pb-10 text-white">
      {isLoading ? (
        <HeroSkeleton />
      ) : (
        <HeroPanel
          nextMeeting={nextMeeting}
          totalToday={totalToday}
          teammatesOnline={teammatesOnline}
        />
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">
              Quick actions
            </h2>
            <p className="text-xs text-muted-soft">
              The fastest ways back into a room.
            </p>
          </div>
        </div>
        {isLoading ? <QuickActionsSkeleton /> : <QuickActionsRow />}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">
              Start something
            </h2>
            <p className="text-xs text-muted-soft">
              Four ways to begin. Pick the one that fits your moment.
            </p>
          </div>
        </div>
        <MeetingTypeList />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="flex flex-col gap-5 xl:col-span-8">
          <TodaysAgenda />
          {isLoading ? <KpisSkeleton /> : <StatsKpis />}
          <RecentRecordingsStrip />
          <ActivityFeed />
        </div>

        <aside className="flex flex-col gap-5 xl:col-span-4">
          <MiniCalendar />
          <TeamPresence />
          <AiAssistantPanel />
        </aside>
      </div>
    </section>
  );
};

export default Home;
