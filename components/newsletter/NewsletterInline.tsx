'use client'

/**
 * NewsletterInline — editorial CTA dropped between guide sections.
 *
 * Static inline block (no scroll/session logic). Posts to /api/subscribe
 * (same server route as the footer NewsletterForm). On success, replaces
 * itself with a ✓ confirmation row.
 *
 * Props let guide pages tailor the eyebrow/headline/sub for context
 * (e.g. a World Cup guide can say "Cobertura del Mundial, en tu correo.").
 */

import { useCallback, useState } from 'react'
import styles from './NewsletterInline.module.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface NewsletterInlineProps {
  eyebrow?:  string
  headline?: string
  sub?:      string
}

type Status = 'idle' | 'loading' | 'error' | 'success'

export default function NewsletterInline({
  eyebrow  = 'Boletín Lagomplan',
  headline = 'Más guías así, cada semana.',
  sub      = 'Destinos, itinerarios y tips de planeación — en tu correo.',
}: NewsletterInlineProps) {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error,  setError]  = useState('Verifica tu correo e intenta de nuevo.')

  const submit = useCallback(async () => {
    const value = email.trim()
    if (!value || !EMAIL_RE.test(value)) {
      setError('Verifica tu correo e intenta de nuevo.')
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
      <div className={styles.wrap}>
        <div className={styles.success} role="status">
          <div className={styles.successCheck}>✓</div>
          <div>
            <div className={styles.successMsg}>¡Ya estás dentro.</div>
            <div className={styles.successSub}>
              Revisa tu correo para confirmar tu suscripción.
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isLoading = status === 'loading'

  return (
    <div className={styles.wrap}>
      <div className={styles.block}>
        <div className={styles.text}>
          <div className={styles.eyebrow}>{eyebrow}</div>
          <div className={styles.headline}>{headline}</div>
          <div className={styles.sub}>{sub}</div>
        </div>

        <div className={styles.formCol}>
          <div className={styles.form}>
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
            <button
              type="button"
              className={styles.btn}
              onClick={submit}
              disabled={isLoading}
            >
              {isLoading ? '...' : 'Suscribirse'}
            </button>
          </div>
          {status === 'error' && (
            <div className={styles.error} role="alert">{error}</div>
          )}
        </div>
      </div>
    </div>
  )
}
