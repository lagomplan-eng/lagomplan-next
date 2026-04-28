import type { CityGuide } from '../types'

const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#2D4F6C'

export const es: CityGuide = {
  id:"mty",
  city:"Monterrey",
  country:"México",
  state:"Nuevo León",
  flag:"🇲🇽",
  accent: ACCENT,

  tags:["Fútbol","Gastronomía","Industria","Sede co-anfitriona"],

  stadium:{ name:"Estadio BBVA", capacity:"~53,500", area:"Guadalupe — municipio adyacente a la ciudad" },

  headline:"La ciudad más trabajadora de México recibe el Mundial con la misma actitud con la que construyó sus industrias: sin exceso de ornamento.",
  description:"La ciudad más trabajadora de México recibe el Mundial sin exceso de ornamento. El Estadio BBVA es el estadio de fútbol más moderno del país. La Sierra Madre es el telón de fondo más honesto que puede tener un partido. Cuatro partidos confirmados — y la advertencia más importante de esta guía: en junio, Monterrey puede superar los 40°C.",

  scores:[
    { label:"Ambiente",     value:4 },
    { label:"Fútbol local", value:4 },
    { label:"Gastronomía",  value:4 },
    { label:"Transporte",   value:4 },
    { label:"Seguridad",    value:4 },
    { label:"Costo",        value:4 },
  ],

  matches:[
    { id:"m1", date:"14 Jun", day:"Dom", time:"21:00 CT", teams:[{name:"Túnez",flag:"🇹🇳"},{name:"Rep. UEFA B",flag:""}], stadium:"Estadio BBVA", tag:"Grupo A — apertura de la sede", highlight:false },
    { id:"m2", date:"19 Jun", day:"Vie", time:"23:00 CT", teams:[{name:"Túnez",flag:"🇹🇳"},{name:"Japón",flag:"🇯🇵"}], stadium:"Estadio BBVA", tag:"Partido de medianoche — hora local", highlight:false },
    { id:"m3", date:"24 Jun", day:"Mié", time:"20:00 CT", teams:[{name:"Sudáfrica",flag:"🇿🇦"},{name:"Corea del Sur",flag:"🇰🇷"}], stadium:"Estadio BBVA", tag:"Grupo A — jornada final simultánea", highlight:false },
    { id:"m4", date:"29 Jun", day:"Lun", time:"20:00 CT", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"Estadio BBVA", tag:"Fase eliminatoria", highlight:false },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA",        value:"Estadio Monterrey (Estadio BBVA)" },
      { label:"Aforo",               value:"~53,500 — configuración FIFA. Diseñado por Populous, con el espectador a 9 metros del campo." },
      { label:"Techo",               value:"Techumbre parcial — muchas zonas expuestas al sol. Hidratación obligatoria." },
      { label:"Clima (jun–jul)",     value:"34–40°C días · 24–27°C noches · Calor seco e intenso. El estadio no tiene A/C." },
      { label:"Partidos",            value:"4 confirmados — fase de grupos (3) + Ronda de 32 (1)" },
      { label:"Aeropuerto principal",value:"MTY — Aeropuerto Internacional General Mariano Escobedo, a ~24 km del estadio en Guadalupe." },
      { label:"Visa",                value:"México no requiere visa para la mayoría de países latinoamericanos ni europeos. Verificar en embajada o consulado." },
    ],
    body:"Monterrey no vende postal. Vende precisión: una ciudad que construyó las industrias del país y ahora recibe al mundo con la misma lógica que siempre la ha guiado — sin adorno innecesario, con resultado concreto. El Estadio BBVA es el estadio de fútbol más moderno de México: diseño de Populous, espectador a nueve metros del campo, y una vista a la Sierra Madre que ningún estadio de la competencia tiene. Cuatro partidos confirmados, incluyendo un partido de medianoche el 19 de junio (Túnez vs. Japón, 23:00 CT) — la trampa logística más específica de esta sede. Calendario completo: 🇹🇳 Dom 14 Jun · 21:00 CT: Túnez vs. Repechaje UEFA B (Grupo A — apertura); 🇹🇳🇯🇵 Vie 19 Jun · 23:00 CT: Túnez vs. Japón (partido de medianoche); 🇿🇦🇰🇷 Mié 24 Jun · 20:00 CT: Sudáfrica vs. Corea del Sur (Grupo A — jornada final simultánea con Rep. Checa vs. México en CDMX); Lun 29 Jun · 20:00 CT: Ronda de 32.",
    lagomNote:"El partido de las 23:00 del 19 de junio es una trampa logística: salir del estadio a medianoche sin alojamiento confirmado en un municipio con poca oferta nocturna de transporte no es una situación ideal. Confirma alojamiento y transporte de regreso antes de asistir a ese partido. El calor de Monterrey en junio tampoco es opcional: el estadio tiene techumbre parcial y muchas zonas quedan expuestas al sol.",
  },

  vibe:{
    body:"Monterrey no tiene el peso simbólico de CDMX ni el cariño nacional de Guadalajara, pero su afición es de las más intensas de Liga MX. Con el Clásico Regio (Rayados vs. Tigres) como referencia habitual, la ciudad sabe recibir partidos de alta presión. Dos clubes de primer nivel, una rivalidad regional que divide familias y un estadio diseñado para maximizar el ruido. El Gigante de Acero no es solo un apodo — el diseño de Populous mantiene al espectador a nueve metros del campo. Más accesible que CDMX, comparable a Guadalajara en precio. El cabrito, el machacado y la cocina norteña son razones suficientes para extender la estadía más allá de los días de partido.",
    zones:[],
    lagomNote:"El Parque Fundidora — una acería del siglo XIX convertida en parque de 140 hectáreas — es el Fan Fest oficial de la sede. El contexto físico es uno de los mejores del torneo: chimeneas industriales de fondo, espacio abierto generoso y acceso por Metrorrey Línea 1 (estación Parque Fundidora). Para los partidos de grupo, el Paseo Santa Lucía tiene restaurantes con pantallas a lo largo del canal de 2.5 km.",
  },

  neighborhoods:[
    { name:"Barrio Antiguo", vibe:"Base recomendada. El único barrio de Monterrey con vida en la calle más allá de las 11pm. Calles empedradas, bares de cerveza artesanal, taquerías de madrugada y murales que documentan la historia industrial de la región. Acceso directo al Metrorrey Línea 1 desde la estación Cuauhtémoc.", best_for:"Fan WC", walk_to_stadium:"Metrorrey Cuauhtémoc → Exposición + shuttle (~25 min)", lagomNote:null },
    { name:"San Pedro Garza García", vibe:"Alternativa con criterio. El municipio más próspero de México funciona como la zona residencial premium de Monterrey. Más tranquilo que el Barrio Antiguo, con restaurantes de nivel internacional y acceso por Metrorrey Línea 2.", best_for:"Pareja", walk_to_stadium:"Metrorrey Línea 2 + transbordo (~35 min)", lagomNote:null },
    { name:"Guadalupe (inmediaciones del estadio)", vibe:"Zona a evitar como base para estadías de varios días. La zona alrededor del Estadio BBVA es funcional y segura pero sin mucho que ofrecer fuera de los días de partido.", best_for:"Solo logística", walk_to_stadium:"15 min — sin infraestructura de barrio", lagomNote:null },
  ],

  stayNeighborhoods:{
    intro:"Monterrey es compacta para sus dimensiones y más fácil de orientar que CDMX. El Estadio BBVA está en el municipio de Guadalupe — técnicamente adyacente, no dentro de la ciudad — pero el acceso desde el centro es manejable.",
    items:[
      { kind:"recommended", title:"Base recomendada: Barrio Antiguo", body:"El único barrio de Monterrey con vida en la calle más allá de las 11pm. Calles empedradas, bares de cerveza artesanal, taquerías de madrugada y murales que documentan la historia industrial de la región. A cuatro kilómetros de la Macroplaza y con acceso directo al Metrorrey Línea 1 desde la estación Cuauhtémoc. La distancia al estadio requiere transporte, pero el barrio compensa con creces la incomodidad logística." },
      { kind:"alternative", title:"Alternativa con criterio: San Pedro Garza García", body:"El municipio más próspero de México funciona en la práctica como la zona residencial premium de Monterrey. Más tranquilo que el Barrio Antiguo, con restaurantes de nivel internacional y acceso por Metrorrey Línea 2. Para el fan que prioriza comodidad sobre ambiente callejero." },
      { kind:"avoid", title:"Evitar como base: Guadalupe (inmediaciones del estadio)", body:"La zona alrededor del Estadio BBVA es funcional y segura, pero sin mucho que ofrecer fuera de los días de partido. Si el itinerario es exclusivamente estadio y vuelo de regreso, tiene lógica; para una estadía de varios días, no." },
    ],
  },
  stays:[
    { name:"Habitta Monterrey", area:"San Pedro Garza García", price:"$$$", priceCAD:"Precio estimado en periodo mundialista: $180–290 USD/noche", tags:["Boutique","Terraza con vistas","Sierra Madre"], note:"Diseño contemporáneo en el corredor más cotizado de la ciudad. Restaurante propio, terraza con vistas a la Sierra Madre y habitaciones sin el aspecto institucional de las cadenas internacionales.", best_for:"Hotel boutique", url:"https://expedia.stay22.com/lagomplan/yD8N_TNYL_" },
    { name:"Hostel El Greco", area:"Barrio Antiguo", price:"$", priceCAD:"Precio estimado en periodo mundialista: $20–50 USD/noche según tipo de habitación", tags:["Presupuesto","Habitaciones privadas","Barrio Antiguo"], note:"Una de las pocas opciones de hostal serias en Monterrey, bien ubicada para quien quiere vivir el barrio y no solo dormir en él. Habitaciones privadas y compartidas disponibles.", best_for:"Presupuesto", url:"https://booking.stay22.com/lagomplan/2yUSCjx1QD" },
    { name:"Safi Royal Luxury Valley", area:"San Pedro Garza García", price:"$$$$", priceCAD:"Precio estimado en periodo mundialista: $350–580 USD/noche", tags:["Vista al Cerro de la Silla","Spa","50 habitaciones"], note:"Cincuenta habitaciones, spa, piscina y vista directa al Cerro de la Silla. El nivel de servicio es desproporcionadamente alto para el tamaño del hotel — la mejor relación tamaño-calidad de la ciudad.", best_for:"Lujo", url:"https://expedia.stay22.com/lagomplan/w9a6IdpzL_" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Llegar a Monterrey — MTY", text:"MTY — Aeropuerto Internacional General Mariano Escobedo está a ~24 km del estadio. Taxi o Uber directo al estadio: ~35 minutos, ~$250–400 MXN. Al Barrio Antiguo o San Pedro: ~30 minutos, ~$200–350 MXN." },
      { icon:"🚇", title:"Ruta maestra al estadio — Metrorrey + shuttle", text:"Metrorrey Línea 1 → estación Exposición → shuttle FIFA o caminata (~1.5 km). El Metrorrey conecta desde Barrio Antiguo (Cuauhtémoc → Exposición: ~15 min). Tarifa: $5 MXN. FIFA operará shuttles en días de partido desde Exposición hasta el estadio." },
      { icon:"🏟", title:"Al estadio el día del partido", text:"Metrorrey hasta Exposición, luego shuttle o caminata señalizada de 1.5 km. Alternativa: Uber con drop-off habilitado cerca de la Puerta D. En días de partido: el Uber al regreso puede tardar 35–50 minutos de espera. Si usas Uber de regreso, solicítalo antes de que termine el partido." },
      { icon:"⚠️", title:"Advertencia crítica — calor extremo", text:"En junio, Monterrey puede superar los 40°C durante el día. El estadio tiene techumbre parcial — muchas zonas quedan expuestas al sol. Hidratación antes del partido no es opcional: sombrero, protector solar y dos litros de agua antes de entrar. El estadio limita los contenedores al ingreso — verifica la normativa FIFA antes del partido.", isWarning:true },
    ],
    timings:[
      { label:"Desde Barrio Antiguo (Metrorrey + shuttle)", value:"~25 min" },
      { label:"Desde San Pedro (Metrorrey, transbordo)",    value:"~35 min" },
      { label:"Desde MTY (aeropuerto) en Uber al estadio",  value:"~35 min" },
      { label:"Uber desde Barrio Antiguo (día de partido)", value:"35–50 min + posible surge" },
    ],
    matchDayCronologia:{
      matchName:"19 Jun · Túnez vs. Japón · 23:00 CT",
      steps:[
        { time:"H-4:00", text:"Cena temprana en Barrio Antiguo. Es un partido de medianoche — come bien antes de las 8pm." },
        { time:"H-2:30", text:"Desplázate al Metrorrey. Línea 1 desde Cuauhtémoc hacia Exposición." },
        { time:"H-1:30", text:"Llegada al estadio. Puertas abiertas. La noche refresca — el juego nocturno tiene otra textura en Monterrey." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo. El calor del día ya no aplica a las 11pm — es el mejor horario de la sede." },
        { time:"H+0:00", text:"Partido." },
        { time:"H+1:45", text:"Son las 2:00am. Salida inmediata — la oferta de transporte nocturno es limitada. Metrorrey último servicio varía; confirma horario antes del partido." },
      ],
    },
    timing:"El estadio está en Guadalupe, a ~6 km del centro. El Metrorrey es la ruta más confiable en días de partido. Para el partido nocturno del 19 de junio (23:00 CT), confirma el horario de último servicio del Metrorrey y ten Uber como respaldo.",
    cost:"Más accesible que CDMX, comparable a Guadalajara. Los precios subirán en fechas de partido, pero el margen de aumento es menor que en la capital. El gasto real en esta sede es hidratación y protector solar.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ @ Parque Fundidora", type:"Fan fest oficial", typeColor:CORAL, desc:"Una acería del siglo XIX convertida en parque urbano de 140 hectáreas. El Fan Fest de Monterrey tiene uno de los mejores contextos físicos del torneo: chimeneas industriales de fondo, espacio abierto generoso y programación con artistas internacionales confirmados. Acceso por Metrorrey Línea 1, estación Parque Fundidora. Gratuito.", tag:"Sin boleto OK" },
    { title:"Macroplaza / Explanada de los Héroes", type:"Pantalla exterior", typeColor:FJORD, desc:"La plaza cívica más grande de América Latina — cuatro veces el Zócalo — tiene capacidad para transmisiones masivas sin instalaciones adicionales. La vista al Cerro de la Silla desde la explanada convierte cualquier partido nocturno en algo difícil de olvidar.", tag:"Centro" },
    { title:"Paseo Santa Lucía", type:"Corredor fluvial", typeColor:SAGE, desc:"El canal navegable de 2.5 km que conecta el Parque Fundidora con la Macroplaza tiene puentes, terrazas y restaurantes que instalan pantallas durante el torneo. Ver el partido sentado a la orilla del agua, con el skyline de fondo, es el plan menos masivo y más disfrutable de la sede.", tag:"Tranquilo" },
    { title:"Estadio Tecnológico (ITESM)", type:"Transmisión histórica", typeColor:PINE, desc:"La antigua casa de los Rayados antes del BBVA fue sede mundialista en 1970 y 1986. El campus del Tec puede activar espacios exteriores con pantallas para los partidos de mayor perfil. Ver el fútbol con historia en un estadio con historia.", tag:"Histórico" },
    { title:"La Fe Restaurante (Barrio Antiguo)", type:"Norteño contemporáneo", typeColor:"#2D6B4A", desc:"Cocina norteña con técnica más cuidada que el promedio. El lugar más honesto para entender cómo come Monterrey cuando quiere hacerlo bien — arrachera, frijoles charros, pantallas de buen tamaño sin sacrificar la experiencia gastronómica.", tag:"Barrio Antiguo" },
    { title:"Bola Ocho Restaurant & Bar (San Pedro)", type:"Sports bar", typeColor:"#1A3A5C", desc:"Amplio sports bar con mesas de billar, pantallas de gran formato y el ambiente de fútbol más internacional de Monterrey. El punto de encuentro habitual de quienes siguen la Premier League en la ciudad. Para la sede con más calor del torneo, el A/C de Bola Ocho también es un argumento.", tag:"Sports bar" },
  ],

  food:[
    { dish:"La Fe Restaurante",     where:"Barrio Antiguo — arrachera + frijoles charros; norteño contemporáneo, pantallas de buen tamaño",       price:"$$",  type:"Norteño" },
    { dish:"La Catarina",           where:"San Pedro — corte a elegir + queso fundido; asador, ruidoso y apasionado en días de partido",            price:"$$$", type:"Asador" },
    { dish:"Bola Ocho",             where:"San Pedro — alitas + cervezas de barril; sports bar con A/C, el más internacional de Monterrey",        price:"$$",  type:"Sports bar" },
    { dish:"Cabrito al pastor",     where:"Cualquier asador del Barrio Antiguo o el centro — el plato más emblemático de la cocina norteña",        price:"$$",  type:"Imperdible" },
    { dish:"Taquería de machacado", where:"Barrio Antiguo o mercado de San Luisito — machacado con huevo, el desayuno regiomontano de referencia", price:"$",   type:"Desayuno" },
  ],

  experiences:[
    { title:"Parque Fundidora + Paseo Santa Lucía", duration:"Medio día", desc:"El Parque Fundidora es la reconversión más exitosa de espacio industrial en México: 140 hectáreas con el MARCO de Arte Contemporáneo a cuadras, patinódromo, lago artificial y los altos hornos originales que se pueden recorrer. El Paseo Santa Lucía es un canal navegable de 2.5 km que conecta el parque con la Macroplaza en trajinera — 45 minutos de recorrido, la forma más tranquila de orientarse en la ciudad.", type:"Urbano", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Tour por Parque Fundidora" },
    { title:"Grutas de García", duration:"Medio día", desc:"A 45 kilómetros al noroeste, en el municipio de García, estas grutas son una de las formaciones geológicas más grandes y accesibles del noreste de México. El acceso incluye un teleférico. Recomendable en horario matutino para evitar el calor de la tarde. Se puede ir y volver en medio día con transporte propio o tour desde el centro.", type:"Aventura", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Tours a las Grutas de García" },
    { title:"Museo de Historia Mexicana + Museo del Noreste", duration:"Mañana", desc:"Dos museos en el mismo complejo frente al Río Santa Catarina en el centro. El de Historia ofrece un recorrido cronológico desde las culturas prehispánicas hasta el siglo XX; el del Noreste profundiza en la historia regional. Acceso económico, bien climatizado — lo agradecerás en junio — y a quince minutos caminando del Barrio Antiguo.", type:"Cultural", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver museos del centro de Monterrey" },
  ],

  itinerary:[
    { day:1, title:"Llegada y primer pulso", subtitle:"Barrio Antiguo · Macroplaza · Paseo Santa Lucía", isMatchDay:false, steps:[
      { time:"Llegada",   text:"Uber desde MTY al Barrio Antiguo (~30 min, ~$250 MXN). Monterrey es compacta para sus dimensiones y más fácil de orientar que CDMX." },
      { time:"Tarde",     text:"Macroplaza. La plaza cívica más grande de América Latina con el Cerro de la Silla al fondo. La vista que ningún turista espera de una ciudad industrial." },
      { time:"Atardecer", text:"Paseo Santa Lucía. El canal navegable desde la Macroplaza hasta Parque Fundidora. Restaurantes con terraza, skyline al fondo." },
      { time:"Noche",     text:"Barrio Antiguo. La única zona con vida en la calle después de las 11pm — calles empedradas, taquerías y cervecerías artesanales." },
    ]},
    { day:2, title:"Día de partido — Túnez vs. Japón", subtitle:"Estadio BBVA · Vie 19 Jun · 23:00 CT · Partido de medianoche", isMatchDay:true, matchRef:"m2", steps:[
      { time:"H-4:00", text:"Cena temprana en el Barrio Antiguo — es un partido de medianoche. Come bien antes de las 8pm." },
      { time:"H-2:30", text:"Metrorrey Línea 1 desde Cuauhtémoc hacia Exposición. Sin prisa — la ciudad de noche es diferente." },
      { time:"H-1:30", text:"Shuttle FIFA desde Exposición o caminata señalizada al estadio. La noche refresca — el juego nocturno tiene otra textura en Monterrey." },
      { time:"23:00",  text:"Túnez vs. Japón. Medianoche local. El calor del día no aplica a esta hora — es el mejor horario de la sede." },
      { time:"H+1:45", text:"Son las 2:00am. Salida inmediata. Confirma horario de último Metrorrey antes del partido y ten Uber como respaldo." },
    ]},
    { day:3, title:"Grutas de García y Parque Fundidora", subtitle:"Grutas de García · 45 km · Regreso al Parque Fundidora", isMatchDay:false, steps:[
      { time:"Mañana",   text:"Salida temprana hacia las Grutas de García (~45 km, tour organizado o auto propio). Teleférico incluido en el acceso." },
      { time:"Mediodía", text:"Regreso a la ciudad. Almuerzo en el Barrio Antiguo — cabrito al pastor o machacado con huevo." },
      { time:"Tarde",    text:"Parque Fundidora: altos hornos originales, lago artificial, MARCO de Arte Contemporáneo." },
      { time:"Noche",    text:"Cervecería artesanal en el Barrio Antiguo. La escena de cerveza artesanal de Monterrey es la más desarrollada del noreste de México." },
    ]},
    { day:4, title:"Día de partido — Sudáfrica vs. Corea del Sur", subtitle:"Estadio BBVA · Mié 24 Jun · 20:00 CT", isMatchDay:true, matchRef:"m3", steps:[
      { time:"H-3:00", text:"Tarde libre. Museo de Historia Mexicana o paseo por la Macroplaza antes del partido." },
      { time:"H-2:00", text:"Metrorrey Línea 1 hacia Exposición. Shuttle al estadio." },
      { time:"H-1:30", text:"Llegada al estadio. Sudáfrica vs. Corea del Sur — jornada final del Grupo A, simultánea con Rep. Checa vs. México en CDMX." },
      { time:"20:00",  text:"Partido. El calor del mediodía ya cedió. Monterrey en la noche es otra ciudad." },
      { time:"Post",   text:"Regreso por Metrorrey. La Catarina en San Pedro o el Barrio Antiguo para el post-partido." },
    ]},
  ],

  lagomTips:[
    "El calor de Monterrey en junio no es opcional. El estadio tiene techumbre parcial — muchas zonas quedan expuestas al sol. Sombrero, protector solar y dos litros de agua antes de entrar. Para los partidos diurnos o vespertinos, esto no es consejo de guía turística: es instrucción de seguridad.",
    "El partido de las 23:00 del 19 de junio (Túnez vs. Japón) es la trampa logística más específica de esta sede. Confirma el horario de último servicio del Metrorrey antes de asistir y ten Uber como respaldo para el regreso pasada la medianoche.",
    "La ruta correcta al estadio es Metrorrey Línea 1 → estación Exposición → shuttle FIFA o caminata de 1.5 km. El Metrorrey opera en carril exclusivo — el tráfico de partido no lo afecta.",
    "Monterrey es la capital de la carne asada en México. No porque los norteños lo proclamen — sino porque la tradición del asado como evento social tiene aquí una consistencia que pocas ciudades del país replican. El cabrito al pastor es la experiencia gastronómica imprescindible de la sede.",
  ],

  matchDayChecklist:[
    "Boleto digital del partido — app FIFA (sin versión en papel)",
    "Efectivo MXN o tarjeta para Metrorrey (~$5 MXN)",
    "Ruta: Metrorrey Línea 1 → Exposición → shuttle o caminata al BBVA",
    "Sombrero y protector solar (partidos con sol); hidratación antes de entrar",
    "Verificar normativa FIFA sobre contenedores de bebidas permitidos",
    "Para partido de medianoche (19 jun): confirmar último servicio del Metrorrey",
    "Llegada al estadio 90 min antes — puertas abren H-1:30",
    "Reserva de hotel confirmada para noches de partido",
  ],

  didYouKnow:"El Estadio BBVA fue diseñado por Populous — los mismos arquitectos del Tottenham Hotspur Stadium y el Yankee Stadium — con el objetivo explícito de que ningún espectador esté a más de 9 metros del campo. El diseño mantiene la presión sonora de la tribuna dentro del recinto de una manera que pocos estadios del mundo replican. La Sierra Madre al fondo no estaba en los planos de Populous, pero nadie se queja.",
  closingNote:"Monterrey no vende postal. Vende precisión: una ciudad que construyó las industrias del país y ahora recibe al mundo con la misma lógica que siempre la ha guiado — sin adorno innecesario, con resultado concreto. El Estadio BBVA es el estadio de fútbol más moderno de México. La Sierra Madre es el telón de fondo más honesto que puede tener un partido. LagomPlan no te pide que te enamores de la ciudad. Solo que llegues con agua, con reserva confirmada y con la certeza de que en Monterrey, el fútbol se vive en serio.",
  closingSignature:"Lagomplan · Guía de campo · Monterrey · Mundial 2026",
  plannerCTA:"Generar mi viaje a Monterrey",
}

export const en: CityGuide = {
  id:"mty",
  city:"Monterrey",
  country:"Mexico",
  state:"Nuevo León",
  flag:"🇲🇽",
  accent: ACCENT,

  tags:["Football","Food","Industry","Co-host city"],

  stadium:{ name:"Estadio BBVA", capacity:"~53,500", area:"Guadalupe — adjacent municipality" },

  headline:"Mexico's hardest-working city welcomes the World Cup the same way it built its industries: without excess ornament.",
  description:"Mexico's hardest-working city welcomes the World Cup without excess ornament. Estadio BBVA is the country's most modern football stadium. The Sierra Madre is the most honest backdrop a match can ask for. Four confirmed matches — and the most important warning in this guide: in June, Monterrey can top 40°C.",

  scores:[
    { label:"Atmosphere", value:4 },
    { label:"Football",   value:4 },
    { label:"Food",       value:4 },
    { label:"Transit",    value:4 },
    { label:"Safety",     value:4 },
    { label:"Cost",       value:4 },
  ],

  matches:[
    { id:"m1", date:"Jun 14", day:"Sun", time:"21:00 CT", teams:[{name:"Tunisia",flag:"🇹🇳"},{name:"UEFA Play-off B",flag:""}], stadium:"Estadio BBVA", tag:"Group A — host opener", highlight:false },
    { id:"m2", date:"Jun 19", day:"Fri", time:"23:00 CT", teams:[{name:"Tunisia",flag:"🇹🇳"},{name:"Japan",flag:"🇯🇵"}], stadium:"Estadio BBVA", tag:"Midnight match — local time", highlight:false },
    { id:"m3", date:"Jun 24", day:"Wed", time:"20:00 CT", teams:[{name:"South Africa",flag:"🇿🇦"},{name:"South Korea",flag:"🇰🇷"}], stadium:"Estadio BBVA", tag:"Group A — simultaneous final matchday", highlight:false },
    { id:"m4", date:"Jun 29", day:"Mon", time:"20:00 CT", teams:[{name:"Round of 32",flag:""},{name:"TBD",flag:""}], stadium:"Estadio BBVA", tag:"Knockout stage", highlight:false },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium",     value:"Estadio Monterrey (Estadio BBVA)" },
      { label:"Capacity",         value:"~53,500 — FIFA configuration. Designed by Populous, with spectators 9 meters from the pitch." },
      { label:"Roof",             value:"Partial canopy — many areas exposed to the sun. Hydration mandatory." },
      { label:"Weather (Jun–Jul)",value:"34–40°C days · 24–27°C nights · Dry, intense heat. No A/C in the stadium." },
      { label:"Matches",          value:"4 confirmed — group stage (3) + Round of 32 (1)" },
      { label:"Primary airport",  value:"MTY — General Mariano Escobedo International Airport, ~24 km from the stadium in Guadalupe." },
      { label:"Visa",             value:"Mexico requires no visa for most Latin American or European countries. Check your embassy or consulate." },
    ],
    body:"Monterrey doesn't sell postcards. It sells precision: a city that built the country's industries and now welcomes the world with the same logic that has always guided it — no unnecessary ornament, concrete results. Estadio BBVA is Mexico's most modern football stadium: Populous design, spectators nine meters from the pitch, and a view of the Sierra Madre that no competitor stadium can match. Four confirmed matches, including a midnight kickoff on June 19 (Tunisia vs. Japan, 23:00 CT) — the most specific logistical trap of this host city. Full schedule: 🇹🇳 Sun Jun 14 · 21:00 CT: Tunisia vs. UEFA Play-off B (Group A — opener); 🇹🇳🇯🇵 Fri Jun 19 · 23:00 CT: Tunisia vs. Japan (midnight match); 🇿🇦🇰🇷 Wed Jun 24 · 20:00 CT: South Africa vs. South Korea (Group A — simultaneous final matchday with Czech Rep. vs. Mexico in CDMX); Mon Jun 29 · 20:00 CT: Round of 32.",
    lagomNote:"The 23:00 match on June 19 is a logistical trap: leaving the stadium at midnight without confirmed lodging in a municipality with limited nighttime transit is not an ideal situation. Confirm lodging and return transport before attending. Monterrey's June heat isn't optional either: the stadium has only a partial canopy, and many sections stay exposed to the sun.",
  },

  vibe:{
    body:"Monterrey doesn't carry CDMX's symbolic weight or Guadalajara's national affection, but its fans are among Liga MX's most intense. With the Clásico Regio (Rayados vs. Tigres) as a regular reference, the city knows how to host high-pressure matches. Two top-flight clubs, a regional rivalry that splits families, and a stadium designed to maximize noise. The Gigante de Acero isn't just a nickname — the Populous design keeps spectators nine meters from the pitch. More accessible than CDMX, comparable to Guadalajara in price. Cabrito, machacado, and northern Mexican cooking are reasons enough to extend your stay beyond match days.",
    zones:[],
    lagomNote:"Parque Fundidora — a 19th-century steelworks turned 140-hectare park — is the host city's official Fan Fest. The physical setting is one of the best in the tournament: industrial chimneys as backdrop, generous open space, and access via Metrorrey Line 1 (Parque Fundidora stop). For group-stage matches, the Paseo Santa Lucía has restaurants with screens along its 2.5 km canal.",
  },

  neighborhoods:[
    { name:"Barrio Antiguo", vibe:"Recommended base. Monterrey's only neighborhood with street life past 11pm. Cobblestone streets, craft-beer bars, late-night taquerías, and murals documenting the region's industrial history. Direct Metrorrey Line 1 access from Cuauhtémoc station.", best_for:"WC fan", walk_to_stadium:"Metrorrey Cuauhtémoc → Exposición + shuttle (~25 min)", lagomNote:null },
    { name:"San Pedro Garza García", vibe:"Considered alternative. Mexico's wealthiest municipality functions as Monterrey's premium residential zone. Quieter than Barrio Antiguo, with international-level restaurants and Metrorrey Line 2 access.", best_for:"Couples", walk_to_stadium:"Metrorrey Line 2 + transfer (~35 min)", lagomNote:null },
    { name:"Guadalupe (near the stadium)", vibe:"Zone to avoid as a base for multi-day stays. The area around Estadio BBVA is functional and safe but offers little outside match days.", best_for:"Logistics only", walk_to_stadium:"15 min — no neighborhood infrastructure", lagomNote:null },
  ],

  stays:[
    { name:"Habitta Monterrey", area:"San Pedro Garza García", price:"$$$", priceCAD:"World Cup rates: $180–290 USD/night", tags:["Boutique","Rooftop views","Sierra Madre"], note:"Contemporary design in the city's most sought-after corridor. Its own restaurant, a terrace with Sierra Madre views, and rooms without the institutional feel of international chains.", best_for:"Boutique", url:"https://expedia.stay22.com/lagomplan/yD8N_TNYL_" },
    { name:"Hostel El Greco", area:"Barrio Antiguo", price:"$", priceCAD:"World Cup rates: $20–50 USD/night by room type", tags:["Budget","Private rooms","Barrio Antiguo"], note:"One of Monterrey's few serious hostel options, well located for anyone who wants to live the neighborhood and not just sleep in it. Private and shared rooms available.", best_for:"Budget", url:"https://booking.stay22.com/lagomplan/2yUSCjx1QD" },
    { name:"Safi Royal Luxury Valley", area:"San Pedro Garza García", price:"$$$$", priceCAD:"World Cup rates: $350–580 USD/night", tags:["Cerro de la Silla view","Spa","50 rooms"], note:"Fifty rooms, spa, pool, and direct views of Cerro de la Silla. Service levels are disproportionately high for the hotel's size — the city's best size-to-quality ratio.", best_for:"Luxury", url:"https://expedia.stay22.com/lagomplan/w9a6IdpzL_" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Arriving in Monterrey — MTY", text:"MTY — General Mariano Escobedo International Airport is ~24 km from the stadium. Taxi or Uber direct to the stadium: ~35 minutes, ~$250–400 MXN. To Barrio Antiguo or San Pedro: ~30 minutes, ~$200–350 MXN." },
      { icon:"🚇", title:"Master route to the stadium — Metrorrey + shuttle", text:"Metrorrey Line 1 → Exposición station → FIFA shuttle or walk (~1.5 km). Metrorrey connects from Barrio Antiguo (Cuauhtémoc → Exposición: ~15 min). Fare: $5 MXN. FIFA will run shuttles on match days from Exposición to the stadium." },
      { icon:"🏟", title:"To the stadium on match day", text:"Metrorrey to Exposición, then the shuttle or a signed 1.5 km walk. Alternative: Uber with drop-off enabled near Gate D. On match days, the return Uber wait can run 35–50 minutes. If you're using Uber to return, request it before the final whistle." },
      { icon:"⚠️", title:"Critical warning — extreme heat", text:"In June, Monterrey can top 40°C during the day. The stadium has only a partial canopy — many sections are exposed to the sun. Pre-match hydration isn't optional: hat, sunscreen, and two liters of water before entering. The stadium limits liquid containers at the gate — check FIFA's policy before the match.", isWarning:true },
    ],
    timings:[
      { label:"From Barrio Antiguo (Metrorrey + shuttle)", value:"~25 min" },
      { label:"From San Pedro (Metrorrey, transfer)",      value:"~35 min" },
      { label:"From MTY (airport) by Uber to the stadium", value:"~35 min" },
      { label:"Uber from Barrio Antiguo (match day)",      value:"35–50 min + possible surge" },
    ],
    matchDayCronologia:{
      matchName:"Jun 19 · Tunisia vs. Japan · 23:00 CT",
      steps:[
        { time:"H-4:00", text:"Early dinner in Barrio Antiguo. It's a midnight match — eat well before 8pm." },
        { time:"H-2:30", text:"Head to Metrorrey. Line 1 from Cuauhtémoc toward Exposición." },
        { time:"H-1:30", text:"At the stadium. Gates open. The night cools off — nighttime football has a different texture in Monterrey." },
        { time:"H-0:30", text:"In your seat. Digital ticket ready. The day's heat no longer applies at 11pm — it's the best slot of the host city." },
        { time:"H+0:00", text:"Kickoff." },
        { time:"H+1:45", text:"It's 2:00am. Leave immediately — nighttime transport options are limited. Last Metrorrey service varies; confirm before the match." },
      ],
    },
    timing:"The stadium sits in Guadalupe, ~6 km from downtown. Metrorrey is the most reliable match-day route. For the June 19 night match (23:00 CT), confirm the last Metrorrey service and keep Uber as a backup.",
    cost:"More accessible than CDMX, comparable to Guadalajara. Prices will climb on match dates, but the markup is smaller than in the capital. Real spending here goes to hydration and sunscreen.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ @ Parque Fundidora", type:"Official fan fest", typeColor:CORAL, desc:"A 19th-century steelworks turned 140-hectare urban park. Monterrey's Fan Fest has one of the best physical settings in the tournament: industrial chimneys as backdrop, generous open space, and a confirmed lineup of international artists. Metrorrey Line 1, Parque Fundidora stop. Free.", tag:"No ticket needed" },
    { title:"Macroplaza / Explanada de los Héroes", type:"Outdoor screen", typeColor:FJORD, desc:"Latin America's largest civic plaza — four times the Zócalo — can host mass broadcasts without additional infrastructure. The Cerro de la Silla view from the esplanade makes any night match hard to forget.", tag:"Downtown" },
    { title:"Paseo Santa Lucía", type:"River walk", typeColor:SAGE, desc:"The 2.5 km navigable canal connecting Parque Fundidora with the Macroplaza has bridges, terraces, and restaurants that install screens during the tournament. Watching a match from the waterside, skyline behind you, is the host city's least massive and most enjoyable plan.", tag:"Low-key" },
    { title:"Estadio Tecnológico (ITESM)", type:"Historic screening", typeColor:PINE, desc:"Rayados' former home before BBVA hosted World Cup matches in 1970 and 1986. The Tec campus may activate outdoor spaces with screens for the biggest matches. Watching football with history at a stadium with history.", tag:"Historic" },
    { title:"La Fe Restaurante (Barrio Antiguo)", type:"Contemporary norteño", typeColor:"#2D6B4A", desc:"Northern-Mexican cooking with more careful technique than average. The most honest place to understand how Monterrey eats when it wants to eat well — arrachera, frijoles charros, properly sized screens without sacrificing the dining experience.", tag:"Barrio Antiguo" },
    { title:"Bola Ocho Restaurant & Bar (San Pedro)", type:"Sports bar", typeColor:"#1A3A5C", desc:"Wide sports bar with pool tables, big-format screens, and Monterrey's most international football scene. The regular meeting point for the city's Premier League crowd. For the tournament's hottest host city, Bola Ocho's A/C is also an argument.", tag:"Sports bar" },
  ],

  food:[
    { dish:"La Fe Restaurante",     where:"Barrio Antiguo — arrachera + frijoles charros; contemporary norteño with properly sized screens", price:"$$",  type:"Norteño" },
    { dish:"La Catarina",           where:"San Pedro — cut to order + queso fundido; grill house, loud and passionate on match days",         price:"$$$", type:"Grill house" },
    { dish:"Bola Ocho",             where:"San Pedro — wings + draft beer; air-conditioned sports bar, Monterrey's most international",       price:"$$",  type:"Sports bar" },
    { dish:"Cabrito al pastor",     where:"Any grill house in Barrio Antiguo or downtown — the most emblematic dish of northern cuisine",     price:"$$",  type:"Must try" },
    { dish:"Machacado con huevo",   where:"Barrio Antiguo or San Luisito market — machacado with egg, the benchmark Monterrey breakfast",     price:"$",   type:"Breakfast" },
  ],

  experiences:[
    { title:"Parque Fundidora + Paseo Santa Lucía", duration:"Half day", desc:"Parque Fundidora is the most successful conversion of industrial space in Mexico: 140 hectares with the MARCO Contemporary Art Museum blocks away, a skating track, artificial lake, and the original blast furnaces you can walk through. The Paseo Santa Lucía is a 2.5 km navigable canal connecting the park with the Macroplaza by trajinera — a 45-minute ride, the most relaxed way to orient yourself in the city.", type:"Urban", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Parque Fundidora tour" },
    { title:"Grutas de García", duration:"Half day", desc:"45 km northwest, in the municipality of García, these caves are one of the largest and most accessible geological formations in northeastern Mexico. Access includes a cable car. Best in the morning to avoid afternoon heat. Doable as a half-day round trip with your own transport or a tour from downtown.", type:"Adventure", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Grutas de García tours" },
    { title:"Mexican History Museum + Museum of the Northeast", duration:"Morning", desc:"Two museums in the same complex facing the Santa Catarina River downtown. History offers a chronological tour from pre-Hispanic cultures to the 20th century; Northeast digs deeper into regional history. Affordable, well air-conditioned — you'll appreciate that in June — and a 15-minute walk from Barrio Antiguo.", type:"Cultural", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Downtown Monterrey museums" },
  ],

  itinerary:[
    { day:1, title:"Arrival and first pulse", subtitle:"Barrio Antiguo · Macroplaza · Paseo Santa Lucía", isMatchDay:false, steps:[
      { time:"Arrival",  text:"Uber from MTY to Barrio Antiguo (~30 min, ~$250 MXN). Monterrey is compact for its size and easier to navigate than CDMX." },
      { time:"Afternoon",text:"Macroplaza. Latin America's largest civic plaza with Cerro de la Silla as backdrop. The view no tourist expects from an industrial city." },
      { time:"Sunset",   text:"Paseo Santa Lucía. The navigable canal from Macroplaza to Parque Fundidora. Terraced restaurants, skyline behind you." },
      { time:"Evening",  text:"Barrio Antiguo. The only zone with street life after 11pm — cobblestone streets, taquerías, and craft breweries." },
    ]},
    { day:2, title:"Match day — Tunisia vs. Japan", subtitle:"Estadio BBVA · Fri Jun 19 · 23:00 CT · Midnight match", isMatchDay:true, matchRef:"m2", steps:[
      { time:"H-4:00", text:"Early dinner in Barrio Antiguo — it's a midnight match. Eat well before 8pm." },
      { time:"H-2:30", text:"Metrorrey Line 1 from Cuauhtémoc toward Exposición. No rush — the city at night is a different place." },
      { time:"H-1:30", text:"FIFA shuttle from Exposición or signed walk to the stadium. The night cools off — nighttime football has a different texture in Monterrey." },
      { time:"23:00",  text:"Tunisia vs. Japan. Local midnight. The day's heat no longer applies — it's the best slot of the host city." },
      { time:"H+1:45", text:"It's 2:00am. Leave immediately. Confirm the last Metrorrey before the match and keep Uber as backup." },
    ]},
    { day:3, title:"Grutas de García and Parque Fundidora", subtitle:"Grutas de García · 45 km · Return to Parque Fundidora", isMatchDay:false, steps:[
      { time:"Morning",  text:"Early departure to Grutas de García (~45 km, organized tour or your own car). Cable car included in admission." },
      { time:"Midday",   text:"Back in the city. Lunch in Barrio Antiguo — cabrito al pastor or machacado with egg." },
      { time:"Afternoon",text:"Parque Fundidora: original blast furnaces, artificial lake, MARCO Contemporary Art Museum." },
      { time:"Evening",  text:"Craft brewery in Barrio Antiguo. Monterrey's craft-beer scene is the most developed in northeast Mexico." },
    ]},
    { day:4, title:"Match day — South Africa vs. South Korea", subtitle:"Estadio BBVA · Wed Jun 24 · 20:00 CT", isMatchDay:true, matchRef:"m3", steps:[
      { time:"H-3:00", text:"Free afternoon. Mexican History Museum or a walk through Macroplaza before the match." },
      { time:"H-2:00", text:"Metrorrey Line 1 toward Exposición. Shuttle to the stadium." },
      { time:"H-1:30", text:"At the stadium. South Africa vs. South Korea — Group A final matchday, simultaneous with Czech Rep. vs. Mexico in CDMX." },
      { time:"20:00",  text:"Kickoff. The midday heat has eased. Monterrey at night is a different city." },
      { time:"Post",   text:"Back via Metrorrey. La Catarina in San Pedro or Barrio Antiguo for post-match." },
    ]},
  ],

  lagomTips:[
    "Monterrey's June heat is not optional. The stadium has only a partial canopy — many sections stay exposed to the sun. Hat, sunscreen, and two liters of water before entering. For daytime or late-afternoon matches, this isn't tour-guide advice: it's a safety instruction.",
    "The 23:00 match on June 19 (Tunisia vs. Japan) is the most specific logistical trap of this host city. Confirm last Metrorrey service before attending and keep Uber as backup for the post-midnight return.",
    "The correct route to the stadium is Metrorrey Line 1 → Exposición → FIFA shuttle or a 1.5 km walk. Metrorrey runs in a dedicated corridor — match-day traffic doesn't touch it.",
    "Monterrey is Mexico's carne asada capital. Not because the locals claim it — but because the tradition of asado as social event has a consistency here that few cities in the country can match. Cabrito al pastor is the mandatory food experience of this host city.",
  ],

  matchDayChecklist:[
    "Digital match ticket — FIFA app (no paper version)",
    "MXN cash or card for Metrorrey (~$5 MXN)",
    "Route: Metrorrey Line 1 → Exposición → shuttle or walk to BBVA",
    "Hat and sunscreen (daytime matches); hydrate before entering",
    "Check FIFA's policy on permitted liquid containers",
    "For the midnight match (Jun 19): confirm last Metrorrey service",
    "Arrive at the stadium 90 min ahead — gates open at H-1:30",
    "Hotel reservation confirmed for match nights",
  ],

  didYouKnow:"Estadio BBVA was designed by Populous — the same architects behind Tottenham Hotspur Stadium and Yankee Stadium — with the explicit goal of keeping no spectator more than 9 meters from the pitch. The design holds the stand's sound pressure inside the bowl in a way few stadiums in the world replicate. The Sierra Madre in the background wasn't in Populous's plans, but no one's complaining.",
  closingNote:"Monterrey doesn't sell postcards. It sells precision: a city that built the country's industries and now welcomes the world with the same logic that has always guided it — no unnecessary ornament, concrete results. Estadio BBVA is Mexico's most modern football stadium. The Sierra Madre is the most honest backdrop a match can ask for. LagomPlan doesn't ask you to fall in love with the city. Just to arrive with water, a confirmed reservation, and the certainty that in Monterrey, football is taken seriously.",
  closingSignature:"Lagomplan · Field Guide · Monterrey · World Cup 2026",
  plannerCTA:"Generate my Monterrey trip",
}
