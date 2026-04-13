import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'merida',
  locale: 'es',

  hero: {
    title: 'Mérida',
    subtitle: 'El corazón vibrante de Yucatán. Una expedición diseñada para explorar cenotes ocultos, escalar pirámides y conectar con la naturaleza salvaje, sin perder el confort de la Ciudad Blanca.',
    tags: ['Familia', 'Aventura', 'Arqueología', 'Naturaleza'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'El aterrizaje',
      items: [
        {
          time: '15:00',
          title: 'Check-in y paseo por Paseo de Montejo',
          description: '',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Cena de antojitos yucatecos en Santa Ana',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Cenotes y bicicletas',
      items: [
        {
          time: '09:30',
          title: 'Expedición a los cenotes de Santa Bárbara',
          description: 'Se recorren tres cenotes diferentes en un truck o en bicicleta. Es seguro, organizado y el agua es cristalina.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Comida de pueblo en Homún y regreso al hotel para alberca',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Pirámides y chocolate',
      items: [
        {
          time: '08:30',
          title: 'Exploración de Uxmal',
          description: 'Llegar temprano para evitar el calor. Menos saturada que Chichén Itzá.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Taller de cacao en Choco-Story',
          description: 'Los niños pueden ver animales rescatados y aprender cómo los mayas hacían cacao.',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Noche de leyendas en el centro de Mérida',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Manglares y costa',
      items: [
        {
          time: '10:00',
          title: 'Reserva El Corchito en Progreso',
          description: 'Viaje corto en lancha hacia un oasis de manglares y cenotes bajos. Ideal para ver mapaches y coatíes en su hábitat natural.',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Comida frente al mar en Crabster y tiempo de playa',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'La ciudad amarilla',
      items: [
        {
          time: '10:00',
          title: 'Visita a Izamal',
          description: 'Suban a la pirámide de Kinich Kakmó (es gratuita y divertida).',
          tags: ['Entrada gratuita'],
        },
        {
          time: '13:00',
          title: 'Comida en Kinich',
          description: 'El mejor restaurante de la zona.',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Mercado y cierre',
      items: [
        {
          time: '09:00',
          title: 'Desayuno de tacos de lechón en el Mercado de Santiago',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Compras finales de hamacas o guayaberas y salida al aeropuerto',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Chablé Yucatán',
      type: 'Resort · Hacienda en la selva',
      priceTier: '$$$',
      description: 'Lujo absoluto integrado en la selva. Ubicado en una antigua hacienda, cuenta con su propio cenote, casitas con alberca privada y un programa para niños enfocado en la naturaleza y la cocina maya.',
      tag: 'El máximo santuario maya',
      affiliateUrl: '',
    },
    {
      name: 'Hacienda Xcanatun by Angsana',
      type: 'Hacienda · Mérida',
      priceTier: '$$',
      description: 'La elegancia histórica de una hacienda con amenidades modernas. Sus amplios jardines y piscinas son perfectos para que los peques corran libremente tras un día de exploración arqueológica.',
      tag: 'Confort clásico y jardines',
      affiliateUrl: '',
    },
    {
      name: 'Las Brisas',
      type: 'Hotel · Paseo de Montejo',
      priceTier: '$',
      description: 'El balance perfecto entre lujo tradicional y practicidad urbana. Su alberca es de las mejores de la ciudad y su ubicación a pasos de Paseo de Montejo te permite disfrutar sin complicaciones.',
      tag: 'Confort icónico y ubicación',
      affiliateUrl: '',
    },
  ],

  experiences: [
    {
      name: 'Cenotes de Santa Bárbara',
      description: 'Se recorren tres cenotes diferentes en un truck (vagón jalado por caballos sobre rieles) o en bicicleta. Es seguro, organizado y el agua es cristalina.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Uxmal y Choco-Story',
      description: 'Exploren la zona arqueológica de Uxmal (menos saturada que Chichén Itzá) y crucen la calle hacia el museo del chocolate. Los niños pueden ver animales rescatados y aprender cómo los mayas hacían cacao.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Reserva de El Corchito',
      description: 'Un viaje corto en lancha desde Progreso hacia un oasis de manglares y cenotes bajos. Es el lugar ideal para ver mapaches y coatíes en su hábitat natural mientras nadan.',
      tags: [],
      affiliateUrl: '',
    },
  ],

  tips: [
    'La regla del "pico de calor": Entre las 13:00 y las 16:00, el sol de Yucatán es implacable. Hagan como los locales: programen las actividades pesadas temprano, regresen a la alberca a mediodía y salgan de nuevo cuando baje el sol.',
    'Repelente de grado selva: No confíen en los sprays comerciales suaves. Busquen repelentes con ingredientes naturales fuertes o DEET moderado, especialmente para las tardes en haciendas o cenotes.',
    'Zapatos de agua rígidos: Para los niños, los aquashoes con suela de goma son obligatorios. Las rocas en los cenotes pueden ser resbaladizas y esto les da la confianza para saltar y explorar sin miedo.',
  ],

  funFact: 'Mérida fue construida sobre los restos de una antigua ciudad maya llamada T\'Hó. Si observas con atención las paredes de la Catedral de San Ildefonso, verás piedras talladas que pertenecieron a las pirámides originales.',

  checklist: [
    '👟 Aquashoes con suela de goma (para cenotes)',
    '🧴 Repelente de insectos con DEET moderado',
    '🧢 Sombrero de ala ancha (sol de Yucatán implacable)',
    '🩱 Traje de baño (cenotes y piscinas)',
    '💊 Botiquín y medicina para mareo (carreteras curvas)',
    '💵 Efectivo para mercados y artesanías',
    '♻️ Botella de agua reutilizable',
    '👒 Ropa ligera de lino o algodón',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Llegada al Aeropuerto de Mérida (MID).',
    },
    {
      mode: 'Renta de coche',
      description: 'Para una familia de 4 o 5, lo más Lagom es rentar una camioneta (SUV) directamente en el aeropuerto. Mérida es muy segura para manejar y la verdadera aventura está en los pueblos y cenotes aledaños.',
    },
    {
      mode: 'Movilidad en la ciudad',
      description: 'En la ciudad, Uber funciona de maravilla. Para las excursiones a la selva o la costa, el coche propio les da la flexibilidad de regresar al hotel cuando los peques necesiten una siesta.',
    },
  ],
}
