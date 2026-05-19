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
  // We deliberately DO NOT percent-encode here — the consumer (URLSearchParams
  // or fetch body) handles transport-level encoding once. Encoding destination
  // / origin here resulted in "Mexico City" → encoded to "Mexico%20City" by
  // us, then encoded again by URLSearchParams to "Mexico%2520City". The fix
  // is to keep the in-string format human-readable; we only need to defend
  // against the field delimiters `|` and `;` appearing inside a city name,
  // which is vanishingly rare. Replace those with U+FF5C / U+FF1B fullwidth
  // variants if they ever do appear — Google Places never returns them.
  const safeField = (s: string) => s.replace(/\|/g, '｜').replace(/;/g, '；')
  return segments
    .map(s => {
      const base = `${safeField(s.destination)}|${s.startDate}|${s.endDate}|${s.nights}`
      return s.origin ? `${base}|${safeField(s.origin)}` : base
    })
    .join(';')
}

/**
 * Inverse of serializeSegments. Robust against missing fields — drops
 * any segment that doesn't have at least destination + both dates.
 * Accepts both the legacy 4-field shape and the new 5-field
 * destination+origin shape. Tolerates legacy URLs that ship with
 * percent-encoded fields (from the previous encodeURIComponent-in-
 * serializer behavior) by decoding when the field looks encoded.
 */
export function deserializeSegments(raw: string | undefined | null): TripSegment[] {
  if (!raw || typeof raw !== 'string') return []
  // Legacy compat: if the raw string contains percent-encoded sequences
  // from the older serializer, decodeURIComponent handles them. Use a safe
  // decode that returns the input unchanged on malformed input.
  const safeDecode = (s: string | undefined) => {
    if (!s) return ''
    if (!s.includes('%')) return s
    try { return decodeURIComponent(s) } catch { return s }
  }
  return raw.split(';').map(part => {
    const [destRaw, startDate, endDate, nightsStr, originRaw] = part.split('|')
    const destination = safeDecode(destRaw)
    const nights = Number.isFinite(+nightsStr) ? +nightsStr : 0
    const origin  = originRaw ? safeDecode(originRaw) : undefined
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
