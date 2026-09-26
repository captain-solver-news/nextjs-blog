import { categories, posts } from '@/lib/payload/generated-schema';
import { Status } from '@/lib/payload/taxonomy';
import rowJson from '../utils/row-json';
import { CATEGORY_OG_IMAGE_URL } from '../utils/media-url';
import type { Category } from './types/category';
import { sql } from 'drizzle-orm';
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function getCategoryByFullPath(slugs: string[]): Promise<Category | null> {
  const db = (await getPayload({ config })).db.drizzle;

  if (slugs.length === 0) return null;

  const fullPath = slugs.join('/');

  try {
    const { rows } = await db.execute<{ category: Category }>(sql`
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
        ),
        target AS (
          SELECT id FROM category_tree WHERE full_path = ${fullPath} LIMIT 1
        ),
        subtree AS (
          SELECT id FROM target

          UNION ALL

          SELECT ${categories.id}
          FROM ${categories}
          JOIN subtree st ON ${categories.parent} = st.id
        )
        SELECT ${rowJson(categories, {
          ...CATEGORY_OG_IMAGE_URL,
          lastModified: sql`greatest(${categories.updatedAt}, (
            SELECT max(${posts.contentUpdatedAt})
            FROM ${posts}
            JOIN subtree st ON ${posts.category} = st.id
            WHERE ${posts.status} = ${Status.Published}
          ))`,
        })} AS category
        FROM ${categories}
        JOIN target t ON t.id = ${categories.id};
      `);

    if (!rows || rows.length === 0) {
      return null;
    }

    return rows[0].category;
  } catch (error) {
    console.error('Error while searching for category by path:', error);
    return null;
  }
}
