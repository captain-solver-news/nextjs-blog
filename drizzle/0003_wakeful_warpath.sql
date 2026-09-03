ALTER TABLE "authors" ADD COLUMN "slug" varchar(255);--> statement-breakpoint

UPDATE "authors" a
SET "slug" = s.slug
FROM (
  SELECT id,
         CASE WHEN row_number() OVER (PARTITION BY base ORDER BY name, id) = 1
              THEN base
              ELSE base || '-' || row_number() OVER (PARTITION BY base ORDER BY name, id)
         END AS slug
  FROM (
    SELECT id, name,
           trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g')) AS base
    FROM "authors"
  ) t
) s
WHERE a.id = s.id;--> statement-breakpoint

ALTER TABLE "authors" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "authors_slug_idx" ON "authors" USING btree ("slug");
