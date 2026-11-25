/**
 * lib/analytics/capture-click.ts
 *
 * Record a click on a link BEFORE any third-party script can take it over.
 *
 * Why: Stay22's LetMeAllez script listens for clicks at the top of the capture phase and handles the link itself
 * (it prevents the default and stops the event), so a React `onClick` on the link never runs and the booking click
 * is lost. The only reliable place is `window`, in the capture phase: the first stop on the event's path.
 *
 * This listener only OBSERVES. It never calls preventDefault / stopPropagation, never touches the link, its href
 * or its attributes: Stay22 handles the click exactly as before (and the commission with it).
 *
 * Register it once the page is hydrated (a useEffect) so it sits ahead of Stay22 (loaded afterwards by Stay22Loader).
 * Each click is reported at most once, even if the event is re-dispatched.
 */

const seen = new WeakSet<Event>()

/**
 * @param find   returns the element to report for a click target (usually `target.closest('…')`), or null to ignore
 * @param report called with that element, before anyone else handles the click
 * @returns      a function that removes the listener
 */
export function onLinkClickFirst(find: (target: Element) => Element | null, report: (el: Element) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const handler = (e: Event) => {
    if (seen.has(e)) return
    const t = e.target
    if (!(t instanceof Element)) return
    const el = find(t)
    if (!el) return
    seen.add(e)
    try { report(el) } catch { /* analytics must never break a click */ }
  }
  window.addEventListener('click', handler, { capture: true })
  return () => window.removeEventListener('click', handler, { capture: true })
}
