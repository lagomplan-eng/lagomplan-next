import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'valle-de-bravo',
  locale: 'es',

  hero: {
    title: 'Valle de Bravo',
    subtitle: 'El refugio donde el bosque se encuentra con el agua. Una escapada diseñada para quemar adrenalina, explorar la naturaleza y disfrutar de la mejor gastronomía de montaña.',
    tags: ['Familia', 'Aventura', 'Naturaleza', 'Gastronomía'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'La llegada',
      items: [
        {
          time: '14:00',
          title: 'Comida en Los Girasoles',
          description: 'Clásico familiar.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Caminata por la calle principal de Avándaro',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Pizza artesanal en Dipao',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Agua y tradición',
      items: [
        {
          time: '09:30',
          title: 'Visita a la Cascada Velo de Novia',
          description: '',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Renta de lancha para esquí o paseo',
          description: 'El lago es el escenario ideal para que los peques aprendan a esquiar en un ambiente controlado.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Comida en La Michoacana',
          description: 'Comida típica.',
          tags: [],
        },
        {
          time: '18:30',
          title: 'Paseo por el centro histórico de Valle',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Bosque y altura',
      items: [
        {
          time: '09:00',
          title: 'Senderismo en Reserva Monte Alto',
          description: 'Un parque estatal perfecto para el senderismo o el ciclismo de montaña. Las rutas están bien marcadas y ofrecen miradores espectaculares.',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Brunch tardío en Mosecafé',
          description: '',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Tarde de alberca o lectura',
          description: '',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Cena en Da Ciro',
          description: 'Italiano acogedor.',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Adrenalina y vuelo',
      items: [
        {
          time: '10:00',
          title: 'Vuelo en parapente',
          description: 'La actividad insignia de Valle. Volar en tándem sobre el lago al atardecer es una experiencia que los niños (mayores de 6-7 años) y adultos recordarán siempre.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Comida en Rancho Avándaro',
          description: 'Ideal para que los niños corran.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Clase de equitación o descanso',
          description: '',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Cena de despedida en Hueso Valle o Nauta',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Silencio y regreso',
      items: [
        {
          time: '10:00',
          title: 'Brunch en Margarita Concept',
          description: '',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Visita a la Gran Stupa de la Paz',
          description: 'Un momento de introspección familiar.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Salida hacia CDMX',
          description: 'Antes del pico de tráfico.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Hotel Rodavento',
      type: 'Hotel · Bosque de Avándaro',
      priceTier: '$$$',
      description: 'Lujo rústico-contemporáneo escondido en el bosque. El paraíso para los niños por su tirolesa, tiro con arco y lago propio, permitiendo a los padres relajarse en un spa de primer nivel integrado a la naturaleza.',
      tag: 'Aventura chic y bosque profundo',
      affiliateUrl: '',
    },
    {
      name: 'Hotel Avándaro Golf & Spa',
      type: 'Resort · Avándaro',
      priceTier: '$$',
      description: 'El corazón social de Avándaro. Ofrece una experiencia clásica familiar con alberca climatizada, canchas de tenis y cercanía a la zona comercial, ideal para quienes buscan comodidad y movimiento.',
      tag: 'Confort clásico y atmósfera familiar',
      affiliateUrl: '',
    },
    {
      name: 'Wander Cabins',
      type: 'Cabañas · Valle de Bravo',
      priceTier: '$',
      description: 'Desconexión absoluta en "tiny cabins" de diseño alpino-contemporáneo. Ubicadas en terrenos amplios para garantizar privacidad total. El refugio ideal para vivir el bosque sin distracciones tecnológicas (poca señal y sin Wi-Fi).',
      tag: 'Minimalismo y desconexión radical',
      affiliateUrl: '',
    },
  ],

  experiences: [
    {
      name: 'Vuelo en parapente',
      description: 'La actividad insignia de Valle. Volar en tándem sobre el lago al atardecer es una experiencia que los niños (mayores de 6-7 años) y adultos recordarán siempre por la sensación de libertad absoluta.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Reserva Monte Alto',
      description: 'Un parque estatal perfecto para el senderismo o el ciclismo de montaña. Las rutas están bien marcadas y ofrecen miradores espectaculares para ver el despegue de los parapentes y toda la cuenca del lago.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Mañana de esquí o wakeboard en el lago',
      description: 'Rentar una lancha privada para practicar deportes acuáticos. El lago es el escenario ideal para que los peques aprendan a esquiar en un ambiente controlado antes de disfrutar de un picnic a bordo.',
      tags: [],
      affiliateUrl: '',
    },
  ],

  tips: [
    'Capas de Ropa: En Valle el clima es súper engañoso. De día el sol quema, pero en cuanto baja, la temperatura en el bosque cae drásticamente. Empaca chalecos o chamarras ligeras siempre, incluso en primavera.',
    'Reserva de Restaurantes: En temporada alta, los lugares top se llenan. Reserva tus cenas con al menos 4 días de antelación, especialmente para grupos de cuatro o más.',
    'El "secret spot" de pan: No te vayas sin pasar por la panadería del hotel Rodavento o la del centro para llevarse pan de caja artesanal. Es el mejor recuerdo comestible del viaje.',
  ],

  funFact: 'Valle de Bravo se llama así en honor a Nicolás Bravo, héroe de la Independencia, pero su nombre original era San Francisco del Valle de Temascaltepec. La represa que hoy vemos (el lago) se creó artificialmente en 1947 como parte de un sistema hidroeléctrico, transformando para siempre el paisaje de montaña en un puerto de altura.',

  checklist: [
    '🪂 Ropa cómoda para parapente (nada suelto)',
    '🧥 Chamarra o chaleco para el bosque (cambios bruscos)',
    '👟 Zapatos de trekking o tenis con buen agarre',
    '🩱 Traje de baño para el lago y la alberca',
    '☀️ Bloqueador solar (sol de montaña es más intenso)',
    '💵 Efectivo para mercados artesanales y tips',
    '🔋 Power bank (señal irregular en el bosque)',
    '🍞 Espacio en maleta para llevar pan artesanal',
  ],

  transport: [
    {
      mode: 'Coche propio (SUV)',
      description: 'Desde CDMX, la vía más rápida es por la Autopista Toluca-Zitácuaro (ramal Valle de Bravo). En temporada alta, salgan antes de las 7:00 AM para evitar el nudo vial de Santa Fe y Toluca.',
    },
    {
      mode: 'Movilidad local',
      description: 'Lo más Lagom es llevar una SUV propia. Las calles de Valle y Avándaro son empedradas y empinadas; un vehículo con buena altura evitará complicaciones y te dará libertad para ir a las cascadas.',
    },
    {
      mode: 'Estrategia de tráfico',
      description: 'En temporada alta, evita mover el auto entre las 13:00 y las 16:00 en el centro de Valle. Uber es escaso; prioriza caminar o usar los taxis locales identificables.',
    },
  ],
}
