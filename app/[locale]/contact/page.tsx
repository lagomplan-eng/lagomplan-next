/**
 * app/[locale]/contact/page.tsx
 * Route ES: /es/contacto   Route EN: /en/contact
 */
import type { Metadata } from 'next'
import { buildAlternates, buildOpenGraph } from '../../../lib/seo'
import type { Locale } from '../../../i18n'
import ContactForm from '../../../components/forms/ContactForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title:      locale === 'es' ? 'Contacto' : 'Contact',
    description:
      locale === 'es'
        ? '\u00bfTienes dudas o sugerencias? Escr\u00edbenos y te respondemos pronto.'
        : "Have questions or suggestions? Write to us and we'll get back to you.",
    alternates: buildAlternates('contact'),
    openGraph:  buildOpenGraph(locale),
  }
}

const copy = {
  es: {
    label:       'Contacto',
    title:       'Escr\u00edbenos.',
    description: '\u00bfTienes dudas, sugerencias o quieres colaborar con nosotros? Escr\u00edbenos y te respondemos pronto.',
    info:        'Tambi\u00e9n puedes escribirnos directamente a',
  },
  en: {
    label:       'Contact',
    title:       'Get in touch.',
    description: "Have questions, suggestions, or want to collaborate? Write to us and we'll get back to you soon.",
    info:        'You can also reach us directly at',
  },
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const isES = locale === 'es'
  const t = copy[isES ? 'es' : 'en']

  return (
    <main
      className="pt-[72px] min-h-screen"
      style={{ background: '#F7F4EF' }}
    >
      <div className="max-w-[560px] mx-auto px-6 py-16 md:py-24">

        {/* Header */}
        <span className="sec-label">{t.label}</span>
        <h1 className="font-sans text-[40px] md:text-[48px] font-bold text-[#0F3A33] leading-[1.08] tracking-[-1px] mb-4">
          {t.title}
        </h1>
        <p className="font-sans text-[15px] text-[#3E5F58] leading-[1.75] mb-10 max-w-[440px]">
          {t.description}
        </p>

        {/* Form */}
        <ContactForm locale={isES ? 'es' : 'en'} />

        {/* Direct email nudge */}
        <p className="font-sans text-[13px] text-[#7A7A76] mt-8">
          {t.info}{' '}
          <a
            href="mailto:lagomplan@gmail.com"
            className="text-[#0F3A33] font-medium hover:underline"
          >
            lagomplan@gmail.com
          </a>
        </p>

      </div>
    </main>
  )
}
