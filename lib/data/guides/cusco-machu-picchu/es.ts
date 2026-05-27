import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'cusco-machu-picchu',
  locale: 'es',

  hero: {
    title: 'Cusco & Machu Picchu, Perú',
    subtitle: 'El viaje que tiene todo el sentido hacer solo: caminar a tu ritmo, comer sin negociar el restaurante, amanecer en la ciudadela antes de que lleguen los grupos de tour y regresar a Cusco con la cabeza llena de piedras incas y altitud.',
    eyebrow: 'Guía curada · Viajero solo · 7 días · Aventura, caminata, gastronomía',
    tags: ['Solo', 'Aventura', 'Caminata', 'Gastronomía'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'Llegada y aclimatación',
      items: [
        {
          time: '13:00',
          title: 'Check-in y descanso',
          description: 'Vuelo a Cusco. Check-in en Tierra Viva San Blas.',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Caminata suave por San Blas',
          description: 'La tarde no es para ruinas — es para caminar despacio y tomar mate de coca en cualquier cafetería.',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Cena ligera en Cicciolina',
          description: 'Segundo piso, cocina de autor peruana en un balcón sobre la Plaza.',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Dormir',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Cusco histórico',
      items: [
        {
          time: '09:00',
          title: 'Desayuno buffet en el hotel',
          description: '',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Qorikancha',
          description: 'El templo del Sol donde los españoles construyeron un convento encima de los muros incas. Entrada: $12 USD.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Almuerzo en Mercado San Pedro',
          description: 'Menú del día por $3–5 USD.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Sacsayhuamán',
          description: 'Ruinas sobre la ciudad, a 20 min caminando cuesta arriba.',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Cena en MAP Café',
          description: 'Dentro del Museo de Arte Precolombino, precio medio-alto pero el entorno vale la entrada.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Valle Sagrado',
      items: [
        {
          time: '07:00',
          title: 'Salida en tour',
          description: 'Excursión de día completo. Pisac mercado, Ollantaytambo ruinas, Moray terrazas circulares. Tour organizado o taxi compartido.',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Regreso a Cusco',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena ligera',
          description: 'El restaurante Greens en Cusco para algo liviano.',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Traslado a Aguas Calientes',
      items: [
        {
          time: '08:00',
          title: 'Transfer a la estación de tren',
          description: '',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Tren a Aguas Calientes',
          description: 'Tren desde Poroy (cerca de Cusco) u Ollantaytambo según la reserva.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Check-in y almuerzo',
          description: 'Llegada a Aguas Calientes al mediodía. Check-in en Tierra Viva Machu Picchu.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Termas + descanso',
          description: 'Termas de Aguas Calientes (baños termales a $5 USD), masaje de 60 minutos en alguno de los locales del pueblo.',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Cena y preparación para el día siguiente',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Machu Picchu',
      items: [
        {
          time: '05:00',
          title: 'Desayuno rápido',
          description: 'El hotel prepara algo para llevar.',
          tags: [],
        },
        {
          time: '05:30',
          title: 'Bus al santuario',
          description: '',
          tags: [],
        },
        {
          time: '06:00',
          title: 'Machu Picchu',
          description: 'Tres a cuatro horas de recorrido según el circuito elegido. Si el estado físico lo permite: caminata al Puente Inca o al Sol Intipunku.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Almuerzo en Aguas Calientes',
          description: '',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Tren de regreso',
          description: '',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Llegada a Cusco',
          description: 'Traslado a Tierra Viva Centro.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en Chicha por Gastón Acurio',
          description: 'Cocina andina contemporánea, el restaurante más importante de Cusco.',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Cusco gastronómico',
      items: [
        {
          time: '10:00',
          title: 'Museo de Arte Precolombino (MAP)',
          description: 'Una hora, entrada $10 USD.',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Almuerzo en El Albergue o en Cicciolina',
          description: 'El Albergue en Ollantaytambo si hay tiempo.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Centro Artesanal, compras',
          description: 'Mercado y compras en el Centro Artesanal de Cusco.',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Cena en Pachapapa',
          description: 'Patio colonial, cuy al horno si la curiosidad lo permite.',
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: 'Vuelo de regreso',
      items: [
        {
          time: '09:00',
          title: 'Desayuno',
          description: '',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Última vuelta por el mercado / Plaza de Armas',
          description: 'Si el vuelo es en la tarde, última caminata por la Plaza de Armas.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Transfer al aeropuerto',
          description: 'Según horario de vuelo.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Tierra Viva Cusco San Blas',
      type: 'Hotel boutique · Cusco · San Blas',
      priceTier: '$$',
      description: 'Hotel boutique en una casona colonial restaurada en el barrio más bohemio y artesanal de Cusco. El patio interior con jardín andino, las 24 habitaciones decoradas con textiles locales y el desayuno buffet que empieza a las 6am para los que salen de tour temprano. A cuatro cuadras de la Plaza de Armas y a pocos metros de la Plaza San Blas, donde los artesanos venden sin intermediarios. Precio estimado: $70–100 USD/noche.',
      tag: 'Boutique en San Blas, base ideal',
      affiliateUrl: '',
      archetypes: ['Parejas'],
    },
    {
      name: 'El MaPi by Inkaterra',
      type: 'Hotel · Aguas Calientes',
      priceTier: '$$',
      description: 'Hotel de diseño contemporáneo de Inkaterra en el corazón del pueblo — a pasos de la Plaza Manco Cápac y a un minuto caminando del punto de salida de los buses a Machu Picchu. Desayuno buffet y cena incluidos en la tarifa, lo que elimina la fricción de buscar restaurantes. Lobby con techos altos, ramas de eucalipto seco y luz natural. Spa con jacuzzi interior para las horas de espera entre el regreso de Machu Picchu y el tren de vuelta. Precio estimado: $180–250 USD/noche (desayuno y cena incluidos).',
      tag: 'Diseño y pensión completa a pasos del bus',
      affiliateUrl: '',
      archetypes: ['Parejas'],
    },
    {
      name: 'Sumaq Machu Picchu Hotel',
      type: 'Hotel · Aguas Calientes',
      priceTier: '$$$',
      description: 'El mejor hotel de Aguas Calientes sin discusión seria — parte de Small Luxury Hotels of the World desde 2024. Frente al río Urubamba, con 62 habitaciones de diseño andino contemporáneo, el restaurante Qunuq con menú de degustación de cocina peruana de altura y el spa Aqlla para la tarde del regreso. El bus de Machu Picchu hace parada directa en la puerta del hotel — el único del pueblo con ese privilegio. El desayuno empieza a las 5am para los que toman la franja de las 6am en el santuario. Precio estimado: $500–800 USD/noche (media pensión incluida).',
      tag: 'El mejor de Aguas Calientes, parada del bus en la puerta',
      affiliateUrl: '',
      archetypes: ['Parejas', 'Bienestar'],
    },
  ],

  hotelsDescription: 'Tres bases, tres ritmos: Cusco para empezar, Aguas Calientes para el santuario.',

  experiences: [
    {
      name: 'Camino Salkantay (4 días / alternativa al Camino Inca)',
      description: 'El Camino Inca está limitado a 500 personas por día y se agota con meses de anticipación. El Salkantay — que cruza la montaña nevada de 6,271 metros y desciende por la selva hasta Aguas Calientes — tiene las mismas vistas, más naturaleza y menos cola. Operadores como Salkantay Trekking y Peru Treks ofrecen el recorrido de 4 días con carpa, cocinero y guía por $300–450 USD. Para el viajero solo, el trekking en grupo organizado es la forma más eficiente de hacerlo y la más probable de terminar con amigos de viaje.',
      tags: ['Trekking', 'Aventura', 'Grupo'],
      affiliateUrl: '',
    },
    {
      name: 'Cena en Central (Lima) — si el itinerario incluye escala',
      description: 'El restaurante de Virgilio Martínez en Lima es el mejor de América Latina según la lista de los 50 Best. Si el vuelo a Cusco hace escala en Lima — lo que es frecuente — una noche en Miraflores con cena en Central convierte la escala en parte del viaje. Reserva con dos meses de anticipación.',
      tags: ['Fine dining', '50 Best', 'Escala'],
      affiliateUrl: '',
    },
    {
      name: 'Valle Sagrado en un día',
      description: 'Pisac, Ollantaytambo y Moray en un solo recorrido en taxi compartido o tour organizado. El mercado de artesanías de Pisac los domingos es el más activo de la región; las ruinas circulares de Moray son las menos fotografiadas y las más sorprendentes. Tour de día completo desde Cusco: $20–35 USD.',
      tags: ['Valle Sagrado', 'Ruinas', 'Día completo'],
      affiliateUrl: '',
    },
  ],

  tips: [
    'La coca funciona: Mate, caramelos, hojas masticadas — la hoja de coca tiene alcaloides que ayudan con la altitud. Los hoteles la sirven gratis en la recepción. Úsala los dos primeros días sin cuestionar si es turístico o no hacerlo.',
    'El menú del día: En cualquier restaurante local de Cusco entre las 12 y las 3pm, un menú de tres tiempos — sopa, segundo y refresco — cuesta $3–6 USD. Es la mejor comida de la ciudad por precio. La sopa de quinoa y el seco de res son los platos que se repiten en los mejores menús del mercado de San Pedro.',
    'El primer bus a Machu Picchu: Los buses suben desde Aguas Calientes a las 5:30am. La fila empieza a las 5am. Quien llega a las 6am ya está en la segunda tanda. El santuario a las 6am con niebla baja sobre las ruinas es la imagen que los fotógrafos buscan. Vale la madrugada.',
  ],

  funFact: 'Machu Picchu fue construido alrededor de 1450 d.C. por el Inca Pachacútec y abandonado apenas 100 años después, probablemente durante la conquista española. Los conquistadores nunca lo encontraron. Lo redescubrió para el mundo occidental Hiram Bingham en 1911, guiado por un niño del pueblo de Aguas Calientes que lo conocía desde siempre.',

  checklist: [
    '🧥 Capas para la altitud (días templados, noches frías)',
    '🥾 Botas o tenis con buena suela para piedras incas',
    '💧 Botella de agua reusable',
    '🍃 Mate de coca o caramelos para el soroche',
    '🧴 Bloqueador solar factor alto',
    '🕶️ Lentes de sol y gorra',
    '💵 Soles peruanos para mercados y propinas',
    '🎒 Mochila pequeña para el día en Machu Picchu',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Aeropuerto Alejandro Velasco Astete (CUZ) en Cusco, a 20 minutos del centro en taxi ($10–15 USD). Vuelos directos desde Lima (LIM) en menos de 90 minutos con LATAM, Sky Airline o Avianca. Desde Ciudad de México, Bogotá o Buenos Aires: conexión en Lima obligatoria.',
    },
    {
      mode: 'Altitud',
      description: 'Cusco está a 3,400 metros sobre el nivel del mar. El mal de altura (soroche) es real: los primeros dos días hay que caminar despacio, no hacer esfuerzo, comer liviano y beber coca en cualquier forma que la ofrezcan. No subas al Machu Picchu el primer o segundo día — la aclimatación importa más que el itinerario optimizado.',
    },
    {
      mode: 'Tren a Aguas Calientes',
      description: 'PeruRail y Inca Rail operan el trayecto Ollantaytambo–Aguas Calientes (el más común, 1h40m) y el Cusco–Aguas Calientes (menos frecuente). Reserva online con semanas de anticipación — los trenes se agotan especialmente en temporada alta (junio–agosto). Precio: $50–100 USD ida según clase.',
    },
    {
      mode: 'Entradas a Machu Picchu',
      description: 'Se compran exclusivamente online en el sitio del Ministerio de Cultura de Perú (machupicchu.gob.pe). Hay tres circuitos y cuatro franjas horarias. El Circuito 2 o el 3 de la franja de 6am son los más recomendados para viajeros solos que quieren ver el amanecer sin grupos masivos.',
    },
  ],
}
