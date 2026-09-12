import type { categories } from '@/lib/payload/generated-schema';

export type Category = typeof categories.$inferSelect & {
  ogImage: string | null;
};
