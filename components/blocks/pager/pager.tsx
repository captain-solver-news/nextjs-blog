import Link from 'next/link';
import styles from './pager.module.scss';

type PropsType = {
  page: number;
  pageLength: number;
  totalLength: number;
};

export default function Pager(props: PropsType) {
  const { page, pageLength, totalLength } = props;
  const totalPages = Math.ceil(totalLength / pageLength);

  if (totalPages <= 1) {
    return null;
  }

  const buildHref = (targetPage: number) => `?page=${targetPage}`;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.pager}>
      {pages.map((pageNumber) => {
        const isActive = pageNumber === page;
        return (
          <Link
            key={pageNumber}
            href={buildHref(pageNumber)}
            aria-current={isActive ? 'page' : undefined}
            className={`${styles.link} ${isActive ? styles.activeLink : ''}`.trim()}
          >
            {pageNumber}
          </Link>
        );
      })}
    </div>
  );
}
