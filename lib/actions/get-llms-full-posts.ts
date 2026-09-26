import { sql } from 'drizzle-orm';
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import { authors, categories, posts, posts_rels } from '@/lib/payload/generated-schema';
import { Status } from '@/lib/payload/taxonomy';
import { getPayload } from 'payload';
import config from '@payload-config';

export type LlmsFullPostRow = {
  fullPath: string;
  title: string;
  description: string;
  body: DefaultTypedEditorState;
  categoryTitles: string[];
  authorNames: string[];
  publishedAt: string;
  updatedAt: string | null;
};

export default async function getLlmsFullPosts(): Promise<LlmsFullPostRow[]> {
  const db = (await getPayload({ config })).db.drizzle;

  const { rows } = await db.execute<LlmsFullPostRow>(sql`
    WITH RECURSIVE category_tree AS (
      SELECT
        ${categories.id} AS id,
        ${categories.weight} AS root_weight,
        ${categories.slug}::text AS full_path,
        ARRAY[${categories.title}::text] AS titles
      FROM ${categories}
      WHERE ${categories.parent} IS NULL

      UNION ALL

      SELECT
        ${categories.id},
        ct.root_weight,
        (ct.full_path || '/' || ${categories.slug})::text AS full_path,
        ct.titles || ${categories.title}::text
      FROM ${categories}
      JOIN category_tree ct ON ${categories.parent} = ct.id
    )
    SELECT
      (ct.full_path || '/' || ${posts.slug})::text AS "fullPath",
      ${posts.title} AS "title",
      coalesce(nullif(${posts.seoDescription}, ''), ${posts.teaser}) AS "description",
      ${posts.body} AS "body",
      ct.titles AS "categoryTitles",
      coalesce(
        (
          SELECT array_agg(${authors.name}::text ORDER BY ${posts_rels.order})
          FROM ${posts_rels}
          JOIN ${authors} ON ${authors.id} = ${posts_rels.authorsID}
          WHERE ${posts_rels.parent} = ${posts.id} AND ${posts_rels.path} = 'authors'
        ),
        ARRAY[]::text[]
      ) AS "authorNames",
      coalesce(${posts.publishedAt}, ${posts.createdAt}) AS "publishedAt",
      ${posts.contentUpdatedAt} AS "updatedAt"
    FROM ${posts}
    JOIN category_tree ct ON ${posts.category} = ct.id
    WHERE ${posts.status} = ${Status.Published}
      AND ${posts.noIndex} IS NOT TRUE
    ORDER BY ct.root_weight ASC, coalesce(${posts.publishedAt}, ${posts.createdAt}) DESC;
  `);

  return rows;
}
