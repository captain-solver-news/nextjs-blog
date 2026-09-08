import type { CollectionConfig } from 'payload';

export const StaticContents: CollectionConfig = {
  slug: 'static-contents',
  labels: {
    singular: 'Static content',
    plural: 'Static contents',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'title'],
    group: 'Content',
    description: 'Markdown blocks addressed by a stable string id (about, contact, ...).',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
      maxLength: 255,
      admin: {
        description: 'Stable key the site looks this block up by. Changing it breaks the page using it.',
      },
    },
    {
      name: 'title',
      type: 'text',
      maxLength: 255,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      admin: { rows: 20 },
    },
  ],
};
