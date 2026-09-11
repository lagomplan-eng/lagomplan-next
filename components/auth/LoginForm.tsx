'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Link, useRouter } from '../../lib/navigation'
import { getSupabaseBrowser } from '../../lib/supabase/client'
import { ASYNC_THRESHOLD } from '../../lib/plan/limits'

// ── Contextual "why am I here" copy ──────────────────────────────────────────
// Every generation-flow redirect to /login (see TripResult.tsx's
// redirectToLoginWithReason) carries a `?reason=` so this bare form isn't a
// mystery bounce. Copy lives in messages/{es,en}.json under `authGate` (not
// hardcoded here) — `tripTooLarge` interpolates {threshold}, filled from
// ASYNC_THRESHOLD, the same constant TripResult's pre-flight guard reads, so
// raising the anon-visible threshold later is a one-line change in
// lib/plan/limits.ts, not a copy update here too.
type AuthGateKey = 'anonLimitReached' | 'notAuthenticated' | 'tripTooLarge'

const REASON_TO_AUTHGATE_KEY: Record<string, AuthGateKey> = {
  anon_limit_reached: 'anonLimitReached',
  not_authenticated:  'notAuthenticated',
  trip_too_large:     'tripTooLarge',
}

const copy = {
  es: {
    emailPlaceholder:    'Correo electrónico',
    passwordPlaceholder: 'Contraseña',
    submit:              'Entrar',
    submitting:          'Entrando…',
    forgotPassword:      '¿Olvidaste tu contraseña?',
    noAccount:           '¿No tienes cuenta?',
    signup:              'Crear cuenta →',
    resetTitle:          '¿Olvidaste tu contraseña?',
    resetDesc:           'Escribe tu correo y te enviaremos un enlace para restablecerla.',
    resetSubmit:         'Enviar enlace',
    resetSubmitting:     'Enviando…',
    resetSuccess:        'Revisa tu correo — te hemos enviado un enlace para restablecer tu contraseña.',
    backToLogin:         '← Volver a iniciar sesión',
  },
  en: {
    emailPlaceholder:    'Email',
    passwordPlaceholder: 'Password',
    submit:              'Log in',
    submitting:          'Logging in…',
    forgotPassword:      'Forgot your password?',
    noAccount:           "Don't have an account?",
    signup:              'Sign up →',
    resetTitle:          'Reset your password',
    resetDesc:           "Enter your email and we'll send you a reset link.",
    resetSubmit:         'Send link',
    resetSubmitting:     'Sending…',
    resetSuccess:        "Check your inbox — we've sent you a password reset link.",
    backToLogin:         '← Back to log in',
  },
}

