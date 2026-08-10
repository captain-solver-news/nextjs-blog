import { pgTable, text, timestamp, index, uuid, varchar, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { categories } from './categories';
import { Author } from './authors';

export enum Status {
  Published = 'published',
  Draft = 'draft',
}

export const postStatusEnum = pgEnum('post_status', Object.values(Status) as [Status, ...Status[]]);

export const posts = pgTable(
  'posts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    teaser: text('teaser').notNull(),
    body: text('body').notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id),
    status: postStatusEnum('status').default(Status.Published).notNull(),
    isFeatured: boolean('is_featured').default(false),
    seo_description: text('seo_description'),
    og_image: varchar('og_image', { length: 1024 }),
    is_sitemap: boolean('is_sitemap').default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('posts_slug_idx').on(table.slug),
    index('posts_category_id_idx').on(table.categoryId),
    index('posts_created_at_idx').on(table.createdAt),
  ]
);

export type Post = InferSelectModel<typeof posts> & { authors: Author[]; path?: string };
export type NewPost = InferInsertModel<typeof posts>;
