import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'cuernavaca',
  locale: 'es',

  hero: {
    title: 'Cuernavaca',
    subtitle: 'La ciudad de la eterna primavera. Un retiro diseñado para disfrutar de jardines exuberantes, gastronomía de altura y el lujo del tiempo lento en la cercanía de la capital.',
    eyebrow: 'Guía curada · Escape de fin de semana largo',
    tags: ['Amigos', 'Gastronomía', 'Relax', 'Lujo'],
    image: '/images/guides/guides-headers/Cuernavaca.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Llegada a la eterna primavera',
      items: [
        {
          time: '14:00',
          title: 'Comida en Las Mañanitas',
          description: 'El clásico absoluto, rodeado de pavos reales y el aroma de las flores.',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Check-in y tarde de alberca con coctelería botánica',
          description: '',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Cena de autor en House (dentro de Las Casas B+B)',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Jardines y gastronomía de autor',
      items: [
        {
          time: '10:00',
          title: 'Visita a Jardines de México',
          description: 'El jardín floral más grande del mundo. Recorrer el jardín japonés o el italiano al atardecer es una experiencia visualmente impactante.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Comida ligera en Verdesalvia',
          description: 'Cocina italiana-mediterránea.',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Sesión de masajes o hidromasaje en el spa del hotel',
          description: '',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Cena de gala en Anticavilla',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Brunch y despedida',
      items: [
        {
          time: '10:30',
          title: 'Brunch largo en Moscato o Hacienda de Cortés',
          description: '',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Compras de artesanía fina o última caminata por el jardín Borda',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Salida estratégica hacia CDMX',
          description: 'Antes del pico de tráfico del domingo por la noche.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Anticavilla Hotel',
      type: 'Hotel · Villa histórica',
      priceTier: '$$$',
      description: 'El encuentro perfecto entre una villa italiana y el modernismo mexicano. Ubicado en una propiedad histórica con un jardín impecable y una alberca de diseño, es ideal para grupos que aprecian el arte, la exclusividad y un spa de clase mundial.',
      tag: 'Lujo contemporáneo y herencia histórica',
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/A7eNLw3xb2?aid=lagomplan&campaign=lagomplan-cuernavacarefugiodeprimaveraestilo&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Cuernavaca%2C+Morelos%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fcuernavaca-refugio-de-primavera-estilo',
    },
    {
      name: 'Hacienda de Cortés',
      type: 'Hacienda · Siglo XVI',
      priceTier: '$$',
      description: 'Dormir entre muros de piedra del siglo XVI y jardines que parecen sacados de una novela. Es la experiencia clásica de lujo en Morelos, con techos altos y una atmósfera señorial que transporta a otra época.',
      tag: 'Elegancia colonial y jardines épicos',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/P9ggStKMTY',
    },
    {
      name: 'Las Casas B+B',
      type: 'Hotel boutique · Centro',
      priceTier: '$',
      description: 'Un hotel boutique con alma de casa particular en el corazón del centro. Diseño minimalista, textiles locales y una cocina de autor excelente. Ideal si el grupo prefiere una atmósfera más íntima y moderna.',
      tag: 'Diseño sofisticado y atmósfera chic',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/G43l9Zatec?aid=lagomplan&campaign=lagomplan-cuernavacarefugiodeprimaveraestilo&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Cuernavaca%2C+Morelos%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fcuernavaca-refugio-de-primavera-estilo',
    },
  ],

  experiences: [
    {
      name: 'Degustación de comida mexicana',
      description: 'Entra en una casa local en Cuernavaca para una sesión de degustación guiada con comidas y bebidas tradicionales mexicanas, cuidadosamente seleccionadas para mostrar la rica cultura culinaria del país.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Jardines de México',
      description: 'A unos minutos de la ciudad, es el jardín floral más grande del mundo. Recorrer el jardín japonés o el italiano al atardecer es una experiencia visualmente impactante y muy instagrameable.',
      tags: [],
      affiliateUrl: 'https://jardinesdemexico.com/',
    },
    {
      name: 'Cata de mezcal o tequila en el jardín',
      description: 'Organizar una degustación privada en los jardines del hotel. Cuernavaca se presta para largas sobremesas que comienzan con una cata guiada por un experto antes de la cena.',
      tags: [],
      affiliateUrl: '',
    },
  ],

  hotelsDescription: 'Tres estados de ánimo para tu grupo.',

  tips: [
    'El "Dress Code" Cuerna: Es el lugar para lucir el lino en su máxima expresión. Para las cenas, un estilo Resort Chic es perfecto: vestidos vaporosos para ellas y guayaberas o camisas de lino para ellos.',
    'Reserva con Antelación: En Semana Santa, los restaurantes icónicos como Las Mañanitas o Gaia se llenan con semanas de anticipación. Asegura tus mesas en cuanto confirmes el viaje.',
    'El Protector Solar: El sol de Cuernavaca es más fuerte de lo que parece debido a la frescura del viento. Un buen protector y un sombrero de palma de calidad son básicos para las comidas en el jardín.',
  ],

  funFact: 'Cuernavaca ha sido el refugio de la élite desde tiempos prehispánicos. Los emperadores aztecas tenían aquí sus casas de verano, seguidos por Hernán Cortés y más tarde por Maximiliano de Habsburgo y Carlota, quienes se enamoraron del Jardín Borda por recordarle a las villas europeas.',

  checklist: [
    '👗 Ropa de lino ligera (Resort Chic)',
    '🧴 Protector solar SPF 50+ (sol engañoso)',
    '👒 Sombrero de palma de calidad',
    '👡 Sandalias elegantes para cenas en jardín',
    '💵 Efectivo para artesanías del centro',
    '🍷 Tarjeta para cenas de autor',
    '🌸 Cámara (los jardines son muy fotogénicos)',
    '💊 Antihistamínico (tanta flor puede despertar alergias)',
  ],

  transport: [
    {
      mode: 'Autopista del Sol',
      description: 'Desde CDMX, la ruta es por la Autopista del Sol. En temporada alta, la clave es salir el jueves a las 7:00 AM o el viernes muy temprano. El tráfico en "El Paso Express" puede ser crítico; paciencia y un buen playlist son esenciales.',
    },
    {
      mode: 'Chofer privado',
      description: 'Para un grupo de 4-6 personas, lo más Lagom es contratar una camioneta con chofer privado para los traslados a restaurantes o Jardines de México. Esto permite que todos disfruten de la coctelería sin preocuparse por el regreso.',
    },
    {
      mode: 'Movilidad local',
      description: 'Si van al centro, dejen el auto en el hotel. Las calles son estrechas y el tráfico local en días santos es pesado; caminar o usar transporte privado es mucho más eficiente.',
    },
  ],
}
