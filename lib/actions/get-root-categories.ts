import { categories } from '@/lib/payload/generated-schema';
import { Type } from '@/lib/payload/taxonomy';
import { asc, isNull, and, ne } from 'drizzle-orm';
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function getRootCategories(): Promise<(typeof categories.$inferSelect)[]> {
  const db = (await getPayload({ config })).db.drizzle;

  return db
    .select()
    .from(categories)
    .where(and(isNull(categories.parent), ne(categories.type, Type.Hidden)))
    .orderBy(asc(categories.weight));
}
