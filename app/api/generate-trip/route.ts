// app/api/generate-trip/route.ts
// Proxies to Supabase Edge Function — keeps API keys server-side.
// Server-side entitlement check runs before the AI call — localStorage alone
// is not a security boundary.

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { checkGenerationAllowed, consumeOneTrip } from '../../../lib/entitlements'
import { getSupabaseServer } from '../../../lib/supabase/server'

// Vercel Pro allows up to 300 s for serverless functions.
// AI generation takes 60–90 s — the old 60 s limit guaranteed a timeout.
// Hobby plan is capped at 60 s; upgrade to Pro if you need this headroom.
export const maxDuration = 300
export const dynamic = 'force-dynamic'

const ANON_COOKIE   = 'anon_gen_count'
const ANON_LIMIT    = 1   // anonymous users get 1 free generation, then must sign up

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // ── Entitlement check ────────────────────────────────────────────────────────
    const supabase  = getSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    let authorizedUserId: string | null = null

    if (user) {
      // Authenticated — check DB entitlements
      const check = await checkGenerationAllowed()

      if (!check.allowed) {
        const reason = (check as { allowed: false; reason: string }).reason
        // 'error' means infra/config failure — don't show paywall for a broken service
        if (reason === 'error') {
          return NextResponse.json(
            { error: 'service_unavailable', reason: 'entitlement_check_failed' },
            { status: 503 },
          )
        }
        return NextResponse.json(
          { error: 'no_credits', reason },
          { status: 402 },
        )
      }

      authorizedUserId = (check as { allowed: true; userId: string }).userId

    } else {
      // Anonymous — enforce via cookie
      const cookieStore = cookies()
      const anonCount   = parseInt(cookieStore.get(ANON_COOKIE)?.value ?? '0', 10)

      if (anonCount >= ANON_LIMIT) {
        return NextResponse.json(
          { error: 'not_authenticated', reason: 'Please sign up to continue generating trips' },
          { status: 401 },
        )
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 },
      )
    }

    const functionUrl = `${supabaseUrl}/functions/v1/generate-trip`
    console.log('[generate-trip] payload:', JSON.stringify(body))
    console.log('[generate-trip] calling:', functionUrl)

    // Abort at 290 s — fires before Vercel's 300 s hard kill so we can
    // return a clean JSON error instead of leaving the client with a dead socket.
    // AI generation typically takes 60–90 s, so 290 s is a safe ceiling.
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 290_000)
    console.log('[generate-trip] start')

    let edgeRes: Response
    try {
      edgeRes = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeoutId)
    }

    console.log('[generate-trip] edge status:', edgeRes.status)

    // Read as text first so we can log and handle non-JSON safely
    const responseText = await edgeRes.text()
    console.log('[generate-trip] edge response (first 1000):', responseText.slice(0, 1000))

    if (!edgeRes.ok) {
      let detail: unknown
      try { detail = JSON.parse(responseText) } catch { detail = responseText }
      return NextResponse.json(
        { error: `Edge Function returned ${edgeRes.status}`, detail },
        { status: 502 },
      )
    }

    let data: unknown
    try {
      data = JSON.parse(responseText)
    } catch {
      return NextResponse.json(
        { error: 'Edge Function returned non-JSON', raw: responseText.slice(0, 500) },
        { status: 502 },
      )
    }

    // ── Deduct credit before returning (Vercel Functions terminate at response send) ──
    if (authorizedUserId) {
      // Authenticated: decrement DB credits synchronously
      await consumeOneTrip(authorizedUserId).catch(e =>
        console.error('[generate-trip] consumeOneTrip error:', e)
      )
    }

    const response = NextResponse.json(data)

    if (!authorizedUserId) {
      // Anonymous: set cookie so the next attempt is blocked server-side
      const cookieStore = cookies()
      const prev = parseInt(cookieStore.get(ANON_COOKIE)?.value ?? '0', 10)
      response.cookies.set(ANON_COOKIE, String(prev + 1), {
        maxAge:   60 * 60 * 24 * 30,  // 30 days
        httpOnly: true,
        sameSite: 'lax',
        path:     '/',
      })
    }

    return response

  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'AbortError'
    const message   = err instanceof Error ? err.message : String(err)
    console.error('[generate-trip] error:', message)
    return NextResponse.json(
      { error: isTimeout ? 'Trip generation timed out — please try again' : `Internal error: ${message}` },
      { status: isTimeout ? 504 : 500 },
    )
  }
}
