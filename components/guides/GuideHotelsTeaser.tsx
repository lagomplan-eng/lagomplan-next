/**
 * components/guides/GuideHotelsTeaser.tsx
 *
 * "Where to stay" section rendered after the itinerary.
 * Replaces the old sticky sidebar. Shows booking provider cards (Booking.com, Hotels.com)
 * with destination pre-filled in the search URL.
 */

import type { Locale } from '../../i18n'

interface Props {
  destination: string
  locale:      Locale
}

export function GuideHotelsTeaser({ destination, locale }: Props) {
  const isES = locale === 'es'
  const q    = encodeURIComponent(destination)

  const providers = [
    {
      name:  'Booking.com',
      desc:  isES ? 'Cancelación gratis en la mayoría de propiedades.' : 'Free cancellation on most properties.',
      url:   `https://www.booking.com/search.html?ss=${q}`,
      bg:    '#F0F4FF',
      color: '#003580',
      badge: 'book\ning',
    },
    {
      name:  'Hotels.com',
      desc:  isES ? 'Mayor selección. Precio garantizado.' : 'Largest selection. Best price guarantee.',
      url:   `https://www.hotels.com/search/properties?q=${q}`,
      bg:    '#EBF4FF',
      color: '#004A96',
      badge: 'hotels\n.com',
    },
  ]

  return (
    <section id="hoteles" className="py-10 border-t border-[#E4DFD8]" style={{ background: '#FAF8F5' }}>
      <div className="max-w-[900px] mx-auto px-7">

        <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mb-1">
          {isES ? `Hoteles en ${destination}` : `Hotels in ${destination}`}
        </div>
        <h2
          className="font-sans font-bold text-[#0F3A33] tracking-[-0.5px] mb-5"
          style={{ fontSize: 'clamp(18px, 2.4vw, 22px)' }}
        >
          {isES ? 'Dónde quedarse' : 'Where to stay'}
        </h2>

        <div className="flex flex-wrap gap-3">
          {providers.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white border border-[#E4DFD8] rounded-[12px] px-4 py-3.5 hover:shadow-[0_2px_8px_rgba(15,58,51,.09)] hover:-translate-y-px transition-all group flex-1 min-w-[200px] max-w-[280px]"
            >
              {/* Provider logo pill */}
              <div
                className="w-9 h-9 rounded-[7px] flex items-center justify-center text-center flex-shrink-0 font-bold whitespace-pre-line leading-tight"
                style={{ background: p.bg, color: p.color, fontSize: '8px' }}
              >
                {p.badge}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="font-sans text-[13px] font-semibold text-[#0F3A33] mb-0.5">
                  {p.name}
                </div>
                <div className="font-sans text-[11px] text-[#7A7A76] leading-[1.4]">
                  {p.desc}
                </div>
              </div>

              <span className="text-[#B8B5AF] group-hover:text-[#0F3A33] transition-colors text-[12px] flex-shrink-0">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
