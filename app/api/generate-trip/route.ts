// app/api/generate-trip/route.ts
// Proxies to Supabase Edge Function — keeps API keys server-side.
// Server-side entitlement check runs before the AI call — localStorage alone
// is not a security boundary.

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { User } from '@supabase/supabase-js'
import { checkGenerationAllowed, consumeOneTrip } from '../../../lib/entitlements'
import { getSupabaseServer } from '../../../lib/supabase/server'
import { ANON_TRIP_LIMIT } from '../../../lib/plan/limits'

// Vercel Pro allows up to 300 s for serverless functions.
// AI generation takes 60–90 s — the old 60 s limit guaranteed a timeout.
// Hobby plan is capped at 60 s; upgrade to Pro if you need this headroom.
export const maxDuration = 300
export const dynamic = 'force-dynamic'

const ANON_COOKIE = 'anon_gen_count'

// Structured error envelope. Every error path returns the same shape so the
// client can branch on `code` instead of parsing free-form `error` strings.
type ErrBody = { ok: false; code: string; message: string; detail?: unknown }
const err = (status: number, code: string, message: string, detail?: unknown) =>
  NextResponse.json<ErrBody>({ ok: false, code, message, detail }, { status })

// Resolve the calling user from either the session cookie OR an Authorization
// Bearer header. The header is a safety net for the just-logged-in tab where
// the client may have a fresh access_token but the cookie hasn't propagated
// yet (a common cause of spurious 401s on the first post-login request).
async function resolveUser(req: NextRequest): Promise<User | null> {
  const supabase = await getSupabaseServer()

  // 1. Cookie-bound session (normal case)
  const cookieRes = await supabase.auth.getUser()
  if (cookieRes.data.user) return cookieRes.data.user

  // 2. Bearer header fallback
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

export async function POST(req: NextRequest) {
  const startedAt = Date.now()
  try {
    const body = await req.json()

    // ── Entitlement check ────────────────────────────────────────────────────────
    const user = await resolveUser(req)
    console.log('[generate-trip]', JSON.stringify({
      stage: 'auth_resolved',
      userId: user?.id ?? 'anon',
      bodyKeys: Object.keys(body ?? {}),
    }))

    let authorizedUserId: string | null = null

    if (user) {
      // Authenticated — check DB entitlements
      const check = await checkGenerationAllowed()

      if (!check.allowed) {
        const reason = (check as { allowed: false; reason: string }).reason
        // 'error' means infra/config failure — don't show paywall for a broken service
        if (reason === 'error') {
          return err(503, 'entitlement_check_failed', 'Service temporarily unavailable')
        }
        return err(402, 'no_credits', 'No credits remaining', { reason })
      }

      authorizedUserId = (check as { allowed: true; userId: string }).userId

    } else {
      // Anonymous — enforce via cookie
      const cookieStore = await cookies()
      const anonCount   = parseInt(cookieStore.get(ANON_COOKIE)?.value ?? '0', 10)

      if (anonCount >= ANON_TRIP_LIMIT) {
        return err(401, 'anon_limit_reached', 'Please sign up to continue generating trips')
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) {
      console.error('[generate-trip] missing supabase env vars')
      return err(500, 'supabase_not_configured', 'Supabase credentials not configured')
    }

    const functionUrl = `${supabaseUrl}/functions/v1/generate-trip`
    console.log('[generate-trip]', JSON.stringify({
      stage: 'edge_call',
      userId: authorizedUserId ?? 'anon',
      functionUrl,
    }))

    // Abort at 290 s — fires before Vercel's 300 s hard kill so we can
    // return a clean JSON error instead of leaving the client with a dead socket.
    // AI generation typically takes 60–90 s, so 290 s is a safe ceiling.
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 290_000)

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

    const edgeMs = Date.now() - startedAt
    console.log('[generate-trip]', JSON.stringify({
      stage: 'edge_response',
      status: edgeRes.status,
      ms: edgeMs,
    }))

    // Read as text first so we can log and handle non-JSON safely
    const responseText = await edgeRes.text()
    console.log('[generate-trip] edge response (first 1000):', responseText.slice(0, 1000))

    if (!edgeRes.ok) {
      let detail: unknown
      try { detail = JSON.parse(responseText) } catch { detail = responseText.slice(0, 1000) }
      return err(502, 'edge_upstream_failed', `Edge Function returned ${edgeRes.status}`, detail)
    }

    let data: unknown
    try {
      data = JSON.parse(responseText)
    } catch {
      return err(502, 'edge_invalid_json', 'Edge Function returned non-JSON', responseText.slice(0, 500))
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
      const cookieStore = await cookies()
      const prev = parseInt(cookieStore.get(ANON_COOKIE)?.value ?? '0', 10)
      response.cookies.set(ANON_COOKIE, String(prev + 1), {
        maxAge:   60 * 60 * 24 * 30,  // 30 days
        httpOnly: true,
        sameSite: 'lax',
        path:     '/',
      })
    }

    return response

  } catch (e) {
    const isTimeout = e instanceof Error && e.name === 'AbortError'
    const message   = e instanceof Error ? e.message : String(e)
    const ms        = Date.now() - startedAt
    console.error('[generate-trip]', JSON.stringify({
      stage: 'error',
      timeout: isTimeout,
      ms,
      message,
    }))
    if (isTimeout) {
      return err(504, 'timeout', 'Trip generation timed out — please try again')
    }
    return err(500, 'internal', `Internal error: ${message}`)
  }
}
