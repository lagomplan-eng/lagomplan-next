// app/admin/layout.tsx — own root layout (the site layouts live under [locale]). Admin pages are never indexed.
// Fonts are self-hosted (lib/fonts, next/font/local): no build-time fetch from Google. globals.css defines
// --font-sans / --font-mono from the font variables put on <html>.
import type { Metadata } from 'next'
import { fontVariables } from '../../lib/fonts'
import '../globals.css'

export const metadata: Metadata = { title: 'Admin · Lagomplan', robots: { index: false, follow: false } }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fontVariables}>
      <body style={{ margin: 0, background: '#F6F2EC', color: '#0F3A33', fontFamily: 'var(--font-sans), Manrope, system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
