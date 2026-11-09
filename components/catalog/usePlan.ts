'use client'

/**
 * components/catalog/usePlan.ts
 *
 * The shared plan lives in localStorage (`lp_plan`). Every storage access is wrapped:
 * private windows and blocked site data throw, and the pages must work without it.
 *
 * State starts empty and is read after mount, so the server HTML and the first
 * client render agree (no hydration mismatch). Other tabs stay in sync through the
 * `storage` event.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { PLAN_KEY, parsePlan, serializePlan, sameRef, togglePlan, type PlanRef } from '../../lib/plan'

function read(): PlanRef[] {
  try { return parsePlan(window.localStorage.getItem(PLAN_KEY)) } catch { return [] }
}

function write(items: PlanRef[]) {
  try {
    if (items.length === 0) window.localStorage.removeItem(PLAN_KEY)
    else window.localStorage.setItem(PLAN_KEY, serializePlan(items))
  } catch { /* storage unavailable: the plan lasts for this visit only */ }
}

export function usePlan() {
  const [items, setItems] = useState<PlanRef[]>([])
  const [ready, setReady] = useState(false)
  const latest = useRef<PlanRef[]>([])

  const commit = useCallback((next: PlanRef[]) => {
    latest.current = next
    setItems(next)
    write(next)
  }, [])

  useEffect(() => {
    const initial = read()
    latest.current = initial
    setItems(initial)
    setReady(true)
    const onStorage = (e: StorageEvent) => {
      if (e.key !== null && e.key !== PLAN_KEY) return
      const next = read()
      latest.current = next
      setItems(next)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = useCallback((ref: PlanRef) => {
    const next = togglePlan(latest.current, ref)
    commit(next)
    return next
  }, [commit])

  const remove = useCallback((ref: PlanRef) => commit(latest.current.filter(i => !sameRef(i, ref))), [commit])
  const clear = useCallback(() => commit([]), [commit])

  return { items, ready, toggle, remove, clear }
}
