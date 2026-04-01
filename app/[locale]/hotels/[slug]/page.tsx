/**
 * app/[locale]/hotels/[slug]/page.tsx — Stub
 * Route ES: /es/.../hotelDetail  EN: /en/.../hotelDetail
 * TODO: implement full page UI + resolveEntityBySlug
 */
import type { Metadata }              from 'next'
import { buildAlternates, buildOpenGraph } from '../../../../lib/seo'
import type { Locale }               from '../../../../i18n'

type Props = {
  params: { locale: Locale; slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = params
  return {
    title:       `${locale === 'es' ? 'Hotel' : 'Hotel'} — ${slug}`,
    alternates:  buildAlternates('hotelDetail'),
    openGraph:   buildOpenGraph(locale),
  }
}

export default function Page({ params }: Props) {
  const { locale, slug } = params
  return (
    <main className="pt-[64px] min-h-screen" style={{ background: '#EDE7E1' }}>
      <div className="page-inner py-24">
        <h1 className="font-sans text-[40px] font-bold text-[#0F3A33]">
          {locale === 'es' ? 'Hotel' : 'Hotel'}: {slug}
        </h1>
        <p className="font-sans text-[15px] text-[#6B8F86] mt-4">Coming soon.</p>
      </div>
    </main>
  )
}
