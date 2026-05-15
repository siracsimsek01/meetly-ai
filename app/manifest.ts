import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Meetly AI',
    short_name: 'Meetly',
    description:
      'A focused video-meeting workspace with an in-product AI assistant.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#06090A',
    theme_color: '#36F0B6',
    categories: ['productivity', 'business', 'communication'],
    lang: 'en',
    dir: 'ltr',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/images/logo.svg',
        sizes: '256x256',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Start a meeting',
        short_name: 'New',
        description: 'Spin up an instant meeting room',
        url: '/?action=new',
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
      {
        name: 'Schedule',
        short_name: 'Schedule',
        description: 'Open the schedule calendar',
        url: '/schedule',
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
      {
        name: 'Recordings',
        short_name: 'Recordings',
        description: 'Browse your recordings',
        url: '/recordings',
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
    ],
  };
}
