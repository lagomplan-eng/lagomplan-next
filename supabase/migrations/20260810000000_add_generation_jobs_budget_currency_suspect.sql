-- Add budget_currency_suspect to generation_jobs.
--
-- Companion to trips.budget_currency_suspect (20260807000000). The sync
-- generation path (app/api/generate-trip/route.ts -> generate-trip Edge
-- Function) already writes this flag directly to the trips row. The async
-- path (generate-trip-worker) goes through a separate generation_jobs
-- table and previously discarded the flag entirely — generate-trip still
-- computed it per chunk, but generateSegment() only kept trip_data from
-- the response, dropping budget_currency_suspect on the floor.
--
-- Only chunk 0's flag is meaningful — assembleResult() already treats
-- chunk 0 as the canonical source for budget_breakdown, so later chunks'
-- (redundant or absent) budget numbers were never used anyway. The worker
-- persists chunk 0's flag onto this column as soon as that chunk lands
-- (same place chunks_done gets bumped), since job completion can happen in
-- a LATER, separate Edge Function invocation via the self-reinvoke chain —
-- an in-memory variable would not survive across invocations, so this must
-- be a real column, not just a local carried through the function.
--
-- Same nullable, three-state, non-blocking semantics as trips.
-- budget_currency_suspect: NULL = not yet evaluated, true/false = evaluated
-- at chunk-0 generation time.

ALTER TABLE public.generation_jobs
  ADD COLUMN IF NOT EXISTS budget_currency_suspect boolean;
