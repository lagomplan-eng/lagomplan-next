// content/guia/hotel/extra-zones.ts
//
// Two zones that only the hotel edition has: San Miguel Chapultepec and Coyoacán. They are NOT in the city layer
// (content/guia/cities/cdmx.ts), so the Livin, Host Me Tender and demo guides cannot see them. Each has a switch in
// content/guia/hotel/config.ts (HOTEL_EXTRA_ZONES_ON) so it can be turned off before launch if its content is not verified.
//
// EVERY place below is "to verify: address, opening days and hours" (see VERIFY). Nothing here states hours or prices.
// Two places reuse text that already exists in the guide, word for word, and move out of the mood panel they were in
// (Kurimanzutto from "I want culture", Café Avellaneda from "I'm hungry") so each appears once.

import type { IconKey, Lang } from '../types'
import type { HotelZone } from './zones'

export const VERIFY = 'to verify: address, opening days and hours'

export type ExtraZoneKey = 'San Miguel Chapultepec' | 'Coyoacán'

export interface ExtraPlace {
  name: Record<Lang, string>
  /** Address as given. Empty when none was given (never invented). */
  where: Record<Lang, string>
  icon: IconKey
  /** Own text, or `reuse`: take the existing text of a place already in the guide, word for word. */
  note?: Record<Lang, string>
  reuse?: 'Kurimanzutto' | 'Café Avellaneda'
  verify: typeof VERIFY
}

export interface ExtraZone {
  key: ExtraZoneKey
  mapUrl: string
  tagline: Record<Lang, string>
  /** Distance line, per hotel zone ('default' for the ones not listed). */
  orientation: Partial<Record<HotelZone | 'default', Record<Lang, string>>> & { default: Record<Lang, string> }
  places: ExtraPlace[]
}

const same = (s: string): Record<Lang, string> => ({ en: s, es: s })

export const EXTRA_ZONES: ExtraZone[] = [
  {
    key: 'San Miguel Chapultepec',
    mapUrl: 'https://maps.app.goo.gl/ZFKMj2iBMeL7fxHK7',
    tagline: {
      en: 'Galleries behind old walls, a Barragán house, the edge of the park.',
      es: 'Galerías tras muros antiguos, una casa de Barragán, la orilla del bosque.',
    },
    orientation: {
      condesa: { en: 'Next door to Condesa; most of it is a short walk.', es: 'Junto a la Condesa; casi todo queda a una caminata corta.' },
      default: { en: 'A short ride away; pair it with Chapultepec.', es: 'A un trayecto corto; combínalo con Chapultepec.' },
    },
    places: [
      {
        name: same('Mesa'), where: same('Gobernador Protasio Tagle 132'), icon: 'utensilsSm', verify: VERIFY,
        note: { en: 'A small neighbourhood restaurant known for its pancakes; go for breakfast.', es: 'Un restaurante pequeño de barrio, conocido por sus pancakes; ve a desayunar.' },
      },
      {
        name: same('Madereros'), where: same('General Antonio León 72'), icon: 'utensilsSm', verify: VERIFY,
        note: { en: 'A grill by chef Mario Espinosa in a 1930 house.', es: 'La parrilla del chef Mario Espinosa en una casa de 1930.' },
      },
      {
        name: same('Bosque de Chapultepec'),
        // Given as "nearest entrance from the neighbourhood": not a street address. The Spanish line is a plain translation of it.
        where: { en: 'Nearest entrance from the neighbourhood', es: 'Entrada más cercana desde la colonia' },
        icon: 'trees', verify: VERIFY,
        note: { en: "The city's great park starts where the neighbourhood ends.", es: 'El gran bosque de la ciudad empieza donde termina la colonia.' },
      },
      { name: same('Kurimanzutto'), where: same('Gobernador Rafael Rebollar 94'), icon: 'landmark', reuse: 'Kurimanzutto', verify: VERIFY },
      {
        name: same('Casa Gilardi'), where: same('General Antonio León 82'), icon: 'landmark', verify: VERIFY,
        note: {
          en: "Luis Barragán's last house: colour, light and an indoor pool. By appointment only.",
          es: 'La última casa de Luis Barragán: color, luz y una alberca interior. Solo con cita.',
        },
      },
      {
        name: same('El Mirador de Chapultepec'), where: same('Avenida Chapultepec 606'), icon: 'martini', verify: VERIFY,
        note: { en: 'A cantina-restaurant with more than a century behind it.', es: 'Una cantina-restaurante con más de un siglo de historia.' },
      },
    ],
  },
  {
    key: 'Coyoacán',
    mapUrl: 'https://maps.app.goo.gl/fHKhCCToYVaqFmrEA',
    tagline: { en: "Cobblestones, two squares, Frida's blue house.", es: 'Calles empedradas, dos plazas, la casa azul de Frida.' },
    orientation: { default: { en: 'A long ride south; plan half a day.', es: 'Un trayecto largo al sur; planea medio día.' } },
    places: [
      { name: same('Café Avellaneda'), where: same('Higuera 40-A'), icon: 'coffee', reuse: 'Café Avellaneda', verify: VERIFY },
      {
        name: same('Mercado de Coyoacán'),
        // Given as "Ignacio Allende": a street name without a number.
        where: same('Ignacio Allende'), icon: 'utensilsSm', verify: VERIFY,
        note: {
          en: "Sit at the tostada stalls in the middle of the market; it is the neighbourhood's classic lunch.",
          es: 'Siéntate en los puestos de tostadas, al centro del mercado; es la comida clásica del barrio.',
        },
      },
      {
        name: { en: 'Jardín Centenario and Plaza Hidalgo', es: 'Jardín Centenario y Plaza Hidalgo' },
        // No address was given for the two squares: left empty, not invented.
        where: same(''), icon: 'trees', verify: VERIFY,
        note: {
          en: 'Two squares side by side, with the coyote fountain; the heart of the neighbourhood.',
          es: 'Dos plazas juntas, con la fuente de los coyotes; el corazón del barrio.',
        },
      },
      {
        name: same('Museo Frida Kahlo (Casa Azul)'), where: same('Londres 247'), icon: 'landmark', verify: VERIFY,
        note: {
          en: "Frida's house. Tickets are timed and sell out; book well ahead.",
          es: 'La casa de Frida. Las entradas son por horario y se agotan; reserva con mucha anticipación.',
        },
      },
      {
        name: same('Museo Casa de León Trotsky'), where: same('Río Churubusco 410'), icon: 'landmark', verify: VERIFY,
        note: {
          en: 'Where Trotsky lived his last years, a few blocks from Casa Azul and far quieter.',
          es: 'Donde Trotsky vivió sus últimos años, a unas cuadras de la Casa Azul y mucho más tranquilo.',
        },
      },
      {
        name: same('Los Danzantes'), where: same('Plaza Jardín Centenario 12'), icon: 'utensilsSm', verify: VERIFY,
        note: {
          en: 'Oaxacan-inspired cooking and mezcal on the terrace over the plaza.',
          es: 'Cocina de inspiración oaxaqueña y mezcal en la terraza sobre la plaza.',
        },
      },
    ],
  },
]
