/**
 * POST /api/hotels/event — section_open / outbound_click from the hotel guide.
 * Accepts only the codes of APPROVED hotels and whitelisted section ids (content/guia/hotel/config.ts),
 * rate limited. Stores hotel_id, event_type, section, lang and a timestamp — nothing about the guest. A tap on a place's link
 * also stores which place (a known id from our own content) and where in the guide (a fixed list); both optional.
 */
import { NextRequest, NextResponse } from 'next/server'
import { hotelsDb } from '../../../../lib/hotels/db'
import { parseHotelEvent } from '../../../../lib/hotels/events'
import { allow, clientKey } from '../../../../lib/hotels/ratelimit'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store' // never serve a hotel lookup from the Data Cache (see lib/hotels/db.ts)
export const revalidate = 0
const NO_CONTENT = () => new NextResponse(null, { status: 204 })

export async function POST(req: NextRequest) {
  if (!allow(clientKey(req.headers, 'hotel-event'), 90, 60 * 1000)) return new NextResponse(null, { status: 429 })
  let body: unknown
  try { body = JSON.parse(await req.text()) } catch { return new NextResponse(null, { status: 400 }) }
  const ev = parseHotelEvent(body)
  if (!ev) return new NextResponse(null, { status: 400 })

  const db = hotelsDb()
  const { data: hotel } = await db.from('hotel_partners').select('id').eq('code', ev.code).eq('status', 'approved').maybeSingle()
  if (!hotel) return NO_CONTENT() // unknown / paused hotel: acknowledge, store nothing
  const base = { hotel_id: hotel.id, event_type: ev.type, section: ev.section, lang: ev.lang }
  const withPlace = ev.place || ev.source ? { ...base, ...(ev.place ? { place: ev.place } : {}), ...(ev.source ? { source: ev.source } : {}) } : null
  let { error } = await db.from('hotel_guide_events').insert(withPlace ?? base)
  // Code live before the place/source migration is applied: keep the click, drop the two details (never lose the event).
  if (error && withPlace && (error.code === 'PGRST204' || error.code === '42703')) ({ error } = await db.from('hotel_guide_events').insert(base))
  if (error) console.error('[hotels/event] insert failed:', error.code)
  return NO_CONTENT()
}
