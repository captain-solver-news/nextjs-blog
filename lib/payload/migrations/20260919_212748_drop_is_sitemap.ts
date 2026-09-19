import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "categories" SET "no_index" = true WHERE "is_sitemap" IS NOT TRUE;
    UPDATE "posts" SET "no_index" = true WHERE "is_sitemap" IS NOT TRUE;
  `);

  await db.execute(sql`
    ALTER TABLE "categories" DROP COLUMN "is_sitemap";
    ALTER TABLE "posts" DROP COLUMN "is_sitemap";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "categories" ADD COLUMN "is_sitemap" boolean DEFAULT true;
    ALTER TABLE "posts" ADD COLUMN "is_sitemap" boolean DEFAULT true;
  `);

  await db.execute(sql`
    UPDATE "categories" SET "is_sitemap" = "no_index" IS NOT TRUE;
    UPDATE "posts" SET "is_sitemap" = "no_index" IS NOT TRUE;
  `);
}
