/**
 * __tests__/stay22-click.jest.test.ts
 *
 * The Stay22 click rule (lib/affiliate/stay22-click.ts, mounted by components/affiliate/Stay22Guard.tsx).
 *
 * Regression for the LetMeAllez race found while chasing e2e flake E-24: once the script has
 * loaded it rewrites a stay22 anchor's href (its own params plus a second `campaign`), sets
 * target=_blank and handles the click on the anchor itself, before React. So a React onClick that
 * opens our url never ran, and the click went out with LetMeAllez's campaign instead of ours.
 * Here LetMeAllez is simulated faithfully enough to reproduce that: a rewritten href and a
 * click handler on the anchor that stops the event and opens ITS url.
 */
import { handleStay22Click, MANAGED_LINK_CLICK } from '../lib/affiliate/stay22-click'

const OURS = 'https://www.stay22.com/allez/booking?aid=lagomplan&campaign=lagomplan-planner-es&address=Tokyo&adults=2'
const REWRITTEN = 'https://www.stay22.com/allez/booking?aid=lagomplan&campaign=lagomplan-es-abc&product=allez&lmaID=x&campaign=lagomplan-planner-es&address=Tokyo&adults=2'

let openSpy: jest.SpyInstance
let reactOnClick: jest.Mock
let lmaHandler: jest.Mock

function setup(attrs: Record<string, string>, { lma = true } = {}) {
  document.body.innerHTML = '<div id="root"><a id="a">Reservar</a></div>'
  const a = document.getElementById('a') as HTMLAnchorElement
  for (const [k, v] of Object.entries(attrs)) a.setAttribute(k, v)
  // React's delegated listener sits on the root container, bubble phase.
  document.getElementById('root')!.addEventListener('click', reactOnClick)
  // LetMeAllez: a handler on the anchor itself that takes the click and opens its own url.
  if (lma) a.addEventListener('click', (ev) => { lmaHandler(); ev.stopImmediatePropagation(); ev.preventDefault(); window.open(a.href, '_blank') })
  return a
}
const click = (el: Element, init: MouseEventInit = {}) => {
  const ev = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...init })
  el.dispatchEvent(ev)
  return ev
}

beforeEach(() => {
  openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)
  reactOnClick = jest.fn()
  lmaHandler = jest.fn()
  document.addEventListener('click', handleStay22Click, true)
})
afterEach(() => {
  document.removeEventListener('click', handleStay22Click, true)
  openSpy.mockRestore()
  document.body.innerHTML = ''
})

describe('data-lma-managed="<url>" anchors', () => {
  it('opens the url from the attribute (our campaign), not the href LetMeAllez rewrote', () => {
    const a = setup({ href: REWRITTEN, 'data-lma-managed': OURS })
    click(a)
    expect(openSpy).toHaveBeenCalledTimes(1)
    expect(openSpy).toHaveBeenCalledWith(OURS, '_blank', 'noopener,noreferrer')
    expect(new URL(openSpy.mock.calls[0][0]).searchParams.getAll('campaign')).toEqual(['lagomplan-planner-es'])
  })

  it('takes the click before LetMeAllez: its anchor handler never runs, and it opens nothing', () => {
    const a = setup({ href: REWRITTEN, 'data-lma-managed': OURS })
    const ev = click(a)
    expect(lmaHandler).not.toHaveBeenCalled()
    expect(openSpy).toHaveBeenCalledTimes(1)          // only ours: no second tab
    expect(ev.defaultPrevented).toBe(true)            // no navigation either
  })

  it('stops the event (React onClick does not also run), but announces the click on the anchor first', () => {
    const a = setup({ href: REWRITTEN, 'data-lma-managed': OURS })
    const seen: string[] = []
    a.addEventListener(MANAGED_LINK_CLICK, ((ev: CustomEvent) => seen.push(ev.detail.url)) as EventListener)
    click(a)
    expect(reactOnClick).not.toHaveBeenCalled()
    expect(seen).toEqual([OURS])
  })

  it('handles a click on a child of the anchor', () => {
    const a = setup({ href: REWRITTEN, 'data-lma-managed': OURS })
    a.innerHTML = '<span id="c">Reservar →</span>'
    click(document.getElementById('c')!)
    expect(openSpy).toHaveBeenCalledWith(OURS, '_blank', 'noopener,noreferrer')
    expect(lmaHandler).not.toHaveBeenCalled()
  })

  it('also works when LetMeAllez has not loaded (same single open)', () => {
    const a = setup({ href: OURS, 'data-lma-managed': OURS }, { lma: false })
    click(a)
    expect(openSpy).toHaveBeenCalledTimes(1)
    expect(openSpy).toHaveBeenCalledWith(OURS, '_blank', 'noopener,noreferrer')
  })

  it('handles a non-stay22 url too (a booking url the user saved)', () => {
    const own = 'https://www.booking.com/hotel/mx/x.html'
    const a = setup({ href: own, 'data-lma-managed': own })
    click(a)
    expect(openSpy).toHaveBeenCalledWith(own, '_blank', 'noopener,noreferrer')
  })

  it('legacy bare attribute (no url) falls back to the anchor href', () => {
    const a = setup({ href: OURS, 'data-lma-managed': '' }, { lma: false })
    click(a)
    expect(openSpy).toHaveBeenCalledWith(OURS, '_blank', 'noopener,noreferrer')
  })

  it('an unsafe attribute value is ignored in favour of the href; an unsafe href opens nothing', () => {
    const a = setup({ href: OURS, 'data-lma-managed': 'javascript:alert(1)' }, { lma: false })
    click(a)
    expect(openSpy).toHaveBeenCalledWith(OURS, '_blank', 'noopener,noreferrer')
    openSpy.mockClear()
    const b = setup({ href: 'javascript:alert(1)', 'data-lma-managed': 'javascript:alert(1)' }, { lma: false })
    click(b)
    expect(openSpy).not.toHaveBeenCalled()
  })

  it('leaves modifier and non-left clicks to the browser', () => {
    const a = setup({ href: REWRITTEN, 'data-lma-managed': OURS }, { lma: false })
    click(a, { ctrlKey: true }); click(a, { metaKey: true }); click(a, { shiftKey: true }); click(a, { altKey: true }); click(a, { button: 1 })
    expect(openSpy).not.toHaveBeenCalled()
  })
})

describe('plain stay22 links (unchanged behaviour)', () => {
  it('opens anchor.href itself and lets the anchor onClick run', () => {
    const a = setup({ href: OURS }, { lma: false })
    const ev = click(a)
    expect(openSpy).toHaveBeenCalledWith(OURS, '_blank', 'noopener,noreferrer')
    expect(ev.defaultPrevented).toBe(true)
    expect(reactOnClick).toHaveBeenCalledTimes(1)     // propagation not stopped: analytics still fire
  })

  it('ignores links to other hosts', () => {
    const a = setup({ href: 'https://example.com/x' }, { lma: false })
    const ev = click(a)
    expect(openSpy).not.toHaveBeenCalled()
    expect(ev.defaultPrevented).toBe(false)
  })

  it('does nothing if an earlier handler already prevented the click', () => {
    const a = setup({ href: OURS }, { lma: false })
    const early = (e: Event) => e.preventDefault()
    window.addEventListener('click', early, true)          // window capture runs before document capture
    click(a)
    window.removeEventListener('click', early, true)
    expect(openSpy).not.toHaveBeenCalled()
  })
})
