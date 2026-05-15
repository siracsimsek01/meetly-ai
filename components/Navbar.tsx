'use client';

import { SignedIn, UserButton } from '@clerk/nextjs';
import { Search } from 'lucide-react';

import MobileNav from './MobileNav';
import NotificationsButton from './NotificationsButton';
import { useCommandPalette } from '@/hooks/useCommandPalette';

const Navbar = () => {
  const palette = useCommandPalette();

  return (
    <header className="sticky top-0 z-40 -mx-4 mb-4 flex items-center gap-3 border-b border-white/5 bg-ink-950/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <MobileNav />

      <div className="flex w-full items-center gap-3">
        <button
          type="button"
          onClick={palette.toggle}
          className="hidden flex-1 items-center gap-2 rounded-full border border-white/5 bg-ink-800 px-4 py-2.5 text-left text-sm text-muted-soft transition hover:border-mint-400/30 hover:bg-ink-700 hover:text-white md:flex"
        >
          <Search className="h-4 w-4 text-muted" />
          <span className="flex-1 truncate">
            Search meetings, people, recordings…
          </span>
          <kbd className="hidden rounded border border-white/10 bg-ink-700 px-1.5 py-0.5 text-[10px] text-muted-soft md:inline">
            ⌘K
          </kbd>
        </button>
        <h1 className="font-display text-lg font-semibold text-white md:hidden">
          Meetly AI
        </h1>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={palette.toggle}
            className="icon-btn md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <NotificationsButton />

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  rootBox: 'flex items-center',
                  userButtonBox:
                    'rounded-full border border-white/10 bg-ink-800 hover:border-mint-400/30 transition',
                  userButtonTrigger:
                    'rounded-full focus:shadow-none focus-visible:ring-2 focus-visible:ring-mint-400/40',
                  avatarBox: 'h-9 w-9',
                  avatarImage: 'object-cover',
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
