import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'kioto-osaka',
  locale: 'es',

  hero: {
    title: 'Kioto y Osaka, Japón',
    subtitle: 'Septiembre es el secreto de Japón: el mismo Kioto de siempre, sin las multitudes del foliaje otoñal. 26–30°C de día, cielos despejados y templos con la mitad de visitantes. El Grand Sumo de Tokio añade el evento deportivo más singular del calendario japonés. Para la pareja que quiere el Japón correcto antes del Japón masificado.',
    eyebrow: 'Guía curada · Pareja · Antes de las Multitudes · 8 días · Presupuesto alto',
    tags: ['Pareja', 'Templos', 'Gastronomía'],
    image: '/images/guides/kioto-osaka.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Llegada a Kioto',
      items: [
        {
          time: 'Variable',
          title: 'Llegada al aeropuerto y Shinkansen a Kioto',
          description: '2 horas 15 minutos desde Tokio en el Shinkansen Nozomi hasta la estación de Kioto',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Check-in y primera vuelta por Gion',
          description: 'Check-in en el ryokan elegido y paseo por el Camino de Hanamikoji al atardecer, la calle más fotografiada de Gion',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Cena en Kioto',
          description: 'Cualquier restaurante de la zona de Gion, sin necesidad de reserva',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Kioto: Templos del este',
      items: [
        {
          time: '07:30',
          title: 'Kiyomizu-dera al amanecer',
          description: 'El templo construido sobre la ladera sin un solo clavo de metal, Patrimonio UNESCO. Antes de las 9am está prácticamente vacío',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Sanneizaka y Ninenzaka',
          description: 'Los callejones de piedra con tiendas de artesanía del siglo XVII, y el cementerio de Otani, uno de los más fotogénicos de Asia, de camino de vuelta',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Regreso al ryokan',
          description: 'Desayuno tardío',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Ceremonia del Té con Jardín',
          description: 'Reserva previa obligatoria',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Cena libre en Gion',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Kioto: Templos del noroeste',
      items: [
        {
          time: '09:00',
          title: 'Kinkakuji',
          description: 'El Pabellón de Oro. Llegar antes de las 9:30 para la foto sin multitudes',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Ryoanji',
          description: 'El jardín zen kare-sansui (roca seca) más famoso del mundo, el más silencioso de Kioto si llegas antes de mediodía',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Ninnaji y almuerzo',
          description: 'Templo menos visitado, menos filas, mismo nivel de impacto visual',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Mercado Nishiki',
          description: '400 metros de puestos de cocina japonesa de barrio que los kiotoítas llaman "la cocina de Kioto"',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Cena',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Arashiyama',
      items: [
        {
          time: '08:00',
          title: 'Bosque de bambú al amanecer',
          description: 'La única hora del día en que está completamente vacío',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Tenryuji y jardín',
          description: 'Templo con jardín zen sobre el lago. Entrada: $6 USD',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Paseo por Saga-Toriimoto',
          description: 'El barrio de las casas históricas',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo con vistas al río',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Bote de remos en el río Oi',
          description: '$5 USD, alquiler libre',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Regreso a Gion en tren',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Excursión a Nara',
      items: [
        {
          time: '08:30',
          title: 'Tren desde Kioto a Nara',
          description: '30 minutos, $4 USD',
          tags: [],
        },
        {
          time: '09:30',
          title: 'Parque de Nara',
          description: '1,200 ciervos sagrados que caminan libremente entre los turistas, y el santuario Kasuga Taisha con sus 3,000 linternas de piedra',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Todaiji y el Gran Buda',
          description: 'El edificio de madera más grande del mundo alberga el Gran Buda de bronce más grande de Japón. Entrada: $5 USD',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en Nara',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Regreso a Kioto o traslado a Osaka',
          description: '',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Check-in en Osaka',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Osaka: Gastronomía',
      items: [
        {
          time: '09:00',
          title: 'Kuromon Ichiba Market',
          description: '170 puestos activos desde las 7am, el desayuno más auténtico de Osaka',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Dotonbori',
          description: 'El corredor de neones y restaurantes más fotogénico de Japón',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo de ramen en Dotonbori',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Castillo de Osaka',
          description: 'Opcional, entrada: $6 USD',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Hungry Osaka Street Food Tour',
          description: 'Tour gastronómico nocturno en Shinsekai',
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: 'Osaka libre y Hiroshima (opcional)',
      items: [
        {
          time: 'Opción A',
          title: 'Hiroshima y Miyajima en Shinkansen',
          description: 'Día completo, 1 hora desde Osaka ($60 USD). El Parque Memorial de la Paz y el Museo de la Bomba Atómica, la visita más reflexiva de la región Kansai',
          tags: [],
        },
        {
          time: 'Opción B',
          title: 'Osaka tranquilo',
          description: 'Museo, mercado, onsen de barrio (sento), o el acuario Tempozan, el más grande de Japón',
          tags: [],
        },
      ],
    },
    {
      day: 8,
      title: 'Vuelo de regreso',
      items: [
        {
          time: 'Mañana',
          title: 'Desayuno en el hotel',
          description: '',
          tags: [],
        },
        {
          time: 'Variable',
          title: 'Transfer al aeropuerto de Kansai (KIX)',
          description: '50 minutos en Airport Express desde el centro de Osaka ($12 USD)',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Hotel The Celestine Kyoto Gion',
      type: 'Hotel boutique · Gion, Kioto',
      priceTier: '$$$',
      description: 'El hotel boutique más elogiado de Gion — el barrio histórico de las geishas — con "absolutamente impresionante" como el adjetivo más repetido en reseñas en inglés y español de los últimos 12 meses. Habitaciones amplias y luminosas con diseño japonés contemporáneo, bebidas y snacks de habitación gratuitos, servicio de concierge que hizo llegar un taxi en plena lluvia cuando el Uber no aparecía, y una ubicación que pone al templo Kiyomizu-dera a 15 minutos caminando. Para la pareja que quiere el hotel más completo de Gion: este es. Precio estimado: €200–380/noche.',
      tag: 'El hotel boutique más completo de Gion',
      affiliateUrl: 'https://www.booking.com/searchresults.html?ss=Hotel+The+Celestine+Kyoto+Gion',
      archetypes: ['Parejas'],
    },
    {
      name: 'Gion Shinmonso',
      type: 'Ryokan con onsen · Gion, Kioto',
      priceTier: '$$',
      description: 'Ryokan con onsen (baño termal) en el corazón de Gion, a 500 metros de la estación Gion-Shijo. Habitaciones con tatami y futón, baño público con onsen separado por géneros y la experiencia más auténtica de ryokan disponible en el barrio más histórico de Kioto. Las reseñas destacan el onsen como el mejor momento de cada jornada: llegar caminando del templo de noche y meterse en el baño termal antes de cenar es el ritual que ningún hotel occidental puede replicar. Precio estimado: €150–280/noche.',
      tag: 'El onsen más auténtico en el corazón de Gion',
      affiliateUrl: 'https://www.booking.com/hotel/jp/kyoto-ryokan-gion-shinmonso.html',
      archetypes: ['Parejas'],
    },
    {
      name: 'Ryokan Uemura',
      type: 'Ryokan · Gion, Kioto',
      priceTier: '$',
      description: 'El ryokan más auténtico y mejor valorado de Gion: calificación 9.7 en Booking, ubicación 9.8. Una pareja mayor lo lleva desde hace décadas — él sirvió el té en la primera visita y dibujó un mapa del baño para los huéspedes recién llegados. Pisos de tatami, baño japonés compartido, bata de yukata incluida y la calle Hanamikoji — la más fotogénica de Kioto — literalmente en la puerta. El ryokan que más aparece en los "lo que haría diferente en Japón" de los viajeros que repiten. Precio estimado: €120–200/noche.',
      tag: 'Ryokan mejor valorado de Gion: 9.7 en Booking',
      affiliateUrl: 'https://www.booking.com/hotel/jp/ryokan-uemura.html',
      archetypes: ['Parejas'],
    },
  ],

  hotelsDescription: 'Gion como base, en pleno corazón histórico de Kioto.',

  experiences: [
    {
      name: 'Ceremonia del Té en Casa de Té con Jardín',
      description: 'La ceremonia del té más recomendada de Kioto: en una casa de té tradicional con jardín privado a pasos del templo Kiyomizu-dera, con vistas al jardín durante los 45 minutos de la ceremonia. El maestro de té explica el wabi-sabi — la filosofía de la imperfección deliberada — mientras prepara el matcha con el ritual de 400 años. La mejor introducción a la cultura japonesa disponible en un solo formato: tranquila, concreta y completamente auténtica.',
      tags: ['Té', 'Kiyomizu-dera', '45 min'],
      affiliateUrl: 'https://www.getyourguide.com/kyoto-l96826/kyoto-tea-ceremony-in-a-traditional-tea-house-in-kiyomizu-t551173/',
    },
    {
      name: 'Hungry Osaka Street Food Tour: 15 Degustaciones & 3 Bebidas',
      description: 'El tour gastronómico mejor valorado de Osaka durante siete años consecutivos. Shinsekai — el barrio más auténtico y menos turístico de la ciudad — con cinco paradas locales: kushikatsu (pinchos fritos en salsa), takoyaki (bolas de pulpo), karaage, oden y una comida completa en un izakaya de barrio. 15 platos y 3 bebidas incluidos en 3 horas. El guía habla inglés con fluidez y el barrio opera en japonés exclusivamente, que es exactamente el punto.',
      tags: ['Shinsekai', 'Gastronomía', '3 horas'],
      affiliateUrl: 'https://www.getyourguide.com/osaka-l1204/hungry-osaka-street-food-tour-15-tastings-3-drinks-t513983/',
    },
    {
      name: 'Osaka: Tour Gastronómico con 15 Platos y 3 Bebidas',
      description: 'El tour alternativo de Hungry Osaka Tours: la misma empresa con formato diferente, cinco locales distintos en Shinsekai, cocina local auténtica sin adaptaciones para el paladar occidental y el contexto cultural de cada plato explicado por un guía que vive en el barrio. Para la pareja que quiere repetir la experiencia gastronómica de Osaka con un operador diferente o en una fecha en que el tour principal no tiene disponibilidad.',
      tags: ['Shinsekai', 'Alternativa', 'Gastronomía'],
      affiliateUrl: 'https://www.getyourguide.com/osaka-l1204/osaka-shinsekai-food-tour-t315237/',
    },
  ],

  experiencesDescription: 'Té, geishas y la cocina de Osaka.',

  tips: [
    'Las reservas de restaurantes en Kioto: los mejores restaurantes de Kioto (Kichisen, Kikunoi, Mizai) requieren reserva con meses de anticipación — algunos solo aceptan reservas a través de hoteles de lujo. Para la cena especial: pide al concierge del ryokan que gestione la reserva en el momento de confirmar la habitación. Es el servicio que diferencia un ryokan bien gestionado del que no lo es.',
    'El onsen: el baño termal en el ryokan sigue protocolos específicos: ducha completa antes de entrar a la bañera común, sin ropa, sin jabón dentro de la bañera. El primer onsen puede ser desconcertante — es completamente normal. El segundo ya es el ritual del viaje.',
    'El IC Card: la tarjeta recargable ICOCA (en Osaka/Kioto) o SUICA (en Tokio) funciona en el metro, buses y trenes locales de toda la región Kansai. Se recarga en cualquier máquina de la estación. Es la forma más eficiente de moverse — sin comprar ticket individual en cada trayecto.',
    'El konbini: las tiendas de conveniencia japonesas (7-Eleven, FamilyMart, Lawson) tienen la mejor comida preparada del mundo de conveniencia: onigiri, soba fría, curry de arroz, gyoza al vapor. Para el desayuno rápido antes del templo de las 7am o la cena de la última noche: el konbini es el plan más lagom disponible en Japón.',
  ],

  funFact: 'Kioto fue la capital imperial de Japón durante más de 1,000 años — del 794 al 1869, cuando el gobierno se trasladó a Tokio. Durante la Segunda Guerra Mundial, Kioto fue eliminada de la lista de objetivos del bombardeo atómico americano, en parte por las objeciones del Secretario de Guerra Henry Stimson, quien había visitado la ciudad en su luna de miel en 1926. La decisión salvó 17 sitios Patrimonio UNESCO, 2,000 templos y santuarios, y la arquitectura más intacta del Japón histórico.',

  checklist: [
    '🎫 IC Card (ICOCA) recargable para metro, bus y tren en toda la región Kansai',
    '👘 Ropa ligera y transpirable para la humedad de septiembre, no algodón',
    '🥾 Calzado cómodo de quitar y poner fácil: templos, ryokan y restaurantes lo piden constantemente',
    '📷 Cámara lista para el amanecer en el bosque de bambú y en Kiyomizu-dera antes de las 9am',
    '🍵 Reserva de la ceremonia del té y del ryokan con meses de anticipación',
    '💴 Efectivo en yenes para konbinis, izakayas y mercados — no todos aceptan tarjeta',
    '🚄 Asientos reservados en el Shinkansen para el tramo Osaka–Hiroshima si se elige la opción A del día 7',
  ],

  transport: [
    {
      mode: 'Vuelo desde México',
      description: 'El vuelo más directo desde CDMX es CDMX–Tokio (Narita o Haneda) con escala en Los Ángeles, Vancouver o Dallas. Desde Tokio, el Shinkansen Nozomi llega a Kioto en 2 horas y 15 minutos (aproximadamente $130–160 USD). Alternativa: volar directo a Osaka (Kansai, KIX) con escala en algún hub asiático (Seúl, Taipéi, Hong Kong).',
    },
    {
      mode: 'JR Pass vs. ICOCA',
      description: 'Para 8 días en Kioto y Osaka con una excursión a Nara y el Shinkansen de llegada, el JR Pass nacional no es necesariamente la mejor opción financieramente — calcula los trayectos planificados antes de comprarlo. La tarjeta recargable ICOCA funciona para todo el metro y los trenes locales de la región Kansai y es más eficiente para estancias cortas.',
      tip: 'Osaka a Kioto: 15 minutos en Shinkansen o 30 minutos en tren Hankyu/JR ($3–6 USD), la conexión más fácil de la región.',
    },
    {
      mode: 'Moverse en Kioto',
      description: 'Metro, bus y a pie. Kioto tiene una cuadrícula de buses que cubre todos los templos principales. La bici de alquiler ($8–12 USD/día) es la opción más lagom para la pareja que quiere recorrer el Camino del Filósofo o Arashiyama sin depender de horarios.',
    },
    {
      mode: 'Clima en septiembre',
      description: '28–32°C en Kioto y Osaka: caluroso pero manejable, especialmente en las mañanas. Los templos de Kioto antes de las 9am están prácticamente solos. La humedad es el factor más relevante: ropa ligera de materiales transpirables, no el algodón que parece la opción obvia.',
    },
  ],
}
