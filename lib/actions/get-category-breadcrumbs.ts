import { categories } from '@/lib/payload/generated-schema';
import { Type } from '@/lib/payload/taxonomy';
import { sql } from 'drizzle-orm';
import { getPayload } from 'payload';
import config from '@payload-config';

export type CategoryBreadcrumb = {
  title: string;
  fullPath: string;
};

export default async function getCategoryBreadcrumbs(slugs: string[]): Promise<CategoryBreadcrumb[]> {
  if (slugs.length === 0) return [];

  const db = (await getPayload({ config })).db.drizzle;
  const fullPath = slugs.join('/');

  try {
    const { rows } = await db.execute<CategoryBreadcrumb>(sql`
      WITH RECURSIVE category_tree AS (
        SELECT
            ${categories.id} AS id,
            ${categories.title}::text AS title,
            ${categories.type} AS type,
            ${categories.slug}::text AS full_path
        FROM ${categories}
        WHERE ${categories.parent} IS NULL

        UNION ALL

        SELECT
            ${categories.id},
            ${categories.title}::text,
            ${categories.type},
            (ct.full_path || '/' || ${categories.slug})::text
        FROM ${categories}
        JOIN category_tree ct ON ${categories.parent} = ct.id
      )
      SELECT
          ct.title AS "title",
          ct.full_path AS "fullPath"
      FROM category_tree ct
      WHERE ct.type <> ${Type.Hidden}
          AND (ct.full_path = ${fullPath} OR ${fullPath} LIKE ct.full_path || '/%')
      ORDER BY length(ct.full_path);
    `);

    return rows ?? [];
  } catch (error) {
    console.error('Error while building category breadcrumbs:', error);
    return [];
  }
}
