import type { CollectionConfig } from 'payload';

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
        { name: 'avatarDarkUrl', type: 'text', maxLength: 1024 },
        { name: 'avatarDarkHoveredUrl', type: 'text', maxLength: 1024 },
        { name: 'avatarLightUrl', type: 'text', maxLength: 1024 },
        { name: 'avatarLightHoveredUrl', type: 'text', maxLength: 1024 },
        { name: 'miniAvatarUrl', type: 'text', maxLength: 1024 },
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
