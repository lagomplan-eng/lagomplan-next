// app/g/[code]/tarjeta/page.tsx
//
// Printable A6 card (105 × 148 mm, portrait), design B. Public per hotel, addressed by its code. Only two things
// change per hotel: the zone name in the headline and the QR (which always encodes https://www.lagomplan.com/g/{code}).
// Shown for approved and paused hotels; anything else is a 404 (a card only exists once a hotel is approved).

import { notFound } from 'next/navigation'
import QRCode from 'qrcode'
import { getHotelByCode } from '../../../../lib/hotels/db'
import { isValidHotelCode } from '../../../../lib/hotels/codes'
import { hotelQrUrl } from '../../../../lib/hotels/links'
import { ZONE_LABEL, isHotelZone, type HotelZone } from '../../../../content/guia/hotel/zones'
import PrintButton from './PrintButton'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

const MONO = "var(--font-mono), 'DM Mono', ui-monospace, monospace"

export default async function HotelCardPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  // The reason goes to the server log (status and zone only: no name, email or code) so a 404 can be explained.
  const gone = (reason: string): never => { console.error(`[card] not available: ${reason}`); notFound() }
  if (!isValidHotelCode(code)) gone('bad_code')
  const hotel = await getHotelByCode(code)
  if (!hotel) gone('no_row')
  if (!isHotelZone(hotel!.zone)) gone(`zone=${String(hotel!.zone)}`)
  if (hotel!.status !== 'approved' && hotel!.status !== 'paused') gone(`status=${hotel!.status}`)
  const zone = hotel!.zone as HotelZone

  const svg = await QRCode.toString(hotelQrUrl(code), { type: 'svg', margin: 0, errorCorrectionLevel: 'M' })

  return (
    <>
      <style>{`
        @page { size: 105mm 148mm; margin: 0 }
        html, body { background: #e9e4dc }
        .sheet { width: 105mm; height: 148mm; margin: 24px auto; background: #FFF9F3; color: #0F3A33; box-sizing: border-box;
          padding: 10.5mm; display: flex; flex-direction: column; justify-content: space-between;
          font-family: var(--font-sans), Manrope, system-ui, sans-serif; box-shadow: 0 2px 18px rgba(0,0,0,.15) }
        .qrbox { background: #fff; border: 1px solid rgba(107,143,134,.45); border-radius: 3.2mm; padding: 3.2mm; flex: none; width: 33mm; height: 33mm; box-sizing: content-box }
        .qrbox svg { display: block; width: 100%; height: 100% }
        .bar { text-align: center; margin: 0 0 24px }
        @media print { html, body { background: none } .sheet { margin: 0; box-shadow: none } .no-print { display: none !important } }
      `}</style>
      <div className="bar no-print" style={{ paddingTop: 24 }}><PrintButton /></div>

      <main className="sheet">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6.3mm' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-transparent.png" alt="Lagomplan" style={{ height: '9.5mm', width: 'auto', display: 'block' }} />
            <div style={{ fontFamily: MONO, fontSize: '3.2mm' }}>ES · EN</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.6mm' }}>
            <div style={{ fontFamily: MONO, fontSize: '3.2mm', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Guía de barrio</div>
            <h1 style={{ margin: 0, fontSize: '10mm', lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.025em', textWrap: 'balance' }}>Tu guía de {ZONE_LABEL[zone]}</h1>
            <p style={{ margin: 0, fontSize: '3.7mm', lineHeight: 1.5, fontWeight: 500 }}>Dónde comer, qué hacer y cómo moverte. Solo lugares verificados.</p>
            <p style={{ margin: 0, fontSize: '3.2mm', lineHeight: 1.5 }}>Where to eat, what to do and how to get around. Verified places only.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4.2mm' }}>
          <div className="qrbox" role="img" aria-label="Código QR de la guía" dangerouslySetInnerHTML={{ __html: svg }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6mm', minWidth: 0 }}>
            <div style={{ fontSize: '4mm', lineHeight: 1.25, fontWeight: 700 }}>Escanea con tu cámara</div>
            <div style={{ fontSize: '3.2mm', lineHeight: 1.4 }}>Scan with your camera</div>
            <div style={{ fontFamily: MONO, fontSize: '3.2mm', lineHeight: 1.4 }}>Sin app. Sin registro.</div>
          </div>
        </div>
      </main>
    </>
  )
}
