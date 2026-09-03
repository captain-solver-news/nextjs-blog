import { eq } from 'drizzle-orm';
import { db } from '../client';
import { authors, type Author } from '../schema/authors';

export default async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const rows = await db.select().from(authors).where(eq(authors.slug, slug)).limit(1);

  return rows[0] ?? null;
}
