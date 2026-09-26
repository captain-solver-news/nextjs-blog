import { and, asc, eq } from 'drizzle-orm';
import { authors, posts, posts_rels } from '@/lib/payload/generated-schema';
import { Status } from '@/lib/payload/taxonomy';
import { getPayload } from 'payload';
import config from '@payload-config';

export type LlmsAuthorRow = {
  slug: string;
  name: string;
  jobTitle: string;
};

export default async function getLlmsAuthors(): Promise<LlmsAuthorRow[]> {
  const db = (await getPayload({ config })).db.drizzle;

  return db
    .selectDistinct({ slug: authors.slug, name: authors.name, jobTitle: authors.jobTitle })
    .from(authors)
    .innerJoin(posts_rels, and(eq(posts_rels.authorsID, authors.id), eq(posts_rels.path, 'authors')))
    .innerJoin(posts, and(eq(posts.id, posts_rels.parent), eq(posts.status, Status.Published)))
    .orderBy(asc(authors.name));
}
