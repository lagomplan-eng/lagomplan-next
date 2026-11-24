/**
 * POST /api/hotels/signup — a hotel asks for the neighborhood guide.
 * Validates, applies abuse protection (honeypot, minimum fill time, in-memory rate limit), inserts
 * hotel_partners with status 'pending' (or 'waitlist' for another zone), then emails Elena (and, for the
 * waitlist, the hotel a confirmation). The same hotel name + contact email submitted twice stores no second row
 * and gets the same confirmation. Email failures never fail the signup.
 */
import { NextRequest, NextResponse } from 'next/server'
import { hotelsDb } from '../../../../lib/hotels/db'
import { generateHotelCode } from '../../../../lib/hotels/codes'
import { validateSignup } from '../../../../lib/hotels/signup'
import { allow, clientKey } from '../../../../lib/hotels/ratelimit'
import { sendSignupNotification, sendWaitlistConfirmation } from '../../../../lib/hotels/emails'
import { HOTEL_COLUMNS, type HotelRow } from '../../../../lib/hotels/types'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store' // never serve a hotel lookup from the Data Cache (see lib/hotels/db.ts)
export const revalidate = 0

export async function POST(req: NextRequest) {
  if (!allow(clientKey(req.headers, 'hotel-signup'), 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }) }

  const result = validateSignup(body)
  if (result.ok === 'bot') return NextResponse.json({ ok: true }) // same answer, nothing stored
  if (result.ok === false) return NextResponse.json({ error: result.error }, { status: 422 })
  const v = result.value

  const db = hotelsDb()
  const row = {
    hotel_name: v.hotelName,
    zone: v.zone,
    requested_zone: v.requestedZone,
    contact_name: v.contactName,
    contact_email: v.email,
    maps_url: v.mapsUrl,
    status: v.zone ? 'pending' : 'waitlist',
    lang: v.lang,
    terms_accepted_at: new Date().toISOString(),
    contact_phone: v.contactPhone,
    rooms: v.rooms,
    ...(v.contactRole ? { contact_role: v.contactRole } : {}),
  }

  let inserted: HotelRow | null = null
  for (let attempt = 0; attempt < 4 && !inserted; attempt++) {
    const { data, error } = await db.from('hotel_partners').insert({ ...row, code: generateHotelCode() }).select(HOTEL_COLUMNS).single()
    if (!error) { inserted = data as HotelRow; break }
    if (error.code !== '23505') {
      console.error('[hotels/signup] insert failed:', error.code)
      return NextResponse.json({ error: 'server_error' }, { status: 500 })
    }
    // Unique violation: either the same hotel + contact already exists (same confirmation, no row), or a code collision (retry).
    const { data: existing } = await db.from('hotel_partners').select('id').ilike('hotel_name', v.hotelName.replace(/[\\%_]/g, '\\$&')).ilike('contact_email', v.email.replace(/[\\%_]/g, '\\$&')).limit(1)
    if (existing && existing.length > 0) return NextResponse.json({ ok: true, status: row.status })
  }
  if (!inserted) return NextResponse.json({ error: 'server_error' }, { status: 500 })

  const sends = [sendSignupNotification(inserted)]
  if (inserted.status === 'waitlist') sends.push(sendWaitlistConfirmation(inserted))
  const results = await Promise.all(sends)
  results.forEach((r) => { if (!r.ok) console.error('[hotels/signup] email failed:', r.error) })

  return NextResponse.json({ ok: true, status: inserted.status })
}
