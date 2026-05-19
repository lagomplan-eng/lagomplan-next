/**
 * lib/planner/segments.ts
 *
 * Multi-city trip primitives. A "segment" is one leg of the trip — a
 * destination city + its own date window. Single-city trips have zero
 * segments (or one, where it mirrors the trip's destination/dates).
 * Multi-city trips have ≥2 contiguous segments.
 *
 * Phase 1 stores segments in `trip_data.segments[]` (JSON) — no DB
 * migration. Round-tripping the form submit through URL params uses
 * the pipe-delimited serializer here.
 */

export interface TripSegment {
  /** Free-form destination string the user typed or picked. */
  destination: string
  /** ISO YYYY-MM-DD. */
  startDate:   string
  /** ISO YYYY-MM-DD. End date is the day the traveler leaves — i.e.,
   *  one night earlier than the next segment's start (contiguous). */
  endDate:     string
  /** Derived from start/end; stored alongside for consumer convenience. */
  nights:      number
  /** Optional explicit origin for this segment. Defaults (in the form)
   *  to the previous segment's destination, which is what the AI infers
   *  anyway. Persisted only when the user explicitly sets it to something
   *  other than the chain-implicit value. */
  origin?:     string
}

const ONE_DAY = 86_400_000

/**
 * Build a TripSegment from raw destination + dates. Computes nights
 * deterministically so consumers don't recompute. Returns nights=0 on
 * invalid input (caller can guard).
 */
export function buildSegment(
  destination: string,
  startDate:   string,
  endDate:     string,
  origin?:     string,
): TripSegment {
  const s = new Date(`${startDate}T00:00:00Z`).getTime()
  const e = new Date(`${endDate}T00:00:00Z`).getTime()
  const nights = (!isNaN(s) && !isNaN(e) && e > s)
    ? Math.round((e - s) / ONE_DAY)
    : 0
  const seg: TripSegment = { destination, startDate, endDate, nights }
  if (origin && origin.trim()) seg.origin = origin.trim()
  return seg
}

/**
 * Pipe-delimited URL-safe serializer. Each segment becomes
 * `<destEnc>|<startDate>|<endDate>|<nights>`, segments joined with `;`.
 * Stays compact for the typical 2-3 segment case (~60-80 chars total)
 * and avoids the % escapes a JSON encode produces.
 *
 *   serializeSegments([
 *     { destination: 'Buenos Aires', startDate: '2026-06-01', endDate: '2026-06-04', nights: 3 },
 *     { destination: 'Uruguay',      startDate: '2026-06-04', endDate: '2026-06-06', nights: 2 },
 *   ])
 *   → "Buenos%20Aires|2026-06-01|2026-06-04|3;Uruguay|2026-06-04|2026-06-06|2"
 */
export function serializeSegments(segments: TripSegment[]): string {
  if (!segments || segments.length === 0) return ''
  return segments
    .map(s => {
      const base = `${encodeURIComponent(s.destination)}|${s.startDate}|${s.endDate}|${s.nights}`
      // Append origin as a 5th field when set; old 4-field shape stays valid.
      return s.origin ? `${base}|${encodeURIComponent(s.origin)}` : base
    })
    .join(';')
}

/**
 * Inverse of serializeSegments. Robust against missing fields — drops
 * any segment that doesn't have at least destination + both dates.
 * Accepts both the legacy 4-field shape and the new 5-field
 * destination+origin shape.
 */
export function deserializeSegments(raw: string | undefined | null): TripSegment[] {
  if (!raw || typeof raw !== 'string') return []
  return raw.split(';').map(part => {
    const [destEnc, startDate, endDate, nightsStr, originEnc] = part.split('|')
    const safeDecode = (s: string | undefined) => {
      try { return decodeURIComponent(s ?? '') } catch { return '' }
    }
    const destination = safeDecode(destEnc)
    const nights = Number.isFinite(+nightsStr) ? +nightsStr : 0
    const origin  = originEnc ? safeDecode(originEnc) : undefined
    const seg: TripSegment = {
      destination,
      startDate: startDate ?? '',
      endDate:   endDate ?? '',
      nights,
    }
    if (origin) seg.origin = origin
    return seg
  }).filter(s => s.destination && s.startDate && s.endDate)
}

/**
 * True when the array meaningfully represents a multi-city trip
 * (≥2 contiguous segments). Single segments OR empty arrays are
 * treated as single-city.
 */
export function isMultiCitySegments(segments: TripSegment[] | undefined | null): boolean {
  return Array.isArray(segments) && segments.length >= 2
}

/**
 * Returns a display-ready chain string for the hero chip row.
 * "Buenos Aires → Uruguay → Buenos Aires"
 */
export function formatSegmentChain(segments: TripSegment[]): string {
  if (!segments || segments.length === 0) return ''
  return segments.map(s => s.destination).join(' → ')
}
