import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * Initial Payload schema.
 *
 * This migration is *adoptive*: it brings up Payload's schema on an empty database AND takes
 * ownership of the pre-Payload tables (posts, categories, authors, static_contents, configs,
 * posts_authors) that drizzle-kit used to manage, without losing a row. Every statement is
 * written to be a no-op when the target is already in the desired shape, so the same file is
 * correct for a fresh deploy and for the existing blog database.
 *
 * The shape produced here is byte-for-byte what `payload migrate:create` generates from the
 * collection configs, so future schema diffs stay clean.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // --- Enum types -------------------------------------------------------------------------
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_posts_status" AS ENUM('published', 'draft');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_categories_type" AS ENUM('hidden', 'displayed-all', 'displayed-posts', 'displayed-subcategories');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);

  // --- Tables -----------------------------------------------------------------------------
  // Skipped wholesale on the existing database; the adoption block below reshapes what is there.
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "categories" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "parent_id" uuid,
      "type" "enum_categories_type" DEFAULT 'hidden' NOT NULL,
      "weight" numeric DEFAULT 0 NOT NULL,
      "seo_description" varchar,
      "og_image" varchar,
      "is_sitemap" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "authors" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "job_title" varchar NOT NULL,
      "bio" varchar,
      "avatar_dark_url" varchar,
      "avatar_dark_hovered_url" varchar,
      "avatar_light_url" varchar,
      "avatar_light_hovered_url" varchar,
      "mini_avatar_url" varchar,
      "github_url" varchar,
      "linkedin_url" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "posts" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "category_id" uuid NOT NULL,
      "teaser" varchar NOT NULL,
      "body" varchar NOT NULL,
      "status" "enum_posts_status" DEFAULT 'published' NOT NULL,
      "is_featured" boolean DEFAULT false,
      "seo_description" varchar,
      "og_image" varchar,
      "is_sitemap" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "posts_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" uuid NOT NULL,
      "path" varchar NOT NULL,
      "authors_id" uuid
    );

    CREATE TABLE IF NOT EXISTS "static_contents" (
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "body" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "configs" (
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "value" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "users" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "email" varchar NOT NULL,
      "reset_password_token" varchar,
      "reset_password_expiration" timestamp(3) with time zone,
      "salt" varchar,
      "hash" varchar,
      "login_attempts" numeric DEFAULT 0,
      "lock_until" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "users_sessions" (
      "_order" integer NOT NULL,
      "_parent_id" uuid NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "created_at" timestamp(3) with time zone,
      "expires_at" timestamp(3) with time zone NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "payload_kv" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "key" varchar NOT NULL,
      "data" jsonb NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "global_slug" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" uuid NOT NULL,
      "path" varchar NOT NULL,
      "posts_id" uuid,
      "categories_id" uuid,
      "authors_id" uuid,
      "static_contents_id" varchar,
      "configs_id" varchar,
      "users_id" uuid
    );

    CREATE TABLE IF NOT EXISTS "payload_preferences" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "key" varchar,
      "value" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" uuid NOT NULL,
      "path" varchar NOT NULL,
      "users_id" uuid
    );

    CREATE TABLE IF NOT EXISTS "payload_migrations" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" varchar,
      "batch" numeric,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `);

  // --- Adoption: reshape the drizzle-era content tables ------------------------------------
  // Column widths: drizzle pinned varchar(255)/varchar(1024) and used `text` for long copy.
  // Payload emits unbounded `varchar` for both. Widening never rejects existing data.
  await db.execute(sql`
    ALTER TABLE "categories"
      ALTER COLUMN "title" TYPE varchar,
      ALTER COLUMN "slug" TYPE varchar,
      ALTER COLUMN "seo_description" TYPE varchar,
      ALTER COLUMN "og_image" TYPE varchar,
      ALTER COLUMN "weight" TYPE numeric;

    ALTER TABLE "authors"
      ALTER COLUMN "name" TYPE varchar,
      ALTER COLUMN "slug" TYPE varchar,
      ALTER COLUMN "job_title" TYPE varchar,
      ALTER COLUMN "bio" TYPE varchar,
      ALTER COLUMN "avatar_dark_url" TYPE varchar,
      ALTER COLUMN "avatar_dark_hovered_url" TYPE varchar,
      ALTER COLUMN "avatar_light_url" TYPE varchar,
      ALTER COLUMN "avatar_light_hovered_url" TYPE varchar,
      ALTER COLUMN "mini_avatar_url" TYPE varchar,
      ALTER COLUMN "github_url" TYPE varchar,
      ALTER COLUMN "linkedin_url" TYPE varchar;

    ALTER TABLE "posts"
      ALTER COLUMN "title" TYPE varchar,
      ALTER COLUMN "slug" TYPE varchar,
      ALTER COLUMN "teaser" TYPE varchar,
      ALTER COLUMN "body" TYPE varchar,
      ALTER COLUMN "seo_description" TYPE varchar,
      ALTER COLUMN "og_image" TYPE varchar;

    ALTER TABLE "static_contents"
      ALTER COLUMN "id" TYPE varchar,
      ALTER COLUMN "title" TYPE varchar,
      ALTER COLUMN "body" TYPE varchar;

    ALTER TABLE "configs"
      ALTER COLUMN "id" TYPE varchar,
      ALTER COLUMN "label" TYPE varchar,
      ALTER COLUMN "value" TYPE varchar;
  `);

  // Enum swap: the drizzle-era types were named `post_status` / `category_type`. Values are
  // identical, so the cast goes through text. Defaults must be dropped first — a default is
  // typed against the old enum and blocks the ALTER.
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'posts'
          AND column_name = 'status' AND udt_name = 'post_status'
      ) THEN
        ALTER TABLE "posts" ALTER COLUMN "status" DROP DEFAULT;
        ALTER TABLE "posts" ALTER COLUMN "status" TYPE "public"."enum_posts_status"
          USING "status"::text::"public"."enum_posts_status";
        ALTER TABLE "posts" ALTER COLUMN "status" SET DEFAULT 'published';
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'categories'
          AND column_name = 'type' AND udt_name = 'category_type'
      ) THEN
        ALTER TABLE "categories" ALTER COLUMN "type" DROP DEFAULT;
        ALTER TABLE "categories" ALTER COLUMN "type" TYPE "public"."enum_categories_type"
          USING "type"::text::"public"."enum_categories_type";
        ALTER TABLE "categories" ALTER COLUMN "type" SET DEFAULT 'hidden';
      END IF;
    END $$;

    DROP TYPE IF EXISTS "public"."post_status";
    DROP TYPE IF EXISTS "public"."category_type";
  `);

  // Payload timestamps: every collection carries created_at/updated_at, timestamptz(3).
  // posts already had both as naive `timestamp`; those values were written as UTC, so the
  // conversion pins them to UTC rather than the server's local zone.
  await db.execute(sql`
    ALTER TABLE "posts"
      ALTER COLUMN "created_at" TYPE timestamp(3) with time zone USING "created_at" AT TIME ZONE 'UTC',
      ALTER COLUMN "updated_at" TYPE timestamp(3) with time zone USING "updated_at" AT TIME ZONE 'UTC';

    ALTER TABLE "categories"
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;

    ALTER TABLE "authors"
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;

    ALTER TABLE "static_contents"
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;

    ALTER TABLE "configs"
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  `);

  // posts_authors was a plain join table; Payload models hasMany relationships in `<table>_rels`,
  // discriminated by `path`. Copy the pairs across before dropping it.
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'posts_authors'
      ) THEN
        INSERT INTO "posts_rels" ("order", "parent_id", "path", "authors_id")
        SELECT
          row_number() OVER (PARTITION BY pa.post_id ORDER BY a.name),
          pa.post_id,
          'authors',
          pa.author_id
        FROM "posts_authors" pa
        JOIN "authors" a ON a.id = pa.author_id
        WHERE NOT EXISTS (
          SELECT 1 FROM "posts_rels" r
          WHERE r.parent_id = pa.post_id AND r.path = 'authors' AND r.authors_id = pa.author_id
        );

        DROP TABLE "posts_authors";
      END IF;
    END $$;
  `);

  // --- Foreign keys -----------------------------------------------------------------------
  // Dropped first so the drizzle-era names and ON DELETE rules converge on Payload's.
  await db.execute(sql`
    ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "category_parents";
    ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "categories_parent_id_categories_id_fk";
    ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "posts" DROP CONSTRAINT IF EXISTS "posts_category_id_categories_id_fk";
    ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk"
      FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "posts_rels" DROP CONSTRAINT IF EXISTS "posts_rels_parent_fk";
    ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "posts_rels" DROP CONSTRAINT IF EXISTS "posts_rels_authors_fk";
    ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_authors_fk"
      FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "users_sessions" DROP CONSTRAINT IF EXISTS "users_sessions_parent_id_fk";
    ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_parent_fk";
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_posts_fk";
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk"
      FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_categories_fk";
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk"
      FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_authors_fk";
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk"
      FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_static_contents_fk";
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_static_contents_fk"
      FOREIGN KEY ("static_contents_id") REFERENCES "public"."static_contents"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_configs_fk";
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_configs_fk"
      FOREIGN KEY ("configs_id") REFERENCES "public"."configs"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_users_fk";
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk"
      FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT IF EXISTS "payload_preferences_rels_parent_fk";
    ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT IF EXISTS "payload_preferences_rels_users_fk";
    ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk"
      FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  `);

  // --- Indexes ----------------------------------------------------------------------------
  // drizzle named the relationship indexes `*_parent_id_idx` / `*_category_id_idx`; Payload
  // drops the `_id`. Renaming keeps a single index rather than leaving a duplicate behind.
  await db.execute(sql`
    ALTER INDEX IF EXISTS "categories_parent_id_idx" RENAME TO "categories_parent_idx";
    ALTER INDEX IF EXISTS "posts_category_id_idx" RENAME TO "posts_category_idx";

    CREATE INDEX IF NOT EXISTS "posts_slug_idx" ON "posts" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "posts_category_idx" ON "posts" USING btree ("category_id");
    CREATE INDEX IF NOT EXISTS "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "posts_created_at_idx" ON "posts" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "posts_rels_authors_id_idx" ON "posts_rels" USING btree ("authors_id");
    CREATE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "categories_parent_idx" ON "categories" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "categories_created_at_idx" ON "categories" USING btree ("created_at");
    CREATE UNIQUE INDEX IF NOT EXISTS "authors_slug_idx" ON "authors" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "authors_created_at_idx" ON "authors" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "static_contents_updated_at_idx" ON "static_contents" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "static_contents_created_at_idx" ON "static_contents" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "configs_updated_at_idx" ON "configs" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "configs_created_at_idx" ON "configs" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
    CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
    CREATE UNIQUE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_static_contents_id_idx" ON "payload_locked_documents_rels" USING btree ("static_contents_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_configs_id_idx" ON "payload_locked_documents_rels" USING btree ("configs_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
    CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
    CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  `);

  // The drizzle-kit bookkeeping schema is no longer consulted: Payload owns these tables now.
  await db.execute(sql`DROP SCHEMA IF EXISTS "drizzle" CASCADE;`);
}

/**
 * Removes only what Payload added. The content tables are intentionally left in place — this
 * migration adopted them rather than creating them, so dropping them would destroy blog data
 * that predates Payload.
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "payload_preferences_rels" CASCADE;
    DROP TABLE IF EXISTS "payload_preferences" CASCADE;
    DROP TABLE IF EXISTS "payload_locked_documents_rels" CASCADE;
    DROP TABLE IF EXISTS "payload_locked_documents" CASCADE;
    DROP TABLE IF EXISTS "payload_kv" CASCADE;
    DROP TABLE IF EXISTS "users_sessions" CASCADE;
    DROP TABLE IF EXISTS "users" CASCADE;
  `);
}
