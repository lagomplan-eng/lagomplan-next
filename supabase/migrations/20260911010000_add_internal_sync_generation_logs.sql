-- Baseline logging for the SYNC generation path (/api/generate-trip), captured
-- BEFORE the upcoming time-budget, client-retry, and output-thinning changes
-- land — so their effect can be measured against a real "before" number
-- instead of guessed.
--
-- Lives in a new `internal` schema, not `public`, specifically because this
-- data (timing, error codes, auth state) has no reason to ever be reachable
-- via the API. Belt-and-suspenders: RLS is also enabled with zero policies,
-- so even if `internal` ever gets added to the exposed-schemas list without
-- someone re-checking this, anon/authenticated roles still get nothing —
-- only the service-role key (server-side only, bypasses RLS) can read/write.
--
-- IMPORTANT — hosted-project caveat: supabase/config.toml's [api] schemas
-- list governs the LOCAL dev stack (`supabase start`). For the linked hosted
-- project, PostgREST's exposed-schema list is a project setting (Dashboard →
-- Settings → API → Exposed schemas) that this migration cannot change by
-- itself. Add `internal` there manually — same manual-step category as
-- applying this migration itself. Until that's done, the service-role client
-- can't reach this schema via PostgREST either (schema exposure is an API
-- gateway setting, not a permissions setting — the service role bypasses RLS,
-- not PostgREST's schema allowlist). The application code that writes to this
-- table is written to fail silently either way (see app/api/generate-trip/
-- route.ts) — a missing exposed-schema setting delays baseline data, it never
-- breaks trip generation.

CREATE SCHEMA IF NOT EXISTS internal;

CREATE TABLE IF NOT EXISTS internal.sync_generation_logs (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  duration_ms      integer not null,
  duration_days    integer not null,
  city_count       integer not null default 1,
  is_authenticated boolean not null,
  success          boolean not null,
  error_code       text,
  user_id          uuid
);

CREATE INDEX IF NOT EXISTS sync_generation_logs_created_at_idx
  ON internal.sync_generation_logs (created_at);

ALTER TABLE internal.sync_generation_logs ENABLE ROW LEVEL SECURITY;
-- No policies added — default-deny for anon/authenticated. Service role
-- bypasses RLS, but RLS bypass is NOT the same as having the underlying
-- object privileges — Postgres still requires explicit USAGE/SELECT/INSERT
-- grants regardless of role, and a newly created schema grants nothing to
-- anyone by default. Without the two GRANTs below, service_role could not
-- reach this table via PostgREST at all (it would 401/permission-denied,
-- not silently bypass into it).
GRANT USAGE ON SCHEMA internal TO service_role;
GRANT SELECT, INSERT ON internal.sync_generation_logs TO service_role;

-- Defensive, expected no-op: a fresh schema grants nothing to anon/
-- authenticated by default (unlike `public`, which Supabase's project
-- bootstrap grants broadly) — there is nothing to revoke. Kept explicit
-- anyway so this file is self-documenting proof of the security property,
-- not something a future reader has to infer from Postgres defaults.
REVOKE ALL ON SCHEMA internal FROM anon, authenticated;
REVOKE ALL ON internal.sync_generation_logs FROM anon, authenticated;
