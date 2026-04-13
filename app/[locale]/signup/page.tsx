import type { Metadata }                    from 'next'
import { buildAlternates, buildOpenGraph }  from '../../../lib/seo'
import type { Locale }                      from '../../../i18n'
import SignupForm                           from '../../../components/auth/SignupForm'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  return {
    title:      locale === 'es' ? 'Crear cuenta' : 'Sign up',
    alternates: buildAlternates('signup'),
    openGraph:  buildOpenGraph(locale),
  }
}

export default function Page({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  return (
    <main className="pt-[64px] min-h-screen bg-[#FFF9F3]">
      <div className="max-w-[420px] mx-auto px-6 py-24">
        <h1 className="font-sans text-[40px] font-bold text-[#0F3A33]">
          {locale === 'es' ? 'Crear cuenta' : 'Sign up'}
        </h1>
        <SignupForm />
      </div>
    </main>
  )
}
