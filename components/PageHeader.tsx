import { type LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
}

const PageHeader = ({
  icon: Icon,
  eyebrow,
  title,
  description,
}: PageHeaderProps) => {
  return (
    <header className="flex flex-col gap-4">
      <span className="pill w-fit">
        <Icon className="h-3.5 w-3.5 text-mint-300" />
        {eyebrow}
      </span>
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-base text-muted-soft">{description}</p>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
