/**
 * lib/intelligence.ts
 *
 * Trip-intelligence computation. Pure TypeScript — no API calls, no I/O,
 * no external dependencies. Runs synchronously in Node (Next.js routes)
 * AND is portable to Deno (when we eventually wire async trips through
 * the worker too).
 *
 * Input: a subset of trip_data (days[].blocks[], accommodations[],
 *   duration_days, walking_tolerance). See types/intelligence.ts for the
 *   IntelligenceInput shape.
 *
 * Output: a TripIntelligence object — computed labels (Fluido / Manejable
 *   / Pesado), per-day flags (energy warning, post-arrival overload),
 *   hotel-fit assessment, and trip-level flags (no rest days etc).
 *
 * Numeric scores (0-100) are INTERNAL only. The UI surfaces only the
 * qualitative labels and human-readable messages.
 *
 * Failure mode: callers should wrap in try/catch — on any unexpected
 * input shape, the engine returns a minimal-but-valid TripIntelligence
 * with empty days and a 'Funcional' hotel fit, rather than throwing.
 */

import type {
  TripIntelligence,
  DayIntelligence,
  HotelFitScore,
  DayFlag,
  TripFlag,
  DayLabel,
  HotelFitLabel,
  IntelligenceInput,
  IntelligenceInputBlock,
} from '../types/intelligence'

// ── NEIGHBORHOOD COORDINATE TABLE ────────────────────────────────────────────
// Approximate centroids for major travel cities. Used to estimate distance
// between activities + between hotel and activities. Substring-matched
// against block text (neighborhood field preferred, then title fallback).
//
// Sized for Phase 1 — Lagomplan's existing audience destinations + a handful
// of common international ones. The match is fuzzy (`String.includes`) so
// variants like "Coyoacán" / "coyoacan" / "coyoacán" all hit the same row.
// Add new entries here when destinations expand; no other code changes.
//
// Format: [lat, lng]

