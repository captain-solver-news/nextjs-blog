import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" ADD COLUMN "content_updated_at" timestamp(3) with time zone;
    CREATE INDEX "posts_content_updated_at_idx" ON "posts" USING btree ("content_updated_at");
  `);

  await db.execute(sql`
    UPDATE "posts" SET "content_updated_at" = COALESCE("published_at", "created_at");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX "posts_content_updated_at_idx";
    ALTER TABLE "posts" DROP COLUMN "content_updated_at";
  `);
}
