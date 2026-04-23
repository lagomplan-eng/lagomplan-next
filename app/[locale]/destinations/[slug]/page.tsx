/**
 * app/[locale]/destinations/[slug]/page.tsx — Stub
 * Route ES: /es/.../destinationDetail  EN: /en/.../destinationDetail
 * TODO: implement full page UI + resolveEntityBySlug
 */
import type { Metadata }              from 'next'
import { buildAlternates, buildOpenGraph } from '../../../../lib/seo'
import type { Locale }               from '../../../../i18n'

type Props = {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  return {
    title:       `${locale === 'es' ? 'Destino' : 'Destination'} — ${slug}`,
    alternates:  buildAlternates('destinationDetail'),
    openGraph:   buildOpenGraph(locale),
  }
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params
  return (
    <main className="pt-[100px] min-h-screen" style={{ background: '#EDE7E1' }}>
      <div className="page-inner py-24">
        <h1 className="font-sans text-[40px] font-bold text-[#0F3A33]">
          {locale === 'es' ? 'Destino' : 'Destination'}: {slug}
        </h1>
        <p className="font-sans text-[15px] text-[#6B8F86] mt-4">Coming soon.</p>
      </div>
    </main>
  )
}
