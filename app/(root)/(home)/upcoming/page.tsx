import { CalendarClock } from 'lucide-react';

import CallList from '@/components/CallList';
import PageHeader from '@/components/PageHeader';

const Upcoming = () => {
  return (
    <section className="flex flex-col gap-8 pt-2 text-white">
      <PageHeader
        icon={CalendarClock}
        eyebrow="Schedule"
        title="Upcoming meetings"
        description="Everything you have lined up. Join early to test devices."
      />
      <CallList type="upcoming" />
    </section>
  );
};

export default Upcoming;
