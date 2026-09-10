import type { CollectionConfig } from 'payload';
import { syncMediaURLs } from '@/lib/payload/hooks/sync-media-urls';

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'jobTitle'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      syncMediaURLs({
        avatarDark: 'avatarDarkUrl',
        avatarDarkHovered: 'avatarDarkHoveredUrl',
        avatarLight: 'avatarLightUrl',
        avatarLightHovered: 'avatarLightHoveredUrl',
        miniAvatar: 'miniAvatarUrl',
      }),
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 255,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      maxLength: 255,
      admin: {
        description: 'URL segment for the author page: /author/<slug>',
      },
    },
    {
      name: 'jobTitle',
      type: 'text',
      required: true,
      maxLength: 255,
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
    },
    {
      type: 'collapsible',
      label: 'Avatars',
      fields: [
        { name: 'avatarDark', label: 'Dark theme', type: 'upload', relationTo: 'media' },
        { name: 'avatarDarkHovered', label: 'Dark theme (hover)', type: 'upload', relationTo: 'media' },
        { name: 'avatarLight', label: 'Light theme', type: 'upload', relationTo: 'media' },
        { name: 'avatarLightHovered', label: 'Light theme (hover)', type: 'upload', relationTo: 'media' },
        { name: 'miniAvatar', label: 'Small avatar', type: 'upload', relationTo: 'media' },
        { name: 'avatarDarkUrl', type: 'text', maxLength: 1024, admin: { hidden: true } },
        { name: 'avatarDarkHoveredUrl', type: 'text', maxLength: 1024, admin: { hidden: true } },
        { name: 'avatarLightUrl', type: 'text', maxLength: 1024, admin: { hidden: true } },
        { name: 'avatarLightHoveredUrl', type: 'text', maxLength: 1024, admin: { hidden: true } },
        { name: 'miniAvatarUrl', type: 'text', maxLength: 1024, admin: { hidden: true } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Social links',
      fields: [
        { name: 'githubUrl', type: 'text', maxLength: 255 },
        { name: 'linkedinUrl', type: 'text', maxLength: 255 },
      ],
    },
  ],
};
