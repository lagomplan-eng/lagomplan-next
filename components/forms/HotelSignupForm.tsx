'use client'

import { useRef, useState } from 'react'
import { getRoute } from '../../lib/routes'

const copy = {
  es: {
    hotel: 'Nombre del hotel',
    zone: 'Zona',
    zones: { condesa: 'Condesa', roma: 'Roma Norte', polanco: 'Polanco', other: 'Mi hotel está en otra zona' },
    pick: 'Elige una zona',
    which: '¿En qué colonia está tu hotel?',
    contact: 'Tu nombre',
    email: 'Correo electrónico',
    maps: 'Enlace de Google Maps (opcional)',
    phone: 'WhatsApp o teléfono',
    rooms: 'Número de habitaciones',
    role: 'Tu cargo en el hotel (opcional)',
    terms1: 'Acepto los',
    terms2: 'términos',
    terms3: 'y la',
    terms4: 'política de privacidad',
    submit: 'Pedir mi guía',
    submitting: 'Enviando…',
    okPending: 'Te enviamos tu QR en un día hábil.',
    okWaitlist: 'Gracias. Hoy cubrimos Condesa, Roma Norte y Polanco. Te avisamos cuando lleguemos a tu zona.',
    error: 'Algo salió mal. Inténtalo de nuevo.',
    rate: 'Demasiados intentos. Inténtalo más tarde.',
    invalid: 'Revisa los campos marcados.',
    tooFast: 'No pudimos enviar el formulario. Espera unos segundos e inténtalo de nuevo.',
  },
  en: {
    hotel: 'Hotel name',
    zone: 'Zone',
    zones: { condesa: 'Condesa', roma: 'Roma Norte', polanco: 'Polanco', other: 'My hotel is in another zone' },
    pick: 'Choose a zone',
    which: 'Which neighborhood is your hotel in?',
    contact: 'Your name',
    email: 'Email',
    maps: 'Google Maps link (optional)',
    phone: 'WhatsApp or phone',
    rooms: 'Number of rooms',
    role: 'Your role at the hotel (optional)',
    terms1: 'I accept the',
    terms2: 'terms',
    terms3: 'and the',
    terms4: 'privacy policy',
    submit: 'Request my guide',
    submitting: 'Sending…',
    okPending: 'We will send you your QR within one business day.',
    okWaitlist: 'Thank you. For now we cover Condesa, Roma Norte and Polanco. We will let you know when we reach your area.',
    error: 'Something went wrong. Please try again.',
    rate: 'Too many attempts. Please try again later.',
    invalid: 'Please check the marked fields.',
    tooFast: 'We could not send the form. Wait a few seconds and try again.',
  },
}

const input = 'w-full border border-[#CEC8C0] rounded-[8px] px-4 py-3 font-sans text-[14px] text-[#1C1C1A] bg-white outline-none focus:border-[#0F3A33]'
const label = 'block font-sans text-[13px] font-semibold text-[#0F3A33] mb-1.5'

