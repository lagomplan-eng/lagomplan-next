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
      { source: '/livin', destination: '/guia/livin', permanent: false },
    ]
  },
}

export default withNextIntl(nextConfig)
