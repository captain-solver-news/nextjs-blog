export { termsAndConditionsMetadata as metadata } from '@/lib/seo/static';
import { JsonLd } from '@/components/seo/json-ld';
import { termsAndConditionsSchema } from '@/lib/seo/static';
import getStaticContent from '@/lib/db/actions/get-static-content';
import { mdToHtml } from '@/lib/content/md-to-html';
import styles from './page.module.scss';

export default async function TermsAndConditionsPage() {
  const content = await getStaticContent('terms-and-conditions');

  return (
    <>
      <article className="max-w-[740px] mx-auto px-5 pt-8 pb-16">
        <header className="border-b border-[var(--border)] pb-6 mb-12">
          <h1
            className={`${styles.heading} text-headline-xl text-[var(--text-primary)]`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {content.title}
          </h1>
        </header>
        <div
          className={`prose text-xl text-[var(--text-secondary)]`}
          dangerouslySetInnerHTML={{ __html: await mdToHtml(content.body) }}
          style={{ fontFamily: 'var(--font-ui)' }}
        />
      </article>
      <JsonLd schema={termsAndConditionsSchema} />
    </>
  );
}
