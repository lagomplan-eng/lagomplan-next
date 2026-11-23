/**
 * GET /g/{code} — the permanent QR link. It is printed on paper: this path must never change.
 *
 * Approved hotel: record a scan (skipped for bots, link-preview fetchers, prefetches and HEAD) and redirect to
 * the zone guide with ?h={code}&lang=. Unknown, rejected, paused (or not yet approved) code: redirect to the
 * plain zone guide when the zone is known, otherwise to the home page. A guest never sees an error.
 * Nothing about the requester is stored.
 */
import { NextRequest, NextResponse } from 'next/server'
import { hotelsDb } from '../../../lib/hotels/db'
import { isValidHotelCode } from '../../../lib/hotels/codes'
import { isCountableScan } from '../../../lib/hotels/bots'
import { resolveLang } from '../../../lib/hotels/lang'
import { zoneGuidePath } from '../../../lib/hotels/links'
import { isHotelZone } from '../../../content/guia/hotel/zones'

export const dynamic = 'force-dynamic'

async function handle(req: NextRequest, params: Promise<{ code: string }>) {
  const { code } = await params
  // ?lang=es|en (a link the guest shared from the guide) wins over the phone's language.
  const lang = resolveLang(req.nextUrl.searchParams.get('lang'), req.headers.get('accept-language'))
  let target = '/'

  if (isValidHotelCode(code)) {
    try {
      const db = hotelsDb()
      const { data: hotel } = await db.from('hotel_partners').select('id, zone, status').eq('code', code).maybeSingle()
      if (hotel && isHotelZone(hotel.zone)) {
        if (hotel.status === 'approved') {
          target = zoneGuidePath(hotel.zone, { h: code, lang })
          if (isCountableScan(req)) {
            const { error } = await db.from('hotel_guide_events').insert({ hotel_id: hotel.id, event_type: 'scan', lang })
            if (error) console.error('[g] scan insert failed:', error.code)
          }
        } else {
          target = zoneGuidePath(hotel.zone, { lang })
        }
      }
    } catch (e) {
      console.error('[g] lookup failed:', e instanceof Error ? e.message : 'error')
    }
  }

  const res = NextResponse.redirect(new URL(target, req.url), 307)
  res.headers.set('Cache-Control', 'no-store')
  return res
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ code: string }> }) { return handle(req, ctx.params) }
export async function HEAD(req: NextRequest, ctx: { params: Promise<{ code: string }> }) { return handle(req, ctx.params) }
