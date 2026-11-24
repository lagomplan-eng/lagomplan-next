// lib/hotels/bots.ts — what must NOT count as a QR scan: crawlers, link-preview fetchers, prefetches, HEAD.
// Nothing about the requester is stored; this only decides whether to write a row.

const BOT_RE = new RegExp(
  [
    'bot', 'crawl', 'spider', 'slurp', 'preview', 'facebookexternalhit', 'facebot', 'whatsapp', 'telegram',
    'slack', 'discord', 'skype', 'embedly', 'quora', 'pinterest', 'vkshare', 'headless', 'lighthouse',
    'pagespeed', 'gtmetrix', 'curl/', 'wget', 'python', 'java/', 'okhttp', 'go-http', 'axios', 'node-fetch',
    'undici', 'httpclient', 'libwww', 'monitor', 'uptime', 'pingdom', 'datadog', 'zgrab', 'scrapy', 'postman',
    'insomnia', 'chrome-lighthouse', 'applebot', 'google-read-aloud', 'googleother', 'mediapartners',
  ].join('|'),
  'i',
)

export function isCountableScan(req: { method: string; headers: { get(name: string): string | null } }): boolean {
  if (req.method !== 'GET') return false
  const ua = req.headers.get('user-agent')
  if (!ua || ua.length < 8) return false
  if (BOT_RE.test(ua)) return false
  const purpose = `${req.headers.get('purpose') ?? ''} ${req.headers.get('sec-purpose') ?? ''} ${req.headers.get('x-moz') ?? ''}`
  if (/prefetch|prerender/i.test(purpose)) return false
  return true
}

/**
 * A link a guest shared from the guide ("Send this guide to my phone") carries ?via=share. Opening it is not a new QR scan
 * (the guest reopening their own guide, or a friend opening what they were sent), so /g/{code} redirects without writing a row.
 * No cookie, no identifier, nothing about the visitor: only this marker in the address.
 */
export const SHARE_MARKER = { key: 'via', value: 'share' } as const
export function isShareOpen(params: { get(name: string): string | null }): boolean {
  return params.get(SHARE_MARKER.key) === SHARE_MARKER.value
}
