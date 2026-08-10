import { type ReactNode } from 'react';
import Link from 'next/link';
import styles from './category-wrapper.module.scss';

type PropsType = {
  title: string;
  description?: string | null;
  slugs: string[];
  children?: ReactNode;
};

function formatSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default async function CategoryWrapper(props: PropsType) {
  const { title, description, slugs, children } = props;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/blog" className={styles.breadcrumbLink}>
            Blog
          </Link>
          {slugs.map((slug, i) => {
            const isLast = i === slugs.length - 1;
            const href = `/blog/${slugs.slice(0, i + 1).join('/')}`;
            return (
              <span key={slug} className={styles.breadcrumbItem}>
                <span className={styles.breadcrumbSeparator} aria-hidden="true">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
                {isLast ? (
                  <span className={styles.breadcrumbCurrent}>{formatSlug(slug)}</span>
                ) : (
                  <Link href={href} className={styles.breadcrumbLink}>
                    {formatSlug(slug)}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>

        <h1 className={styles.title}>{title}</h1>

        {description && <p className={styles.description}>{description}</p>}
      </header>

      {children}
    </div>
  );
}
