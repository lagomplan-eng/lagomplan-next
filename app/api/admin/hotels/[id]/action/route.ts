/**
 * POST /api/admin/hotels/[id]/action — approve | reject | pause | resend | notes. Admin only (ADMIN_EMAILS).
 * Approval is manual. On the FIRST approval the hotel gets one email with its printable card and the guide link;
 * re-approving a paused hotel does not email again (use "resend"). Rejection sends one polite email.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminEmail } from '../../../../../../lib/hotels/admin'
import { getHotelById, hotelsDb } from '../../../../../../lib/hotels/db'
import { sendApprovalEmail, sendRejectionEmail } from '../../../../../../lib/hotels/emails'
import { HOTEL_COLUMNS } from '../../../../../../lib/hotels/types'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store' // never serve a hotel lookup from the Data Cache (see lib/hotels/db.ts)
export const revalidate = 0
const UUID = /^[0-9a-f-]{36}$/i

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await getAdminEmail())) return new NextResponse(null, { status: 404 })
  const { id } = await ctx.params
  if (!UUID.test(id)) return NextResponse.json({ error: 'bad_id' }, { status: 400 })
  let body: { action?: string; notes?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }) }

  const hotel = await getHotelById(id)
  if (!hotel) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const db = hotelsDb()
  let email: 'sent' | 'failed' | 'skipped' = 'skipped'
  let patch: Record<string, unknown> | null = null

  switch (body.action) {
    case 'approve': {
      if (!hotel.zone) return NextResponse.json({ error: 'zone_required' }, { status: 422 })
      if (hotel.status === 'approved') return NextResponse.json({ error: 'already_approved' }, { status: 409 })
      patch = { status: 'approved', approved_at: hotel.approved_at ?? new Date().toISOString() }
      break
    }
    case 'reject':
      if (hotel.status === 'rejected') return NextResponse.json({ error: 'already_rejected' }, { status: 409 })
      patch = { status: 'rejected' }
      break
    case 'pause':
      if (hotel.status !== 'approved') return NextResponse.json({ error: 'not_approved' }, { status: 409 })
      patch = { status: 'paused' }
      break
    case 'resend':
      if (hotel.status !== 'approved') return NextResponse.json({ error: 'not_approved' }, { status: 409 })
      break
    case 'notes': {
      const notes = typeof body.notes === 'string' ? body.notes.slice(0, 4000) : ''
      patch = { notes: notes || null }
      break
    }
    default:
      return NextResponse.json({ error: 'bad_action' }, { status: 400 })
  }

  let updated = hotel
  if (patch) {
    const { data, error } = await db.from('hotel_partners').update(patch).eq('id', id).select(HOTEL_COLUMNS).single()
    if (error) { console.error('[admin/hotels] update failed:', error.code); return NextResponse.json({ error: 'server_error' }, { status: 500 }) }
    updated = data
  }

  if (body.action === 'approve' && !hotel.approved_at) email = (await sendApprovalEmail(updated)).ok ? 'sent' : 'failed'
  if (body.action === 'resend') email = (await sendApprovalEmail(updated)).ok ? 'sent' : 'failed'
  if (body.action === 'reject' && hotel.status === 'pending') email = (await sendRejectionEmail(updated)).ok ? 'sent' : 'failed'

  return NextResponse.json({ ok: true, hotel: updated, email })
}
