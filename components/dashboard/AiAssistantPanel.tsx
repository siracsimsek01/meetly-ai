'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { ArrowUp, Eraser, Loader2, Sparkles } from 'lucide-react';

import { aiPrompts } from '@/lib/mock/aiPrompts';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

type Role = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
};

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const AiAssistantPanel = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      const userMessage: ChatMessage = {
        id: newId(),
        role: 'user',
        content: trimmed,
      };
      const assistantId = newId();
      const history = [...messages, userMessage];

      setMessages([
        ...history,
        { id: assistantId, role: 'assistant', content: '' },
      ]);
      setPrompt('');
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const resp = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            messages: history.map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: controller.signal,
        });

        if (!resp.ok || !resp.body) {
          const detail = await resp.text().catch(() => '');
          throw new Error(detail || `Request failed (${resp.status})`);
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();

        let acc = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
          );
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          // user-initiated cancel
        } else {
          toast({
            title: 'Meetly AI is unavailable',
            description:
              err instanceof Error ? err.message : 'Something went wrong.',
          });
          setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, streaming, toast],
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    send(prompt);
  };

  const clear = () => {
    abortRef.current?.abort();
    setMessages([]);
  };

  return (
    <section className="relative flex flex-col overflow-hidden rounded-3xl border border-coral-500/20 bg-gradient-to-br from-coral-500/10 via-ink-850 to-mint-400/10">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-coral-500/20 blur-[80px]" />
      <div className="relative flex flex-col gap-4 p-5">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral-500/25 text-coral-400">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                Meetly AI
              </h3>
              <p className="text-xs text-muted-soft">
                Powered by Claude · ask for agendas, summaries, follow-ups.
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.04] px-3 py-1 text-[11px] text-muted-soft transition hover:text-white"
              aria-label="Clear conversation"
            >
              <Eraser className="h-3 w-3" /> Clear
            </button>
          )}
        </header>

        {messages.length === 0 ? (
          <div className="flex flex-wrap gap-2">
            {aiPrompts.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => send(p.label)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.04] px-3 py-1.5 text-xs text-white transition hover:border-mint-400/30 hover:bg-white/[0.07]"
                >
                  <Icon className="h-3 w-3 text-mint-300" /> {p.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="max-h-[260px] space-y-3 overflow-y-auto rounded-2xl border border-white/5 bg-ink-900/50 p-3"
          >
            {messages.map((m) => (
              <Bubble key={m.id} role={m.role}>
                {m.content || (m.role === 'assistant' && streaming ? '…' : '')}
              </Bubble>
            ))}
          </div>
        )}

        <form
          onSubmit={submit}
          className={cn(
            'flex items-center gap-2 rounded-full border border-white/5 bg-ink-900/80 px-3 py-2 transition',
            'focus-within:border-mint-400/40',
          )}
        >
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={streaming ? 'Meetly AI is thinking…' : 'Ask Meetly AI anything…'}
            disabled={streaming}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-muted focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || streaming}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-mint-400 text-ink-950 transition hover:bg-mint-300 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send"
          >
            {streaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

const Bubble = ({ role, children }: { role: Role; children: React.ReactNode }) => (
  <div
    className={cn(
      'max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
      role === 'user'
        ? 'ml-auto bg-mint-400/15 text-white'
        : 'mr-auto border border-white/5 bg-white/[0.03] text-muted-soft',
    )}
  >
    {children}
  </div>
);

export default AiAssistantPanel;
