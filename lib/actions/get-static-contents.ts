import { static_contents } from '@/lib/payload/generated-schema';
import { inArray } from 'drizzle-orm';
import { defaultContent } from '@/config';
import type { StaticContent } from './types/static-content';
import { getPayload } from 'payload';
import config from '@payload-config';
import populateLexicalUploads from '../utils/populate-lexical-uploads';

export default async function getStaticContents(ids: string[]): Promise<StaticContent[]> {
  const db = (await getPayload({ config })).db.drizzle;

  const rows = (await db
    .select({ id: static_contents.id, title: static_contents.title, body: static_contents.body })
    .from(static_contents)
    .where(inArray(static_contents.id, ids))) as StaticContent[];

  const found = new Map(rows.map((r) => [r.id, r]));

  return Promise.all(
    ids.map(async (id) => {
      const content = found.get(id) ?? defaultContent(id);

      return { ...content, body: await populateLexicalUploads(content.body) };
    })
  );
}
