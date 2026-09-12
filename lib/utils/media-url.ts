import { sql, type SQL } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import { authors, categories, media, posts } from '@/lib/payload/generated-schema';

export default function mediaUrl(column: PgColumn): SQL<string | null> {
  return sql<string | null>`(SELECT ${media.url} FROM ${media} WHERE ${media.id} = ${column})`;
}

export const AUTHOR_AVATAR_URLS = {
  avatarDarkUrl: mediaUrl(authors.avatarDark),
  avatarDarkHoveredUrl: mediaUrl(authors.avatarDarkHovered),
  avatarLightUrl: mediaUrl(authors.avatarLight),
  avatarLightHoveredUrl: mediaUrl(authors.avatarLightHovered),
  miniAvatarUrl: mediaUrl(authors.miniAvatar),
};

export const POST_OG_IMAGE_URL = {
  ogImage: mediaUrl(posts.ogImageMedia),
};

export const CATEGORY_OG_IMAGE_URL = {
  ogImage: mediaUrl(categories.ogImageMedia),
};
