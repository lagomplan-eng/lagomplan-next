'use client'

/**
 * NewsletterEndOfGuide — full-width Pine card inside a Sand band.
 *
 * Sits after the last content section of a guide detail page, just
 * before the layout's <Footer />. Targets readers who finished the
 * guide — peak intent.
 *
 * Posts to /api/subscribe (same server route as the footer form, the
 * popup, and the sidebar card).
 */

import { useCallback, useState } from 'react'
import styles from './NewsletterEndOfGuide.module.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface NewsletterEndOfGuideProps {
  headline?: string
  sub?:      string
}

type Status = 'idle' | 'loading' | 'error' | 'success'

export default function NewsletterEndOfGuide({
  headline = '¿Te gustó esta guía?\nRecibe más como esta.',
  sub      = 'Destinos curados, itinerarios y tips — cada semana.',
}: NewsletterEndOfGuideProps) {
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

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.text}>
          <div className={styles.label}>Boletín Lagomplan</div>
          <div className={styles.headline}>{headline}</div>
          <div className={styles.sub}>{sub}</div>
        </div>

        <div className={styles.formWrap}>
          {isSuccess ? (
            <div className={styles.success} role="status">
              <div className={styles.successCheck}>✓</div>
              <div>
                <div className={styles.successText}>¡Ya estás dentro.</div>
                <div className={styles.successSub}>Revisa tu correo para confirmar.</div>
              </div>
            </div>
          ) : (
            <div>
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
          )}
        </div>
      </div>
    </section>
  )
}
