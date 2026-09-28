-- Idempotency guard for consumeOneTripIfApplicable (generate-trip-worker),
-- added as part of the 2026-09-28 billing-incident response (see the
-- emergency fix to app/api/trips/jobs/route.ts, commit 29fed3e7). Not a
-- fix for that incident itself (that was a mismatch between the route's
-- creation-time charge and the worker's completion-time charge, fixed by
-- removing the former) -- this is defense-in-depth against the worker
-- charging the SAME job twice on its own (a retry, a self-reinvoke, or a
-- duplicate invocation of the same job_id).
--
-- NULL = not yet charged. Set once, atomically, by an
-- UPDATE ... WHERE credit_charged_at IS NULL immediately before the
-- actual entitlements decrement -- a second attempt for the same job_id
-- finds 0 rows to update and skips the charge.

ALTER TABLE "public"."generation_jobs"
  ADD COLUMN IF NOT EXISTS "credit_charged_at" timestamptz;

COMMENT ON COLUMN "public"."generation_jobs"."credit_charged_at" IS
  'Set exactly once, atomically, when consumeOneTripIfApplicable actually charges a credit for this job. NULL means not yet charged -- the worker checks-and-sets this before decrementing trips_remaining so the same job can never be charged twice.';
