/**
 * Resolves the canonical app origin (with protocol) at runtime.
 *
 * Order of preference:
 *  1. `NEXT_PUBLIC_BASE_URL` — set on Vercel + .env.local. May or may not
 *     include a protocol; we always normalize to https://.
 *  2. `window.location.origin` — only in the browser, used as a last-resort
 *     fallback so links work on preview deploys where the env var wasn't set.
 *  3. `''` — empty string. Callers should treat this as "use a relative path".
 *
 * Keeping the protocol logic in one place means rebranding to a new domain is
 * a single env-var change, not a code change.
 */
export const getAppOrigin = (): string => {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (raw) {
    return raw.startsWith('http://') || raw.startsWith('https://')
      ? raw.replace(/\/$/, '')
      : `https://${raw.replace(/\/$/, '')}`;
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

/** Build a clickable meeting link, e.g. `https://meetly-ai-uk.vercel.app/meeting/abc?personal=true`. */
export const meetingLink = (
  id: string,
  opts: { personal?: boolean } = {},
): string => {
  const base = getAppOrigin();
  const query = opts.personal ? '?personal=true' : '';
  return `${base}/meeting/${id}${query}`;
};
