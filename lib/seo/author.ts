import { type Metadata } from 'next';
import { AUTHOR_PREFIX } from '@/config';
import type { Author } from '@/lib/actions/types/author';
import { WithContext, Person } from 'schema-dts';

const DESCRIPTION_LIMIT = 160;

function truncate(value: string, limit = DESCRIPTION_LIMIT): string {
  if (value.length <= limit) return value;

  return `${value.slice(0, value.lastIndexOf(' ', limit) || limit).trimEnd()}…`;
}

function authorDescription(author: Author): string {
  return truncate(author.bio ?? `${author.name} — ${author.jobTitle}.`);
}

export function generateAuthorSchema(author: Author): WithContext<Person> {
  const siteUrl = process.env.PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const sameAs = [author.githubUrl, author.linkedinUrl].filter((url): url is string => Boolean(url));
  const image = author.avatarDarkUrl ?? author.miniAvatarUrl;
  const imageUrl = image ? new URL(image, siteUrl).toString() : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.jobTitle,
    url: `${siteUrl}/${AUTHOR_PREFIX}/${author.slug}`,
    ...(author.bio ? { description: author.bio } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function generateAuthorMetadata(author: Author): Metadata {
  const title = author.name;
  const description = authorDescription(author);
  const canonicalPath = `/${AUTHOR_PREFIX}/${author.slug}`;

  const ogImage = author.avatarDarkUrl ?? undefined;
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
