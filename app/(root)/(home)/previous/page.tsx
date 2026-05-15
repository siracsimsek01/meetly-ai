import { History } from 'lucide-react';

import CallList from '@/components/CallList';
import PageHeader from '@/components/PageHeader';

const Previous = () => {
  return (
    <section className="flex flex-col gap-8 pt-2 text-white">
      <PageHeader
        icon={History}
        eyebrow="History"
        title="Previous meetings"
        description="A quiet archive of the conversations you have already had."
      />
      <CallList type="ended" />
    </section>
  );
};

export default Previous;
