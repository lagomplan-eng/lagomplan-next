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
import { useTranslations } from 'next-intl'
import styles from './NewsletterEndOfGuide.module.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface NewsletterEndOfGuideProps {
  headline?: string
  sub?:      string
}

type Status = 'idle' | 'loading' | 'error' | 'success'

export default function NewsletterEndOfGuide({
  headline,
  sub,
}: NewsletterEndOfGuideProps) {
  const t = useTranslations('newsletter')
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error,  setError]  = useState(t('common.errorEmail'))

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
    } catch {
      setError(t('common.errorNetwork'))
      setStatus('error')
    }
  }, [email, t])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
  }

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.text}>
          <div className={styles.label}>{t('endOfGuide.label')}</div>
          <div className={styles.headline}>{headline ?? t('endOfGuide.headline')}</div>
          <div className={styles.sub}>{sub ?? t('endOfGuide.sub')}</div>
        </div>

        <div className={styles.formWrap}>
          {isSuccess ? (
            <div className={styles.success} role="status">
              <div className={styles.successCheck}>✓</div>
              <div>
                <div className={styles.successText}>{t('endOfGuide.successText')}</div>
                <div className={styles.successSub}>{t('endOfGuide.successSub')}</div>
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.form}>
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
                <button
                  type="button"
                  className={styles.btn}
                  onClick={submit}
                  disabled={isLoading}
                >
                  {isLoading ? t('common.loading') : t('endOfGuide.submit')}
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
