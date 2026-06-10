// lib/planner/progress.ts
//
// The trip_progress contract — traveler-progress data owned by the mobile
// companion view (app/[locale]/trips/[trip_id]). Lives in its own JSONB column
// (migration 20260605_add_trip_progress.sql) so the desktop planner's wholesale
// trip_data autosave can never clobber it. The planner never touches this; the
// companion view never writes plan structure. See the migration header for the
// full rationale.

import { sanitizeBookingUrl } from './booking'

/** A traveler's free-text note + reference link attached to one itinerary item. */
export interface ItemAnnotation {
  note?: string
  link?: string
}

export interface TripProgress {
  /** Per-itinerary-item notes & links, keyed by ItineraryItem.id. */
  annotations: Record<string, ItemAnnotation>
  /** Indices into trip_data.packing[] the traveler has checked off. */
  packedItems: number[]
}

export const EMPTY_PROGRESS: TripProgress = { annotations: {}, packedItems: [] }

/** The two budget currencies the planner supports (label only — no conversion). */
export type Currency = 'MXN' | 'USD'

/**
 * Coerce an arbitrary value into a valid budget Currency, or null if it isn't
 * one. Used by the companion PATCH endpoint: an unrecognized value is ignored
 * (the save proceeds without touching currency) rather than rejected — a stale
 * or garbage currency must never block an otherwise-valid progress write.
 */
export function coerceCurrency(raw: unknown): Currency | null {
  return raw === 'USD' ? 'USD' : raw === 'MXN' ? 'MXN' : null
}

/**
 * Resolve the trip currency from candidate sources in priority order, falling
 * back to 'MXN'. The mobile companion uses this with the AUTHORITATIVE top-level
 * `currency` column first, then the `trip_data.currency` mirror.
 *
 * Why it matters (web↔mobile parity): the desktop autosave writes currency only
 * to the top-level column — its wholesale `trip_data` bundle omits `currency`,
 * so `trip_data.currency` is wiped on every desktop save. If mobile read only
 * `trip_data.currency` it would revert to MXN after any desktop edit (and never
 * see the currency chosen at creation, which also lands top-level only). Reading
 * the top-level column first keeps both surfaces in agreement.
 */
export function resolveTripCurrency(...candidates: unknown[]): Currency {
  for (const c of candidates) {
    const cur = coerceCurrency(c)
    if (cur) return cur
  }
  return 'MXN'
}

const NOTE_MAX = 500          // generous; matches the booking-URL cap in booking.ts
const MAX_PACKING = 1000      // tamper guard — packing lists are never this long

/**
 * Coerce an arbitrary JSON value (DB column, request body) into a clean
 * TripProgress. Drops anything malformed rather than throwing — a corrupt
 * progress blob should degrade to "no progress", never break the view.
 */
export function normalizeTripProgress(raw: unknown): TripProgress {
  if (!raw || typeof raw !== 'object') return { annotations: {}, packedItems: [] }
  const r = raw as Record<string, unknown>

  const annotations: Record<string, ItemAnnotation> = {}
  if (r.annotations && typeof r.annotations === 'object') {
    for (const [id, val] of Object.entries(r.annotations as Record<string, unknown>)) {
      if (typeof id !== 'string' || !id) continue
      const ann = sanitizeAnnotation(val)
      if (ann) annotations[id] = ann
    }
  }

  const packedItems = Array.isArray(r.packedItems)
    ? Array.from(
        new Set(
          r.packedItems.filter(
            (n): n is number => Number.isInteger(n) && n >= 0 && n < MAX_PACKING,
          ),
        ),
      )
    : []

  return { annotations, packedItems }
}

/**
 * Validate one item annotation. Note is trimmed + length-capped; link is run
 * through the shared booking-URL sanitizer (rejects javascript:/data:/file:
 * schemes, caps length) so it's safe to render as an href. Returns null when
 * neither field has usable content — callers drop empty annotations entirely.
 */
export function sanitizeAnnotation(val: unknown): ItemAnnotation | null {
  if (!val || typeof val !== 'object') return null
  const v = val as Record<string, unknown>
  const out: ItemAnnotation = {}

  if (typeof v.note === 'string') {
    const note = v.note.trim().slice(0, NOTE_MAX)
    if (note) out.note = note
  }

  const link = sanitizeBookingUrl(v.link)
  if (link) out.link = link

  return out.note || out.link ? out : null
}
