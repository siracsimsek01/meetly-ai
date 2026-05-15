'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LifeBuoy, Settings, Sparkles } from 'lucide-react';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { useSidebarCollapse } from '@/hooks/useSidebarCollapse';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

import WorkspaceSwitcher from './sidebar/WorkspaceSwitcher';
import CommandTriggerButton from './sidebar/CommandTriggerButton';
import PinnedRooms from './sidebar/PinnedRooms';
import LiveIndicatorCard from './sidebar/LiveIndicatorCard';
import FocusModeToggle from './sidebar/FocusModeToggle';
import CollapseToggle from './sidebar/CollapseToggle';
import SectionLabel from './sidebar/SectionLabel';
import InstallAppButton from './InstallAppButton';

const Sidebar = () => {
  const pathname = usePathname();
  const { collapsed, toggle, mounted } = useSidebarCollapse();
  const { toast } = useToast();

  const workspaceLinks = sidebarLinks.filter((l) => l.section === 'workspace');
  const youLinks = sidebarLinks.filter((l) => l.section === 'you');

  const isCollapsed = mounted ? collapsed : false;

  const openSettings = () =>
    toast({
      title: 'Settings',
      description: 'Account preferences will land here. Coming soon.',
    });
  const openHelp = () =>
    toast({
      title: 'Help & shortcuts',
      description:
        'Press ⌘K to search, N to start, J to join, R for recordings, S for schedule.',
    });

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col justify-between gap-4 px-3 py-6 transition-[width] sm:flex',
        isCollapsed ? 'w-[88px] items-center' : 'w-[272px] items-stretch px-4',
      )}
    >
      <div className="flex w-full flex-col gap-4">
        <Link
          href="/"
          className={cn(
            'group flex items-center gap-3',
            isCollapsed ? 'justify-center' : 'px-1',
          )}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint-400 text-ink-950 shadow-[0_15px_40px_-15px_rgba(54,240,182,0.7)] transition group-hover:rotate-6">
            <Sparkles className="h-5 w-5" strokeWidth={2.6} />
          </span>
          {!isCollapsed && (
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Meetly AI
            </span>
          )}
        </Link>

        <WorkspaceSwitcher collapsed={isCollapsed} />
        <CommandTriggerButton collapsed={isCollapsed} />

        <SectionLabel label="Workspace" collapsed={isCollapsed} />
        <NavList
          links={workspaceLinks}
          pathname={pathname}
          collapsed={isCollapsed}
        />

        <SectionLabel label="Pinned" collapsed={isCollapsed} />
        <PinnedRooms collapsed={isCollapsed} />

        <SectionLabel label="You" collapsed={isCollapsed} />
        <NavList links={youLinks} pathname={pathname} collapsed={isCollapsed} />
      </div>

      <div className="flex w-full flex-col gap-3">
        <Separator />
        <LiveIndicatorCard collapsed={isCollapsed} />
        <InstallAppButton collapsed={isCollapsed} />
        <FocusModeToggle collapsed={isCollapsed} />

        <div
          className={cn(
            'flex items-center gap-2',
            isCollapsed ? 'flex-col' : 'justify-between',
          )}
        >
          {isCollapsed ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={openSettings}
                    className="icon-btn"
                    aria-label="Settings"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={openHelp}
                    className="icon-btn"
                    aria-label="Help"
                  >
                    <LifeBuoy className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Help</TooltipContent>
              </Tooltip>
            </>
          ) : (
            <div className="flex gap-3 text-xs text-muted">
              <button
                onClick={openSettings}
                className="inline-flex items-center gap-2 transition hover:text-white"
              >
                <Settings className="h-4 w-4" /> Settings
              </button>
              <button
                onClick={openHelp}
                className="inline-flex items-center gap-2 transition hover:text-white"
              >
                <LifeBuoy className="h-4 w-4" /> Help
              </button>
            </div>
          )}
          <CollapseToggle collapsed={isCollapsed} onToggle={toggle} />
        </div>
      </div>
    </aside>
  );
};

const NavList = ({
  links,
  pathname,
  collapsed,
}: {
  links: typeof sidebarLinks;
  pathname: string;
  collapsed: boolean;
}) => (
  <nav
    className={cn(
      'flex flex-col gap-1',
      collapsed ? 'items-center' : 'items-stretch',
    )}
  >
    {links.map((link) => {
      const Icon = link.icon;
      const isActive =
        pathname === link.route ||
        (link.route !== '/' && pathname.startsWith(`${link.route}/`));

      const button = (
        <Link
          href={link.route}
          className={cn(
            'group relative flex items-center transition',
            collapsed
              ? 'h-10 w-10 justify-center rounded-2xl'
              : 'h-10 w-full justify-start gap-3 rounded-2xl px-3',
            isActive
              ? 'bg-mint-400/15 text-mint-300'
              : 'text-muted-soft hover:bg-white/[0.04] hover:text-white',
          )}
          aria-label={link.label}
        >
          {isActive && !collapsed && (
            <span className="absolute left-0 h-5 w-1 -translate-x-1.5 rounded-r-full bg-mint-400" />
          )}
          <Icon
            className="h-[18px] w-[18px]"
            strokeWidth={isActive ? 2.4 : 1.8}
          />
          {!collapsed && (
            <span className="text-sm font-medium">{link.label}</span>
          )}
        </Link>
      );

      if (!collapsed) return <div key={link.route}>{button}</div>;

      return (
        <Tooltip key={link.route}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">{link.label}</TooltipContent>
        </Tooltip>
      );
    })}
  </nav>
);

export default Sidebar;
