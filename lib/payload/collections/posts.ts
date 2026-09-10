import type { CollectionConfig } from 'payload';
import { Status } from '@/lib/payload/taxonomy';
import { syncMediaURLs } from '@/lib/payload/hooks/sync-media-urls';

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'category', 'status', 'createdAt'],
    group: 'Blog',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [syncMediaURLs({ ogImageMedia: 'ogImage' })],
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
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      index: true,
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: true,
    },
    {
      name: 'teaser',
      type: 'textarea',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Markdown. Rendered through remark + remark-gfm at request time.',
        rows: 24,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: Status.Published,
      options: [
        { label: 'Published', value: Status.Published },
        { label: 'Draft', value: Status.Draft },
      ],
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured on the home page',
    },
    {
      type: 'collapsible',
      label: 'SEO',
      fields: [
        { name: 'seoDescription', type: 'textarea' },
        {
          name: 'ogImageMedia',
          label: 'Featured / social image',
          type: 'upload',
          relationTo: 'media',
        },
        { name: 'ogImage', type: 'text', maxLength: 1024, admin: { hidden: true } },
        { name: 'isSitemap', type: 'checkbox', defaultValue: true, label: 'Include in sitemap' },
      ],
    },
  ],
};
