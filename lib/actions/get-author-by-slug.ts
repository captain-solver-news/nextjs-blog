import { eq } from 'drizzle-orm';
import { authors } from '@/lib/payload/generated-schema';
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function getAuthorBySlug(slug: string): Promise<typeof authors.$inferSelect | null> {
  const db = (await getPayload({ config })).db.drizzle;

  const rows = await db.select().from(authors).where(eq(authors.slug, slug)).limit(1);

  return rows[0] ?? null;
}
