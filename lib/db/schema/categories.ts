import { foreignKey, pgEnum, pgTable, index, uuid, varchar, integer, boolean, text } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export enum Type {
  Hidden = 'hidden',
  DisplayedAll = 'displayed-all',
  DisplayedPosts = 'displayed-posts',
  DisplayedSubcategories = 'displayed-subcategories',
}

export const categoryTypeEnum = pgEnum('category_type', Object.values(Type) as [Type, ...Type[]]);

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    type: categoryTypeEnum('type').default(Type.Hidden).notNull(),
    weight: integer('weight').default(0).notNull(),
    parentId: uuid('parent_id'),
    seo_description: text('seo_description'),
    og_image: varchar('og_image', { length: 1024 }),
    is_sitemap: boolean('is_sitemap').default(true),
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: 'category_parents',
    }),
    index('categories_slug_idx').on(table.slug),
    index('categories_parent_id_idx').on(table.parentId),
  ]
);

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;
