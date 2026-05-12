-- supabase/migrations/20260512_add_traveler_details.sql
--
-- Adds explicit traveler-detail columns to `trips` so adults / children /
-- group count survive page refreshes. Today these live only as React state
-- inside HeroForm + TripResult — refreshing a saved family trip silently
-- loses the children information.
--
-- All three columns are additive with safe defaults, so this migration does
-- not require a backfill. Existing rows become 2 adults / no children /
-- null group_count (matching the in-memory defaults the app uses today).
--
-- Run with:  supabase db push --project-ref qvntwqnzvspoisaglgpp
-- Or paste this block into the Supabase dashboard SQL editor.

BEGIN;

ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS traveler_adults      int   NOT NULL DEFAULT 2
    CHECK (traveler_adults BETWEEN 1 AND 20),
  ADD COLUMN IF NOT EXISTS traveler_children    jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS traveler_group_count int
    CHECK (traveler_group_count IS NULL OR traveler_group_count BETWEEN 2 AND 50);

-- Shape of `traveler_children`:
--   [
--     { "type": "baby" | "kid", "age": "0-11 m" | "3 años" | … }
--   ]
-- Stored as JSONB so the array stays atomic (autosave overwrites the whole
-- field on every save) and we don't need a child sub-table for v1.

COMMIT;
