import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@clerk/nextjs/server';

import { MEETLY_SUMMARY_SYSTEM } from '@/lib/ai/system';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type SummaryRequest = {
  title?: string;
  note?: string;
};

const SUMMARY_SCHEMA = {
  type: 'object',
  properties: {
    tldr: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          heading: { type: 'string' },
          bullets: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['heading', 'bullets'],
        additionalProperties: false,
      },
    },
    decisions: {
      type: 'array',
      items: { type: 'string' },
    },
    actionItems: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          owner: { type: 'string' },
          task: { type: 'string' },
        },
        required: ['owner', 'task'],
        additionalProperties: false,
      },
    },
  },
  required: ['tldr', 'sections', 'decisions', 'actionItems'],
  additionalProperties: false,
} as const;

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

  let body: SummaryRequest;
  try {
    body = (await req.json()) as SummaryRequest;
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const title = (body.title ?? '').trim().slice(0, 200) || 'Recent meeting';
  const note = (body.note ?? '').trim().slice(0, 2000);

  const userContent =
    `Meeting title: ${title}` + (note ? `\n\nContext from the user:\n${note}` : '');

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1500,
      thinking: { type: 'adaptive' },
      output_config: {
        effort: 'medium',
        format: { type: 'json_schema', schema: SUMMARY_SCHEMA },
      },
      system: [
        {
          type: 'text',
          text: MEETLY_SUMMARY_SYSTEM,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userContent }],
    });

    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === 'text',
    );
    if (!textBlock) {
      return new Response(JSON.stringify({ error: 'no_content' }), {
        status: 502,
        headers: { 'content-type': 'application/json' },
      });
    }

    return new Response(textBlock.text, {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      return new Response(
        JSON.stringify({ error: 'anthropic_error', message: err.message, status: err.status }),
        {
          status: err.status >= 400 && err.status < 600 ? err.status : 502,
          headers: { 'content-type': 'application/json' },
        },
      );
    }
    const message = err instanceof Error ? err.message : 'unknown error';
    return new Response(JSON.stringify({ error: 'unknown', message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
