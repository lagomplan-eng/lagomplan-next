// app/g/[code]/tarjeta/not-found.tsx — the card exists only for approved (or paused) hotels. Shown inside the card
// layout; without it a missing card rendered a completely blank page.
export default function CardNotFound() {
  return (
    <main style={{ maxWidth: 420, margin: '15vh auto', padding: '0 24px', fontFamily: 'var(--font-sans), Manrope, system-ui, sans-serif', color: '#0F3A33' }}>
      <h1 style={{ fontSize: 24, margin: '0 0 12px' }}>Esta tarjeta no está disponible</h1>
      <p style={{ margin: '0 0 8px', lineHeight: 1.6 }}>La tarjeta se genera cuando aprobamos tu hotel. Si ya recibiste el correo de aprobación y ves este mensaje, escríbenos y lo revisamos.</p>
      <p style={{ margin: 0, lineHeight: 1.6, color: '#3E5F58' }}>This card is not available. It is created once your hotel is approved.</p>
    </main>
  )
}
