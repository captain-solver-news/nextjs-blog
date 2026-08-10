import { db } from '../client';
import { categories } from '../schema/categories';
import { posts, Post } from '../schema/posts';
import { sql } from 'drizzle-orm';
import { postsAuthors } from '@/lib/db/schema/posts-authors';
import { authors } from '@/lib/db/schema/authors';

export default async function getPostByFullPath(slugs: string[]): Promise<Post | null> {
  if (slugs.length === 0) return null;

  const slugsCopy = [...slugs];
  const postSlug = slugsCopy.pop();
  const categoryPath = slugsCopy.join('/');

  try {
    const rows = await db.execute(sql`
      WITH RECURSIVE category_tree AS (
        SELECT 
            id, 
            slug, 
            parent_id, 
            slug::text AS full_path
        FROM ${categories}
        WHERE parent_id IS NULL

        UNION ALL

        SELECT 
            c.id, 
            c.slug, 
            c.parent_id, 
            (ct.full_path || '/' || c.slug)::text
        FROM ${categories} c
        JOIN category_tree ct ON c.parent_id = ct.id
            )
        SELECT 
            p.*,
            COALESCE(
              json_agg(a.*) FILTER (WHERE a.id IS NOT NULL), 
              '[]'
            ) as authors
        FROM ${posts} p
        JOIN category_tree ct ON p.category_id = ct.id
        LEFT JOIN ${postsAuthors} pa ON p.id = pa.post_id
        LEFT JOIN ${authors} a ON pa.author_id = a.id
        WHERE p.slug = ${postSlug} 
            AND ct.full_path = ${categoryPath}
        GROUP BY p.id;
    `);

    if (!rows || rows.length === 0) {
      return null;
    }

    return rows[0] as Post;
  } catch (error) {
    console.error('Error while searching for post by path:', error);
    return null;
  }
}
