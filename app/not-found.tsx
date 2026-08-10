import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './not-found.module.scss';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className={styles.main}>
      <p className={styles.eyebrow}>404 error</p>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.description}>The link may be outdated or typed incorrectly. Try one of the pages below.</p>

      <div className={styles.actions}>
        <Link href="/" className={`${styles.link} ${styles.primaryLink}`}>
          Go to homepage
        </Link>
        <Link href="/blog" className={styles.link}>
          Browse blog
        </Link>
        <Link href="/contact" className={styles.link}>
          Contact us
        </Link>
      </div>
    </main>
  );
}
