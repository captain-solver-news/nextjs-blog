import { THEME_COOKIE_NAME, THEME_COOKIE_MAX_AGE } from '@/config';

export type Theme = 'dark' | 'light';

export function applyTheme(theme: Theme): void {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  document.cookie = `${THEME_COOKIE_NAME}=${theme};path=/;max-age=${THEME_COOKIE_MAX_AGE};samesite=lax`;
}

export function getThemeFromDocument(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}
