// app/api/consent/route.ts
//
// Records a cookie-consent decision for GDPR Article 7(1) audit purposes.
// Called fire-and-forget from lib/consent.ts setConsent() — failures
// never block the UI. The localStorage write on the client remains the
// runtime source of truth; this table is only the paper trail.
//
// Privacy guarantees:
//   - The raw IP never lands in a column. We SHA-256 it with a
//     server-side pepper (CONSENT_IP_SALT env var) before insert.
//   - Failures are swallowed silently with a console.error — we never
//     return a non-2xx to the client because that would risk surfacing
//     a "couldn't save consent" toast to a user who already had their
//     local decision stored correctly.

import { NextRequest, NextResponse } from 'next/server'
import crypto                         from 'node:crypto'
import { getSupabaseServer, getSupabaseAdmin } from '../../../lib/supabase/server'

// Pepper for IP hashing. Must be set in Vercel envs (Production + Preview).
// In local dev a fallback string is used so the route doesn't 500 — the
// audit trail in dev is for testing only.
const IP_PEPPER = process.env.CONSENT_IP_SALT ?? 'lagomplan-dev-pepper-do-not-use-in-prod'

function hashIP(rawIp: string | null): string | null {
  if (!rawIp) return null
  return crypto
    .createHash('sha256')
    .update(rawIp + IP_PEPPER)
    .digest('hex')
}

// Vercel sets x-forwarded-for; first entry is the client IP. Fall back
// to x-real-ip for non-Vercel deploys. Never reads NextRequest.ip
// because that returns an Edge runtime value not available on Node.
function extractIP(req: NextRequest): string | null {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]?.trim() ?? null
  return req.headers.get('x-real-ip')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    const choice = body?.choice
    if (choice !== 'all' && choice !== 'essential') {
      return NextResponse.json({ error: 'invalid_choice' }, { status: 400 })
    }

    const locale = typeof body?.locale === 'string' ? body.locale.slice(0, 8) : null
    const gpc    = body?.gpc === true

    const userAgent = req.headers.get('user-agent')?.slice(0, 500) ?? null
    const ipHash    = hashIP(extractIP(req))

    // Link to the authed user when possible. Anonymous rows are still
    // recorded (user_id null) — many decisions happen pre-login.
    const supabase = await getSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    const admin = getSupabaseAdmin()
    const { error } = await (admin as any)
      .from('consent_log')
      .insert({
        choice,
        user_id:    user?.id ?? null,
        ip_hash:    ipHash,
        user_agent: userAgent,
        locale,
        gpc,
      })

    if (error) {
      console.error('[consent/log] insert failed:', error.message)
      // Return 200 anyway — the client's localStorage write is the
      // source of truth, and a failed audit insert shouldn't surface
      // any user-facing error.
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[consent/log] route error:', message)
    return NextResponse.json({ ok: true })
  }
}
