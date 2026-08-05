'use client'

import { events } from '../../lib/analytics/events'
import DestinationMap from './DestinationMap'

export default function ExampleCard({
  ctaId,
  title,
  body,
  ctaLabel,
  href,
  mapVariant,
}: {
  ctaId: string
  title: string
  body: string
  ctaLabel: string
  href: string
  mapVariant: 'a' | 'b' | 'c'
}) {
  return (
    <a
      href={href}
      onClick={() => events.ctaClick({ cta_id: ctaId, surface: 'examples_page' })}
      className="group overflow-hidden rounded-[22px] bg-white shadow-sm hover:shadow-md transition"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <DestinationMap variant={mapVariant} />
      </div>
      <div className="p-6">
        <h3 className="text-[20px] leading-tight tracking-[-0.02em] text-[#0F3A33] transition group-hover:text-[#2D6B57] [text-wrap:balance]">
          {title}
        </h3>
        <p className="mt-3 text-[14px] leading-7 text-[#35584F] [text-wrap:pretty]">
          {body}
        </p>
        <span className="mt-4 inline-flex text-[13px] font-medium text-[#0F3A33] group-hover:text-[#2D6B57] transition-colors">
          {ctaLabel}
        </span>
      </div>
    </a>
  )
}
