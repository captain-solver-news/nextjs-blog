'use client';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HAMBURGER_MENU_TRANSITION_MS, HAMBURGER_LINKS } from '@/config';
import styles from './hamburger-menu.module.scss';
import { createPortal } from 'react-dom';

export function HamburgerMenu() {
  const pathname = usePathname();
  const [isClicked, setIsClicked] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isClicked) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRendered(true);
      if (isReducedMotion) {
        setIsOpened(true);
        return;
      }

      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsOpened(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setIsOpened(false);

    if (isReducedMotion) {
      setIsRendered(false);
      return;
    }

    const timeout = window.setTimeout(() => setIsRendered(false), HAMBURGER_MENU_TRANSITION_MS);
    return () => window.clearTimeout(timeout);
  }, [isClicked]);

  useEffect(() => {
    if (!isRendered) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsClicked(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isRendered]);

  const close = () => setIsClicked(false);

  return (
    <div className={styles.mobileNavWrap}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={() => setIsClicked(true)}
        aria-expanded={isClicked}
        aria-controls="mobile-nav-panel"
        aria-label="Open menu"
        aria-hidden={isClicked}
        tabIndex={isClicked ? -1 : 0}
      >
        <Bars3Icon className={styles.menuIcon} aria-hidden="true" />
      </button>

      {isRendered && typeof document !== 'undefined'
        ? createPortal(
            <nav
              id="mobile-nav-panel"
              className={`${styles.mobileMenuOverlay} ${isOpened ? styles.mobileMenuOverlayVisible : ''}`}
              aria-label="Main"
              aria-hidden={!isClicked}
            >
              <div className={styles.mobileMenuTopBar}>
                <button type="button" className={styles.menuButton} onClick={close} aria-label="Close menu">
                  <XMarkIcon className={styles.menuIcon} aria-hidden="true" />
                </button>
              </div>
              {HAMBURGER_LINKS.map(({ href, label }) => {
                const isActive = pathname === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`}
                    onClick={close}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>,
            document.body
          )
        : null}
    </div>
  );
}
