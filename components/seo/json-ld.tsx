import Script from 'next/script';
import { WithContext, Thing } from 'schema-dts';

type PropsType = {
  schema: WithContext<Thing>;
};

export function JsonLdHead(props: PropsType) {
  const { schema } = props;

  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      id="schema-org"
      strategy="beforeInteractive"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function JsonLd(props: PropsType) {
  const { schema } = props;

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
