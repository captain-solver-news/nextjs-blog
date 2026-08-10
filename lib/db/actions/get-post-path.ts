import { db } from '../client';
import { categories } from '../schema/categories';
import { posts } from '../schema/posts';
import { sql } from 'drizzle-orm';

export default async function getPostPath(postId: string): Promise<string | null> {
  try {
    const rows = await db.execute<{ slugs: string[] }>(sql`
      WITH RECURSIVE category_tree AS (
        SELECT
          id,
          slug::text AS full_path
        FROM ${categories}
        WHERE parent_id IS NULL

        UNION ALL

        SELECT
          c.id,
          (ct.full_path || '/' || c.slug)::text AS full_path
        FROM ${categories} c
        JOIN category_tree ct ON c.parent_id = ct.id
      )
      SELECT
        (string_to_array(ct.full_path, '/') || ARRAY[p.slug::text]) AS slugs
      FROM ${posts} p
      JOIN category_tree ct ON p.category_id = ct.id
      WHERE p.id = ${postId}
      LIMIT 1;
    `);

    if (!rows || rows.length === 0) {
      return null;
    }

    return rows[0].slugs.join('/');
  } catch (error) {
    console.error('Error while getting post path:', error);
    return null;
  }
}
