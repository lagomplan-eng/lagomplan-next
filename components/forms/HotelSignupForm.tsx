'use client'

import { useRef, useState } from 'react'
import { getRoute } from '../../lib/routes'
import {
  firstInvalid, serverErrorToField, validateForm,
  type FormErrors, type FormField, type FormValues,
} from '../../lib/hotels/signup-form'

// Labels carry no asterisk: the component adds " *" to every required field. Optional ones say "(opcional)".
const copy = {
  es: {
    requiredNote: '* Campos obligatorios',
    hotel: 'Nombre del hotel',
    zone: 'Zona',
    zones: { condesa: 'Condesa', roma: 'Roma Norte', polanco: 'Polanco', other: 'Mi hotel está en otra zona' },
    pick: 'Elige una zona',
    which: '¿En qué colonia está tu hotel?',
    contact: 'Tu nombre',
    email: 'Correo electrónico',
    phone: 'WhatsApp o teléfono',
    phoneHint: 'Con lada, por ejemplo 55 1234 5678',
    rooms: 'Número de habitaciones',
    roomsHint: 'Solo el número, por ejemplo 12',
    role: 'Tu cargo en el hotel (opcional)',
    maps: 'Enlace de Google Maps (opcional)',
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
    requiredNote: '* Required fields',
    hotel: 'Hotel name',
    zone: 'Zone',
    zones: { condesa: 'Condesa', roma: 'Roma Norte', polanco: 'Polanco', other: 'My hotel is in another zone' },
    pick: 'Choose a zone',
    which: 'Which neighborhood is your hotel in?',
    contact: 'Your name',
    email: 'Email',
    phone: 'WhatsApp or phone',
    phoneHint: 'With area code, for example 55 1234 5678',
    rooms: 'Number of rooms',
    roomsHint: 'Just the number, for example 12',
    role: 'Your role at the hotel (optional)',
    maps: 'Google Maps link (optional)',
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
const inputError = '!border-[#B3261E]'
const label = 'block font-sans text-[13px] font-semibold text-[#0F3A33] mb-1.5'

type Values = FormValues & { website: string }
const EMPTY: Values = {
  hotelName: '', zone: '', requestedZone: '', contactName: '', email: '', contactPhone: '', rooms: '',
  contactRole: '', mapsUrl: '', terms: false, website: '',
}

export default function HotelSignupForm({ locale }: { locale: 'es' | 'en' }) {
  const t = copy[locale]
  const openedAt = useRef(Date.now())
  const [f, setF] = useState<Values>(EMPTY)
  const [state, setState] = useState<'idle' | 'loading' | 'pending' | 'waitlist'>('idle')
  const [errors, setErrors] = useState<FormErrors>({})
  const [error, setError] = useState<string | null>(null)

  // Typing in a field clears its own message; the others stay until the next submit.
  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setF((p) => ({ ...p, [k]: value }))
    if (k in errors) setErrors((p) => { const n = { ...p }; delete n[k as FormField]; return n })
    if (k === 'zone') setErrors((p) => { const n = { ...p }; delete n.requestedZone; return n })
  }

  function focusField(field: FormField | null) {
    if (!field) return
    const el = document.getElementById(`h-${field}`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    ;(el as HTMLElement).focus({ preventScroll: true })
  }

  // ids: field = h-<field>, hint = h-<field>-hint, message = h-<field>-err
  const aria = (field: FormField, hint = false, required = true) => ({
    'aria-required': required || undefined,
    'aria-invalid': errors[field] ? (true as const) : undefined,
    'aria-describedby': [hint ? `h-${field}-hint` : '', errors[field] ? `h-${field}-err` : ''].filter(Boolean).join(' ') || undefined,
  })
  const lbl = (field: FormField | 'contactRole', text: string, required: boolean) => (
    <label className={label} htmlFor={`h-${field}`}>
      {text}{required && <span aria-hidden="true" className="text-[#B3261E]"> *</span>}
    </label>
  )
  const hint = (field: FormField, text: string) => (
    <p id={`h-${field}-hint`} className="mt-1.5 font-sans text-[12px] text-[#3E5F58]">{text}</p>
  )
  const err = (field: FormField) => errors[field]
    ? <p id={`h-${field}-err`} role="alert" className="mt-1.5 font-sans text-[13px] text-[#B3261E]">{errors[field]}</p>
    : null
  const cls = (field: FormField) => `${input} ${errors[field] ? inputError : ''}`

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // 1. The browser checks first, so most mistakes never reach the server.
    const found = validateForm(f, locale)
    setErrors(found)
    if (Object.keys(found).length > 0) { focusField(firstInvalid(found)); return }

    setState('loading')
    try {
      const res = await fetch('/api/hotels/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, lang: locale, openedAt: openedAt.current }),
      })
      const j = await res.json().catch(() => ({}))
      if (res.status === 429) { setError(t.rate); setState('idle'); return }
      if (res.status === 422 && j.error === 'too_fast') { setError(t.tooFast); setState('idle'); return } // nothing was saved
      if (res.status === 422) {
        // 2. The server's own refusal also lands next to the right field.
        const m = serverErrorToField(String(j.error), f, locale)
        if (m) { setErrors({ [m.field]: m.message }); focusField(m.field) } else setError(t.invalid)
        setState('idle')
        return
      }
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

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <p className="font-sans text-[13px] text-[#3E5F58] -mt-4">{t.requiredNote}</p>

      <div>{lbl('hotelName', t.hotel, true)}
        <input id="h-hotelName" className={cls('hotelName')} maxLength={160} autoComplete="organization" value={f.hotelName} onChange={set('hotelName')} {...aria('hotelName')} />
        {err('hotelName')}</div>

      <div>{lbl('zone', t.zone, true)}
        <select id="h-zone" className={cls('zone')} value={f.zone} onChange={set('zone')} {...aria('zone')}>
          <option value="">{t.pick}</option>
          <option value="condesa">{t.zones.condesa}</option>
          <option value="roma">{t.zones.roma}</option>
          <option value="polanco">{t.zones.polanco}</option>
          <option value="other">{t.zones.other}</option>
        </select>
        {err('zone')}</div>

      {f.zone === 'other' && (
        <div>{lbl('requestedZone', t.which, true)}
          <input id="h-requestedZone" className={cls('requestedZone')} maxLength={120} value={f.requestedZone} onChange={set('requestedZone')} {...aria('requestedZone')} />
          {err('requestedZone')}</div>
      )}

      <div>{lbl('contactName', t.contact, true)}
        <input id="h-contactName" className={cls('contactName')} maxLength={160} autoComplete="name" value={f.contactName} onChange={set('contactName')} {...aria('contactName')} />
        {err('contactName')}</div>

      <div>{lbl('email', t.email, true)}
        <input id="h-email" type="email" className={cls('email')} maxLength={254} autoComplete="email" value={f.email} onChange={set('email')} {...aria('email')} />
        {err('email')}</div>

      <div>{lbl('contactPhone', t.phone, true)}
        <input id="h-contactPhone" type="tel" className={cls('contactPhone')} maxLength={40} autoComplete="tel" value={f.contactPhone} onChange={set('contactPhone')} {...aria('contactPhone', true)} />
        {hint('contactPhone', t.phoneHint)}
        {err('contactPhone')}</div>

      <div>{lbl('rooms', t.rooms, true)}
        <input id="h-rooms" type="text" inputMode="numeric" className={cls('rooms')} maxLength={6} value={f.rooms} onChange={set('rooms')} {...aria('rooms', true)} />
        {hint('rooms', t.roomsHint)}
        {err('rooms')}</div>

      <div>{lbl('contactRole', t.role, false)}
        <input id="h-contactRole" className={input} maxLength={120} autoComplete="organization-title" value={f.contactRole} onChange={set('contactRole')} /></div>

      <div>{lbl('mapsUrl', t.maps, false)}
        <input id="h-mapsUrl" type="url" className={cls('mapsUrl')} maxLength={500} value={f.mapsUrl} onChange={set('mapsUrl')} {...aria('mapsUrl', false, false)} />
        {err('mapsUrl')}</div>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label>Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} /></label>
      </div>

      <div>
        <label className="flex items-start gap-3 font-sans text-[13px] text-[#3E5F58] leading-[1.6]">
          <input id="h-terms" type="checkbox" checked={f.terms} onChange={set('terms')} className="mt-1" {...aria('terms')} />
          <span>{t.terms1} <a className="underline" href={getRoute(locale, 'terms')}>{t.terms2}</a> {t.terms3} <a className="underline" href={getRoute(locale, 'privacy')}>{t.terms4}</a><span aria-hidden="true" className="text-[#B3261E]"> *</span></span>
        </label>
        {err('terms')}
      </div>

      {error && <p role="alert" className="font-sans text-[13px] text-[#B3261E]">{error}</p>}
      <button type="submit" disabled={state === 'loading'}
        className="font-sans font-bold text-[14px] px-6 py-3 rounded-[8px] bg-[#0F3A33] text-[#FFF9F3] disabled:opacity-60">
        {state === 'loading' ? t.submitting : t.submit}
      </button>
    </form>
  )
}
