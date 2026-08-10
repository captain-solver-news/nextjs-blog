import { sql } from 'drizzle-orm';
import { db } from '../client';
import { categories } from '../schema/categories';

export type SitemapCategoryRow = {
  fullPath: string;
  updatedAt: Date | null;
};

export default async function getSitemapCategories(): Promise<SitemapCategoryRow[]> {
  return db.execute<SitemapCategoryRow>(sql`
    WITH RECURSIVE category_tree AS (
      SELECT
        c.id,
        c.slug,
        c.parent_id,
        c.type,
        c.is_sitemap,
        c.slug::text AS full_path,
        NULL::timestamp AS updated_at
      FROM ${categories} c
      WHERE c.parent_id IS NULL

      UNION ALL

      SELECT
        c.id,
        c.slug,
        c.parent_id,
        c.type,
        c.is_sitemap,
        (ct.full_path || '/' || c.slug)::text AS full_path,
        NULL::timestamp AS updated_at
      FROM ${categories} c
      JOIN category_tree ct ON c.parent_id = ct.id
    )
    SELECT
      ct.full_path AS "fullPath",
      ct.updated_at AS "updatedAt"
    FROM category_tree ct
    WHERE ct.is_sitemap IS TRUE
      AND ct.type <> 'hidden';
  `);
}
