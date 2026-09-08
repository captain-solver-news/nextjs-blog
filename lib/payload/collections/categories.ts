import type { CollectionConfig } from 'payload';
import { Type } from '@/lib/payload/taxonomy';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'type', 'weight'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 255,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      maxLength: 255,
      admin: {
        description: 'One path segment. The full URL is built from the parent chain.',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      index: true,
      admin: {
        description: 'Leave empty for a root category.',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: Type.Hidden,
      options: [
        { label: 'Hidden', value: Type.Hidden },
        { label: 'Displays posts and subcategories', value: Type.DisplayedAll },
        { label: 'Displays posts', value: Type.DisplayedPosts },
        { label: 'Displays subcategories', value: Type.DisplayedSubcategories },
      ],
    },
    {
      name: 'weight',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Sort order, ascending.',
      },
    },
    {
      type: 'collapsible',
      label: 'SEO',
      fields: [
        { name: 'seoDescription', type: 'textarea' },
        { name: 'ogImage', type: 'text', maxLength: 1024 },
        { name: 'isSitemap', type: 'checkbox', defaultValue: true, label: 'Include in sitemap' },
      ],
    },
  ],
};
