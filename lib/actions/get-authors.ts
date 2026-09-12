import { getTableColumns } from 'drizzle-orm';
import { authors } from '@/lib/payload/generated-schema';
import { AUTHOR_AVATAR_URLS } from '../utils/media-url';
import type { Author } from './types/author';
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function getAuthors(): Promise<Author[]> {
  const db = (await getPayload({ config })).db.drizzle;

  return db.select({ ...getTableColumns(authors), ...AUTHOR_AVATAR_URLS }).from(authors);
}
