'use client';

import { useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Download,
  Lightbulb,
  ListChecks,
  Sparkles,
} from 'lucide-react';
import type { Call } from '@stream-io/video-react-sdk';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useGetCalls } from '@/hooks/useGetCalls';
import {
  renderSummaryMarkdown,
  type GeneratedSummary,
} from '@/lib/mock/summary';
import { cn } from '@/lib/utils';

interface SummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const titleFor = (c: Call | undefined): string => {
  if (!c) return 'Recent meeting';
  return (
    (c.state.custom?.description as string | undefined) ?? 'Recent meeting'
  );
};

const SummaryDialog = ({ open, onOpenChange }: SummaryDialogProps) => {
  const { endedCalls } = useGetCalls();
  const candidates = useMemo(
    () => (endedCalls ?? []).slice(0, 5),
    [endedCalls],
  );
  const fallback = ['Q2 strategy sync', '1:1 with Mei', 'Apollo standup'];

  const [selected, setSelected] = useState<string | null>(null);
  const [summary, setSummary] = useState<GeneratedSummary | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const abortRef = useRef<AbortController | null>(null);
  const progressTimerRef = useRef<number | null>(null);

  const stopProgress = () => {
    if (progressTimerRef.current !== null) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      abortRef.current?.abort();
      abortRef.current = null;
      stopProgress();
      setSelected(null);
      setSummary(null);
      setProgress(0);
      setStreaming(false);
    }
    onOpenChange(next);
  };

  const pickedTitle = useMemo(() => {
    if (!selected) return '';
    const real = candidates.find((c) => c.id === selected);
    return real ? titleFor(real) : selected;
  }, [selected, candidates]);

  const generate = async (id: string, title: string) => {
    abortRef.current?.abort();
    stopProgress();

    setSelected(id);
    setSummary(null);
    setProgress(5);
    setStreaming(true);

    // Cosmetic progress bar — capped at 92% until the request resolves.
    progressTimerRef.current = window.setInterval(() => {
      setProgress((p) => (p < 92 ? Math.min(92, p + 4) : p));
    }, 250);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const resp = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        const detail = await resp.text().catch(() => '');
        throw new Error(detail || `Request failed (${resp.status})`);
      }

      const raw = await resp.text();
      const parsed = JSON.parse(raw) as GeneratedSummary;
      setSummary(parsed);
      setProgress(100);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      toast({
        title: 'Could not generate summary',
        description: err instanceof Error ? err.message : 'Try again.',
      });
      setSelected(null);
    } finally {
      stopProgress();
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const copy = () => {
    if (!summary) return;
    const md = renderSummaryMarkdown(pickedTitle, summary);
    navigator.clipboard.writeText(md);
    toast({ title: 'Copied as markdown' });
  };

  const download = () => {
    if (!summary) return;
    const md = renderSummaryMarkdown(pickedTitle, summary);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pickedTitle.toLowerCase().replace(/\s+/g, '-')}-summary.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-[92vw] max-w-[720px] flex-col gap-5 overflow-hidden rounded-3xl border border-white/5 bg-ink-850/95 p-6 text-white backdrop-blur-2xl">
        <header className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint-400/15 text-mint-300">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <DialogTitle className="font-display text-xl font-semibold">
              Generate meeting summary
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-soft">
              Pick a recent session — Meetly AI distills it into a TL;DR,
              decisions, and action items.
            </DialogDescription>
          </div>
        </header>

        {!selected && (
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted">
              Recent meetings
            </p>
            <div className="flex flex-col gap-2">
              {candidates.map((c) => (
                <button
                  key={c.id}
                  onClick={() => generate(c.id, titleFor(c))}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-left transition hover:border-mint-400/30"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {titleFor(c)}
                    </span>
                    <span className="text-xs text-muted-soft">
                      {c.state.startsAt
                        ? new Date(c.state.startsAt).toLocaleString()
                        : 'No date'}
                    </span>
                  </div>
                  <span className="pill pill-active">Summarize →</span>
                </button>
              ))}
              {candidates.length === 0 &&
                fallback.map((title) => (
                  <button
                    key={title}
                    onClick={() => generate(`mock-${title}`, title)}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-left transition hover:border-mint-400/30"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {title}
                      </span>
                      <span className="text-xs text-muted-soft">Mock example</span>
                    </div>
                    <span className="pill pill-active">Summarize →</span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {selected && (
          <div className="flex flex-col gap-4 overflow-hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted">
                  Summary for
                </p>
                <p className="font-display text-base font-semibold">
                  {pickedTitle}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelected(null);
                  setSummary(null);
                }}
                className="pill transition hover:border-white/15 hover:text-white"
              >
                Pick another
              </button>
            </div>

            {streaming && (
              <div className="space-y-2 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-xs text-muted-soft">
                  <span className="h-2 w-2 animate-pulse-soft rounded-full bg-mint-400" />
                  Meetly AI is reading the transcript…
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full bg-mint-400 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {summary && !streaming && (
              <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                <p className="rounded-2xl border border-mint-400/20 bg-mint-400/5 p-4 text-sm leading-relaxed text-white">
                  {summary.tldr}
                </p>

                {summary.sections.map((sec) => (
                  <SummaryBlock
                    key={sec.heading}
                    icon={Lightbulb}
                    heading={sec.heading}
                  >
                    <ul className="space-y-2">
                      {sec.bullets.map((b, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-soft"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-400" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </SummaryBlock>
                ))}

                <SummaryBlock icon={CheckCircle2} heading="Decisions">
                  <ul className="space-y-2">
                    {summary.decisions.map((d, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-soft"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint-300" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </SummaryBlock>

                <SummaryBlock icon={ListChecks} heading="Action items">
                  <ul className="space-y-2">
                    {summary.actionItems.map((a, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-2"
                      >
                        <span className="rounded-full bg-coral-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-coral-400">
                          {a.owner}
                        </span>
                        <span className="text-sm text-muted-soft">{a.task}</span>
                      </li>
                    ))}
                  </ul>
                </SummaryBlock>
              </div>
            )}

            {summary && (
              <div className="flex justify-end gap-2 border-t border-white/5 pt-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={copy}
                  className="rounded-full"
                >
                  <Copy className="h-4 w-4" /> Copy markdown
                </Button>
                <Button size="sm" onClick={download} className="rounded-full">
                  <Download className="h-4 w-4" /> Download .md
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const SummaryBlock = ({
  icon: Icon,
  heading,
  children,
}: {
  icon: typeof Lightbulb;
  heading: string;
  children: React.ReactNode;
}) => (
  <section className={cn('rounded-2xl border border-white/5 bg-white/[0.02] p-4')}>
    <header className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-soft">
      <Icon className="h-3.5 w-3.5 text-mint-300" />
      {heading}
    </header>
    {children}
  </section>
);

export default SummaryDialog;
