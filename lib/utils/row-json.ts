import { getTableColumns, sql, type SQL } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';

export default function rowJson(table: PgTable, extra: Record<string, SQL> = {}): SQL {
  const pairs = [...Object.entries(getTableColumns(table)), ...Object.entries(extra)].flatMap(([field, value]) => [
    sql.raw(`'${field}'`),
    sql`${value}`,
  ]);

  return sql`json_build_object(${sql.join(pairs, sql`, `)})`;
}
