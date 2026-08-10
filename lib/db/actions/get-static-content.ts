import { db } from '../client';
import { staticContents, StaticContent } from '../schema/static-contents';
import { eq } from 'drizzle-orm';
import { defaultContent } from '@/config';

export default async function getStaticContent(id: string): Promise<StaticContent> {
  const rows = await db.select().from(staticContents).where(eq(staticContents.id, id)).limit(1);

  if (!rows || rows.length === 0) {
    return defaultContent(id);
  }

  return rows[0] as StaticContent;
}
