import { type Metadata } from 'next';
import { AUTHOR_PREFIX } from '@/config';
import { type Author } from '@/lib/db/schema/authors';
import { WithContext, Person } from 'schema-dts';

const DESCRIPTION_LIMIT = 160;

function truncate(value: string, limit = DESCRIPTION_LIMIT): string {
  if (value.length <= limit) return value;

  return `${value.slice(0, value.lastIndexOf(' ', limit) || limit).trimEnd()}…`;
}

function authorDescription(author: Author): string {
  return truncate(author.bio ?? `${author.name} — ${author.job_title}.`);
}

export function generateAuthorSchema(author: Author): WithContext<Person> {
  const siteUrl = process.env.PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const sameAs = [author.github_url, author.linkedin_url].filter((url): url is string => Boolean(url));
  const image = author.avatar_dark_url ?? author.mini_avatar_url;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.job_title,
    url: `${siteUrl}/${AUTHOR_PREFIX}/${author.slug}`,
    ...(author.bio ? { description: author.bio } : {}),
    ...(image ? { image: `${siteUrl}${image}` } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function generateAuthorMetadata(author: Author): Metadata {
  const title = author.name;
  const description = authorDescription(author);
  const canonicalPath = `/${AUTHOR_PREFIX}/${author.slug}`;

  const ogImage = author.avatar_dark_url ?? undefined;
  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'profile',
      title,
      description,
      url: canonicalPath,
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
