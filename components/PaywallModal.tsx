'use client'
/**
 * components/PaywallModal.tsx
 *
 * Shown when a user runs out of trip credits.
 * Calls POST /api/checkout internally and redirects to Stripe Checkout.
 *
 * Props:
 *   open    — controls visibility
 *   locale  — 'es' | 'en'
 *   onClose — called when user dismisses without purchasing
 */

import { useState } from 'react'

type Plan = 'trip-1' | 'trip-5' | 'trip-10' | 'subscription'

interface PaywallModalProps {
  open:    boolean
  locale:  string
  onClose: () => void
}

export default function PaywallModal({ open, locale, onClose }: PaywallModalProps) {
  const isES = locale !== 'en'

  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null)
  const [apiError,    setApiError]    = useState<string | null>(null)

  if (!open) return null

  async function startCheckout(plan: Plan) {
    setLoadingPlan(plan)
    setApiError(null)
    try {
      const res  = await fetch('/api/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ plan, locale }),
      })
      const data = await res.json()

      if (!res.ok || !data.url) {
        setApiError(data.error ?? (isES ? 'Error al iniciar el pago' : 'Payment error'))
        setLoadingPlan(null)
        return
      }

      // Save current trip URL so we can restore it after Stripe redirects back
      sessionStorage.setItem('plannerReturnUrl', window.location.pathname + window.location.search)
      // Redirect to Stripe Checkout (full page navigation)
      window.location.href = data.url

    } catch {
      setApiError(isES ? 'Error de red. Intenta de nuevo.' : 'Network error. Please try again.')
      setLoadingPlan(null)
    }
  }

  const plans: { id: Plan; label: string; price: string; usd: string; badge: string | null; highlight: boolean }[] = [
    {
      id:        'trip-5',
      label:     isES ? '5 viajes' : '5 trips',
      price:     '$149 MXN',
      usd:       '~$8.75 USD',
      badge:     isES ? '⭐ Más popular' : '⭐ Most popular',
      highlight: true,
    },
    {
      id:        'trip-10',
      label:     isES ? '10 viajes' : '10 trips',
      price:     '$249 MXN',
      usd:       '~$14.60 USD',
      badge:     isES ? '💼 Sin suscripción' : '💼 No subscription',
      highlight: false,
    },
    {
      id:        'trip-1',
      label:     isES ? '1 viaje' : '1 trip',
      price:     '$39 MXN',
      usd:       '~$2.30 USD',
      badge:     null,
      highlight: false,
    },
  ]

  const isAnyLoading = loadingPlan !== null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={e => { if (e.target === e.currentTarget && !isAnyLoading) onClose() }}
    >
      <div className="w-full max-w-[420px] bg-white rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,.18)] overflow-hidden">

        {/* Header */}
        <div className="bg-[#0F3A33] px-6 pt-8 pb-6 text-center">
          <h2 className="font-playfair text-[26px] font-bold text-white leading-tight tracking-[-0.5px]">
            {isES ? 'Tu siguiente viaje está listo ✨' : 'Your next trip awaits ✨'}
          </h2>
          <p className="font-sans text-[13px] text-[#A8C5BE] mt-2 leading-relaxed">
            {isES
              ? 'Has usado tus viajes gratuitos. Elige cómo quieres seguir explorando.'
              : 'You\u2019ve used your free trips. Choose how you want to keep exploring.'}
          </p>
        </div>

        {/* Plans */}
        <div className="px-5 pt-5 pb-3 flex flex-col gap-3">

          {plans.map((plan) => {
            const isLoading = loadingPlan === plan.id
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => startCheckout(plan.id)}
                disabled={isAnyLoading}
                className={[
                  'relative w-full flex items-center justify-between px-4 py-3.5 rounded-[12px] border transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed',
                  plan.highlight
                    ? 'bg-[#E4EFEC] border-[#0F3A33] shadow-[0_2px_12px_rgba(15,58,51,.12)]'
                    : 'bg-white border-[rgba(107,143,134,.28)] hover:border-[#0F3A33] hover:bg-[#F7F3EE]',
                ].join(' ')}
              >
                {/* Left */}
                <div className="flex flex-col gap-0.5">
                  <span className="font-sans text-[14px] font-semibold text-[#0F3A33]">
                    {plan.label}
                  </span>
                  {plan.badge && (
                    <span className="font-sans text-[10px] text-[#2D6B57] font-medium">
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Right — price or spinner */}
                <div className="flex flex-col items-end gap-0.5">
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-[#C8D9D3] border-t-[#0F3A33] rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="font-mono text-[15px] font-bold text-[#0F3A33]">
                        {plan.price}
                      </span>
                      <span className="font-mono text-[10px] text-[#6B8F86]">
                        {plan.usd}
                      </span>
                    </>
                  )}
                </div>
              </button>
            )
          })}

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 border-t border-[#EDE9E4]" />
            <span className="font-sans text-[11px] text-[#A0A0A0] tracking-[0.5px]">
              {isES ? 'o desbloquea todo' : 'or unlock everything'}
            </span>
            <div className="flex-1 border-t border-[#EDE9E4]" />
          </div>

          {/* Subscription */}
          <button
            type="button"
            onClick={() => startCheckout('subscription')}
            disabled={isAnyLoading}
            className="relative w-full flex items-center justify-between px-4 py-3.5 rounded-[12px] border border-[#0F3A33] bg-[#0F3A33] hover:bg-[#1a4a42] transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-[14px] font-semibold text-white">
                Explorer
              </span>
              <span className="font-sans text-[10px] text-[#A8C5BE]">
                {isES ? '🔥 Mejor valor · Viajes ilimitados ✨' : '🔥 Best value · Unlimited trips ✨'}
              </span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              {loadingPlan === 'subscription' ? (
                <div className="w-4 h-4 border-2 border-[#4a7a72] border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="font-mono text-[15px] font-bold text-white">$199 MXN</span>
                  <span className="font-mono text-[10px] text-[#6B9E94]">
                    {isES ? '/mes · ~$11.50 USD' : '/mo · ~$11.50 USD'}
                  </span>
                </>
              )}
            </div>
          </button>

          {/* API error */}
          {apiError && (
            <p className="text-[12px] text-center text-red-600 mt-1">{apiError}</p>
          )}

        </div>

        {/* Footer */}
        <div className="pb-5 px-5 flex flex-col items-center gap-2">
          <p className="text-center font-sans text-[10px] text-[#BDBDBD]">
            {isES
              ? 'Pagos seguros · Sin cargos ocultos · Cancela cuando quieras'
              : 'Secure payments · No hidden fees · Cancel anytime'}
          </p>
          {!isAnyLoading && (
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-[11px] text-[#A09C97] hover:text-[#0F3A33] transition-colors"
            >
              {isES ? 'Ahora no' : 'Not now'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
