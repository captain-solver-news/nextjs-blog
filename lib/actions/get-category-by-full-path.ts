import { categories } from '@/lib/payload/generated-schema';
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
        )
        SELECT ${rowJson(categories, CATEGORY_OG_IMAGE_URL)} AS category
        FROM ${categories}
        JOIN category_tree ct ON ct.id = ${categories.id}
        WHERE ct.full_path = ${fullPath}
        LIMIT 1;
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
