-- Two columns to diagnose whether prompt caching (cache_control: ephemeral
-- on the system block, added alongside the single-city concurrency
-- redesign) is actually being hit, and which retry attempt a row belongs
-- to. First real test run showed input_tokens flat at ~1,726 across all
-- concurrent lean day chunks -- ambiguous without cache_read_input_tokens
-- to check whether that reflects a cache hit or no caching effect at all.

ALTER TABLE "public"."generation_metrics"
  ADD COLUMN IF NOT EXISTS "cache_read" integer,
  ADD COLUMN IF NOT EXISTS "attempt" integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN "public"."generation_metrics"."cache_read" IS
  'usage.cache_read_input_tokens from the Anthropic response. Null if caching was not applicable/available; 0 means cache_control was sent but not hit; >0 confirms a real cache hit.';
COMMENT ON COLUMN "public"."generation_metrics"."attempt" IS
  'Retry attempt number for this call: 0 = first try, 1/2 = worker-level SC_* retries. Always 0 for skeleton and multi-city calls (no retry logic on those paths).';
