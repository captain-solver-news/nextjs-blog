import type { authors } from '@/lib/payload/generated-schema';

export type Author = typeof authors.$inferSelect & {
  avatarDarkUrl: string | null;
  avatarDarkHoveredUrl: string | null;
  avatarLightUrl: string | null;
  avatarLightHoveredUrl: string | null;
  miniAvatarUrl: string | null;
};
