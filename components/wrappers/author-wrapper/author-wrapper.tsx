import { type ReactNode } from 'react';
import Link from 'next/link';
import { type Author } from '@/lib/db/schema/authors';
import GitHub from '@/components/icons/github';
import LinkedIn from '@/components/icons/linkedin';
import { Container } from '@/components/primitives/container/container';
import styles from './author-wrapper.module.scss';

type PropsType = {
  author: Author;
  totalCount: number;
  children?: ReactNode;
};

const FALLBACK_AVATAR = '/authors/fallback.jpg';

export default async function AuthorWrapper(props: PropsType) {
  const { author, totalCount, children } = props;

  return (
    <Container className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/about" className={styles.breadcrumbLink}>
            About
          </Link>
          <span className={styles.breadcrumbItem}>
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
            <span className={styles.breadcrumbCurrent}>{author.name}</span>
          </span>
        </nav>

        <div className={styles.identity}>
          <div className={styles.avatarWrapper}>
            <picture>
              <img
                className={`${styles.avatar} ${styles.avatarDark}`}
                src={author.avatar_dark_url || FALLBACK_AVATAR}
                alt={author.name}
              />
              <img
                className={`${styles.avatar} ${styles.avatarDarkHover}`}
                src={author.avatar_dark_hovered_url || FALLBACK_AVATAR}
                alt=""
                aria-hidden
              />
              <img
                className={`${styles.avatar} ${styles.avatarLight}`}
                src={author.avatar_light_url || FALLBACK_AVATAR}
                alt=""
                aria-hidden
              />
              <img
                className={`${styles.avatar} ${styles.avatarLightHover}`}
                src={author.avatar_light_hovered_url || FALLBACK_AVATAR}
                alt=""
                aria-hidden
              />
            </picture>
          </div>

          <div className={styles.identityInfo}>
            <h1 className={styles.title}>{author.name}</h1>
            <p className={styles.role}>{author.job_title}</p>
            <p className={styles.count}>
              {totalCount} {totalCount === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>

        {author.bio && <p className={styles.bio}>{author.bio}</p>}

        {(author.github_url || author.linkedin_url) && (
          <div className={styles.socialLinks}>
            {author.github_url && (
              <a
                className={styles.socialLink}
                href={author.github_url}
                aria-label={`${author.name} on GitHub`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <GitHub className={styles.socialIcon} />
              </a>
            )}
            {author.linkedin_url && (
              <a
                className={styles.socialLink}
                href={author.linkedin_url}
                aria-label={`${author.name} on LinkedIn`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <LinkedIn className={styles.socialIcon} />
              </a>
            )}
          </div>
        )}
      </header>

      {children}
    </Container>
  );
}
