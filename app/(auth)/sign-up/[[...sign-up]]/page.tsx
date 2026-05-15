import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const SignUpPage = () => {
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
          <span className="pill pill-active">Get started in seconds</span>
          <h1 className="font-display text-5xl font-bold leading-[1.05] text-white">
            Bring your team into the calmest room online.
          </h1>
          <p className="text-lg text-muted-soft">
            Create your workspace, invite a few teammates, and host your first
            distraction-free meeting in under a minute.
          </p>
          <ul className="space-y-3 text-sm text-muted-soft">
            {[
              'Polls, checklists & chat — built in',
              'Auto-saved recordings with searchable transcripts',
              'Designed-by-default rooms with smart layouts',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint-400/20 text-mint-300">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          © Meetly AI 2026 — Designed with intent
        </p>
      </section>

      <section className="flex items-center justify-center p-6 lg:p-12">
        <SignUp />
      </section>
    </main>
  );
};

export default SignUpPage;
