import { getTableColumns } from 'drizzle-orm';
import { authors } from '@/lib/payload/generated-schema';
import { AUTHOR_AVATAR_MEDIA } from '../utils/media-url';
import type { Author } from './types/author';
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function getAuthors(): Promise<Author[]> {
  const db = (await getPayload({ config })).db.drizzle;

  return (await db.select({ ...getTableColumns(authors), ...AUTHOR_AVATAR_MEDIA }).from(authors)) as Author[];
}
