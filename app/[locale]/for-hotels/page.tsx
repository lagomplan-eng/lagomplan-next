/**
 * app/[locale]/for-hotels/page.tsx
 * Route ES: /es/para-hoteles   Route EN: /en/for-hotels
 * One public page where a hotel in Condesa, Roma Norte or Polanco asks for the neighborhood guide.
 */
import type { Metadata } from 'next'
import { buildAlternates, buildOpenGraph } from '../../../lib/seo'
import type { Locale } from '../../../i18n'
import HotelSignupForm from '../../../components/forms/HotelSignupForm'

const copy = {
  es: {
    title: 'Guía de barrio para tu hotel',
    description: 'Una tarjeta con QR para tus huéspedes y una guía de tu zona con lugares verificados. Sin costo, sin app para el huésped.',
    label: 'Para hoteles',
    h1: 'Una guía de tu barrio, lista para tus huéspedes.',
    lede: 'Registra tu hotel en Condesa, Roma Norte o Polanco. Revisamos tu solicitud y te enviamos una tarjeta con QR para imprimir. Tus huéspedes la escanean con la cámara y ven dónde comer, qué hacer y cómo moverse, en español o inglés.',
  },
  en: {
    title: 'Neighborhood guide for your hotel',
    description: 'A card with a QR for your guests and a guide to your area with verified places. Free, and guests need no app.',
    label: 'For hotels',
    h1: 'A guide to your neighborhood, ready for your guests.',
    lede: 'Register your hotel in Condesa, Roma Norte or Polanco. We review your request and send you a printable card with a QR. Guests scan it with their camera and see where to eat, what to do and how to get around, in Spanish or English.',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = copy[locale === 'es' ? 'es' : 'en']
  const alternates = buildAlternates(locale, 'forHotels')
  return { title: t.title, description: t.description, alternates, openGraph: buildOpenGraph(locale, { url: alternates.canonical as string }) }
}

export default async function ForHotelsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const l = locale === 'es' ? 'es' : 'en'
  const t = copy[l]
  return (
    <main className="pt-[100px] min-h-screen" style={{ background: '#F7F4EF' }}>
      <div className="max-w-[560px] mx-auto px-6 py-16 md:py-24">
        <span className="sec-label">{t.label}</span>
        <h1 className="font-sans text-[34px] md:text-[44px] font-bold text-[#0F3A33] leading-[1.1] tracking-[-1px] mb-4">{t.h1}</h1>
        <p className="font-sans text-[15px] text-[#3E5F58] leading-[1.75] mb-10">{t.lede}</p>
        <HotelSignupForm locale={l} />
      </div>
    </main>
  )
}