export default function HotelSignupForm({ locale }: { locale: 'es' | 'en' }) {
  const t = copy[locale]
  const openedAt = useRef(Date.now())
  const [f, setF] = useState({ hotelName: '', zone: '', requestedZone: '', contactName: '', email: '', mapsUrl: '', contactPhone: '', rooms: '', contactRole: '', terms: false, website: '' })
  const [state, setState] = useState<'idle' | 'loading' | 'pending' | 'waitlist'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [bad, setBad] = useState<string | null>(null)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setBad(null); setState('loading')
    try {
      const res = await fetch('/api/hotels/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, lang: locale, openedAt: openedAt.current }),
      })
      const j = await res.json().catch(() => ({}))
      if (res.status === 429) { setError(t.rate); setState('idle'); return }
      if (res.status === 422 && j.error === 'too_fast') { setError(t.tooFast); setState('idle'); return } // not a success: nothing was saved
      if (res.status === 422) { setBad(j.error ?? 'x'); setError(t.invalid); setState('idle'); return }
      if (!res.ok) throw new Error('failed')
      setState(f.zone === 'other' ? 'waitlist' : 'pending')
    } catch {
      setError(t.error); setState('idle')
    }
  }

  if (state === 'pending' || state === 'waitlist') {
    return (
      <div role="status" className="rounded-[10px] px-6 py-5 font-sans text-[15px] text-[#0F3A33] leading-[1.7]"
        style={{ background: 'rgba(15,58,51,0.07)', border: '1px solid rgba(15,58,51,0.12)' }}>
        {state === 'waitlist' ? t.okWaitlist : t.okPending}
      </div>
    )
  }

  const flag = (k: string) => (bad === k ? { 'aria-invalid': true as const } : {})
  return (
    <form onSubmit={submit} className="space-y-5" noValidate={false}>
      <div><label className={label} htmlFor="h-name">{t.hotel}</label>
        <input id="h-name" className={input} required maxLength={160} value={f.hotelName} onChange={set('hotelName')} {...flag('hotelName')} /></div>
      <div><label className={label} htmlFor="h-zone">{t.zone}</label>
        <select id="h-zone" className={input} required value={f.zone} onChange={set('zone')} {...flag('zone')}>
          <option value="">{t.pick}</option>
          <option value="condesa">{t.zones.condesa}</option>
          <option value="roma">{t.zones.roma}</option>
          <option value="polanco">{t.zones.polanco}</option>
          <option value="other">{t.zones.other}</option>
        </select></div>
      {f.zone === 'other' && (
        <div><label className={label} htmlFor="h-req">{t.which}</label>
          <input id="h-req" className={input} required maxLength={120} value={f.requestedZone} onChange={set('requestedZone')} {...flag('requestedZone')} /></div>
      )}
      <div><label className={label} htmlFor="h-contact">{t.contact}</label>
        <input id="h-contact" className={input} required maxLength={160} autoComplete="name" value={f.contactName} onChange={set('contactName')} {...flag('contactName')} /></div>
      <div><label className={label} htmlFor="h-email">{t.email}</label>
        <input id="h-email" type="email" className={input} required maxLength={254} autoComplete="email" value={f.email} onChange={set('email')} {...flag('email')} /></div>
      <div><label className={label} htmlFor="h-maps">{t.maps}</label>
        <input id="h-maps" type="url" className={input} maxLength={500} value={f.mapsUrl} onChange={set('mapsUrl')} {...flag('mapsUrl')} /></div>

      <div><label className={label} htmlFor="h-role">{t.role}</label>
        <input id="h-role" className={input} maxLength={120} autoComplete="organization-title" value={f.contactRole} onChange={set('contactRole')} {...flag('contactRole')} /></div>
      <div><label className={label} htmlFor="h-phone">{t.phone}</label>
        <input id="h-phone" type="tel" className={input} required maxLength={40} autoComplete="tel" value={f.contactPhone} onChange={set('contactPhone')} {...flag('contactPhone')} /></div>
      <div><label className={label} htmlFor="h-rooms">{t.rooms}</label>
        <input id="h-rooms" type="number" inputMode="numeric" min={1} max={5000} className={input} required value={f.rooms} onChange={set('rooms')} {...flag('rooms')} /></div>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label>Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} /></label>
      </div>

      <label className="flex items-start gap-3 font-sans text-[13px] text-[#3E5F58] leading-[1.6]">
        <input type="checkbox" required checked={f.terms} onChange={set('terms')} className="mt-1" {...flag('terms')} />
        <span>{t.terms1} <a className="underline" href={getRoute(locale, 'terms')}>{t.terms2}</a> {t.terms3} <a className="underline" href={getRoute(locale, 'privacy')}>{t.terms4}</a></span>
      </label>

      {error && <p role="alert" className="font-sans text-[13px] text-[#B3261E]">{error}</p>}
      <button type="submit" disabled={state === 'loading'}
        className="font-sans font-bold text-[14px] px-6 py-3 rounded-[8px] bg-[#0F3A33] text-[#FFF9F3] disabled:opacity-60">
        {state === 'loading' ? t.submitting : t.submit}
      </button>
    </form>
  )
}
