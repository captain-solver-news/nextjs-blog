import { posts, Post, Status } from '../schema/posts';
import { db } from '../client';
import { eq, desc, sql, and } from 'drizzle-orm';
import { POSTS_PER_PAGE } from '@/config';
import { postsAuthors } from '../schema/posts-authors';
import { authors, type Author } from '../schema/authors';

export default async function getPostsByCategoryId(
  categoryId: string,
  page: number
): Promise<{ posts: Post[]; totalCount: number }> {
  const rows = await db
    .select({
      post: posts,
      authors: sql<Author[]>`COALESCE(json_agg(${authors}.*) FILTER (WHERE ${authors}.id IS NOT NULL), '[]')`.mapWith(
        (val) => (typeof val === 'string' ? JSON.parse(val) : val)
      ),
      totalCount: sql<number>`count(*) OVER()`.mapWith(Number),
    })
    .from(posts)
    .leftJoin(postsAuthors, eq(posts.id, postsAuthors.postId))
    .leftJoin(authors, eq(postsAuthors.authorId, authors.id))
    .where(and(eq(posts.categoryId, categoryId), eq(posts.status, Status.Published)))
    .groupBy(posts.id)
    .orderBy(desc(posts.createdAt))
    .limit(POSTS_PER_PAGE)
    .offset((page - 1) * POSTS_PER_PAGE);

  return {
    posts: rows.map((row) => ({
      ...row.post,
      authors: row.authors,
    })),
    totalCount: rows.length ? rows[0].totalCount : 0,
  };
}
