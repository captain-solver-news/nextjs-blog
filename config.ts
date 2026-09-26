import type { StaticContent } from '@/lib/actions/types/static-content';
import { paragraphState } from '@/lib/utils/rich-text';

export const SITE_NAME = 'Prod Stories';
export const TWITTER_HANDLE = '@prodstories';

export const PUBLISHER_LOGO = {
  path: '/brand/logo-dark.png',
  width: 1600,
  height: 383,
} as const;

export const BLOG_PREFIX = 'blog';
export const AUTHOR_PREFIX = 'author';
export const SUBCATEGORIES_PER_PAGE = 12;
export const POSTS_PER_PAGE = 10;
export const THEME_COOKIE_NAME = 'theme';
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
export const POST_CONTENT_IMAGE_SIZES = '(max-width: 46.25rem) calc(100vw - 2.5rem), 700px';

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

export const defaultContent = (id: string): StaticContent => ({
  id,
  title: `${id} title`,
  body: paragraphState(`The ${id} content is not added in database yet`),
});
