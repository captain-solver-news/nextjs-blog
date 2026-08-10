import { categories, Category, Type } from '../schema/categories';
import { db } from '../client';
import { eq, asc, sql, and, ne } from 'drizzle-orm';
import { SUBCATEGORIES_PER_PAGE } from '@/config';

export default async function getSubcategoriesByCategoryId(
  categoryId: string,
  page: number
): Promise<{ subcategories: Category[]; totalCount: number }> {
  const result = await db
    .select({
      category: categories,
      totalCount: sql<number>`count(*) OVER()`.mapWith(Number),
    })
    .from(categories)
    .where(and(eq(categories.parentId, categoryId), ne(categories.type, Type.Hidden)))
    .orderBy(asc(categories.weight))
    .limit(SUBCATEGORIES_PER_PAGE)
    .offset((page - 1) * SUBCATEGORIES_PER_PAGE);

  return {
    subcategories: result.map((obj) => obj.category),
    totalCount: result.length ? result[0].totalCount : 0,
  };
}
