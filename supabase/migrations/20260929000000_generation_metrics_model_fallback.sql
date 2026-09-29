-- Tracks when a Sonnet 5.5 strict-tool-use call failed and this attempt
-- fell back to Sonnet 4.6 (non-strict/forced tool_choice) instead of
-- retrying 5.5 again -- added after a real multi-minute grammar-compilation
-- outage during the 5.5 migration (backlog #101, 2026-09-29) failed every
-- concurrent call in a batch identically. Lets generation_metrics answer
-- "how often does the fallback fire" directly instead of inferring it from
-- model + schema_kind pairs.

ALTER TABLE "public"."generation_metrics"
  ADD COLUMN IF NOT EXISTS "model_fallback" boolean;

COMMENT ON COLUMN "public"."generation_metrics"."model_fallback" IS
  'true when this row is a Sonnet 4.6 fallback call fired after a Sonnet 5.5 strict-tool-use failure on the same attempt (see callAnthropicForChunk in generate-trip-worker/index.ts). Null/false for every normal call.';
