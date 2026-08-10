import getRootCategories from '@/lib/db/actions/get-root-categories';
import Link from 'next/link';
import { BLOG_PREFIX } from '@/config';
export { blogMetadata as metadata } from '@/lib/seo/static';
import { JsonLd } from '@/components/seo/json-ld';
import { blogSchema } from '@/lib/seo/static';
import styles from './page.module.scss';

export default async function BlogPage() {
  const categories = await getRootCategories();

  return (
    <>
      <article className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Blog</h1>
        </header>
        <div className={styles.list}>
          {categories.map((cat) => (
            <div key={cat.id} className={styles.item}>
              <Link href={`/${BLOG_PREFIX}/${cat.slug}`} className={styles.link}>
                {cat.title}
              </Link>
            </div>
          ))}
        </div>
      </article>
      <JsonLd schema={blogSchema} />
    </>
  );
}
