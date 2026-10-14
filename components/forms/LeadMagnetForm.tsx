'use client'

/**
 * LeadMagnetForm — reusable lead-magnet signup. `magnet` is the client-safe
 * subset from lib/lead-magnets.ts (toPublic).
 *
 * Can render more than once per page (e.g. hero + footer); each instance owns
 * its state. Button, small print and success copy come from `magnet.form`; the
 * download link appears only when the magnet has a PDF (`pdfPath`).
 * Posts to /api/lead-magnet. The success panel and the form share one grid
 * cell, so swapping them never changes the container height (no layout shift).
 */

import { useEffect, useId, useRef, useState } from 'react'
import { gaTrack } from '../../lib/analytics/ga'
import { isValidNewsletterEmail } from '../../lib/newsletter'
import type { LeadMagnetPublic } from '../../lib/lead-magnets'

type Status = 'idle' | 'loading' | 'success' | 'error'
export type FormPosition = 'hero' | 'body' | 'footer'


const fieldCls =
  'w-full rounded-full border border-pine/30 bg-white px-5 py-3.5 font-sans text-base text-pine ' +
  'placeholder:text-pine/60 focus:border-pine focus:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2 focus-visible:ring-offset-cream'

export default function LeadMagnetForm({ magnet, position }: { magnet: LeadMagnetPublic; position: FormPosition }) {
  const uid = useId()
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus]   = useState<Status>('idle')
  const [sentTo, setSentTo]   = useState('')
  // false when the API signed them up but the delivery email failed
  const [emailSent, setEmailSent] = useState(true)
  const started = useRef(false)
  const typingAtSubmit = useRef(false)

  function onFirstInteraction() {
    if (started.current) return
    started.current = true
    gaTrack('form_start', { lead_magnet: magnet.analyticsId, form_position: position })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    // iOS keeps the input focused (keyboard up) when a button is tapped. Blur
    // now so the keyboard starts closing while the request is in flight.
    const active = document.activeElement as HTMLElement | null
    typingAtSubmit.current = !!active && /^(INPUT|TEXTAREA)$/.test(active.tagName)
    if (typingAtSubmit.current) active!.blur()
    const cleanEmail = email.trim().toLowerCase()
    if (!name.trim() || !isValidNewsletterEmail(cleanEmail)) {
      setStatus('error')
      return
    }
    setStatus('loading')
    try {
      const qs = new URLSearchParams(window.location.search)
      const res = await fetch('/api/lead-magnet', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          magnet:       magnet.slug,
          name:         name.trim(),
          email:        cleanEmail,
          website,
          utm_source:   qs.get('utm_source')   ?? '',
          utm_campaign: qs.get('utm_campaign') ?? '',
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const data = await res.json().catch(() => ({}))
      setEmailSent(data?.emailSent !== false)
      setSentTo(cleanEmail)
      setStatus('success')
      gaTrack('generate_lead', { lead_magnet: magnet.analyticsId, form_position: position })
    } catch {
      setStatus('error')
    }
  }

  const done = status === 'success'

  // After a successful submit:
  //  1. blur the input and (on touch devices) wait for the on-screen keyboard
  //     to close, so scroll positions are measured against the final viewport;
  //  2. move focus to the success heading (tabIndex -1) — this is the single
  //     screen-reader announcement (the panel deliberately has no aria-live);
  //  3. bring the whole panel into view (smoothly, or instantly under
  //     prefers-reduced-motion). `block: 'nearest'` scrolls only if part of the
  //     panel is off-screen, so a fully visible panel doesn't move the page.
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!done) return
    let cancelled = false

    ;(async () => {
      const active = document.activeElement as HTMLElement | null
      if (active && /^(INPUT|TEXTAREA)$/.test(active.tagName)) { typingAtSubmit.current = true; active.blur() }
      if (typingAtSubmit.current && window.matchMedia('(pointer: coarse)').matches) {
        const vv = window.visualViewport
        // iOS shrinks only the visual viewport when the keyboard is up. If it is
        // still shrunk, wait for it to close; otherwise it already has.
        if (vv && window.innerHeight - vv.height > 80) await waitForKeyboardClose()
        else await new Promise<void>(r => requestAnimationFrame(() => r()))
      }
      typingAtSubmit.current = false
      if (cancelled) return

      const panel = rootRef.current?.querySelector<HTMLElement>('[data-success-visible="true"]')
      if (!panel) return
      panel.querySelector<HTMLElement>('[data-success-heading]')?.focus({ preventScroll: true })

      const r = panel.getBoundingClientRect()
      const vh = window.visualViewport?.height ?? window.innerHeight
      if (r.top >= 0 && r.bottom <= vh) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      panel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' })
    })()

    return () => { cancelled = true }
  }, [done])

  return (
    <div ref={rootRef} className="grid">
      {/* ── Form ── */}
      <form
        onSubmit={onSubmit}
        noValidate
        aria-hidden={done}
        className={`[grid-area:1/1] flex flex-col gap-3 ${done ? 'invisible' : ''}`}
      >
        <div>
          <label htmlFor={`${uid}-name`} className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-pine/70">
            Nombre
          </label>
          <input
            id={`${uid}-name`} name="name" type="text" autoComplete="given-name" required
            value={name} disabled={done} tabIndex={done ? -1 : 0}
            onFocus={onFirstInteraction} onChange={e => setName(e.target.value)}
            className={fieldCls}
          />
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-pine/70">
            Correo
          </label>
          <input
            id={`${uid}-email`} name="email" type="email" autoComplete="email" inputMode="email" required
            value={email} disabled={done} tabIndex={done ? -1 : 0}
            onFocus={onFirstInteraction} onChange={e => setEmail(e.target.value)}
            className={fieldCls}
          />
        </div>

        {/* Honeypot — hidden from people and assistive tech */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={`${uid}-website`}>Sitio web</label>
          <input
            id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off"
            value={website} onChange={e => setWebsite(e.target.value)}
          />
        </div>

        <button
          type="submit" disabled={status === 'loading' || done} tabIndex={done ? -1 : 0}
          className="mt-1 rounded-full bg-pine px-6 py-4 font-sans text-base font-bold text-cream transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-70"
        >
          {status === 'loading' ? 'Enviando…' : magnet.form.submitLabel}
        </button>

        <p role="alert" className={`min-h-[1.25rem] font-sans text-sm text-coral ${status === 'error' ? '' : 'invisible'}`}>
          {status === 'error' ? 'Algo salió mal. Inténtalo de nuevo.' : ''}
        </p>
        <p className="font-sans text-xs leading-relaxed text-pine/70">
          {magnet.form.microcopy}
        </p>
      </form>

      {/* ── Success ──
          Both variants always render in the same grid cell as the form
          (only the active one is visible), so the cell is as tall as the
          tallest state and nothing shifts when the form swaps. */}
      {/* Permanent, never-visible copy sized for a ~2-line address: keeps the
          cell height constant no matter how short the real address is. */}
      <SuccessPanel visible={false} variant="sent" magnet={magnet} position={position} email={SIZER_EMAIL} />
      <SuccessPanel
        visible={done && emailSent}
        variant="sent"
        magnet={magnet}
        position={position}
        email={sentTo}
      />
      <SuccessPanel
        visible={done && !emailSent}
        variant="failed"
        magnet={magnet}
        position={position}
        email={sentTo}
      />
    </div>
  )
}

