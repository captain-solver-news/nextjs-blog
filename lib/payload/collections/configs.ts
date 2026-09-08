import type { CollectionConfig } from 'payload';

export const Configs: CollectionConfig = {
  slug: 'configs',
  labels: {
    singular: 'Config',
    plural: 'Configs',
  },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['id', 'label', 'value'],
    group: 'Content',
    description: 'Key/value settings the site reads by id.',
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
        description: 'Stable key the site looks this setting up by.',
      },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      maxLength: 255,
    },
    {
      name: 'value',
      type: 'text',
      required: true,
      maxLength: 255,
    },
  ],
};
