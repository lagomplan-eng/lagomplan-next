-- guide_visits + demo_visits: one row per page view of /guia/[partner] and
-- /demo/[prospect]. Write-only from the browser (anon key); read only from the
-- Supabase dashboard / service role. No personal data: no IP, no full user
-- agent, no param VALUES (dates / guest counts) — only which params were
-- present, plus an optional regex-restricted ?ref= campaign tag.
--
-- The client only inserts when VERCEL_ENV === 'production' (nothing from local
-- or Preview), and inserts WITHOUT .select() (no SELECT privilege exists).

-- ── guide_visits ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "public"."guide_visits" (
    "id"             uuid        NOT NULL DEFAULT gen_random_uuid(),
    "created_at"     timestamptz NOT NULL DEFAULT now(),
    "slug"           text        NOT NULL,                          -- partner slug, e.g. livin_condesa
    "lang"           text        NOT NULL,                          -- language shown: es | en
    "params_present" text[]      NOT NULL DEFAULT '{}',             -- names only, e.g. {noches,ninos}
    "ua_summary"     text        NOT NULL DEFAULT 'unknown:other',  -- "device:browser" bucket, never the raw UA
    "ref"            text        NULL,                              -- optional ?ref= campaign tag, e.g. qr, wa
    CONSTRAINT "guide_visits_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "guide_visits_slug_check"
        CHECK ("slug" ~ '^[a-z0-9][a-z0-9_-]{0,63}$'),
    CONSTRAINT "guide_visits_lang_check"
        CHECK ("lang" IN ('es', 'en')),
    CONSTRAINT "guide_visits_params_check"
        CHECK ("params_present" <@ ARRAY['lang','llegada','noches','adultos','ninos','ref']::text[]
               AND cardinality("params_present") <= 6),
    CONSTRAINT "guide_visits_ua_check"
        CHECK ("ua_summary" ~ '^(mobile|tablet|desktop|bot|unknown):(chrome|safari|firefox|edge|samsung|other)$'),
    CONSTRAINT "guide_visits_ref_check"
        CHECK ("ref" IS NULL OR "ref" ~ '^[a-z0-9_-]{1,32}$')
);

-- ── demo_visits (same shape; slug = prospect slug, e.g. host-me-tender) ────
CREATE TABLE IF NOT EXISTS "public"."demo_visits" (
    "id"             uuid        NOT NULL DEFAULT gen_random_uuid(),
    "created_at"     timestamptz NOT NULL DEFAULT now(),
    "slug"           text        NOT NULL,
    "lang"           text        NOT NULL,
    "params_present" text[]      NOT NULL DEFAULT '{}',
    "ua_summary"     text        NOT NULL DEFAULT 'unknown:other',
    "ref"            text        NULL,
    CONSTRAINT "demo_visits_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "demo_visits_slug_check"
        CHECK ("slug" ~ '^[a-z0-9][a-z0-9_-]{0,63}$'),
    CONSTRAINT "demo_visits_lang_check"
        CHECK ("lang" IN ('es', 'en')),
    CONSTRAINT "demo_visits_params_check"
        CHECK ("params_present" <@ ARRAY['lang','llegada','noches','adultos','ninos','ref']::text[]
               AND cardinality("params_present") <= 6),
    CONSTRAINT "demo_visits_ua_check"
        CHECK ("ua_summary" ~ '^(mobile|tablet|desktop|bot|unknown):(chrome|safari|firefox|edge|samsung|other)$'),
    CONSTRAINT "demo_visits_ref_check"
        CHECK ("ref" IS NULL OR "ref" ~ '^[a-z0-9_-]{1,32}$')
);

CREATE INDEX IF NOT EXISTS "guide_visits_slug_created_idx" ON "public"."guide_visits" ("slug", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "demo_visits_slug_created_idx"  ON "public"."demo_visits"  ("slug", "created_at" DESC);

-- ── Row Level Security ──────────────────────────────────────────────────────
ALTER TABLE "public"."guide_visits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."demo_visits"  ENABLE ROW LEVEL SECURITY;

-- Supabase's default privileges hand anon/authenticated full access to new
-- tables. Strip all of it, then grant back INSERT on the five client-writable
-- columns ONLY: there is no SELECT/UPDATE/DELETE privilege to fall back on
-- even if someone later adds a permissive policy by mistake, and a client
-- can never set id or created_at.
REVOKE ALL ON "public"."guide_visits" FROM "anon", "authenticated";
REVOKE ALL ON "public"."demo_visits"  FROM "anon", "authenticated";
GRANT INSERT ("slug", "lang", "params_present", "ua_summary", "ref") ON "public"."guide_visits" TO "anon", "authenticated";
GRANT INSERT ("slug", "lang", "params_present", "ua_summary", "ref") ON "public"."demo_visits"  TO "anon", "authenticated";

-- Public INSERT. Field validation lives in the CHECK constraints above (they
-- apply to every insert path), so the policy itself is unconditional.
-- Deliberately NO SELECT policy for anon/authenticated: reads happen from the
-- Supabase dashboard / service role, which bypass RLS.
CREATE POLICY "Public insert guide_visits" ON "public"."guide_visits"
    FOR INSERT TO "anon", "authenticated" WITH CHECK (true);
CREATE POLICY "Public insert demo_visits" ON "public"."demo_visits"
    FOR INSERT TO "anon", "authenticated" WITH CHECK (true);

-- ── Rollback ────────────────────────────────────────────────────────────────
-- DROP TABLE "public"."guide_visits"; DROP TABLE "public"."demo_visits";
