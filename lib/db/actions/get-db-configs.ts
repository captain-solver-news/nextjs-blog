import { db } from '../client';
import { configs, type Config } from '../schema/configs';
import { inArray } from 'drizzle-orm';

export default async function getDbConfigs(ids: string[]): Promise<Config[]> {
  return db.select().from(configs).where(inArray(configs.id, ids));
}
