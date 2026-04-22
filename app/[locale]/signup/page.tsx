import type { Metadata }                    from 'next'
import { buildAlternates, buildOpenGraph }  from '../../../lib/seo'
import type { Locale }                      from '../../../i18n'
import SignupForm                           from '../../../components/auth/SignupForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title:      locale === 'es' ? 'Crear cuenta' : 'Sign up',
    alternates: buildAlternates('signup'),
    openGraph:  buildOpenGraph(locale),
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  return (
    <main className="pt-[72px] min-h-screen bg-[#FFF9F3]">
      <div className="max-w-[420px] mx-auto px-6 py-24">
        <h1 className="font-sans text-[40px] font-bold text-[#0F3A33]">
          {locale === 'es' ? 'Crear cuenta' : 'Sign up'}
        </h1>
        <SignupForm />
      </div>
    </main>
  )
}
