-- supabase/migrations/20260602_smart_finds_hotels_strip_tags.sql
--
-- Hotels-page Smart Finds strip — clean cutover from the static product
-- catalog (deprecated) to the curated 6 picks from the new DB seed.
--
-- Why this lives as a separate migration: editorial surface assignments
-- aren't structural schema changes, but they are auditable + reversible
-- catalog edits worth tracking in git so we know which products were
-- on the public strip at any point in history.
--
-- Effect on `/es/hoteles` "Smart finds" strip (and EN equivalent):
--   Before: shows the legacy static products that were tagged
--           surfaces=['hotels-strip'] during the original Supabase seed
--   After:  shows exactly 6 universal travel products from today's seed,
--           with consistent category labels driving the eyebrow text
--
-- Idempotent: re-running clears + re-tags, same end state.
--
-- Apply via Supabase Studio → SQL Editor (paste + run).

BEGIN;

-- ── 1. Clean slate — clear hotels-strip from EVERY product ───────────────────
-- array_remove is a no-op when the element isn't in the array, so this is
-- safe to run against products that were never tagged.
UPDATE public.sf_products
SET surfaces = array_remove(surfaces, 'hotels-strip')
WHERE 'hotels-strip' = ANY(surfaces);

-- ── 2. Tag the 6 universal travel picks for the public strip ─────────────────
-- All 6 are intentionally gender/persona-neutral so the Hotels-page strip
-- works regardless of who's booking. Pulled from the new seed (2026-06-01).

UPDATE public.sf_products
SET
  surfaces = ARRAY['hotels-strip']::text[],
  category = 'organizado'
WHERE id = 'apple-airtag-4pack';

UPDATE public.sf_products
SET
  surfaces = ARRAY['hotels-strip']::text[],
  category = 'conectado'
WHERE id IN (
  'anker-powercore-slim',
  'epicka-universal-adapter',
  'airalo-esim'
);

UPDATE public.sf_products
SET
  surfaces = ARRAY['hotels-strip']::text[],
  category = 'organizado'
WHERE id IN (
  'bagsmart-compression-cubes',
  'forge-tsa-lock'
);

COMMIT;

-- ── 3. Verify ────────────────────────────────────────────────────────────────
-- Run separately after the COMMIT above.

-- Exactly 6 products tagged
SELECT id, brand, name, category, image IS NOT NULL AS has_image
FROM public.sf_products
WHERE 'hotels-strip' = ANY(surfaces)
ORDER BY id;
-- Expected: 6 rows. 5 have images, airalo-esim does not (digital product;
-- card falls back gracefully to empty image slot).
