/**
 * components/guides/GuideSectionHeader.tsx
 *
 * Header of the Itinerary / Hotels / Experiences sections: eyebrow, H2 and the optional description.
 * The data-section hooks are what the PDF (print) stylesheet styles.
 */

import { SectionTitle } from '../design'

export function GuideSectionHeader({ eyebrow, title, description, plain }: { eyebrow: string; title: string; description?: string; plain?: boolean }) {
  // `plain`: the PDF has no section-header style for this one (Experiences): it prints as plain text.
  return (
    <div className="mb-6">
      <SectionTitle
        className="print:block"
        eyebrow={eyebrow}
        eyebrowProps={{ [plain ? 'data-pl' : 'data-section']: plain ? 'sec-eyebrow' : 'eyebrow' } as object}
        titleProps={{ [plain ? 'data-pl' : 'data-section']: plain ? 'sec-title' : 'title' } as object}
      >
        {title}
      </SectionTitle>
      {description && <p data-pl="section-desc" className="m-0 mt-3 text-small text-ink-2">{description}</p>}
    </div>
  )
}
