-- Move credit consumption from job creation to job completion.
--
-- Previously /api/trips/jobs consumed a credit unconditionally at job
-- creation, before the worker even ran — a job that later failed (upstream
-- timeout, Claude error, a DB write failure) still cost the user a credit.
-- The worker patched over this ad hoc with a refund on exactly two failure
-- paths (first-chunk-zero-progress, and a post-generation trips-insert
-- failure), leaving every other failure mode uncovered and an inconsistent
-- "sometimes refund" policy. See generate-trip-worker/index.ts's removed
-- refundOneTripIfApplicable for the old shape.
--
-- New model: the credit is consumed exactly once, in the worker, at the
-- same guarded write that marks the job 'completed' — gated on
-- credit_consumed flipping false -> true under `WHERE credit_consumed =
-- false`, the same idempotency shape already used for `WHERE status =
-- 'running'` on that same completion write. A reconciler-driven
-- re-invocation of a job already past completion can never double-charge
-- (the worker's terminal-status noop guard returns before reaching this
-- code at all for an already-completed/failed job).
--
-- is_regeneration is captured at job-creation time (mirrors the existing
-- server-side ownership check already in /api/trips/jobs) so the worker can
-- skip charging without re-deriving ownership itself at completion time.
--
-- Deploy order (see PR description): 1) this migration, 2) the Next.js
-- route with consumeOneTrip removed from job creation, 3) the worker with
-- the completion-time charge. Confirm zero jobs in queued/running before
-- proceeding past this migration.
--
-- Backfill: every row that exists before this migration was created under
-- the OLD code path and was already charged at creation time. Mark all of
-- them credit_consumed = true so the new completion-time claim in the
-- worker is a no-op for them — including any that are still in flight and
-- complete after the worker deploy lands, which must not be charged again.

ALTER TABLE public.generation_jobs
  ADD COLUMN IF NOT EXISTS credit_consumed  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_regeneration  boolean NOT NULL DEFAULT false;

UPDATE public.generation_jobs
SET credit_consumed = true
WHERE credit_consumed = false;