// Stand-in address for the hidden sizing panel (~2 lines at 375px).
const SIZER_EMAIL = 'nombre.apellido.largo@dominio-ejemplo.com.mx'

const DEFAULT_NEXT_STEP_EVENT = 'planner_cta_click'

const primaryBtn =
  'block rounded-full bg-pine px-6 py-3.5 text-center font-sans text-base font-bold text-cream transition-opacity hover:opacity-90 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2 focus-visible:ring-offset-sand'

function SuccessPanel({
  visible, variant, magnet, position, email,
}: {
  visible:  boolean
  variant:  'sent' | 'failed'
  magnet:   LeadMagnetPublic
  position: FormPosition
  email:    string
}) {
  const track = (event: string, extra?: Record<string, string>) =>
    gaTrack(event, { lead_magnet: magnet.analyticsId, form_position: position, ...extra })
  const tab = visible ? 0 : -1

  return (
    <div
      aria-hidden={!visible}
      data-success-visible={visible ? 'true' : undefined}
      className={`[grid-area:1/1] flex scroll-my-4 flex-col justify-center gap-3 rounded-2xl bg-sand p-5 ${visible ? '' : 'invisible'}`}
    >
      {variant === 'sent' ? (
        <>
          <h2 tabIndex={-1} data-success-heading className="font-display text-2xl leading-tight text-pine focus:outline-none">Listo. Revisa tu correo.</h2>
          <p className="font-sans text-base leading-relaxed text-pine/80">
            {magnet.form.successLead}{' '}
            <strong className="font-bold text-pine [overflow-wrap:anywhere]"><EmailText email={email} /></strong>.
            {' '}{magnet.form.successTail}
          </p>
          {magnet.pdfPath && (
            <a
              href={magnet.pdfPath} target="_blank" rel="noopener noreferrer" tabIndex={tab}
              onClick={() => track('lead_magnet_download')}
              className="w-fit font-sans text-base font-bold text-pine underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
            >
              Descargar ahora →
            </a>
          )}
        </>
      ) : (
        <>
          <h2 tabIndex={-1} data-success-heading className="font-display text-2xl leading-tight text-pine focus:outline-none">{magnet.form.failedHeadline}</h2>
          <p className="font-sans text-base leading-relaxed text-pine/80">Te sumamos a la lista de Lagomplan.</p>
          {magnet.pdfPath && (
            <a
              href={magnet.pdfPath} target="_blank" rel="noopener noreferrer" tabIndex={tab}
              onClick={() => track('lead_magnet_download')}
              className={primaryBtn}
            >
              Descargar el checklist →
            </a>
          )}
        </>
      )}

      {/* Next step — rendered only if the magnet's config provides one */}
      {magnet.nextStep && (
        <div className="mt-1 border-t border-pine/20 pt-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-pine/80">
            {variant === 'sent' ? magnet.nextStep.eyebrowSent : magnet.nextStep.eyebrowFailed}
          </p>
          <p className="mt-1.5 font-sans text-sm leading-relaxed text-pine/85">
            {magnet.nextStep.text}
          </p>
          <a
            href={magnet.nextStep.buttonUrl} tabIndex={tab}
            onClick={() => track(magnet.nextStep!.analyticsEvent ?? DEFAULT_NEXT_STEP_EVENT, magnet.nextStep!.analyticsParams)}
            className={`${primaryBtn} mt-3`}
          >
            {magnet.nextStep.buttonLabel}
          </a>
        </div>
      )}
    </div>
  )
}

/** Prefer wrapping at the "@" over mid-word; overflow-wrap:anywhere is the fallback. */
function EmailText({ email }: { email: string }) {
  const at = email.indexOf('@')
  if (at < 1) return <>{email}</>
  return <>{email.slice(0, at)}<wbr />{email.slice(at)}</>
}

/**
 * Resolves when the on-screen keyboard has (probably) closed: the next
 * visualViewport resize, or a short timeout if none arrives (no keyboard,
 * browser that doesn't resize, already closed).
 */
function waitForKeyboardClose(maxMs = 450): Promise<void> {
  return new Promise(resolve => {
    const vv = window.visualViewport
    if (!vv) { setTimeout(resolve, 0); return }
    const finish = () => {
      vv.removeEventListener('resize', finish)
      clearTimeout(timer)
      // let layout settle one frame after the resize
      requestAnimationFrame(() => resolve())
    }
    const timer = setTimeout(finish, maxMs)
    vv.addEventListener('resize', finish, { once: true })
  })
}
