/**
 * components/guides/RightColumn/Tips.tsx
 *
 * Lagom Tips module — curated advice list + optional fun fact callout.
 * First module in the right column (builds trust before the CTA).
 */

import type { TipsSection } from '../../../lib/data/guides/types'
import { CardTitle, Eyebrow, InfoCard } from '../../design'

interface Props {
  data: TipsSection
}

export function Tips({ data }: Props) {
  return (
    <InfoCard size="flush" data-guide="tips">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
        <div>
          <Eyebrow as="div" className="!mb-1">
            {data.eyebrow}
          </Eyebrow>
          <CardTitle as="div" className="!text-[20px] !leading-[1.2]">
            {data.title}
          </CardTitle>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-5 pt-4">
        <div className="flex flex-col">
          {data.items.map((tip, i) => (
            <div
              key={i}
              data-tip="item"
              className="flex items-start gap-2.5 border-b border-line-soft py-3 text-small text-ink-2 last:border-0"
            >
              <span data-tip="bullet" className="mt-2 h-[5px] w-[5px] flex-shrink-0 rounded-full bg-sage" />
              {tip}
            </div>
          ))}
        </div>

        {/* Fun fact callout */}
        {data.funFact && (
          <InfoCard tone="mint" size="sm" data-tip="funfact" className="mt-3">
            <Eyebrow as="div" data-tip="funfact-eyebrow" className="!mb-1.5">
              {data.funFact.eyebrow}
            </Eyebrow>
            <p data-tip="funfact-text" className="m-0 italic">
              {data.funFact.text}
            </p>
          </InfoCard>
        )}
      </div>
    </InfoCard>
  )
}
