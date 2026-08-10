'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/blocks/header/theme-toggle/theme-toggle';
import { HamburgerMenu } from './hamburger/hamburger-menu';
import { HEADER_LINKS } from '@/config';
import styles from './header.module.scss';

export function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={`${styles.inner} container`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            DEV
          </Link>
        </div>

        <nav className={styles.nav} aria-label="Main">
          {HEADER_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;

            return (
              <Link key={href} href={href} className={`${styles.link} ${isActive ? styles.linkActive : ''}`}>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
}