export const NEIGHBORHOOD_COORDS: Record<string, [number, number]> = {
  // ── Mexico ───────────────────────────────────────────────────────
  'centro historico cdmx': [19.4326, -99.1332],
  'centro historico':      [19.4326, -99.1332],
  'polanco':               [19.4352, -99.1946],
  'condesa':               [19.4116, -99.1741],
  'roma norte':            [19.4166, -99.1612],
  'roma sur':              [19.4118, -99.1620],
  'coyoacan':              [19.3500, -99.1622],
  'coyoacán':              [19.3500, -99.1622],
  'xochimilco':            [19.2571, -99.1061],
  'san angel':             [19.3461, -99.1894],
  'juarez':                [19.4283, -99.1593],
  'cuauhtemoc':            [19.4282, -99.1535],
  // Oaxaca
  'centro oaxaca':         [17.0594, -96.7216],
  'jalatlaco':             [17.0651, -96.7204],
  'xochimilco oaxaca':     [17.0707, -96.7212],
  // Yucatán
  'centro merida':         [20.9674, -89.6237],
  'paseo de montejo':      [20.9785, -89.6195],
  // Beach destinations
  'tulum pueblo':          [20.2114, -87.4654],
  'zona hotelera tulum':   [20.1556, -87.4373],
  'playa del carmen':      [20.6296, -87.0739],
  'puerto escondido':      [15.8720, -97.0767],
  // ── Argentina ────────────────────────────────────────────────────
  'palermo':               [-34.5760, -58.4280],   // Buenos Aires
  'recoleta':              [-34.5870, -58.3960],
  'san telmo':             [-34.6213, -58.3719],
  'puerto madero':         [-34.6118, -58.3633],
  // Salta / Northwest
  'centro salta':          [-24.7821, -65.4232],
  // ── Peru ─────────────────────────────────────────────────────────
  'centro cusco':          [-13.5170, -71.9785],
  'san blas':              [-13.5121, -71.9745],   // Cusco neighborhood
  'aguas calientes':       [-13.1547, -72.5253],
  // ── Brazil ───────────────────────────────────────────────────────
  'ipanema':               [-22.9847, -43.1986],
  'copacabana':            [-22.9711, -43.1822],
  'leblon':                [-22.9844, -43.2236],
  'santa teresa':          [-22.9189, -43.1872],
  // ── Colombia ─────────────────────────────────────────────────────
  'centro historico cartagena': [10.4231, -75.5443],
  'getsemani':             [10.4202, -75.5430],
  'bocagrande':            [10.4039, -75.5510],
  // ── Costa Rica ───────────────────────────────────────────────────
  'tamarindo':             [10.2998, -85.8400],
  'nosara':                [9.9764, -85.6500],
  // ── Chile ────────────────────────────────────────────────────────
  'san pedro de atacama':  [-22.9087, -68.1997],
  // ── Europe ───────────────────────────────────────────────────────
  // Rome
  'centro storico roma':   [41.8992, 12.4730],
  'trastevere':            [41.8896, 12.4680],
  'vaticano':              [41.9029, 12.4534],
  'navona':                [41.8989, 12.4731],
  // Paris
  'marais':                [48.8566, 2.3522],
  'montmartre':            [48.8867, 2.3431],
  'eiffel':                [48.8584, 2.2945],
  'latin quarter':         [48.8512, 2.3456],
  // Barcelona
  'gothic quarter':        [41.3827, 2.1769],
  'eixample':              [41.3888, 2.1540],
  'barceloneta':           [41.3793, 2.1880],
  'gracia':                [41.4034, 2.1586],
  // London
  'westminster':           [51.4994, -0.1248],
  'covent garden':         [51.5129, -0.1243],
  'shoreditch':            [51.5227, -0.0782],
  'south bank':            [51.5055, -0.1100],
  // ── USA ──────────────────────────────────────────────────────────
  'midtown':               [40.7549, -73.9840],
  'lower manhattan':       [40.7127, -74.0134],
  'brooklyn':              [40.6782, -73.9442],
  'upper east side':       [40.7736, -73.9566],
  'downtown la':           [34.0522, -118.2437],
  'santa monica':          [34.0195, -118.4912],
  'hollywood':             [34.0928, -118.3287],
  'venice':                [33.9850, -118.4695],
  // ── Japan ────────────────────────────────────────────────────────
  'shinjuku':              [35.6938, 139.7034],
  'shibuya':               [35.6580, 139.7016],
  'ginza':                 [35.6717, 139.7649],
  'asakusa':               [35.7148, 139.7967],
  'roppongi':              [35.6627, 139.7314],
  'akihabara':             [35.7022, 139.7741],
  'harajuku':              [35.6702, 139.7029],
  'tsukiji':               [35.6654, 139.7707],
  'chiyoda':               [35.6938, 139.7536],
  // Kyoto
  'gion':                  [35.0036, 135.7780],
  'higashiyama':           [34.9991, 135.7836],
  'arashiyama':            [35.0094, 135.6669],
  'kawaramachi':           [35.0046, 135.7689],
  // ── Portugal ─────────────────────────────────────────────────────
  // Lisbon
  'chiado':                [38.7106, -9.1418],
  'alfama':                [38.7110, -9.1296],
  'baixa':                 [38.7099, -9.1389],
  'principe real':         [38.7195, -9.1499],
  'príncipe real':         [38.7195, -9.1499],
  'bairro alto':           [38.7128, -9.1457],
  'belem':                 [38.6975, -9.2030],
  'belém':                 [38.6975, -9.2030],
  // ── Spain (extended) ─────────────────────────────────────────────
  // Madrid
  'malasana':              [40.4258, -3.7036],
  'malasaña':              [40.4258, -3.7036],
  'chueca':                [40.4225, -3.6975],
  'la latina':             [40.4108, -3.7099],
  'salamanca madrid':      [40.4267, -3.6863],
  'sol':                   [40.4169, -3.7035],
  // ── Germany ──────────────────────────────────────────────────────
  'mitte':                 [52.5219, 13.4132],
  'kreuzberg':             [52.4988, 13.4031],
  'prenzlauer berg':       [52.5391, 13.4243],
  // ── Netherlands ──────────────────────────────────────────────────
  'jordaan':               [52.3760, 4.8830],
  'de pijp':               [52.3528, 4.8957],
  'centrum amsterdam':     [52.3702, 4.8952],
}

