import { type Metadata } from 'next';
import { BLOG_PREFIX } from '@/config';
import { type Category } from '@/lib/db/schema/categories';
import { WithContext, Thing } from 'schema-dts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function generateCategorySchema(category: Category, slugs: string[]): WithContext<Thing> {
  return {
    '@type': 'Thing',
    '@context': 'https://schema.org',
  };
}

export function generateCategoryMetadata(category: Category, slugs: string[]): Metadata {
  const title = category.title;
  const description = category.seo_description ?? category.title;
  const canonicalPath = `/${BLOG_PREFIX}/${slugs.join('/')}`;

  const ogImage = category.og_image ?? undefined;
  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
