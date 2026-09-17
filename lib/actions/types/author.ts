import type { authors } from '@/lib/payload/generated-schema';
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import type { Media } from './media';

export type Author = Omit<typeof authors.$inferSelect, 'bio'> & {
  bio: DefaultTypedEditorState | null;
  avatarDarkMedia: Media | null;
  avatarDarkHoveredMedia: Media | null;
  avatarLightMedia: Media | null;
  avatarLightHoveredMedia: Media | null;
  miniAvatarMedia: Media | null;
};
