-- Partner referral attribution: stamp which partner guide (/guia/[partner])
-- drove a trip, for partner reporting and result-based payouts.
--
-- Value format: "host:<slug>" (e.g. "host:lupito"), set server-side at trip
-- creation from the first-party lagom_ref cookie the guide drops. Nullable —
-- organic trips simply have no ref_source. Additive and safe; no backfill
-- (trips created before this ships carry no stamp).

ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS ref_source text;

-- Partial index: reporting queries filter on the stamped rows only, which are
-- a small minority, so a partial index stays tiny and fast.
CREATE INDEX IF NOT EXISTS trips_ref_source_idx
  ON public.trips (ref_source)
  WHERE ref_source IS NOT NULL;

COMMENT ON COLUMN public.trips.ref_source IS
  'Partner referral stamp, "host:<slug>" (e.g. host:lupito), set from the lagom_ref cookie at trip creation. Null = organic.';
