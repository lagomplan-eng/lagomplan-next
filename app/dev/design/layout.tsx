/**
 * app/dev/design/layout.tsx
 *
 * Standalone root layout for the design style guide (/dev/design). Lives OUTSIDE app/[locale], like the
 * landings: brand fonts + globals, no Nav/Footer, no analytics, no consent banner. noindex, not linked from
 * anywhere, not in the sitemap.
 */
import type { Metadata } from 'next'
import { fontVariables } from '../../../lib/fonts'
import '../../globals.css'

export const metadata: Metadata = {
  title: 'Design foundation',
  robots: { index: false, follow: false, nocache: true },
}

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head><meta name="robots" content="noindex, nofollow" /></head>
      <body>{children}</body>
    </html>
  )
}
