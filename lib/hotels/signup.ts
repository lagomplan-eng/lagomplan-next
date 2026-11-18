// lib/hotels/signup.ts — validation of the hotel signup form. Pure.
import { isHotelZone, type HotelZone } from '../../content/guia/hotel/zones'

export interface SignupInput {
  hotelName: string
  zone: HotelZone | null          // null = "my hotel is in another zone" (waitlist)
  requestedZone: string | null    // the neighborhood they typed, only for the waitlist
  contactName: string
  email: string
  mapsUrl: string | null
  contactPhone: string | null     // optional: WhatsApp or phone
  rooms: number | null            // optional: number of rooms
  contactRole: string | null      // optional: role of the contact at the hotel
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

  // Abuse protection. A honeypot field real people never see: a bot gets a silent success, nothing stored.
  if (clean(b.website, 200) !== '') return { ok: 'bot' }
  // A form submitted less than 3 s after it opened is probably a script, but it can also be a fast person with a
  // browser autofill: say so, so they can try again (this is NOT shown as a success).
  const opened = Number(b.openedAt)
  if (!Number.isFinite(opened) || now - opened < 3000) return { ok: false, error: 'too_fast' }

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

  let contactPhone: string | null = null
  const rawPhone = clean(b.contactPhone, 40)
  if (rawPhone) {
    if (!/^[+\d][\d\s().-]{5,39}$/.test(rawPhone)) return { ok: false, error: 'contactPhone' }
    contactPhone = rawPhone
  }

  let rooms: number | null = null
  const rawRooms = clean(b.rooms, 6)
  if (rawRooms) {
    const n = Number(rawRooms)
    if (!/^\d+$/.test(rawRooms) || n < 1 || n > 5000) return { ok: false, error: 'rooms' }
    rooms = n
  }

  const contactRole = clean(b.contactRole, 120) || null

  return { ok: true, value: { hotelName, zone, requestedZone, contactName, email, mapsUrl, contactPhone, rooms, contactRole, lang } }
}
