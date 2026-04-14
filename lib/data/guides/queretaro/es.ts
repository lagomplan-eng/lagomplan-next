import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'queretaro',
  locale: 'es',

  hero: {
    title: 'Querétaro',
    subtitle: 'Arquitectura barroca, viñedos cercanos y una escena gastronómica que sorprende. La ciudad perfecta para caminar de día y brindar de noche.',
    eyebrow: 'Guía curada · Grupo de amigos',
    tags: ['Amigos', 'Gastronomía', 'Cultura', 'Vinos'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'El aterrizaje',
      items: [
        {
          time: '14:00',
          title: 'Check-in y comida en el Centro',
          description: 'Prueba las "Gorditas de migajas".',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Caminata por la Plaza de Armas y el Andador Protasio Tagle',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en Hacienda La Laborcilla',
          description: 'Para una atmósfera impactante.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Viñedos y Peña',
      items: [
        {
          time: '10:00',
          title: 'Roadtrip hacia Bernal',
          description: 'Subida (parcial o total) a la Peña de Bernal.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Comida y cata en Viñedos De Cote',
          description: 'Reservar con antelación.',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Regreso a la ciudad y noche de mezcales en el Centro',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Cultura y diseño',
      items: [
        {
          time: '11:00',
          title: 'Visita al Museo de Arte de Querétaro',
          description: 'El claustro es de los más bellos de América.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Brunch largo en Mosecafé',
          description: '',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Tarde de compras en tiendas de diseño local y galerías',
          description: '',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Cena de despedida en La Biznaga',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'El cierre suave',
      items: [
        {
          time: '10:00',
          title: 'Visita al Acueducto y caminata por el barrio de La Cruz',
          description: '',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Comida ligera y salida hacia CDMX',
          description: 'Para llegar antes del anochecer.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Hotel Boutique Casa del Atrio',
      type: 'Hotel boutique · Centro histórico',
      priceTier: '$$$',
      description: 'Una joya frente al Templo de San Agustín. Sus habitaciones son eclécticas y llenas de arte. El patio central es el lugar perfecto para el primer café del día.',
      tag: 'Arte y sofisticación',
      affiliateUrl: '',
    },
    {
      name: 'Hotel Danza del Sol',
      type: 'Hotel · Centro',
      priceTier: '$$',
      description: 'Amplio, con un aire de hacienda renovada y excelente servicio. Ideal si el grupo es grande y buscan comodidad sin complicaciones.',
      tag: 'Confort clásico',
      affiliateUrl: '',
    },
    {
      name: 'Morazul Hotel Boutique',
      type: 'Hotel boutique · Centro histórico',
      priceTier: '$$',
      description: 'Un refugio diseñado para quienes valoran la atención al detalle, a pasos de los templos más icónicos. Sus áreas exteriores ofrecen ese respiro de calma necesario para procesar la ciudad.',
      tag: 'Servicio curado y ubicación imbatible',
      affiliateUrl: '',
    },
  ],

  experiences: [
    {
      name: 'Ruta del Queso y Vino',
      description: 'Escapada a solo 45 minutos hacia Tequisquiapan o Ezequiel Montes. Visita a Freixenet o De Cote para una cata con vista a la Peña de Bernal.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Bar Hopping de Terrazas',
      description: 'Querétaro tiene las mejores vistas desde arriba. Lugares como La Grupa o Dodo Café son obligatorios para el "pre" nocturno.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Caminata por el Acueducto',
      description: 'Recorrido fotográfico por los arcos icónicos y los callejones del centro histórico (Patrimonio de la Humanidad).',
      tags: [],
      affiliateUrl: '',
    },
  ],

  hotelsDescription: '3 opciones ideales para grupos que valoran el diseño y la ubicación.',
  experiencesDescription: 'Seleccionadas para disfrutar en grupo.',

  tips: [
    'El clima engaña: Querétaro es semicálido de día pero refresca mucho en cuanto cae el sol. Una chamarra ligera o blazer es indispensable para las terrazas de noche.',
    'Reservas grupales: Si son más de 4 personas, Querétaro se llena rápido los fines de semana. Reserva las cenas con al menos 4 días de anticipación; no confíes en la suerte si quieres mesa en terraza.',
    'Agua de pie de cama: El aire de Querétaro es seco. Mantén siempre una botella de agua en tu habitación para evitar el dolor de cabeza matutino, especialmente después del vino en los viñedos.',
  ],

  funFact: 'El icónico Acueducto de 74 arcos fue construido originalmente por amor para llevar agua a una monja, pero hoy es el marco arquitectónico perfecto para las mejores fotos de grupo.',

  checklist: [
    '🧥 Chamarra ligera o blazer (noches frescas)',
    '👟 Zapatos cómodos para adoquines',
    '💵 Efectivo para gorditas y mercados',
    '📷 Cámara o iPhone cargado (el acueducto pide foto)',
    '🍷 Tarjeta para catas en viñedos',
    '💧 Botella de agua reutilizable (aire seco)',
    '🕶️ Lentes de sol para el día en los viñedos',
    '🎒 Bolsa pequeña para el bar hopping nocturno',
  ],

  transport: [
    {
      mode: 'Coche desde CDMX',
      description: 'Un trayecto de unas 3 horas por la Autopista 57. Es la vía principal, pero suele tener tramos en reparación; salgan temprano (7:00 AM) para evitar el tráfico de carga.',
    },
    {
      mode: 'Autobús',
      description: 'La opción más relajada. Los servicios ETN o Primera Plus desde Taxqueña o el Norte son de lujo, con asientos amplios para ir platicando o durmiendo.',
    },
    {
      mode: 'Movilidad local',
      description: 'Una vez en Querétaro, no usen coche. El centro se camina o se recorre en Uber. El tráfico local puede ser pesado y el estacionamiento es escaso.',
    },
  ],
}
