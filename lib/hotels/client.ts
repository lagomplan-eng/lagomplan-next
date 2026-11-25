// lib/hotels/client.ts — browser side of the hotel events. No cookies, no ids: just { code, type, section, lang } and, for a tap on
// a place's link, which place and where in the guide (both validated by the server against our own content).
export function sendHotelEvent(e: { code: string; type: 'section_open' | 'outbound_click'; section: string; lang: 'es' | 'en'; place?: string; source?: string }): void {
  if (typeof window === 'undefined') return
  const body = JSON.stringify(e)
  try {
    if (navigator.sendBeacon && navigator.sendBeacon('/api/hotels/event', new Blob([body], { type: 'application/json' }))) return
  } catch { /* fall through */ }
  fetch('/api/hotels/event', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
}
