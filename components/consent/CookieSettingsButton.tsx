'use client'

/**
 * components/consent/CookieSettingsButton.tsx
 *
 * Tiny client component embedded in the Server Component footer.
 * Dispatches a CustomEvent that ConsentProvider listens for,
 * opening the preferences modal without prop drilling or context
 * threading through Server Components.
 */

export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('openCookieSettings'))}
      className="font-sans text-[11px] text-[#6B8F86] hover:text-[#0F3A33] transition-colors bg-transparent border-0 p-0 cursor-pointer"
    >
      {label}
    </button>
  )
}
