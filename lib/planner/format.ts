/**
 * lib/planner/format.ts
 *
 * Display formatters for planner content. Storage stays canonical
 * (raw form input, lowercase, etc.) so trip rows round-trip cleanly
 * through the DB; these helpers transform at render time.
 */

/**
 * Title-cases a destination string for display.
 *
 *   "oaxaca"                 → "Oaxaca"
 *   "mexico city"            → "Mexico City"
 *   "ciudad de mexico"       → "Ciudad de Mexico"
 *   "san miguel de allende"  → "San Miguel de Allende"
 *
 * Spanish particles (de / del / la / las / los / el / y) stay
 * lowercase except when they're the first word — handles "La Paz",
 * "El Salvador" correctly while keeping "San Miguel de Allende"
 * readable.
 *
 * Doesn't restore accents (we don't ship a city dictionary). For
 * accent fidelity in canonical output, future work is to feed
 * destinations through a Places-backed normalizer at form submit
 * time and store the canonical name in the DB.
 */
const LOWERCASE_PARTICLES = new Set([
  'de', 'del', 'la', 'las', 'los', 'el', 'y', 'a',
])

export function titleCaseCity(input: string | null | undefined): string {
  if (!input) return ''
  const cleaned = input.trim()
  if (!cleaned) return ''
  return cleaned
    .toLowerCase()
    .split(/\s+/)
    .map((word, i) => {
      if (i > 0 && LOWERCASE_PARTICLES.has(word)) return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}
