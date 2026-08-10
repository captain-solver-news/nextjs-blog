import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export const configs = pgTable('configs', {
  id: varchar('id', { length: 255 }).primaryKey(),
  label: varchar('label', { length: 255 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
});

export type Config = InferSelectModel<typeof configs>;
export type NewConfig = InferInsertModel<typeof configs>;
