import type { posts } from '@/lib/payload/generated-schema';
import type { Author } from './author';

export type Post = typeof posts.$inferSelect & {
  ogImage: string | null;
  authors: Author[];
  path?: string;
};
