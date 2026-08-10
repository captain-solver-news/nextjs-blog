import { type Metadata } from 'next';
import { BLOG_PREFIX } from '@/config';
import { type Post } from '@/lib/db/schema/posts';
import { WithContext, Thing } from 'schema-dts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function generatePostSchema(post: Post, slugs: string[]): WithContext<Thing> {
  return {
    '@type': 'Thing',
    '@context': 'https://schema.org',
  };
}

export function generatePostMetadata(post: Post, slugs: string[]): Metadata {
  const title = post.title;
  const description = post.seo_description ?? post.teaser;
  const canonicalPath = `/${BLOG_PREFIX}/${slugs.join('/')}`;

  const ogImage = post.og_image ?? undefined;
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
