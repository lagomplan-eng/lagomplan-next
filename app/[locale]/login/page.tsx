/**
 * app/[locale]/login/page.tsx — Stub
 * Route ES: /login  (see i18n.ts pathnames for full localized segment)
 * TODO: implement full page UI
 */
import type { Metadata }              from 'next'
import { buildAlternates, buildOpenGraph } from '../../../lib/seo'
import type { Locale }               from '../../../i18n'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  return {
    title:       locale === 'es' ? 'Iniciar sesión' : 'Log in',
    alternates:  buildAlternates('login'),
    openGraph:   buildOpenGraph(locale),
  }
}

export default function Page({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  return (
    <main className="pt-[64px] min-h-screen" style={{ background: '#EDE7E1' }}>
      <div className="page-inner py-24">
        <h1 className="font-sans text-[40px] font-bold text-[#0F3A33]">
          {locale === 'es' ? 'Iniciar sesión' : 'Log in'}
        </h1>
        <p className="font-sans text-[15px] text-[#6B8F86] mt-4">Coming soon.</p>
      </div>
    </main>
  )
}
