import type { authors } from '@/lib/payload/generated-schema';
import type { Media } from './media';

export type Author = typeof authors.$inferSelect & {
  avatarDarkMedia: Media | null;
  avatarDarkHoveredMedia: Media | null;
  avatarLightMedia: Media | null;
  avatarLightHoveredMedia: Media | null;
  miniAvatarMedia: Media | null;
};
