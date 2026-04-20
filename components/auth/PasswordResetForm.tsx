'use client'

import { useState, useEffect } from 'react'
import { getSupabaseBrowser } from '../../lib/supabase/client'

const copy = {
  es: {
    title:       'Establece tu nueva contraseña',
    placeholder: 'Nueva contraseña',
    submit:      'Guardar contraseña',
    submitting:  'Guardando…',
    success:     'Contraseña actualizada. Ya puedes iniciar sesión.',
    fallback:    'Algo salió mal. Inténtalo de nuevo.',
  },
  en: {
    title:       'Set your new password',
    placeholder: 'New password',
    submit:      'Save password',
    submitting:  'Saving…',
    success:     'Password updated. You can now log in.',
    fallback:    'Something went wrong. Please try again.',
  },
}

export function PasswordResetForm({ locale }: { locale: 'es' | 'en' }) {
  const t = copy[locale] ?? copy.en

  const [isRecovery, setIsRecovery] = useState(false)
  const [password,   setPassword]   = useState('')
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [done,       setDone]       = useState(false)

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log('[Account] auth event:', event)
      if (event === 'PASSWORD_RECOVERY') setIsRecovery(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!isRecovery) return null

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: updateErr } = await getSupabaseBrowser().auth.updateUser({ password })
    console.log('[Reset] updateUser result:', updateErr ?? 'ok')

    setLoading(false)
    if (updateErr) {
      setError(updateErr.message || t.fallback)
      return
    }
    setDone(true)
  }

  return (
    <div className="mt-10 max-w-[360px]">
      {done ? (
        <p className="font-sans text-[15px] text-[#1C1C1A]">{t.success}</p>
      ) : (
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <p className="font-sans text-[16px] font-semibold text-[#0F3A33]">{t.title}</p>
          <input
            type="password"
            placeholder={t.placeholder}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="border border-[#CEC8C0] rounded-[8px] px-4 py-3 text-[14px] bg-white outline-none focus:border-[#0F3A33]"
          />
          {error && <p className="text-[13px] text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0F3A33] text-white font-mono text-[11px] tracking-[.08em] uppercase px-4 py-3 rounded-[8px] disabled:opacity-50"
          >
            {loading ? t.submitting : t.submit}
          </button>
        </form>
      )}
    </div>
  )
}
