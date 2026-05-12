'use client'

/**
 * NewsletterPdfPrompt — controlled variant of the slide-in newsletter popup
 * triggered explicitly by the planner's "Download PDF" button.
 *
 * Differences from NewsletterPopup:
 *  - Controlled (open / onResolve props) rather than self-managing on scroll
 *  - Doesn't read or write the popup's localStorage dismiss flag — this is
 *    explicit on-demand UX, not an interruption
 *  - On dismiss (X, ESC, submit success), calls onResolve so the parent can
 *    fire window.print() after the modal fades out
 *
 * Reuses NewsletterPopup.module.css for visual + animation consistency —
 * same slide-in bottom-right card, same form treatment, same success state.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { events } from '../../lib/analytics'
import styles from './NewsletterPopup.module.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Auto-close + onResolve a bit faster than the passive popup — the user is
// waiting for their PDF, not browsing.
const SUCCESS_AUTOCLOSE_MS = 1500

type Status = 'idle' | 'loading' | 'error' | 'success'

interface Props {
  open:       boolean
  onResolve:  () => void
}

export default function NewsletterPdfPrompt({ open, onResolve }: Props) {
  const t = useTranslations('newsletter')
  const [status, setStatus] = useState<Status>('idle')
  const [error,  setError]  = useState<string>(t('common.errorEmail'))
  const [email,  setEmail]  = useState('')
  const resolvedRef = useRef(false)

  // Reset on re-open so a previous success/error state doesn't carry over.
  useEffect(() => {
    if (open) {
      resolvedRef.current = false
      setStatus('idle')
      setEmail('')
    }
  }, [open])

  const resolve = useCallback(() => {
    if (resolvedRef.current) return
    resolvedRef.current = true
    onResolve()
  }, [onResolve])

  // ESC closes the prompt + resolves (parent fires print).
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') resolve()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, resolve])

  const submit = useCallback(async () => {
    const value = email.trim()
    if (!value || !EMAIL_RE.test(value)) {
      setError(t('common.errorEmail'))
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
        setError(data.error ?? t('common.errorEmail'))
        setStatus('error')
        return
      }

      setStatus('success')
      events.waitlistSignup({ surface: 'pdf' })
      setTimeout(resolve, SUCCESS_AUTOCLOSE_MS)
    } catch {
      setError(t('common.errorNetwork'))
      setStatus('error')
    }
  }, [email, resolve, t])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
  }

  const isSuccess = status === 'success'
  const isLoading = status === 'loading'

  return (
    <div
      role="dialog"
      aria-label={t('pdfPrompt.ariaDialog')}
      aria-hidden={!open}
      className={`${styles.popup} ${open ? styles.visible : ''}`}
    >
      <button
        type="button"
        aria-label={t('pdfPrompt.ariaClose')}
        className={styles.close}
        onClick={resolve}
      >
        ×
      </button>

      {isSuccess ? (
        <div className={styles.success}>
          <div className={styles.successIcon}>✓</div>
          <div className={styles.successText}>{t('pdfPrompt.successText')}</div>
          <div className={styles.successSub}>{t('pdfPrompt.successSub')}</div>
        </div>
      ) : (
        <div>
          <div className={styles.eyebrow}>{t('pdfPrompt.eyebrow')}</div>
          <div className={styles.headline}>{t('pdfPrompt.headline')}</div>
          <div className={styles.sub}>{t('pdfPrompt.sub')}</div>

          <div className={styles.formRow}>
            <input
              type="email"
              autoComplete="email"
              aria-label={t('common.ariaEmail')}
              placeholder={t('common.placeholder')}
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
              {isLoading ? t('common.loading') : t('pdfPrompt.submit')}
            </button>
          </div>

          {status === 'error' && (
            <div className={styles.error} role="alert">{error}</div>
          )}
          <div className={styles.privacy}>{t('pdfPrompt.privacy')}</div>
        </div>
      )}
    </div>
  )
}
