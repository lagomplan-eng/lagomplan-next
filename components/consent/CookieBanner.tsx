'use client'

/**
 * components/consent/CookieBanner.tsx
 *
 * First-layer consent notice. Appears on first visit before any
 * non-essential cookie fires. All three buttons carry equal visual weight
 * — "Reject all" is identical in size to "Accept all" (EDPB requirement).
 */

type Props = {
  onAcceptAll: () => void
  onRejectAll: () => void
  onCustomize: () => void
}

export function CookieBanner({ onAcceptAll, onRejectAll, onCustomize }: Props) {
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-[rgba(200,191,181,.4)] bg-white"
      style={{ boxShadow: '0 -4px 24px rgba(15,58,51,0.08)' }}
    >
      <div className="max-w-7xl mx-auto px-5 py-5 sm:px-8 sm:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Copy */}
          <div className="flex-1 min-w-0">
            <p className="font-sans text-[13px] font-semibold text-[#0F3A33] mb-1">
              We use cookies — here's exactly why
            </p>
            <p className="font-sans text-[12px] text-[#6B8F86] leading-[1.6] max-w-2xl">
              We use cookies for analytics and for affiliate tracking — when you click or
              book through our travel recommendations (which may generate a commission for
              us). Some cookies are always on. The rest only activate with your consent.{' '}
              <a
                href="/cookies"
                className="underline hover:text-[#0F3A33] transition-colors"
              >
                Cookie policy
              </a>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:shrink-0">
            <button
              onClick={onRejectAll}
              className="font-sans text-[12px] font-semibold text-[#0F3A33] bg-transparent border border-[rgba(200,191,181,.8)] rounded-full px-5 py-2.5 hover:bg-[#F7F4EF] transition-colors cursor-pointer whitespace-nowrap"
            >
              Reject all
            </button>

            <button
              onClick={onCustomize}
              className="font-sans text-[12px] font-semibold text-[#0F3A33] bg-transparent border border-[rgba(200,191,181,.8)] rounded-full px-5 py-2.5 hover:bg-[#F7F4EF] transition-colors cursor-pointer whitespace-nowrap"
            >
              Customize
            </button>

            <button
              onClick={onAcceptAll}
              className="font-sans text-[12px] font-semibold text-white bg-[#0F3A33] border border-[#0F3A33] rounded-full px-5 py-2.5 hover:bg-[#1a4d44] transition-colors cursor-pointer whitespace-nowrap"
            >
              Accept all
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
