/**
 * supabase/functions/generate-trip-worker/logic.ts
 *
 * Pure request-shaping logic pulled out of index.ts so it's importable from
 * a plain Node/tsx test without spinning up Deno or the network — see
 * tests/generate-trip-worker-insert.test.ts. No Deno globals, no fetch, no
 * side effects.
 */

const VALID_TRAVELERS = ['solo', 'pareja', 'familia', 'amigos']
const VALID_PACES     = ['relajado', 'equilibrado', 'activo']

export type TripInsertNormalized = {
  travelers: string | null
  travel_style: string | null
  currency: 'MXN' | 'USD'
}

/**
 * Normalizes the async job's stored inputs (the client's original request
 * body, carried verbatim on generation_jobs.inputs) into the shape the
 * worker's `trips` insert needs.
 *
 * currency was previously missing entirely from this normalization — the
 * client payload always carries it (TripResult.tsx sends `currency` in
 * every generation payload), but the worker's trips insert never read it,
 * so every async-generated trip (any authenticated user's trip over
 * ASYNC_THRESHOLD days, or any multi-city trip) silently fell back to the
 * `currency` column's DB default regardless of what the user actually
 * selected. Fixed here alongside travelers/travel_style, which had the
 * same "read from job.inputs, validate against an enum, default safely"
 * shape already.
 */
export function normalizeJobInputsForTripsInsert(jobInputs: any): TripInsertNormalized {
  const rawTraveler = jobInputs?.traveler
  const rawPace     = jobInputs?.pace
  const travelerNorm = typeof rawTraveler === 'string' ? rawTraveler.toLowerCase() : null
  const paceNorm     = typeof rawPace === 'string' ? rawPace.toLowerCase() : null

  return {
    travelers:    travelerNorm && VALID_TRAVELERS.includes(travelerNorm) ? travelerNorm : null,
    travel_style: paceNorm && VALID_PACES.includes(paceNorm) ? paceNorm : null,
    currency:     jobInputs?.currency === 'USD' ? 'USD' : 'MXN',
  }
}
