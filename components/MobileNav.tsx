'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Sparkles } from 'lucide-react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { pinnedRooms } from '@/lib/mock/pinnedRooms';

const dotColor: Record<string, string> = {
  mint: 'bg-mint-400',
  coral: 'bg-coral-500',
  amber: 'bg-amber-400',
};

const MobileNav = () => {
  const pathname = usePathname();
  const workspaceLinks = sidebarLinks.filter((l) => l.section === 'workspace');
  const youLinks = sidebarLinks.filter((l) => l.section === 'you');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="icon-btn sm:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] border-none bg-ink-900/95 p-0 text-white backdrop-blur-2xl"
      >
        <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint-400 text-ink-950">
              <Sparkles className="h-5 w-5" strokeWidth={2.6} />
            </span>
            <span className="font-display text-xl font-bold tracking-tight">
              Meetly AI
            </span>
          </Link>

          <div>
            <p className="mb-2 px-3 text-[10px] uppercase tracking-[0.24em] text-muted">
              Workspace
            </p>
            <nav className="flex flex-col gap-1">
              {workspaceLinks.map((link) => (
                <SheetItem
                  key={link.route}
                  href={link.route}
                  label={link.label}
                  icon={link.icon}
                  isActive={pathname === link.route}
                />
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-2 px-3 text-[10px] uppercase tracking-[0.24em] text-muted">
              Pinned
            </p>
            <div className="flex flex-col gap-0.5">
              {pinnedRooms.map((r) => (
                <SheetClose asChild key={r.id}>
                  <Link
                    href={r.href}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-muted-soft transition hover:bg-white/[0.04] hover:text-white"
                  >
                    <span
                      className={cn('h-2 w-2 rounded-full', dotColor[r.color])}
                    />
                    <span>{r.name}</span>
                  </Link>
                </SheetClose>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 px-3 text-[10px] uppercase tracking-[0.24em] text-muted">
              You
            </p>
            <nav className="flex flex-col gap-1">
              {youLinks.map((link) => (
                <SheetItem
                  key={link.route}
                  href={link.route}
                  label={link.label}
                  icon={link.icon}
                  isActive={pathname === link.route}
                />
              ))}
            </nav>
          </div>

          <div className="mt-auto rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-xs text-muted-soft">
            Designed for distraction-free meetings. Built on Stream &amp; Clerk.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const SheetItem = ({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: typeof Menu;
  isActive: boolean;
}) => (
  <SheetClose asChild>
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition',
        isActive
          ? 'bg-mint-400/15 text-mint-200'
          : 'text-muted-soft hover:bg-white/[0.04] hover:text-white',
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 1.8} />
      {label}
    </Link>
  </SheetClose>
);

export default MobileNav;
