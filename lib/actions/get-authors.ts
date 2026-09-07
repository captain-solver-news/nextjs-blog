import { authors } from '@/lib/payload/generated-schema';
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function getAuthors(): Promise<(typeof authors.$inferSelect)[]> {
  const db = (await getPayload({ config })).db.drizzle;

  return db.select().from(authors);
}
