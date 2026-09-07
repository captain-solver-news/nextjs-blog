import { categories } from '@/lib/payload/generated-schema';
import { Type } from '@/lib/payload/taxonomy';
import { eq, asc, sql, and, ne, getTableColumns } from 'drizzle-orm';
import { SUBCATEGORIES_PER_PAGE } from '@/config';
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function getSubcategoriesByCategoryId(
  categoryId: string,
  page: number
): Promise<{ subcategories: (typeof categories.$inferSelect)[]; totalCount: number }> {
  const db = (await getPayload({ config })).db.drizzle;

  const result = await db
    .select({
      category: getTableColumns(categories),
      totalCount: sql<number>`count(*) OVER()`.mapWith(Number),
    })
    .from(categories)
    .where(and(eq(categories.parent, categoryId), ne(categories.type, Type.Hidden)))
    .orderBy(asc(categories.weight))
    .limit(SUBCATEGORIES_PER_PAGE)
    .offset((page - 1) * SUBCATEGORIES_PER_PAGE);

  return {
    subcategories: result.map((row) => row.category),
    totalCount: result.length ? result[0].totalCount : 0,
  };
}
