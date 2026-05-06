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
import { useTranslations } from 'next-intl'
import styles from './NewsletterSidebarCard.module.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface NewsletterSidebarCardProps {
  headline?: string
  sub?:      string
}

type Status = 'idle' | 'loading' | 'error' | 'success'

export default function NewsletterSidebarCard({
  headline,
  sub,
}: NewsletterSidebarCardProps) {
  const t = useTranslations('newsletter')
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error,  setError]  = useState(t('common.errorEmailShort'))

  const submit = useCallback(async () => {
    const value = email.trim()
    if (!value || !EMAIL_RE.test(value)) {
      setError(t('common.errorEmailShort'))
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
    } catch {
      setError(t('common.errorNetwork'))
      setStatus('error')
    }
  }, [email, t])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
  }

  if (status === 'success') {
    return (
      <div className={styles.card}>
        <div className={styles.success} role="status">
          <div className={styles.successCheck}>✓</div>
          <div className={styles.successText}>{t('sidebar.successText')}</div>
          <div className={styles.successSub}>{t('sidebar.successSub')}</div>
        </div>
      </div>
    )
  }

  const isLoading = status === 'loading'

  return (
    <div className={styles.card}>
      <div className={styles.label}>{t('sidebar.label')}</div>
      <div className={styles.headline}>{headline ?? t('sidebar.headline')}</div>
      <div className={styles.sub}>{sub ?? t('sidebar.sub')}</div>

      <input
        type="email"
        autoComplete="email"
        aria-label={t('common.ariaEmail')}
        placeholder={t('common.placeholder')}
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
        {isLoading ? t('common.loading') : t('sidebar.submit')}
      </button>

      <div className={styles.privacy}>{t('sidebar.privacy')}</div>
    </div>
  )
}
