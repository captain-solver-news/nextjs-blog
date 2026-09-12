import Image from 'next/image';
import Link from 'next/link';
import { AUTHOR_PREFIX } from '@/config';
import type { Author } from '@/lib/actions/types/author';
import styles from './post-authors-list.module.scss';

interface PostAuthorsListProps {
  authors: Author[];
}

export function PostAuthorsList({ authors }: PostAuthorsListProps) {
  if (!authors || authors.length === 0) return null;

  return (
    <div className={styles.container}>
      <span className={styles.label}>{authors.length > 1 ? 'Authors:' : 'Author:'}</span>

      <div className={styles.list}>
        {authors.map((author) => (
          <div key={author.id} className={styles.authorBadge}>
            <Image
              src={author.miniAvatarUrl || '/authors/fallback.jpg'}
              alt={author.name}
              width={32}
              height={32}
              className={styles.avatar}
            />

            <div className={styles.meta}>
              <Link href={`/${AUTHOR_PREFIX}/${author.slug}`} className={styles.name}>
                {author.name}
              </Link>
              {author.jobTitle && <span className={styles.jobTitle}>{author.jobTitle}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
