// app/api/entitlements/route.ts
// GET — unified entitlement state for the authenticated user.
// Single source of truth: always reads from DB, never from Stripe state.

import { NextResponse } from 'next/server'
import { getSupabaseServer } from '../../../lib/supabase/server'
import { getEntitlement } from '../../../lib/entitlements'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await getSupabaseServer()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const entitlement = await getEntitlement(user.id)
    return NextResponse.json(entitlement)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[entitlements] unhandled error:', msg)
    return NextResponse.json({ error: 'entitlement_unavailable', detail: msg }, { status: 500 })
  }
}
