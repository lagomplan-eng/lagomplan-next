/**
 * __tests__/guide-timely.jest.test.tsx — the dated block renders only while current. The clock is
 * frozen (only Date is faked): last day shown, next day gone.
 */
import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import { GuideTimely } from '../components/guides/GuideTimely'
import type { FlatTimely } from '../lib/data/guides/types'

const DATA: FlatTimely = {
  validUntil: '2026-11-30',
  eyebrow: 'Esta temporada',
  title: 'Semana de Thanksgiving 2026',
  verifiedNote: 'Datos verificados el 23 de octubre de 2026.',
  essentialsTitle: 'Lo esencial antes de reservar',
  essentials: ['El jueves muchos restaurantes cierran.'],
  whenTitle: 'Cuándo ir',
  window: 'Ventana sugerida: del miércoles 25 al lunes 30 de noviembre de 2026.',
  table: { headers: ['Qué pasa', 'Fechas 2026', 'Qué cambia para tu viaje'], rows: [
    { what: 'Desfile', when: 'Jueves 26 de noviembre', impact: 'Gratuito' },
    { what: 'Cascanueces', when: 'Hasta el 28 de noviembre', impact: 'Estreno', until: '2026-11-28' },
  ] },
  booking: { label: 'Reserva con las fechas sugeridas:', links: [{ name: 'The Post Oak Hotel', url: 'https://www.booking.com/hotel/us/the-post-oak.html?checkin=2026-11-25&checkout=2026-11-30&ref=lagomplan' }] },
}
const NO_FAKE = ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'setImmediate', 'clearImmediate', 'nextTick', 'queueMicrotask', 'requestAnimationFrame', 'cancelAnimationFrame', 'requestIdleCallback', 'cancelIdleCallback', 'performance', 'hrtime'] as const
const freeze = (iso: string) => jest.useFakeTimers({ now: new Date(iso), doNotFake: [...NO_FAKE] })
afterEach(() => jest.useRealTimers())
const mount = async () => { let u!: ReturnType<typeof render>; await act(async () => { u = render(<GuideTimely data={DATA} />) }); return u }

describe('GuideTimely', () => {
  test('shown during the period: note, essentials, window, calendar, dated booking links', async () => {
    freeze('2026-11-20T18:00:00Z')
    const { container } = await mount()
    expect(screen.getByRole('heading', { name: 'Semana de Thanksgiving 2026' })).toBeInTheDocument()
    expect(screen.getByText('Datos verificados el 23 de octubre de 2026.')).toBeInTheDocument()
    expect(screen.getByText('El jueves muchos restaurantes cierran.')).toBeInTheDocument()
    expect(screen.getByText(/Ventana sugerida/)).toBeInTheDocument()
    expect(screen.getByText('Desfile')).toBeInTheDocument()
    expect(screen.getByText('Cascanueces')).toBeInTheDocument()
    const a = screen.getByRole('link', { name: 'The Post Oak Hotel' })
    expect(a).toHaveAttribute('href', DATA.booking!.links[0].url)
    expect(a).toHaveAttribute('target', '_blank')
    expect(a.getAttribute('rel')).toContain('noopener')
    expect(container.querySelector('[data-guide="timely"]')).not.toBeNull()
  })

  test('the last day (Nov 30, 12:00 in Mexico City) still shows it', async () => {
    freeze('2026-11-30T18:00:00Z')
    await mount()
    expect(screen.getByRole('heading', { name: 'Semana de Thanksgiving 2026' })).toBeInTheDocument()
  })

  test('Dec 1 in Mexico City: the whole block is gone by itself', async () => {
    freeze('2026-12-01T06:00:00Z')
    const { container } = await mount()
    expect(container.querySelector('[data-guide="timely"]')).toBeNull()
    expect(container).toBeEmptyDOMElement()
  })

  test('a row past its own until disappears while the block stays (Nov 29)', async () => {
    freeze('2026-11-29T18:00:00Z')
    await mount()
    expect(screen.getByText('Desfile')).toBeInTheDocument()
    expect(screen.queryByText('Cascanueces')).toBeNull()
  })
})
