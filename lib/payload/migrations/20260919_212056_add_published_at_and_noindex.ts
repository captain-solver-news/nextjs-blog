import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "categories" ADD COLUMN "no_index" boolean DEFAULT false;
    ALTER TABLE "posts" ADD COLUMN "published_at" timestamp(3) with time zone;
    ALTER TABLE "posts" ADD COLUMN "no_index" boolean DEFAULT false;
    CREATE INDEX "posts_published_at_idx" ON "posts" USING btree ("published_at");
  `);

  await db.execute(sql`
    UPDATE "posts"
    SET "published_at" = "created_at"
    WHERE "status" = 'published' AND "published_at" IS NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX "posts_published_at_idx";
    ALTER TABLE "categories" DROP COLUMN "no_index";
    ALTER TABLE "posts" DROP COLUMN "published_at";
    ALTER TABLE "posts" DROP COLUMN "no_index";
  `);
}
