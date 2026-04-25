'use client'

// hooks/useTripGeneration.ts
// Single state machine that drives the <GenerationSurface/>. Consumed by
// TripResult as a drop-in replacement for the ad-hoc generation flow.
//
// Contract: call start(payload). The hook picks sync vs async based on
// duration_days, runs the five-phase machine with a ~6500ms total floor,
// exposes progress/message/stage/tripData, and handles one silent retry on
// transient failures.
//
// Scope note (v1): the hook does not do billing-side logic beyond mapping
// HTTP errors to UX states. 401/402 surface as FAILED; retries are limited
// to network/502/504/546.

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

// ── Config ──────────────────────────────────────────────────────────────────
export const ASYNC_THRESHOLD_DEFAULT = 10

const TOTAL_MIN_MS        = 6_500
const INITIATING_MIN_MS   = 400
const WARMING_MIN_MS      = 1_200
const COMPOSING_MIN_MS    = 2_000
const FINALIZING_MIN_MS   = 1_200
const FINALIZING_MAX_MS   = 2_500

const SYNC_EXPECTED_MS    = 8_000   // time-floor target for sync path
const ASYNC_EXPECTED_MS   = 90_000  // time-floor target for async path (heuristic)

const POLL_INTERVAL_MS    = 2_000
const HARD_TIMEOUT_MS     = 240_000
const SILENT_RETRY_BUDGET = 6_000
const CLIENT_TICK_MS      = 500     // client-side time-floor tick

// ── Types ───────────────────────────────────────────────────────────────────
export type Phase =
  | 'idle'
  | 'initiating'
  | 'warming'
  | 'composing'
  | 'finalizing'
  | 'ready'
  | 'failed'

export type GenPayload = {
  destination?: string
  origin?: string
  start?: string
  end?: string
  nights?: string
  duration_days: number
  traveler?: string
  interests?: string[]
  pace?: string
  budget?: string
  tripId?: string | null
}

export type GenResult = {
  tripData: Record<string, unknown>
  tripId: string | null
}

export type GenError = {
  kind: 'auth' | 'paywall' | 'network' | 'server' | 'timeout' | 'unknown'
  message: string
  status?: number
}

export type UseTripGenerationOptions = {
  locale?: Locale
  asyncThreshold?: number
  authHeader?: string | null       // Bearer token for /api/generate-trip
  onPaywall?: () => void           // caller may open paywall on 402
  onAuthRedirect?: () => void      // caller may route to login on 401
}

