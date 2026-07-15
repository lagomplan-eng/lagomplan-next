// app/api/me/plan/route.ts
// GET — return the authenticated user's current plan state.
//        Used by TripResult.tsx to hydrate the paywall guard from the DB
//        instead of relying on localStorage.

import { NextRequest, NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { getSupabaseServer } from '../../../../lib/supabase/server'
import { getPlanState } from '../../../../lib/entitlements'

export const dynamic = 'force-dynamic'

// Resolve the calling user from either the session cookie OR an Authorization
// Bearer header. The header is a safety net for the just-logged-in tab where
// the client may have a fresh access_token but the cookie hasn't propagated
// yet — same pattern as app/api/generate-trip/route.ts's resolveUser(). This
// route used to be cookie-only, which 401s during that propagation window;
// the client then permanently stalls (see PlanProvider.refreshPlanCredits),
// silently blocking trip generation for the rest of the session.
async function resolveUser(req: NextRequest): Promise<User | null> {
  const supabase = await getSupabaseServer()

  const cookieRes = await supabase.auth.getUser()
  if (cookieRes.data.user) return cookieRes.data.user

  const authHeader = req.headers.get('authorization') ?? ''
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.slice(7).trim()
    if (token) {
      const tokenRes = await supabase.auth.getUser(token)
      if (tokenRes.data.user) return tokenRes.data.user
    }
  }

  return null
}

export async function GET(req: NextRequest) {
  try {
    const user = await resolveUser(req)

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const plan = await getPlanState(user.id)
    return NextResponse.json(plan)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[me/plan] unhandled error:', msg)
    return NextResponse.json({ error: 'plan_unavailable', detail: msg }, { status: 500 })
  }
}
