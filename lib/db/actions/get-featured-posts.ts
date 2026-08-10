import { posts, Post, Status } from '../schema/posts';
import { db } from '../client';
import { eq, desc, sql, and } from 'drizzle-orm';
import { postsAuthors } from '../schema/posts-authors';
import { authors, type Author } from '../schema/authors';
import getPostPath from './get-post-path';

export default async function getFeaturedPosts(): Promise<Post[]> {
  const rows = await db
    .select({
      post: posts,
      authors: sql<Author[]>`COALESCE(json_agg(${authors}.*) FILTER (WHERE ${authors}.id IS NOT NULL), '[]')`.mapWith(
        (val) => (typeof val === 'string' ? JSON.parse(val) : val)
      ),
    })
    .from(posts)
    .leftJoin(postsAuthors, eq(posts.id, postsAuthors.postId))
    .leftJoin(authors, eq(postsAuthors.authorId, authors.id))
    .where(and(eq(posts.status, Status.Published), eq(posts.isFeatured, true)))
    .groupBy(posts.id)
    .orderBy(desc(posts.createdAt));

  const promises = rows.map(
    async (row) =>
      ({
        ...row.post,
        authors: row.authors,
        path: await getPostPath(row.post.id),
      }) as Post
  );

  const featuredPosts = await Promise.all(promises);

  return featuredPosts.filter((post) => post.path);
}
