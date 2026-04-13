/**
 * components/guides/HotelsSection.tsx
 *
 * Curated hotels list. Each card has an inline booking CTA and
 * optional affiliate URL appended via withRef().
 */

import type { HotelsSection as HotelsSectionData } from '../../lib/data/guides/types'
import { withRef } from '../../lib/affiliate'

interface Props {
  data: HotelsSectionData
  onToast?: (msg: string) => void
  locale: string
}

const BOOK_LABEL: Record<string, string> = {
  es: 'Ver en Booking →',
  en: 'See on Booking →',
}
const MORE_LABEL: Record<string, string> = {
  es: 'Más info',
  en: 'More info',
}

export function HotelsSection({ data, onToast, locale }: Props) {
  const bookLabel = BOOK_LABEL[locale] ?? BOOK_LABEL.es
  const moreLabel = MORE_LABEL[locale] ?? MORE_LABEL.es

  return (
    <div className="mb-14">
      {/* Section header */}
      <div className="mb-6">
        <div className="font-mono text-[10px] font-medium tracking-[.12em] uppercase text-[#8A8A8A] mb-1.5">
          {data.eyebrow}
        </div>
        <div className="font-display text-[22px] font-normal tracking-[-0.01em] text-[#1A1A1A]">
          {data.title}
        </div>
        {data.description && (
          <div className="text-[13px] font-light text-[#4A4A4A] leading-[1.6] mt-1.5">
            {data.description}
          </div>
        )}
      </div>

      {/* Hotel cards */}
      <div className="flex flex-col gap-4">
        {data.items.map((hotel) => (
          <div
            key={hotel.number}
            className="bg-white border border-[#E2DDD5] rounded-2xl p-6 shadow-[0_1px_3px_rgba(15,58,51,.06)] grid grid-cols-[1fr_auto] gap-4 items-start transition-all hover:shadow-[0_4px_16px_rgba(15,58,51,.08)] hover:border-[rgba(15,58,51,.15)] max-[640px]:grid-cols-1"
          >
            {/* Info */}
            <div>
              <div className="font-mono text-[10px] font-medium tracking-[.1em] text-[#BDBDBD] mb-2">
                {hotel.number}
              </div>
              <div className="text-[16px] font-medium text-[#1A1A1A] mb-1.5 leading-[1.3]">
                {hotel.name}
              </div>
              <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                <span className="font-mono text-[10px] text-[#8A8A8A] tracking-[.06em]">
                  {hotel.type}
                </span>
                <span className="font-mono text-[11px] font-medium text-[#0F3A33] bg-[rgba(15,58,51,.07)] px-2 py-[2px] rounded-full tracking-[.04em]">
                  {hotel.priceTier}
                </span>
              </div>
              <p className="text-[13px] font-light text-[#4A4A4A] leading-[1.6] mb-3">
                {hotel.description}
              </p>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#6B8F86] bg-[rgba(107,143,134,.08)] border border-[rgba(107,143,134,.25)] px-2.5 py-1 rounded-full tracking-[.04em]">
                <span className="text-[8px]">✦</span>
                {hotel.highlight}
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-2 flex-shrink-0 pt-[22px] max-[640px]:flex-row max-[640px]:pt-0">
              <a
                href={withRef(hotel.bookingUrl)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onToast?.('Abriendo Booking.com…')}
                className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[10px] font-medium tracking-[.08em] uppercase text-white bg-[#0F3A33] px-3.5 py-2 rounded-md transition-all hover:bg-[#2D6B5A] hover:-translate-y-px hover:shadow-[0_3px_10px_rgba(15,58,51,.25)]"
              >
                {bookLabel}
              </a>
              <button
                type="button"
                onClick={() => onToast?.('Pronto: reseñas detalladas')}
                className="font-mono text-[10px] font-medium tracking-[.06em] text-[#8A8A8A] px-2.5 py-1.5 border border-[#E2DDD5] rounded-md hover:text-[#0F3A33] hover:border-[#0F3A33] transition-all text-center"
              >
                {moreLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
