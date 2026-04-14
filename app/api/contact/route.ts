/**
 * app/api/contact/route.ts
 * POST /api/contact
 *
 * 1. Validates the request body
 * 2. Inserts into Supabase `contact_messages` (service-role, no RLS bypass needed)
 * 3. Sends an email notification via Resend
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSupabaseAdmin } from '../../../lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const NOTIFY_TO   = 'lagomplan@gmail.com'
const NOTIFY_FROM = 'onboarding@resend.dev'

export async function POST(req: NextRequest) {
  // ── 1. Parse & validate ──────────────────────────────────────────────────
  let body: { name?: string; email?: string; subject?: string; message?: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, subject, message } = body

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: 'name, email and message are required' },
      { status: 422 },
    )
  }

  // Basic email sanity check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 422 })
  }

  const payload = {
    name:    name.trim(),
    email:   email.trim().toLowerCase(),
    subject: subject?.trim() || null,
    message: message.trim(),
  }

  console.log('[contact] new submission:', payload)

  // ── 2. Persist in Supabase ───────────────────────────────────────────────
  const supabase = getSupabaseAdmin()

  const { error: dbError } = await supabase
    .from('contact_messages')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(payload as any)

  if (dbError) {
    console.error('[contact] supabase insert error:', dbError)
    return NextResponse.json(
      { error: 'Failed to save message. Please try again.' },
      { status: 500 },
    )
  }

  // ── 3. Send email notification ───────────────────────────────────────────
  const subjectLine = payload.subject
    ? `Nuevo mensaje de contacto: ${payload.subject}`
    : 'Nuevo mensaje de contacto — LagomPlan'

  const emailHtml = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1C1C1A">
      <h2 style="color:#0F3A33;margin-bottom:4px">Nuevo mensaje de contacto</h2>
      <p style="color:#6B8F86;font-size:13px;margin-top:0">Recibido en LagomPlan</p>
      <hr style="border:none;border-top:1px solid #EDE7E1;margin:20px 0"/>

      <table style="width:100%;font-size:14px;line-height:1.7">
        <tr>
          <td style="width:100px;font-weight:600;color:#0F3A33;vertical-align:top">Nombre</td>
          <td>${payload.name}</td>
        </tr>
        <tr>
          <td style="font-weight:600;color:#0F3A33;vertical-align:top">Email</td>
          <td><a href="mailto:${payload.email}" style="color:#0F3A33">${payload.email}</a></td>
        </tr>
        ${payload.subject ? `
        <tr>
          <td style="font-weight:600;color:#0F3A33;vertical-align:top">Asunto</td>
          <td>${payload.subject}</td>
        </tr>` : ''}
        <tr>
          <td style="font-weight:600;color:#0F3A33;vertical-align:top;padding-top:12px">Mensaje</td>
          <td style="padding-top:12px;white-space:pre-wrap">${payload.message}</td>
        </tr>
      </table>

      <hr style="border:none;border-top:1px solid #EDE7E1;margin:24px 0"/>
      <p style="font-size:12px;color:#A8A29E">LagomPlan &nbsp;·&nbsp; lagomplan.com</p>
    </div>
  `

  const { error: emailError } = await resend.emails.send({
    from:    NOTIFY_FROM,
    to:      NOTIFY_TO,
    subject: subjectLine,
    html:    emailHtml,
  })

  if (emailError) {
    // Don't fail the whole request — the message is already saved in Supabase
    console.error('[contact] resend error:', emailError)
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