export type UseTripGeneration = {
  phase: Phase
  progress: number                 // 0..1
  message: string
  stage: Tier | null
  result: GenResult | null
  error: GenError | null
  start: (payload: GenPayload) => void
  retry: () => void
  cancel: () => void
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function stageFromProgress(p: number): Tier {
  if (p < 0.30) return 'understanding'
  if (p < 0.80) return 'constructing'
  return 'refining'
}

function classifyError(status: number | null, message: string): GenError {
  if (status === 401) return { kind: 'auth',    message, status }
  if (status === 402) return { kind: 'paywall', message, status }
  const m = message.toLowerCase()
  if (m.includes('timeout') || status === 504) return { kind: 'timeout', message, status: status ?? 504 }
  if (m.includes('failed to fetch') || m.includes('networkerror')) return { kind: 'network', message }
  if ((status ?? 0) >= 500) return { kind: 'server', message, status: status ?? 500 }
  return { kind: 'unknown', message, status: status ?? undefined }
}

function isRetryable(err: GenError): boolean {
  return err.kind === 'network' || err.kind === 'timeout' || err.kind === 'server'
}

// ── Hook ────────────────────────────────────────────────────────────────────
export function useTripGeneration(options: UseTripGenerationOptions = {}): UseTripGeneration {
  const {
    locale = 'es',
    asyncThreshold = ASYNC_THRESHOLD_DEFAULT,
    authHeader = null,
    onPaywall,
    onAuthRedirect,
  } = options

  const [phase,    setPhase]    = useState<Phase>('idle')
  const [progress, setProgress] = useState(0)
  const [message,  setMessage]  = useState('')
  const [stage,    setStage]    = useState<Tier | null>(null)
  const [result,   setResult]   = useState<GenResult | null>(null)
  const [error,    setError]    = useState<GenError | null>(null)

  // Refs that don't trigger re-render
  const startedAtRef    = useRef(0)
  const phaseEnteredRef = useRef(0)
  const expectedMsRef   = useRef(SYNC_EXPECTED_MS)
  const chunksTotalRef  = useRef(1)
  const chunksDoneRef   = useRef(0)
  const pendingResultRef = useRef<GenResult | null>(null)
  const payloadRef      = useRef<GenPayload | null>(null)
  const abortRef        = useRef<AbortController | null>(null)
  const pollTimerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const tickTimerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const phaseTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const slotsRef        = useRef<MessageSlots>({})
  const retriedRef      = useRef(false)
  const cancelledRef    = useRef(false)

  // Message state
  const tierRef         = useRef<Tier>('understanding')
  const queueRef        = useRef<string[]>([])
  const queueIdxRef     = useRef(0)
  const cycleCountRef   = useRef(1)
  const lastShownRef    = useRef<string | null>(null)

  const clearAllTimers = useCallback(() => {
    if (pollTimerRef.current)    { clearInterval(pollTimerRef.current);    pollTimerRef.current = null }
    if (tickTimerRef.current)    { clearInterval(tickTimerRef.current);    tickTimerRef.current = null }
    if (phaseTimerRef.current)   { clearTimeout(phaseTimerRef.current);    phaseTimerRef.current = null }
    if (messageTimerRef.current) { clearTimeout(messageTimerRef.current);  messageTimerRef.current = null }
  }, [])

  const cancel = useCallback(() => {
    cancelledRef.current = true
    abortRef.current?.abort()
    clearAllTimers()
    setPhase('idle')
  }, [clearAllTimers])

  // Cleanup on unmount
  useEffect(() => () => {
    cancelledRef.current = true
    abortRef.current?.abort()
    clearAllTimers()
  }, [clearAllTimers])

  // ── Messages ────────────────────────────────────────────────────────────
  const rotateMessage = useCallback(() => {
    const tier = tierRef.current
    let queue = queueRef.current
    let idx   = queueIdxRef.current

    if (queue.length === 0 || idx >= queue.length) {
      // Exhausted — reshuffle, bump cycle count
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

    // Schedule next
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
    // Immediately show a fresh message from the new tier; then the hold.
    rotateMessage()
  }, [rotateMessage])

  // ── Progress source ─────────────────────────────────────────────────────
  const recomputeProgress = useCallback(() => {
    if (cancelledRef.current) return
    const elapsed      = Date.now() - startedAtRef.current
    const timeFloor    = Math.min(0.85, elapsed / expectedMsRef.current)
    const signalCeil   = chunksTotalRef.current > 0
      ? Math.min(0.95, (chunksDoneRef.current / chunksTotalRef.current) * 0.95)
      : 0
    const target       = Math.max(timeFloor, signalCeil)

    setProgress(prev => {
      const next = Math.max(prev, Math.min(0.95, target))
      // Drive tier based on progress
      const nextStage = stageFromProgress(next)
      if (nextStage !== tierRef.current) {
        // Queue tier switch on next tick (avoid mid-render state change)
        queueMicrotask(() => switchTier(nextStage))
      }
      return next
    })
  }, [switchTier])

  const startTicker = useCallback(() => {
    if (tickTimerRef.current) return
    tickTimerRef.current = setInterval(recomputeProgress, CLIENT_TICK_MS)
  }, [recomputeProgress])

  // ── Phase transitions ───────────────────────────────────────────────────
  const enterPhase = useCallback((next: Phase) => {
    setPhase(next)
    phaseEnteredRef.current = Date.now()
  }, [])

  const toFinalizing = useCallback(() => {
    enterPhase('finalizing')
    setProgress(1)
    // Hold for min; extend up to max if TOTAL_MIN not reached
    const elapsed = Date.now() - startedAtRef.current
    const needed  = TOTAL_MIN_MS - elapsed
    const hold    = Math.min(FINALIZING_MAX_MS, Math.max(FINALIZING_MIN_MS, needed))
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
    phaseTimerRef.current = setTimeout(() => {
      if (cancelledRef.current) return
      clearAllTimers()
      const final = pendingResultRef.current
      if (final) {
        setResult(final)
        enterPhase('ready')
      }
    }, hold)
  }, [clearAllTimers, enterPhase])

  const toComposing = useCallback(() => {
    enterPhase('composing')
  }, [enterPhase])

  const tryAdvanceFromWarming = useCallback(() => {
    if (cancelledRef.current) return
    // Move to composing once WARMING_MIN_MS has elapsed
    const warmElapsed = Date.now() - phaseEnteredRef.current
    if (warmElapsed >= WARMING_MIN_MS) {
      toComposing()
    } else {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
      phaseTimerRef.current = setTimeout(toComposing, WARMING_MIN_MS - warmElapsed)
    }
  }, [toComposing])

  const tryAdvanceFromComposing = useCallback(() => {
    if (cancelledRef.current) return
    const composeElapsed = Date.now() - phaseEnteredRef.current
    if (composeElapsed >= COMPOSING_MIN_MS) {
      toFinalizing()
    } else {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
      phaseTimerRef.current = setTimeout(toFinalizing, COMPOSING_MIN_MS - composeElapsed)
    }
  }, [toFinalizing])

  // ── Completion path: server responded with full trip ─────────────────────
  const handleServerComplete = useCallback((tripData: Record<string, unknown>, tripId: string | null) => {
    pendingResultRef.current = { tripData, tripId }

    // Where we are in the phase machine decides what to do:
    //   initiating → hold in warming for the min, then finalize
    //   warming    → wait warming min, then finalize
    //   composing  → wait composing min, then finalize
    //   finalizing/ready → already headed out; no-op
    // In all cases we never short-circuit to READY — the phase timers run.

    if (phase === 'initiating' || phase === 'warming') {
      // Make sure we at least enter composing so user sees a compose beat
      enterPhase('warming')
      phaseEnteredRef.current = Date.now()
      // After warming min, into composing, then finalize.
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
      phaseTimerRef.current = setTimeout(() => {
        if (cancelledRef.current) return
        toComposing()
        if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
        phaseTimerRef.current = setTimeout(toFinalizing, COMPOSING_MIN_MS)
      }, WARMING_MIN_MS)
    } else if (phase === 'composing') {
      tryAdvanceFromComposing()
    }
    // finalizing / ready / idle: leave it to existing timers
  }, [phase, enterPhase, toComposing, toFinalizing, tryAdvanceFromComposing])

  // ── Failure path ─────────────────────────────────────────────────────────
  const fail = useCallback((e: GenError) => {
    if (cancelledRef.current) return
    clearAllTimers()
    setError(e)
    setPhase('failed')
    if (e.kind === 'paywall' && onPaywall) onPaywall()
    if (e.kind === 'auth'    && onAuthRedirect) onAuthRedirect()
  }, [clearAllTimers, onPaywall, onAuthRedirect])

  // ── Sync path ───────────────────────────────────────────────────────────
  const runSync = useCallback(async (payload: GenPayload) => {
    expectedMsRef.current = SYNC_EXPECTED_MS
    chunksTotalRef.current = 1
    chunksDoneRef.current = 0

    const doFetch = async (): Promise<{ ok: true; tripData: Record<string, unknown> } | { ok: false; err: GenError }> => {
      const ctrl = new AbortController()
      abortRef.current = ctrl
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (authHeader) headers.Authorization = authHeader
      let res: Response
      try {
        res = await fetch('/api/generate-trip', {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify(payload),
          signal: ctrl.signal,
        })
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        return { ok: false, err: classifyError(null, msg) }
      }
      const text = await res.text()
      let data: any = null
      try { data = JSON.parse(text) } catch { /* non-json */ }
      if (!res.ok) {
        const msg = (data && typeof data.message === 'string') ? data.message : `HTTP ${res.status}`
        return { ok: false, err: classifyError(res.status, msg) }
      }
      const tripData = data?.trip_data ?? data
      if (!tripData || typeof tripData !== 'object') {
        return { ok: false, err: classifyError(502, 'missing trip_data') }
      }
      return { ok: true, tripData }
    }

    // First attempt + up to one silent retry for transient classes.
    // Kept in a single expression so the final outcome is `const` and TS
    // narrows the discriminated union correctly below.
    const outcome = await (async () => {
      const first = await doFetch()
      if (first.ok) return first
      // 'err' in narrowing: works under strict:false
      const firstErr: GenError = first.ok ? ({ kind: 'unknown', message: '' } as GenError) : (first as { ok: false; err: GenError }).err
      if (!isRetryable(firstErr) || retriedRef.current) return first
      retriedRef.current = true
      const retryStart = Date.now()
      const retry = await Promise.race([
        doFetch(),
        new Promise<{ ok: false; err: GenError }>(resolve =>
          setTimeout(() => resolve({ ok: false, err: { kind: 'timeout', message: 'silent retry budget exceeded' } }), SILENT_RETRY_BUDGET)
        ),
      ])
      if (retry.ok) return retry
      return Date.now() - retryStart >= SILENT_RETRY_BUDGET ? first : retry
    })()

    if (cancelledRef.current) return

    if ('err' in outcome) {
      fail(outcome.err)
      return
    }

    handleServerComplete(outcome.tripData, null)
  }, [authHeader, fail, handleServerComplete])

  // ── Async path ──────────────────────────────────────────────────────────
  const runAsync = useCallback(async (payload: GenPayload) => {
    expectedMsRef.current = ASYNC_EXPECTED_MS

    const createJob = async (): Promise<{ ok: true; jobId: string; chunksTotal: number } | { ok: false; err: GenError }> => {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (authHeader) headers.Authorization = authHeader
      let res: Response
      try {
        res = await fetch('/api/trips/jobs', {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify(payload),
        })
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        return { ok: false, err: classifyError(null, msg) }
      }
      const text = await res.text()
      let data: any = null
      try { data = JSON.parse(text) } catch { /* ignore */ }
      if (!res.ok) {
        const msg = (data && typeof data.message === 'string') ? data.message : `HTTP ${res.status}`
        return { ok: false, err: classifyError(res.status, msg) }
      }
      const jobId = data?.jobId
      const chunksTotal = Number(data?.chunksTotal) || payload.duration_days
      if (!jobId) return { ok: false, err: classifyError(502, 'missing jobId') }
      return { ok: true, jobId, chunksTotal }
    }

    const createOutcome = await (async () => {
      const first = await createJob()
      if (first.ok) return first
      const firstErr: GenError = (first as { ok: false; err: GenError }).err
      if (!isRetryable(firstErr) || retriedRef.current) return first
      retriedRef.current = true
      return await createJob()
    })()

    if (cancelledRef.current) return
    if ('err' in createOutcome) { fail(createOutcome.err); return }

    const jobId = createOutcome.jobId
    chunksTotalRef.current = createOutcome.chunksTotal
    chunksDoneRef.current = 0

    // Begin polling
    const poll = async () => {
      if (cancelledRef.current) return
      // Hard timeout
      if (Date.now() - startedAtRef.current > HARD_TIMEOUT_MS) {
        fail({ kind: 'timeout', message: 'generation timed out' })
        return
      }
      try {
        const headers: Record<string, string> = {}
        if (authHeader) headers.Authorization = authHeader
        const res = await fetch(`/api/trips/jobs/${jobId}`, { headers, credentials: 'include' })
        const data = await res.json().catch(() => null)
        if (!res.ok) {
          // Transient poll errors don't fail the job on their own; the next tick retries.
          console.warn('[useTripGeneration] poll non-ok', res.status)
          return
        }
        chunksTotalRef.current = Number(data?.chunksTotal) || chunksTotalRef.current
        chunksDoneRef.current  = Number(data?.chunksDone)  || 0

        if (data?.status === 'completed' && data?.trip_data) {
          clearAllTimers()
          handleServerComplete(data.trip_data, data.tripId ?? null)
          return
        }
        if (data?.status === 'failed') {
          const msg = typeof data.error === 'string' ? data.error : 'generation failed'
          fail({ kind: 'server', message: msg, status: 500 })
          return
        }
        // Still queued/running — advance from warming on first signal
        if (phaseRef.current === 'warming' && chunksDoneRef.current >= 1) {
          tryAdvanceFromWarming()
        }
      } catch (e) {
        console.warn('[useTripGeneration] poll error', e)
      }
    }

    pollTimerRef.current = setInterval(poll, POLL_INTERVAL_MS)
    // Kick off an immediate first poll too, but not before a short delay to
    // give the worker time to start
    setTimeout(poll, 1_000)
  }, [authHeader, clearAllTimers, fail, handleServerComplete, tryAdvanceFromWarming])

  // phase ref mirror (poll closure needs freshest phase)
  const phaseRef = useRef<Phase>('idle')
  useEffect(() => { phaseRef.current = phase }, [phase])

  // ── start / retry ───────────────────────────────────────────────────────
  const start = useCallback((payload: GenPayload) => {
    // Reset everything
    clearAllTimers()
    abortRef.current?.abort()
    cancelledRef.current = false
    retriedRef.current   = false
    pendingResultRef.current = null
    payloadRef.current   = payload
    slotsRef.current     = {
      destination:  payload.destination ?? null,
      durationDays: payload.duration_days,
      travelers:    payload.traveler ?? null,
    }
    chunksDoneRef.current = 0
    chunksTotalRef.current = Math.max(1, payload.duration_days || 1)
    startedAtRef.current = Date.now()
    phaseEnteredRef.current = Date.now()

    setProgress(0)
    setResult(null)
    setError(null)

    // Tier/message init
    tierRef.current = 'understanding'
    queueRef.current = []
    queueIdxRef.current = 0
    cycleCountRef.current = 1
    lastShownRef.current = null
    setStage('understanding')
    rotateMessage()

    // Ticker
    startTicker()

    // Enter INITIATING; after min, move to WARMING
    enterPhase('initiating')
    phaseTimerRef.current = setTimeout(() => {
      if (cancelledRef.current) return
      enterPhase('warming')
      // Warming ends either on first signal (async) or on sync response landing.
      // Set a minimum-hold fallback that advances to composing regardless.
      phaseTimerRef.current = setTimeout(tryAdvanceFromWarming, WARMING_MIN_MS + 200)
    }, INITIATING_MIN_MS)

    // Kick the actual work
    const useAsync = (payload.duration_days ?? 0) > asyncThreshold
    if (useAsync) runAsync(payload).catch(e => fail(classifyError(null, String(e))))
    else          runSync(payload).catch(e => fail(classifyError(null, String(e))))
  }, [
    asyncThreshold, clearAllTimers, enterPhase, fail, rotateMessage, runAsync, runSync,
    startTicker, tryAdvanceFromWarming,
  ])

  const retry = useCallback(() => {
    if (!payloadRef.current) return
    retriedRef.current = false
    start(payloadRef.current)
  }, [start])

  return {
    phase,
    progress,
    message,
    stage,
    result,
    error,
    start,
    retry,
    cancel,
  }
}
