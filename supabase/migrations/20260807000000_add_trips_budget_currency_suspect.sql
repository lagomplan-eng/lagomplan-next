-- Add budget_currency_suspect to trips.
--
-- Rough order-of-magnitude sanity check computed server-side in
-- supabase/functions/generate-trip/index.ts (isBudgetCurrencySuspect):
-- flags when budget_breakdown's numbers look implausible for the currency
-- the trip actually requested (e.g. MXN-labeled amounts that are really
-- USD-scale, or vice versa). NOT a live FX-rate conversion — a heuristic
-- floor/ceiling on implied per-person-per-night spend.
--
-- Nullable, three-state: NULL = not evaluated (async job/worker path
-- doesn't surface this yet, or the trip predates this column), true/false
-- = evaluated at generation time. This is a soft signal for product
-- metrics ("how often does the currency instruction get ignored"), never
-- a validation gate — a false positive must never block or fail a trip
-- generation the user already paid a credit for.

ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS budget_currency_suspect boolean;
