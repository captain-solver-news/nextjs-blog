import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "authors" ALTER COLUMN "bio" SET NOT NULL;
  ALTER TABLE "posts" ADD COLUMN "og_image_media_id" uuid;
  ALTER TABLE "categories" ADD COLUMN "og_image_media_id" uuid;
  ALTER TABLE "authors" ADD COLUMN "avatar_dark_id" uuid;
  ALTER TABLE "authors" ADD COLUMN "avatar_dark_hovered_id" uuid;
  ALTER TABLE "authors" ADD COLUMN "avatar_light_id" uuid;
  ALTER TABLE "authors" ADD COLUMN "avatar_light_hovered_id" uuid;
  ALTER TABLE "authors" ADD COLUMN "mini_avatar_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "media_id" uuid;
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  ALTER TABLE "posts" ADD CONSTRAINT "posts_og_image_media_id_media_id_fk" FOREIGN KEY ("og_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_og_image_media_id_media_id_fk" FOREIGN KEY ("og_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_avatar_dark_id_media_id_fk" FOREIGN KEY ("avatar_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_avatar_dark_hovered_id_media_id_fk" FOREIGN KEY ("avatar_dark_hovered_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_avatar_light_id_media_id_fk" FOREIGN KEY ("avatar_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_avatar_light_hovered_id_media_id_fk" FOREIGN KEY ("avatar_light_hovered_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_mini_avatar_id_media_id_fk" FOREIGN KEY ("mini_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_og_image_media_idx" ON "posts" USING btree ("og_image_media_id");
  CREATE INDEX "categories_og_image_media_idx" ON "categories" USING btree ("og_image_media_id");
  CREATE INDEX "authors_avatar_dark_idx" ON "authors" USING btree ("avatar_dark_id");
  CREATE INDEX "authors_avatar_dark_hovered_idx" ON "authors" USING btree ("avatar_dark_hovered_id");
  CREATE INDEX "authors_avatar_light_idx" ON "authors" USING btree ("avatar_light_id");
  CREATE INDEX "authors_avatar_light_hovered_idx" ON "authors" USING btree ("avatar_light_hovered_id");
  CREATE INDEX "authors_mini_avatar_idx" ON "authors" USING btree ("mini_avatar_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories" DROP CONSTRAINT "categories_og_image_media_id_media_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_og_image_media_id_media_id_fk";
  
  ALTER TABLE "authors" DROP CONSTRAINT "authors_avatar_dark_id_media_id_fk";
  
  ALTER TABLE "authors" DROP CONSTRAINT "authors_avatar_dark_hovered_id_media_id_fk";
  
  ALTER TABLE "authors" DROP CONSTRAINT "authors_avatar_light_id_media_id_fk";
  
  ALTER TABLE "authors" DROP CONSTRAINT "authors_avatar_light_hovered_id_media_id_fk";
  
  ALTER TABLE "authors" DROP CONSTRAINT "authors_mini_avatar_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_media_fk";
  
  DROP INDEX "categories_og_image_media_idx";
  DROP INDEX "posts_og_image_media_idx";
  DROP INDEX "authors_avatar_dark_idx";
  DROP INDEX "authors_avatar_dark_hovered_idx";
  DROP INDEX "authors_avatar_light_idx";
  DROP INDEX "authors_avatar_light_hovered_idx";
  DROP INDEX "authors_mini_avatar_idx";
  DROP INDEX "payload_locked_documents_rels_media_id_idx";
  ALTER TABLE "authors" ALTER COLUMN "bio" DROP NOT NULL;
  ALTER TABLE "categories" DROP COLUMN "og_image_media_id";
  ALTER TABLE "posts" DROP COLUMN "og_image_media_id";
  ALTER TABLE "authors" DROP COLUMN "avatar_dark_id";
  ALTER TABLE "authors" DROP COLUMN "avatar_dark_hovered_id";
  ALTER TABLE "authors" DROP COLUMN "avatar_light_id";
  ALTER TABLE "authors" DROP COLUMN "avatar_light_hovered_id";
  ALTER TABLE "authors" DROP COLUMN "mini_avatar_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "media_id";
  ALTER TABLE "media" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "media";`);
}
