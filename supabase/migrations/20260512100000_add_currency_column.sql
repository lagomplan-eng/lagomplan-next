-- supabase/migrations/20260512100000_add_currency_column.sql
--
-- Adds an explicit currency column to `trips` so the user's MXN/USD
-- selection survives refresh. Today the currency lives only as transient
-- React state — generating a USD trip then reloading the URL silently
-- reverts the display to MXN.
--
-- Additive + defaulted, so existing rows stay valid (legacy trips become
-- MXN, matching the in-app default they were generated under).
--
-- Run with:  supabase db push
-- Or paste this block into the Supabase dashboard SQL editor.

BEGIN;

ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'MXN'
    CHECK (currency IN ('USD', 'MXN'));

COMMIT;
