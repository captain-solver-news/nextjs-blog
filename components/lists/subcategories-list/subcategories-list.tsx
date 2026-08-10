import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Category } from '@/lib/db/schema/categories';
import getSubcategoriesByCategoryId from '@/lib/db/actions/get-subcategories-by-category-id';
import Pager from '@/components/blocks/pager/pager';
import { SUBCATEGORIES_PER_PAGE, BLOG_PREFIX } from '@/config';
import styles from './subcategories-list.module.scss';

type PropsType = {
  category: Category;
  page: number;
  slugs: string[];
};

export default async function SubcategoriesList(props: PropsType) {
  const { category, page, slugs } = props;
  const { subcategories, totalCount } = await getSubcategoriesByCategoryId(category.id, page);

  if (totalCount === 0) {
    notFound();
  }

  const parentCategoryPath = `/${BLOG_PREFIX}/${slugs.join('/')}`;

  return (
    <div className={styles.list}>
      {subcategories.map((subcat) => (
        <div key={subcat.id} className={styles.item}>
          <Link href={`${parentCategoryPath}/${subcat.slug}`} className={styles.link}>
            {subcat.title}
            <span className={styles.arrow} aria-hidden="true">
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
          </Link>
        </div>
      ))}
      <Pager page={page} pageLength={SUBCATEGORIES_PER_PAGE} totalLength={totalCount} />
    </div>
  );
}
