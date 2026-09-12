import { eq, getTableColumns } from 'drizzle-orm';
import { authors } from '@/lib/payload/generated-schema';
import { AUTHOR_AVATAR_URLS } from '../utils/media-url';
import type { Author } from './types/author';
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const db = (await getPayload({ config })).db.drizzle;

  const rows = await db
    .select({ ...getTableColumns(authors), ...AUTHOR_AVATAR_URLS })
    .from(authors)
    .where(eq(authors.slug, slug))
    .limit(1);

  return rows[0] ?? null;
}
