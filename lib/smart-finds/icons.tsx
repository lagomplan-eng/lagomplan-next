/**
 * lib/smart-finds/icons.tsx
 *
 * 28 SVG product icons used on the Smart Finds Familias page. Each entry
 * is a function `(color: string) => JSX.Element` so callers can re-tint
 * the icon per surface (kit cards tint with PINE; future variants might
 * tint differently).
 *
 * Icons were authored in prototypes/smart-finds-v4.jsx — transcribed
 * here verbatim so paths stay byte-identical to the design source.
 *
 * Size: 44×44 default at 64-unit viewBox. The container (IconZone)
 * controls outer placement; the SVG only knows about its own glyph.
 *
 * Stateless — safe in Server Components.
 */

import type { JSX } from 'react'

export type IconKey =
  | 'doona'        | 'stroller'     | 'carrier'      | 'suitcase'
  | 'airtag'       | 'backpack'     | 'pouches'      | 'journal'
  | 'ghost'        | 'magnetic'     | 'crayons'      | 'cards'
  | 'headphones'   | 'tablet'       | 'snackspinner' | 'driedfruit'
  | 'crackers'     | 'bottle'       | 'wipes'        | 'neckpillow'
  | 'toy'          | 'blanket'      | 'tent'         | 'sunscreen'
  | 'float'        | 'mat'          | 'diaper'

