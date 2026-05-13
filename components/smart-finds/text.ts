/**
 * components/smart-finds/text.ts
 *
 * Display-time text transforms. The catalog stores tag strings in
 * all-caps (the prototype's editorial marker style); the card UI
 * wants a softer subtitle look that sits closer to the rest of the
 * site's typography rhythm.
 *
 * Kept out of the data layer so the source string stays editable as
 * "the canonical marker" and the UI controls casing independently.
 */

/**
 * Lower-cases the string and capitalises the first character.
 * Idempotent. Preserves trailing punctuation.
 *
 *   "LA INVERSIÓN QUE SE PAGA SOLA" → "La inversión que se paga sola"
 *   "ENTRA EN CABINA. PUNTO."        → "Entra en cabina. punto."
 */
export function toSentenceCase(s: string): string {
  if (!s) return s
  const lower = s.toLocaleLowerCase('es')
  return lower.charAt(0).toLocaleUpperCase('es') + lower.slice(1)
}
