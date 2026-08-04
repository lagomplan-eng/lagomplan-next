-- Fix C2 (PII breach) — re-apply to `main`.
--
-- This is a re-commit of a fix that was already written, tested, and applied
-- directly to production on 2026-07-21 (see commit 63b62a7,
-- "fix(security): drop world-readable RLS policy on trips (C2)"), but that
-- commit only ever existed on branch `security/audit-c1-c2-fixes` and was
-- never merged to `main`. Production has been safe since 2026-07-21
-- (verified live via an anon-key REST probe on 2026-08-04, zero rows
-- returned); this migration exists only to close the drift so `main`'s
-- migration history matches what is actually deployed — anyone rebuilding
-- the schema from `main` (new environment, disaster recovery) would
-- otherwise reintroduce the hole via the untouched baseline file.
--
-- The baseline schema declared:
--   CREATE POLICY "Public can read trips by slug"
--     ON public.trips FOR SELECT USING (true);
-- Despite the name there is no slug-based filter — it's a blanket
-- `USING (true)` with no role restriction. Because Postgres OR-combines
-- permissive policies, it overrode the intended owner-scoped and shared-only
-- policies, making EVERY trip row readable by the `anon` role via the public
-- anon key (user_email, traveler_children, trip_data, trip_progress, share_id).
--
-- Safe to drop — every public/by-id read in the app is served server-side
-- through the service-role client (all /api/trips/* routes; the
-- /trips/[id] and /trips/share/[shareId] server components; the homepage
-- sample-itinerary link), which bypasses RLS entirely and is unaffected by
-- this change. The only anon-key (browser) reads are user_id-filtered
-- (MyTripsClient, AuthEventsBridge) and remain served by trips_select_own.
--
-- ROLLBACK (if ever needed — NOT recommended, this restores the breach):
--   CREATE POLICY "Public can read trips by slug"
--     ON public.trips FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read trips by slug" ON public.trips;

-- Re-assert the intended scoped SELECT policies. IF-absent guards make this
-- migration idempotent/self-healing regardless of what the live DB already
-- has (already-fixed production included).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'trips'
      AND policyname = 'trips_select_own'
  ) THEN
    CREATE POLICY "trips_select_own" ON public.trips
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'trips'
      AND policyname = 'authenticated_read_shared_trips'
  ) THEN
    CREATE POLICY "authenticated_read_shared_trips" ON public.trips
      FOR SELECT TO authenticated USING (is_shared = true);
  END IF;
END $$;
