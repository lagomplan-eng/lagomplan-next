/**
 * components/guides/HotelsSection.tsx
 *
 * Curated hotels list. Each card has an inline booking CTA and
 * optional affiliate URL appended via withRef().
 */

'use client'

import { useEffect, useRef } from 'react'
import type { HotelsSection as HotelsSectionData } from '../../lib/data/guides/types'
import { onLinkClickFirst } from '../../lib/analytics/capture-click'
import { trackHotelBook } from '../../lib/catalog-analytics'
import { hotelProviderFromUrl, slugifyHotelName } from '../../lib/hotels-catalog'
import { withRef, buildAffiliateLink } from '../../lib/affiliate'
import { Button, InfoCard, Tag } from '../design'
import { GuideSectionHeader } from './GuideSectionHeader'

interface Props {
  data: HotelsSectionData
  onToast?: (msg: string) => void
  locale: string
  /** City/destination name, used as the fallback search-link target when a hotel has no pre-resolved bookingUrl. */
  destination: string
  /** The guide's key (its slug), reported as destination_slug on the booking click. */
  guideKey: string
}

const BOOK_LABEL: Record<string, string> = {
  es: 'Reservar →',
  en: 'Book →',
}

export function HotelsSection({ data, onToast, locale, destination, guideKey }: Props) {
  const bookLabel = BOOK_LABEL[locale] ?? BOOK_LABEL.es
  const ctxLocale = locale === 'en' ? 'en' : 'es'

  function hotelHref(bookingUrl: string | undefined): string {
    if (bookingUrl) return withRef(bookingUrl)
    return buildAffiliateLink('booking', { city: destination, locale: ctxLocale, surface: 'guide' })
  }

  // Booking clicks are recorded in the capture phase on window, before Stay22's script (which takes over the
  // click on these links) can swallow them. Section guide_hotels; destination_slug = the guide key.
  const track = useRef({ data, locale, guideKey, hotelHref })
  track.current = { data, locale, guideKey, hotelHref }
  useEffect(() => onLinkClickFirst(
    t => t.closest('[data-hotel="book-link"]'),
    a => {
      const { data: d, locale: l, guideKey: key, hotelHref: href } = track.current
      const i = Number(a.getAttribute('data-hotel-index'))
      const hotel = d.items[i]
      if (!hotel) return
      const url = href(hotel.bookingUrl)
      trackHotelBook(
        { id: slugifyHotelName(hotel.name), bookingUrl: url, provider: hotelProviderFromUrl(url), destinationKey: key },
        i + 1, l === 'en' ? 'en' : 'es', 'guide_hotels',
      )
    },
  ), [])

  return (
    <div data-guide="hotels" className="mb-14">
      <GuideSectionHeader eyebrow={data.eyebrow} title={data.title} description={data.description} />

      {/* Hotel cards */}
      <div className="flex flex-col gap-4">
        {data.items.map((hotel, hotelIndex) => (
          <InfoCard key={hotel.number} data-hotel="card">
            <div className="grid grid-cols-[1fr_auto] items-start gap-4 max-[640px]:grid-cols-1">
              {/* Info */}
              <div>
                <div data-hotel="number" className="mb-2 font-sans text-tiny font-bold text-label">
                  {hotel.number}
                </div>
                <div className="mb-1.5 flex flex-wrap items-center gap-2 print:block print:leading-[1.3]">
                  <span data-hotel="name" className="text-body font-semibold text-pine">
                    {hotel.name}
                  </span>
                  <Tag data-hotel="price">{hotel.priceTier}</Tag>
                </div>
                <div className="mb-2.5 flex flex-wrap items-center gap-2">
                  <span data-hotel="type" className="text-tiny text-label">
                    {hotel.type}
                  </span>
                </div>
                <p data-hotel="description" className="m-0 mb-3 text-small text-ink-2">
                  {hotel.description}
                </p>
                {/* Highlight pill — hidden in print */}
                <Tag className="gap-1.5 print:hidden">
                  <span aria-hidden="true" className="text-[8px] text-sage">✦</span>
                  {hotel.highlight}
                </Tag>
              </div>

              {/* CTA — button styling hidden in print, link text shown as plain editorial ref */}
              <div className="flex flex-shrink-0 flex-col gap-2 pt-[22px] max-[640px]:flex-row max-[640px]:pt-0">
                <Button
                  size="sm"
                  data-hotel="book-link"
                  data-hotel-index={hotelIndex}
                  href={hotelHref(hotel.bookingUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onToast?.('Abriendo reserva…')}
                >
                  {bookLabel}
                </Button>
              </div>
            </div>
          </InfoCard>
        ))}
      </div>
    </div>
  )
}
