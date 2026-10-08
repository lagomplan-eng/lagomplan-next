/**
 * app/robots.ts
 *
 * Next.js App Router File-based Metadata: this file is served at /robots.txt.
 *
 * Strategy:
 *   - Allow all user-agents on the public surface.
 *   - Block crawl on functional + private routes:
 *       /api/                — backend endpoints, not content
 *       /trips/                         — unprefixed legacy path
 *       /es/mis-viajes, /en/my-trips    — authenticated dashboards
 *       /es/cuenta,    /en/account      — authenticated account
 *   - Deliberately NOT blocked: /es/trips/, /en/trips/. Those pages are
 *     noindex via meta tags (trips/share, trips/[trip_id]); a Disallow would
 *     stop Google from ever reading that noindex.
 *
 * `signup` and `login` are intentionally crawlable (no Disallow): they
 * receive direct external links from email clients and we want Google
 * to resolve them rather than treat them as orphaned. They're excluded
 * from the sitemap because they're functional rather than content.
 *
 * Also points crawlers to the dynamic sitemap so they don't have to
 * discover all ~80 indexable URLs by following internal links alone.
 */

import type { MetadataRoute } from 'next'
import { BASE_URL } from '../lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        disallow: [
          '/api/',
          '/trips/',
          '/es/mis-viajes',
          '/en/my-trips',
          '/es/cuenta',
          '/en/account',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host:    BASE_URL,
  }
}
