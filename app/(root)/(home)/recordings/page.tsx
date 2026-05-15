import { PlaySquare } from 'lucide-react';

import CallList from '@/components/CallList';
import PageHeader from '@/components/PageHeader';

const Recordings = () => {
  return (
    <section className="flex flex-col gap-8 pt-2 text-white">
      <PageHeader
        icon={PlaySquare}
        eyebrow="Library"
        title="Recordings"
        description="Replay, share or download anything you have recorded."
      />
      <CallList type="recordings" />
    </section>
  );
};

export default Recordings;
