import { db } from '../client';
import { staticContents, StaticContent } from '../schema/static-contents';
import { inArray } from 'drizzle-orm';
import { defaultContent } from '@/config';

export default async function getStaticContents(ids: string[]): Promise<StaticContent[]> {
  const rows = await db.select().from(staticContents).where(inArray(staticContents.id, ids));

  const found = new Map(rows.map((r) => [r.id, r]));

  return ids.map((id) => (found.has(id) ? (found.get(id) as StaticContent) : defaultContent(id)));
}
