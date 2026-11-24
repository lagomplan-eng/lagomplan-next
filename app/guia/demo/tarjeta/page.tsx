// app/guia/demo/tarjeta/page.tsx
//
// SAMPLE of the branded A6 card (105 × 148 mm) a paid property gets: the client's logo, name and brand colour on our fixed
// card, the QR to the property's own link, and "powered by Lagomplan". The demo QR points at the demo guide; a real
// property's card will encode its own /g/{code} link. Static, noindex.

import type { Metadata } from 'next'
import QRCode from 'qrcode'
import { CASA_LAGOM } from '../../../../content/guia/paid/casa-lagom'
import { BASE_URL } from '../../../../lib/seo'
import PrintButton from '../../../g/[code]/tarjeta/PrintButton'

export const metadata: Metadata = { title: `Tarjeta · ${CASA_LAGOM.name}`, robots: { index: false, follow: false } }

const MONO = "var(--font-mono), 'DM Mono', ui-monospace, monospace"

export default async function PaidDemoCardPage() {
  const c = CASA_LAGOM
  const svg = await QRCode.toString(`${BASE_URL}/guia/demo`, { type: 'svg', margin: 0, errorCorrectionLevel: 'M' })
  return (
    <>
      <style>{`
        @page { size: 105mm 148mm; margin: 0 }
        html, body { background: #e9e4dc; margin: 0 }
        .sheet { width: 105mm; height: 148mm; margin: 24px auto; background: #FFF9F3; color: #0F3A33; box-sizing: border-box;
          padding: 10.5mm; display: flex; flex-direction: column; justify-content: space-between; position: relative;
          font-family: var(--font-sans), Manrope, system-ui, sans-serif; box-shadow: 0 2px 18px rgba(0,0,0,.15) }
        .qrbox { background: #fff; border: 1px solid rgba(107,143,134,.45); border-radius: 3.2mm; padding: 3.2mm; flex: none; width: 33mm; height: 33mm; box-sizing: content-box }
        .qrbox svg { display: block; width: 100%; height: 100% }
        .bar { text-align: center; margin: 0 0 24px }
        @media print { html, body { background: none } .sheet { margin: 0; box-shadow: none } .no-print { display: none !important } }
      `}</style>
      <div className="bar no-print" style={{ paddingTop: 24 }}><PrintButton /></div>
      <main className="sheet">
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '2.2mm', background: c.brandColor }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6.3mm' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.logo} alt={c.name} style={{ height: '9.5mm', width: 'auto', display: 'block' }} />
            <div style={{ fontFamily: MONO, fontSize: '3.2mm' }}>ES · EN</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.6mm' }}>
            <div style={{ fontFamily: MONO, fontSize: '3.2mm', letterSpacing: '0.08em', textTransform: 'uppercase', color: c.brandColor }}>Guía de barrio</div>
            <h1 style={{ margin: 0, fontSize: '10mm', lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.025em', textWrap: 'balance' }}>Tu guía de Condesa</h1>
            <p style={{ margin: 0, fontSize: '3.7mm', lineHeight: 1.5, fontWeight: 500 }}>Dónde comer, qué hacer y cómo moverte. Solo lugares verificados.</p>
            <p style={{ margin: 0, fontSize: '3.2mm', lineHeight: 1.5 }}>Where to eat, what to do and how to get around. Verified places only.</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5mm' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4.2mm' }}>
            <div className="qrbox" role="img" aria-label="Código QR de la guía" dangerouslySetInnerHTML={{ __html: svg }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6mm', minWidth: 0 }}>
              <div style={{ fontSize: '4mm', lineHeight: 1.25, fontWeight: 700 }}>Escanea con tu cámara</div>
              <div style={{ fontSize: '3.2mm', lineHeight: 1.4 }}>Scan with your camera</div>
              <div style={{ fontFamily: MONO, fontSize: '3.2mm', lineHeight: 1.4 }}>Sin app. Sin registro.</div>
            </div>
          </div>
          <div style={{ fontFamily: MONO, fontSize: '2.8mm', letterSpacing: '0.06em', color: '#6B8F86' }}>powered by Lagomplan · tarjeta de ejemplo / sample card</div>
        </div>
      </main>
    </>
  )
}
