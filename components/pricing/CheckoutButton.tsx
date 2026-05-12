'use client'

/**
 * CheckoutButton — pricing-page CTA wired to /api/checkout.
 *
 * Mirrors the PaywallModal flow:
 *   1. POST /api/checkout { plan, locale }
 *   2. 200      → window.location.href = data.url  (full page nav to Stripe)
 *   3. 401      → save current pathname in sessionStorage and redirect to
 *                 the locale-aware signup page; SignupForm reads
 *                 `redirectAfterLogin` and bounces the user back here
 *                 after they sign up.
 *   4. anything else → render an inline error message just below the
 *                 button. Self-contained so the parent card stays a
 *                 plain server component.
 *
 * The component is intentionally presentational on the visual side:
 * parents pass the className (so each card keeps its outline-pine vs
 * outline-sand variant) and the localized CTA label as children.
 */

import { useState } from 'react'

export type CheckoutPlan = 'trip-1' | 'trip-5' | 'trip-10' | 'subscription'

interface CheckoutButtonProps {
  plan:        CheckoutPlan
  locale:      string
  signupHref:  string
  className:   string
  loadingText: string
  /** Used for the inline error text — pine for light cards, sand for the Pine card. */
  errorTone?:  'pine' | 'sand'
  children:    React.ReactNode
}

export default function CheckoutButton({
  plan,
  locale,
  signupHref,
  className,
  loadingText,
  errorTone = 'pine',
  children,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ plan, locale }),
      })

      // Not authenticated — save return path and send to signup
      if (res.status === 401) {
        try {
          sessionStorage.setItem(
            'redirectAfterLogin',
            window.location.pathname + window.location.search,
          )
        } catch {
          /* private mode — ignore; user re-navigates manually */
        }
        window.location.href = signupHref
        return
      }

      const data = await res.json().catch(() => ({})) as { url?: string; error?: string }

      if (!res.ok || !data.url) {
        setError(data.error ?? (locale === 'es' ? 'Error al iniciar el pago.' : 'Payment error.'))
        setLoading(false)
        return
      }

      // Hand off to Stripe Checkout (full page nav)
      window.location.href = data.url
    } catch {
      setError(locale === 'es' ? 'Error de red. Intenta de nuevo.' : 'Network error. Please try again.')
      setLoading(false)
    }
  }

  const errorClass = errorTone === 'sand'
    ? 'mt-2 text-center font-mono text-[9px] text-coral'
    : 'mt-2 text-center font-mono text-[9px] text-coral'

  return (
    <>
      <button
        type="button"
        data-plan={plan}
        onClick={handleClick}
        disabled={loading}
        className={`${className} disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {loading ? loadingText : children}
      </button>
      {error && (
        <p role="alert" className={errorClass}>{error}</p>
      )}
    </>
  )
}
