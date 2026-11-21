'use client'

import { useState } from 'react'
import { Button, Input } from '../design'

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
          className="flex size-5 flex-shrink-0 items-center justify-center rounded-full bg-cream/20 text-[11px] text-cream"
          aria-hidden="true"
        >
          ✓
        </span>
        <p className="m-0 font-sans text-body text-cream/90">
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
      <div className="flex w-full gap-3 max-[640px]:flex-col">
        <Input
          label={t.placeholder}
          hideLabel
          className="flex-1"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder={t.placeholder}
          disabled={status === 'loading'}
        />

        <Button type="submit" variant="inverse" disabled={status === 'loading'}>
          {status === 'loading' ? t.submitting : t.submit}
        </Button>
      </div>

      {status === 'error' && (
        <p className="m-0 font-sans text-small text-cream/70" role="alert">
          {errMsg || t.error}
        </p>
      )}
    </form>
  )
}
