-- Per-call cost, computed at write time from real Anthropic usage
-- (fresh input + cache reads at 0.1x + cache writes at 1.25x + output),
-- using the published per-model MTok rates as of 2026-09-28
-- (https://platform.claude.com/docs/en/about-claude/pricing). Numeric(10,6)
-- gives 6 decimal places -- a single call typically costs $0.001-$0.03, so
-- 4-5 decimals of real precision after the point.

ALTER TABLE "public"."generation_metrics"
  ADD COLUMN IF NOT EXISTS "cost_usd" numeric(10,6);

COMMENT ON COLUMN "public"."generation_metrics"."cost_usd" IS
  'Computed cost for this call: fresh input_tokens * input rate + cache_creation_input_tokens * 1.25x input rate + cache_read_input_tokens * 0.1x input rate + output_tokens * output rate, per-model rates from Anthropic pricing. Null when usage data was unavailable (a failure logged before any usage was returned).';
