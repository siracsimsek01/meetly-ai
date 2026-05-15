'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[meetly] global error', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          background: '#06090A',
          color: '#ECEFEF',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 440,
            padding: 32,
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(14,20,22,0.9)',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            Meetly AI hit a critical error
          </h1>
          <p style={{ color: '#A6B0B3', fontSize: 14, marginBottom: 20 }}>
            The app failed to render. Please refresh — if it keeps happening,
            note the reference below and reach out.
          </p>
          {error.digest && (
            <code
              style={{
                display: 'inline-block',
                padding: '4px 10px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 999,
                fontSize: 11,
                color: '#7F8B8E',
                marginBottom: 20,
              }}
            >
              {error.digest}
            </code>
          )}
          <div>
            <button
              onClick={reset}
              style={{
                background: '#36F0B6',
                color: '#06090A',
                fontWeight: 600,
                padding: '10px 22px',
                borderRadius: 999,
                border: 0,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
