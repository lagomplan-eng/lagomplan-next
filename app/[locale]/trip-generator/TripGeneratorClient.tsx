'use client'

import { useLocale } from 'next-intl'
import HeroForm from '../../../components/forms/HeroForm'
import TripResult from './TripResult'

interface Props {
  searchParams: Record<string, string>
}

export default function TripGeneratorClient({ searchParams }: Props) {
  const destination = searchParams.destination || ''
  const isEditMode = searchParams.edit === '1'
  const hasResult = !!destination && !isEditMode

  if (!hasResult) {
    return <FormPage searchParams={searchParams} />
  }

  return <TripResult params={searchParams} />
}

// ── Full-page form ────────────────────────────────────
function FormPage({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const locale = useLocale() as 'es' | 'en'

  return (
    <main className="pt-[64px] min-h-screen bg-[#F4F0E8]">
      <div className="page-inner py-16 max-[768px]:py-10">
        <div className="max-w-[620px] mx-auto">
          <span className="sec-label mb-4">Planificador de viajes con IA</span>
          <h1 className="font-playfair text-[48px] max-[768px]:text-[36px] font-bold text-[#0F1A16] leading-[1.05] tracking-[-1.5px] mb-3">
            Genera tu viaje
            <br />
            <em>personalizado.</em>
          </h1>
          <p className="font-sans text-[15px] text-[#2D6B57] leading-[1.7] mb-10">
            Cuéntanos sobre el destino de tus sueños y nuestra IA creará un
            itinerario solo para ti.
          </p>
          <HeroForm locale={locale} initialValues={searchParams} />
        </div>
      </div>
    </main>
  )
}