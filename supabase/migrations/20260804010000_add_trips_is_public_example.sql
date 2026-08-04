-- Add is_public_example to trips.
--
-- Marks trips that are shown publicly on /ejemplos as sample plans (see
-- app/api/trips/[trip_id]/route.ts, which is extended alongside this
-- migration to treat is_public_example the same way it already treats
-- is_shared: a public, read-only GET, served through the service-role
-- client with the authorization check written in application code — NOT
-- via RLS. No RLS policy changes are needed for this column; see the C2
-- incident (20260804000000_fix_trips_public_read_policy.sql) for why a
-- broad anon-readable RLS policy on this table is deliberately avoided.

ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS is_public_example boolean NOT NULL DEFAULT false;
