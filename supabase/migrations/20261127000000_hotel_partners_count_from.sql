-- hotel_partners: the day a hotel's reports start counting (so test visits before go-live stay out). NOT applied yet.
-- Additive only: one nullable date column, no default, no backfill, no change to any constraint or index.
-- Safe to apply BEFORE the code is live (the live code never names it). The code works with or without it:
-- without the column a report counts from the approval date, and saving a "count from" date answers "apply the migration first".
-- NULL = use the approval date.

ALTER TABLE "public"."hotel_partners"
  ADD COLUMN IF NOT EXISTS "count_from" date;
