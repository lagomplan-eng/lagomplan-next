'use client'

import { useState } from 'react'

const copy = {
  es: {
    placeholder: 'Tu correo electrónico',
    submit:      'Suscribirme',
    submitting:  'Enviando…',
    success:     '¡Listo! Ya estás dentro. Te enviaremos ideas curadas pronto.',
    error:       'Algo salió mal. Inténtalo de nuevo.',
  },
  en: {
    placeholder: 'Your email address',
    submit:      'Subscribe',
    submitting:  'Sending…',
    success:     "You're in! We'll send you curated travel ideas soon.",
    error:       'Something went wrong. Please try again.',
  },
}

export default function NewsletterForm({ locale }: { locale: 'es' | 'en' }) {
  const t = copy[locale] ?? copy.es

  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg,  setErrMsg]  = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return

    setStatus('loading')
    setErrMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(data.error ?? t.error)
      }

      setStatus('success')
      setEmail('')
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : t.error)
      setStatus('error')
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 py-4">
        <span
          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px]"
          style={{ background: 'rgba(255,249,243,0.18)', color: '#FFF9F3' }}
          aria-hidden="true"
        >
          ✓
        </span>
        <p
          className="font-sans text-[15px] leading-[1.6]"
          style={{ color: 'rgba(255,249,243,0.92)' }}
        >
          {t.success}
        </p>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col w-full gap-3"
    >
      <div className="flex w-full max-[640px]:flex-col max-[640px]:gap-3">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder={t.placeholder}
          disabled={status === 'loading'}
          className="flex-1 font-sans text-[15px] px-5 py-4 text-[#FFF9F3] placeholder-[rgba(255,249,243,0.58)] focus:outline-none disabled:opacity-60"
          style={{
            border:     '1px solid rgba(255,249,243,0.18)',
            background: 'rgba(255,255,255,0.10)',
          }}
        />

        <button
          type="submit"
          disabled={status === 'loading'}
          className="font-sans text-[15px] font-semibold px-6 py-4 whitespace-nowrap border-none cursor-pointer transition-opacity disabled:opacity-60"
          style={{ background: '#FFF9F3', color: '#0F3A33' }}
        >
          {status === 'loading' ? t.submitting : t.submit}
        </button>
      </div>

      {status === 'error' && (
        <p
          className="font-sans text-[13px] leading-[1.5]"
          style={{ color: 'rgba(255,249,243,0.70)' }}
          role="alert"
        >
          {errMsg || t.error}
        </p>
      )}
    </form>
  )
}
