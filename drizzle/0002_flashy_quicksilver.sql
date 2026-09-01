ALTER TABLE "authors" RENAME COLUMN "avatar_url" TO "avatar_dark_url";--> statement-breakpoint
ALTER TABLE "authors" RENAME COLUMN "avatar_hovered_url" TO "avatar_dark_hovered_url";--> statement-breakpoint
ALTER TABLE "authors" ADD COLUMN "avatar_light_url" varchar(1024);--> statement-breakpoint
ALTER TABLE "authors" ADD COLUMN "avatar_light_hovered_url" varchar(1024);