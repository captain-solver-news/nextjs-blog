import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Category } from '@/lib/db/schema/categories';
import getPostsByCategoryId from '@/lib/db/actions/get-posts-by-category-id';
import Pager from '@/components/blocks/pager/pager';
import { POSTS_PER_PAGE, BLOG_PREFIX } from '@/config';
import styles from './posts-list.module.scss';

type PropsType = {
  category: Category;
  page: number;
  slugs: string[];
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function PostsList(props: PropsType) {
  const { category, page, slugs } = props;
  const { posts, totalCount } = await getPostsByCategoryId(category.id, page);

  if (totalCount === 0) {
    notFound();
  }

  const categoryPath = `/${BLOG_PREFIX}/${slugs.join('/')}`;

  return (
    <div className={styles.list}>
      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;
        return (
          <article key={post.id} className={`${styles.entry} ${isLast ? styles.entryLast : ''}`}>
            <Link href={`${categoryPath}/${post.slug}`} className={styles.entryLink}>
              <h2 className={styles.entryTitle}>{post.title}</h2>
            </Link>
            <p className={styles.entryTeaser}>{post.teaser}</p>
            <div className={styles.entryFooter}>
              <Link href={`${categoryPath}/${post.slug}`} className={styles.readMore}>
                Read More
                <svg
                  className={styles.readMoreIcon}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <time className={styles.entryDate} dateTime={post.createdAt.toISOString()}>
                {formatDate(post.createdAt)}
              </time>
            </div>
          </article>
        );
      })}
      <Pager page={page} pageLength={POSTS_PER_PAGE} totalLength={totalCount} />
    </div>
  );
}
