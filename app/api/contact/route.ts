/**
 * app/api/contact/route.ts
 * POST /api/contact
 *
 * 1. Validates the request body
 * 2. Inserts into Supabase `contact_messages` (service-role)
 * 3. Sends an email notification via Resend (skipped if RESEND_API_KEY is absent)
 *
 * IMPORTANT: Resend is instantiated INSIDE the handler, never at module level.
 * Calling `new Resend(undefined)` at module scope throws and kills every request.
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSupabaseAdmin } from '../../../lib/supabase/server'

const NOTIFY_TO   = 'lagomplan@gmail.com'
const NOTIFY_FROM = 'onboarding@resend.dev'

export async function POST(req: NextRequest) {
  // Outer catch: ensures no unhandled throw ever leaks as a raw 500
  try {
    // ── 1. Parse body ────────────────────────────────────────────────────────
    let body: { name?: string; email?: string; subject?: string; message?: string }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { name, email, subject, message } = body
    console.log('[contact] incoming:', { name, email, subject, messageLen: message?.length ?? 0 })

    // ── 2. Validate ──────────────────────────────────────────────────────────
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'name, email and message are required' },
        { status: 422 },
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 422 })
    }

    const payload = {
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      subject: subject?.trim() || null,
      message: message.trim(),
    }

    // ── 3. Persist in Supabase ───────────────────────────────────────────────
    console.log('[contact] inserting into Supabase...')
    const supabase = getSupabaseAdmin()

    const { error: dbError } = await supabase
      .from('contact_messages')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(payload as any)

    if (dbError) {
      console.error('[contact] Supabase insert error:', dbError.code, dbError.message)
      return NextResponse.json(
        { error: 'Failed to save message. Please try again.' },
        { status: 500 },
      )
    }

    console.log('[contact] Supabase insert OK')

    // ── 4. Send email notification ───────────────────────────────────────────
    // Resend is instantiated HERE, not at module level, so a missing key
    // only skips email — it does not crash the module or the request.
    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      console.warn('[contact] RESEND_API_KEY not configured — skipping email')
    } else {
      try {
        const resend = new Resend(resendKey)

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
          // Message is already saved — log but don't fail the request
          console.error('[contact] Resend send error:', emailError)
        } else {
          console.log('[contact] email sent OK')
        }
      } catch (emailErr) {
        console.error('[contact] Resend threw:', emailErr)
        // Same — message saved, email optional
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[contact] unhandled error:', message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
