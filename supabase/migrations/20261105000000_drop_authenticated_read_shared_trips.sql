-- E14-1 (LP-23) · closes R1
--
-- "authenticated_read_shared_trips" (FOR SELECT TO authenticated USING (is_shared = true))
-- let ANY signed-in account list and read every shared trip, all columns
-- (user_email, traveler_children, notes, booking codes) straight from the
-- database with the public key. Anyone can create a free account.
--
-- A shared trip is now readable ONLY through its share link, which is served by
-- server code using the service role with an explicit column list
-- (app/api/trips/share/[shareId]/route.ts and app/[locale]/trips/share/[shareId]/page.tsx).
-- No browser code needs this policy: every browser-side read of "trips"
-- filters by the caller's own user_id and is covered by "trips_select_own".
--
-- Idempotent. Earlier migrations (baseline, 20260804000000) still CREATE this
-- policy on a rebuild; this one runs after them and removes it.

DROP POLICY IF EXISTS "authenticated_read_shared_trips" ON public.trips;
