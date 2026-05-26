// app/api/trips/[trip_id]/share/route.ts
// POST — generate (or retrieve) a share link for a trip.
//        Auth required: only the trip owner may share it.

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer, getSupabaseAdmin } from '../../../../../lib/supabase/server'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ trip_id: string }> },
) {
  const { trip_id } = await params

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

  // ── Writes via admin client ─────────────────────────────────────────────────
  // The user-scoped supabase client respects RLS. The current RLS policies on
  // `trips` don't permit the share_id / is_shared UPDATE for the owning user,
  // so the previous code silently succeeded with zero rows affected — no SQL
  // error, but the column stayed false and every share link bounced visitors
  // to /home. Switch to the service-role admin client for the UPDATE and gate
  // it with an explicit `eq('user_id', user.id)` so a forged trip_id in the
  // URL still can't share someone else's trip. Same pattern as the PATCH and
  // DELETE handlers in app/api/trips/[trip_id]/route.ts.
  const admin = getSupabaseAdmin()

  // ── Return existing share_id if already set ─────────────────────────────────
  // ALSO re-assert is_shared: true. The share-view page redirects to /home
  // when is_shared is falsy, so a row with share_id set but is_shared=false
  // (legacy data, schema migration that didn't backfill, manual DB edit) gave
  // a valid-looking URL that bounced recipients to the homepage. Setting it
  // on every POST keeps the endpoint idempotent.
  if (trip.share_id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: flagged, error: flagError } = await (admin as any)
      .from('trips')
      .update({ is_shared: true })
      .eq('id', trip_id)
      .eq('user_id', user.id)
      .select('id')
    if (flagError) {
      console.error('[trips/share] is_shared re-assert error:', flagError.message)
      return NextResponse.json({ error: flagError.message }, { status: 500 })
    }
    if (!flagged || flagged.length === 0) {
      console.warn('[trips/share] re-assert no-op — trip_id:', trip_id, 'user_id:', user.id)
      return NextResponse.json({ error: 'Trip not found or not owned by user' }, { status: 404 })
    }
    return NextResponse.json({ shareId: trip.share_id })
  }

  // ── Generate new UUID share token ───────────────────────────────────────────
  const shareId = crypto.randomUUID()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: updated, error: updateError } = await (admin as any)
    .from('trips')
    .update({ share_id: shareId, is_shared: true })
    .eq('id', trip_id)
    .eq('user_id', user.id)
    .select('id')

  if (updateError) {
    console.error('[trips/share] update error:', updateError.message)
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  if (!updated || updated.length === 0) {
    console.warn('[trips/share] update no-op — trip_id:', trip_id, 'user_id:', user.id)
    return NextResponse.json({ error: 'Trip not found or not owned by user' }, { status: 404 })
  }

  console.log('[trips/share] generated share_id for trip:', trip_id)
  return NextResponse.json({ shareId })
}
