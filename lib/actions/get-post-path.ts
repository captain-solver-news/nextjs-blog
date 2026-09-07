import { categories, posts } from '@/lib/payload/generated-schema';
import { sql } from 'drizzle-orm';
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function getPostPath(postId: string): Promise<string | null> {
  const db = (await getPayload({ config })).db.drizzle;

  try {
    const { rows } = await db.execute<{ slugs: string[] }>(sql`
      WITH RECURSIVE category_tree AS (
        SELECT
          ${categories.id} AS id,
          ${categories.slug}::text AS full_path
        FROM ${categories}
        WHERE ${categories.parent} IS NULL

        UNION ALL

        SELECT
          ${categories.id},
          (ct.full_path || '/' || ${categories.slug})::text AS full_path
        FROM ${categories}
        JOIN category_tree ct ON ${categories.parent} = ct.id
      )
      SELECT
        (string_to_array(ct.full_path, '/') || ARRAY[${posts.slug}::text]) AS slugs
      FROM ${posts}
      JOIN category_tree ct ON ${posts.category} = ct.id
      WHERE ${posts.id} = ${postId}
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
