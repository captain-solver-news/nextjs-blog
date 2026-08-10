CREATE TYPE "public"."category_type" AS ENUM('hidden', 'displayed-all', 'displayed-posts', 'displayed-subcategories');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('published', 'draft');--> statement-breakpoint
CREATE TABLE "authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"bio" text,
	"job_title" varchar(255) NOT NULL,
	"avatar_url" varchar(1024),
	"mini_avatar_url" varchar(1024),
	"github_url" varchar(255),
	"linkedin_url" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"type" "category_type" DEFAULT 'hidden' NOT NULL,
	"weight" integer DEFAULT 0 NOT NULL,
	"parent_id" uuid,
	"seo_description" text,
	"og_image" varchar(1024),
	"is_sitemap" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "configs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"label" varchar(255) NOT NULL,
	"value" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"teaser" text NOT NULL,
	"body" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"category_id" uuid NOT NULL,
	"status" "post_status" DEFAULT 'published' NOT NULL,
	"is_featured" boolean DEFAULT false,
	"seo_description" text,
	"og_image" varchar(1024),
	"is_sitemap" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts_authors" (
	"post_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	CONSTRAINT "posts_authors_post_id_author_id_pk" PRIMARY KEY("post_id","author_id")
);
--> statement-breakpoint
CREATE TABLE "static_contents" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"body" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "category_parents" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts_authors" ADD CONSTRAINT "posts_authors_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts_authors" ADD CONSTRAINT "posts_authors_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_parent_id_idx" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "posts_category_id_idx" ON "posts" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");