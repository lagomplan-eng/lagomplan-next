'use client'

/**
 * LeadMagnetForm — reusable lead-magnet signup. `magnet` is the client-safe
 * subset from lib/lead-magnets.ts (toPublic).
 *
 * Rendered twice on the page (hero + footer); each instance owns its state.
 * Posts to /api/lead-magnet. The success panel and the form share one grid
 * cell, so swapping them never changes the container height (no layout shift).
 */

import { useId, useRef, useState } from 'react'
import { gaTrack } from '../../lib/analytics/ga'
import { isValidNewsletterEmail } from '../../lib/newsletter'
import type { LeadMagnetPublic } from '../../lib/lead-magnets'

type Status = 'idle' | 'loading' | 'success' | 'error'
export type FormPosition = 'hero' | 'footer'


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
  const started = useRef(false)

  function onFirstInteraction() {
    if (started.current) return
    started.current = true
    gaTrack('form_start', { lead_magnet: magnet.analyticsId, form_position: position })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
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
      setSentTo(cleanEmail)
      setStatus('success')
      gaTrack('generate_lead', { lead_magnet: magnet.analyticsId, form_position: position })
    } catch {
      setStatus('error')
    }
  }

  const done = status === 'success'

  return (
    <div className="grid">
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
          {status === 'loading' ? 'Enviando…' : 'Recibir el checklist gratis →'}
        </button>

        <p role="alert" className={`min-h-[1.25rem] font-sans text-sm text-coral ${status === 'error' ? '' : 'invisible'}`}>
          {status === 'error' ? 'Algo salió mal. Inténtalo de nuevo.' : ''}
        </p>
        <p className="font-sans text-xs leading-relaxed text-pine/70">
          Un PDF de 2 páginas. Sin spam — puedes darte de baja cuando quieras.
        </p>
      </form>

      {/* ── Success ── */}
      <div
        role="status"
        aria-live="polite"
        className={`[grid-area:1/1] flex flex-col justify-center gap-3 rounded-2xl bg-sand p-6 ${done ? '' : 'invisible'}`}
        aria-hidden={!done}
      >
        <p className="font-display text-3xl leading-tight text-pine">Listo. Revisa tu correo.</p>
        <p className="font-sans text-base leading-relaxed text-pine/80">
          Te mandamos el checklist a <strong className="break-all font-bold text-pine">{sentTo}</strong>. Si no llega en 5 minutos, revisa promociones o spam.
        </p>
        <a
          href={magnet.pdfPath} target="_blank" rel="noopener noreferrer" tabIndex={done ? 0 : -1}
          onClick={() => gaTrack('lead_magnet_download', { lead_magnet: magnet.analyticsId, form_position: position })}
          className="w-fit font-sans text-base font-bold text-pine underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
        >
          Descargar ahora →
        </a>
      </div>
    </div>
  )
}
