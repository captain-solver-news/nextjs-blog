import { SITE_NAME, TWITTER_HANDLE } from '@/config';

export const OPEN_GRAPH_DEFAULTS = {
  type: 'website',
  siteName: SITE_NAME,
} as const;

export const TWITTER_DEFAULTS = {
  site: TWITTER_HANDLE,
} as const;
