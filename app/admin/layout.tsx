// app/admin/layout.tsx — own root layout (the site layouts live under [locale]). Admin pages are never indexed.
import type { Metadata } from 'next'
import { Manrope, DM_Mono } from 'next/font/google'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap', weight: ['400', '500', '700'] })
const dmMono = DM_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap', weight: ['400'] })

export const metadata: Metadata = { title: 'Admin · Lagomplan', robots: { index: false, follow: false } }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${manrope.variable} ${dmMono.variable}`}>
      <body style={{ margin: 0, background: '#F6F2EC', color: '#0F3A33', fontFamily: 'var(--font-sans, Manrope, system-ui, sans-serif)' }}>
        {children}
      </body>
    </html>
  )
}
