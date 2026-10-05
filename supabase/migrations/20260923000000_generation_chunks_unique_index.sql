-- Explicit unique index on generation_chunks(job_id, chunk_index).
--
-- The table's existing PRIMARY KEY (job_id, chunk_index) already enforces
-- this uniqueness — this migration is a defensive, idempotent no-op if that
-- constraint is present, and a safety net if it isn't. Added alongside the
-- single-city day-level concurrency worker (2026-09-23): with up to
-- SC_CONCURRENCY=8 day-chunks generating in parallel plus a retry layer, a
-- retried chunk could attempt to insert an already-persisted day_index a
-- second time — the worker's insert now tolerates a 23505 (unique
-- violation) on this constraint as a benign no-op rather than a hard
-- failure. This index (or the PK backing it) is what makes that violation
-- code deterministic to check for.

CREATE UNIQUE INDEX IF NOT EXISTS "generation_chunks_job_chunk_idx"
  ON "public"."generation_chunks" USING "btree" ("job_id", "chunk_index");

-- Cache for the single-city skeleton pre-pass (per-day theme/neighborhood/
-- anchor/pace, plus city/travel_day/transfer_hours). Computed once per job
-- by generateSkeleton() and stored here so a self-reinvoke of the worker
-- (budget exhausted mid-job) doesn't re-run the Haiku call. Null for
-- multi-city jobs (unchanged sequential path, doesn't use a skeleton) and
-- for jobs created before this migration.
ALTER TABLE "public"."generation_jobs"
  ADD COLUMN IF NOT EXISTS "skeleton" "jsonb";

COMMENT ON COLUMN "public"."generation_jobs"."skeleton" IS
  'Single-city skeleton pre-pass output (array of {day, theme, neighborhood, anchor, pace, city, travel_day, transfer_hours}), cached so a self-reinvoke does not redo the Haiku call. Null for multi-city jobs.';
