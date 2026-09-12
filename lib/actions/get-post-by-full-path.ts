import { categories, posts, posts_rels, authors } from '@/lib/payload/generated-schema';
import { sql } from 'drizzle-orm';
import rowJson from '../utils/row-json';
import { AUTHOR_AVATAR_URLS, POST_OG_IMAGE_URL } from '../utils/media-url';
import type { Author } from './types/author';
import type { Post } from './types/post';
import { getPayload } from 'payload';
import config from '@payload-config';

type PostQueryRow = {
  post: Omit<Post, 'authors' | 'path'>;
  authors: Author[] | string;
};

export default async function getPostByFullPath(slugs: string[]): Promise<Post | null> {
  const db = (await getPayload({ config })).db.drizzle;

  if (slugs.length === 0) return null;

  const slugsCopy = [...slugs];
  const postSlug = slugsCopy.pop();
  const categoryPath = slugsCopy.join('/');

  try {
    const { rows } = await db.execute<PostQueryRow>(sql`
      WITH RECURSIVE category_tree AS (
        SELECT
            ${categories.id} AS id,
            ${categories.slug}::text AS full_path
        FROM ${categories}
        WHERE ${categories.parent} IS NULL

        UNION ALL

        SELECT
            ${categories.id},
            (ct.full_path || '/' || ${categories.slug})::text
        FROM ${categories}
        JOIN category_tree ct ON ${categories.parent} = ct.id
      )
      SELECT
          ${rowJson(posts, POST_OG_IMAGE_URL)} AS post,
          COALESCE(
            json_agg(${rowJson(authors, AUTHOR_AVATAR_URLS)} ORDER BY pr."order") FILTER (WHERE ${authors.id} IS NOT NULL),
            '[]'
          ) AS authors
      FROM ${posts}
      JOIN category_tree ct ON ${posts.category} = ct.id
      LEFT JOIN ${posts_rels} pr ON ${posts.id} = pr.parent_id AND pr.path = 'authors'
      LEFT JOIN ${authors} ON pr.authors_id = ${authors.id}
      WHERE ${posts.slug} = ${postSlug}
          AND ct.full_path = ${categoryPath}
      GROUP BY ${posts.id};
    `);

    if (!rows || rows.length === 0) {
      return null;
    }

    const { post, authors: postAuthors } = rows[0];

    return { ...post, authors: typeof postAuthors === 'string' ? JSON.parse(postAuthors) : postAuthors };
  } catch (error) {
    console.error('Error while searching for post by path:', error);
    return null;
  }
}
