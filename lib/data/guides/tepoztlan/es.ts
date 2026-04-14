import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'tepoztlan',
  locale: 'es',

  hero: {
    title: 'Tepoztlán',
    subtitle: 'Una pausa mística bajo la sombra del Tepozteco. El equilibrio perfecto entre lujo sutil y tiempo para conectar.',
    eyebrow: 'Guía curada · Escapada en pareja',
    tags: ['Pareja', 'Romance', 'Bienestar', 'Naturaleza'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'Aterrizaje y atmósfera',
      items: [
        {
          time: '15:00',
          title: 'Check-in en Amomoxtli',
          description: '',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Caminata ligera por el centro',
          description: 'Comprar artesanías de madera y un "Itacate" tradicional.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena romántica en el hotel',
          description: 'Para evitar traslados nocturnos.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'El highlight',
      items: [
        {
          time: '08:30',
          title: 'Inicio del ascenso al cerro del Tepozteco',
          description: 'Antes de que suba la temperatura y el turismo masivo.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Comida relajada en el mercado',
          description: 'Cecina y quesadillas de flores locales.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Sesión de masaje o Temazcal y tiempo de lectura junto a la alberca',
          description: '',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Vino en la terraza bajo las estrellas',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Cierre suave',
      items: [
        {
          time: '10:00',
          title: 'Brunch largo y lento',
          description: '',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Visita al Ex-Convento de la Natividad',
          description: 'Silencio y arquitectura.',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Salida hacia CDMX',
          description: 'Para evitar el "nudo" de tráfico de las 4 PM.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Amomoxtli',
      type: 'Hotel boutique · Tepoztlán',
      priceTier: '$$$',
      description: 'Es el estándar de oro del romance en Tepoztlán. Jardines impecables y una de las mejores albercas de México. Cero ruido, máximo lujo.',
      tag: 'Cero ruido, máximo lujo',
      affiliateUrl: '',
    },
    {
      name: 'Posada del Tepozteco',
      type: 'Hotel · Centro',
      priceTier: '$$',
      description: 'Ubicación histórica con la mejor vista al cerro desde la terraza. Ideal para desayunos largos con el Tepozteco de fondo.',
      tag: 'El corazón del pueblo',
      affiliateUrl: '',
    },
    {
      name: 'Hotel Boutique Casa Fernanda',
      type: 'Hotel boutique · Tepoztlán',
      priceTier: '$$',
      description: 'Servicio impecable y un spa de primer nivel diseñado para parejas. Su restaurante, La Veladora, es imperdible.',
      tag: 'Wellness y gastronomía',
      affiliateUrl: '',
    },
  ],

  experiences: [
    {
      name: 'Ascenso místico al Tepozteco',
      description: 'Una caminata de 1.5 horas. La clave es el horario: inicia a las 8:30 AM para tener la cima casi para ti solo y una luz perfecta para fotos.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Ritual de temazcal en pareja',
      description: 'Una experiencia de purificación tradicional. Muchos hoteles lo ofrecen de forma privada, convirtiéndolo en un ritual íntimo y renovador.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Cena en la terraza al atardecer',
      description: 'Degustación de cocina contemporánea de Morelos con vista a las montañas iluminadas.',
      tags: [],
      affiliateUrl: '',
    },
  ],

  hotelsDescription: '3 opciones seleccionadas por su atmósfera y capacidad de aislamiento.',
  experiencesDescription: 'Actividades con "ritmo Lagom": un highlight por día.',

  tips: [
    'Zapatos: El fin del romance es un esguince. Tepoztlán es súper empedrado. Deja los tacones o zapatos de suela lisa; necesitas tenis con buen agarre o botas, incluso para ir a cenar.',
    'Magia entre semana: Si pueden, viajen de domingo a martes. El pueblo se transforma de un mercado ruidoso a un refugio de paz absoluta donde los hoteles bajan de precio hasta un 30%.',
    'El "hack" del Tepozteco: No subas a mediodía. El calor rebota en la piedra y la experiencia se vuelve agotadora. Inicia a las 8:30 AM; tendrás la cima casi para ti solo y una luz perfecta para fotos.',
  ],

  funFact: 'Se dice que el valle tiene un magnetismo especial debido a los minerales de sus cerros, lo que ayuda a las parejas a sincronizar sus ritmos y relajarse. Es uno de los pocos lugares donde puedes dormir literalmente a la sombra de una pirámide milenaria.',

  checklist: [
    '👟 Tenis con buen agarre o botas (imprescindible)',
    '🧴 Protector solar y repelente',
    '🌿 Ropa cómoda para el ascenso',
    '🧥 Chamarra ligera para las noches',
    '💵 Efectivo para el mercado y artesanías',
    '📖 Un libro o revista para la alberca',
    '🩱 Traje de baño para la alberca y el temazcal',
    '💆 Mente abierta para el ritual de temazcal',
  ],

  transport: [
    {
      mode: 'Coche propio',
      description: 'La opción más común para parejas, ideal si planeas moverte a hoteles en las afueras como Amomoxtli. Tiempo estimado: 1.5 a 2 horas. La famosa curva de "La Pera" puede ser traicionera; maneja con calma. Asegúrate de que tu hotel tenga estacionamiento propio.',
    },
    {
      mode: 'Autobús ejecutivo',
      description: 'La opción más "Lagom" si quieres empezar a relajarte desde que sales de la ciudad. Pullman de Morelos (Servicio Ejecutivo) desde la Terminal del Sur (Taxqueña). Cómodos, con Wi-Fi y aire acondicionado. La terminal en Tepoztlán está a 10 minutos en taxi de cualquier hotel.',
    },
    {
      mode: 'Transporte privado',
      description: 'Para garantizar el regreso sin complicaciones (Uber es difícil de conseguir desde Tepoztlán hacia CDMX), considera contratar un servicio de transporte privado de confianza para el viaje de vuelta.',
    },
  ],
}
