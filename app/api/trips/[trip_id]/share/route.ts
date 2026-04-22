// app/api/trips/[trip_id]/share/route.ts
// POST — generate (or retrieve) a share link for a trip.
//        Auth required: only the trip owner may share it.

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '../../../../../lib/supabase/server'

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ trip_id: string }> },
) {
  const { trip_id } = await context.params

  if (!trip_id) {
    return NextResponse.json({ error: 'Missing trip_id' }, { status: 400 })
  }

  const supabase = await getSupabaseServer()

  // ── Auth ────────────────────────────────────────────────────────────────────
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // ── Ownership check ─────────────────────────────────────────────────────────
  const { data: tripRaw, error: fetchError } = await supabase
    .from('trips')
    .select('id, user_id, share_id')
    .eq('id', trip_id)
    .single()

  const trip = tripRaw as { id: string; user_id: string | null; share_id: string | null } | null

  if (fetchError || !trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  if (trip.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // ── Return existing share_id if already set ─────────────────────────────────
  if (trip.share_id) {
    return NextResponse.json({ shareId: trip.share_id })
  }

  // ── Generate new UUID share token ───────────────────────────────────────────
  const shareId = crypto.randomUUID()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabase as any)
    .from('trips')
    .update({ share_id: shareId, is_shared: true })
    .eq('id', trip_id)

  if (updateError) {
    console.error('[trips/share] update error:', updateError.message)
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  console.log('[trips/share] generated share_id for trip:', trip_id)
  return NextResponse.json({ shareId })
}
