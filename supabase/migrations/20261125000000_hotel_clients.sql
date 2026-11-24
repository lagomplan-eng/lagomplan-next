-- Paid clients, step 1 of 3: the client table. A client is a hotel (one property) or an operator (many properties).
-- Additive only: one new table, nothing existing is touched. NOT applied yet.
-- Service-role only, like the other hotel tables: RLS on, deliberately no policies.

CREATE TABLE IF NOT EXISTS "public"."hotel_clients" (
  "id"         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug"       text        NOT NULL UNIQUE CHECK ("slug" ~ '^[a-z0-9][a-z0-9-]{1,62}$'),   -- matches the client's content file
  "name"       text        NOT NULL CHECK (char_length("name") BETWEEN 1 AND 160),
  "kind"       text        NOT NULL DEFAULT 'hotel' CHECK ("kind" IN ('hotel', 'operator', 'legacy')),
  "notes"      text        CHECK ("notes" IS NULL OR char_length("notes") <= 4000),
  "created_at" timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE "public"."hotel_clients" ENABLE ROW LEVEL SECURITY;
