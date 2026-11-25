/**
 * A tap on a place's link in the hotel guide (browser): the event carries the place's stable id and where in the guide it sits;
 * a link that belongs to no place sends what it always sent; without ?h= nothing is sent.
 */
import { render, fireEvent, act, screen } from '@testing-library/react'
import GuiaClient from '../app/guia/[partner]/GuiaClient'
import { buildHotelGuideProps } from '../content/guia/hotel/resolve'

const CODE = 'tjc9ckzteq'
let sent: Record<string, unknown>[] = []

beforeEach(() => {
  sent = []
  ;(window as any).IntersectionObserver = class { observe() {} disconnect() {} unobserve() {} }
  ;(navigator as any).sendBeacon = undefined
  ;(global as any).fetch = jest.fn((url: string, init?: { body?: string }) => {
    if (url === '/api/hotels/event') sent.push(JSON.parse(init!.body!))
    return Promise.reject(new Error('offline'))
  })
})

function open(search = `?h=${CODE}&lang=en`) {
  window.history.pushState({}, '', `/guia/cdmx/condesa${search}`)
  let utils!: ReturnType<typeof render>
  act(() => { utils = render(<GuiaClient {...buildHotelGuideProps('condesa')!} />) })
  return utils
}
const clickMood = (label: RegExp) => act(() => { fireEvent.click(screen.getByRole('button', { name: label })) })
const outbound = () => sent.filter((e) => e.type === 'outbound_click')

describe('hotel guide: taps on a place\'s link', () => {
  test('Maleza\'s Map link in "I\'m hungry" sends place "maleza" and source "mood_hungry"', () => {
    open()
    clickMood(/hungry/i)
    const row = screen.getByText('Maleza').closest('div')!.parentElement!
    const map = [...row.querySelectorAll('a')].find((a) => a.textContent === 'Map')!
    expect(map.getAttribute('data-place')).toBe('maleza')
    act(() => { fireEvent.click(map) })
    expect(outbound()).toEqual([{ code: CODE, type: 'outbound_click', section: 'map', lang: 'en', place: 'maleza', source: 'mood_hungry' }])
  })

  test('a place in another mood gets that mood as its source', () => {
    open()
    clickMood(/shop/i)
    const row = screen.getByText('Librería El Péndulo').closest('div')!.parentElement!
    act(() => { fireEvent.click([...row.querySelectorAll('a')].find((a) => a.textContent === 'Map')!) })
    expect(outbound()).toEqual([{ code: CODE, type: 'outbound_click', section: 'map', lang: 'en', place: 'libreria_el_pendulo', source: 'mood_shop' }])
  })

  test('a stop of the short plan sends its id and source "plan_quick"', () => {
    const { container } = open()
    const map = container.querySelector('a[data-place="niddo"]')!
    expect(map.getAttribute('data-place-source')).toBe('plan_quick')
    act(() => { fireEvent.click(map) })
    expect(outbound()).toEqual([{ code: CODE, type: 'outbound_click', section: 'map', lang: 'en', place: 'niddo', source: 'plan_quick' }])
  })

  test('the zone "Map →" link belongs to no place: it sends what it always sent', () => {
    const { container } = open()
    const zoneMap = container.querySelector('a[aria-label^="Map of"]')!
    expect(zoneMap.hasAttribute('data-place')).toBe(false)
    act(() => { fireEvent.click(zoneMap) })
    expect(outbound()).toEqual([{ code: CODE, type: 'outbound_click', section: 'map', lang: 'en' }])
  })

  test('Spanish: same ids (the place keeps one id in both languages)', () => {
    open(`?h=${CODE}&lang=es`)
    clickMood(/hambre/i)
    const row = screen.getByText('Maleza').closest('div')!.parentElement!
    act(() => { fireEvent.click([...row.querySelectorAll('a')].find((a) => a.textContent === 'Mapa')!) })
    expect(outbound()).toEqual([{ code: CODE, type: 'outbound_click', section: 'map', lang: 'es', place: 'maleza', source: 'mood_hungry' }])
  })

  test('without ?h= (a visitor with no hotel code) nothing is sent', () => {
    open('?lang=en')
    clickMood(/hungry/i)
    const row = screen.getByText('Maleza').closest('div')!.parentElement!
    act(() => { fireEvent.click([...row.querySelectorAll('a')].find((a) => a.textContent === 'Map')!) })
    expect(sent).toEqual([])
  })
})
