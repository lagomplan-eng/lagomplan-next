import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'rio-de-janeiro',
  locale: 'es',

  hero: {
    title: 'Río de Janeiro',
    subtitle: 'La ciudad más cinematográfica del mundo — y la que tiene más capas de las que cualquier guía puede cubrir en cuatro días. Esta es la versión para la familia que quiere playas, arte, gastronomía y el Corcovado desde la mejor perspectiva disponible.',
    eyebrow: 'Guía curada · Familia con adolescentes · 4 días · Lujo',
    tags: ['Familia', 'Adolescentes', 'Lujo', 'Gastronomía'],
    image: '/images/guides/rio-de-janeiro.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Aterrizaje y playa',
      items: [
        {
          time: '14:00',
          title: 'Check-in y apertura de habitación',
          description: 'Check-in en el JANEIRO.',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Playa de Leblon / caminata hasta el Arpoador',
          description: '',
          tags: [],
        },
        {
          time: '18:30',
          title: 'Atardecer en el Arpoador (obligatorio)',
          description: 'El atardecer más famoso del mundo.',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Cena en Dias Ferreira',
          description: 'La calle gastronómica más seria de Leblon.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'El Corcovado y Santa Teresa',
      items: [
        {
          time: '07:30',
          title: 'Desayuno',
          description: '',
          tags: [],
        },
        {
          time: '08:30',
          title: 'Tren del Corcovado',
          description: 'Tren cremallera a primera hora para evitar nubes y grupos de tour.',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Barrio de Santa Teresa',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en Aprazível',
          description: 'Cocina carioca, terraza con vistas.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Escadaria Selarón',
          description: 'La escalera de mosaicos de 215 peldaños que João Selarón construyó durante 20 años y que hoy tiene azulejos de 60 países.',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Regreso al hotel',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena informal en Leblon',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Arte, ciencia y gastronomía',
      items: [
        {
          time: '09:00',
          title: 'Transfer al Museu do Amanhã',
          description: '',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Recorrido por el MAR (Museu de Arte do Rio)',
          description: 'Frente al Amanhã.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en Mercado do Porto de Gastronomia',
          description: 'El mercado de food halls más importante de Río, con 50 chefs y cocinas de todo Brasil en el mismo techo.',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Regreso y playa / descanso',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en Lasai',
          description: 'Reserva previa obligatoria. El único restaurante de Río con estrella Michelin.',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Despedida suave',
      items: [
        {
          time: '09:00',
          title: 'Desayuno',
          description: 'Desayuno largo con vistas al mar.',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Playa / galerías de Ipanema / spa',
          description: 'La Galería Anna Maria Niemeyer y la Galería Jaqueline Martins tienen piezas del arte contemporáneo brasileño más interesante.',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Almuerzo ligero',
          description: '',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Transfer al aeropuerto GIG',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Janeiro Hotel',
      type: 'Hotel · Leblon',
      priceTier: '$$$',
      description: 'Cincuenta y un habitaciones frente al mar en el barrio más elegante de Río. Las ventanas de piso a techo convierten cada cuarto en un mirador privado sobre Leblon, Ipanema y los Dois Irmãos — la formación de roca que sube directamente de la arena a 533 metros. Piscina infinity en la azotea, restaurante con cocina brasileña contemporánea y servicio de playa incluido. Precio estimado: $350–600 USD/noche.',
      tag: 'Diseño frente al mar en Leblon',
      affiliateUrl: '',
      archetypes: ['Familias', 'Parejas'],
    },
    {
      name: 'Sol Ipanema Hotel',
      type: 'Hotel · Ipanema',
      priceTier: '$$',
      description: 'Directamente frente al Posto 9 de Ipanema — el tramo de playa más icónico de Río, a cuadra y media del bar donde nació la Garota de Ipanema. Habitaciones familiares con vista al océano, desayuno buffet incluido con brownie de chocolate, y servicio de playa con sillas, toallas y sombrilla sin cargo adicional. Rooftop con piscina. Precio estimado: $200–350 USD/noche habitación familiar con vista al mar.',
      tag: 'Frente al Posto 9, familiar',
      affiliateUrl: '',
      archetypes: ['Familias'],
    },
    {
      name: 'Hotel Fasano Rio de Janeiro',
      type: 'Hotel de lujo · Ipanema',
      priceTier: '$$$',
      description: 'El primer edificio de Brasil diseñado por Philippe Starck, directamente sobre la Avenida Vieira Souto frente al Atlántico. 89 habitaciones con pisos de madera y muebles de cuero, en una estética que rinde homenaje a la era Bossa Nova de los años 50 y 60. La piscina infinity en el rooftop con vista al Arpoador, los Dois Irmãos y el Corcovado. Restaurante Gero Rio de cocina italiana contemporánea. Precio estimado: $500–900 USD/noche.',
      tag: 'Starck, Bossa Nova y rooftop icónico',
      affiliateUrl: '',
      archetypes: ['Parejas', 'Familias'],
    },
  ],

  hotelsDescription: 'Tres santuarios con vista al mar — del más diseñado al más práctico.',

  experiences: [
    {
      name: 'Corcovado en tren cremallera',
      description: 'La única forma de subir al Cristo Redentor que mantiene la promesa. El tren del Corcovado sale desde la estación de Cosme Velho (15 minutos en taxi desde Leblon) y sube 3.8 kilómetros de selva atlántica en 20 minutos. La llegada a la cima — con el Cristo emergiendo sobre la ciudad a 710 metros — es el momento que los adolescentes van a usar de foto de perfil durante al menos dos años. Reserva online con semanas de anticipación.',
      tags: ['Icónico', 'Adolescentes', 'Vistas'],
      affiliateUrl: '',
    },
    {
      name: 'Museu do Amanhã y área portuaria',
      description: 'El museo de ciencias diseñado por Santiago Calatrava en el puerto de Río es el edificio contemporáneo más importante de Brasil. Para adolescentes curiosos, las exposiciones interactivas sobre cambio climático, neurociencia y cosmos son el plan de mañana más interesante de la ciudad. Combina con una caminata por el barrio de Santa Teresa, accesible en bonde (tranvía histórico) o a pie desde el Centro.',
      tags: ['Museo', 'Arquitectura', 'Familia'],
      affiliateUrl: '',
    },
    {
      name: 'Cena de degustación en Lasai',
      description: 'El único restaurante de Río de Janeiro con estrella Michelin, a cinco minutos del JANEIRO Hotel en Botafogo. Menú de degustación con productos del huerto propio, maridaje de vinos y una cocina que fusiona técnica francesa con ingredientes cariocas. Para la noche de mayor inversión del viaje — y la que más se recuerda. Reserva obligatoria con semanas de anticipación.',
      tags: ['Fine dining', 'Michelin', 'Cocina carioca'],
      affiliateUrl: '',
    },
  ],

  tips: [
    'El açaí: En Leblon e Ipanema, cada dos cuadras hay un puesto de açaí — la fruta amazónica servida en bowl, helada y mezclada con granola y banana. Es el desayuno más carioca disponible y el más fotografiado por adolescentes con criterio. Bibi Sucos en Leblon es la referencia local.',
    'Las sandías de la playa: El vendedor de sandía cortada en barras que recorre la playa de Leblon con la nevera al hombro es parte del paisaje. Compra. Cuesta menos de $2 y es la hidratación más honesta del viaje.',
    'Vino brasileño: El sur de Brasil — especialmente la Serra Gaúcha — produce los mejores vinos de América del Sur que la mayoría de los viajeros nunca ha probado. El restaurante del JANEIRO Hotel tiene selección seria. Si la familia bebe vino, pide uno de la Serra Gaúcha la primera noche.',
  ],

  funFact: 'Leblon e Ipanema son técnicamente el mismo barrio — la separación es un canal de agua construido en 1917 que dividió la playa en dos. La canción "Garota de Ipanema" fue compuesta en 1962 por Tom Jobim y Vinícius de Moraes en el Bar Veloso de Ipanema (hoy llamado Bar Garota de Ipanema), mirando a una vecina que pasaba cada día hacia la playa. El bar sigue abierto.',

  checklist: [
    '🩱 Trajes de baño para todos',
    '🧴 Bloqueador solar (sol del Atlántico)',
    '👟 Tenis cómodos para el Corcovado y Santa Teresa',
    '📷 Cámara con batería extra',
    '👗 Algo elegante para Lasai',
    '💵 Tarjeta y algo de efectivo en reales',
    '🕶️ Lentes de sol',
    '🎒 Bolso pequeño de hotel para salir a la calle',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Aeropuerto Internacional Antonio Carlos Jobim (GIG / Galeão), a 25 kilómetros de Leblon. Transfer privado al hotel: 40–60 minutos según tráfico, $40–55 USD. Alternativa: Aeropuerto Santos Dumont (SDU), a 10 kilómetros del centro, con vuelos domésticos desde São Paulo (30 minutos) — útil si el itinerario incluye una escala en São Paulo.',
    },
    {
      mode: 'Traslados',
      description: 'Uber funciona perfectamente en Río — es el transporte más seguro y más conveniente para turistas. Evita taxis de la calle; usa siempre Uber o transfer privado del hotel. De Leblon a Ipanema: 5 minutos. De Leblon al Corcovado: 20 minutos. De Leblon al puerto / Museu do Amanhã: 30–40 minutos.',
    },
    {
      mode: 'Seguridad',
      description: 'Río requiere sentido común básico. Leblon e Ipanema son los barrios más seguros de la ciudad para turistas. No lleves la cámara colgada al cuello fuera del hotel; usa el bolso del hotel para llevar solo lo necesario. En los lugares de interés (Corcovado, Museu do Amanhã, el Selarón), el riesgo es mínimo en horario diurno.',
    },
  ],
}
