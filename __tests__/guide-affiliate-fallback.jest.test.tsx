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
 * UPDATE (Experiencias hub, phase 2): ExperiencesSection no longer has the
 * Stay22 city-search fallback — an experience with no link renders no
 * button — and GYG tour URLs go direct via buildGygBookingUrl. The
 * ExperiencesSection tests below reflect that; the HotelsSection tests are
 * unchanged and still describe the original fallback.
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
import { GYG_PARTNER_ID } from '../lib/affiliate/gyg'
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
        id: 'clase-de-pasta-en-trastevere',
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

describe('ExperiencesSection links', () => {
  // Experiences no longer fall back to a Stay22 city-search link: no link means no button.
  // GYG tour URLs go direct with our partner ID + cmp=guia-<registryKey>.
  it('GYG tour URL → direct link with partner_id and cmp=guia-<key>, existing params and locale prefix stripped', () => {
    render(<ExperiencesSection data={experiencesData('https://www.getyourguide.com/es-mx/rome-l33/some-tour-t123/?ranking_uuid=abc')} locale="es" guideKey="roma" />)
    const link = screen.getByRole('link', { name: 'Reservar →' })
    expect(link).toHaveAttribute('href', `https://www.getyourguide.com/rome-l33/some-tour-t123/?partner_id=${GYG_PARTNER_ID}&cmp=guia-roma`)
  })

  it('cmp carries the registry key of the guide being rendered', () => {
    render(<ExperiencesSection data={experiencesData('https://www.getyourguide.com/rome-l33/some-tour-t123/')} locale="en" guideKey="ciudad-de-mexico" />)
    expect(screen.getByRole('link', { name: 'Reservar →' }).getAttribute('href')).toContain('cmp=guia-ciudad-de-mexico')
  })

  it('non-GYG link (OpenTable) still goes through withRef, unchanged', () => {
    render(<ExperiencesSection data={experiencesData('https://www.opentable.com/')} locale="es" guideKey="ciudad-de-mexico" />)
    expect(screen.getByRole('link', { name: 'Reservar →' })).toHaveAttribute('href', 'https://www.opentable.com/?ref=lagomplan')
  })

  it('a GYG page that is not a tour (search) is not rewritten', () => {
    render(<ExperiencesSection data={experiencesData('https://www.getyourguide.com/s/?q=Torres%20del%20Paine')} locale="es" guideKey="torres-del-paine" />)
    const href = screen.getByRole('link', { name: 'Reservar →' }).getAttribute('href')!
    expect(href).not.toContain('partner_id')
    expect(href).toBe('https://www.getyourguide.com/s/?q=Torres+del+Paine&ref=lagomplan')
  })

  it('empty bookingUrl → no link and no button (no Stay22 fallback)', () => {
    render(<ExperiencesSection data={experiencesData('')} locale="es" guideKey="uruguay" />)
    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.getByText('Clase de pasta en Trastevere')).toBeInTheDocument()
  })

  it('each item carries the exp-<id> anchor that the hub deep-links to', () => {
    const { container } = render(<ExperiencesSection data={experiencesData('')} locale="es" guideKey="roma" />)
    expect(container.querySelector('#exp-clase-de-pasta-en-trastevere')).not.toBeNull()
  })

  it('undefined bookingUrl → no link and no button', () => {
    render(<ExperiencesSection data={experiencesData(undefined)} locale="es" guideKey="uruguay" />)
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('never renders href="#" or a stay22 allez link, with or without a bookingUrl', () => {
    const { rerender, container } = render(<ExperiencesSection data={experiencesData(undefined)} locale="es" guideKey="roma" />)
    expect(container.innerHTML).not.toContain('href="#"')
    expect(container.innerHTML).not.toContain('stay22.com/allez')
    rerender(<ExperiencesSection data={experiencesData('https://www.getyourguide.com/x-t1/')} locale="es" guideKey="roma" />)
    expect(screen.getByRole('link', { name: 'Reservar →' })).not.toHaveAttribute('href', '#')
  })
})

describe('ExperiencesSection → hub link', () => {
  it('links to the hub filtered by this guide when it has a bookable GYG tour', () => {
    render(<ExperiencesSection data={experiencesData('https://www.getyourguide.com/rome-l33/some-tour-t123/')} locale="es" guideKey="roma" />)
    expect(screen.getByRole('link', { name: /Ver todas las experiencias para reservar/ })).toHaveAttribute('href', '/es/experiencias?destino=roma')
  })
  it('uses the English route in English', () => {
    render(<ExperiencesSection data={experiencesData('https://www.getyourguide.com/rome-l33/some-tour-t123/')} locale="en" guideKey="roma" />)
    expect(screen.getByRole('link', { name: /See all bookable experiences/ })).toHaveAttribute('href', '/en/experiences?destino=roma')
  })
  it('no link when nothing in the guide is bookable on the hub', () => {
    render(<ExperiencesSection data={experiencesData('https://www.opentable.com/')} locale="es" guideKey="roma" />)
    expect(screen.queryByRole('link', { name: /Ver todas las experiencias para reservar/ })).toBeNull()
  })
})
