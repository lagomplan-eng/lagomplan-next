// lib/planner/checks.ts
//
// Single source of truth for itinerary check (task) derivation. Extracted from
// TripResult.tsx so both the desktop planner and the mobile companion view
// (app/[locale]/trips/[trip_id]) derive the exact same per-day task list from
// the same itinerary — no drift.
//
// Persistence note: only the *done* state is stored (trip_data.doneChecks, an
// array of check IDs). The check list itself is always derived fresh from
// trip_data.days via deriveChecksFromDays(), never persisted as a `checks`
// array. IDs are stable (semantic for pre-trip checks, `check-${item.id}` for
// per-day ones) so done-state survives regenerate.

import { titleCaseCity } from './format'
import type { TripSegment } from './segments'

export type ItemType = 'hotel' | 'tour' | 'restaurant' | 'free' | 'transfer'

export interface BookingOption {
  id: string
  provider: string
  name: string
  desc: string
  url: string
}

export interface ItineraryItem {
  id: string
  type: ItemType
  time: string
  name: string
  desc: string
  price?: string
  affiliate?: string
  bookingOptions?: BookingOption[]
}

export interface Day {
  n: number
  label: string
  title: string
  progress: number
  items: ItineraryItem[]
}

export interface CheckItem {
  id: string
  icon: string
  text: string
  done: boolean
  day?: number
}

export function normalizeCheckItem(raw: any, index: number): CheckItem {
  if (typeof raw === 'string') {
    return { id: `check-${index}`, icon: '📋', text: raw, done: false }
  }
  return {
    id:   raw?.id   ?? `check-${index}`,
    icon: raw?.icon ?? '📋',
    text: raw?.text ?? raw?.label ?? raw?.title ?? raw?.name ?? `Tarea ${index + 1}`,
    done: raw?.done ?? raw?.completed ?? false,
    day:  raw?.day  ?? raw?.dayNumber ?? undefined,
  }
}

export function deriveChecksFromDays(
  days: Day[],
  opts?: { locale?: 'es' | 'en'; segments?: TripSegment[] },
): CheckItem[] {
  const locale = opts?.locale ?? 'es'
  const segments = opts?.segments ?? []
  const isMultiCity = segments.length >= 2
  const checks: CheckItem[] = []
  const lastDayN = days.length > 0 ? days[days.length - 1].n : 0

  // Pre-trip lodging checks. Single-city → one "Reservar hotel". Multi-city
  // → one "Reservar hotel · <city>" per segment so the user can mark each
  // booking separately and see at a glance which segment is still pending.
  // The per-day hotel-type checks (Confirmar reserva: ...) used to also
  // surface here, but they duplicated the booking concept with AI-generated
  // verbose names ("Check-in en Nyhavn", "Llegada y descanso", etc.) —
  // dropped in favor of one canonical check per stay.
  if (days.length > 1) {
    if (isMultiCity) {
      segments.forEach((seg, i) => {
        const cityLabel = titleCaseCity(seg.destination)
        checks.push({
          id:   `pretrip-book-hotel-seg-${i}`,
          icon: '🏨',
          text: locale === 'en' ? `Book hotel · ${cityLabel}` : `Reservar hotel · ${cityLabel}`,
          done: false,
        })
      })
    } else {
      checks.push({
        id:   'pretrip-book-hotel',
        icon: '🏨',
        text: locale === 'en' ? 'Book hotel' : 'Reservar hotel',
        done: false,
      })
    }
    // Universal pre-trip prep — the Listos milestone bucket. These exist
    // because the AI doesn't emit pre-trip items; without them Listos
    // shows 0/1 (just the packing check) and gets marked done with a
    // single click, which feels wrong (the user expects pre-trip prep
    // to be a real bucket, not a single item). Stable IDs so done-state
    // survives regenerate. Icon '🧳' routes them all to Listos via the
    // milestone categorizer's icon path.
    const listosCopy = locale === 'en' ? {
      pack:      'Pack bag',
      documents: 'Confirm passport & documents',
      offline:   'Save bookings on your phone',
      devices:   'Charge devices and adapters',
    } : {
      pack:      'Empacar maleta',
      documents: 'Confirmar pasaporte y documentos',
      offline:   'Guardar reservas en el teléfono',
      devices:   'Cargar dispositivos y adaptadores',
    }
    checks.push(
      { id: 'pretrip-pack',      icon: '🧳', text: listosCopy.pack,      done: false },
      { id: 'pretrip-documents', icon: '🧳', text: listosCopy.documents, done: false },
      { id: 'pretrip-offline',   icon: '🧳', text: listosCopy.offline,   done: false },
      { id: 'pretrip-devices',   icon: '🧳', text: listosCopy.devices,   done: false },
    )
  }

  days.forEach(day => {
    day.items.forEach((item) => {
      const id = `check-${item.id}`   // stable: tied to item.id, not position
      switch (item.type) {
        case 'hotel':
          // Hotel-type blocks (check-in, check-out, descanso, etc.) no longer
          // generate per-day checks — the pre-trip "Reservar hotel · <city>"
          // injects above are the single canonical booking action per stay.
          // The block still renders in the day card with its time and
          // description.
          break
        case 'transfer':
          if (day.n === 1 || day.n === lastDayN) {
            // Arrival/departure transfer → pre-trip booking. These are the
            // ones the user actually books in advance (airport pickup,
            // return ride, intercity flight).
            const prefix = locale === 'en' ? 'Book transfer' : 'Reservar transfer'
            checks.push({ id, icon: '🚗', text: `${prefix}: ${item.name}`, done: false })
          }
          // Mid-trip transfers (excursion shuttles, in-city Ubers, returns
          // from a day trip) are not pre-bookable in any meaningful sense —
          // the user hails them or arranges in the moment. They still
          // render in the day block; we just don't surface them as checks.
          break
        case 'tour': {
          const prefix = locale === 'en' ? 'Book' : 'Reservar'
          checks.push({ id, icon: '🎫', text: `${prefix}: ${item.name}`, done: false, day: day.n })
          break
        }
        case 'restaurant': {
          const prefix = locale === 'en' ? 'Book table' : 'Reservar mesa'
          checks.push({ id, icon: '🍽', text: `${prefix}: ${item.name}`, done: false, day: day.n })
          break
        }
        // free, relax → no checklist item
      }
    })
  })
  return checks
}

// Filters the user's prior done-check IDs against the check IDs the *new*
// days produce, keeping only those that still apply. Universal pre-trip
// checks use stable semantic IDs (e.g. `pretrip-book-hotel`) so they
// survive; per-day checks use `check-${item.id}` and lose their match when
// the AI emits a new item, which is the correct outcome for activity-level
// confirmations that no longer exist.
export function reconcileDoneChecks(
  prev:    Set<string>,
  days:    Day[],
  locale:  'es' | 'en',
  segments?: TripSegment[],
): Set<string> {
  if (prev.size === 0) return prev
  const stillValid = new Set(deriveChecksFromDays(days, { locale, segments }).map(c => c.id))
  const next = new Set<string>()
  prev.forEach(id => { if (stillValid.has(id)) next.add(id) })
  return next
}
