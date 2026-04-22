/**
 * components/guides/ExperiencesSection.tsx
 *
 * Curated experiences list — single bordered container with inline items.
 * Each item has a booking action with affiliate URL.
 */

import type { ExperiencesSection as ExperiencesSectionData } from '../../lib/data/guides/types'
import { withRef } from '../../lib/affiliate'

interface Props {
  data: ExperiencesSectionData
  onToast?: (msg: string) => void
}

export function ExperiencesSection({ data, onToast }: Props) {
  return (
    <div data-guide="experiences" className="mb-14">
      {/* Section header */}
      <div className="mb-6">
        <div className="font-mono text-[10px] font-medium tracking-[.12em] uppercase text-[#8A8A8A] mb-1.5">
          {data.eyebrow}
        </div>
        <div className="font-sans text-[22px] font-semibold tracking-[-0.01em] text-[#0F3A33]">
          {data.title}
        </div>
        {data.description && (
          <div className="text-[13px] font-light text-[#4A4A4A] leading-[1.6] mt-1.5">
            {data.description}
          </div>
        )}
      </div>

      {/* Experience list */}
      <div data-exp="list" className="flex flex-col bg-white border border-[#E2DDD5] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,58,51,.06)]">
        {data.items.map((exp) => (
          <div
            key={exp.number}
            data-exp="item"
            className="grid grid-cols-[48px_1fr_auto] gap-4 items-start p-5 px-6 border-b border-[#E2DDD5] last:border-0 hover:bg-[rgba(15,58,51,.02)] transition-colors max-[640px]:grid-cols-[40px_1fr]"
          >
            {/* Number */}
            <div data-exp="number" className="font-mono text-[11px] font-medium text-[#BDBDBD] tracking-[.06em] pt-0.5">
              {exp.number}
            </div>

            {/* Content */}
            <div>
              <div data-exp="name" className="text-[15px] font-medium text-[#1A1A1A] mb-1.5 leading-[1.4]">
                {exp.name}
              </div>
              <p data-exp="description" className="text-[13px] font-light text-[#4A4A4A] leading-[1.6] mb-2.5">
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] tracking-[.04em] text-[#8A8A8A] bg-[#EDE7E1] px-2 py-[3px] rounded-full border border-[#E2DDD5]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="flex-shrink-0 pt-0.5 max-[640px]:hidden">
              <a
                href={withRef(exp.bookingUrl)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onToast?.('Abriendo reserva…')}
                className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[10px] font-medium tracking-[.08em] text-white bg-[#0F3A33] px-3 py-[7px] rounded-md transition-all hover:bg-[#2D6B5A] hover:-translate-y-px hover:shadow-[0_3px_10px_rgba(15,58,51,.2)]"
              >
                Reservar
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
