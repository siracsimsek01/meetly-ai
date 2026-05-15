import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@clerk/nextjs/server';

import { MEETLY_ASSISTANT_SYSTEM } from '@/lib/ai/system';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatRequest = {
  messages: ChatMessage[];
};

const isChatMessage = (v: unknown): v is ChatMessage =>
  typeof v === 'object' &&
  v !== null &&
  (('role' in v && ((v as ChatMessage).role === 'user' || (v as ChatMessage).role === 'assistant'))) &&
  'content' in v &&
  typeof (v as ChatMessage).content === 'string';

const sanitize = (messages: unknown): ChatMessage[] => {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(isChatMessage)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, 8_000),
    }))
    .slice(-20);
};

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'anthropic_not_configured' }), {
      status: 503,
      headers: { 'content-type': 'application/json' },
    });
  }

  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const messages = sanitize(body.messages);
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return new Response(JSON.stringify({ error: 'messages_required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const client = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const llmStream = client.messages.stream({
          model: 'claude-opus-4-7',
          max_tokens: 1024,
          thinking: { type: 'adaptive' },
          output_config: { effort: 'low' },
          system: [
            {
              type: 'text',
              text: MEETLY_ASSISTANT_SYSTEM,
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages,
        });

        for await (const event of llmStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        controller.close();
      } catch (err) {
        const message =
          err instanceof Anthropic.APIError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'unknown error';
        controller.enqueue(encoder.encode(`\n\n[error] ${message}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      'x-content-type-options': 'nosniff',
    },
  });
}
