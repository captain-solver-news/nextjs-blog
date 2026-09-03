/**
 * Postgres `timestamp` columns come back as strings whenever no drizzle column mapper is
 * involved — raw `db.execute` rows and bare `sql<T>` expressions both hit this. Drizzle's own
 * mapper reads such values as UTC, so append the offset to stay consistent with the query builder.
 */
export default function toDate(value: string): Date {
  return new Date(`${value}+0000`);
}
