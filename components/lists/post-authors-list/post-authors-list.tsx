import Image from 'next/image';
import { type Author } from '@/lib/db/schema/authors';
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
            {(author.mini_avatar_url || author.avatar_url) && (
              <Image
                src={author.mini_avatar_url || author.avatar_url!}
                alt={author.name}
                width={32}
                height={32}
                className={styles.avatar}
              />
            )}

            <div className={styles.meta}>
              <span className={styles.name}>{author.name}</span>
              {author.job_title && <span className={styles.jobTitle}>{author.job_title}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
