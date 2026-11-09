/**
 * components/catalog/ResultsBar.tsx
 *
 * Count (+ order label) on the first line, trust text with an info icon on the
 * second. Replaces the old section heading and the trust box: there is no second
 * heading above the cards.
 */

interface Props {
  count: string
  orderLabel?: string
  trustText: string
}

export default function ResultsBar({ count, orderLabel, trustText }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <p aria-live="polite" className="m-0 text-[17px] font-bold text-pine">{count}</p>
        {orderLabel && <p className="m-0 text-[14px] text-ink-2">{orderLabel}</p>}
      </div>
      <p className="m-0 flex items-start gap-2 text-[14px] leading-[1.5] text-ink-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-px flex-none text-label">
          <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
        </svg>
        <span>{trustText}</span>
      </p>
    </div>
  )
}
