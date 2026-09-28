-- Three single-city day-chunk failures (2026-09-25/28 10-city test runs,
-- Lisboa/chunk 1, Tokyo/chunk 6, Madrid/chunk 2) died with NO metrics row
-- at all -- the Anthropic fetch either returned a non-ok HTTP response or
-- threw a network-level error, and both of those paths in
-- generate-trip/index.ts returned early without ever reaching
-- logGenerationMetric(). Root cause of the failure was therefore
-- unobservable: no status code, no error body, nothing to confirm or rule
-- out a 429/5xx rate-limit hypothesis. These columns let that same call
-- log itself (ok:false, status_code, error) BEFORE returning/rethrowing,
-- so the next occurrence is diagnosable from generation_metrics alone.

ALTER TABLE "public"."generation_metrics"
  ADD COLUMN IF NOT EXISTS "status_code" integer,
  ADD COLUMN IF NOT EXISTS "error" "text";

COMMENT ON COLUMN "public"."generation_metrics"."status_code" IS
  'HTTP status Anthropic returned (e.g. 429, 529, 500), or null on a network-level failure (fetch itself threw) or a normal ok:true row.';
COMMENT ON COLUMN "public"."generation_metrics"."error" IS
  'Truncated error body / exception message for ok:false rows. Null on success.';
