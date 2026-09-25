import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "categories" ADD COLUMN "seo_title" varchar;
    ALTER TABLE "posts" ADD COLUMN "seo_title" varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "categories" DROP COLUMN "seo_title";
    ALTER TABLE "posts" DROP COLUMN "seo_title";
  `);
}
