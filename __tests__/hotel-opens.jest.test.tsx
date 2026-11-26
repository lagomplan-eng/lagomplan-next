/**
 * Opens in the hotel guide (browser): which mood, zone tab or plan a guest opened. One event per id per page view, only a tap
 * counts (never the default), closing counts nothing, a visit with no ?h= sends nothing, and a shared-link visit (?via=share) counts like any other.
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

function open(zone: 'condesa' | 'roma' = 'condesa', search = `?h=${CODE}&lang=en`) {
  window.history.pushState({}, '', `/guia/cdmx/${zone === 'roma' ? 'roma-norte' : zone}${search}`)
  let utils!: ReturnType<typeof render>
  act(() => { utils = render(<GuiaClient {...buildHotelGuideProps(zone)!} />) })
  return utils
}
const click = (el: Element) => act(() => { fireEvent.click(el) })
const opens = () => sent.filter((e) => e.type === 'section_open' && ['mood', 'zone', 'plan'].includes(e.section as string))
const ev = (section: string, source: string, lang = 'en') => ({ code: CODE, type: 'section_open', section, lang, source })
const mood = (re: RegExp) => screen.getByRole('button', { name: re })
const tab = (container: HTMLElement, label: string) => [...container.querySelectorAll('[role="tab"]')].find((t) => t.textContent === label)!

describe('moods', () => {
  test('opening "I\'m hungry" sends one event with source mood_hungry', () => {
    open()
    expect(opens()).toEqual([]) // nothing on load
    click(mood(/hungry/i))
    expect(opens()).toEqual([ev('mood', 'mood_hungry')])
  })
  test('opening and closing the same mood five times is one event; closing records nothing', () => {
    open()
    for (let i = 0; i < 5; i++) { click(mood(/hungry/i)); click(screen.getByRole('button', { name: /close/i })) }
    expect(opens()).toEqual([ev('mood', 'mood_hungry')])
  })
  test('another mood is another event; going back to the first adds nothing', () => {
    open()
    click(mood(/hungry/i)); click(mood(/shop/i)); click(mood(/hungry/i))
    expect(opens()).toEqual([ev('mood', 'mood_hungry'), ev('mood', 'mood_shop')])
  })
  test('Spanish: same id, lang es', () => {
    open('condesa', `?h=${CODE}&lang=es`)
    click(mood(/hambre/i))
    expect(opens()).toEqual([ev('mood', 'mood_hungry', 'es')])
  })
})

describe('zone tabs', () => {
  test('the zone shown on load does not count; tapping another zone does, once', () => {
    const { container } = open()
    expect(opens()).toEqual([])
    click(tab(container, 'Roma Norte')); click(tab(container, 'Polanco')); click(tab(container, 'Roma Norte'))
    expect(opens()).toEqual([ev('zone', 'zone_roma_norte'), ev('zone', 'zone_polanco')])
  })
  test('tapping the tab that is already open records nothing; going back to the default zone is a tap and counts once', () => {
    const { container } = open()
    click(tab(container, 'Condesa')) // already open (the default)
    expect(opens()).toEqual([])
    click(tab(container, 'Roma Norte')); click(tab(container, 'Condesa')); click(tab(container, 'Roma Norte')); click(tab(container, 'Condesa'))
    expect(opens()).toEqual([ev('zone', 'zone_roma_norte'), ev('zone', 'zone_condesa')])
  })
  test('a zone with two words in its name: zone_san_miguel_chapultepec', () => {
    const { container } = open()
    click(tab(container, 'San Miguel Chapultepec'))
    expect(opens()).toEqual([ev('zone', 'zone_san_miguel_chapultepec')])
  })
})

describe('plan buttons (Condesa has two)', () => {
  test('the plan shown on load does not count; tapping "48 hours" sends plan_48h once', () => {
    open()
    expect(opens()).toEqual([])
    click(screen.getByRole('tab', { name: '48 hours' })); click(screen.getByRole('tab', { name: '48 hours' }))
    expect(opens()).toEqual([ev('plan', 'plan_48h')])
  })
  test('tapping "Only a few hours" while it is already shown records nothing; coming back to it after 48 hours counts once', () => {
    open()
    click(screen.getByRole('tab', { name: 'Only a few hours' }))
    expect(opens()).toEqual([])
    click(screen.getByRole('tab', { name: '48 hours' })); click(screen.getByRole('tab', { name: 'Only a few hours' })); click(screen.getByRole('tab', { name: '48 hours' })); click(screen.getByRole('tab', { name: 'Only a few hours' }))
    expect(opens()).toEqual([ev('plan', 'plan_48h'), ev('plan', 'plan_quick')])
  })
  test('Roma Norte has one plan and no buttons: no plan event is possible', () => {
    open('roma')
    expect(screen.queryByRole('tab', { name: '48 hours' })).toBeNull()
  })
})

describe('the same rules as today', () => {
  test('with no ?h= (a visitor with no hotel code) nothing is sent', () => {
    const { container } = open('condesa', '?lang=en')
    click(mood(/hungry/i)); click(tab(container, 'Roma Norte')); click(screen.getByRole('tab', { name: '48 hours' }))
    expect(sent).toEqual([])
  })
  test('with ?via=share (a shared link) the opens count like anyone else\'s', () => {
    const { container } = open('condesa', `?h=${CODE}&lang=en&via=share`)
    click(mood(/hungry/i)); click(tab(container, 'Roma Norte')); click(screen.getByRole('tab', { name: '48 hours' }))
    expect(opens().map((o: any) => `${o.section}:${o.source}`)).toEqual(['mood:mood_hungry', 'zone:zone_roma_norte', 'plan:plan_48h'])
  })
  test('an invalid code in ?h= sends nothing', () => {
    open('condesa', '?h=not-a-code&lang=en')
    click(mood(/hungry/i))
    expect(sent).toEqual([])
  })
})
