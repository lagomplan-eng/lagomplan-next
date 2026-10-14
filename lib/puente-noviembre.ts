/**
 * lib/puente-noviembre.ts
 *
 * The four escapadas for the November 2026 puente (Sat 14 – Mon 16), shared by
 * the /puente-noviembre landing and its delivery email (lib/email/).
 *
 * Planner links: /es/planificador skips its form when `destination` is in the
 * URL and starts generating straight away (TripGeneratorClient). The other
 * params mirror what HeroForm would send:
 *   - traveler=pareja → 2 adults, no children (no traveler_details sent).
 *   - nights is the planner's DAY count (durationDaysFromNights): 3 days, and
 *     the stay is derived as days − 1 = 2 nights, checkout Monday 16.
 *   - pace / budget / interests are left empty (the form allows that too).
 */

export const PUENTE_START = '2026-11-14'
export const PUENTE_END = '2026-11-16'
const PUENTE_DAYS = 3
const ORIGIN = 'Ciudad de México, México'

export interface PuenteDestination {
  /** GA4 `destination` param. */
  id: string
  name: string
  /** Value sent to the planner. */
  plannerDestination: string
  distance: string
  /** Landing card sentence. */
  blurb: string
  /** Email line (shorter, lowercase start). */
  emailBlurb: string
}

export const PUENTE_DESTINATIONS: PuenteDestination[] = [
  {
    id: 'oaxaca',
    name: 'Oaxaca',
    plannerDestination: 'Oaxaca, México',
    distance: '≈1 h de vuelo',
    blurb: 'Para comer muy bien, probar mezcal con calma y caminar el centro sin prisa.',
    emailBlurb: 'para comer muy bien y caminar sin prisa.',
  },
  {
    id: 'san_miguel_de_allende',
    name: 'San Miguel de Allende',
    plannerDestination: 'San Miguel de Allende, México',
    distance: '≈3.5 h en coche',
    blurb: 'Terrazas, galerías y cenas largas. El clásico que funciona cuando no quieren pensar.',
    emailBlurb: 'terrazas, galerías y cenas largas.',
  },
  {
    id: 'valle_de_bravo',
    name: 'Valle de Bravo',
    plannerDestination: 'Valle de Bravo, México',
    distance: '≈2.5 h en coche',
    blurb: 'Lago, bosque y no hacer nada a propósito. Ideal si lo que necesitan es descansar.',
    emailBlurb: 'lago, bosque y descanso.',
  },
  {
    id: 'merida',
    name: 'Mérida',
    plannerDestination: 'Mérida, México',
    distance: '≈2 h de vuelo',
    blurb: 'Casonas, cocina yucateca y cenotes a poco más de una hora.',
    emailBlurb: 'casonas, cocina yucateca y cenotes cerca.',
  },
]

/** Plain planner URL (hero, final CTA, closing line, form next step). */
export const PLANNER_PATH = '/es/planificador'

/**
 * Planner URL that generates this destination's puente plan immediately.
 * `extra` appends params (the email adds its UTMs; the site never does).
 */
export function puentePlannerPath(d: PuenteDestination, extra: Record<string, string> = {}): string {
  const qs = new URLSearchParams({
    destination: d.plannerDestination,
    origin: ORIGIN,
    start: PUENTE_START,
    end: PUENTE_END,
    nights: String(PUENTE_DAYS),
    traveler: 'pareja',
    ...extra,
  })
  return `${PLANNER_PATH}?${qs.toString()}`
}
