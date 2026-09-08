import { static_contents } from '@/lib/payload/generated-schema';
import { eq } from 'drizzle-orm';
import { defaultContent } from '@/config';
import { getPayload } from 'payload';
import config from '@payload-config';

const staticContentColumns = {
  id: static_contents.id,
  title: static_contents.title,
  body: static_contents.body,
} as const;

export default async function getStaticContent(
  id: string
): Promise<Pick<typeof static_contents.$inferSelect, 'id' | 'title' | 'body'>> {
  const db = (await getPayload({ config })).db.drizzle;

  const rows = await db.select(staticContentColumns).from(static_contents).where(eq(static_contents.id, id)).limit(1);

  if (!rows || rows.length === 0) {
    return defaultContent(id);
  }

  return rows[0];
}
