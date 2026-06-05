-- supabase/migrations/20260527_add_intelligence_to_trips.sql
--
-- Adds the Intelligence Foundation storage to the trips table:
--   • intelligence (JSONB)     — TripIntelligence object computed in
--                                lib/intelligence.ts at trip save time;
--                                surfaced to the UI via DayFlowBadge /
--                                IntelligenceCallout / HotelFitBadge.
--   • walking_tolerance (TEXT) — User preference captured at trip
--                                creation. Three values: 'low' / 'medium'
--                                / 'high'. Defaults to 'medium' so
--                                existing rows behave reasonably.
--
-- Both columns are nullable / defaulted so this migration is safe for
-- the ~thousands of trips already in the DB — they remain valid and
-- continue to render normally (without intelligence badges, just like
-- before the Intelligence Foundation work).
--
-- Apply via Supabase Studio SQL Editor (CLI db push blocked by migration
-- history drift — see feedback_supabase_migrations memory note).

BEGIN;

ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS intelligence JSONB DEFAULT NULL;

ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS walking_tolerance TEXT DEFAULT 'medium';

-- GIN index on intelligence — enables cheap queries like
-- "trips with day_label='Pesado' on any day" or
-- "trips with hotel_fit.label='Alejado'" for editorial / monitoring use.
-- The index is partial (only non-null rows) so it costs nothing on the
-- existing trip population that won't have intelligence set.
CREATE INDEX IF NOT EXISTS trips_intelligence_gin_idx
  ON public.trips
  USING GIN (intelligence)
  WHERE intelligence IS NOT NULL;

COMMENT ON COLUMN public.trips.intelligence IS
  'TripIntelligence object computed by lib/intelligence.ts. Shape: { computed_at, days[], hotel_fit, trip_flags }. NULL on trips generated before the Intelligence Foundation rollout (2026-05-27) or on long-trip async path (Phase 1A.1 follow-up).';

COMMENT ON COLUMN public.trips.walking_tolerance IS
  'User-stated walking preference: low (<30min/day) | medium (30-60min) | high (>60min). Captured at trip creation form. Drives the energy_warning DayFlag threshold in intelligence computation.';

COMMIT;