export default function LoginForm() {
  const locale    = useLocale() as 'es' | 'en'
  const t         = copy[locale] ?? copy.es
  const tAuthGate = useTranslations('authGate')
  const router    = useRouter()

  const searchParams   = useSearchParams()
  const reason         = searchParams.get('reason')
  const authGateKey    = reason ? REASON_TO_AUTHGATE_KEY[reason] : undefined
  const reasonMessage  = authGateKey ? tAuthGate(authGateKey, { threshold: ASYNC_THRESHOLD }) : null

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  // Forgot-password state
  const [showReset,    setShowReset]    = useState(false)
  const [resetEmail,   setResetEmail]   = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError,   setResetError]   = useState<string | null>(null)
  const [resetSent,    setResetSent]    = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: authError } = await getSupabaseBrowser().auth.signInWithPassword({ email, password })
    console.log('🔥 LOGIN RESPONSE:', { data, authError })

    setLoading(false)
    if (authError) {
      setError(authError.message)
      return
    }

    const stored = sessionStorage.getItem('redirectAfterLogin')
    if (stored) {
      sessionStorage.removeItem('redirectAfterLogin')
      const cleanPath = stored.replace(/^\/(en|es)(?=\/|$)/, '')
      router.push((cleanPath || '/') as any)
    } else {
      router.push('/')
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setResetLoading(true)
    setResetError(null)

    const accountSegment = locale === 'es' ? 'cuenta' : 'account'
    const { error: resetErr } = await getSupabaseBrowser().auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/${locale}/${accountSegment}`,
    })
    console.log('[Reset] result:', resetErr ?? 'ok')

    setResetLoading(false)
    if (resetErr) {
      const raw = resetErr.message || ''
      const isJsonBlob = raw.trim().startsWith('{') || raw.trim().startsWith('[')
      setResetError(
        isJsonBlob || !raw
          ? (locale === 'es' ? 'Algo salió mal. Inténtalo de nuevo.' : 'Something went wrong. Please try again.')
          : raw
      )
      return
    }
    setResetSent(true)
  }

  // ── Forgot-password panel ────────────────────────────────────────────────────
  if (showReset) {
    return (
      <div className="mt-8 max-w-[360px] flex flex-col gap-4">
        {resetSent ? (
          <>
            <p className="font-sans text-[15px] text-[#1C1C1A]">{t.resetSuccess}</p>
            <button
              onClick={() => { setShowReset(false); setResetSent(false); setResetEmail('') }}
              className="font-sans text-[13px] text-[#0F3A33] font-medium hover:underline text-left"
            >
              {t.backToLogin}
            </button>
          </>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <p className="font-sans text-[14px] text-[#3D3D3A]">{t.resetDesc}</p>
            <input
              type="email"
              placeholder={t.emailPlaceholder}
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              required
              className="border border-[#CEC8C0] rounded-[8px] px-4 py-3 text-[14px] bg-white outline-none focus:border-[#0F3A33]"
            />
            {resetError && <p className="text-[13px] text-red-600">{resetError}</p>}
            <button
              type="submit"
              disabled={resetLoading}
              className="bg-[#0F3A33] text-white font-mono text-[11px] tracking-[.08em] uppercase px-4 py-3 rounded-[8px] disabled:opacity-50"
            >
              {resetLoading ? t.resetSubmitting : t.resetSubmit}
            </button>
            <button
              type="button"
              onClick={() => setShowReset(false)}
              className="font-sans text-[13px] text-[#0F3A33] font-medium hover:underline text-left"
            >
              {t.backToLogin}
            </button>
          </form>
        )}
      </div>
    )
  }

  // ── Login form ───────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 max-w-[360px]">
      {reasonMessage && (
        <p
          data-testid="login-reason-banner"
          className="font-sans text-[14px] text-[#3D3D3A] bg-[#F3EFE8] border border-[#E4DED4] rounded-[8px] px-4 py-3"
        >
          {reasonMessage}
        </p>
      )}
      <input
        type="email"
        placeholder={t.emailPlaceholder}
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="border border-[#CEC8C0] rounded-[8px] px-4 py-3 text-[14px] bg-white outline-none focus:border-[#0F3A33]"
      />

      <div className="flex flex-col gap-1.5">
        <input
          type="password"
          placeholder={t.passwordPlaceholder}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="border border-[#CEC8C0] rounded-[8px] px-4 py-3 text-[14px] bg-white outline-none focus:border-[#0F3A33]"
        />
        <button
          type="button"
          onClick={() => { setShowReset(true); setResetEmail(email) }}
          className="font-sans text-[12px] text-[#7A7A76] hover:text-[#0F3A33] transition-colors text-right"
        >
          {t.forgotPassword}
        </button>
      </div>

      {error && (
        <p className="text-[13px] text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-[#0F3A33] text-white font-mono text-[11px] tracking-[.08em] uppercase px-4 py-3 rounded-[8px] disabled:opacity-50"
      >
        {loading ? t.submitting : t.submit}
      </button>

      <p className="font-sans text-[13px] text-[#7A7A76] text-center mt-1">
        {t.noAccount}{' '}
        <Link
          href="/signup"
          className="text-[#0F3A33] font-medium hover:underline"
        >
          {t.signup}
        </Link>
      </p>
    </form>
  )
}
