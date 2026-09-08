import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE
      obj RECORD;
    BEGIN
      FOR obj IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
          AND tablename <> 'payload_migrations'
      LOOP
        EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', obj.tablename);
      END LOOP;

      FOR obj IN
        SELECT c.relname
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relkind IN ('v', 'm')
      LOOP
        EXECUTE format('DROP VIEW IF EXISTS public.%I CASCADE', obj.relname);
      END LOOP;

      FOR obj IN
        SELECT t.typname
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public' AND t.typtype = 'e'
      LOOP
        EXECUTE format('DROP TYPE IF EXISTS public.%I CASCADE', obj.typname);
      END LOOP;
    END $$;

    DROP SCHEMA IF EXISTS "drizzle" CASCADE;
  `);

  await db.execute(sql`
    CREATE TYPE "public"."enum_posts_status" AS ENUM('published', 'draft');
    CREATE TYPE "public"."enum_categories_type" AS ENUM('hidden', 'displayed-all', 'displayed-posts', 'displayed-subcategories');
  `);

  await db.execute(sql`
    CREATE TABLE "categories" (
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

    CREATE TABLE "authors" (
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

    CREATE TABLE "posts" (
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

    CREATE TABLE "posts_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" uuid NOT NULL,
      "path" varchar NOT NULL,
      "authors_id" uuid
    );

    CREATE TABLE "static_contents" (
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "body" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "configs" (
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "value" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "users" (
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

    CREATE TABLE "users_sessions" (
      "_order" integer NOT NULL,
      "_parent_id" uuid NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "created_at" timestamp(3) with time zone,
      "expires_at" timestamp(3) with time zone NOT NULL
    );

    CREATE TABLE "payload_kv" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "key" varchar NOT NULL,
      "data" jsonb NOT NULL
    );

    CREATE TABLE "payload_locked_documents" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "global_slug" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "payload_locked_documents_rels" (
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

    CREATE TABLE "payload_preferences" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "key" varchar,
      "value" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "payload_preferences_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" uuid NOT NULL,
      "path" varchar NOT NULL,
      "users_id" uuid
    );
  `);

  await db.execute(sql`
    ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk"
      FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_authors_fk"
      FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk"
      FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk"
      FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk"
      FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_static_contents_fk"
      FOREIGN KEY ("static_contents_id") REFERENCES "public"."static_contents"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_configs_fk"
      FOREIGN KEY ("configs_id") REFERENCES "public"."configs"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk"
      FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk"
      FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  `);

  await db.execute(sql`
    CREATE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
    CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
    CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
    CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
    CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
    CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
    CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
    CREATE INDEX "posts_rels_authors_id_idx" ON "posts_rels" USING btree ("authors_id");
    CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
    CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
    CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
    CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
    CREATE UNIQUE INDEX "authors_slug_idx" ON "authors" USING btree ("slug");
    CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
    CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
    CREATE INDEX "static_contents_updated_at_idx" ON "static_contents" USING btree ("updated_at");
    CREATE INDEX "static_contents_created_at_idx" ON "static_contents" USING btree ("created_at");
    CREATE INDEX "configs_updated_at_idx" ON "configs" USING btree ("updated_at");
    CREATE INDEX "configs_created_at_idx" ON "configs" USING btree ("created_at");
    CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
    CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
    CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
    CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
    CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
    CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
    CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
    CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
    CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
    CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
    CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
    CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
    CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
    CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
    CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
    CREATE INDEX "payload_locked_documents_rels_static_contents_id_idx" ON "payload_locked_documents_rels" USING btree ("static_contents_id");
    CREATE INDEX "payload_locked_documents_rels_configs_id_idx" ON "payload_locked_documents_rels" USING btree ("configs_id");
    CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
    CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
    CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
    CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
    CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
    CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
    CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
    CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "payload_preferences_rels" CASCADE;
    DROP TABLE IF EXISTS "payload_preferences" CASCADE;
    DROP TABLE IF EXISTS "payload_locked_documents_rels" CASCADE;
    DROP TABLE IF EXISTS "payload_locked_documents" CASCADE;
    DROP TABLE IF EXISTS "payload_kv" CASCADE;
    DROP TABLE IF EXISTS "users_sessions" CASCADE;
    DROP TABLE IF EXISTS "users" CASCADE;
    DROP TABLE IF EXISTS "configs" CASCADE;
    DROP TABLE IF EXISTS "static_contents" CASCADE;
    DROP TABLE IF EXISTS "posts_authors" CASCADE;
    DROP TABLE IF EXISTS "posts_rels" CASCADE;
    DROP TABLE IF EXISTS "posts" CASCADE;
    DROP TABLE IF EXISTS "authors" CASCADE;
    DROP TABLE IF EXISTS "categories" CASCADE;

    DROP TYPE IF EXISTS "public"."enum_posts_status";
    DROP TYPE IF EXISTS "public"."enum_categories_type";
  `);
}
