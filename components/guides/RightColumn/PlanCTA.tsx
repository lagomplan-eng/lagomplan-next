/**
 * components/guides/RightColumn/PlanCTA.tsx
 *
 * Pine-background conversion module — the "convert this guide to a trip" CTA.
 * Placed after Tips so the user sees value before the ask.
 */

import type { PlanCtaSection } from '../../../lib/data/guides/types'
import { Button, CardTitle, Eyebrow, InfoCard } from '../../design'

interface Props {
  data: PlanCtaSection
  plannerHref: string
}

export function PlanCTA({ data, plannerHref }: Props) {
  return (
    <InfoCard tone="pine" size="flush" data-guide="plan-cta">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cream/15 px-5 py-4">
        <div>
          <Eyebrow as="div" className="!mb-1 !text-cream/60">
            {data.eyebrow}
          </Eyebrow>
          <CardTitle as="div" className="!text-[20px] !leading-[1.2] !text-white">
            {data.title}
          </CardTitle>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-5 pt-4">
        <p className="m-0 mb-4 text-small text-cream/80">
          {data.description}
        </p>
        <Button href={plannerHref} variant="inverse" fullWidth>
          {data.buttonText}
        </Button>
      </div>
    </InfoCard>
  )
}
