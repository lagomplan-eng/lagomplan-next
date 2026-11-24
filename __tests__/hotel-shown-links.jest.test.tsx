/**
 * Links SHOWN to a person use the readable address when the hotel has an alias (lib/hotels/aliases.ts) and the random code when
 * it has none: the approval email and "Copiar enlace" (and so "Reenviar correo", which sends the same email).
 * The QR, the "Send this guide to my phone" link, scan counting and the code rules are not touched.
 */
import fs from 'fs'
import path from 'path'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const sent: { to: string; subject: string; html: string; text: string }[] = []
jest.mock('resend', () => ({ Resend: class { emails = { send: async (m: { to: string; subject: string; html: string; text: string }) => { sent.push(m); return { error: null } } } } }))
jest.mock('next/navigation', () => ({ useRouter: () => ({ refresh: jest.fn() }) }))

import { sendApprovalEmail } from '../lib/hotels/emails'
import HotelsTable from '../app/admin/hoteles/HotelsTable'
import { aliasForCode, HOTEL_ALIASES } from '../lib/hotels/aliases'
import { hotelQrUrl, hotelShownCardUrl, hotelShownUrl } from '../lib/hotels/links'
import { hotelShareUrl } from '../content/guia/hotel/share'
import type { HotelRow } from '../lib/hotels/types'
import type { HotelWithStats } from '../lib/hotels/stats'

const WITH_ALIAS = 'tjc9ckzteq'   // Casa Cuenca: has an alias
const WITHOUT = 'mnqn9bc7sy'      // the test hotel: has none

const hotel = (code: string, over: Partial<HotelRow> = {}): HotelRow => ({
  id: `id-${code}`, code, hotel_name: code === WITH_ALIAS ? 'Casa Cuenca' : 'Hotel test 1', zone: 'condesa', requested_zone: null,
  contact_name: 'Ana', contact_email: 'ana@example.com', maps_url: null, status: 'approved', edition: 'free', lang: 'es', notes: null,
  email_opt_out: false, terms_accepted_at: '2026-11-01T00:00:00Z', created_at: '2026-11-01T00:00:00Z', approved_at: '2026-11-02T00:00:00Z', ...over,
})

beforeEach(() => { sent.length = 0; process.env.RESEND_API_KEY = 'test-key' })

describe('which hotels have a readable address', () => {
  test('aliasForCode: the alias for a listed code, null for the others', () => {
    expect(aliasForCode(WITH_ALIAS)).toBe('casa-cuenca')
    expect(aliasForCode(WITHOUT)).toBeNull()
    expect(aliasForCode('constructor')).toBeNull()
    expect(HOTEL_ALIASES).toEqual({ 'casa-cuenca': WITH_ALIAS })
  })
  test('the shown address: alias when there is one, the random code when there is none', () => {
    expect(hotelShownUrl(WITH_ALIAS)).toBe('https://www.lagomplan.com/g/casa-cuenca')
    expect(hotelShownCardUrl(WITH_ALIAS)).toBe('https://www.lagomplan.com/g/casa-cuenca/tarjeta')
    expect(hotelShownUrl(WITHOUT)).toBe('https://www.lagomplan.com/g/mnqn9bc7sy')
    expect(hotelShownCardUrl(WITHOUT)).toBe('https://www.lagomplan.com/g/mnqn9bc7sy/tarjeta')
  })
  test('NOT changed: the QR and the share link keep the random code, for both hotels', () => {
    expect(hotelQrUrl(WITH_ALIAS)).toBe('https://www.lagomplan.com/g/tjc9ckzteq')
    expect(hotelQrUrl(WITHOUT)).toBe('https://www.lagomplan.com/g/mnqn9bc7sy')
    expect(hotelShareUrl({ code: WITH_ALIAS, zone: 'condesa', lang: 'es' })).toBe('https://www.lagomplan.com/g/tjc9ckzteq?lang=es&via=share')
    // the card page and the share link are built from hotelQrUrl / the code, never from the shown address
    expect(fs.readFileSync(path.join(process.cwd(), 'app/g/[code]/tarjeta/page.tsx'), 'utf8')).toMatch(/hotelQrUrl\(code\)/)
    expect(fs.readFileSync(path.join(process.cwd(), 'app/g/[code]/tarjeta/page.tsx'), 'utf8')).not.toMatch(/hotelShown/)
    expect(fs.readFileSync(path.join(process.cwd(), 'content/guia/hotel/share.ts'), 'utf8')).not.toMatch(/hotelShown|aliases/)
  })
})

describe('the approval email', () => {
  test.each(['es', 'en'] as const)('%s, hotel WITH an alias: the guide link and the card link use the readable address', async (lang) => {
    await sendApprovalEmail(hotel(WITH_ALIAS, { lang }))
    expect(sent).toHaveLength(1)
    const body = sent[0].html + sent[0].text
    expect(body).toContain('https://www.lagomplan.com/g/casa-cuenca')
    expect(body).toContain('https://www.lagomplan.com/g/casa-cuenca/tarjeta')
    expect(body).not.toContain('tjc9ckzteq')
    expect(sent[0].html).toContain(lang === 'es' ? 'Esta es la guía que verán tus huéspedes' : 'This is the guide your guests will see')
  })
  test.each(['es', 'en'] as const)('%s, hotel WITHOUT an alias: the random code, as before', async (lang) => {
    await sendApprovalEmail(hotel(WITHOUT, { lang }))
    const body = sent[0].html + sent[0].text
    expect(body).toContain('https://www.lagomplan.com/g/mnqn9bc7sy')
    expect(body).toContain('https://www.lagomplan.com/g/mnqn9bc7sy/tarjeta')
    expect(body).not.toContain('casa-cuenca')
  })
  test('"Reenviar correo" sends this same email (the resend action calls sendApprovalEmail)', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'app/api/admin/hotels/[id]/action/route.ts'), 'utf8')
    expect(src).toMatch(/sendApprovalEmail/)
    expect(src).toMatch(/'resend'/)
  })
})

describe('"Copiar enlace" in /admin/hoteles', () => {
  const row = (h: HotelRow): HotelWithStats => ({ ...h, scans_30d: 0, scans_total: 0, last_scan: null })
  test('copies the readable address for a hotel with an alias and the random code for one without', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    render(<HotelsTable hotels={[row(hotel(WITH_ALIAS)), row(hotel(WITHOUT))]} totals={{ live: 2, pending: 0, waitlist: 0, scansThisMonth: 0 }} />)
    const buttons = screen.getAllByRole('button', { name: 'Copiar enlace' })
    expect(buttons).toHaveLength(2)
    fireEvent.click(buttons[0])
    await waitFor(() => expect(writeText).toHaveBeenLastCalledWith('https://www.lagomplan.com/g/casa-cuenca'))
    fireEvent.click(buttons[1])
    await waitFor(() => expect(writeText).toHaveBeenLastCalledWith('https://www.lagomplan.com/g/mnqn9bc7sy'))
    // "Abrir tarjeta" is unchanged (it opens the card by the random code)
    const cards = screen.getAllByRole('link', { name: 'Abrir tarjeta' }).map((a) => a.getAttribute('href'))
    expect(cards).toEqual(['/g/tjc9ckzteq/tarjeta', '/g/mnqn9bc7sy/tarjeta'])
  })
})
