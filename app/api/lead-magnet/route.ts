/**
 * app/api/lead-magnet/route.ts
 * POST /api/lead-magnet
 *
 * Body: { magnet (slug in lib/lead-magnets.ts), name, email, website (honeypot),
 *        utm_source?, utm_campaign? }
 *
 * Two INDEPENDENT jobs (one failing never blocks the other):
 *   1. Mailchimp — upsert the member (PUT, idempotent) + tags.
 *      Reuses MAILCHIMP_API_KEY / MAILCHIMP_LIST_ID via lib/newsletter.ts.
 *   2. Resend — deliver the checklist email (HTML + text, List-Unsubscribe).
 * The client sees an error only if BOTH fail. The success body carries
 * `emailSent` so the UI never claims "check your email" when Resend failed. Repeat signups re-send the
 * email and count as success.
 *
 * Abuse protection: honeypot, per-IP (5/10min) and per-email (3/24h) limits
 * via lib/lead-magnet/rate-limit.ts.
 *
 * Resend is instantiated inside the handler (see app/api/contact/route.ts).
 */

import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { Resend } from 'resend'
import { isValidNewsletterEmail, readMailchimpConfig } from '../../../lib/newsletter'
import { getLeadMagnet, type LeadMagnet } from '../../../lib/lead-magnets'
import { takeAttempt, IP_LIMIT, EMAIL_LIMIT } from '../../../lib/lead-magnet/rate-limit'

const FROM     = 'Elena de Lagomplan <elena@lagomplan.com>'
const REPLY_TO = 'elena@lagomplan.com'

function clientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

/** Mailchimp tag-safe slug: lowercase, [a-z0-9_-], max 40 chars. */
function slug(v: unknown): string {
  return String(v ?? '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)
}

async function syncMailchimp(
  magnet: LeadMagnet, email: string, name: string, utm: { source: string; campaign: string },
): Promise<void> {
  const cfg = readMailchimpConfig()
  if (!cfg) throw new Error('Missing MAILCHIMP_API_KEY or MAILCHIMP_LIST_ID')

  const hash = createHash('md5').update(email).digest('hex')
  const base = `https://${cfg.dc}.api.mailchimp.com/3.0/lists/${cfg.listId}/members/${hash}`
  const headers = {
    Authorization:  `Basic ${Buffer.from(`anystring:${cfg.apiKey}`).toString('base64')}`,
    'Content-Type': 'application/json',
  }

  const put = await fetch(base, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      email_address: email,
      status_if_new: 'subscribed',
      merge_fields:  name ? { FNAME: name } : {},
    }),
  })
  if (!put.ok) throw new Error(`Mailchimp PUT ${put.status}: ${(await put.text()).slice(0, 300)}`)

  const tags = [
    ...magnet.mailchimpTags,
    ...(utm.source   ? [`src_${utm.source}`]   : []),
    ...(utm.campaign ? [`cmp_${utm.campaign}`] : []),
  ]
  const tagRes = await fetch(`${base}/tags`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ tags: tags.map(t => ({ name: t, status: 'active' })) }),
  })
  if (!tagRes.ok) throw new Error(`Mailchimp tags ${tagRes.status}: ${(await tagRes.text()).slice(0, 300)}`)
}

async function sendEmail(magnet: LeadMagnet, email: string, name: string): Promise<void> {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('Missing RESEND_API_KEY')

  const { html, text } = magnet.render({
    name, preheader: magnet.emailPreheader, pdfUrl: magnet.pdfUrl,
  })
  const unsub = (process.env.MAILCHIMP_UNSUB_URL ?? '').trim()

  const { error } = await new Resend(key).emails.send({
    from:    FROM,
    to:      email,
    replyTo: REPLY_TO,
    subject: magnet.emailSubject,
    html,
    text,
    ...(unsub ? { headers: { 'List-Unsubscribe': `<${unsub}>` } } : {}),
  })
  if (error) throw new Error(`Resend: ${error.message}`)
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Honeypot — bots fill it. Pretend success, do nothing.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true, emailSent: true })
  }

  const magnet = getLeadMagnet(body.magnet)
  if (!magnet) {
    return NextResponse.json({ error: 'Unknown lead magnet' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const name  = typeof body.name  === 'string' ? body.name.trim().slice(0, 80) : ''
  if (!name || !isValidNewsletterEmail(email)) {
    return NextResponse.json({ error: 'Name and valid email required' }, { status: 422 })
  }

  if (!(await takeAttempt('ip', clientIp(req), IP_LIMIT))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  // Over the per-email cap: they already got the email — report success
  // without sending again (don't leak, don't let the form be used to spam).
  if (!(await takeAttempt('email', email, EMAIL_LIMIT))) {
    return NextResponse.json({ ok: true, emailSent: true })
  }

  const utm = { source: slug(body.utm_source), campaign: slug(body.utm_campaign) }
  const [mc, mail] = await Promise.allSettled([
    syncMailchimp(magnet, email, name, utm),
    sendEmail(magnet, email, name),
  ])
  if (mc.status === 'rejected')   console.error('[lead-magnet] Mailchimp failed:', mc.reason)
  if (mail.status === 'rejected') console.error('[lead-magnet] Email failed:', mail.reason)

  if (mc.status === 'rejected' && mail.status === 'rejected') {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 502 })
  }
  return NextResponse.json({ ok: true, emailSent: mail.status === 'fulfilled' })
}
