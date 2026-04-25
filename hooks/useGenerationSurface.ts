'use client'

// hooks/useGenerationSurface.ts
// UI-only state machine for trip generation. Separated from network code so it
// can wrap either the existing sync flow in TripResult or a future async-only
// flow without changes.
//
// Inputs:
//   - active:         boolean — are we currently generating?
//   - payload:        the submitted inputs (for slot substitution)
//   - chunksDone:     optional signal (async path feeds this in)
//   - chunksTotal:    optional signal (async path feeds this in)
//   - externalDone:   optional flag — set true by caller when server returns ok
//   - externalError:  optional — set by caller on terminal error
//
// Outputs: phase, progress, message, stage, and derived readiness.

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fillMessage,
  getPool,
  rotationIntervalMs,
  shuffle,
  type Locale,
  type MessageSlots,
  type Tier,
} from '../lib/generation/messages'

// Timing constants mirror the spec exactly.
const TOTAL_MIN_MS         = 6_500
const INITIATING_MIN_MS    = 400
const WARMING_MIN_MS       = 1_200
const COMPOSING_MIN_MS     = 2_000
const FINALIZING_MIN_MS    = 1_200
const FINALIZING_MAX_MS    = 2_500
const CLIENT_TICK_MS       = 500
const SYNC_EXPECTED_MS     = 8_000
const ASYNC_EXPECTED_MS    = 90_000

export type SurfacePhase =
  | 'idle'
  | 'initiating'
  | 'warming'
  | 'composing'
  | 'finalizing'
  | 'ready'
  | 'failed'

export type UseGenerationSurfaceInput = {
  active: boolean
  locale?: Locale
  isAsync?: boolean
  slots?: MessageSlots
  chunksDone?: number | null
  chunksTotal?: number | null
  externalDone?: boolean   // set true when caller's network work succeeds
  externalError?: unknown  // truthy when caller hit a terminal error
}

export type UseGenerationSurface = {
  phase: SurfacePhase
  progress: number
  message: string
  stage: Tier | null
}

function stageFromProgress(p: number): Tier {
  if (p < 0.30) return 'understanding'
  if (p < 0.80) return 'constructing'
  return 'refining'
}