export const ICONS: Record<IconKey, (color: string) => JSX.Element> = {
  doona: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <rect x="10" y="20" width="36" height="20" rx="10" stroke={c} strokeWidth="2.5" />
      <rect x="20" y="12" width="16" height="10" rx="4" stroke={c} strokeWidth="2.5" />
      <circle cx="18" cy="42" r="5" stroke={c} strokeWidth="2.5" />
      <circle cx="46" cy="42" r="5" stroke={c} strokeWidth="2.5" />
      <line x1="46" y1="20" x2="52" y2="12" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  stroller: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <path d="M14 14 L14 36 Q14 44 22 44 L44 44" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="22" cy="50" r="5" stroke={c} strokeWidth="2.5" />
      <circle cx="44" cy="50" r="5" stroke={c} strokeWidth="2.5" />
      <path d="M14 22 L44 22 L44 36 Q44 44 36 44" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line x1="8" y1="14" x2="20" y2="14" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  carrier: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <circle cx="32" cy="14" r="7" stroke={c} strokeWidth="2.5" />
      <path d="M20 28 Q20 22 32 22 Q44 22 44 28 L44 48 L20 48 Z" stroke={c} strokeWidth="2.5" fill="none" />
      <circle cx="32" cy="34" r="6" stroke={c} strokeWidth="2" />
      <line x1="20" y1="36" x2="8" y2="44" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="36" x2="56" y2="44" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  suitcase: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <rect x="10" y="20" width="44" height="34" rx="3" stroke={c} strokeWidth="2.5" />
      <rect x="22" y="13" width="20" height="9" rx="3" stroke={c} strokeWidth="2.5" />
      <line x1="10" y1="34" x2="54" y2="34" stroke={c} strokeWidth="2" strokeDasharray="4 3" />
      <circle cx="20" cy="56" r="3" stroke={c} strokeWidth="2" />
      <circle cx="44" cy="56" r="3" stroke={c} strokeWidth="2" />
    </svg>
  ),
  airtag: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <circle cx="32" cy="32" r="14" stroke={c} strokeWidth="2.5" />
      <circle cx="32" cy="32" r="5" fill={c} />
      <path d="M18 32 Q18 18 32 18" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".4" />
      <path d="M46 32 Q46 46 32 46" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".4" />
      <circle cx="32" cy="14" r="3" stroke={c} strokeWidth="2" />
    </svg>
  ),
  backpack: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <path d="M20 14 Q20 8 32 8 Q44 8 44 14 L44 52 Q44 56 40 56 L24 56 Q20 56 20 52 Z" stroke={c} strokeWidth="2.5" fill="none" />
      <path d="M26 8 Q26 4 32 4 Q38 4 38 8" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line x1="20" y1="30" x2="44" y2="30" stroke={c} strokeWidth="2" />
      <rect x="26" y="34" width="12" height="10" rx="2" stroke={c} strokeWidth="2" />
      <path d="M14 16 Q10 16 10 20 L10 44 Q10 48 14 48 L20 48" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M50 16 Q54 16 54 20 L54 44 Q54 48 50 48 L44 48" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  ),
  pouches: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <rect x="8" y="20" width="28" height="36" rx="3" stroke={c} strokeWidth="2.5" />
      <line x1="8" y1="28" x2="36" y2="28" stroke={c} strokeWidth="2" />
      <line x1="16" y1="24" x2="28" y2="24" stroke={c} strokeWidth="3" strokeLinecap="round" />
      <rect x="28" y="10" width="28" height="36" rx="3" stroke={c} strokeWidth="2" opacity=".5" />
      <line x1="28" y1="18" x2="56" y2="18" stroke={c} strokeWidth="2" opacity=".5" />
      <line x1="36" y1="14" x2="48" y2="14" stroke={c} strokeWidth="3" strokeLinecap="round" opacity=".5" />
    </svg>
  ),
  journal: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <rect x="14" y="8" width="36" height="48" rx="3" stroke={c} strokeWidth="2.5" />
      <line x1="22" y1="20" x2="42" y2="20" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="28" x2="42" y2="28" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="36" x2="34" y2="36" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <rect x="8" y="8" width="6" height="48" rx="3" fill={`${c}20`} stroke={c} strokeWidth="1.5" />
    </svg>
  ),
  ghost: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <path d="M16 28 Q16 14 32 14 Q48 14 48 28 L48 52 L42 46 L36 52 L30 46 L24 52 L18 46 L16 52 Z" stroke={c} strokeWidth="2.5" fill="none" />
      <circle cx="26" cy="30" r="3.5" fill={c} />
      <circle cx="38" cy="30" r="3.5" fill={c} />
      <path d="M26 38 Q32 42 38 38" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  ),
  magnetic: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <rect x="10" y="10" width="18" height="18" rx="2" stroke={c} strokeWidth="2.5" fill={`${c}10`} />
      <rect x="36" y="10" width="18" height="18" rx="2" stroke={c} strokeWidth="2.5" fill={`${c}10`} />
      <rect x="10" y="36" width="18" height="18" rx="2" stroke={c} strokeWidth="2.5" fill={`${c}10`} />
      <rect x="36" y="36" width="18" height="18" rx="2" stroke={c} strokeWidth="2.5" fill={`${c}10`} />
      <circle cx="32" cy="32" r="4" fill={c} />
      <line x1="28" y1="32" x2="24" y2="32" stroke={c} strokeWidth="2.5" />
      <line x1="36" y1="32" x2="40" y2="32" stroke={c} strokeWidth="2.5" />
      <line x1="32" y1="28" x2="32" y2="24" stroke={c} strokeWidth="2.5" />
      <line x1="32" y1="36" x2="32" y2="40" stroke={c} strokeWidth="2.5" />
    </svg>
  ),
  crayons: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <path d="M24 12 L28 8 L36 8 L40 12 L40 48 L24 48 Z" stroke={c} strokeWidth="2.5" fill="none" />
      <line x1="24" y1="18" x2="40" y2="18" stroke={c} strokeWidth="2" />
      <path d="M24 48 L28 56 L32 52 L36 56 L40 48" stroke={c} strokeWidth="2.5" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  cards: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <rect x="8" y="14" width="34" height="44" rx="3" stroke={c} strokeWidth="2.5" fill="none" />
      <rect x="22" y="6" width="34" height="44" rx="3" stroke={c} strokeWidth="2" opacity=".4" fill="none" />
      <circle cx="25" cy="30" r="7" stroke={c} strokeWidth="2" />
      <line x1="14" y1="44" x2="34" y2="44" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5" />
    </svg>
  ),
  headphones: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <path d="M14 34 Q14 18 32 18 Q50 18 50 34" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <rect x="8" y="32" width="12" height="18" rx="5" stroke={c} strokeWidth="2.5" />
      <rect x="44" y="32" width="12" height="18" rx="5" stroke={c} strokeWidth="2.5" />
    </svg>
  ),
  tablet: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <rect x="12" y="8" width="40" height="48" rx="5" stroke={c} strokeWidth="2.5" />
      <rect x="17" y="14" width="30" height="34" rx="2" stroke={c} strokeWidth="2" fill={`${c}10`} />
      <circle cx="32" cy="53" r="2" fill={c} opacity=".4" />
      <path d="M24 28 L30 24 L30 32 Z" fill={c} opacity=".6" />
    </svg>
  ),
  snackspinner: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <circle cx="32" cy="32" r="22" stroke={c} strokeWidth="2.5" />
      <circle cx="32" cy="32" r="6" stroke={c} strokeWidth="2.5" />
      <line x1="32" y1="10" x2="32" y2="26" stroke={c} strokeWidth="2" />
      <line x1="32" y1="38" x2="32" y2="54" stroke={c} strokeWidth="2" />
      <line x1="10" y1="32" x2="26" y2="32" stroke={c} strokeWidth="2" />
      <line x1="38" y1="32" x2="54" y2="32" stroke={c} strokeWidth="2" />
      <circle cx="32" cy="10" r="3" fill={c} />
      <circle cx="32" cy="54" r="3" fill={c} />
      <circle cx="10" cy="32" r="3" fill={c} />
      <circle cx="54" cy="32" r="3" fill={c} />
    </svg>
  ),
  driedfruit: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <ellipse cx="22" cy="36" rx="10" ry="13" stroke={c} strokeWidth="2.5" />
      <ellipse cx="42" cy="34" rx="9" ry="11" stroke={c} strokeWidth="2.5" />
      <path d="M22 23 Q24 16 28 14" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <path d="M42 23 Q44 17 40 14" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  crackers: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <rect x="10" y="10" width="20" height="20" rx="2" stroke={c} strokeWidth="2.5" />
      <rect x="34" y="10" width="20" height="20" rx="2" stroke={c} strokeWidth="2.5" />
      <rect x="10" y="34" width="20" height="20" rx="2" stroke={c} strokeWidth="2.5" />
      <rect x="34" y="34" width="20" height="20" rx="2" stroke={c} strokeWidth="2.5" />
      <circle cx="20" cy="20" r="2" fill={c} opacity=".35" />
      <circle cx="44" cy="20" r="2" fill={c} opacity=".35" />
      <circle cx="20" cy="44" r="2" fill={c} opacity=".35" />
      <circle cx="44" cy="44" r="2" fill={c} opacity=".35" />
    </svg>
  ),
  bottle: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <path d="M24 14 L24 10 L40 10 L40 14 Q46 18 46 26 L46 50 Q46 54 42 54 L22 54 Q18 54 18 50 L18 26 Q18 18 24 14 Z" stroke={c} strokeWidth="2.5" fill="none" />
      <line x1="18" y1="36" x2="46" y2="36" stroke={c} strokeWidth="2" strokeDasharray="4 3" opacity=".4" />
      <line x1="26" y1="10" x2="38" y2="10" stroke={c} strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  wipes: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <rect x="10" y="16" width="44" height="36" rx="5" stroke={c} strokeWidth="2.5" />
      <path d="M10 28 L54 28" stroke={c} strokeWidth="2" />
      <path d="M26 16 L26 28" stroke={c} strokeWidth="2" />
      <path d="M26 20 Q32 14 38 20" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line x1="18" y1="38" x2="46" y2="38" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5" />
    </svg>
  ),
  neckpillow: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <path d="M16 32 Q16 14 32 14 Q48 14 48 32 Q48 50 32 50 Q16 50 16 32 Z" stroke={c} strokeWidth="2.5" fill="none" />
      <ellipse cx="32" cy="32" rx="8" ry="10" stroke={c} strokeWidth="2.5" fill={`${c}10`} />
      <path d="M20 22 Q24 18 32 18" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".4" />
    </svg>
  ),
  toy: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <circle cx="32" cy="28" r="14" stroke={c} strokeWidth="2.5" />
      <circle cx="26" cy="24" r="3" fill={c} opacity=".7" />
      <circle cx="38" cy="24" r="3" fill={c} opacity=".7" />
      <path d="M26 34 Q32 38 38 34" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M20 14 Q16 8 22 8 Q28 8 24 14" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <path d="M44 14 Q48 8 42 8 Q36 8 40 14" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  blanket: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <path d="M10 14 Q10 10 14 10 L50 10 Q54 10 54 14 L54 42 Q54 46 50 50 L32 56 L14 50 Q10 46 10 42 Z" stroke={c} strokeWidth="2.5" fill="none" />
      <path d="M10 22 L54 22" stroke={c} strokeWidth="1.5" opacity=".25" />
      <path d="M10 30 L54 30" stroke={c} strokeWidth="1.5" opacity=".25" />
      <path d="M10 38 L54 38" stroke={c} strokeWidth="1.5" opacity=".25" />
    </svg>
  ),
  tent: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <path d="M8 48 L32 12 L56 48 Z" stroke={c} strokeWidth="2.5" fill={`${c}10`} />
      <path d="M22 48 L32 32 L42 48 Z" stroke={c} strokeWidth="2" fill={`${c}20`} />
      <line x1="32" y1="12" x2="32" y2="6" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="8" y1="48" x2="56" y2="48" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  sunscreen: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <rect x="20" y="20" width="24" height="36" rx="5" stroke={c} strokeWidth="2.5" />
      <rect x="24" y="13" width="16" height="9" rx="3" stroke={c} strokeWidth="2.5" />
      <line x1="26" y1="30" x2="38" y2="30" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5" />
      <line x1="26" y1="36" x2="38" y2="36" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5" />
      <path d="M32 8 L32 4 M40 10 L43 7 M44 18 L48 18" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".35" />
    </svg>
  ),
  float: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <ellipse cx="32" cy="36" rx="22" ry="14" stroke={c} strokeWidth="2.5" />
      <ellipse cx="32" cy="36" rx="10" ry="6" stroke={c} strokeWidth="2.5" />
      <path d="M26 22 Q32 14 38 22" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="13" x2="32" y2="8" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  mat: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <rect x="8" y="20" width="48" height="28" rx="3" stroke={c} strokeWidth="2.5" />
      <line x1="8" y1="28" x2="56" y2="28" stroke={c} strokeWidth="1.5" strokeDasharray="4 4" opacity=".4" />
      <line x1="8" y1="36" x2="56" y2="36" stroke={c} strokeWidth="1.5" strokeDasharray="4 4" opacity=".4" />
      <line x1="22" y1="20" x2="22" y2="48" stroke={c} strokeWidth="1.5" strokeDasharray="4 4" opacity=".4" />
      <line x1="42" y1="20" x2="42" y2="48" stroke={c} strokeWidth="1.5" strokeDasharray="4 4" opacity=".4" />
    </svg>
  ),
  diaper: (c) => (
    <svg viewBox="0 0 64 64" fill="none" width={44} height={44}>
      <path d="M10 20 Q10 16 14 16 L50 16 Q54 16 54 20 L54 44 Q54 48 50 48 L14 48 Q10 48 10 44 Z" stroke={c} strokeWidth="2.5" />
      <path d="M10 32 Q20 24 32 32 Q44 40 54 32" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M22 16 L18 10 Q18 8 22 8 L42 8 Q46 8 46 10 L42 16" stroke={c} strokeWidth="2" />
      <circle cx="16" cy="38" r="3" stroke={c} strokeWidth="2" />
      <circle cx="48" cy="38" r="3" stroke={c} strokeWidth="2" />
    </svg>
  ),
}
