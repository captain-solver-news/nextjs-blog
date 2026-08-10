import { categories, Category, Type } from '../schema/categories';
import { db } from '../client';
import { asc, isNull, and, ne } from 'drizzle-orm';

export default async function getRootCategories(): Promise<Category[]> {
  return db
    .select()
    .from(categories)
    .where(and(isNull(categories.parentId), ne(categories.type, Type.Hidden)))
    .orderBy(asc(categories.weight));
}
