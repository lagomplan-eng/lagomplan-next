import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.prod.website-files.com' },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  // Guest-guide slug → current path redirect map. A printed QR encodes the
  // short slug (lagomplan.com/lupito); if the canonical path ever changes,
  // only this entry moves, so the QR never 404s. non-permanent (307) so the
  // mapping stays repointable. Add one line per partner.
  async redirects() {
    return [
      { source: '/livin', destination: '/guia/livin_condesa', permanent: false },

      // Livin → Livin Condesa slug rename (a second Livin property,
      // livin_roma, now exists — see content/guia/index.ts). Stale
      // pre-rename tracking links (utm_source=livin&utm_medium=partner)
      // must resolve to the new canonical partner_id, not the retired
      // slug — this more specific rule is matched first (redirects are
      // evaluated in array order) and rewrites utm_source/utm_medium
      // before the generic fallback below runs. utm_campaign/utm_content
      // aren't in this destination's query string, so Next.js passes
      // them through from the incoming request unchanged. Anchored
      // regexes (^...$) so this only matches the exact retired values —
      // never livin_roma or any other slug.
      {
        source: '/guia/livin',
        has: [
          { type: 'query', key: 'utm_source', value: '^livin$' },
          { type: 'query', key: 'utm_medium', value: '^partner$' },
        ],
        destination: '/guia/livin_condesa?utm_source=livin_condesa&utm_medium=partner',
        permanent: true,
      },
      // Fallback: any other /guia/livin request (no UTMs, or UTMs that
      // don't match the stale-tracking-link shape above) — plain rename.
      { source: '/guia/livin', destination: '/guia/livin_condesa', permanent: true },
    ]
  },
}

export default withNextIntl(nextConfig)
