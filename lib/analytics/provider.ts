/**
 * lib/analytics/provider.ts
 *
 * Maps an outbound URL to a canonical provider slug used by
 * events.affiliateClicked. Keeps the analytics dimension clean so
 * dashboards group "Amazon US" and "Amazon MX" under one bucket and
 * distinguish "Booking" from "Booking via Stay22 Allez."
 *
 * Returns 'unknown' for unrecognised hosts — better than throwing or
 * passing the raw URL, which would explode the cardinality of GA's
 * `provider` dimension.
 */

const PROVIDER_RULES: Array<[RegExp, string]> = [
  // Marketplaces (Smart Finds)
  [/(?:^|\.)amazon\.(com|es|com\.mx|co\.uk|de|fr|it|jp|ca)/i, 'amazon'],
  [/mercadolibre\.com|mercadolivre\.com|articulo\.mercadolibre/i, 'mercadolibre'],
  [/walmart\.com|walmart\.com\.mx/i, 'walmart'],
  [/target\.com/i, 'target'],
  [/liverpool\.com\.mx/i, 'liverpool'],
  [/elpalaciodehierro\.com/i, 'palaciodehierro'],
  [/aliexpress\./i, 'aliexpress'],
  [/etsy\.com/i, 'etsy'],

  // Travel (planner + hotels)
  [/booking\.com|book\.stay22\.com.*booking/i, 'booking'],
  [/hotels\.com|stay22\.com.*hotelscom/i, 'hotelscom'],
  [/expedia\./i, 'expedia'],
  [/agoda\.com/i, 'agoda'],
  [/airbnb\./i, 'airbnb'],
  [/getyourguide\.com|stay22\.com.*getyourguide/i, 'getyourguide'],
  [/viator\.com/i, 'viator'],
  [/civitatis\.com/i, 'civitatis'],

  // Stay22 catch-all (any allez link that didn't match a more specific rule)
  [/stay22\.com|allez\.stay22/i, 'stay22'],

  // Direct DTC brands seen on Smart Finds
  [/doona\./i, 'doona'],
  [/ergobaby\./i, 'ergobaby'],
  [/gb-online\.|gbpockit\./i, 'gb'],
  [/miamily\./i, 'miamily'],
  [/away\.|awaytravel\./i, 'away'],

  // Operators / SaaS
  [/airalo\./i, 'airalo'],
  [/holafly\./i, 'holafly'],
  [/skyscanner\./i, 'skyscanner'],
  [/google\.com\/flights/i, 'google-flights'],
]

/**
 * Map an outbound URL to a canonical provider slug.
 *
 * providerFromUrl('https://www.amazon.com.mx/dp/B09…') → 'amazon'
 * providerFromUrl('https://book.stay22.com/allez/booking/…') → 'booking'
 * providerFromUrl('https://example.com') → 'unknown'
 *
 * Falls back to the raw hostname (with `www.` stripped) for unrecognised
 * hosts so dashboards can still slice the long tail by domain. The
 * `unknown` literal is reserved for empty or unparseable input.
 */
export function providerFromUrl(url: string | undefined | null): string {
  if (!url) return 'unknown'
  try {
    const u = new URL(url)
    const host = (u.host + u.pathname).toLowerCase()
    for (const [pattern, slug] of PROVIDER_RULES) {
      if (pattern.test(host)) return slug
    }
    // Fallback: bare hostname (strip leading www.) so long-tail still slices
    return u.host.replace(/^www\./, '')
  } catch {
    return 'unknown'
  }
}
