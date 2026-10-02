/**
 * __tests__/guide-alternate-locale-url.jest.test.tsx
 *
 * Regression test for the alternate-locale (language switcher) URL computed
 * by app/[locale]/guides/[slug]/page.tsx. Before this session it always
 * re-emitted the bare canonical slug for both locales, which is wrong for
 * any guide whose ES/EN slugs differ (Roma/Rome, Mauricio/Mauritius —
 * same bug class as kioto-osaka, see MEMORY
 * feedback_guide-slug-locale-naming). The fix reads the real per-locale
 * slug off the lib/guides.ts shadow entry instead.
 *
 * This lives in the Jest suite (not the framework-free tests/ convention)
 * because importing the page module pulls in the full client component
 * tree, including a CSS Module import (NewsletterSidebarCard.module.css)
 * that only Next's Jest transform (next/jest, see jest.config.js) knows
 * how to handle — plain `tsx` fails with "Unexpected token '.'".
 *
 * GuideDetailPage is an async Server Component with no request-scoped
 * dependencies (no cookies/headers/notFound on the success path), so it's
 * safe to invoke directly and inspect the returned element's props without
 * rendering through RTL.
 */
import GuideDetailPage from '../app/[locale]/guides/[slug]/page'

async function alternateLocaleUrlFor(locale: 'es' | 'en', slug: string): Promise<string | undefined> {
  const element = (await GuideDetailPage({ params: Promise.resolve({ locale, slug }) })) as unknown as {
    props?: { alternateLocaleUrl?: string }
  }
  return element?.props?.alternateLocaleUrl
}

describe('guide detail page alternate-locale URL', () => {
  it('/es/guias/roma -> alternate EN link points at /en/guides/rome (not /en/guides/roma)', async () => {
    expect(await alternateLocaleUrlFor('es', 'roma')).toBe('/en/guides/rome')
  })

  it('/en/guides/rome -> alternate ES link points at /es/guias/roma', async () => {
    expect(await alternateLocaleUrlFor('en', 'rome')).toBe('/es/guias/roma')
  })

  it('/es/guias/mauricio -> alternate EN link points at /en/guides/mauritius (not /en/guides/mauricio)', async () => {
    expect(await alternateLocaleUrlFor('es', 'mauricio')).toBe('/en/guides/mauritius')
  })

  it('/en/guides/mauritius -> alternate ES link points at /es/guias/mauricio', async () => {
    expect(await alternateLocaleUrlFor('en', 'mauritius')).toBe('/es/guias/mauricio')
  })

  it('same-slug guide (udaipur) keeps the same slug on both sides', async () => {
    expect(await alternateLocaleUrlFor('es', 'udaipur')).toBe('/en/guides/udaipur')
    expect(await alternateLocaleUrlFor('en', 'udaipur')).toBe('/es/guias/udaipur')
  })

  it('a guide with no shadow entry (oaxaca) falls back to the bare canonical slug correctly', async () => {
    expect(await alternateLocaleUrlFor('es', 'oaxaca')).toBe('/en/guides/oaxaca')
    expect(await alternateLocaleUrlFor('en', 'oaxaca')).toBe('/es/guias/oaxaca')
  })
})
