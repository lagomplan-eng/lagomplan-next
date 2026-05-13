/**
 * components/smart-finds/tokens.ts
 *
 * Shared visual tokens for the Smart Finds Familias page.
 *
 * Aligned to the site-wide system the Hotels and Planner pages already
 * use, so the editorial volume sits inside the same product chrome:
 *   - Cream `#FFF9F3` background (same as Hotels, Planner, signup)
 *   - 1.5px hairline border `#DDD8D2` (same constant as BD in Hotels)
 *   - 14-px card radius (same as Hotels card chrome)
 *
 * What stays distinct (Smart Finds editorial voice):
 *   - Fraunces italic for kit titles + product names
 *   - Square-cornered SAND IconZone panel inside each rounded card
 *   - Pine-on-Pine PainStrip — full-bleed magazine band
 */

export const PINE        = '#0F3A33'
export const SAGE        = '#6B8F86'
export const SAND        = '#EDE7E1'
export const CREAM       = '#FFF9F3'   // page background — matches Hotels/Planner/signup
export const SURFACE     = '#FFFFFF'   // card background — white sits cleaner over CREAM than OW did
export const MUTED       = '#9A9690'
export const BORDER      = '#DDD8D2'   // 1.5px hairline — same value used elsewhere as BD
export const CARD_RADIUS = 14

// Back-compat alias — earlier components imported OW. Keep the export
// so any stray reference compiles; new components should use SURFACE.
export const OW = SURFACE
