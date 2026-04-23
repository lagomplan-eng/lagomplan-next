'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { useUser } from '../auth/SupabaseProvider'
import PaywallModal from '../PaywallModal'

export type PlanState = {
  tier: string
  trips_remaining: number
  trips_used?: number
  is_subscriber: boolean
  last_session_id?: string | null
}

type Ctx = {
  planCredits: PlanState | null | 'loading'
  setPlanCredits: (p: PlanState | null | 'loading') => void
  refreshPlanCredits: () => Promise<PlanState | null>
  confirmPurchase: (sessionId: string, timeoutMs?: number) => Promise<'credited' | 'timeout'>
  paywallOpen: boolean
  openPaywall: () => void
  closePaywall: () => void
}

const PlanContext = createContext<Ctx | null>(null)

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const user = useUser()
  const locale = useLocale()
  const [planCredits, setPlanCredits] = useState<PlanState | null | 'loading'>('loading')
  const [paywallOpen, setPaywallOpen] = useState(false)

  const ref = useRef<PlanState | null | 'loading'>(planCredits)
  useEffect(() => { ref.current = planCredits }, [planCredits])

  const refreshPlanCredits = useCallback(async () => {
    try {
      const res = await fetch('/api/me/plan', { cache: 'no-store' })
      if (!res.ok) return null
      const data = (await res.json()) as PlanState
      setPlanCredits(data)
      return data
    } catch {
      return null
    }
  }, [])

  // Track user.id (not the full object) so token refresh events — which return a
  // new User object with the same id — don't retrigger a plan refetch.
  const userId = user?.id ?? null
  useEffect(() => {
    if (user === undefined) return                        // auth resolving
    if (user === null) { setPlanCredits(null); return }   // logged out
    setPlanCredits('loading')
    refreshPlanCredits()
    // intentionally keyed on user identity, not user object reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const confirmPurchase = useCallback(async (sessionId: string, timeoutMs = 10_000) => {
    const deadline = Date.now() + timeoutMs
    while (Date.now() < deadline) {
      const data = await refreshPlanCredits()
      if (data && data.last_session_id === sessionId) return 'credited'
      await new Promise(r => setTimeout(r, 800))
    }
    return 'timeout'
  }, [refreshPlanCredits])

  const openPaywall = useCallback(() => setPaywallOpen(true), [])
  const closePaywall = useCallback(() => setPaywallOpen(false), [])

  // Auto-close paywall when credits become available. Covers the post-payment
  // window (credits just landed) and the top-up-from-empty-nav-badge flow.
  useEffect(() => {
    if (planCredits === 'loading' || !planCredits) return
    if (planCredits.is_subscriber || planCredits.trips_remaining > 0) {
      setPaywallOpen(false)
    }
  }, [planCredits])

  return (
    <PlanContext.Provider
      value={{
        planCredits,
        setPlanCredits,
        refreshPlanCredits,
        confirmPurchase,
        paywallOpen,
        openPaywall,
        closePaywall,
      }}
    >
      {children}
      <PaywallModal open={paywallOpen} locale={locale} onClose={closePaywall} />
    </PlanContext.Provider>
  )
}

export function usePlan() {
  const ctx = useContext(PlanContext)
  if (!ctx) throw new Error('usePlan must be used within PlanProvider')
  return ctx
}
