import { sql } from 'drizzle-orm';
import { categories } from '@/lib/payload/generated-schema';
import { Type } from '@/lib/payload/taxonomy';
import { getPayload } from 'payload';
import config from '@payload-config';

export type SitemapCategoryRow = {
  fullPath: string;
  updatedAt: Date | null;
};

export default async function getSitemapCategories(): Promise<SitemapCategoryRow[]> {
  const db = (await getPayload({ config })).db.drizzle;

  const { rows } = await db.execute<SitemapCategoryRow>(sql`
    WITH RECURSIVE category_tree AS (
      SELECT
        ${categories.id} AS id,
        ${categories.type} AS type,
        ${categories.isSitemap} AS is_sitemap,
        ${categories.slug}::text AS full_path,
        NULL::timestamp AS updated_at
      FROM ${categories}
      WHERE ${categories.parent} IS NULL

      UNION ALL

      SELECT
        ${categories.id},
        ${categories.type},
        ${categories.isSitemap},
        (ct.full_path || '/' || ${categories.slug})::text AS full_path,
        NULL::timestamp AS updated_at
      FROM ${categories}
      JOIN category_tree ct ON ${categories.parent} = ct.id
    )
    SELECT
      ct.full_path AS "fullPath",
      ct.updated_at AS "updatedAt"
    FROM category_tree ct
    WHERE ct.is_sitemap IS TRUE
      AND ct.type <> ${Type.Hidden};
  `);

  return rows;
}
