import { pgTable, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { posts } from './posts';
import { authors } from './authors';

export const postsAuthors = pgTable(
  'posts_authors',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    authorId: uuid('author_id')
      .notNull()
      .references(() => authors.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.postId, table.authorId] })]
);

export type PostsAuthors = InferSelectModel<typeof postsAuthors>;
export type NewPostsAuthors = InferInsertModel<typeof postsAuthors>;
