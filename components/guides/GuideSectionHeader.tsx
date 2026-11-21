/**
 * components/guides/GuideSectionHeader.tsx
 *
 * Header of the Itinerary / Hotels / Experiences sections: eyebrow, H2 and the optional description.
 * The data-section hooks are what the PDF (print) stylesheet styles.
 */

import { SectionTitle } from '../design'

export function GuideSectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-6">
      <SectionTitle
        eyebrow={eyebrow}
        eyebrowProps={{ 'data-section': 'eyebrow' } as object}
        titleProps={{ 'data-section': 'title' } as object}
      >
        {title}
      </SectionTitle>
      {description && <p className="m-0 mt-3 text-small text-ink-2">{description}</p>}
    </div>
  )
}
