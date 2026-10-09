/**
 * lib/guia/stay.ts
 *
 * Optional stay details a host can append to a /guia/[partner] link so the
 * guide reads as "your stay" instead of a generic page:
 *
 *   ?llegada=2026-11-05&noches=3&adultos=2&ninos=2
 *
 * Every param is optional and validated on its own. An invalid or missing
 * param is simply ignored — it never throws and never half-applies — so a
 * link with no (or garbage) params renders the guide exactly as before.
 * Pure: no window access; callers pass the query string.
 */

import type { Lang } from '../../content/guia/types'

export interface Stay {
  /** ISO calendar date, YYYY-MM-DD. */
  arrival?: string
  nights?: number
  adults?: number
  children?: number
}

const MAX_NIGHTS = 60
const MAX_PEOPLE = 20

function intInRange(raw: string | null, min: number, max: number): number | undefined {
  if (raw === null || !/^\d{1,3}$/.test(raw)) return undefined
  const n = Number(raw)
  return n >= min && n <= max ? n : undefined
}

/** A real calendar date (rejects 2026-02-31) in a sane range. */
function isoDate(raw: string | null): string | undefined {
  if (raw === null || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return undefined
  const [y, m, d] = raw.split('-').map(Number)
  if (y < 2000 || y > 2100) return undefined
  const dt = new Date(Date.UTC(y, m - 1, d))
  const ok = dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d
  return ok ? raw : undefined
}

export function parseStay(search: string | URLSearchParams): Stay {
  const p = typeof search === 'string' ? new URLSearchParams(search) : search
  const stay: Stay = {}
  const arrival = isoDate(p.get('llegada'))
  const nights = intInRange(p.get('noches'), 1, MAX_NIGHTS)
  const adults = intInRange(p.get('adultos'), 1, MAX_PEOPLE)
  const children = intInRange(p.get('ninos'), 0, MAX_PEOPLE)
  if (arrival !== undefined) stay.arrival = arrival
  if (nights !== undefined) stay.nights = nights
  if (adults !== undefined) stay.adults = adults
  if (children !== undefined) stay.children = children
  return stay
}

/** "Tus 3 noches en Condesa" / "Your 3 nights in Condesa". Needs valid nights. */
export function stayHeading(lang: Lang, nights: number, place: string): string {
  if (lang === 'es') {
    return nights === 1 ? `Tu noche en ${place}` : `Tus ${nights} noches en ${place}`
  }
  return nights === 1 ? `Your night in ${place}` : `Your ${nights} nights in ${place}`
}