export function useGenerationSurface(input: UseGenerationSurfaceInput): UseGenerationSurface {
  const {
    active,
    locale = 'es',
    isAsync = false,
    slots = {},
    chunksDone = null,
    chunksTotal = null,
    externalDone = false,
    externalError = null,
  } = input

  const [phase,    setPhase]    = useState<SurfacePhase>('idle')
  const [progress, setProgress] = useState(0)
  const [message,  setMessage]  = useState('')
  const [stage,    setStage]    = useState<Tier | null>(null)

  // Refs
  const startedAtRef     = useRef(0)
  const phaseEnteredRef  = useRef(0)
  const expectedMsRef    = useRef(SYNC_EXPECTED_MS)
  const tickTimerRef     = useRef<ReturnType<typeof setInterval> | null>(null)
  const phaseTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messageTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeRef        = useRef(active)
  const externalDoneRef  = useRef(externalDone)

  // Message rotation refs
  const tierRef         = useRef<Tier>('understanding')
  const queueRef        = useRef<string[]>([])
  const queueIdxRef     = useRef(0)
  const cycleCountRef   = useRef(1)
  const lastShownRef    = useRef<string | null>(null)
  const slotsRef        = useRef<MessageSlots>(slots)
  useEffect(() => { slotsRef.current = slots }, [slots])

  const clearAll = useCallback(() => {
    if (tickTimerRef.current)    { clearInterval(tickTimerRef.current);    tickTimerRef.current = null }
    if (phaseTimerRef.current)   { clearTimeout(phaseTimerRef.current);    phaseTimerRef.current = null }
    if (messageTimerRef.current) { clearTimeout(messageTimerRef.current);  messageTimerRef.current = null }
  }, [])

  // ── Messages ────────────────────────────────────────────────────────────
  const rotateMessage = useCallback(() => {
    const tier = tierRef.current
    let queue = queueRef.current
    let idx   = queueIdxRef.current

    if (queue.length === 0 || idx >= queue.length) {
      const pool = getPool(locale, tier)
      queue = shuffle(pool, lastShownRef.current)
      idx = 0
      if (queueRef.current.length > 0) cycleCountRef.current += 1
      queueRef.current = queue
    }

    const template = queue[idx]
    queueIdxRef.current = idx + 1
    const filled = fillMessage(template, slotsRef.current, locale)
    lastShownRef.current = template
    setMessage(filled)

    const interval = rotationIntervalMs(cycleCountRef.current)
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current)
    messageTimerRef.current = setTimeout(rotateMessage, interval)
  }, [locale])

  const switchTier = useCallback((next: Tier) => {
    if (tierRef.current === next) return
    tierRef.current = next
    queueRef.current = []
    queueIdxRef.current = 0
    cycleCountRef.current = 1
    setStage(next)
    rotateMessage()
  }, [rotateMessage])

  // ── Progress source ─────────────────────────────────────────────────────
  const tick = useCallback(() => {
    if (!activeRef.current) return
    const elapsed    = Date.now() - startedAtRef.current
    const timeFloor  = Math.min(0.85, elapsed / expectedMsRef.current)
    const total      = chunksTotal && chunksTotal > 0 ? chunksTotal : 0
    const done       = chunksDone ?? 0
    const signalCeil = total > 0 ? Math.min(0.95, (done / total) * 0.95) : 0
    const target     = Math.max(timeFloor, signalCeil)

    setProgress(prev => {
      const next = Math.max(prev, Math.min(0.95, target))
      const nextStage = stageFromProgress(next)
      if (nextStage !== tierRef.current) {
        queueMicrotask(() => switchTier(nextStage))
      }
      return next
    })
  }, [chunksDone, chunksTotal, switchTier])

  // ── Phase helpers ───────────────────────────────────────────────────────
  const enterPhase = useCallback((p: SurfacePhase) => {
    setPhase(p)
    phaseEnteredRef.current = Date.now()
  }, [])

  const toFinalizing = useCallback(() => {
    enterPhase('finalizing')
    setProgress(1)
    const elapsed = Date.now() - startedAtRef.current
    const needed  = TOTAL_MIN_MS - elapsed
    const hold    = Math.min(FINALIZING_MAX_MS, Math.max(FINALIZING_MIN_MS, needed))
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
    phaseTimerRef.current = setTimeout(() => {
      clearAll()
      setPhase('ready')
    }, hold)
  }, [clearAll, enterPhase])

  const toComposing = useCallback(() => {
    enterPhase('composing')
  }, [enterPhase])

  const tryAdvanceFromComposing = useCallback(() => {
    const composeElapsed = Date.now() - phaseEnteredRef.current
    if (composeElapsed >= COMPOSING_MIN_MS) {
      toFinalizing()
    } else {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
      phaseTimerRef.current = setTimeout(toFinalizing, COMPOSING_MIN_MS - composeElapsed)
    }
  }, [toFinalizing])

  const tryAdvanceFromWarming = useCallback(() => {
    const warmElapsed = Date.now() - phaseEnteredRef.current
    if (warmElapsed >= WARMING_MIN_MS) {
      toComposing()
    } else {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
      phaseTimerRef.current = setTimeout(toComposing, WARMING_MIN_MS - warmElapsed)
    }
  }, [toComposing])

  // ── Drive from `active` flag ────────────────────────────────────────────
  useEffect(() => {
    activeRef.current = active
    if (active) {
      // Reset
      clearAll()
      startedAtRef.current = Date.now()
      expectedMsRef.current = isAsync ? ASYNC_EXPECTED_MS : SYNC_EXPECTED_MS
      setProgress(0)
      setPhase('initiating')
      phaseEnteredRef.current = Date.now()

      // Messages
      tierRef.current = 'understanding'
      queueRef.current = []
      queueIdxRef.current = 0
      cycleCountRef.current = 1
      lastShownRef.current = null
      setStage('understanding')
      rotateMessage()

      // Ticker
      tickTimerRef.current = setInterval(tick, CLIENT_TICK_MS)

      // INITIATING → WARMING after min
      phaseTimerRef.current = setTimeout(() => {
        if (!activeRef.current) return
        setPhase('warming')
        phaseEnteredRef.current = Date.now()
        // Warming auto-advances after min; async chunks signal may accelerate
        phaseTimerRef.current = setTimeout(tryAdvanceFromWarming, WARMING_MIN_MS + 100)
      }, INITIATING_MIN_MS)
    } else {
      // Only tear down if we're not already in a timer-driven terminal hold
      // (finalizing/ready/failed). For idle the machine is dormant.
      if (phase === 'idle' || phase === 'ready' || phase === 'failed') {
        clearAll()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, isAsync])

  // ── React to external signals ──────────────────────────────────────────
  useEffect(() => {
    externalDoneRef.current = externalDone
    if (!externalDone) return
    // Server reported completion (sync resolved or async status=completed).
    // Drive phases forward; never short-circuit to ready.
    if (phase === 'initiating' || phase === 'warming') {
      // Make sure we traverse composing; use timers
      setPhase('warming')
      phaseEnteredRef.current = Date.now()
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
      phaseTimerRef.current = setTimeout(() => {
        toComposing()
        if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
        phaseTimerRef.current = setTimeout(toFinalizing, COMPOSING_MIN_MS)
      }, WARMING_MIN_MS)
    } else if (phase === 'composing') {
      tryAdvanceFromComposing()
    }
    // If already finalizing/ready, let existing timers finish.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalDone])

  useEffect(() => {
    if (!externalError) return
    clearAll()
    setPhase('failed')
  }, [externalError, clearAll])

  // Advance from warming on first async signal
  useEffect(() => {
    if (!isAsync) return
    if (phase !== 'warming') return
    if ((chunksDone ?? 0) >= 1) tryAdvanceFromWarming()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunksDone, phase, isAsync])

  // Cleanup on unmount
  useEffect(() => () => clearAll(), [clearAll])

  return { phase, progress, message, stage }
}
