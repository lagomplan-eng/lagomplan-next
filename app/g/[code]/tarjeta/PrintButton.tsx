'use client'

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="no-print"
      style={{ font: 'inherit', fontWeight: 700, padding: '12px 22px', borderRadius: 8, border: 0, background: '#0F3A33', color: '#FFF9F3', cursor: 'pointer' }}>
      Guardar PDF / Imprimir
    </button>
  )
}