// ── CITY CENTROIDS (coarse fallback) ─────────────────────────────────────────
// When no specific neighborhood matches, fall back to the city's centroid.
// This degrades intra-city geography (Shinjuku ↔ Asakusa = 0 km instead of
// 7 km) but lets the engine still produce a coherent answer for trips whose
// neighborhoods aren't in the specific table yet. The CITY_CENTROIDS table
// is checked AFTER NEIGHBORHOOD_COORDS in inferCoords, so specific data
// always wins when present.
//
// Includes both EN and ES spellings for major hubs ("tokyo"/"tokio",
// "lisbon"/"lisboa") so the AI's locale-flexible output still matches.
export const CITY_CENTROIDS: Record<string, [number, number]> = {
  // ── Asia ─────────────────────────────────────────────────────────
  'tokyo':                 [35.6762, 139.6503],
  'tokio':                 [35.6762, 139.6503],
  'kyoto':                 [35.0116, 135.7681],
  'osaka':                 [34.6937, 135.5023],
  'seoul':                 [37.5665, 126.9780],
  'seúl':                  [37.5665, 126.9780],
  'bangkok':               [13.7563, 100.5018],
  'singapore':             [1.3521, 103.8198],
  'singapur':              [1.3521, 103.8198],
  'hong kong':             [22.3193, 114.1694],
  'dubai':                 [25.2048, 55.2708],
  // ── Europe ───────────────────────────────────────────────────────
  'lisbon':                [38.7223, -9.1393],
  'lisboa':                [38.7223, -9.1393],
  'porto':                 [41.1579, -8.6291],
  'oporto':                [41.1579, -8.6291],
  'madrid':                [40.4168, -3.7038],
  'sevilla':               [37.3886, -5.9823],
  'seville':               [37.3886, -5.9823],
  'valencia':              [39.4699, -0.3763],
  'paris':                 [48.8566, 2.3522],
  'parís':                 [48.8566, 2.3522],
  'rome':                  [41.9028, 12.4964],
  'roma':                  [41.9028, 12.4964],
  'london':                [51.5074, -0.1278],
  'londres':               [51.5074, -0.1278],
  'amsterdam':             [52.3676, 4.9041],
  'berlin':                [52.5200, 13.4050],
  'berlín':                [52.5200, 13.4050],
  'vienna':                [48.2082, 16.3738],
  'viena':                 [48.2082, 16.3738],
  'prague':                [50.0755, 14.4378],
  'praga':                 [50.0755, 14.4378],
  'budapest':              [47.4979, 19.0402],
  'athens':                [37.9838, 23.7275],
  'atenas':                [37.9838, 23.7275],
  'istanbul':              [41.0082, 28.9784],
  'estambul':              [41.0082, 28.9784],
  // ── Latin America ────────────────────────────────────────────────
  'mexico city':           [19.4326, -99.1332],
  'ciudad de mexico':      [19.4326, -99.1332],
  'cdmx':                  [19.4326, -99.1332],
  'oaxaca':                [17.0594, -96.7216],
  'merida':                [20.9674, -89.6237],
  'guadalajara':           [20.6597, -103.3496],
  'monterrey':             [25.6866, -100.3161],
  'buenos aires':          [-34.6037, -58.3816],
  'cusco':                 [-13.5170, -71.9785],
  'lima':                  [-12.0464, -77.0428],
  'rio de janeiro':        [-22.9068, -43.1729],
  'rio':                   [-22.9068, -43.1729],
  'sao paulo':             [-23.5505, -46.6333],
  'são paulo':             [-23.5505, -46.6333],
  'cartagena':             [10.3910, -75.4794],
  'medellin':              [6.2476, -75.5709],
  'medellín':              [6.2476, -75.5709],
  'bogota':                [4.7110, -74.0721],
  'bogotá':                [4.7110, -74.0721],
  'santiago':              [-33.4489, -70.6693],
  'panama city':           [8.9824, -79.5199],
  'panamá':                [8.9824, -79.5199],
  // ── North America ────────────────────────────────────────────────
  'new york':              [40.7128, -74.0060],
  'nueva york':            [40.7128, -74.0060],
  'los angeles':           [34.0522, -118.2437],
  'miami':                 [25.7617, -80.1918],
  'chicago':               [41.8781, -87.6298],
  'san francisco':         [37.7749, -122.4194],
  'toronto':               [43.6532, -79.3832],
  'vancouver':             [49.2827, -123.1207],
  // ── Oceania ──────────────────────────────────────────────────────
  'sydney':                [-33.8688, 151.2093],
  'melbourne':             [-37.8136, 144.9631],
  'auckland':              [-36.8485, 174.7633],
  // ── Africa ───────────────────────────────────────────────────────
  'cape town':             [-33.9249, 18.4241],
  'ciudad del cabo':       [-33.9249, 18.4241],
  'marrakech':             [31.6295, -7.9811],
  'cairo':                 [30.0444, 31.2357],
  'el cairo':              [30.0444, 31.2357],
}

