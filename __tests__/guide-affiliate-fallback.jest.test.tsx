/**
 * __tests__/guide-affiliate-fallback.jest.test.tsx
 *
 * Regression suite for the affiliate-link fallback added to
 * components/guides/HotelsSection.tsx and ExperiencesSection.tsx this
 * session. Before this change, a hotel/experience with no pre-resolved
 * `bookingUrl` rendered a fully-styled, clickable CTA that went nowhere
 * (lib/affiliate.withRef falls back to href="#" for a falsy url) — live on
 * 4 brand-new guides (100% of their links) and partially on ~15 pre-
 * existing ones. The fix: fall back to buildAffiliateLink(), a real,
 * Stay22-tracked, city-scoped search link, instead of withRef's dead '#'.
 *
 * This suite asserts, against the real (unmocked) buildAffiliateLink +
 * withRef implementations:
 *   - a populated bookingUrl still goes through withRef (ref=lagomplan
 *     appended, URL otherwise untouched)
 *   - an empty/undefined bookingUrl falls back to a real stay22.com/allez
 *     link scoped to the guide's destination, provider, locale and surface
 *   - href="#" is never rendered, under any bookingUrl state
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { HotelsSection } from '../components/guides/HotelsSection'
import { ExperiencesSection } from '../components/guides/ExperiencesSection'
import { buildAffiliateLink } from '../lib/affiliate'
import type { HotelsSection as HotelsSectionData, ExperiencesSection as ExperiencesSectionData } from '../lib/data/guides/types'

function hotelsData(bookingUrl: string | undefined): HotelsSectionData {
  return {
    eyebrow: 'Dónde quedarse',
    title: 'Hoteles',
    description: '',
    items: [
      {
        number: '01',
        name: 'Casa Monti Roma',
        type: 'Hotel boutique',
        priceTier: '$$$',
        description: 'A boutique hotel.',
        highlight: 'Favorito de las parejas',
        bookingUrl,
      },
    ],
  }
}

function experiencesData(bookingUrl: string | undefined): ExperiencesSectionData {
  return {
    eyebrow: 'Qué hacer',
    title: 'Experiencias',
    description: '',
    items: [
      {
        number: '01',
        name: 'Clase de pasta en Trastevere',
        description: 'Three hours in the alleys.',
        tags: ['Gastronomía'],
        bookingUrl,
        bookingLabel: 'Reservar →',
      },
    ],
  }
}

describe('HotelsSection affiliate link fallback', () => {
  it('uses withRef(bookingUrl) when a real bookingUrl is present', () => {
    render(<HotelsSection data={hotelsData('https://www.booking.com/hotel/it/casa-monti-roma-roma.html')} locale="es" destination="Roma" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://www.booking.com/hotel/it/casa-monti-roma-roma.html?ref=lagomplan')
  })

  it('falls back to buildAffiliateLink("booking", ...) when bookingUrl is empty', () => {
    render(<HotelsSection data={hotelsData('')} locale="es" destination="Roma" />)
    const link = screen.getByRole('link')
    const expected = buildAffiliateLink('booking', { city: 'Roma', locale: 'es', surface: 'guide' })
    expect(link).toHaveAttribute('href', expected)
    expect(link.getAttribute('href')).toContain('stay22.com/allez/booking')
    expect(link.getAttribute('href')).toContain('aid=lagomplan')
  })

  it('falls back to buildAffiliateLink("booking", ...) when bookingUrl is undefined', () => {
    render(<HotelsSection data={hotelsData(undefined)} locale="en" destination="Mauritius" />)
    const link = screen.getByRole('link')
    const expected = buildAffiliateLink('booking', { city: 'Mauritius', locale: 'en', surface: 'guide' })
    expect(link).toHaveAttribute('href', expected)
  })

  it('never renders href="#", with or without a bookingUrl', () => {
    const { rerender } = render(<HotelsSection data={hotelsData(undefined)} locale="es" destination="Roma" />)
    expect(screen.getByRole('link')).not.toHaveAttribute('href', '#')
    rerender(<HotelsSection data={hotelsData('https://www.booking.com/x')} locale="es" destination="Roma" />)
    expect(screen.getByRole('link')).not.toHaveAttribute('href', '#')
  })

  it('threads locale into the fallback campaign (es vs en)', () => {
    render(<HotelsSection data={hotelsData(undefined)} locale="en" destination="Udaipur" />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toContain('campaign=lagomplan-guide-en')
  })
})

describe('ExperiencesSection affiliate link fallback', () => {
  it('uses withRef(bookingUrl) when a real bookingUrl is present', () => {
    render(<ExperiencesSection data={experiencesData('https://www.getyourguide.com/rome-l33/some-tour/')} locale="es" destination="Roma" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://www.getyourguide.com/rome-l33/some-tour/?ref=lagomplan')
  })

  it('falls back to buildAffiliateLink("getyourguide", ...) when bookingUrl is empty', () => {
    render(<ExperiencesSection data={experiencesData('')} locale="es" destination="Uruguay" />)
    const link = screen.getByRole('link')
    const expected = buildAffiliateLink('getyourguide', { city: 'Uruguay', locale: 'es', surface: 'guide' })
    expect(link).toHaveAttribute('href', expected)
    expect(link.getAttribute('href')).toContain('stay22.com/allez/getyourguide')
  })

  it('uses the "getyourguide" provider for the fallback, not "booking" (hotels vs. experiences must not cross-wire)', () => {
    render(<ExperiencesSection data={experiencesData(undefined)} locale="es" destination="Cancún" />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toContain('/allez/getyourguide')
    expect(link.getAttribute('href')).not.toContain('/allez/booking')
  })

  it('never renders href="#", with or without a bookingUrl', () => {
    const { rerender } = render(<ExperiencesSection data={experiencesData(undefined)} locale="es" destination="Roma" />)
    expect(screen.getByRole('link')).not.toHaveAttribute('href', '#')
    rerender(<ExperiencesSection data={experiencesData('https://www.getyourguide.com/x')} locale="es" destination="Roma" />)
    expect(screen.getByRole('link')).not.toHaveAttribute('href', '#')
  })
})
