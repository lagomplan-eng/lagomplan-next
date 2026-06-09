/**
 * app/api/subscribe/route.ts
 * POST /api/subscribe
 *
 * Receives { email } and subscribes it to the Mailchimp audience via the
 * Mailchimp Marketing API (server-side — API key never exposed to the client).
 *
 * Required env vars:
 *   MAILCHIMP_API_KEY   — e.g. "abc123def456-us13"  (key-datacenter format)
 *   MAILCHIMP_LIST_ID   — audience/list ID, e.g. "71a26fbc9a"
 *
 * Optional env vars:
 *   MAILCHIMP_TAG       — tag name to apply on subscribe (e.g. "homepage")
 *
 * ⚠️ Vercel scoping gotcha: these vars must be available to EVERY Preview
 * branch, not just `Preview (main)`. If they're scoped to main-only, every
 * feature-branch preview returns 500 "Server configuration error" from the
 * guard below (Production is unaffected). See lib/newsletter.ts for the
 * unit-tested config reader.
 */

import { NextRequest, NextResponse } from 'next/server'
import { isValidNewsletterEmail, readMailchimpConfig, mailchimpMembersUrl } from '../../../lib/newsletter'

export async function POST(req: NextRequest) {
  // ── 1. Parse & validate ──────────────────────────────────────────────────
  let body: { email?: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()

  if (!isValidNewsletterEmail(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 422 })
  }

  // ── 2. Guard: env vars (read at request time) ────────────────────────────
  const cfg = readMailchimpConfig()
  if (!cfg) {
    console.error('[subscribe] Missing MAILCHIMP_API_KEY or MAILCHIMP_LIST_ID')
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 },
    )
  }

  // ── 3. Call Mailchimp Marketing API ──────────────────────────────────────
  const url  = mailchimpMembersUrl(cfg)
  const auth = Buffer.from(`anystring:${cfg.apiKey}`).toString('base64')

  const payload: Record<string, unknown> = {
    email_address: email,
    status:        'subscribed',
  }

  if (cfg.tag) {
    payload.tags = [cfg.tag]
  }

  let mcRes: Response
  try {
    mcRes = await fetch(url, {
      method:  'POST',
      headers: {
        Authorization:  `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('[subscribe] Network error calling Mailchimp:', err)
    return NextResponse.json(
      { error: 'Could not reach Mailchimp. Please try again.' },
      { status: 502 },
    )
  }

  // ── 4. Handle Mailchimp response ─────────────────────────────────────────
  if (!mcRes.ok) {
    const data = await mcRes.json().catch(() => ({})) as { title?: string }

    // "Member Exists" is fine — treat as success so UX stays smooth
    if (data.title === 'Member Exists') {
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    console.error('[subscribe] Mailchimp error:', data)
    return NextResponse.json(
      { error: 'Subscription failed. Please try again.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
