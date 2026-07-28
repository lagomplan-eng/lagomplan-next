'use client'

/**
 * app/guia/[partner]/NewsletterSignup.tsx
 *
 * "El Itinerario" capture in the dark Pine band. Posts { email } to the
 * existing /api/subscribe endpoint (Mailchimp). Shows a done/error state
 * inline; on success the form is replaced by a short confirmation.
 */

import { useState } from 'react'
import type { Lang } from '../../../content/guia/types'
import styles from './guia.module.css'

export interface NewsletterCopy {
  title: string
  body: string
  placeholder: string
  cta: string
  finePrint: string
}

export default function NewsletterSignup({ copy, lang }: { copy: NewsletterCopy; lang: Lang }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!res.ok) throw new Error('subscribe failed')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const doneMsg = lang === 'es' ? '¡Listo! Revisa tu correo.' : 'Done! Check your inbox.'
  const errMsg = lang === 'es' ? 'No se pudo suscribir. Intenta de nuevo.' : 'Couldn\'t subscribe. Please try again.'

  return (
    <div className={styles.nlWrap}>
      <h3 className={styles.nlTitle}>{copy.title}</h3>
      <p className={styles.nlBody}>{copy.body}</p>

      {status === 'done' ? (
        <p className={styles.nlDone}>{doneMsg}</p>
      ) : (
        <form className={styles.nlForm} onSubmit={onSubmit}>
          <input
            className={styles.nlInput}
            type="email"
            required
            placeholder={copy.placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label={copy.title}
          />
          <button className={styles.nlBtn} type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? '…' : copy.cta}
          </button>
        </form>
      )}

      {status === 'error' && <p className={styles.nlError}>{errMsg}</p>}
      <p className={styles.nlFine}>{copy.finePrint}</p>
    </div>
  )
}
