import type { CollectionConfig } from 'payload';
import { preventDeleteIfReferenced } from '@/lib/payload/hooks/prevent-delete-if-referenced';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'mimeType', 'filesize', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeDelete: [preventDeleteIfReferenced],
  },
  upload: {
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      maxLength: 255,
      admin: {
        description: 'Alternative text used by screen readers and shown when the image cannot load.',
      },
    },
  ],
};
