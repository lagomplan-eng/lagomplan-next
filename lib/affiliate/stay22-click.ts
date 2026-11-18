/**
 * lib/affiliate/stay22-click.ts
 *
 * The click rule behind components/affiliate/Stay22Guard.tsx, as a plain function so it can be
 * unit-tested and bundled without React.
 *
 * Two kinds of anchor:
 *
 * 1. Any link already pointing at stay22.com: we open it ourselves (in a new tab) so
 *    LetMeAllez can't swap our `lagomplan` affiliate id. The anchor's own onClick still runs.
 *
 * 2. Anchors with `data-lma-managed="<url>"`: the CTA that must open exactly OUR url. The
 *    attribute value is that url. We cannot trust `anchor.href` for these, because once the
 *    LetMeAllez script has loaded it rewrites the href (adds its own params and a second
 *    `campaign`, and sets target=_blank) and attaches a click handler on the anchor itself,
 *    which runs before React's. So we take the click here, in the capture phase on document:
 *    open the url from the attribute, and stop the event so neither LetMeAllez's handler nor
 *    the browser's default navigation sees it. Stopping it also stops the component's React
 *    onClick, so we first dispatch MANAGED_LINK_CLICK on the anchor; a component that needs
 *    click analytics listens for that (see PlannerHotelsSection).
 *    Legacy `data-lma-managed` with no url (or an invalid one) falls back to anchor.href.
 */

const STAY22_HOST = /(^|\.)stay22\.com$/i

/** Dispatched on a managed anchor just before we open its url. detail: { url }. */
export const MANAGED_LINK_CLICK = 'lagomplan:managed-link-click'

function httpUrl(raw: string | undefined): string | null {
  if (!raw) return null
  try {
    const u = new URL(raw)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : null
  } catch {
    return null
  }
}

export function handleStay22Click(e: MouseEvent): void {
  // Another handler (or a modifier-click) already owns this click.
  if (e.defaultPrevented) return
  // Left button, no modifiers: let the browser handle the rest.
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

  const target = e.target as Element | null
  const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null
  if (!anchor) return

  if (anchor.dataset.lmaManaged != null) {
    const url = httpUrl(anchor.dataset.lmaManaged) ?? httpUrl(anchor.href)
    if (!url) return
    e.preventDefault()
    e.stopPropagation()
    anchor.dispatchEvent(new CustomEvent(MANAGED_LINK_CLICK, { detail: { url } }))
    window.open(url, '_blank', 'noopener,noreferrer')
    return
  }

  let host: string
  try {
    host = new URL(anchor.href).hostname
  } catch {
    return
  }
  if (!STAY22_HOST.test(host)) return

  // Take over: open our exact URL ourselves so LetMeAllez can't re-wrap the navigation. The
  // anchor's own onClick still runs (we don't stop propagation), so analytics fire normally.
  e.preventDefault()
  window.open(anchor.href, '_blank', 'noopener,noreferrer')
}
