import { sql } from 'drizzle-orm';
import { categories, posts } from '@/lib/payload/generated-schema';
import { Status } from '@/lib/payload/taxonomy';
import { getPayload } from 'payload';
import config from '@payload-config';

export type LlmsPostRow = {
  fullPath: string;
  title: string;
  description: string;
  rootId: string;
};

export default async function getLlmsPosts(): Promise<LlmsPostRow[]> {
  const db = (await getPayload({ config })).db.drizzle;

  const { rows } = await db.execute<LlmsPostRow>(sql`
    WITH RECURSIVE category_tree AS (
      SELECT
        ${categories.id} AS id,
        ${categories.id} AS root_id,
        ${categories.slug}::text AS full_path
      FROM ${categories}
      WHERE ${categories.parent} IS NULL

      UNION ALL

      SELECT
        ${categories.id},
        ct.root_id,
        (ct.full_path || '/' || ${categories.slug})::text AS full_path
      FROM ${categories}
      JOIN category_tree ct ON ${categories.parent} = ct.id
    )
    SELECT
      (ct.full_path || '/' || ${posts.slug})::text AS "fullPath",
      ${posts.title} AS "title",
      coalesce(nullif(${posts.seoDescription}, ''), ${posts.teaser}) AS "description",
      ct.root_id::text AS "rootId"
    FROM ${posts}
    JOIN category_tree ct ON ${posts.category} = ct.id
    WHERE ${posts.status} = ${Status.Published}
      AND ${posts.noIndex} IS NOT TRUE
    ORDER BY coalesce(${posts.publishedAt}, ${posts.createdAt}) DESC;
  `);

  return rows;
}
