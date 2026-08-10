'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { applyTheme, getThemeFromDocument, type Theme } from '@/lib/theme';
import styles from './theme-toggle.module.scss';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(getThemeFromDocument());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      disabled={!mounted}
      aria-label={mounted ? (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') : 'Toggle theme'}
    >
      {mounted ? (
        theme === 'dark' ? (
          <MoonIcon className={styles.icon} aria-hidden="true" />
        ) : (
          <SunIcon className={styles.icon} aria-hidden="true" />
        )
      ) : (
        <MoonIcon className={styles.icon} aria-hidden="true" />
      )}
    </button>
  );
}
