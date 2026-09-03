import { sql } from 'drizzle-orm';
import { db } from '../client';
import { POSTS_PER_PAGE } from '@/config';
import { categories } from '../schema/categories';
import { posts, Post, Status } from '../schema/posts';
import { postsAuthors } from '../schema/posts-authors';
import { authors, type Author } from '../schema/authors';
import toDate from '../to-date';

type PostRow = Omit<Post, 'authors' | 'path' | 'createdAt' | 'updatedAt'> & {
  path: string;
  createdAt: string;
  updatedAt: string;
  authors: Author[] | string;
  totalCount: number;
};

export default async function getPostsByAuthorId(
  authorId: string,
  page: number
): Promise<{ posts: Post[]; totalCount: number }> {
  const rows = await db.execute<PostRow>(sql`
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
      p.id,
      p.title,
      p.teaser,
      p.body,
      p.slug,
      p.status,
      p.category_id AS "categoryId",
      p.is_featured AS "isFeatured",
      p.seo_description AS "seoDescription",
      p.og_image AS "ogImage",
      p.is_sitemap AS "isSitemap",
      p.created_at AS "createdAt",
      p.updated_at AS "updatedAt",
      (ct.full_path || '/' || p.slug)::text AS "path",
      COALESCE(
        (
          SELECT json_agg(a.* ORDER BY a.name)
          FROM ${postsAuthors} pa_all
          JOIN ${authors} a ON a.id = pa_all.author_id
          WHERE pa_all.post_id = p.id
        ),
        '[]'::json
      ) AS "authors",
      (count(*) OVER())::int AS "totalCount"
    FROM ${posts} p
    JOIN category_tree ct ON p.category_id = ct.id
    WHERE p.status = ${Status.Published}
      AND EXISTS (
        SELECT 1
        FROM ${postsAuthors} pa
        WHERE pa.post_id = p.id
          AND pa.author_id = ${authorId}
      )
    ORDER BY p.created_at DESC
    LIMIT ${POSTS_PER_PAGE}
    OFFSET ${(page - 1) * POSTS_PER_PAGE};
  `);

  return {
    posts: rows.map((row) => ({
      id: row.id,
      title: row.title,
      teaser: row.teaser,
      body: row.body,
      slug: row.slug,
      status: row.status,
      categoryId: row.categoryId,
      isFeatured: row.isFeatured,
      seoDescription: row.seoDescription,
      ogImage: row.ogImage,
      isSitemap: row.isSitemap,
      createdAt: toDate(row.createdAt),
      updatedAt: toDate(row.updatedAt),
      path: row.path,
      authors: typeof row.authors === 'string' ? JSON.parse(row.authors) : row.authors,
    })),
    totalCount: rows.length ? rows[0].totalCount : 0,
  };
}
