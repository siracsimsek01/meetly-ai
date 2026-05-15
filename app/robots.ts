import type { MetadataRoute } from 'next';

const baseUrl =
  (process.env.NEXT_PUBLIC_BASE_URL?.startsWith('http')
    ? process.env.NEXT_PUBLIC_BASE_URL
    : process.env.NEXT_PUBLIC_BASE_URL
      ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
      : 'https://meetly.app');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/sign-in', '/sign-up'],
        disallow: ['/meeting/', '/personal-room', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
