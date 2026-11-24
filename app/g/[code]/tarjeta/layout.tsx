// app/g/[code]/tarjeta/layout.tsx — own root layout for the printable card (no site chrome).
// Fonts are self-hosted (lib/fonts, next/font/local): no build-time fetch from Google.
import type { Metadata } from 'next'
import { fontVariables } from '../../../../lib/fonts'
import '../../../globals.css'

export const metadata: Metadata = { title: 'Tarjeta · Lagomplan', robots: { index: false, follow: false } }

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fontVariables}>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
