'use client'

/**
 * NewsletterPopup — slide-in bottom-right card.
 *
 * Behavior:
 *  - Hidden until the user has scrolled ≥ 40% of the page, then shown once
 *    per session (sessionStorage).
 *  - "×" dismisses for 7 days (localStorage timestamp).
 *  - Successful submit → ✓ confirmation, auto-hide after 3.5s.
 *  - Submits to /api/subscribe — same server route used by the footer
 *    NewsletterForm (Mailchimp Marketing API, key stays server-side).
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './NewsletterPopup.module.css'

const SCROLL_TRIGGER = 0.40
const DISMISS_DAYS   = 7
const DISMISS_MS     = DISMISS_DAYS * 86_400_000
const SESSION_KEY    = 'lgm_popup_seen'
const DISMISS_KEY    = 'lgm_popup_dismissed'
const EMAIL_RE       = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = 'idle' | 'loading' | 'error' | 'success'

function safeGet(storage: 'session' | 'local', key: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return (storage === 'session' ? sessionStorage : localStorage).getItem(key)
  } catch {
    return null
  }
}

function safeSet(storage: 'session' | 'local', key: string, value: string): void {
  if (typeof window === 'undefined') return
  try {
    ;(storage === 'session' ? sessionStorage : localStorage).setItem(key, value)
  } catch {
    /* private mode — ignore */
  }
}

function isDismissed(): boolean {
  const v = safeGet('local', DISMISS_KEY)
  if (!v) return false
  const ts = parseInt(v, 10)
  return Number.isFinite(ts) && Date.now() < ts
}

function isSeenThisSession(): boolean {
  return safeGet('session', SESSION_KEY) !== null
}

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [status,  setStatus]  = useState<Status>('idle')
  const [error,   setError]   = useState<string>('Verifica tu correo e intenta de nuevo.')
  const [email,   setEmail]   = useState('')
  const shownRef = useRef(false)

  // Scroll-trigger
  useEffect(() => {
    if (isDismissed() || isSeenThisSession()) return

    const reveal = () => {
      if (shownRef.current) return
      shownRef.current = true
      safeSet('session', SESSION_KEY, '1')
      setVisible(true)
      window.removeEventListener('scroll', onScroll)
    }

    const onScroll = () => {
      if (shownRef.current) return
      const max = document.body.scrollHeight - window.innerHeight
      if (max <= 0) return
      if (window.scrollY / max >= SCROLL_TRIGGER) reveal()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Dismiss for 7 days
  const dismiss = useCallback(() => {
    setVisible(false)
    safeSet('local', DISMISS_KEY, String(Date.now() + DISMISS_MS))
  }, [])

  // ESC closes
  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [visible, dismiss])

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
      setTimeout(dismiss, 3500)
    } catch {
      setError('No pudimos conectar. Intenta más tarde.')
      setStatus('error')
    }
  }, [email, dismiss])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
  }

  const isSuccess = status === 'success'
  const isLoading = status === 'loading'

  return (
    <div
      role="dialog"
      aria-label="Newsletter de Lagomplan"
      aria-hidden={!visible}
      className={`${styles.popup} ${visible ? styles.visible : ''}`}
    >
      <button
        type="button"
        aria-label="Cerrar"
        className={styles.close}
        onClick={dismiss}
      >
        ×
      </button>

      {isSuccess ? (
        <div className={styles.success}>
          <div className={styles.successIcon}>✓</div>
          <div className={styles.successText}>¡Ya estás dentro.</div>
          <div className={styles.successSub}>Revisa tu correo para confirmar.</div>
        </div>
      ) : (
        <div>
          <div className={styles.eyebrow}>Guías · Consejos · Mundial 2026</div>
          <div className={styles.headline}>
            Tu próximo viaje,<br />antes de que lo pidas.
          </div>
          <div className={styles.sub}>
            Destinos curados, rutas probadas y tips de planeación — en tu correo.
          </div>

          <div className={styles.formRow}>
            <input
              type="email"
              autoComplete="email"
              aria-label="Tu correo electrónico"
              placeholder="tu@correo.com"
              className={styles.email}
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={isLoading}
            />
            <button
              type="button"
              className={styles.submit}
              onClick={submit}
              disabled={isLoading}
            >
              {isLoading ? '...' : 'Unirme →'}
            </button>
          </div>

          {status === 'error' && (
            <div className={styles.error} role="alert">{error}</div>
          )}
          <div className={styles.privacy}>Sin spam. Cancela cuando quieras.</div>
        </div>
      )}
    </div>
  )
}
