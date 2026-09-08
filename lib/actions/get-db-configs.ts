import { configs } from '@/lib/payload/generated-schema';
import { inArray } from 'drizzle-orm';
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function getDbConfigs(ids: string[]): Promise<(typeof configs.$inferSelect)[]> {
  const db = (await getPayload({ config })).db.drizzle;

  return db.select().from(configs).where(inArray(configs.id, ids));
}
