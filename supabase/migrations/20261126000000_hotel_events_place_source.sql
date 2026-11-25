-- hotel_guide_events: which place a tap belongs to, and where in the guide it happened. NOT applied yet.
-- Additive only: two nullable columns, no default, no backfill, no change to any existing constraint or index.
-- Safe to apply BEFORE the code is live: the live code never names these columns, and the new code works with or without them
-- (if the code is live first, a click is still stored, just without place/source).
-- Nothing about the guest is stored: no cookie, no id, no IP. `place` is a stable id from our own content (the API rejects
-- anything that is not a known id); `source` is one of a fixed list (a mood, a zone tab, a plan).

ALTER TABLE "public"."hotel_guide_events"
  ADD COLUMN IF NOT EXISTS "place"  text CHECK ("place"  IS NULL OR "place"  ~ '^[a-z0-9_]{1,64}$'),
  ADD COLUMN IF NOT EXISTS "source" text CHECK ("source" IS NULL OR "source" ~ '^[a-z0-9_]{1,32}$');
