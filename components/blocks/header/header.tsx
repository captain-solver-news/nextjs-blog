'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/blocks/header/theme-toggle/theme-toggle';
import { HamburgerMenu } from './hamburger/hamburger-menu';
import { Logo } from '@/components/blocks/logo/logo';
import { HEADER_LINKS } from '@/config';
import { Container } from '@/components/primitives/container/container';
import styles from './header.module.scss';

export function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <Container size="shell" className={styles.inner}>
        <div className={styles.brand}>
          <Logo />
        </div>

        <nav className={styles.nav} aria-label="Main">
          {HEADER_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <HamburgerMenu />
        </div>
      </Container>
    </header>
  );
}
