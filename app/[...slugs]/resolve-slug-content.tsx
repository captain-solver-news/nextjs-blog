import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ReactNode, cache } from 'react';
import { WithContext, Thing } from 'schema-dts';
import getCategoryByFullPath from '@/lib/db/actions/get-category-by-full-path';
import getPostByFullPath from '@/lib/db/actions/get-post-by-full-path';
import PostWrapper from '@/components/wrappers/post-wrapper/post-wrapper';
import CategoryWrapper from '@/components/wrappers/category-wrapper/category-wrapper';
import PostsList from '@/components/lists/posts-list/posts-list';
import SubcategoriesList from '@/components/lists/subcategories-list/subcategories-list';
import { Status } from '@/lib/db/schema/posts';
import { Type } from '@/lib/db/schema/categories';
import { BLOG_PREFIX } from '@/config';
import { generateCategoryMetadata, generateCategorySchema } from '@/lib/seo/category';
import { generatePostMetadata, generatePostSchema } from '@/lib/seo/post';

export const resolveSlugContentCached = cache(async (page: number, ...slugs: string[]) => {
  return resolveSlugContent(slugs, page);
});

export async function resolveSlugContent(
  slugs: string[],
  page: number = 1
): Promise<{ metadata: Metadata; schema: WithContext<Thing>; reactNode: ReactNode }> {
  const prefixSlugs = BLOG_PREFIX.split('/');
  prefixSlugs.forEach((prefixSlug) => {
    if (prefixSlug !== slugs.shift()) {
      notFound();
    }
  });

  const category = await getCategoryByFullPath(slugs);
  if (category?.type === Type.DisplayedAll) {
    const metadata = generateCategoryMetadata(category, slugs);
    const schema = generateCategorySchema(category, slugs);
    const reactNode = (
      <CategoryWrapper title={category.title} description={category.seo_description} slugs={slugs}>
        <SubcategoriesList category={category} page={page} slugs={slugs} />
        <PostsList category={category} page={page} slugs={slugs} />
      </CategoryWrapper>
    );
    return { metadata, schema, reactNode };
  } else if (category?.type === Type.DisplayedSubcategories) {
    const metadata = generateCategoryMetadata(category, slugs);
    const schema = generateCategorySchema(category, slugs);
    const reactNode = (
      <CategoryWrapper title={category.title} description={category.seo_description} slugs={slugs}>
        <SubcategoriesList category={category} page={page} slugs={slugs} />
      </CategoryWrapper>
    );
    return { metadata, schema, reactNode };
  } else if (category?.type === Type.DisplayedPosts) {
    const metadata = generateCategoryMetadata(category, slugs);
    const schema = generateCategorySchema(category, slugs);
    const reactNode = (
      <CategoryWrapper title={category.title} description={category.seo_description} slugs={slugs}>
        <PostsList category={category} page={page} slugs={slugs} />
      </CategoryWrapper>
    );
    return { metadata, schema, reactNode };
  }

  const post = await getPostByFullPath(slugs);
  if (post?.status === Status.Published) {
    const metadata = generatePostMetadata(post, slugs);
    const schema = generatePostSchema(post, slugs);

    const categorySlugs = slugs.slice(0, -1);

    const reactNode = <PostWrapper post={post} categorySlugs={categorySlugs} />;

    return { metadata, schema, reactNode };
  }

  notFound();
}
