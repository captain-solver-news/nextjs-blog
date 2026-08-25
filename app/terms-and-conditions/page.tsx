export { termsAndConditionsMetadata as metadata } from '@/lib/seo/static';
import { JsonLd } from '@/components/seo/json-ld';
import { termsAndConditionsSchema } from '@/lib/seo/static';
import getStaticContent from '@/lib/db/actions/get-static-content';
import { mdToHtml } from '@/lib/content/md-to-html';
import { StaticPage } from '@/components/wrappers/static-page/static-page';

export default async function TermsAndConditionsPage() {
  const content = await getStaticContent('terms-and-conditions');

  return (
    <>
      <StaticPage title={content.title} bodyHtml={await mdToHtml(content.body)} />
      <JsonLd schema={termsAndConditionsSchema} />
    </>
  );
}
