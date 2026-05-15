import {
  CalendarClock,
  CalendarRange,
  History,
  Home,
  PlaySquare,
  UserSquare2,
  type LucideIcon,
} from 'lucide-react';

export type NavLink = {
  label: string;
  route: string;
  icon: LucideIcon;
  section?: 'workspace' | 'you';
};

export const sidebarLinks: NavLink[] = [
  { label: 'Home', route: '/', icon: Home, section: 'workspace' },
  { label: 'Upcoming', route: '/upcoming', icon: CalendarClock, section: 'workspace' },
  { label: 'Schedule', route: '/schedule', icon: CalendarRange, section: 'workspace' },
  { label: 'Previous', route: '/previous', icon: History, section: 'workspace' },
  { label: 'Recordings', route: '/recordings', icon: PlaySquare, section: 'workspace' },
  { label: 'Personal Room', route: '/personal-room', icon: UserSquare2, section: 'you' },
];

export const avatarImages = [
  '/images/avatar-1.jpeg',
  '/images/avatar-2.jpeg',
  '/images/avatar-3.png',
  '/images/avatar-4.png',
  '/images/avatar-5.png',
];
