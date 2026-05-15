'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RotateCcw, TriangleAlert } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Surface to monitoring later — for now, console only.
    console.error('[meetly] route error', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="surface-panel relative max-w-md overflow-hidden p-8 text-center">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-coral-500/15 blur-[80px]" />
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-500/15 text-coral-400">
          <TriangleAlert className="h-5 w-5" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-white">
          Something went sideways
        </h1>
        <p className="mt-2 text-sm text-muted-soft">
          We hit an unexpected error rendering this page. Try again, or head
          back to the dashboard.
        </p>
        {error.digest && (
          <p className="mt-3 inline-flex rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-muted">
            ref · {error.digest}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={reset}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-mint-400 px-5 text-sm font-semibold text-ink-950 transition hover:bg-mint-300"
          >
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/5 bg-white/[0.04] px-5 text-sm text-white transition hover:bg-white/[0.07]"
          >
            <Home className="h-4 w-4" /> Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
