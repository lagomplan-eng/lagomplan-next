// components/ui/index.tsx
// Shared UI primitives used across all pages

// ─── SectionLabel ────────────────────────────────────────────────
// The "01 — Texto" pattern used in every section header
export function SectionLabel({ n, text }: { n: string; text: string }) {
  return (
    <p className="font-mono text-[9px] tracking-[2px] text-[#2D6B57] uppercase mb-4">
      {n} — {text}
    </p>
  )
}

// ─── GuideCard ───────────────────────────────────────────────────
// Used on home (featured guides) + /guias index
interface GuideCardProps {
  slug:  string
  title: string
  tag:   string
  img:   string
  href:  string
}

export function GuideCard({ slug, title, tag, img, href }: GuideCardProps) {
  return (
    <a href={href} className="group block">
      <div className="aspect-[4/3] bg-[#FFFFF] overflow-hidden mb-3 rounded-[2px] relative">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <p className="font-mono text-[9px] tracking-[1.5px] text-[#2D6B57] uppercase mb-1">
        {tag}
      </p>
      <h3 className="font-sans text-[17px] text-[#0F1A16] font-semibold leading-snug">
        {title}
      </h3>
    </a>
  )
}

// ─── TripCard ────────────────────────────────────────────────────
// Used on /mis-viajes dashboard — matches existing Webflow card pattern
interface TripCardProps {
  title:       string
  destination: string
  createdAt:   string
  href:        string
}

export function TripCard({ title, destination, createdAt, href }: TripCardProps) {
  const initial = destination ? destination[0].toUpperCase() : 'V'

  return (
    <a href={href} className="group block bg-[#FDFCF9] border border-[#C8D9D3] rounded-[3px] overflow-hidden hover:border-[#1B4D3E] transition-colors">
      {/* Green header with destination initial — matches existing pattern */}
      <div className="bg-[#1B4D3E] h-16 flex items-center justify-center relative overflow-hidden">
        <span className="font-sans text-[64px] font-bold text-[#F4F0E8] opacity-[0.15] leading-none select-none absolute">
          {initial}
        </span>
      </div>
      <div className="p-4">
        <p className="font-mono text-[9px] tracking-[1.5px] text-[#2D6B57] uppercase mb-1">
          {destination}
        </p>
        <h3 className="font-sans text-[16px] text-[#0F1A16] font-semibold mb-2">
          {title}
        </h3>
        <p className="font-mono text-[9px] text-[#A0A0A0] tracking-wide">
          {createdAt}
        </p>
      </div>
    </a>
  )
}

// ─── TestimonialCard ─────────────────────────────────────────────
interface TestimonialCardProps {
  quote:  string
  name:   string
  role:   string
  initial: string
}

export function TestimonialCard({ quote, name, role, initial }: TestimonialCardProps) {
  return (
    <div className="bg-[#FDFCF9] border border-[#C8D9D3] rounded-[3px] p-6">
      <p className="font-mono text-[10px] tracking-widest text-[#6EBD9F] mb-3">
        ★★★★★
      </p>
      <p className="font-sans text-[15px] text-[#0F1A16] leading-[1.55] mb-5">
        "{quote}"
      </p>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#C8D9D3] flex items-center justify-center font-sans text-[12px] font-bold text-[#1B4D3E]">
          {initial}
        </div>
        <div>
          <p className="font-sans text-[13px] font-medium text-[#0F1A16]">{name}</p>
          <p className="font-mono text-[9px] tracking-wide text-[#2D6B57]">{role}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Button ──────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  as?: 'button' | 'a'
  href?: string
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const base = 'font-mono text-[12px] tracking-[1.5px] px-6 py-3 transition-colors inline-block text-center'

  const variants: Record<ButtonVariant, string> = {
    primary:   'bg-[#1B4D3E] text-[#F4F0E8] hover:bg-[#2D6B57]',
    secondary: 'border border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-[#F4F0E8]',
    ghost:     'border border-[#C8D9D3] text-[#2D6B57] hover:border-[#1B4D3E]',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
