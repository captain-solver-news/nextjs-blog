import { sql } from 'drizzle-orm';
import { db } from '../client';
import { categories } from '../schema/categories';
import { posts, Status } from '../schema/posts';

export type SitemapPostRow = {
  fullPath: string;
  updatedAt: Date | null;
};

export default async function getSitemapPosts(): Promise<SitemapPostRow[]> {
  return db.execute<SitemapPostRow>(sql`
    WITH RECURSIVE category_tree AS (
      SELECT
        c.id,
        c.slug::text AS full_path
      FROM ${categories} c
      WHERE c.parent_id IS NULL

      UNION ALL

      SELECT
        c.id,
        (ct.full_path || '/' || c.slug)::text AS full_path
      FROM ${categories} c
      JOIN category_tree ct ON c.parent_id = ct.id
    )
    SELECT
      (ct.full_path || '/' || p.slug)::text AS "fullPath",
      p.updated_at AS "updatedAt"
    FROM ${posts} p
    JOIN category_tree ct ON p.category_id = ct.id
    WHERE p.status = ${Status.Published}
      AND p.is_sitemap IS TRUE;
  `);
}
