/**
 * components/guides/ExperiencesSection.tsx
 *
 * Curated experiences list — single bordered container with inline items.
 * Each item with a link has a booking action; an item without one renders no
 * button (no invented fallback link).
 */

import type { ExperiencesSection as ExperiencesSectionData } from '../../lib/data/guides/types'
import { withRef } from '../../lib/affiliate'
import { isGygUrl, isGygTourUrl, buildGygBookingUrl } from '../../lib/affiliate/gyg'
import { getRoute } from '../../lib/routes'
import { Button, InfoCard, Tag } from '../design'
import { GuideSectionHeader } from './GuideSectionHeader'

interface Props {
  data: ExperiencesSectionData
  onToast?: (msg: string) => void
  locale: string
  /** Registry key of the guide (e.g. 'ciudad-de-mexico'); feeds the GYG cmp param `guia-<key>`. */
  guideKey: string
}

export function ExperiencesSection({ data, onToast, locale, guideKey }: Props) {
  /**
   * Every getyourguide.com link (tour, search, location) carries our partner ID + cmp;
   * any other link (OpenTable, venue sites) renders as before. No link → null → no button.
   */
  function expHref(bookingUrl: string | undefined): string | null {
    if (!bookingUrl) return null
    if (isGygUrl(bookingUrl)) return buildGygBookingUrl(bookingUrl, { cmp: `guia-${guideKey}` })
    return withRef(bookingUrl)
  }

  return (
    <div data-guide="experiences" className="mb-14">
      <GuideSectionHeader eyebrow={data.eyebrow} title={data.title} description={data.description} />

      {/* Experience list */}
      <InfoCard size="flush" data-exp="list">
        {data.items.map((exp) => {
          const href = expHref(exp.bookingUrl)
          return (
          <div
            key={exp.number}
            id={`exp-${exp.id}`}
            data-exp="item"
            className="scroll-mt-28 grid grid-cols-[48px_1fr_auto] items-start gap-4 border-b border-line-soft p-5 px-6 transition-colors last:border-0 hover:bg-sand/40 max-[640px]:grid-cols-[40px_1fr]"
          >
            {/* Number */}
            <div data-exp="number" className="pt-0.5 font-sans text-tiny font-bold text-label">
              {exp.number}
            </div>

            {/* Content */}
            <div>
              <div data-exp="name" className="mb-1.5 text-body font-semibold text-pine">
                {exp.name}
              </div>
              <p data-exp="description" className="m-0 mb-2.5 text-small text-ink-2">
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {exp.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>

            {/* Action — only when the experience has a link */}
            {href && (
              <div className="flex-shrink-0 pt-0.5 max-[640px]:hidden">
                <Button
                  size="sm"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onToast?.(locale === 'en' ? 'Opening booking…' : 'Abriendo reserva…')}
                >
                  {exp.bookingLabel}
                </Button>
              </div>
            )}
          </div>
          )
        })}
      </InfoCard>

      {/* Same bookable rule as the hub: only offer the link when the hub has something for this guide. */}
      {data.items.some(exp => isGygTourUrl(exp.bookingUrl ?? '')) && (
        <Button
          variant="ghost"
          href={`${getRoute(locale === 'en' ? 'en' : 'es', 'experiencesIndex')}?destino=${encodeURIComponent(guideKey)}`}
          className="mt-4"
        >
          {locale === 'en' ? 'See all bookable experiences →' : 'Ver todas las experiencias para reservar →'}
        </Button>
      )}
    </div>
  )
}
