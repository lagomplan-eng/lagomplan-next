-- 20260605_add_trip_progress.sql
-- Adds a dedicated trip_progress JSONB column to the trips table.
--
-- WHY a separate column instead of reusing trip_data:
--   The desktop planner (app/[locale]/planner/TripResult.tsx) autosaves
--   trip_data as a WHOLESALE column overwrite — every save replaces the entire
--   blob with a fixed field set {title, subtitle, days, packing, budgetRows,
--   doneChecks, segments, accommodations}. Any field outside that set is wiped
--   on the next edit (see the comment at TripResult.tsx ~2022).
--
--   The mobile companion view (app/[locale]/trips/[trip_id]) needs to persist
--   traveler-progress data the planner doesn't know about — per-activity
--   notes/links and packing check-off state. Storing those in trip_data would
--   mean the next desktop autosave clobbers them. trip_progress is owned solely
--   by the companion view; the planner never reads or writes it, so the two
--   writers never collide. Plan (authored, desktop-owned) and progress
--   (annotated, mobile-owned) stay cleanly separated.
--
-- Shape (see lib/planner/progress.ts):
--   { "annotations": { "<itemId>": { "note": "...", "link": "https://..." } },
--     "packedItems": [0, 2, 5] }

alter table public.trips
  add column if not exists trip_progress jsonb not null default '{}'::jsonb;

comment on column public.trips.trip_progress is
  'Companion-view traveler progress (per-item notes/links + packing check-off). Owned by the mobile trip view; never written by the desktop planner autosave. See lib/planner/progress.ts.';
