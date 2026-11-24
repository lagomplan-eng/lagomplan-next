-- Paid clients, step 2 of 3: link a property (a hotel_partners row) to its client. Run AFTER step 1.
-- Additive only: one nullable column, no default, no backfill. Existing free hotels keep client_id NULL.
-- The live code reads hotel_partners with select('*') and its inserts name their columns, so it ignores this column.
-- Deliberately NOT added here: a rule "a paid property must have a client". Add it later, once the first paid client exists.

ALTER TABLE "public"."hotel_partners"
  ADD COLUMN IF NOT EXISTS "client_id" uuid REFERENCES "public"."hotel_clients" ("id") ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS "hotel_partners_client_idx"
  ON "public"."hotel_partners" ("client_id") WHERE "client_id" IS NOT NULL;
