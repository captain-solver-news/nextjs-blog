import { static_contents } from '@/lib/payload/generated-schema';
import { eq } from 'drizzle-orm';
import { defaultContent } from '@/config';
import type { StaticContent } from './types/static-content';
import { getPayload } from 'payload';
import config from '@payload-config';
import populateLexicalUploads from '../utils/populate-lexical-uploads';

const staticContentColumns = {
  id: static_contents.id,
  title: static_contents.title,
  body: static_contents.body,
} as const;

export default async function getStaticContent(id: string): Promise<StaticContent> {
  const db = (await getPayload({ config })).db.drizzle;

  const rows = await db.select(staticContentColumns).from(static_contents).where(eq(static_contents.id, id)).limit(1);

  if (!rows || rows.length === 0) {
    return defaultContent(id);
  }

  const content = rows[0] as StaticContent;

  return { ...content, body: await populateLexicalUploads(content.body) };
}
