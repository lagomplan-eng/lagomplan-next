// app/api/trips/[trip_id]/claim/route.ts
// POST — claim an anonymous trip after signup.
//
// Flow: user generated a trip without an account, then signed up. The
// /signup callback POSTs here with the pending trip_id (stashed in
// localStorage before the auth redirect). We update the trip row's
// user_id from NULL to the new user's id so it shows up in their
// "My Trips" list.
//
// Writes use the admin client by design (see same pattern in the share
// POST and trips PATCH routes). RLS UPDATE policies on `trips` typically
// require `user_id = auth.uid()` — but the row's user_id IS NULL here,
// so RLS would block the update silently with the user-scoped client.
// The `.is('user_id', null)` filter on the UPDATE is the real ownership
// guard: only orphan rows can be claimed, so a forged trip_id can't
// steal someone else's trip.

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

  // ── Auth via user-scoped client (RLS-respecting) ────────────────────────────
  const supabase = await getSupabaseServer()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // ── Claim via admin client (RLS-bypassing, but gated by user_id IS NULL) ────
  // Previously this used the user-scoped supabase client, which silently
  // no-op'd because RLS doesn't grant an authenticated user the right to
  // UPDATE a row where `user_id IS NULL` (most policies match on
  // `user_id = auth.uid()`, and NULL fails that comparison). The route
  // returned 200 but the row was never linked — every anonymous trip
  // claim was effectively lost.
  //
  // `.is('user_id', null)` ensures we only claim rows that are actually
  // unowned — a forged trip_id pointing at another user's already-claimed
  // trip will match the id but fail the user_id filter, returning 0 rows.
  const admin = getSupabaseAdmin()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: claimed, error } = await (admin as any)
    .from('trips')
    .update({ user_id: user.id })
    .eq('id', trip_id)
    .is('user_id', null)
    .select('id')

  if (error) {
    console.error('[claim] update error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!claimed || claimed.length === 0) {
    // Could be: trip doesn't exist OR trip is already owned by someone
    // (possibly this same user from a previous claim — idempotent retry).
    // We can't distinguish without an extra select, but a 200 with
    // `claimed: false` is the cleanest signal to the client either way.
    console.warn('[claim] no-op — trip_id:', trip_id, 'user_id:', user.id)
    return NextResponse.json({ success: true, claimed: false })
  }

  console.log('[claim] linked trip:', trip_id, 'to user:', user.id)
  return NextResponse.json({ success: true, claimed: true })
}
