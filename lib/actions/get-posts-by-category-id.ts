import { posts, posts_rels, authors } from '@/lib/payload/generated-schema';
import { eq, desc, sql, and, getTableColumns } from 'drizzle-orm';
import { POSTS_PER_PAGE } from '@/config';
import rowJson from '../utils/row-json';
import { Status } from '@/lib/payload/taxonomy';
import type { Post } from './types/post';
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function getPostsByCategoryId(
  categoryId: string,
  page: number
): Promise<{ posts: Post[]; totalCount: number }> {
  const db = (await getPayload({ config })).db.drizzle;

  const rows = await db
    .select({
      post: getTableColumns(posts),
      authors: sql<
        (typeof authors.$inferSelect)[]
      >`COALESCE(json_agg(${rowJson(authors)} ORDER BY ${posts_rels.order}) FILTER (WHERE ${authors.id} IS NOT NULL), '[]')`.mapWith(
        (val) => (typeof val === 'string' ? JSON.parse(val) : val)
      ),
      totalCount: sql<number>`count(*) OVER()`.mapWith(Number),
    })
    .from(posts)
    .leftJoin(posts_rels, and(eq(posts.id, posts_rels.parent), eq(posts_rels.path, 'authors')))
    .leftJoin(authors, eq(posts_rels.authorsID, authors.id))
    .where(and(eq(posts.category, categoryId), eq(posts.status, Status.Published)))
    .groupBy(posts.id)
    .orderBy(desc(posts.createdAt))
    .limit(POSTS_PER_PAGE)
    .offset((page - 1) * POSTS_PER_PAGE);

  return {
    posts: rows.map((row) => ({ ...row.post, authors: row.authors })),
    totalCount: rows.length ? rows[0].totalCount : 0,
  };
}
