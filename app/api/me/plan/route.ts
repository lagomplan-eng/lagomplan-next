// app/api/me/plan/route.ts
// GET — return the authenticated user's current plan state.
//        Used by TripResult.tsx to hydrate the paywall guard from the DB
//        instead of relying on localStorage.

import { NextResponse } from 'next/server'
import { getSupabaseServer } from '../../../../lib/supabase/server'
import { getPlanState } from '../../../../lib/entitlements'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = getSupabaseServer()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const plan = await getPlanState(user.id)
  return NextResponse.json(plan)
}
