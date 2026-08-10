import type { MetadataRoute } from 'next';
import { BLOG_PREFIX } from '@/config';
import getSitemapCategories from '@/lib/db/actions/get-sitemap-categories';
import getSitemapPosts from '@/lib/db/actions/get-sitemap-posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const lastModified = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms-and-conditions`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const [categoryRows, postRows] = await Promise.all([getSitemapCategories(), getSitemapPosts()]);

  const categoryPages: MetadataRoute.Sitemap = categoryRows.map((row) => ({
    url: `${siteUrl}/${BLOG_PREFIX}/${row.fullPath}`,
    lastModified: row.updatedAt ?? lastModified,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const postPages: MetadataRoute.Sitemap = postRows.map((row) => ({
    url: `${siteUrl}/${BLOG_PREFIX}/${row.fullPath}`,
    lastModified: row.updatedAt ?? lastModified,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}
