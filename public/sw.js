// Minimal service worker for Meetly AI — exists so the app meets PWA
// installability criteria. It handles the fetch event with a
// network-first-then-cache strategy for navigations and a stale-while-revalidate
// strategy for static assets.

const CACHE_NAME = 'meetly-v1';
const SHELL = ['/', '/icon.svg', '/images/logo.svg', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL).catch(() => {})),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never cache APIs, Stream coordinator, or Clerk endpoints.
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('stream-io') ||
    url.hostname.includes('clerk') ||
    url.pathname.startsWith('/_next/data/')
  ) {
    return;
  }

  // Network-first for HTML navigations so the app stays fresh.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(request);
          return cached || cache.match('/');
        }
      })(),
    );
    return;
  }

  // Stale-while-revalidate for everything else.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })(),
  );
});
