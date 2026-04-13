'use client'

import { useState } from 'react'
import { Link, useRouter } from '../../lib/navigation'
import { getSupabaseBrowser } from '../../lib/supabase/client'

export default function SignupForm() {
  const router = useRouter()

  const [nombre,    setNombre]    = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [accepted,  setAccepted]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!accepted) {
      setError('Debes aceptar los términos de servicio para continuar.')
      return
    }
    setLoading(true)
    setError(null)

    const { data, error: authError } = await getSupabaseBrowser().auth.signUp({
      email,
      password,
      options: { data: { full_name: nombre.trim() } },
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    // Auto-confirm OFF → Supabase sends a confirmation email, no session yet
    if (!data.session) {
      setConfirmed(true)
      return
    }

    // Auto-confirm ON → session returned immediately, redirect like login
    const stored = sessionStorage.getItem('redirectAfterLogin')
    if (stored) {
      sessionStorage.removeItem('redirectAfterLogin')
      const cleanPath = stored.replace(/^\/(en|es)(?=\/|$)/, '')
      router.push((cleanPath || '/') as any)
    } else {
      router.push('/')
    }
  }

  if (confirmed) {
    return (
      <div className="mt-8 flex flex-col gap-3">
        <p className="font-sans text-[15px] text-[#1C1C1A]">
          ¡Listo! Revisa tu correo electrónico y haz clic en el enlace para confirmar tu cuenta.
        </p>
        <p className="font-sans text-[13px] text-[#7A7A76]">
          Una vez confirmada podrás iniciar sesión y guardar tus viajes.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 max-w-[360px]">
      {/* Nombre */}
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        required
        className="border border-[#CEC8C0] rounded-[8px] px-4 py-3 text-[14px] bg-white outline-none focus:border-[#0F3A33]"
      />

      {/* Correo electrónico */}
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="border border-[#CEC8C0] rounded-[8px] px-4 py-3 text-[14px] bg-white outline-none focus:border-[#0F3A33]"
      />

      {/* Contraseña */}
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        minLength={8}
        className="border border-[#CEC8C0] rounded-[8px] px-4 py-3 text-[14px] bg-white outline-none focus:border-[#0F3A33]"
      />

      {/* Términos */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={e => setAccepted(e.target.checked)}
          className="mt-[3px] h-4 w-4 shrink-0 accent-[#0F3A33] cursor-pointer"
        />
        <span className="font-sans text-[13px] text-[#3D3D3A] leading-relaxed">
          Acepto los{' '}
          <Link
            href="/privacy"
            className="text-[#0F3A33] underline underline-offset-2 hover:opacity-70 transition-opacity"
            target="_blank"
          >
            términos de servicio y la política de privacidad
          </Link>
        </span>
      </label>

      {error && (
        <p className="text-[13px] text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-[#0F3A33] text-white font-mono text-[11px] tracking-[.08em] uppercase px-4 py-3 rounded-[8px] disabled:opacity-50"
      >
        {loading ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>

      <p className="font-sans text-[13px] text-[#7A7A76] text-center mt-1">
        ¿Ya tienes una cuenta?{' '}
        <Link
          href="/login"
          className="text-[#0F3A33] font-medium hover:underline"
        >
          Iniciar sesión →
        </Link>
      </p>
    </form>
  )
}
