-- supabase/migrations/20260526_add_partial_result_to_generation_jobs.sql
--
-- Adds a `partial_result` JSONB column to generation_jobs so the worker can
-- write a progressively-assembled trip after each chunk completes. The
-- polling endpoint surfaces it to the client, and the planner UI renders
-- whatever days exist while waiting for the rest.
--
-- This is the storage half of the streaming-UI feature. Worker writes
-- partial after every chunks_done increment; TripResult.tsx consumes it
-- during the polling loop and progressively populates day cards.
--
-- Apply via Supabase Studio SQL Editor (CLI db push is blocked by migration
-- history drift — see feedback_supabase_migrations memory note).

BEGIN;

ALTER TABLE public.generation_jobs
  ADD COLUMN IF NOT EXISTS partial_result JSONB DEFAULT NULL;

COMMENT ON COLUMN public.generation_jobs.partial_result IS
  'Progressive trip assembly written by the worker after each chunk completes. Read by /api/trips/jobs/[id] GET. Replaced on every chunks_done update; not load-bearing — if missing, client falls back to plain spinner.';

COMMIT;
