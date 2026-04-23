'use client'
/**
 * components/trips/TripShareWall.tsx
 *
 * Shown to unauthenticated users who open a shared trip link.
 * Displays a minimal preview (destination, duration) and prompts
 * them to sign up or log in. Sets sessionStorage.redirectAfterLogin
 * so LoginForm / SignupForm can redirect back after auth.
 */

import { useRouter } from '../../lib/navigation'

type Props = {
  locale:      'es' | 'en'
  destination: string
  duration:    number | null
  currentPath: string   // e.g. "/es/trips/share/abc123" — stored for post-auth redirect
}

export default function TripShareWall({ locale, destination, duration, currentPath }: Props) {
  const isES   = locale === 'es'
  const router = useRouter()

  function storeRedirect() {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', currentPath)
    }
  }

  function goToSignup() {
    storeRedirect()
    router.push({ pathname: '/signup' })
  }

  function goToLogin() {
    storeRedirect()
    router.push({ pathname: '/login' })
  }

  const durationLabel = duration
    ? `${duration} ${isES
        ? (duration === 1 ? 'día' : 'días')
        : (duration === 1 ? 'day' : 'days')}`
    : null

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ paddingTop: '72px', background: '#F7F4EF' }}
    >
      <div className="w-full max-w-[420px]">

        <div
          className="rounded-[28px] overflow-hidden"
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 32px rgba(15,58,51,0.09)',
          }}
        >
          {/* ── Header band ─────────────────────────────────────── */}
          <div
            className="relative overflow-hidden px-8 pt-8 pb-8"
            style={{ background: 'linear-gradient(145deg, #0e352e 0%, #1c4f45 100%)' }}
          >
            {/* Watermark */}
            <span
              aria-hidden
              className="absolute right-1 bottom-[-28px] font-sans select-none pointer-events-none leading-none"
              style={{ fontSize: 112, fontWeight: 800, color: 'rgba(255,255,255,.04)' }}
            >
              {destination.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')}
            </span>

            <p
              className="font-mono text-[9px] tracking-[.2em] uppercase mb-5"
              style={{ color: 'rgba(255,255,255,.38)' }}
            >
              Lagomplan · {isES ? 'Viaje compartido' : 'Shared trip'}
            </p>

            <h1
              className="font-sans font-bold leading-[1.05] tracking-[-0.02em] text-white mb-3"
              style={{ fontSize: 'clamp(26px, 6.5vw, 34px)' }}
            >
              {destination}
            </h1>

            {durationLabel && (
              <p
                className="font-mono text-[11px] tracking-[.06em]"
                style={{ color: 'rgba(255,255,255,.52)' }}
              >
                {durationLabel}
              </p>
            )}
          </div>

          {/* ── Body ────────────────────────────────────────────── */}
          <div className="px-8 pt-7 pb-6">
            <p
              className="font-mono text-[9px] tracking-[.18em] uppercase mb-4"
              style={{ color: '#6B8F86' }}
            >
              {isES ? 'Acceso privado' : 'Private access'}
            </p>

            <p
              className="font-sans text-[15px] leading-[1.8]"
              style={{ color: '#0F3A33', marginBottom: '24px' }}
            >
              {isES
                ? 'Este viaje fue compartido contigo. Crea una cuenta para ver el itinerario completo.'
                : 'This trip was shared with you. Sign up to view the full itinerary.'}
            </p>

            {/* Primary CTA */}
            <button
              onClick={goToSignup}
              className="w-full flex items-center justify-center font-mono text-[12px] tracking-[.07em] text-white rounded-[12px] py-[14px] mb-3 cursor-pointer"
              style={{ background: '#0F3A33', transition: 'background .2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#1c4f45')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0F3A33')}
            >
              {isES ? 'Crear cuenta gratis →' : 'Sign up free →'}
            </button>

            {/* Secondary CTA */}
            <button
              onClick={goToLogin}
              className="w-full flex items-center justify-center font-mono text-[11px] tracking-[.05em] rounded-[12px] py-[13px] cursor-pointer"
              style={{
                background: 'var(--sand)',
                color: 'rgba(15,58,51,0.72)',
                border: '1px solid var(--border)',
                transition: 'background .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e8e1d9')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--sand)')}
            >
              {isES ? 'Ya tengo cuenta — Iniciar sesión' : 'I have an account — Log in'}
            </button>
          </div>

          {/* ── Footer ──────────────────────────────────────────── */}
          <div
            className="px-8 py-5 text-center"
            style={{ borderTop: '1px solid #EDEBE6' }}
          >
            <p
              className="font-sans text-[12px] leading-snug"
              style={{ color: '#B8B5AF' }}
            >
              {isES ? 'Gratis · Sin tarjeta de crédito' : 'Free · No credit card required'}
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}
