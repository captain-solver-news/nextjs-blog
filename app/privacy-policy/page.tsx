export { privacyPolicyMetadata as metadata } from '@/lib/seo/static';
import { JsonLd } from '@/components/seo/json-ld';
import { privacyPolicySchema } from '@/lib/seo/static';
import getStaticContent from '@/lib/db/actions/get-static-content';
import { mdToHtml } from '@/lib/content/md-to-html';
import { StaticPage } from '@/components/wrappers/static-page/static-page';

export default async function PrivacyPage() {
  const content = await getStaticContent('privacy-policy');

  return (
    <>
      <StaticPage title={content.title} bodyHtml={await mdToHtml(content.body)} />
      <JsonLd schema={privacyPolicySchema} />
    </>
  );
}
