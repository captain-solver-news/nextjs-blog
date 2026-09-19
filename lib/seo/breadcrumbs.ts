import type { BreadcrumbList, ListItem } from 'schema-dts';
import { BLOG_PREFIX } from '@/config';
import type { CategoryBreadcrumb } from '@/lib/actions/get-category-breadcrumbs';
import { toAbsoluteUrl } from './url';

type TrailingCrumb = {
  name: string;
  path: string;
};

export function generateBreadcrumbSchema(
  categoryCrumbs: CategoryBreadcrumb[],
  trailing?: TrailingCrumb
): BreadcrumbList {
  const items: TrailingCrumb[] = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: `/${BLOG_PREFIX}` },
    ...categoryCrumbs.map((crumb) => ({
      name: crumb.title,
      path: `/${BLOG_PREFIX}/${crumb.fullPath}`,
    })),
    ...(trailing ? [trailing] : []),
  ];

  const itemListElement: ListItem[] = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: toAbsoluteUrl(item.path),
  }));

  return {
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}
