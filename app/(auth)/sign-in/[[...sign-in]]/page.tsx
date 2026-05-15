import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const SignInPage = () => {
  return (
    <main className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="absolute inset-6 -z-10 rounded-[40px] border border-white/5 bg-gradient-to-br from-mint-400/15 via-ink-900 to-coral-500/10" />
        <div className="absolute inset-6 -z-10 rounded-[40px] bg-noise opacity-30 mix-blend-overlay" />

        <Link href="/" className="flex items-center gap-2 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint-400 text-ink-950">
            <Sparkles className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">Meetly AI</span>
        </Link>

        <div className="max-w-xl space-y-6">
          <span className="pill pill-active">A new kind of meeting room</span>
          <h1 className="font-display text-5xl font-bold leading-[1.05] text-white">
            Quiet, focused video meetings — without the noise.
          </h1>
          <p className="text-lg text-muted-soft">
            Plan, host and record without leaving the flow. Meetly AI keeps the
            room calm, the calendar clear, and the recordings searchable.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['/images/avatar-1.jpeg', '/images/avatar-2.jpeg', '/images/avatar-3.png'].map(
                (a, i) => (
                  <Image
                    key={i}
                    src={a}
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full border-2 border-ink-900 object-cover"
                  />
                ),
              )}
            </div>
            <p className="text-sm text-muted-soft">
              Joined by 12k teams shipping every week.
            </p>
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          © Meetly AI 2026 — Designed with intent
        </p>
      </section>

      <section className="flex items-center justify-center p-6 lg:p-12">
        <SignIn />
      </section>
    </main>
  );
};

export default SignInPage;
