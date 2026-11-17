// lib/hotels/signup.ts — validation of the hotel signup form. Pure.
import { isHotelZone, type HotelZone } from '../../content/guia/hotel/zones'

export interface SignupInput {
  hotelName: string
  zone: HotelZone | null          // null = "my hotel is in another zone" (waitlist)
  requestedZone: string | null    // the neighborhood they typed, only for the waitlist
  contactName: string
  email: string
  mapsUrl: string | null
  lang: 'es' | 'en'
}

export type SignupResult =
  | { ok: true; value: SignupInput }
  | { ok: false; error: string }
  | { ok: 'bot' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '')

export function validateSignup(body: unknown, now = Date.now()): SignupResult {
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>

  // Abuse protection: a honeypot field real people never see, and a form that was open for >= 3 s.
  if (clean(b.website, 200) !== '') return { ok: 'bot' }
  const opened = Number(b.openedAt)
  if (!Number.isFinite(opened) || now - opened < 3000) return { ok: 'bot' }

  const lang = b.lang === 'en' ? 'en' : 'es'
  const hotelName = clean(b.hotelName, 160)
  const contactName = clean(b.contactName, 160)
  const email = clean(b.email, 254).toLowerCase()
  if (!hotelName) return { ok: false, error: 'hotelName' }
  if (!contactName) return { ok: false, error: 'contactName' }
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'email' }
  if (b.terms !== true) return { ok: false, error: 'terms' }

  let zone: HotelZone | null = null
  let requestedZone: string | null = null
  if (b.zone === 'other') {
    requestedZone = clean(b.requestedZone, 120)
    if (!requestedZone) return { ok: false, error: 'requestedZone' }
  } else if (isHotelZone(b.zone)) {
    zone = b.zone
  } else {
    return { ok: false, error: 'zone' }
  }

  let mapsUrl: string | null = null
  const rawMaps = clean(b.mapsUrl, 500)
  if (rawMaps) {
    try {
      const u = new URL(rawMaps)
      if (u.protocol !== 'https:' && u.protocol !== 'http:') return { ok: false, error: 'mapsUrl' }
      mapsUrl = u.toString()
    } catch {
      return { ok: false, error: 'mapsUrl' }
    }
  }

  return { ok: true, value: { hotelName, zone, requestedZone, contactName, email, mapsUrl, lang } }
}
