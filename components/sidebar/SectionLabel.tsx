import { cn } from '@/lib/utils';

interface SectionLabelProps {
  label: string;
  collapsed?: boolean;
}

const SectionLabel = ({ label, collapsed }: SectionLabelProps) => {
  if (collapsed) return <div className="my-2 h-px bg-white/5" />;
  return (
    <p
      className={cn(
        'mt-4 px-3 text-[10px] uppercase tracking-[0.24em] text-muted',
      )}
    >
      {label}
    </p>
  );
};

export default SectionLabel;
