// lib/planner/itinerary-edit.ts
//
// Pure helper for the mobile inline itinerary editor. Sanitizes a client-
// supplied `days` array before it replaces trip_data.days via the companion
// route's read-modify-write.
//
// Invariants it must hold (these are what the tests pin down):
//   - Replaces ONLY the editable text fields (day title/label, item
//     time/name/desc) and clamps their length.
//   - PRESERVES every other field on each day and item — crucially `id`
//     (done-checks are keyed `check-${item.id}`) plus price / affiliate /
//     bookingOptions / type and anything the mobile client doesn't model.
//   - Caps day and item counts so a tampered payload can't blow up the row.
//   - Returns null when the input isn't an array, so the caller can 400.

export const MAX_DAYS = 60
export const MAX_ITEMS_PER_DAY = 60
export const MAX_TITLE_LEN = 300
export const MAX_DESC_LEN = 2000
export const MAX_TIME_LEN = 40

export const clampStr = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.trim().slice(0, max) : ''

export function sanitizeItineraryDays(raw: unknown): Record<string, unknown>[] | null {
  if (!Array.isArray(raw)) return null
  return raw.slice(0, MAX_DAYS).map(day => {
    const d = (day && typeof day === 'object') ? day as Record<string, unknown> : {}
    const items = Array.isArray(d.items) ? d.items : []
    return {
      ...d,                                        // preserve n, progress, unknown fields
      title: clampStr(d.title, MAX_TITLE_LEN),
      label: clampStr(d.label, MAX_TITLE_LEN),
      items: items.slice(0, MAX_ITEMS_PER_DAY).map(item => {
        const it = (item && typeof item === 'object') ? item as Record<string, unknown> : {}
        return {
          ...it,                                   // preserve id, type, price, affiliate, bookingOptions, …
          time: clampStr(it.time, MAX_TIME_LEN),
          name: clampStr(it.name, MAX_TITLE_LEN),
          desc: clampStr(it.desc, MAX_DESC_LEN),
        }
      }),
    }
  })
}
