import { Metadata } from 'next';
import { ReactNode } from 'react';
import { resolveSlugContentCached } from './resolve-slug-content';
import { JsonLd } from '@/components/seo/json-ld';
import './page.module.scss';

type PropsType = {
  params: Promise<{ slugs: string[] }>;
  searchParams?: Promise<{ page: string }>;
};

export async function generateMetadata(props: PropsType): Promise<Metadata> {
  const { slugs } = await props.params;
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;

  const { metadata } = await resolveSlugContentCached(page, ...slugs);
  return metadata;
}

export default async function Page(props: PropsType): Promise<ReactNode> {
  const { slugs } = await props.params;
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;

  const { reactNode, schema } = await resolveSlugContentCached(page, ...slugs);
  return (
    <>
      {reactNode}
      <JsonLd schema={schema} />
    </>
  );
}
