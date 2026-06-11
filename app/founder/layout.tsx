import { Manrope, DM_Mono } from 'next/font/google'

const manrope = Manrope({
  subsets:  ['latin'],
  variable: '--font-sans',
  display:  'swap',
  weight:   ['400', '500', '700'],
})

const dmMono = DM_Mono({
  subsets:  ['latin'],
  variable: '--font-mono',
  display:  'swap',
  weight:   ['400'],
})

export default function FounderLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${manrope.variable} ${dmMono.variable}`}>
      <body style={{ margin: 0, background: '#F6F2EC', fontFamily: 'var(--font-sans, Manrope, system-ui, sans-serif)' }}>
        {children}
      </body>
    </html>
  )
}
