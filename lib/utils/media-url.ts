import { sql, type SQL } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import { authors, categories, media, posts } from '@/lib/payload/generated-schema';
import type { Media } from '@/lib/actions/types/media';
import rowJson from './row-json';

export default function mediaUrl(column: PgColumn): SQL<string | null> {
  return sql<string | null>`(SELECT ${media.url} FROM ${media} WHERE ${media.id} = ${column})`;
}

export function mediaJson(column: PgColumn): SQL<Media | null> {
  return sql<Media | null>`(SELECT ${rowJson(media)} FROM ${media} WHERE ${media.id} = ${column})`;
}

export const AUTHOR_AVATAR_MEDIA = {
  avatarDarkMedia: mediaJson(authors.avatarDark),
  avatarDarkHoveredMedia: mediaJson(authors.avatarDarkHovered),
  avatarLightMedia: mediaJson(authors.avatarLight),
  avatarLightHoveredMedia: mediaJson(authors.avatarLightHovered),
  miniAvatarMedia: mediaJson(authors.miniAvatar),
};

export const POST_OG_IMAGE_URL = {
  ogImage: mediaUrl(posts.ogImageMedia),
};

export const CATEGORY_OG_IMAGE_URL = {
  ogImage: mediaUrl(categories.ogImageMedia),
};
