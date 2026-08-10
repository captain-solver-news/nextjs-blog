import { Post } from '@/lib/db/schema/posts';
import { mdToHtml } from '@/lib/content/md-to-html';
import styles from './post-wrapper.module.scss';
import Image from 'next/image';
import Link from 'next/Link';

type PropsType = {
  post: Post;
  categorySlugs: string[];
};

export default async function PostWrapper({ post, categorySlugs }: PropsType) {
  const bodyHtml = await mdToHtml(post.body);

  return (
    <article className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/blog" className={styles.breadcrumbLink}>
          Blog
        </Link>
        {categorySlugs.map((slug, i) => {
          const isLast = i === categorySlugs.length - 1;
          const label = slug
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
          const href = `/blog/${categorySlugs.slice(0, i + 1).join('/')}`;
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
                <span className={styles.breadcrumbCurrent}>{label}</span>
              ) : (
                <a href={href} className={styles.breadcrumbLink}>
                  {label}
                </a>
              )}
            </span>
          );
        })}
      </nav>

      <h1 className={styles.title}>{post.title}</h1>

      {post.og_image && (
        <figure className={styles.featuredImage}>
          <div className={styles.imageWrapper}>
            <picture>
              <img className={styles.image} src={post.og_image} alt={post.title} />
            </picture>
          </div>
        </figure>
      )}

      <div className={styles.body} dangerouslySetInnerHTML={{ __html: bodyHtml }} />

      <div className={styles.footer}>
        {post.authors.map((author) => (
          <div key={author.id} className={styles.footerAuthor}>
            {author.avatar_url && (
              <Image src={author.avatar_url} alt={author.name} width={48} height={48} className={styles.footerAvatar} />
            )}
            <div>
              <p className={styles.footerAuthorName}>{author.name}</p>
              <p className={styles.footerAuthorRole}>{author.job_title}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
