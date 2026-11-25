/** @jest-environment jsdom */
import { onLinkClickFirst } from '../lib/analytics/capture-click'

function setup() {
  document.body.innerHTML = '<div data-hotel="h1"><a id="a" href="https://example.com/x" rel="sponsored"><span id="inner">Book</span></a></div><p id="other">x</p>'
  return { a: document.getElementById('a')!, inner: document.getElementById('inner')!, other: document.getElementById('other')! }
}
const click = (el: Element) => { const e = new MouseEvent('click', { bubbles: true, cancelable: true }); el.dispatchEvent(e); return e }

describe('onLinkClickFirst', () => {
  test('reports a click on the link (or inside it) once', () => {
    const { a, inner } = setup()
    const seen: string[] = []
    const off = onLinkClickFirst(t => t.closest('[data-hotel] a'), el => seen.push(el.id))
    click(a); click(inner)
    expect(seen).toEqual(['a', 'a'])
    off()
  })

  test('still reports when a later window-capture handler (Stay22 style) takes the click over', () => {
    const { a } = setup()
    const seen: string[] = []
    const off = onLinkClickFirst(t => t.closest('[data-hotel] a'), el => seen.push(el.id))
    const stay22 = (e: Event) => { e.preventDefault(); e.stopImmediatePropagation() }
    window.addEventListener('click', stay22, true) // registered after ours, like the Stay22 script
    const bubble = jest.fn(); a.addEventListener('click', bubble)
    const e = click(a)
    expect(seen).toEqual(['a'])
    expect(bubble).not.toHaveBeenCalled() // Stay22 took it over, as before
    expect(e.defaultPrevented).toBe(true) // by Stay22, not by us
    window.removeEventListener('click', stay22, true); off()
  })

  test('only observes: never prevents or stops the click', () => {
    const { a } = setup()
    const off = onLinkClickFirst(t => t.closest('[data-hotel] a'), () => {})
    const bubble = jest.fn(); a.addEventListener('click', bubble)
    const e = click(a)
    expect(e.defaultPrevented).toBe(false)
    expect(bubble).toHaveBeenCalledTimes(1)
    off()
  })

  test('ignores other clicks, survives a throwing reporter, and stops after off()', () => {
    const { a, other } = setup()
    const report = jest.fn(() => { throw new Error('boom') })
    const off = onLinkClickFirst(t => t.closest('[data-hotel] a'), report)
    click(other); expect(report).not.toHaveBeenCalled()
    expect(() => click(a)).not.toThrow(); expect(report).toHaveBeenCalledTimes(1)
    off(); click(a); expect(report).toHaveBeenCalledTimes(1)
  })

  test('a re-dispatched event is reported once', () => {
    const { a } = setup()
    const report = jest.fn()
    const off = onLinkClickFirst(t => t.closest('[data-hotel] a'), report)
    const e = new MouseEvent('click', { bubbles: true, cancelable: true })
    a.dispatchEvent(e); a.dispatchEvent(e)
    expect(report).toHaveBeenCalledTimes(1)
    off()
  })
})
