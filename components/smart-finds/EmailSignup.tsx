'use client'

/**
 * components/smart-finds/EmailSignup.tsx
 *
 * Inline newsletter capture used at the foot of the Familias page.
 * Posts to /api/subscribe (the same endpoint the footer + slide-in
 * popup use). On success, swaps the form for a confirmation panel.
 *
 * Kept as a small client island so the surrounding page stays a
 * Server Component.
 */

import { useState } from 'react'
import { PINE, SAND, MUTED, BORDER } from './tokens'

interface Props {
  locale: 'es' | 'en'
}

export default function EmailSignup({ locale }: Props) {
  const isES = locale === 'es'
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmit]   = useState(false)

  async function handleSubmit() {
    if (!email || submitting) return
    setSubmit(true)
    try {
      // /api/subscribe is the same endpoint the footer + scroll-popup hit.
      // Failure is silent — UX-wise we still flip to the confirmed state
      // so the user isn't stranded if Mailchimp blips.
      await fetch('/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, source: 'smart-finds-familias' }),
      }).catch(() => null)
    } finally {
      setSubmitted(true)
      setSubmit(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ padding: 22, background: SAND, borderLeft: `2px solid ${PINE}` }}>
        <div style={{
          fontFamily: "'Fraunces',serif", fontStyle: 'italic',
          fontSize: 17, fontWeight: 700, color: PINE, marginBottom: 5,
        }}>{isES ? 'Ya estás en la lista.' : 'You’re on the list.'}</div>
        <div style={{
          fontFamily: "'Manrope',sans-serif", fontSize: 12, color: MUTED,
        }}>{isES ? 'El próximo jueves, en tu correo.' : 'See you in your inbox next Thursday.'}</div>
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
        <input
          type="email"
          placeholder={isES ? 'tu@correo.com' : 'you@email.com'}
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
          style={{
            flex: 1, padding: '13px 16px',
            border: `1px solid ${BORDER}`, borderRight: 'none',
            fontFamily: "'Manrope',sans-serif", fontSize: 14,
            color: PINE, background: '#FDFCFA', outline: 'none',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            background: PINE, color: SAND, border: 'none',
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.7 : 1,
            fontFamily: "'Manrope',sans-serif",
            fontSize: 9, fontWeight: 700, letterSpacing: '.12em',
            padding: '13px 22px',
          }}
        >{isES ? 'SUSCRIBIRME' : 'SUBSCRIBE'}</button>
      </div>
      <div style={{
        fontFamily: "'Manrope',sans-serif", fontSize: 9, color: MUTED, marginTop: 8,
      }}>
        {isES
          ? 'Al suscribirte aceptas la política de privacidad.'
          : 'By subscribing you accept our privacy policy.'}
      </div>
    </>
  )
}
