import { and, eq, sql } from 'drizzle-orm';
import { db } from '../client';
import { authors } from '../schema/authors';
import { posts, Status } from '../schema/posts';
import { postsAuthors } from '../schema/posts-authors';
import toDate from '../to-date';

export type SitemapAuthorRow = {
  slug: string;
  updatedAt: Date | null;
};

export default async function getSitemapAuthors(): Promise<SitemapAuthorRow[]> {
  const rows = await db
    .select({
      slug: authors.slug,
      updatedAt: sql<string | null>`max(${posts.updatedAt})`,
    })
    .from(authors)
    .innerJoin(postsAuthors, eq(postsAuthors.authorId, authors.id))
    .innerJoin(posts, and(eq(posts.id, postsAuthors.postId), eq(posts.status, Status.Published)))
    .groupBy(authors.id, authors.slug);

  return rows.map((row) => ({
    slug: row.slug,
    updatedAt: row.updatedAt ? toDate(row.updatedAt) : null,
  }));
}
