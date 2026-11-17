/**
 * __tests__/guide-gyg-links.jest.test.tsx
 *
 * Every getyourguide.com link rendered on a guide page carries our partner_id and
 * cmp=guia-<key>: tour pages AND search / location / category pages (the audit of
 * production found 7 "Reservar" links with only ?ref=lagomplan). Runs over the REAL
 * guide registry, both locales, through the real ExperiencesSection.
 *
 * Also guards against a getyourguide.com URL living in some other field of a guide
 * (hotels, itinerary, …) where this component would not rewrite it.
 */
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { ExperiencesSection } from '../components/guides/ExperiencesSection'
import { GYG_PARTNER_ID } from '../lib/affiliate/gyg'
import { getAllFlatGuides, getGuidePageData } from '../lib/data/guides'

const LOCALES = ['es', 'en'] as const

describe.each(LOCALES)('guide pages (%s): every GetYourGuide link is attributed', (locale) => {
  const guides = getAllFlatGuides(locale)

  it('the registry is not empty', () => {
    expect(guides.length).toBeGreaterThan(30)
  })

  it.each(guides.map(g => [g.canonical]))('%s: every getyourguide.com href has partner_id and cmp=guia-<key>', (canonical) => {
    const data = getGuidePageData(canonical, locale)!
    const { container } = render(<ExperiencesSection data={data.experiences} locale={locale} guideKey={canonical} />)
    const hrefs = Array.from(container.querySelectorAll('a'))
      .map(a => a.getAttribute('href') ?? '')
      .filter(h => /^https?:\/\/(www\.)?getyourguide\.com\//.test(h))
    for (const href of hrefs) {
      const u = new URL(href)
      expect(u.searchParams.getAll('partner_id')).toEqual([GYG_PARTNER_ID])
      expect(u.searchParams.getAll('cmp')).toEqual([`guia-${canonical}`])
    }
  })

  it('no getyourguide.com URL outside the experiences section (it would not be attributed)', () => {
    const offenders: string[] = []
    for (const { canonical, flat } of guides) {
      const { experiences, ...rest } = flat as unknown as Record<string, unknown>
      const found = JSON.stringify(rest).match(/https?:\/\/(?:www\.)?getyourguide\.com[^"\\]*/g) ?? []
      found.forEach(u => offenders.push(`${canonical}: ${u}`))
    }
    expect(offenders).toEqual([])
  })
})
