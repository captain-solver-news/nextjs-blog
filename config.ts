import { StaticContent } from '@/lib/db/schema/static-contents';

export const BLOG_PREFIX = 'blog';
export const SUBCATEGORIES_PER_PAGE = 12;
export const POSTS_PER_PAGE = 10;
export const THEME_STORAGE_KEY = 'theme';

export const HEADER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export const FOOTER_LINKS_1 = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export const FOOTER_LINKS_2 = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Terms And Conditions' },
] as const;

export const HAMBURGER_MENU_TRANSITION_MS = 220;

export const HAMBURGER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Terms And Conditions' },
  { href: '/contact', label: 'Contact' },
] as const;

export const defaultContent = (id: string) =>
  ({
    id,
    title: `${id} title`,
    body: `The ${id} content is not added in database yet`,
  }) as StaticContent;
