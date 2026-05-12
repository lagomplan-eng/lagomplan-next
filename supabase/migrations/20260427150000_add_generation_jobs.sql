-- supabase/migrations/add_generation_jobs.sql
-- Async itinerary generation: job + chunk tables.
-- The client-facing /api/trips/jobs endpoints read/write `generation_jobs`.
-- The worker Edge Function writes `generation_chunks` and the final `result`.
-- Run with: supabase db push

-- ── generation_jobs ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS generation_jobs (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id        UUID        REFERENCES trips(id) ON DELETE SET NULL,
  status         TEXT        NOT NULL CHECK (status IN ('queued','running','completed','failed')),
  inputs         JSONB       NOT NULL,
  chunks_total   INT         NOT NULL,
  chunks_done    INT         NOT NULL DEFAULT 0,
  result         JSONB,
  error          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS generation_jobs_user_created_idx
  ON generation_jobs (user_id, created_at DESC);

-- Reconciler index: cheap lookup for stale jobs needing re-invocation
CREATE INDEX IF NOT EXISTS generation_jobs_stale_idx
  ON generation_jobs (status, updated_at)
  WHERE status IN ('queued','running');

-- ── generation_chunks ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS generation_chunks (
  job_id      UUID         NOT NULL REFERENCES generation_jobs(id) ON DELETE CASCADE,
  chunk_index INT          NOT NULL,
  content     JSONB        NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  PRIMARY KEY (job_id, chunk_index)
);

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE generation_jobs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_chunks ENABLE ROW LEVEL SECURITY;

-- Users can read their own jobs
CREATE POLICY "users_read_own_jobs"
  ON generation_jobs FOR SELECT
  USING (auth.uid() = user_id);

-- Only service_role writes (worker, API routes with admin client)
CREATE POLICY "service_role_all_jobs"
  ON generation_jobs FOR ALL
  USING (auth.role() = 'service_role');

-- Chunks are never read from the client — only by the worker
CREATE POLICY "service_role_all_chunks"
  ON generation_chunks FOR ALL
  USING (auth.role() = 'service_role');

-- ── updated_at trigger ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.touch_generation_jobs_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS generation_jobs_touch_updated_at ON generation_jobs;
CREATE TRIGGER generation_jobs_touch_updated_at
  BEFORE UPDATE ON generation_jobs
  FOR EACH ROW EXECUTE FUNCTION public.touch_generation_jobs_updated_at();
