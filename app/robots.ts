import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.PUBLIC_SITE_URL;

  return {
    host: siteUrl,
    sitemap: `${siteUrl}/sitemap.xml`,
    rules: {
      userAgent: '*',
      allow: '/',
    },
  };
}
