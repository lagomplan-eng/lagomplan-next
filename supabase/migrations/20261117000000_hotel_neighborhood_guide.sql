-- Hotel neighborhood guide (free QR edition): hotel_partners + hotel_guide_events.
-- Additive only. Both tables are service-role only: RLS is on with NO policies, so anon and
-- authenticated clients can neither read nor write; every write goes through a server route and
-- admin reads are server-side. hotel_guide_events holds nothing that identifies a guest: no IP,
-- no user agent, no cookie id.

CREATE TABLE IF NOT EXISTS "public"."hotel_partners" (
  "id"                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  "code"              text        NOT NULL UNIQUE CHECK ("code" ~ '^[a-z0-9]{8,12}$'),   -- what the QR carries
  "hotel_name"        text        NOT NULL CHECK (char_length("hotel_name") BETWEEN 1 AND 160),
  "zone"              text        CHECK ("zone" IN ('condesa', 'roma', 'polanco')),
  "requested_zone"    text        CHECK ("requested_zone" IS NULL OR char_length("requested_zone") <= 120),
  "contact_name"      text        NOT NULL CHECK (char_length("contact_name") BETWEEN 1 AND 160),
  "contact_email"     text        NOT NULL CHECK (char_length("contact_email") BETWEEN 3 AND 254),
  "maps_url"          text        CHECK ("maps_url" IS NULL OR char_length("maps_url") <= 500),
  "status"            text        NOT NULL DEFAULT 'pending'
                                  CHECK ("status" IN ('pending', 'approved', 'rejected', 'paused', 'waitlist')),
  "edition"           text        NOT NULL DEFAULT 'free' CHECK ("edition" IN ('free', 'paid')),
  "lang"              text        NOT NULL DEFAULT 'es' CHECK ("lang" IN ('es', 'en')),  -- language of the signup, for emails
  "notes"             text        CHECK ("notes" IS NULL OR char_length("notes") <= 4000),
  "email_opt_out"     boolean     NOT NULL DEFAULT false,
  "terms_accepted_at" timestamptz NOT NULL,
  "created_at"        timestamptz NOT NULL DEFAULT now(),
  "approved_at"       timestamptz,
  -- zone is required unless the hotel is on the waitlist (out-of-zone demand signal)
  CONSTRAINT "hotel_partners_zone_required" CHECK ("status" = 'waitlist' OR "zone" IS NOT NULL)
);

-- Same hotel + same contact submitted twice = one row.
CREATE UNIQUE INDEX IF NOT EXISTS "hotel_partners_name_email_uniq"
  ON "public"."hotel_partners" (lower("hotel_name"), lower("contact_email"));
CREATE INDEX IF NOT EXISTS "hotel_partners_status_idx" ON "public"."hotel_partners" ("status", "created_at" DESC);

CREATE TABLE IF NOT EXISTS "public"."hotel_guide_events" (
  "id"         bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "hotel_id"   uuid        NOT NULL REFERENCES "public"."hotel_partners" ("id") ON DELETE CASCADE,
  "event_type" text        NOT NULL CHECK ("event_type" IN ('scan', 'section_open', 'outbound_click')),
  "section"    text        CHECK ("section" IS NULL OR "section" ~ '^[a-z_]{1,32}$'),
  "lang"       text        CHECK ("lang" IN ('es', 'en')),
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "hotel_guide_events_hotel_idx"
  ON "public"."hotel_guide_events" ("hotel_id", "event_type", "created_at" DESC);

ALTER TABLE "public"."hotel_partners"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."hotel_guide_events" ENABLE ROW LEVEL SECURITY;
-- Deliberately no policies. The service role bypasses RLS; nobody else gets in.
