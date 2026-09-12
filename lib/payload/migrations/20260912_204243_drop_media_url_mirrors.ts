import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories" DROP COLUMN "og_image";
  ALTER TABLE "posts" DROP COLUMN "og_image";
  ALTER TABLE "authors" DROP COLUMN "avatar_dark_url";
  ALTER TABLE "authors" DROP COLUMN "avatar_dark_hovered_url";
  ALTER TABLE "authors" DROP COLUMN "avatar_light_url";
  ALTER TABLE "authors" DROP COLUMN "avatar_light_hovered_url";
  ALTER TABLE "authors" DROP COLUMN "mini_avatar_url";`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories" ADD COLUMN "og_image" varchar;
  ALTER TABLE "posts" ADD COLUMN "og_image" varchar;
  ALTER TABLE "authors" ADD COLUMN "avatar_dark_url" varchar;
  ALTER TABLE "authors" ADD COLUMN "avatar_dark_hovered_url" varchar;
  ALTER TABLE "authors" ADD COLUMN "avatar_light_url" varchar;
  ALTER TABLE "authors" ADD COLUMN "avatar_light_hovered_url" varchar;
  ALTER TABLE "authors" ADD COLUMN "mini_avatar_url" varchar;`);
}
