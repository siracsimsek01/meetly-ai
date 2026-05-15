import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="surface-panel relative max-w-md overflow-hidden p-8 text-center">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-mint-400/15 blur-[90px]" />
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-400/15 text-mint-300">
          <Compass className="h-5 w-5" />
        </span>
        <p className="mt-5 text-xs uppercase tracking-[0.28em] text-muted">
          404 · Page not found
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-white">
          This room doesn&apos;t exist
        </h1>
        <p className="mt-2 text-sm text-muted-soft">
          The page you&apos;re looking for moved or never existed. Head back to
          your dashboard.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-mint-400 px-5 text-sm font-semibold text-ink-950 transition hover:bg-mint-300"
        >
          <Home className="h-4 w-4" /> Back to dashboard
        </Link>
      </div>
    </main>
  );
}
