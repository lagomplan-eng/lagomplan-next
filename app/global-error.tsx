'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <main style={{ padding: '64px 24px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#B33A3A', marginBottom: 12 }}>
            Fatal error
          </p>
          <h1 style={{ fontSize: 24, color: '#0F3A33', marginBottom: 12 }}>
            {error.message}
          </h1>
          <button
            onClick={reset}
            style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', background: '#0F3A33', color: '#FFF9F3', padding: '12px 20px', border: 'none', cursor: 'pointer' }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
