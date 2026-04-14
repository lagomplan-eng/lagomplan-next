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
 */

import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.MAILCHIMP_API_KEY ?? ''
const LIST_ID = process.env.MAILCHIMP_LIST_ID ?? ''
const TAG     = process.env.MAILCHIMP_TAG     ?? ''

export async function POST(req: NextRequest) {
  // ── 1. Parse & validate ──────────────────────────────────────────────────
  let body: { email?: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 422 })
  }

  // ── 2. Guard: env vars ───────────────────────────────────────────────────
  if (!API_KEY || !LIST_ID) {
    console.error('[subscribe] Missing MAILCHIMP_API_KEY or MAILCHIMP_LIST_ID')
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 },
    )
  }

  // ── 3. Call Mailchimp Marketing API ──────────────────────────────────────
  // API key format: "<key>-<datacenter>"  →  e.g. "abc123-us13"
  const dc  = API_KEY.split('-').pop()
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`
  const auth = Buffer.from(`anystring:${API_KEY}`).toString('base64')

  const payload: Record<string, unknown> = {
    email_address: email,
    status:        'subscribed',
  }

  if (TAG) {
    payload.tags = [TAG]
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
