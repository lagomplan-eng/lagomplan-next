// app/g/[code]/tarjeta/layout.tsx — own root layout for the printable card (no site chrome).
import type { Metadata } from 'next'
import { Manrope, DM_Mono } from 'next/font/google'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap', weight: ['400', '500', '700', '800'] })
const dmMono = DM_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap', weight: ['400'] })

export const metadata: Metadata = { title: 'Tarjeta · Lagomplan', robots: { index: false, follow: false } }

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${manrope.variable} ${dmMono.variable}`}>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
