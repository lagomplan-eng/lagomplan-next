-- Paid clients, step 3 of 3: monthly reports, one row per client, property and month. Run AFTER steps 1 and 2.
-- Additive only: one new table. property_id NULL = a report for the whole client. `period` is "YYYY-MM" (Mexico City months).
-- Service-role only: RLS on, deliberately no policies.

CREATE TABLE IF NOT EXISTS "public"."hotel_reports" (
  "id"          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  "client_id"   uuid        NOT NULL REFERENCES "public"."hotel_clients" ("id") ON DELETE CASCADE,
  "property_id" uuid        REFERENCES "public"."hotel_partners" ("id") ON DELETE CASCADE,
  "period"      text        NOT NULL CHECK ("period" ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  "data"        jsonb       NOT NULL,
  "sent_at"     timestamptz,
  "created_at"  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "hotel_reports_client_property_period_uniq"
  ON "public"."hotel_reports" ("client_id", COALESCE("property_id", '00000000-0000-0000-0000-000000000000'::uuid), "period");
CREATE INDEX IF NOT EXISTS "hotel_reports_client_idx" ON "public"."hotel_reports" ("client_id", "period" DESC);

ALTER TABLE "public"."hotel_reports" ENABLE ROW LEVEL SECURITY;
