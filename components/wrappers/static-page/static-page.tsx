import type { ReactNode } from 'react';
import { Container } from '@/components/primitives/container/container';
import styles from './static-page.module.scss';

interface StaticPageProps {
  title: string | null;
  bodyHtml: string;
  children?: ReactNode;
}

export function StaticPage({ title, bodyHtml, children }: StaticPageProps) {
  return (
    <Container as="article" className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.heading}>{title}</h1>
      </header>
      <div className="prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      {children}
    </Container>
  );
}
