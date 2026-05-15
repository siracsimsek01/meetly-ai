'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarPlus,
  LinkIcon,
  Moon,
  PlaySquare,
  Sparkles,
  Video,
} from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { sidebarLinks } from '@/constants';
import { useGetCalls } from '@/hooks/useGetCalls';
import { useCallRecordings } from '@/hooks/useCallRecordings';
import { useMeetingActions } from '@/providers/MeetingActionsProvider';
import { useFocusMode } from '@/providers/FocusModeProvider';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { formatRelative } from '@/lib/format';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const router = useRouter();
  const { upcomingCalls, endedCalls } = useGetCalls();
  const { recordings } = useCallRecordings();
  const meetingActions = useMeetingActions();
  const { toggle: toggleFocus } = useFocusMode();
  const { workspaces, active, setActive } = useWorkspace();

  const close = () => onOpenChange(false);

  const meetings = useMemo(() => {
    const upcoming = (upcomingCalls ?? []).slice(0, 5).map((c) => ({
      id: c.id,
      title:
        (c.state.custom?.description as string | undefined) ?? 'Untitled meeting',
      when: c.state.startsAt ? formatRelative(new Date(c.state.startsAt)) : '',
      status: 'upcoming' as const,
    }));
    const past = (endedCalls ?? []).slice(0, 5).map((c) => ({
      id: c.id,
      title:
        (c.state.custom?.description as string | undefined) ?? 'Untitled meeting',
      when: c.state.startsAt ? formatRelative(new Date(c.state.startsAt)) : '',
      status: 'past' as const,
    }));
    return [...upcoming, ...past];
  }, [upcomingCalls, endedCalls]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search meetings, recordings, pages or actions…" />
      <CommandList>
        <CommandEmpty>No matches. Try a different keyword.</CommandEmpty>

        <CommandGroup heading="Quick actions">
          <CommandItem
            onSelect={() => {
              close();
              meetingActions.openNew();
            }}
          >
            <Sparkles className="text-mint-300" />
            <span>Start a new meeting</span>
            <CommandShortcut>N</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              close();
              meetingActions.openJoin();
            }}
          >
            <LinkIcon className="text-mint-300" />
            <span>Join with link</span>
            <CommandShortcut>J</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              close();
              meetingActions.openSchedule();
            }}
          >
            <CalendarPlus className="text-mint-300" />
            <span>Schedule a meeting</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              close();
              router.push('/recordings');
            }}
          >
            <PlaySquare className="text-mint-300" />
            <span>Open recordings</span>
            <CommandShortcut>R</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              close();
              toggleFocus();
            }}
          >
            <Moon className="text-mint-300" />
            <span>Toggle focus mode</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Pages">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <CommandItem
                key={link.route}
                onSelect={() => {
                  close();
                  router.push(link.route);
                }}
              >
                <Icon className="text-muted-soft" />
                <span>{link.label}</span>
              </CommandItem>
            );
          })}
          <CommandItem
            onSelect={() => {
              close();
              router.push('/schedule');
            }}
          >
            <CalendarPlus className="text-muted-soft" />
            <span>Schedule</span>
            <CommandShortcut>S</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        {meetings.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Meetings">
              {meetings.map((m) => (
                <CommandItem
                  key={`${m.status}-${m.id}`}
                  onSelect={() => {
                    close();
                    router.push(`/meeting/${m.id}`);
                  }}
                >
                  <Video
                    className={
                      m.status === 'upcoming' ? 'text-mint-300' : 'text-muted-soft'
                    }
                  />
                  <div className="flex flex-col">
                    <span>{m.title}</span>
                    <span className="text-xs text-muted">{m.when}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {recordings.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recordings">
              {recordings.slice(0, 5).map((r) => (
                <CommandItem
                  key={r.url}
                  onSelect={() => {
                    close();
                    router.push(r.url);
                  }}
                >
                  <PlaySquare className="text-amber-400" />
                  <span>{r.filename?.substring(0, 40) || 'Recording'}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />

        <CommandGroup heading="Workspaces">
          {workspaces.map((w) => (
            <CommandItem
              key={w.id}
              onSelect={() => {
                close();
                setActive(w.id);
              }}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-semibold ${
                  w.accent === 'mint'
                    ? 'bg-mint-400/20 text-mint-300'
                    : w.accent === 'coral'
                      ? 'bg-coral-500/20 text-coral-400'
                      : 'bg-amber-400/20 text-amber-400'
                }`}
              >
                {w.initial}
              </span>
              <span>{w.name}</span>
              {w.id === active.id && (
                <span className="ml-auto text-xs text-mint-300">Current</span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
