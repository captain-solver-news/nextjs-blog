import type { authors, posts } from '@/lib/payload/generated-schema';

export type Post = typeof posts.$inferSelect & {
  authors: (typeof authors.$inferSelect)[];
  path?: string;
};
