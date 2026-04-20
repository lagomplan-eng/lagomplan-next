/**
 * app/[locale]/account/page.tsx — Stub
 * Route ES: /account  (see i18n.ts pathnames for full localized segment)
 * TODO: implement full page UI
 */
import type { Metadata }              from 'next'
import { buildAlternates, buildOpenGraph } from '../../../lib/seo'
import type { Locale }               from '../../../i18n'
import { PasswordResetForm }         from '../../../components/auth/PasswordResetForm'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  return {
    title:       locale === 'es' ? 'Mi cuenta' : 'Account',
    alternates:  buildAlternates('account'),
    openGraph:   buildOpenGraph(locale),
  }
}

export default function Page({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  return (
    <main className="pt-[72px] min-h-screen" style={{ background: '#EDE7E1' }}>
      <div className="page-inner py-24">
        <h1 className="font-sans text-[40px] font-bold text-[#0F3A33]">
          {locale === 'es' ? 'Mi cuenta' : 'Account'}
        </h1>
        <p className="font-sans text-[15px] text-[#6B8F86] mt-4">Coming soon.</p>
        <PasswordResetForm locale={locale as 'es' | 'en'} />
      </div>
    </main>
  )
}
