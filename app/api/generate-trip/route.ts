// app/api/generate-trip/route.ts
// Proxies to Supabase Edge Function — keeps API keys server-side.
// Server-side entitlement check runs before the AI call — localStorage alone
// is not a security boundary.

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { User } from '@supabase/supabase-js'
import { checkGenerationAllowed, consumeOneTrip } from '../../../lib/entitlements'
import { getSupabaseAdmin, getSupabaseServer } from '../../../lib/supabase/server'
import { ANON_TRIP_LIMIT } from '../../../lib/plan/limits'
import { computeNights, isOvernight } from '../../../lib/planner/accommodations'
import type { TripDestinationContext } from '../../../lib/planner/accommodations'
import { validateAccommodations } from '../../../lib/planner/validate-trip'

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

// Verify that a tripId was created by the calling user. A request that passes
// ownership is treated as a regeneration → no credit consumed. Any failure
// mode (missing id, not found, wrong owner, DB error) falls through to the
// "new trip" billing path, so bypass attempts simply get charged normally.
async function isRegenerationOfOwnedTrip(
  tripId: unknown,
  userId: string | null,
): Promise<boolean> {
  if (!userId) return false
  if (typeof tripId !== 'string' || tripId.length === 0) return false

  try {
    const admin = getSupabaseAdmin()
    const { data, error } = await (admin as any)
      .from('trips')
      .select('user_id')
      .eq('id', tripId)
      .single()

    if (error || !data) return false
    return data.user_id === userId
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now()
  try {
    const body = await req.json()
    const tripIdRaw = (body && typeof body === 'object') ? (body as any).tripId : null

    // ── Entitlement check ────────────────────────────────────────────────────────
    const user = await resolveUser(req)
    const isRegeneration = await isRegenerationOfOwnedTrip(tripIdRaw, user?.id ?? null)
    console.log('[generate-trip]', JSON.stringify({
      stage: 'auth_resolved',
      userId: user?.id ?? 'anon',
      tripId: typeof tripIdRaw === 'string' ? tripIdRaw : null,
      isRegeneration,
      bodyKeys: Object.keys(body ?? {}),
    }))

    let authorizedUserId: string | null = null

    if (user) {
      if (isRegeneration) {
        // Regeneration of an owned trip — skip entitlement check entirely so
        // users out of credits can still iterate on trips they already paid for.
        authorizedUserId = user.id
      } else {
        // Authenticated new trip — check DB entitlements
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
      }

    } else {
      // Anonymous — enforce via cookie. Anon users cannot own a trip in the DB,
      // so `isRegeneration` is always false here; the limit check stays.
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

    // ── Deterministic nights / overnight ─────────────────────────────────────────
    // Computed server-side from the request, never inferred by the LLM.
    // Same calculation the front-end uses (lib/planner/accommodations.ts).
    // Pass both into the Edge Function so its prompt can branch on overnight.
    const tripStart = typeof body?.start === 'string' ? body.start : ''
    const tripEnd   = typeof body?.end   === 'string' ? body.end   : ''
    const nights    = computeNights(tripStart, tripEnd)
    const overnight = isOvernight(nights)

    const ctx: TripDestinationContext = {
      destination: typeof body?.destination === 'string' ? body.destination : '',
      start:       tripStart,
      end:         tripEnd,
      nights,
      adults:      typeof body?.travelers === 'number' ? body.travelers : undefined,
      locale:      body?.locale === 'en' ? 'en' : 'es',
    }

    // ── Edge Function caller (factored so we can retry it) ───────────────────────
    // Returns either the parsed trip_data on success, or an ErrBody-style failure
    // that the outer handler short-circuits with. The 290s timeout is per attempt;
    // the retry path is gated on the response shape, not on whether the Edge
    // Function timed out (a timeout is an outer failure we surface to the user).
    async function callEdgeOnce(extraBody: Record<string, unknown>): Promise<
      | { ok: true; data: unknown }
      | { ok: false; status: number; code: string; message: string; detail?: unknown }
    > {
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
          body: JSON.stringify({ ...body, ...extraBody, nights, overnight }),
          signal: controller.signal,
        })
      } finally {
        clearTimeout(timeoutId)
      }

      console.log('[generate-trip]', JSON.stringify({
        stage:  'edge_response',
        status: edgeRes.status,
        ms:     Date.now() - startedAt,
      }))

      const responseText = await edgeRes.text()
      console.log('[generate-trip] edge response (first 1000):', responseText.slice(0, 1000))

      if (!edgeRes.ok) {
        let detail: unknown
        try { detail = JSON.parse(responseText) } catch { detail = responseText.slice(0, 1000) }
        return { ok: false, status: 502, code: 'edge_upstream_failed',
                 message: `Edge Function returned ${edgeRes.status}`, detail }
      }

      try {
        return { ok: true, data: JSON.parse(responseText) }
      } catch {
        return { ok: false, status: 502, code: 'edge_invalid_json',
                 message: 'Edge Function returned non-JSON', detail: responseText.slice(0, 500) }
      }
    }

    // ── Attempt 1 ────────────────────────────────────────────────────────────────
    const attempt1 = await callEdgeOnce({})
    if (attempt1.ok === false) {
      return err(attempt1.status, attempt1.code, attempt1.message, attempt1.detail)
    }

    // ── Validate accommodations contract ─────────────────────────────────────────
    // Trip shape on the edge is { success, trip_data } — operate on trip_data.
    function extractTripData(payload: unknown): unknown {
      if (payload && typeof payload === 'object') {
        const obj = payload as { trip_data?: unknown }
        if (obj.trip_data) return obj.trip_data
      }
      return payload
    }

    let workingEnvelope: unknown = attempt1.data
    let workingTripData = extractTripData(workingEnvelope)
    let validation = validateAccommodations(workingTripData, ctx, 0)

    console.log('[generate-trip]', JSON.stringify({
      stage:                 'validation_attempt_1',
      tripId:                typeof tripIdRaw === 'string' ? tripIdRaw : null,
      overnight,
      nights,
      status:                validation.status,
      accommodationsCount:   validation.accommodationsCount,
    }))

    // ── Attempt 2 (one retry, tightened) ─────────────────────────────────────────
    // Trigger only when the first attempt missed accommodations. The Edge Fn
    // reads `retryHint` to tighten its prompt — see supabase/functions/
    // generate-trip/index.ts.
    if (validation.status === 'no_hotels') {
      console.log('[generate-trip]', JSON.stringify({
        stage:  'retry_trigger',
        reason: 'no_accommodations_on_attempt_1',
      }))

      const attempt2 = await callEdgeOnce({
        retryHint: 'no_accommodations_emitted',
      })

      if (attempt2.ok) {
        workingEnvelope = attempt2.data
        workingTripData = extractTripData(workingEnvelope)
        validation = validateAccommodations(workingTripData, ctx, 1)
        console.log('[generate-trip]', JSON.stringify({
          stage:                 'validation_attempt_2',
          status:                validation.status,
          accommodationsCount:   validation.accommodationsCount,
        }))
      } else {
        // Retry itself failed — proceed to fallback synthesis without burning
        // the user's credit a second time. Validation gate at attempt=1
        // synthesizes the stub deterministically.
        validation = validateAccommodations(workingTripData, ctx, 1)
        console.log('[generate-trip]', JSON.stringify({
          stage:                 'retry_failed_falling_back',
          status:                validation.status,
          accommodationsCount:   validation.accommodationsCount,
        }))
      }
    }

    if (validation.fellBackToStub) {
      console.log('[generate-trip]', JSON.stringify({
        stage:       'fallback_used',
        nights,
        destination: ctx.destination,
      }))
    }

    // Repackage the (possibly fallback-augmented) trip_data into the Edge
    // Function's original envelope shape so downstream clients see no change.
    const data = (workingEnvelope && typeof workingEnvelope === 'object')
      ? { ...(workingEnvelope as Record<string, unknown>), trip_data: validation.tripData }
      : { trip_data: validation.tripData }

    // ── Deduct credit before returning (Vercel Functions terminate at response send) ──
    // Regenerations of an already-owned trip never consume credits — only new trips do.
    if (authorizedUserId && !isRegeneration) {
      // Authenticated new trip: decrement DB credits synchronously
      await consumeOneTrip(authorizedUserId).catch(e =>
        console.error('[generate-trip] consumeOneTrip error:', e)
      )
    }

    const response = NextResponse.json(data)

    if (!authorizedUserId && !isRegeneration) {
      // Anonymous new trip: set cookie so the next attempt is blocked server-side.
      // (Anonymous users can't own a trip → isRegeneration is always false here,
      // but the guard is kept explicit to mirror the authenticated path.)
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
