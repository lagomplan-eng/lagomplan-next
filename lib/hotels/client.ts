// lib/hotels/client.ts — browser side of the hotel events. No cookies, no ids: just { code, type, section, lang }.
export function sendHotelEvent(e: { code: string; type: 'section_open' | 'outbound_click'; section: string; lang: 'es' | 'en' }): void {
  if (typeof window === 'undefined') return
  const body = JSON.stringify(e)
  try {
    if (navigator.sendBeacon && navigator.sendBeacon('/api/hotels/event', new Blob([body], { type: 'application/json' }))) return
  } catch { /* fall through */ }
  fetch('/api/hotels/event', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
}
