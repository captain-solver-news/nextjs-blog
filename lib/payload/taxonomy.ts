export const Status = {
  Published: 'published',
  Draft: 'draft',
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const Type = {
  Hidden: 'hidden',
  DisplayedAll: 'displayed-all',
  DisplayedPosts: 'displayed-posts',
  DisplayedSubcategories: 'displayed-subcategories',
} as const;

export type Type = (typeof Type)[keyof typeof Type];
