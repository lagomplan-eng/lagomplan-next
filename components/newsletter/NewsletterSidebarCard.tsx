'use client'

/**
 * NewsletterSidebarCard — compact Pine card for the guide sidebar.
 *
 * Mounts as the last item of the right column on a guide detail page.
 * Submits to /api/subscribe (same server route as the footer form and
 * the popup) — Mailchimp API key stays server-side.
 *
 * Props let guide pages tailor the headline/sub for context.
 */

import { useCallback, useState } from 'react'
import styles from './NewsletterSidebarCard.module.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface NewsletterSidebarCardProps {
  headline?: string
  sub?:      string
}

type Status = 'idle' | 'loading' | 'error' | 'success'

export default function NewsletterSidebarCard({
  headline = 'Más guías como esta.',
  sub      = 'Destinos, tips y Mundial 2026 — en tu correo.',
}: NewsletterSidebarCardProps) {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error,  setError]  = useState('Verifica tu correo.')

  const submit = useCallback(async () => {
    const value = email.trim()
    if (!value || !EMAIL_RE.test(value)) {
      setError('Verifica tu correo.')
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: value }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string }
        setError(data.error ?? 'Verifica tu correo e intenta de nuevo.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setError('No pudimos conectar. Intenta más tarde.')
      setStatus('error')
    }
  }, [email])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
  }

  if (status === 'success') {
    return (
      <div className={styles.card}>
        <div className={styles.success} role="status">
          <div className={styles.successCheck}>✓</div>
          <div className={styles.successText}>¡Ya estás dentro.</div>
          <div className={styles.successSub}>Revisa tu correo para confirmar.</div>
        </div>
      </div>
    )
  }

  const isLoading = status === 'loading'

  return (
    <div className={styles.card}>
      <div className={styles.label}>Boletín</div>
      <div className={styles.headline}>{headline}</div>
      <div className={styles.sub}>{sub}</div>

      <input
        type="email"
        autoComplete="email"
        aria-label="Tu correo electrónico"
        placeholder="tu@correo.com"
        className={styles.input}
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={isLoading}
      />

      {status === 'error' && (
        <div className={styles.error} role="alert">{error}</div>
      )}

      <button
        type="button"
        className={styles.btn}
        onClick={submit}
        disabled={isLoading}
      >
        {isLoading ? '...' : 'Unirme →'}
      </button>

      <div className={styles.privacy}>Sin spam · Cancela cuando quieras</div>
    </div>
  )
}
