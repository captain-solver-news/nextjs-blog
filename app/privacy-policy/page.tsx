export { privacyPolicyMetadata as metadata } from '@/lib/seo/static';
import { JsonLd } from '@/components/seo/json-ld';
import { privacyPolicySchema } from '@/lib/seo/static';
import getStaticContent from '@/lib/db/actions/get-static-content';
import { mdToHtml } from '@/lib/content/md-to-html';

export default async function PrivacyPage() {
  const content = await getStaticContent('privacy-policy');

  return (
    <>
      <article className="max-w-[740px] mx-auto px-5 pt-8 pb-16">
        <header className="border-b border-[var(--border)] pb-6 mb-12">
          <h1 className="text-headline-xl text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            {content.title}
          </h1>
        </header>
        <div
          className={`prose text-xl text-[var(--text-secondary)]`}
          dangerouslySetInnerHTML={{ __html: await mdToHtml(content.body) }}
          style={{ fontFamily: 'var(--font-ui)' }}
        />
      </article>
      <JsonLd schema={privacyPolicySchema} />
    </>
  );
}
