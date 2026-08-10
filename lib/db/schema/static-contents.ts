import { pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export const staticContents = pgTable('static_contents', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }),
  body: text('body').notNull(),
});

export type StaticContent = InferSelectModel<typeof staticContents>;
export type NewStaticContent = InferInsertModel<typeof staticContents>;
