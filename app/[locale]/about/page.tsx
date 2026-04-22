/**
 * app/[locale]/about/page.tsx — Stub
 * Route ES: /about  (see i18n.ts pathnames for full localized segment)
 * TODO: implement full page UI
 */
import type { Metadata }              from 'next'
import { buildAlternates, buildOpenGraph } from '../../../lib/seo'
import type { Locale }               from '../../../i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title:       locale === 'es' ? 'Nosotras' : 'About',
    alternates:  buildAlternates('about'),
    openGraph:   buildOpenGraph(locale),
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  return (
    <main className="pt-[72px] min-h-screen" style={{ background: '#EDE7E1' }}>
      <div className="page-inner py-24">
        <h1 className="font-sans text-[40px] font-bold text-[#0F3A33]">
          {locale === 'es' ? 'Nosotras' : 'About'}
        </h1>
        <p className="font-sans text-[15px] text-[#6B8F86] mt-4">Coming soon.</p>
      </div>
    </main>
  )
}
