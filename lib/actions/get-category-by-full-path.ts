import { categories } from '@/lib/payload/generated-schema';
import rowJson from '../utils/row-json';
import { sql } from 'drizzle-orm';
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function getCategoryByFullPath(slugs: string[]): Promise<typeof categories.$inferSelect | null> {
  const db = (await getPayload({ config })).db.drizzle;

  if (slugs.length === 0) return null;

  const fullPath = slugs.join('/');

  try {
    const { rows } = await db.execute<{ category: typeof categories.$inferSelect }>(sql`
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
        SELECT ${rowJson(categories)} AS category
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