// ── Distance + duration helpers ──────────────────────────────────────────────

/** Great-circle distance between two [lat, lng] points in kilometers. */
export function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371
  const dLat = (b[0] - a[0]) * (Math.PI / 180)
  const dLon = (b[1] - a[1]) * (Math.PI / 180)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a[0] * (Math.PI / 180)) *
      Math.cos(b[0] * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

/** Average urban-walking estimate: 4.5 km/h → 13.3 min/km. */
export function walkingMinutes(km: number): number {
  return Math.round(km * 13.3)
}

/**
 * Rough transit estimate: 10 min wait/access overhead + 8 min/km moving.
 * For sub-500m hops, returns the walking equivalent — taking transit for
 * a 4-block trip would be silly.
 */
export function transitMinutes(km: number): number {
  if (km < 0.5) return walkingMinutes(km)
  return Math.round(10 + km * 8)
}

// ── Neighborhood inference ───────────────────────────────────────────────────

/**
 * Fuzzy-match free text against the NEIGHBORHOOD_COORDS keys. Returns
 * the first match (substring + case-insensitive) or null.
 *
 * Lookup order:
 *   1. NEIGHBORHOOD_COORDS — specific barrios / districts. Wins when
 *      present so intra-city geography stays accurate.
 *   2. CITY_CENTROIDS — coarse city-level fallback. Lets the engine
 *      still produce coherent answers for trips whose neighborhoods
 *      aren't mapped yet (e.g. an unfamiliar Lisbon barrio still hits
 *      Lisbon's centroid).
 *
 * Called with two preferred signals, in order:
 *   1. block.neighborhood (when the AI populates it correctly)
 *   2. block.title (fallback — sometimes the venue name carries the
 *      neighborhood, e.g. "Comida en Coyoacán")
 */
export function inferCoords(text: string | null | undefined): [number, number] | null {
  if (!text || typeof text !== 'string') return null
  const normalized = text.toLowerCase()
  for (const [key, coords] of Object.entries(NEIGHBORHOOD_COORDS)) {
    if (normalized.includes(key)) return coords
  }
  for (const [city, coords] of Object.entries(CITY_CENTROIDS)) {
    if (normalized.includes(city)) return coords
  }
  return null
}

/**
 * Extract the best-effort neighborhood coordinates from a single block.
 * Tries the explicit neighborhood field first, then falls back to the
 * block's title (which sometimes carries place context).
 */
function coordsFromBlock(block: IntelligenceInputBlock): [number, number] | null {
  return inferCoords(block.neighborhood) ?? inferCoords(block.title) ?? null
}

// ── Day scoring ──────────────────────────────────────────────────────────────

function scoreDayEfficiency(
  activityCount:        number,
  estimatedWalkingMin:  number,
  transitSegments:      number,
  isArrivalDay:         boolean,
  isDepartureDay:       boolean,
): { score: number; label: DayLabel } {
  let score = 100

  // Penalize overloaded days. 5 blocks is the comfortable upper bound;
  // 7+ is verging on impossible to enjoy.
  if (activityCount > 5) score -= 20
  if (activityCount > 7) score -= 20

  // Penalize excessive walking. 60 min cumulative walking on a sightseeing
  // day is fine; 90+ min is exhausting.
  if (estimatedWalkingMin > 60) score -= 15
  if (estimatedWalkingMin > 90) score -= 20

  // Penalize transit burden. >2 transit segments means the day is dominated
  // by getting between places, not being in them.
  if (transitSegments > 2) score -= 15
  if (transitSegments > 4) score -= 20

  // Arrival / departure days deserve lighter scheduling. >2 activities is
  // already a lot when you're flying in or out the same day.
  if (isArrivalDay && activityCount > 2)   score -= 25
  if (isDepartureDay && activityCount > 2) score -= 20

  score = Math.max(0, score)

  const label: DayLabel =
    score >= 70 ? 'Fluido'
      : score >= 45 ? 'Manejable'
        : 'Pesado'

  return { score, label }
}

// ── Hotel-fit scoring ────────────────────────────────────────────────────────

function scoreHotelFit(
  hotelNeighborhood:       string | null,
  activityNeighborhoods:   string[],
): HotelFitScore {
  const hotelCoords = inferCoords(hotelNeighborhood)

  // Without coords for the hotel, we can't compute distance. Default to
  // "Funcional" — neutral, not flagged as a problem.
  if (!hotelCoords) {
    return {
      label: 'Funcional',
      score: 50,
      note:  'Hotel bien ubicado para tu itinerario.',
    }
  }

  const distances: number[] = []
  for (const n of activityNeighborhoods) {
    const coords = inferCoords(n)
    if (coords) distances.push(haversineKm(hotelCoords, coords))
  }

  if (distances.length === 0) {
    return {
      label: 'Funcional',
      score: 50,
      note:  'Buena base para explorar la ciudad.',
    }
  }

  const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length
  const closeActivities = distances.filter(d => d < 1.5).length
  const pctClose = closeActivities / distances.length

  let score = 100
  if (avgDistance > 3) score -= 30
  if (avgDistance > 5) score -= 20
  if (pctClose < 0.5)  score -= 20
  score = Math.max(0, score)

  const label: HotelFitLabel =
    score >= 70 ? 'Base ideal'
      : score >= 40 ? 'Funcional'
        : 'Alejado'

  const avgWalk = walkingMinutes(avgDistance)
  const note =
    label === 'Base ideal'
      ? `A ${Math.round(avgDistance * 10) / 10} km promedio de tus actividades.`
      : label === 'Funcional'
        ? `~${avgWalk} min promedio a tus actividades principales.`
        : `Agrega ~${avgWalk} min de traslado a cada actividad.`

  return { label, score, note }
}

// ── Day flags ────────────────────────────────────────────────────────────────

function buildDayFlags(
  activityCount:        number,
  walkingMin:           number,
  isArrivalDay:         boolean,
  nextDayIsDeparture:   boolean,
  walkingTolerance:     'low' | 'medium' | 'high',
): DayFlag[] {
  const flags: DayFlag[] = []

  if (isArrivalDay && activityCount > 3) {
    flags.push({
      type:       'post_arrival',
      severity:   'warning',
      message:    'Este día puede sentirse agotador después de tu llegada.',
      suggestion: 'Considera empezar con actividades ligeras o un descanso al llegar.',
    })
  }

  if (activityCount > 6) {
    flags.push({
      type:       'overloaded',
      severity:   'warning',
      message:    `${activityCount} actividades en un día es mucho. La calidad baja cuando el ritmo es muy alto.`,
      suggestion: 'Mueve 1-2 actividades al día siguiente o elimina las menos prioritarias.',
    })
  }

  // Walking threshold scales with the user's stated preference.
  const walkingThreshold = { low: 30, medium: 60, high: 90 }[walkingTolerance]
  if (walkingMin > walkingThreshold) {
    flags.push({
      type:       'energy_warning',
      severity:   walkingMin > walkingThreshold * 1.5 ? 'critical' : 'warning',
      message:    `~${walkingMin} min caminando este día supera tu preferencia de ritmo.`,
      suggestion: 'Considera usar transporte entre algunas actividades.',
    })
  }

  if (nextDayIsDeparture && activityCount > 3) {
    flags.push({
      type:       'early_departure',
      severity:   'info',
      message:    'Mañana es tu día de salida. Considera una noche más tranquila.',
      suggestion: 'Cena temprano y evita actividades que terminen tarde.',
    })
  }

  return flags
}

// ── Walking + transit estimate per day ───────────────────────────────────────
//
// Heuristic: between consecutive blocks, infer coords from each. When both
// have known neighborhoods, compute haversine distance and split into
// walking (<1.2 km) vs transit (>=1.2 km). When neighborhoods are unknown,
// assume a moderate same-neighborhood walk (15 min).

function estimateDayMovement(
  blocks: IntelligenceInputBlock[],
): { walkingMin: number; transitSegments: number } {
  let walkingMin = 0
  let transitSegments = 0

  for (let i = 0; i < blocks.length - 1; i++) {
    const a = blocks[i]
    const b = blocks[i + 1]
    const coordsA = coordsFromBlock(a)
    const coordsB = coordsFromBlock(b)

    if (coordsA && coordsB) {
      const dist = haversineKm(coordsA, coordsB)
      if (dist < 1.2) {
        walkingMin += walkingMinutes(dist)
      } else {
        transitSegments += 1
        // Walking to + from the transit stop adds ~10 min regardless.
        walkingMin += 10
      }
    } else {
      // Unknown neighborhood — moderate walk assumption.
      walkingMin += 15
    }
  }

  return { walkingMin, transitSegments }
}

// ── Public API ──────────────────────────────────────────────────────────────

// Coverage thresholds for the confidence gate (see computeTripIntelligence).
// When the engine can't resolve coordinates for enough blocks, surfacing
// labels would mean writing confident-looking "Fluido"/"Manejable"/"Pesado"
// on data the engine doesn't actually understand. Silently returning null
// is safer — the UI already hides badges when intelligence is null (same
// path as pre-migration trips).
const MIN_COVERAGE_RATIO  = 0.3  // ≥30% of blocks must resolve coords
const MIN_RESOLVED_BLOCKS = 3    // …AND at least 3 absolute (so a short
                                 //    trip with 1 of 3 blocks resolved
                                 //    doesn't slip past on percentage alone)

/**
 * Compute trip intelligence from raw trip_data. Returns either a populated
 * TripIntelligence object OR null when the engine can't see enough of the
 * trip's geography to produce trustworthy labels. Never throws on bad
 * input. Callers persist the result directly into trips.intelligence
 * (JSONB column); null means "no badges for this trip".
 *
 * Why null instead of a soft default: writing "Funcional" / "Fluido"
 * defaults onto trips whose neighborhoods we can't resolve was producing
 * misleading badges on international long-tail destinations. Returning
 * null falls through to the same code path as pre-migration trips —
 * the badges simply don't render.
 */
export function computeTripIntelligence(trip: IntelligenceInput): TripIntelligence | null {
  const tolerance: 'low' | 'medium' | 'high' = trip.walking_tolerance ?? 'medium'

  const safeDays = Array.isArray(trip.days) ? trip.days : []
  const accommodations = Array.isArray(trip.accommodations) ? trip.accommodations : []

  // ── Confidence gate ────────────────────────────────────────────────────────
  // Count how many of this trip's blocks have geography we can resolve. If
  // it's too few — either absolute or as a ratio — bail with null so the
  // UI hides the badges entirely instead of showing low-confidence labels.
  let totalBlocks    = 0
  let resolvedBlocks = 0
  for (const d of safeDays) {
    if (!Array.isArray(d.blocks)) continue
    for (const b of d.blocks) {
      totalBlocks += 1
      if (coordsFromBlock(b)) resolvedBlocks += 1
    }
  }
  if (totalBlocks > 0) {
    const ratio = resolvedBlocks / totalBlocks
    if (resolvedBlocks < MIN_RESOLVED_BLOCKS || ratio < MIN_COVERAGE_RATIO) {
      // Log once per save so we can monitor coverage in dev/staging; this
      // is the signal that tells us which destinations need neighborhood
      // entries added to NEIGHBORHOOD_COORDS / CITY_CENTROIDS next.
      console.warn('[intelligence] coverage below threshold — suppressing badges', {
        resolvedBlocks,
        totalBlocks,
        ratio: Number(ratio.toFixed(2)),
      })
      return null
    }
  }

  // Trip-level inputs needed by the day loop.
  const totalDays    = typeof trip.duration_days === 'number' && trip.duration_days > 0
    ? trip.duration_days
    : safeDays.length
  const arrivalDay   = typeof trip.arrival_day   === 'number' ? trip.arrival_day   : 1
  const departureDay = typeof trip.departure_day === 'number' ? trip.departure_day : totalDays

  // Collect ALL activity neighborhoods (across all days) — used for the
  // hotel-fit calculation below.
  const allActivityNeighborhoods: string[] = []
  for (const d of safeDays) {
    if (!Array.isArray(d.blocks)) continue
    for (const b of d.blocks) {
      const tag = b.neighborhood ?? b.title
      if (tag) allActivityNeighborhoods.push(tag)
    }
  }

  // Hotel-fit: prefer the first accommodation's neighborhood, fall through
  // to any populated neighborhood across the accommodations array.
  const primaryHotelNeighborhood =
    accommodations.find(a => a.neighborhood)?.neighborhood ?? null

  const hotelFit = scoreHotelFit(primaryHotelNeighborhood, allActivityNeighborhoods)

  // Per-day analysis.
  const days: DayIntelligence[] = safeDays.map((day, idx) => {
    const dayNumber = typeof day.day_number === 'number' ? day.day_number : idx + 1
    const blocks    = Array.isArray(day.blocks) ? day.blocks : []
    const activityCount = blocks.length

    const isArrivalDay      = dayNumber === arrivalDay
    const isDepartureDay    = dayNumber === departureDay
    const nextDayIsDeparture = dayNumber === departureDay - 1

    const { walkingMin, transitSegments } = estimateDayMovement(blocks)

    const { score, label } = scoreDayEfficiency(
      activityCount, walkingMin, transitSegments,
      isArrivalDay, isDepartureDay,
    )

    const flags = buildDayFlags(
      activityCount, walkingMin, isArrivalDay, nextDayIsDeparture, tolerance,
    )

    return {
      day_number:                 dayNumber,
      day_label:                  label,
      day_score:                  score,
      estimated_walking_min:      walkingMin,
      estimated_transit_segments: transitSegments,
      activity_count:             activityCount,
      flags,
    }
  })

  // Trip-level flags.
  const tripFlags: TripFlag[] = []
  const heavyDays = days.filter(d => d.day_score < 45).length
  if (heavyDays >= 2) {
    tripFlags.push({
      type:     'no_rest_days',
      severity: 'warning',
      message:  `${heavyDays} días con ritmo muy alto. El viaje puede sentirse agotador en general.`,
    })
  }

  return {
    computed_at: new Date().toISOString(),
    days,
    hotel_fit:   hotelFit,
    trip_flags:  tripFlags,
  }
}
