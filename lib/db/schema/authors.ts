import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export const authors = pgTable('authors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  bio: text('bio'),
  job_title: varchar('job_title', { length: 255 }).notNull(),
  avatar_url: varchar('avatar_url', { length: 1024 }),
  mini_avatar_url: varchar('mini_avatar_url', { length: 1024 }),
  github_url: varchar('github_url', { length: 255 }),
  linkedin_url: varchar('linkedin_url', { length: 255 }),
});

export type Author = InferSelectModel<typeof authors>;
export type NewAuthor = InferInsertModel<typeof authors>;
