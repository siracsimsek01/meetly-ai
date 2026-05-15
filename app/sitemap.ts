import type { MetadataRoute } from 'next';

const baseUrl =
  (process.env.NEXT_PUBLIC_BASE_URL?.startsWith('http')
    ? process.env.NEXT_PUBLIC_BASE_URL
    : process.env.NEXT_PUBLIC_BASE_URL
      ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
      : 'https://meetly.app');

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/sign-in`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/sign-up`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
