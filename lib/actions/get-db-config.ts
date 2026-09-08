import { configs } from '@/lib/payload/generated-schema';
import { eq } from 'drizzle-orm';
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function getDbConfig(id: string): Promise<typeof configs.$inferSelect | null> {
  const db = (await getPayload({ config })).db.drizzle;

  const rows = await db.select().from(configs).where(eq(configs.id, id)).limit(1);
  if (!rows || rows.length === 0) {
    return null;
  }

  return rows[0];
}
