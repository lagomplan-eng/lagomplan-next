// lib/planner/persist.ts
//
// Single source of truth for the trip_data blob the DESKTOP planner persists.
//
// The /api/trips/[trip_id] PATCH overwrites trip_data **wholesale**, so every
// field the mobile companion reads or writes MUST appear here — otherwise it is
// silently wiped on the next desktop save. (This is exactly how currency broke;
// see resolveTripCurrency in lib/planner/progress.) Both desktop save paths —
// the debounced autosave and the pagehide flush — go through this function so
// the two bundles can never drift apart.

export interface PlannerTripDataInput {
  title: string
  subtitle: string
  days: unknown[]
  packing: unknown[]
  budgetRows: unknown[]
  doneChecks: string[]
  segments: unknown[]
  accommodations: unknown[]
}

export function buildPlannerTripData(s: PlannerTripDataInput): Record<string, unknown> {
  return {
    title: s.title,
    subtitle: s.subtitle,
    days: s.days,
    packing: s.packing,
    budgetRows: s.budgetRows,
    doneChecks: s.doneChecks,
    // Omit empty segments so single-city trips don't carry an empty array.
    segments: s.segments.length > 0 ? s.segments : undefined,
    accommodations: s.accommodations,
  }
}

// The trip_data keys the MOBILE companion depends on — it reads them, and/or
// writes them via the companion route's read-modify-write. The parity test
// (tests/trip-data-parity.test.ts) asserts buildPlannerTripData() includes
// every one, so a desktop wholesale overwrite can never wipe a field mobile
// needs.
//
// NOTE: `currency` is intentionally NOT in this list. Desktop writes currency to
// the top-level `currency` column and mobile reads that column first
// (resolveTripCurrency), so trip_data.currency is not required from desktop.
export const MOBILE_REQUIRED_TRIP_DATA_KEYS = [
  'days',
  'packing',
  'budgetRows',
  'doneChecks',
  'segments',
  'accommodations',
] as const
