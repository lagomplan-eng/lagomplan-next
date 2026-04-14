'use client'

import { useState } from 'react'

const copy = {
  es: {
    nombre:        'Nombre',
    email:         'Correo electrónico',
    asunto:        'Asunto (opcional)',
    mensaje:       'Mensaje',
    submit:        'Enviar mensaje',
    submitting:    'Enviando…',
    success:       'Gracias, te responderemos pronto.',
    errorGeneric:  'Algo salió mal. Inténtalo de nuevo.',
  },
  en: {
    nombre:        'Name',
    email:         'Email',
    asunto:        'Subject (optional)',
    mensaje:       'Message',
    submit:        'Send message',
    submitting:    'Sending…',
    success:       'Thanks, we will get back to you soon.',
    errorGeneric:  'Something went wrong. Please try again.',
  },
}

const inputClass =
  'w-full border border-[#CEC8C0] rounded-[8px] px-4 py-3 font-sans text-[14px] text-[#1C1C1A] bg-white outline-none focus:border-[#0F3A33] placeholder-[#A8A29E] transition-colors'

export default function ContactForm({ locale }: { locale: 'es' | 'en' }) {
  const t = copy[locale] ?? copy.es

  const [nombre,  setNombre]  = useState('')
  const [email,   setEmail]   = useState('')
  const [asunto,  setAsunto]  = useState('')
  const [mensaje, setMensaje] = useState('')
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:    nombre.trim(),
          email:   email.trim(),
          subject: asunto.trim() || undefined,
          message: mensaje.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? t.errorGeneric)
      }

      setSent(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.errorGeneric
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // ── Success state ────────────────────────────────────────────────────────
  if (sent) {
    return (
      <div
        className="rounded-[10px] px-6 py-5 font-sans text-[14px] text-[#0F3A33] leading-[1.7]"
        style={{ background: 'rgba(15,58,51,0.07)', border: '1px solid rgba(15,58,51,0.12)' }}
      >
        {t.success}
      </div>
    )
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[12px] font-medium text-[#0F3A33] tracking-[0.04em] uppercase">
            {t.nombre} <span className="text-[#E1615B]">*</span>
          </label>
          <input
            type="text"
            placeholder={t.nombre}
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[12px] font-medium text-[#0F3A33] tracking-[0.04em] uppercase">
            {t.email} <span className="text-[#E1615B]">*</span>
          </label>
          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-[12px] font-medium text-[#0F3A33] tracking-[0.04em] uppercase">
          {t.asunto}
        </label>
        <input
          type="text"
          placeholder={t.asunto}
          value={asunto}
          onChange={e => setAsunto(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-[12px] font-medium text-[#0F3A33] tracking-[0.04em] uppercase">
          {t.mensaje} <span className="text-[#E1615B]">*</span>
        </label>
        <textarea
          placeholder={t.mensaje}
          value={mensaje}
          onChange={e => setMensaje(e.target.value)}
          required
          rows={6}
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && (
        <p className="font-sans text-[13px] text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-solid self-start disabled:opacity-50"
      >
        {loading ? t.submitting : t.submit}
      </button>
    </form>
  )
}
