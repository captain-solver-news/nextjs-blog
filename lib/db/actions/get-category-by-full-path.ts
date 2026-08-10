import { db } from '../client';
import { categories, Category } from '../schema/categories';
import { sql } from 'drizzle-orm';

export default async function getCategoryByFullPath(slugs: string[]): Promise<Category | null> {
  if (slugs.length === 0) return null;

  const fullPath = slugs.join('/');

  try {
    const rows = await db.execute(sql`
        WITH RECURSIVE category_tree AS (
          SELECT 
              *,
              slug::text AS full_path
          FROM ${categories}
          WHERE parent_id IS NULL
  
          UNION ALL
          SELECT 
              c.*,
              (ct.full_path || '/' || c.slug)::text
          FROM ${categories} c
          JOIN category_tree ct ON c.parent_id = ct.id
        )
        SELECT 
          * FROM category_tree
        WHERE full_path = ${fullPath}
        LIMIT 1;
      `);

    if (!rows || rows.length === 0) {
      return null;
    }

    return rows[0] as Category;
  } catch (error) {
    console.error('Error while searching for category by path:', error);
    return null;
  }
}
