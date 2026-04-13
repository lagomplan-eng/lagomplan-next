'use client'

interface PaywallModalProps {
  open: boolean
  onSelect: (choice: 'trip-1' | 'trip-5' | 'trip-10' | 'subscription') => void
}

export default function PaywallModal({ open, onSelect }: PaywallModalProps) {
  if (!open) return null

  const plans = [
    {
      id: 'trip-5' as const,
      label: '5 viajes',
      price: '$149 MXN',
      usd: '~$8.75 USD',
      badge: '⭐ Más popular',
      highlight: true,
    },
    {
      id: 'trip-10' as const,
      label: '10 viajes',
      price: '$249 MXN',
      usd: '~$14.60 USD',
      badge: '💼 Sin suscripción',
      highlight: false,
    },
    {
      id: 'trip-1' as const,
      label: '1 viaje',
      price: '$39 MXN',
      usd: '~$2.30 USD',
      badge: null,
      highlight: false,
    },
  ]

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && void 0}
    >
      {/* Sheet */}
      <div className="w-full max-w-[420px] bg-white rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,.18)] overflow-hidden">

        {/* Header */}
        <div className="bg-[#0F3A33] px-6 pt-8 pb-6 text-center">
          <h2 className="font-playfair text-[26px] font-bold text-white leading-tight tracking-[-0.5px]">
            Tu siguiente viaje está listo ✨
          </h2>
          <p className="font-sans text-[13px] text-[#A8C5BE] mt-2 leading-relaxed">
            Has usado tus viajes gratuitos. Elige cómo quieres seguir explorando.
          </p>
        </div>

        {/* Plans */}
        <div className="px-5 pt-5 pb-3 flex flex-col gap-3">

          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelect(plan.id)}
              className={[
                'relative w-full flex items-center justify-between px-4 py-3.5 rounded-[12px] border transition-all text-left',
                plan.highlight
                  ? 'bg-[#E4EFEC] border-[#0F3A33] shadow-[0_2px_12px_rgba(15,58,51,.12)]'
                  : 'bg-white border-[rgba(107,143,134,.28)] hover:border-[#0F3A33] hover:bg-[#F7F3EE]',
              ].join(' ')}
            >
              {/* Left */}
              <div className="flex flex-col gap-0.5">
                <span className="font-sans text-[14px] font-semibold text-[#0F3A33]">
                  {plan.label}
                </span>
                {plan.badge && (
                  <span className="font-sans text-[10px] text-[#2D6B57] font-medium">
                    {plan.badge}
                  </span>
                )}
              </div>

              {/* Right */}
              <div className="flex flex-col items-end gap-0.5">
                <span className="font-mono text-[15px] font-bold text-[#0F3A33]">
                  {plan.price}
                </span>
                <span className="font-mono text-[10px] text-[#6B8F86]">
                  {plan.usd}
                </span>
              </div>
            </button>
          ))}

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 border-t border-[#EDE9E4]" />
            <span className="font-sans text-[11px] text-[#A0A0A0] tracking-[0.5px]">
              o desbloquea todo
            </span>
            <div className="flex-1 border-t border-[#EDE9E4]" />
          </div>

          {/* Subscription card */}
          <button
            type="button"
            onClick={() => onSelect('subscription')}
            className="relative w-full flex items-center justify-between px-4 py-3.5 rounded-[12px] border border-[#0F3A33] bg-[#0F3A33] hover:bg-[#1a4a42] transition-all text-left"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-[14px] font-semibold text-white">
                Explorer
              </span>
              <span className="font-sans text-[10px] text-[#A8C5BE]">
                🔥 Mejor valor &nbsp;·&nbsp; Viajes ilimitados ✨
              </span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="font-mono text-[15px] font-bold text-white">
                $199 MXN
              </span>
              <span className="font-mono text-[10px] text-[#6B9E94]">
                /mes · ~$11.50 USD
              </span>
            </div>
          </button>

        </div>

        {/* Footer note */}
        <p className="text-center font-sans text-[10px] text-[#BDBDBD] pb-5 px-5">
          Pagos seguros · Sin cargos ocultos · Cancela cuando quieras
        </p>

      </div>
    </div>
  )
}
