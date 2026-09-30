import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'hong-kong',
  locale: 'es',

  hero: {
    title: 'Hong Kong',
    subtitle: 'La ciudad donde los dim sum del desayuno tienen tres estrellas Michelin y la noche dura más de lo que nadie había planeado. Para el viaje que mezcla agenda de trabajo con el grupo de amigos que lleva meses sin verse: octubre en Hong Kong tiene 26°C, cielos despejados y la ciudad en su mejor versión.',
    eyebrow: 'Guía curada · Negocios & Amigos · 5 días · Presupuesto alto',
    tags: ['Amigos', 'Negocios', 'Gastronomía', 'Ciudad'],
    image: '/images/guides/hong-kong.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Llegada y primera noche en Kowloon',
      items: [
        {
          time: '16:00',
          title: 'Llegada en Airport Express',
          description: 'Desde HKG a Kowloon Station.',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Check-in',
          description: '',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Tsim Sha Tsui Promenade',
          description: 'Paseo junto al puerto.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Symphony of Lights',
          description: 'Gratuita, desde el Tsim Sha Tsui Promenade. El mejor bienvenido disponible.',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Cena en algún restaurante cantonés de Tsim Sha Tsui',
          description: 'La primera noche tiene un solo plan: subir al DarkSide del Rosewood o a cualquier rooftop bar y ver el skyline de Hong Kong Island por primera vez.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Victoria Peak y Central',
      items: [
        {
          time: '09:00',
          title: 'Peak Tram + City Walk + Dim Sum Tour',
          description: 'El Victoria Peak al amanecer tiene las vistas más claras del año en octubre. El tranvía histórico que sube a 45 grados de inclinación es el transporte más singularmente hongkonés de la ciudad. El tour combina el Peak con Central — el mercado de Man Mo Temple, los escalones mecánicos de Soho, el Hollywood Road — y termina con dim sum en un restaurante de referencia local.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Reuniones de trabajo en Central o tarde libre en Soho',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en Yat Lok',
          description: 'El pato asado con una estrella Michelin a precio de local — HK$100 por plato.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Kowloon — mercados, arte y gastronomía',
      items: [
        {
          time: '10:00',
          title: 'Museo de Arte de Hong Kong o Sham Shui Po',
          description: 'Sham Shui Po es el barrio más local y más fotogénico de Kowloon.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo dim sum en Tim Ho Wan',
          description: 'Mong Kok — el primer dim sum con estrella Michelin en ofrecer precios de local.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Harbour City o Temple Street',
          description: '',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Tour de mercados nocturnos y street food en Kowloon',
          description: 'Cuatro horas por los mercados nocturnos y las calles de Kowloon con un local hongkonés: Temple Street Night Market, los callejones de Mong Kok, los puestos de curry fish balls.',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Lantau — Gran Buda y Tai O',
      items: [
        {
          time: '09:00',
          title: 'MTR a Tung Chung Station',
          description: 'Excursión de día completo a Lantau.',
          tags: [],
        },
        {
          time: '09:30',
          title: 'Teleférico Ngong Ping 360',
          description: '30 minutos de recorrido sobre el mar y las colinas.',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Gran Buda y Monasterio Po Lin',
          description: 'El Buda sentado al aire libre más grande del mundo.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Bus a Tai O',
          description: 'El pueblo pesquero con casas sobre palafitos.',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Almuerzo en Tai O',
          description: 'Gambas secas, huevos salados, cangrejo de río.',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Bus de regreso y MTR al hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Wan Chai y última noche',
      items: [
        {
          time: '10:00',
          title: 'Sheung Wan + Cat Street',
          description: 'Antiguo distrito de hierbas medicinales reconvertido en el corredor de galerías de arte más activo de la ciudad — antigüedades y tiendas de diseño.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en el Mercado de Wan Chai',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Check-out y guardar equipaje en el hotel',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Última tarde libre',
          description: '',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Star Ferry + Symphony of Lights + tour nocturno',
          description: 'Cruzando Victoria Harbour, con el mercado mayorista de frutas de Kowloon y el Kowloon Peak para las vistas finales.',
          tags: [],
        },
        {
          time: '',
          title: 'Transfer al aeropuerto',
          description: 'Según horario de vuelo.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'The Murray Hong Kong',
      type: 'Hotel de diseño · Central, Hong Kong Island',
      priceTier: '$$$',
      description: 'El edificio brutalista de 1969 reconvertido en el hotel de diseño más elegante de Central, el corazón financiero de Hong Kong. Alberca infinita en el piso 25 con vistas a la ciudad, cinco restaurantes y bares incluyendo Popinjays en la azotea, y la posición más conveniente de la isla: a metros del Peak Tram, del Star Ferry y de Lan Kwai Fong. Cada habitación tiene ventanas de piso a techo.',
      tag: 'La dirección correcta para negocios y amigos a la vez',
      affiliateUrl: '',
      archetypes: [],
    },
    {
      name: 'Hotel Indigo Hong Kong Island',
      type: 'Hotel boutique · Wan Chai, Hong Kong Island',
      priceTier: '$$$',
      description: 'Hotel boutique de diseño en Wan Chai, el barrio más ecléctico de la isla, entre Central y Causeway Bay. Habitaciones con motivos de arte callejero de Hong Kong, rooftop bar con vistas al puerto y la posición perfecta para cenar en los mejores restaurantes de Wan Chai sin depender de taxi entre reunión y plan nocturno.',
      tag: 'Más carácter a menor precio',
      affiliateUrl: '',
      archetypes: [],
    },
    {
      name: 'Rosewood Hong Kong',
      type: 'Hotel · Tsim Sha Tsui, Kowloon',
      priceTier: '$$$',
      description: 'El hotel de mayor impacto visual de Hong Kong: 65 plantas sobre Victoria Harbour en Kowloon, con las mejores vistas de Hong Kong Island disponibles desde cualquier hotel de la ciudad. El bar DarkSide en el piso 6 tiene la vista más fotogénica del viaje: el skyline completo de Hong Kong Island frente al ventanal a las 11pm.',
      tag: 'La dirección que dice más con menos palabras',
      affiliateUrl: '',
      archetypes: [],
    },
  ],

  hotelsDescription: 'Tres opciones entre Hong Kong Island y Kowloon, cada una con una vista distinta del skyline.',

  experiences: [
    {
      name: 'Kowloon: tour privado de mercados nocturnos y comida callejera',
      description: 'El tour más auténtico de Hong Kong para grupos: cuatro horas por los mercados nocturnos y las calles de Kowloon con un local hongkonés. Pasa por el Temple Street Night Market, los callejones de Mong Kok, los puestos de curry fish balls y el dim sum de barrio que no aparece en ninguna lista de Michelin pero que los locales comen cada domingo desde siempre.',
      tags: ['Comida callejera', 'Nocturno', 'Kowloon'],
      affiliateUrl: '',
    },
    {
      name: 'Tour de día con dim sum',
      description: 'El Victoria Peak al amanecer tiene las vistas más claras del año en octubre, sin la neblina de verano. El tranvía histórico que sube a 45 grados es el transporte más singularmente hongkonés de la ciudad. El tour combina el Peak con Central y termina con dim sum en un restaurante de referencia local.',
      tags: ['Peak', 'Dim sum', 'Central'],
      affiliateUrl: '',
    },
    {
      name: 'Star Ferry, Symphony of Lights y mercado mayorista',
      description: 'El Star Ferry cruzando Victoria Harbour, la Symphony of Lights a las 8pm sobre el skyline completo, el mercado mayorista de frutas de Kowloon en plena actividad nocturna y el Kowloon Peak para las vistas finales. El plan para la noche en que el grupo quiere el Hong Kong de película.',
      tags: ['Star Ferry', 'Nocturno', 'Skyline'],
      affiliateUrl: '',
    },
  ],

  tips: [
    'Las private kitchens: espacios domésticos o semi-privados donde un chef cocina para un grupo de 6 a 20 personas un menú fijo sin carta. La mayoría no tienen licencia de restaurante ni presencia en Google. Se reservan por recomendación directa, con semanas de anticipación, y cuestan $100–250 USD por persona.',
    'El dim sum a las 7am: las dim sum de los restaurantes de barrio empiezan a las 7am y se llenan de mayores con periódico y grupos de vecinos que llevan décadas en la misma mesa. Para madrugar el último día: Lin Heung Tea House (Central, desde 1926) o Victoria City Seafood (Wan Chai) son la experiencia más auténtica de la ciudad.',
    'La Octopus Card: la tarjeta recargable que funciona en metro, bus, tranvía, taxi y ferrys cuesta $12 USD de depósito con $20 USD de saldo. Es la primera compra obligatoria al salir del Airport Express.',
  ],

  funFact: 'El Star Ferry, el transbordador entre Hong Kong Island y Kowloon, opera desde 1888 y cuesta menos de $0.60 USD en la clase inferior. En 2006, el gobierno propuso eliminarlo para ampliar la bahía y Hong Kong reaccionó con las primeras manifestaciones de preservación histórica masiva de la ciudad. El Star Ferry sigue en operación.',

  checklist: [
    '💳 Octopus Card al salir del Airport Express',
    '👔 Ropa formal ligera para reuniones + ropa casual para la noche',
    '👟 Zapatos cómodos — se camina mucho y se sube al Peak',
    '📅 Reservas con semanas de anticipación para las private kitchens',
    '☂️ Paraguas compacto, aunque octubre es seco',
    '🥟 Apetito para dim sum a las 7am',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Aeropuerto Internacional de Hong Kong (HKG), en la isla de Lantau. El Airport Express llega a la estación de Hong Kong (en Central) en 24 minutos — el enlace aeropuerto-centro más rápido de Asia. También hay servicio a Kowloon Station en 20 minutos. Vuelos directos desde Ciudad de México (con escala en Los Ángeles o Dallas), Madrid, París, Dubái y la mayoría de hubs asiáticos.',
    },
    {
      mode: 'Moverse en Hong Kong',
      description: 'El MTR es el más eficiente de Asia — puntual al segundo, limpio, con cobertura total. La Octopus Card recargable funciona en metro, bus, tranvía y hasta en algunos supermercados y taxis. El tranvía histórico de doble piso de Hong Kong Island cuesta HK$2.60 por trayecto y es el transporte más barato y más auténtico de la ciudad.',
    },
    {
      mode: 'Clima',
      description: 'En octubre: 22-28°C, sin lluvia significativa, cielos despejados. La temporada de tifones termina oficialmente en septiembre — octubre tiene el mejor clima del año en Hong Kong.',
    },
  ],
}
