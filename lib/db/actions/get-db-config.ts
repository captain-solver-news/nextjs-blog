import { db } from '../client';
import { configs, type Config } from '../schema/configs';
import { eq } from 'drizzle-orm';

export default async function getDbConfig(id: string): Promise<Config | null> {
  const rows = await db.select().from(configs).where(eq(configs.id, id)).limit(1);
  if (!rows || rows.length === 0) {
    return null;
  }

  return rows[0] as Config;
}
