'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { usePlan } from './PlanProvider'

type Phase = 'confirming' | 'syncing'

export function PaymentPendingOverlay({
  sessionId,
  onCredited,
}: {
  sessionId: string
  onCredited: () => void
}) {
  const { confirmPurchase } = usePlan()
  const [phase, setPhase] = useState<Phase>('confirming')
  const started = useRef(false)
  const isES = useLocale() !== 'en'

  async function run() {
    setPhase('confirming')
    const result = await confirmPurchase(sessionId, 10_000)
    if (result === 'credited') onCredited()
    else setPhase('syncing')
  }

  useEffect(() => {
    if (started.current) return
    started.current = true
    run()
    // run is stable for this mount; onCredited/confirmPurchase identity changes
    // don't require a re-poll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-[420px] bg-white rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,.18)] p-8 text-center">
        {phase === 'confirming' ? (
          <>
            <div className="text-[40px] mb-3">⏳</div>
            <h2 className="font-display text-[22px] font-semibold text-[#0F3A33]">
              {isES ? 'Confirmando tu pago…' : 'Confirming your payment…'}
            </h2>
            <p className="font-sans text-[13px] text-[#35584F] mt-2">
              {isES ? 'Esto normalmente toma un par de segundos.' : 'This usually takes a couple of seconds.'}
            </p>
          </>
        ) : (
          <>
            <div className="text-[40px] mb-3">📡</div>
            <h2 className="font-display text-[22px] font-semibold text-[#0F3A33]">
              {isES ? 'Tu pago fue recibido, estamos sincronizando' : 'Payment received, syncing'}
            </h2>
            <p className="font-sans text-[13px] text-[#35584F] mt-2 mb-5">
              {isES
                ? 'Si esto tarda más de unos segundos, actualiza para reintentar.'
                : 'If this takes more than a few seconds, hit refresh to retry.'}
            </p>
            <button
              onClick={run}
              className="font-sans text-[13px] font-semibold bg-[#0F3A33] text-white px-5 py-2.5 rounded-md hover:bg-[#12453d]"
            >
              {isES ? 'Actualizar' : 'Refresh'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
