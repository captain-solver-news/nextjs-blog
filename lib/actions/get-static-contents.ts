import { static_contents } from '@/lib/payload/generated-schema';
import { inArray } from 'drizzle-orm';
import { defaultContent } from '@/config';
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function getStaticContents(
  ids: string[]
): Promise<Pick<typeof static_contents.$inferSelect, 'id' | 'title' | 'body'>[]> {
  const db = (await getPayload({ config })).db.drizzle;

  const rows = await db
    .select({ id: static_contents.id, title: static_contents.title, body: static_contents.body })
    .from(static_contents)
    .where(inArray(static_contents.id, ids));

  const found = new Map(rows.map((r) => [r.id, r]));

  return ids.map((id) => found.get(id) ?? defaultContent(id));
}
