// lib/generation/messages.ts
// Editorial copy pools for the generation surface. Three tiers, keyed to
// progress bands in useTripGeneration. Slot substitution: {destination},
// {duration}, {travelers}.
//
// Rules of the pool:
//   - Tone: calm, composed, travel-editorial — never computing vocabulary.
//   - No exact percentages, no ETAs, no emoji, no cheerful filler.
//   - Slots are optional — if a value is missing, a safe fallback is used.

export type Tier = 'understanding' | 'constructing' | 'refining'
export type Locale = 'es' | 'en'

const POOLS: Record<Locale, Record<Tier, string[]>> = {
  es: {
    understanding: [
      'Leyendo lo que nos contaste sobre este viaje…',
      'Entendiendo el tipo de viaje a {destination} que buscas…',
      'Considerando cómo conectar cada día del recorrido…',
      'Pensando en un viaje de {duration} para {travelers}…',
      'Ordenando las piezas del plan…',
    ],
    constructing: [
      'Trazando la ruta entre los lugares que mejor encajan…',
      'Decidiendo dónde conviene dormir cada noche…',
      'Ajustando el ritmo del viaje para que no se sienta lleno…',
      'Calculando tiempos entre destinos sin llenar el día de traslados…',
      'Eligiendo los momentos que hacen este viaje específicamente tuyo…',
    ],
    refining: [
      'Revisando que cada día tenga sentido dentro del conjunto…',
      'Dejando espacio para lo que no se puede planear…',
      'Afinando los últimos detalles…',
    ],
  },
  en: {
    understanding: [
      'Reading what you told us about this trip…',
      'Understanding the kind of trip to {destination} you want…',
      'Considering how each day of the route connects…',
      'Thinking about a {duration} trip for {travelers}…',
      'Arranging the pieces of the plan…',
    ],
    constructing: [
      'Plotting the route through the places that fit best…',
      'Deciding where to stay each night…',
      'Tuning the trip’s pace so it doesn’t feel crowded…',
      'Calculating travel times so no day becomes all transit…',
      'Choosing the moments that make this trip specifically yours…',
    ],
    refining: [
      'Checking that each day makes sense within the whole…',
      'Leaving room for what can’t be planned…',
      'Finalizing the last details…',
    ],
  },
}

export type MessageSlots = {
  destination?: string | null
  durationDays?: number | null
  travelers?: string | null
}

function fillSlots(template: string, slots: MessageSlots, locale: Locale): string {
  const destination =
    slots.destination && slots.destination.trim()
      ? slots.destination.trim()
      : locale === 'es' ? 'tu destino' : 'your destination'
  const duration =
    typeof slots.durationDays === 'number' && slots.durationDays > 0
      ? (locale === 'es' ? `${slots.durationDays} días` : `${slots.durationDays} days`)
      : (locale === 'es' ? 'varios días' : 'a few days')
  const travelers =
    slots.travelers && slots.travelers.trim()
      ? slots.travelers.trim().toLowerCase()
      : (locale === 'es' ? 'tu grupo' : 'your group')
  return template
    .replace('{destination}', destination)
    .replace('{duration}',    duration)
    .replace('{travelers}',   travelers)
}

export function getPool(locale: Locale, tier: Tier): string[] {
  return POOLS[locale]?.[tier] ?? POOLS.en[tier]
}

// Weighted anti-repeat shuffle: Fisher-Yates with a guard that the new first
// element is not the same as the previous last-shown message.
export function shuffle<T>(input: T[], previousLast: T | null): T[] {
  const arr = input.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp
  }
  if (previousLast != null && arr.length > 1 && arr[0] === previousLast) {
    const tmp = arr[0]; arr[0] = arr[1]; arr[1] = tmp
  }
  return arr
}

export function fillMessage(template: string, slots: MessageSlots, locale: Locale): string {
  return fillSlots(template, slots, locale)
}

// Rotation cadences (ms) by cycle count. After the pool exhausts once, slow down.
export function rotationIntervalMs(cycleCount: number): number {
  if (cycleCount <= 1) return 7_000
  if (cycleCount === 2) return 11_000
  return 15_000
}
