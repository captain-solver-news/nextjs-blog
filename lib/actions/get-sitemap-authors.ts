import { and, eq, sql } from 'drizzle-orm';
import { authors, posts, posts_rels } from '@/lib/payload/generated-schema';
import { Status } from '@/lib/payload/taxonomy';
import timestampToDate from '../utils/timestamp-to-date';
import { getPayload } from 'payload';
import config from '@payload-config';

export type SitemapAuthorRow = {
  slug: string;
  updatedAt: Date | null;
};

export default async function getSitemapAuthors(): Promise<SitemapAuthorRow[]> {
  const db = (await getPayload({ config })).db.drizzle;

  const rows = await db
    .select({
      slug: authors.slug,
      updatedAt: sql<string | null>`max(${posts.updatedAt})`,
    })
    .from(authors)
    .innerJoin(posts_rels, and(eq(posts_rels.authorsID, authors.id), eq(posts_rels.path, 'authors')))
    .innerJoin(posts, and(eq(posts.id, posts_rels.parent), eq(posts.status, Status.Published)))
    .groupBy(authors.id, authors.slug);

  return rows.map((row) => ({
    slug: row.slug,
    updatedAt: row.updatedAt ? timestampToDate(row.updatedAt) : null,
  }));
}
