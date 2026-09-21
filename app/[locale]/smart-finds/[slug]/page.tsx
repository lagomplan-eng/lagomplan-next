/**
 * app/[locale]/smart-finds/[slug]/page.tsx — Stub
 * Route ES: /es/.../smartFindDetail  EN: /en/.../smartFindDetail
 * TODO: implement full page UI + resolveEntityBySlug
 */
import type { Metadata }              from 'next'
import { buildOpenGraph, NO_INDEX } from '../../../../lib/seo'
import type { Locale }               from '../../../../i18n'

type Props = {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  return {
    title:       `${locale === 'es' ? 'Producto' : 'Smart find'} — ${slug}`,
    // No `alternates` and noindex — this catch-all only ever renders for
    // the 8 kits that don't have a real static segment yet (Next.js
    // prefers the literal app/[locale]/smart-finds/familias/page.tsx route
    // over this one whenever the slug is "familias", so that kit is
    // unaffected). Indexing a stub with no real content would create thin/
    // duplicate pages. TODO: once a kit ships a real static segment (like
    // familias did), give it its own page.tsx with
    // `alternates: buildSmartFindAlternates(locale, entity)` (that helper
    // already exists in lib/seo.ts) instead of relying on this stub.
    robots:      NO_INDEX,
    openGraph:   buildOpenGraph(locale),
  }
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params
  return (
    <main className="pt-[100px] min-h-screen" style={{ background: '#EDE7E1' }}>
      <div className="page-inner py-24">
        <h1 className="font-sans text-[40px] font-bold text-[#0F3A33]">
          {locale === 'es' ? 'Producto' : 'Smart find'}: {slug}
        </h1>
        <p className="font-sans text-[15px] text-[#6B8F86] mt-4">Coming soon.</p>
      </div>
    </main>
  )
}
