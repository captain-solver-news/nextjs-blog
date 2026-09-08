import { getTableColumns, sql, type SQL } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';

export default function rowJson(table: PgTable): SQL {
  const pairs = Object.entries(getTableColumns(table)).flatMap(([field, column]) => [
    sql.raw(`'${field}'`),
    sql`${column}`,
  ]);

  return sql`json_build_object(${sql.join(pairs, sql`, `)})`;
}
