/**
 * GET /g/{code} — the permanent QR link. It is printed on paper: this path must never change.
 * {code} is the random code, or a readable alias listed in lib/hotels/aliases.ts (same behaviour, same scan).
 *
 * Approved hotel: record a scan (skipped for bots, link-preview fetchers, prefetches, HEAD and links with ?via=share) and redirect to
 * the zone guide with ?h={code}&lang=. Unknown, rejected, paused (or not yet approved) code: redirect to the
 * plain zone guide when the zone is known, otherwise to the home page. A guest never sees an error.
 * Nothing about the requester is stored.
 */
import { NextRequest, NextResponse } from 'next/server'
import { hotelsDb } from '../../../lib/hotels/db'
import { isValidHotelCode } from '../../../lib/hotels/codes'
import { resolveHotelCode } from '../../../lib/hotels/aliases'
import { isCountableScan, isShareOpen } from '../../../lib/hotels/bots'
import { resolveLang } from '../../../lib/hotels/lang'
import { zoneGuidePath } from '../../../lib/hotels/links'
import { isHotelZone } from '../../../content/guia/hotel/zones'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store' // never serve a hotel lookup from the Data Cache (see lib/hotels/db.ts)
export const revalidate = 0

async function handle(req: NextRequest, params: Promise<{ code: string }>) {
  // A readable alias from lib/hotels/aliases.ts (/g/casa-cuenca) is only a doorway to the hotel's random code.
  const code = resolveHotelCode((await params).code)
  // ?lang=es|en (a link the guest shared from the guide) wins over the phone's language.
  const lang = resolveLang(req.nextUrl.searchParams.get('lang'), req.headers.get('accept-language'))
  let target = '/'

  if (isValidHotelCode(code)) {
    try {
      const db = hotelsDb()
      const { data: hotel } = await db.from('hotel_partners').select('id, zone, status').eq('code', code).maybeSingle()
      if (hotel && isHotelZone(hotel.zone)) {
        if (hotel.status === 'approved') {
          // A shared link keeps ?via=share in the guide's address, so the guide records no opens (mood, zone, plan) for that visit.
          target = zoneGuidePath(hotel.zone, { h: code, lang, ...(isShareOpen(req.nextUrl.searchParams) ? { via: 'share' } : {}) })
          // A link shared from the guide (?via=share) is not a new scan; everything else about the redirect is the same.
          if (isCountableScan(req) && !isShareOpen(req.nextUrl.searchParams)) {
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
