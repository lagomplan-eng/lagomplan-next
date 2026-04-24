import type { CityGuide } from '../types'

const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#8B2635'

export const es: CityGuide = {
  id:"dal",
  city:"Dallas",
  country:"EE.UU.",
  state:"Texas",
  flag:"🇺🇸",
  accent: ACCENT,

  tags:["Fútbol","Argentina","BBQ","Semifinal"],
  stadium:{ name:"AT&T Stadium", capacity:"~80,000", area:"Arlington, Texas — a 25 km al oeste de Dallas" },

  headline:"El estadio más grande del torneo está en Arlington. No en Dallas. Y no hay metro que llegue ahí.",
  description:"El estadio más grande del torneo no está en Dallas — está en Arlington, a 25 km, sin transporte público que llegue. Nueve partidos confirmados, incluyendo dos de Argentina en la fase de grupos y una Semifinal. Cuando los 250,000 inmigrantes argentinos del área metropolitana se sumen a los que viajaron, el AT&T Stadium va a sonar como el Monumental en una final.",

  scores:[
    { label:"Ambiente",     value:5 },
    { label:"Fútbol local", value:3 },
    { label:"Gastronomía",  value:3 },
    { label:"Transporte",   value:3 },
    { label:"Seguridad",    value:4 },
    { label:"Costo",        value:3 },
  ],

  matches:[
    { id:"m1", date:"14 Jun", day:"Dom", time:"15:00 CT", teams:[{name:"Países Bajos",flag:"🇳🇱"},{name:"Japón",flag:"🇯🇵"}], stadium:"AT&T Stadium", tag:"Grupo F", highlight:false },
    { id:"m2", date:"17 Jun", day:"Mar", time:"15:00 CT", teams:[{name:"Inglaterra",flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},{name:"Croacia",flag:"🇭🇷"}], stadium:"AT&T Stadium", tag:"Grupo L", highlight:false },
    { id:"m3", date:"22 Jun", day:"Lun", time:"12:00 CT", teams:[{name:"Argentina",flag:"🇦🇷"},{name:"Austria",flag:"🇦🇹"}], stadium:"AT&T Stadium", tag:"Grupo J — Argentina en Dallas", highlight:true },
    { id:"m4", date:"25 Jun", day:"Jue", time:"18:00 CT", teams:[{name:"Japón",flag:"🇯🇵"},{name:"Rep. UEFA B",flag:""}], stadium:"AT&T Stadium", tag:"Grupo F", highlight:false },
    { id:"m5", date:"27 Jun", day:"Sáb", time:"21:00 CT", teams:[{name:"Argentina",flag:"🇦🇷"},{name:"Jordania",flag:"🇯🇴"}], stadium:"AT&T Stadium", tag:"Grupo J — Argentina confirma el grupo en primetime", highlight:true },
    { id:"m6", date:"30 Jun", day:"Mar", time:"12:00 CT", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"AT&T Stadium", tag:"Fase eliminatoria", highlight:false },
    { id:"m7", date:"3 Jul", day:"Vie", time:"13:00 CT", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"AT&T Stadium", tag:"Fase eliminatoria", highlight:false },
    { id:"m8", date:"6 Jul", day:"Lun", time:"14:00 CT", teams:[{name:"Ronda de 16",flag:""},{name:"Por definir",flag:""}], stadium:"AT&T Stadium", tag:"Fase eliminatoria", highlight:false },
    { id:"m9", date:"14 Jul", day:"Mar", time:"14:00 CT", teams:[{name:"Semifinal",flag:""},{name:"Por definir",flag:""}], stadium:"AT&T Stadium", tag:"Semifinal", highlight:true },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA",        value:"Dallas Stadium (AT&T Stadium), Arlington, Texas" },
      { label:"Aforo",               value:"~80,000 configuración FIFA — el estadio más grande del torneo. Capacidad histórica máxima: más de 100,000." },
      { label:"Techo",               value:"Retráctil con aire acondicionado — condiciones controladas dentro del recinto" },
      { label:"Clima",               value:"33–38°C días · Humedad moderada · Interior: A/C garantiza confort dentro del estadio" },
      { label:"Partidos",            value:"9 confirmados — el máximo de cualquier sede: 5 grupos + 2 Rondas de 32 + 1 Ronda de 16 + 1 Semifinal" },
      { label:"Ubicación crítica",   value:"Arlington, Texas — a 25 km al oeste de Dallas, 20 km al este de Fort Worth. NO existe transporte público al estadio." },
      { label:"Aeropuertos",         value:"DFW — Dallas/Fort Worth International (18 km del estadio, el más cercano). DAL — Dallas Love Field (30 km, hub doméstico de Southwest Airlines)." },
      { label:"Visa / ESTA",         value:"Ciudadanos de países del Programa de Exención de Visa necesitan ESTA aprobado antes de volar. Otros necesitan visa de turista B-2. Tramita con antelación en travel.state.gov." },
    ],
    body:"Dallas alberga más partidos que cualquier otra sede del torneo — nueve en total, incluyendo una Semifinal y dos Rondas de 32. El estadio es el más grande del Mundial y Argentina juega aquí dos veces en la fase de grupos. Cuando los hinchas albicelestes de la metrópolis de Dallas-Fort Worth — 250,000 personas que no necesitaron comprar vuelo — se sumen a los que sí viajaron, el AT&T Stadium va a sonar como el Monumental en una final de Copa América. Hay una sola instrucción que importa más que cualquier otra en esta guía: no hay metro que llegue al estadio. Arlington es la ciudad más grande de Estados Unidos sin sistema de transporte público propio. Uber, auto propio con parking anticipado o shuttle charter son las tres únicas opciones. Planifica ese segundo tramo con anticipación — no es un detalle, es la mitad del viaje. Calendario completo: 🇳🇱🇯🇵 Dom 14 Jun · 15:00 CT: Países Bajos vs. Japón; 🏴󠁧󠁢󠁥󠁮󠁧󠁿🇭🇷 Mar 17 Jun · 15:00 CT: Inglaterra vs. Croacia; 🇦🇷🇦🇹 Lun 22 Jun · 12:00 CT: Argentina vs. Austria; 🇯🇵 Jue 25 Jun · 18:00 CT: Japón vs. Rep. UEFA B; 🇦🇷🇯🇴 Sáb 27 Jun · 21:00 CT: Argentina vs. Jordania; Mar 30 Jun / Vie 3 Jul: Rondas de 32; Lun 6 Jul: Ronda de 16; Mar 14 Jul: Semifinal.",
    lagomNote:"Los partidos de Argentina (22 y 27 de junio) y la Semifinal (14 de julio) son las tres fechas de mayor demanda en Dallas. Los alojamientos en el corredor de Arlington se agotan meses antes para las noches de partido de Argentina. Si viajas específicamente para esos partidos, busca en Uptown, Addison o Plano — más lejos del estadio pero con mejor calidad de barrio.",
  },

  vibe:{
    body:"Argentina juega dos veces en el estadio más grande del Mundial. Países Bajos, Inglaterra, Japón y Croacia completan el grupo de equipos con mayor volumen de aficionados viajeros del torneo. En el AT&T Stadium con el techo cerrado, el ruido de los hinchas argentinos se amplifica de una manera que ningún otro estadio del torneo va a replicar. Dallas tiene FC Dallas, tiene comunidades latinoamericanas que llenan el estadio para la MLS y tiene la segunda mayor población de inmigrantes mexicanos de Estados Unidos. El fútbol existe y tiene raíces. El Bishop Arts District en Oak Cliff tiene la mejor concentración de restaurantes independientes de la ciudad. Deep Ellum tiene cuarenta años de música en vivo. El Klyde Warren Park en Uptown concentra el ambiente mundialista más accesible de la sede.",
    zones:[],
    lagomNote:"El corredor entre Uptown Dallas y el AT&T Stadium no tiene transporte público. Para los partidos de Argentina (22 y 27 de junio), calcula 35–45 minutos en Uber sin tráfico, 60–90 minutos con tráfico de partido. Solicita el Uber de regreso antes de que termine el partido si usas rideshare.",
  },

  neighborhoods:[
    { name:"Uptown Dallas / Knox-Henderson", vibe:"Base recomendada. La zona de mayor densidad gastronómica y hotelera de Dallas. Acceso al McKinney Avenue Trolley y al sistema DART. Desde Uptown a Arlington en Uber en día normal: 35–45 minutos. En día de partido con surge: 50–70 minutos.", best_for:"Fan WC", walk_to_stadium:"35–70 min en Uber (sin metro al estadio)", lagomNote:null },
    { name:"Las Colinas / Irving", vibe:"Opción táctica para el fan que prioriza acceso al estadio. A 20 minutos del AT&T Stadium en auto sin tráfico. Hoteles de cadena bien equipados, acceso rápido a DFW por el DART Orange Line. Sin el ambiente de barrio de Uptown.", best_for:"Logística", walk_to_stadium:"20–40 min en auto al estadio", lagomNote:null },
    { name:"Garland / Richardson", vibe:"Para aficionados latinoamericanos y argentinos. El corredor de Garland Road y Richardson tiene la mayor concentración de restaurantes latinoamericanos del área metropolitana. El DART Blue Line conecta Richardson con el centro en 25 minutos.", best_for:"Comunidad", walk_to_stadium:"Uber desde Richardson: 45–60 min al estadio", lagomNote:null },
  ],

  stays:[
    { name:"The Joule Dallas", area:"Downtown Dallas / Main Street", price:"$$$", priceCAD:"Precio estimado en periodo mundialista: $300–500 USD/noche", tags:["Arte contemporáneo","Piscina rooftop","Acceso DART"], note:"El hotel más distinguido del downtown histórico: arte contemporáneo en cada piso, piscina en el rooftop con extensión sobre la fachada y CBD Provisions — una de las mejores mesas del centro. Acceso al DART desde la estación West End.", best_for:"Hotel boutique", url:"https://booking.stay22.com/lagomplan/uZmVz5IprZ" },
    { name:"Rosewood Mansion on Turtle Creek", area:"Uptown / Turtle Creek", price:"$$$", priceCAD:"Precio estimado en periodo mundialista: $280–450 USD/noche", tags:["Mansión restaurada","143 habitaciones","Jardines"], note:"La mejor relación calidad-atmósfera de Uptown: 143 habitaciones en una mansión restaurada con jardines y restaurante propio. Más íntimo que los grandes hoteles de cadena.", best_for:"Pareja", url:"https://booking.stay22.com/lagomplan/C8gUu3RSPW" },
    { name:"W Dallas — Victory", area:"Victory Park / AAC District", price:"$$$$", priceCAD:"Precio estimado en periodo mundialista: $380–750 USD/noche", tags:["Piscina","Spa","DART Victory Station"], note:"En el complejo de entretenimiento de Victory Park, a pasos del American Airlines Center. Piscina, spa y servicio Whatever/Whenever. Acceso al DART desde la estación Victory — misma línea que lleva al aeropuerto DFW.", best_for:"Lujo", url:"https://booking.stay22.com/lagomplan/TOp2Hl1Ouh" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Llegar a Dallas — DFW o DAL", text:"DFW (Dallas/Fort Worth) está a 18 km del AT&T Stadium — el aeropuerto más cercano al estadio del torneo. DART Orange Line desde DFW a Downtown Dallas en 45 min. DAL (Love Field) es hub doméstico de Southwest, a 30 km del estadio. No hay DART desde DAL al estadio — requiere Uber." },
      { icon:"🚗", title:"Al estadio — sin metro, tres opciones reales", text:"1) Auto propio con parking anticipado ($50–150 USD, reserva en sitio oficial del estadio). 2) Rideshare (Uber/Lyft): zona designada alrededor del estadio, 25–40 min desde Uptown, precio surge en partidos de Argentina. 3) Shuttle charter grupal desde hotel — la opción más eficiente para grupos de 6+ personas. Reserva con semanas de anticipación." },
      { icon:"🏟", title:"Logística de regreso — el momento crítico", text:"Si tienes Uber: solicítalo antes de que termine el partido. Si tienes auto: sal en los primeros 15 minutos o espera 45 minutos dentro del recinto — la I-20 y la Highway 360 tardan entre 30 y 90 minutos en despejarse. Para la Semifinal del 14 de julio: calcula el doble de tiempo en todo." },
      { icon:"⚠️", title:"Error crítico — no hay transporte público al AT&T Stadium", text:"Arlington es la ciudad más grande de Estados Unidos sin sistema de transporte público propio. El DART de Dallas no llega a Arlington. El tren DFW no llega al estadio. Quien llega en DART al downtown de Dallas o al aeropuerto DFW necesita un segundo tramo en Uber o auto al estadio. Este tramo no es opcional — es la mitad del viaje.", isWarning:true },
    ],
    timings:[
      { label:"Desde Uptown Dallas en Uber (sin tráfico)",          value:"35–45 min" },
      { label:"Desde DFW (aeropuerto) en Uber directo",             value:"20–30 min" },
      { label:"Desde Downtown Dallas en auto por I-30",             value:"25–35 min normales · 60–90 min partido de Argentina" },
      { label:"Desde Irving/Las Colinas en auto",                   value:"15–25 min normales · 40–60 min partido grande" },
    ],
    matchDayCronologia:{
      matchName:"27 Jun · Argentina vs. Jordania · 21:00 CT",
      steps:[
        { time:"H-4:00", text:"Cena temprana en Dallas antes de las 17:00. Los partidos de Argentina de noche son los de mayor demanda de la sede." },
        { time:"H-2:30", text:"Sale hacia Arlington. A las 6:30pm el tráfico hacia el estadio ya está formado." },
        { time:"H-1:30", text:"Entrada al complejo del AT&T Stadium. Las puertas abren 90 minutos antes. El estadio con techo cerrado concentra el ruido albiceleste." },
        { time:"H-0:30", text:"En tu asiento. El A/C compensa el calor de junio. El estadio estará lleno mucho antes del inicio." },
        { time:"H+0:00", text:"Partido. Argentina confirma el grupo. El AT&T Stadium con 250,000 hinchas locales más los que viajaron." },
        { time:"H+1:45", text:"Sal inmediatamente si tienes Uber esperando. Si tienes auto, espera 45 minutos adentro del recinto antes de intentar salir." },
      ],
    },
    timing:"No hay metro. No hay bus. Solo auto propio con parking anticipado, Uber o shuttle charter. Esa es la realidad logística de Arlington y hay que calcularla en cada partido — especialmente en los dos de Argentina y la Semifinal.",
    cost:"Más accesible que las sedes costeras. Los hoteles en Uptown y Downtown son caros en partidos de Argentina y la Semifinal, pero hay más inventario por la escala de la metrópolis. El gasto en transporte al estadio — Uber o parking — es real y hay que sumarlo al presupuesto.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ — Dallas + Arlington", type:"Fan fest oficial", typeColor:CORAL, desc:"Dallas distribuye su Fan Fest en dos ubicaciones: Kay Bailey Hutchison Convention Center en downtown Dallas (acceso DART) y zona fan satélite en el Entertainment District de Arlington (sin transporte público — mismo problema que el estadio). La zona del Convention Center es la opción para fans sin boleto.", tag:"Sin boleto OK" },
    { title:"Klyde Warren Park (Uptown)", type:"Parque urbano", typeColor:FJORD, desc:"El parque construido sobre la autopista Woodall Rodgers en el corazón de Uptown instala pantallas durante eventos internacionales. Acceso peatonal desde los hoteles de Uptown y a dos cuadras de la estación de DART. El punto de reunión de los hinchas argentinos del Uptown para los partidos del 22 y 27 de junio.", tag:"Uptown" },
    { title:"The Common Table (Uptown)", type:"Bar de fútbol internacional", typeColor:PINE, desc:"El bar de fútbol internacional de referencia en Dallas. Premier League los domingos, Champions los miércoles, Mundial las 24 horas durante junio y julio. Pantallas en todos los ángulos y la comunidad de soccer más informada de Uptown. Para los partidos de Argentina (22 y 27 de junio), reserva con días de anticipación.", tag:"Reserva necesaria" },
    { title:"Fair Park (Dallas)", type:"Fan zone histórico", typeColor:SAGE, desc:"El recinto ferial histórico de Dallas — sede de la Feria Estatal de Texas — es el Fan Fest oficial de la sede durante 34 días. El Cotton Bowl (estadio olímpico de 1936) y la escultura de fútbol más grande de Texas están en el mismo predio. El perímetro exterior es punto de reunión adicional.", tag:"Historia" },
    { title:"Billy Bob's Texas (Fort Worth Stockyards)", type:"Honky-tonk", typeColor:"#5A3A2A", desc:"El honky-tonk más grande del mundo en el distrito ganadero de Fort Worth activa sus espacios para transmisiones mundialistas. Ver un partido de Argentina con las botas puestas en una pista de baile country es la combinación más improbable y más auténtica de la sede.", tag:"Fort Worth" },
    { title:"Adair's Saloon (Deep Ellum)", type:"Saloon con pantallas", typeColor:"#1A3A5C", desc:"El honky-tonk más veterano del barrio de música en vivo de Dallas, con pantallas instaladas para el Mundial. Cocina de saloon americano honesta — hamburguesas, papas, sin complicaciones — y clientela que mezcla músicos, aficionados al fútbol y fans de Argentina que descubrieron el local por accidente.", tag:"Deep Ellum" },
  ],

  food:[
    { dish:"The Common Table",       where:"Uptown — hamburguesa artesanal + IPA de barril; el bar de fútbol más serio de Dallas, reserva para partidos de Argentina",       price:"$$",  type:"Fútbol" },
    { dish:"Truck Yard",             where:"Lower Greenville — food trucks rotativos + cerveza artesanal de Texas; pantalla al aire libre para partidos de mediodía",        price:"$$",  type:"Al aire libre" },
    { dish:"Adair's Saloon",         where:"Deep Ellum — hamburguesa doble + cerveza de lata; Deep Ellum sin filtro con partido en pantalla",                               price:"$",   type:"De barrio" },
    { dish:"BBQ de Texas",           where:"Pecan Lodge (Deep Ellum) o Cattleack (Farmers Branch) — la mejor BBQ del área metropolitana; llega antes de las 11am",        price:"$$",  type:"Imperdible" },
    { dish:"Bishop Arts District",   where:"Oak Cliff — restaurantes independientes de autor a precios razonables; la propuesta gastronómica más seria de Dallas",          price:"$$",  type:"Autor" },
  ],

  experiences:[
    { title:"Sixth Floor Museum — Dallas", duration:"2–3 horas", desc:"El Sixth Floor Museum en el antiguo Texas School Book Depository — desde cuya ventana se dispararon los tiros que mataron a John F. Kennedy en 1963 — es la visita más densa en términos históricos de cualquier sede del torneo. La perspectiva desde el sexto piso sobre Dealey Plaza es perturbadora en el mejor sentido. Entrada: $22 adultos. A dos cuadras, el Dallas Museum of Art tiene colecciones de arte precolombino, africano y asiático con entrada gratuita los viernes de 5 a 9pm.", type:"Histórico", affiliateLink:"AFFILIATE_LINK_DAL_SIXTHFLOOR", affiliateLabel:"Reservar el Sixth Floor Museum" },
    { title:"Fort Worth Stockyards + Kimbell Art Museum", duration:"Día completo", desc:"Fort Worth está a 45 minutos al oeste y merece el desvío. Los Stockyards — antiguo distrito ganadero reconvertido — ofrecen la experiencia de Texas más auténtica del área metropolitana: rodeos y arreo diario de ganado a las 11:30am y 4pm. A veinte minutos en auto, el Kimbell Art Museum tiene una colección permanente de arte europeo (Caravaggio, El Greco, Rubens) en un edificio de Louis Kahn que es en sí mismo el argumento para la visita.", type:"Cultural", affiliateLink:"AFFILIATE_LINK_DAL_FORTWORTH", affiliateLabel:"Tours a Fort Worth Stockyards" },
    { title:"Deep Ellum — música en vivo", duration:"Noche", desc:"El barrio de música en vivo de Dallas tiene cuarenta años de historia y más de veinte locales activos en ocho cuadras. Para la noche entre el partido del 22 y el del 27 de junio — el hueco entre los dos partidos de Argentina — Deep Ellum tiene jazz, blues, country alternativo y rock en vivo de martes a domingo. The Trees y el Bomb Factory son los recintos con mayor cartelera durante el periodo mundialista.", type:"Música", affiliateLink:"AFFILIATE_LINK_DAL_DEEPELLUM", affiliateLabel:"Guía de música en vivo en Deep Ellum" },
    { title:"Perot Museum + Klyde Warren Park", duration:"Mañana o tarde", desc:"El Perot Museum en el Arts District es el museo de ciencias más ambicioso del sur de Estados Unidos: ocho pisos sobre dinosaurios, geología, física y exploración espacial. Especialmente recomendado para familias con niños. Entrada: $25 adultos / $15 niños menores de 12. A una cuadra, el Klyde Warren Park — construido sobre una autopista soterrada — tiene food trucks, yoga al aire libre y los mejores atardeceres del downtown sin costo de entrada.", type:"Familia", affiliateLink:"AFFILIATE_LINK_DAL_PEROT", affiliateLabel:"Reservar el Perot Museum" },
  ],

  itinerary:[
    { day:1, title:"Llegada y primer pulso", subtitle:"Uptown Dallas · Arts District · Deep Ellum", isMatchDay:false, steps:[
      { time:"Llegada",   text:"DART Orange Line desde DFW hasta Downtown Dallas (45 min). La ciudad más grande del torneo en términos de partidos — y la más dispersa en términos de barrios." },
      { time:"Tarde",     text:"Arts District a pie: Dallas Museum of Art, Klyde Warren Park, la mejor concentración de museos del downtown." },
      { time:"Atardecer", text:"Uptown. McKinney Avenue, el barrio más denso en restaurantes de la ciudad. El Klyde Warren Park al atardecer." },
      { time:"Noche",     text:"Deep Ellum para música en vivo. Cuarenta años de historia, más de veinte locales activos en ocho cuadras." },
    ]},
    { day:2, title:"Día de partido — Argentina vs. Austria", subtitle:"AT&T Stadium · Lun 22 Jun · 12:00 CT", isMatchDay:true, matchRef:"m3", steps:[
      { time:"H-3:00", text:"Desayuno temprano — es un partido de mediodía. Comer bien antes de salir hacia Arlington." },
      { time:"H-2:30", text:"Sale hacia Arlington en Uber o auto propio. A las 9:30am el tráfico ya está formando en el corredor del estadio." },
      { time:"H-1:30", text:"Llegada al AT&T Stadium. El estadio más grande del Mundial con el A/C encendido." },
      { time:"12:00",  text:"Argentina vs. Austria. Dallas tiene 250,000 inmigrantes argentinos — nadie necesitó comprar vuelo para estar aquí." },
      { time:"Post",   text:"Regreso a Dallas. The Common Table en Uptown para el post-partido si el resultado lo merece." },
    ]},
    { day:3, title:"Sixth Floor Museum + Fort Worth", subtitle:"Dallas · Fort Worth Stockyards", isMatchDay:false, steps:[
      { time:"Mañana",   text:"Sixth Floor Museum. La ventana desde la que se dispararon los tiros que mataron a JFK en 1963. La visita más densa en términos históricos de la sede." },
      { time:"Mediodía", text:"Fort Worth en auto o Uber (45 min). Almuerzo en los Stockyards." },
      { time:"Tarde",    text:"Arreo de ganado por Main Street a las 4pm. Billy Bob's para la transmisión del partido nocturno si hay uno." },
      { time:"Noche",    text:"Kimbell Art Museum si queda tiempo, o regreso a Dallas para Deep Ellum." },
    ]},
    { day:4, title:"Día de partido — Argentina vs. Jordania", subtitle:"AT&T Stadium · Sáb 27 Jun · 21:00 CT", isMatchDay:true, matchRef:"m5", steps:[
      { time:"H-4:00", text:"Cena temprana en Dallas antes de las 17:00. Es el partido de noche de Argentina — máxima demanda de la sede." },
      { time:"H-2:30", text:"Sale hacia Arlington. A las 6:30pm el tráfico hacia el estadio ya está formado." },
      { time:"H-1:30", text:"Entrada al complejo. El AT&T Stadium con techo cerrado concentra el ruido albiceleste de 80,000 personas." },
      { time:"21:00",  text:"Argentina vs. Jordania. Primetime. El estadio más grande del torneo en su noche más intensa." },
      { time:"Post",   text:"Sal inmediatamente si tienes Uber. Si tienes auto, espera 45 minutos adentro — la I-20 tarda en despejarse." },
    ]},
  ],

  lagomTips:[
    "No hay metro al AT&T Stadium. Arlington es la ciudad más grande de EE.UU. sin sistema de transporte público. Auto propio con parking anticipado, Uber o shuttle charter son las tres únicas opciones. Planifica el transporte antes de planificar cualquier otra cosa.",
    "Para los partidos de Argentina (22 y 27 de junio), el Uber de regreso puede tardar 20–45 minutos de espera al finalizar. Solicita el viaje antes de que termine el partido — no esperes a que acabe.",
    "El parking oficial del AT&T Stadium tiene más de 20,000 espacios. Reserva con anticipación en el sitio oficial del estadio ($50–150 USD según zona). Es la opción más confiable para el regreso — puedes esperar dentro del recinto.",
    "La Semifinal del 14 de julio es la fecha de mayor demanda de toda la sede. Reserva alojamiento y transporte con meses de anticipación. Los precios de hoteles en Uptown y Victory Park se multiplican para esa fecha.",
  ],

  matchDayChecklist:[
    "Boleto digital del partido — app FIFA (sin versión en papel)",
    "Transporte al estadio confirmado: auto + parking reservado, Uber o shuttle charter",
    "ESTA aprobado o visa de turista B-2 vigente",
    "Para Uber de regreso: solicita antes de que termine el partido",
    "Llegada al estadio 90 min antes — puertas abren H-1:30",
    "Ropa ligera — el A/C del estadio cubre el interior; el calor de Texas aplica fuera",
    "Reserva de hotel confirmada para noches de partido de Argentina y Semifinal",
    "Efectivo USD o tarjeta para parking, food y Uber",
  ],

  didYouKnow:"El AT&T Stadium en Arlington tiene la pantalla de vídeo colgante más grande del mundo en un espacio cerrado: 49 metros de ancho por 27 de alto. El estadio ha albergado el Super Bowl, el NBA All-Star Game, la Copa Oro y el WrestleMania. En julio de 2026, albergará la Semifinal de la Copa del Mundo — el partido más importante de su historia.",
  closingNote:"Dallas alberga más partidos que cualquier otra sede del torneo — nueve en total, incluyendo una Semifinal y dos Rondas de 32. El estadio es el más grande del Mundial y Argentina juega aquí dos veces en grupos. No hay metro que llegue. El parking se reserva con meses de anticipación. LagomPlan te da el mapa real, no el que ignora que Arlington está entre dos ciudades sin transporte entre ellas. El resto es Argentina.",
  closingSignature:"Lagomplan · Guía de campo · Dallas · Mundial 2026",
  plannerCTA:"Generar mi viaje a Dallas",
}

export const en: CityGuide = {
  id:"dal",
  city:"Dallas",
  country:"USA",
  state:"Texas",
  flag:"🇺🇸",
  accent: ACCENT,

  tags:["Football","Argentina","BBQ","Semifinal"],
  stadium:{ name:"AT&T Stadium", capacity:"~80,000", area:"Arlington, Texas — 25 km west of Dallas" },

  headline:"The tournament's biggest stadium is in Arlington. Not in Dallas. And no metro gets you there.",
  description:"The tournament's biggest stadium isn't in Dallas — it's in Arlington, 25 km away, with no public transit reaching it. Nine confirmed matches, including two Argentina group-stage games and a Semifinal. When the metro area's 250,000 Argentine immigrants join the fans who flew in, AT&T Stadium will sound like the Monumental on final night.",

  scores:[
    { label:"Atmosphere", value:5 },
    { label:"Football",   value:3 },
    { label:"Food",       value:3 },
    { label:"Transit",    value:3 },
    { label:"Safety",     value:4 },
    { label:"Cost",       value:3 },
  ],

  matches:[
    { id:"m1", date:"Jun 14", day:"Sun", time:"15:00 CT", teams:[{name:"Netherlands",flag:"🇳🇱"},{name:"Japan",flag:"🇯🇵"}], stadium:"AT&T Stadium", tag:"Group F", highlight:false },
    { id:"m2", date:"Jun 17", day:"Tue", time:"15:00 CT", teams:[{name:"England",flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},{name:"Croatia",flag:"🇭🇷"}], stadium:"AT&T Stadium", tag:"Group L", highlight:false },
    { id:"m3", date:"Jun 22", day:"Mon", time:"12:00 CT", teams:[{name:"Argentina",flag:"🇦🇷"},{name:"Austria",flag:"🇦🇹"}], stadium:"AT&T Stadium", tag:"Group J — Argentina in Dallas", highlight:true },
    { id:"m4", date:"Jun 25", day:"Thu", time:"18:00 CT", teams:[{name:"Japan",flag:"🇯🇵"},{name:"UEFA Play-off B",flag:""}], stadium:"AT&T Stadium", tag:"Group F", highlight:false },
    { id:"m5", date:"Jun 27", day:"Sat", time:"21:00 CT", teams:[{name:"Argentina",flag:"🇦🇷"},{name:"Jordan",flag:"🇯🇴"}], stadium:"AT&T Stadium", tag:"Group J — Argentina seals the group in primetime", highlight:true },
    { id:"m6", date:"Jun 30", day:"Tue", time:"12:00 CT", teams:[{name:"Round of 32",flag:""},{name:"TBD",flag:""}], stadium:"AT&T Stadium", tag:"Knockout stage", highlight:false },
    { id:"m7", date:"Jul 3", day:"Fri", time:"13:00 CT", teams:[{name:"Round of 32",flag:""},{name:"TBD",flag:""}], stadium:"AT&T Stadium", tag:"Knockout stage", highlight:false },
    { id:"m8", date:"Jul 6", day:"Mon", time:"14:00 CT", teams:[{name:"Round of 16",flag:""},{name:"TBD",flag:""}], stadium:"AT&T Stadium", tag:"Knockout stage", highlight:false },
    { id:"m9", date:"Jul 14", day:"Tue", time:"14:00 CT", teams:[{name:"Semifinal",flag:""},{name:"TBD",flag:""}], stadium:"AT&T Stadium", tag:"Semifinal", highlight:true },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium",      value:"Dallas Stadium (AT&T Stadium), Arlington, Texas" },
      { label:"Capacity",          value:"~80,000 FIFA configuration — the tournament's largest stadium. Historic maximum capacity: over 100,000." },
      { label:"Roof",              value:"Retractable with air conditioning — controlled conditions inside the bowl" },
      { label:"Weather",           value:"33–38°C days · Moderate humidity · Indoors: A/C keeps the stadium comfortable" },
      { label:"Matches",           value:"9 confirmed — the most of any host city: 5 group stage + 2 Rounds of 32 + 1 Round of 16 + 1 Semifinal" },
      { label:"Critical location", value:"Arlington, Texas — 25 km west of Dallas, 20 km east of Fort Worth. NO public transit reaches the stadium." },
      { label:"Airports",          value:"DFW — Dallas/Fort Worth International (18 km from the stadium, the closest). DAL — Dallas Love Field (30 km, Southwest Airlines domestic hub)." },
      { label:"Visa / ESTA",       value:"Citizens of Visa Waiver countries need an approved ESTA before flying. Others need a B-2 tourist visa. Apply early at travel.state.gov." },
    ],
    body:"Dallas hosts more matches than any other host city in the tournament — nine in total, including a Semifinal and two Rounds of 32. The stadium is the World Cup's biggest and Argentina plays here twice in the group stage. When the albiceleste supporters from the Dallas-Fort Worth metroplex — 250,000 people who didn't need to buy a ticket to fly — join those who did travel, AT&T Stadium will sound like the Monumental on a Copa América final night. One instruction matters more than any other in this guide: no metro reaches the stadium. Arlington is the largest US city without its own public transit system. Uber, your own car with pre-booked parking, or a charter shuttle are the only three options. Plan that second leg in advance — it's not a detail, it's half the trip. Full schedule: 🇳🇱🇯🇵 Sun Jun 14 · 15:00 CT: Netherlands vs. Japan; 🏴󠁧󠁢󠁥󠁮󠁧󠁿🇭🇷 Tue Jun 17 · 15:00 CT: England vs. Croatia; 🇦🇷🇦🇹 Mon Jun 22 · 12:00 CT: Argentina vs. Austria; 🇯🇵 Thu Jun 25 · 18:00 CT: Japan vs. UEFA Play-off B; 🇦🇷🇯🇴 Sat Jun 27 · 21:00 CT: Argentina vs. Jordan; Tue Jun 30 / Fri Jul 3: Rounds of 32; Mon Jul 6: Round of 16; Tue Jul 14: Semifinal.",
    lagomNote:"Argentina's matches (June 22 and 27) and the Semifinal (July 14) are Dallas's three peak-demand dates. Lodging in the Arlington corridor sells out months in advance for Argentina match nights. If you're traveling specifically for those matches, look in Uptown, Addison, or Plano — farther from the stadium but with better neighborhood quality.",
  },

  vibe:{
    body:"Argentina plays twice in the World Cup's biggest stadium. The Netherlands, England, Japan, and Croatia complete the group of teams with the tournament's highest volume of traveling fans. Inside AT&T Stadium with the roof closed, Argentine fans' noise amplifies in a way no other stadium in the tournament will replicate. Dallas has FC Dallas, has Latin American communities that fill the stadium for MLS, and has the country's second-largest Mexican immigrant population. Football exists and has roots here. The Bishop Arts District in Oak Cliff has the city's best concentration of independent restaurants. Deep Ellum has forty years of live music. Klyde Warren Park in Uptown concentrates the host city's most accessible World Cup atmosphere.",
    zones:[],
    lagomNote:"The corridor between Uptown Dallas and AT&T Stadium has no public transit. For Argentina's matches (June 22 and 27), plan 35–45 minutes by Uber without traffic, 60–90 minutes with match-day traffic. Request your return Uber before the final whistle if you're using rideshare.",
  },

  neighborhoods:[
    { name:"Uptown Dallas / Knox-Henderson", vibe:"Recommended base. Dallas's densest food and lodging zone. Access to the McKinney Avenue Trolley and the DART system. From Uptown to Arlington by Uber on a normal day: 35–45 minutes. On a match day with surge: 50–70 minutes.", best_for:"WC fan", walk_to_stadium:"35–70 min by Uber (no metro to the stadium)", lagomNote:null },
    { name:"Las Colinas / Irving", vibe:"Tactical option for the fan prioritizing stadium access. 20 minutes from AT&T Stadium by car without traffic. Well-equipped chain hotels, fast DFW access via DART Orange Line. Without Uptown's neighborhood atmosphere.", best_for:"Logistics", walk_to_stadium:"20–40 min by car to the stadium", lagomNote:null },
    { name:"Garland / Richardson", vibe:"For Latin American and Argentine fans. The Garland Road and Richardson corridor has the metro area's largest concentration of Latin American restaurants. DART Blue Line connects Richardson to downtown in 25 minutes.", best_for:"Community", walk_to_stadium:"Uber from Richardson: 45–60 min to the stadium", lagomNote:null },
  ],

  stays:[
    { name:"The Joule Dallas", area:"Downtown Dallas / Main Street", price:"$$$", priceCAD:"World Cup rates: $300–500 USD/night", tags:["Contemporary art","Rooftop pool","DART access"], note:"The most distinguished hotel in the historic downtown: contemporary art on every floor, rooftop pool cantilevered over the facade, and CBD Provisions — one of the center's best tables. DART access from West End station.", best_for:"Boutique", url:"https://booking.stay22.com/lagomplan/uZmVz5IprZ" },
    { name:"Rosewood Mansion on Turtle Creek", area:"Uptown / Turtle Creek", price:"$$$", priceCAD:"World Cup rates: $280–450 USD/night", tags:["Restored mansion","143 rooms","Gardens"], note:"Uptown's best quality-to-atmosphere ratio: 143 rooms in a restored mansion with gardens and an in-house restaurant. More intimate than the big chain hotels.", best_for:"Couples", url:"https://booking.stay22.com/lagomplan/C8gUu3RSPW" },
    { name:"W Dallas — Victory", area:"Victory Park / AAC District", price:"$$$$", priceCAD:"World Cup rates: $380–750 USD/night", tags:["Pool","Spa","DART Victory Station"], note:"In the Victory Park entertainment complex, steps from the American Airlines Center. Pool, spa, and Whatever/Whenever service. DART access from Victory station — the same line that reaches DFW airport.", best_for:"Luxury", url:"https://booking.stay22.com/lagomplan/TOp2Hl1Ouh" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Arriving in Dallas — DFW or DAL", text:"DFW (Dallas/Fort Worth) is 18 km from AT&T Stadium — the closest airport to any tournament stadium. DART Orange Line from DFW to Downtown Dallas in 45 min. DAL (Love Field) is Southwest's domestic hub, 30 km from the stadium. No DART from DAL to the stadium — Uber required." },
      { icon:"🚗", title:"To the stadium — no metro, three real options", text:"1) Own car with pre-booked parking ($50–150 USD, reserve at the stadium's official site). 2) Rideshare (Uber/Lyft): designated zone around the stadium, 25–40 min from Uptown, surge pricing on Argentina matches. 3) Group charter shuttle from your hotel — the most efficient option for groups of 6+. Book weeks in advance." },
      { icon:"🏟", title:"Return logistics — the critical moment", text:"If you have Uber: request it before the final whistle. If you have a car: leave in the first 15 minutes or wait 45 minutes inside the grounds — I-20 and Highway 360 take 30 to 90 minutes to clear. For the July 14 Semifinal: plan for double the time on everything." },
      { icon:"⚠️", title:"Critical error — no public transit to AT&T Stadium", text:"Arlington is the largest US city without its own public-transit system. Dallas DART doesn't reach Arlington. The DFW train doesn't reach the stadium. Anyone arriving by DART in downtown Dallas or DFW Airport needs a second leg by Uber or car to the stadium. This leg isn't optional — it's half the trip.", isWarning:true },
    ],
    timings:[
      { label:"From Uptown Dallas by Uber (no traffic)",           value:"35–45 min" },
      { label:"From DFW (airport) by direct Uber",                 value:"20–30 min" },
      { label:"From Downtown Dallas by car via I-30",              value:"25–35 min normal · 60–90 min Argentina match" },
      { label:"From Irving/Las Colinas by car",                    value:"15–25 min normal · 40–60 min big match" },
    ],
    matchDayCronologia:{
      matchName:"Jun 27 · Argentina vs. Jordan · 21:00 CT",
      steps:[
        { time:"H-4:00", text:"Early dinner in Dallas before 5pm. Argentina's night matches draw the host city's peak demand." },
        { time:"H-2:30", text:"Head to Arlington. By 6:30pm the stadium-bound traffic has already formed." },
        { time:"H-1:30", text:"Enter the AT&T Stadium complex. Gates open 90 minutes ahead. The closed-roof stadium concentrates the albiceleste noise." },
        { time:"H-0:30", text:"In your seat. The A/C offsets the June heat. The stadium will fill long before kickoff." },
        { time:"H+0:00", text:"Kickoff. Argentina seals the group. AT&T Stadium with 250,000 local fans plus those who traveled." },
        { time:"H+1:45", text:"Leave immediately if your Uber is waiting. If you have a car, wait 45 minutes inside the grounds before trying to leave." },
      ],
    },
    timing:"No metro. No bus. Only your own car with pre-booked parking, Uber, or charter shuttle. That's the logistical reality of Arlington and you have to factor it into every match — especially the two Argentina games and the Semifinal.",
    cost:"More accessible than the coastal host cities. Hotels in Uptown and Downtown are expensive for Argentina matches and the Semifinal, but there's more inventory given the metro's scale. Transit spending to the stadium — Uber or parking — is real and has to be added to the budget.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ — Dallas + Arlington", type:"Official fan fest", typeColor:CORAL, desc:"Dallas splits its Fan Fest across two locations: Kay Bailey Hutchison Convention Center in downtown Dallas (DART access) and a satellite fan zone in Arlington's Entertainment District (no public transit — same problem as the stadium). The Convention Center site is the option for ticketless fans.", tag:"No ticket needed" },
    { title:"Klyde Warren Park (Uptown)", type:"Urban park", typeColor:FJORD, desc:"The park built over the Woodall Rodgers freeway at the heart of Uptown installs screens during international events. Pedestrian access from Uptown hotels and two blocks from a DART station. The meeting point for Uptown's Argentine fans for the June 22 and 27 matches.", tag:"Uptown" },
    { title:"The Common Table (Uptown)", type:"International soccer bar", typeColor:PINE, desc:"Dallas's reference international soccer bar. Premier League Sundays, Champions Wednesdays, World Cup round the clock through June and July. Screens at every angle and Uptown's most informed soccer crowd. For Argentina's matches (June 22 and 27), book days in advance.", tag:"Booking required" },
    { title:"Fair Park (Dallas)", type:"Historic fan zone", typeColor:SAGE, desc:"Dallas's historic fairgrounds — site of the Texas State Fair — is the host city's official Fan Fest for 34 days. The Cotton Bowl (1936 Olympic stadium) and the largest football sculpture in Texas sit on the same grounds. The outer perimeter is an additional gathering point.", tag:"History" },
    { title:"Billy Bob's Texas (Fort Worth Stockyards)", type:"Honky-tonk", typeColor:"#5A3A2A", desc:"The world's largest honky-tonk in Fort Worth's Stockyards activates its spaces for World Cup broadcasts. Watching an Argentina match with boots on a country dance floor is the host city's most improbable and most authentic combination.", tag:"Fort Worth" },
    { title:"Adair's Saloon (Deep Ellum)", type:"Saloon with screens", typeColor:"#1A3A5C", desc:"The longest-running honky-tonk in Dallas's live-music district, with screens installed for the World Cup. Honest American saloon cooking — burgers, fries, no complications — and a crowd mixing musicians, football fans, and Argentine supporters who discovered the place by accident.", tag:"Deep Ellum" },
  ],

  food:[
    { dish:"The Common Table",     where:"Uptown — craft burger + draft IPA; Dallas's most serious soccer bar, book ahead for Argentina matches",                 price:"$$",  type:"Football" },
    { dish:"Truck Yard",           where:"Lower Greenville — rotating food trucks + Texas craft beer; outdoor screen for afternoon matches",                     price:"$$",  type:"Open air" },
    { dish:"Adair's Saloon",       where:"Deep Ellum — double burger + canned beer; unfiltered Deep Ellum with a match on screen",                               price:"$",   type:"Neighborhood" },
    { dish:"Texas BBQ",            where:"Pecan Lodge (Deep Ellum) or Cattleack (Farmers Branch) — the metro's best BBQ; arrive before 11am",                   price:"$$",  type:"Must try" },
    { dish:"Bishop Arts District", where:"Oak Cliff — chef-driven independent restaurants at reasonable prices; Dallas's most serious food proposition",          price:"$$",  type:"Chef-driven" },
  ],

  experiences:[
    { title:"Sixth Floor Museum — Dallas", duration:"2–3 hours", desc:"The Sixth Floor Museum in the former Texas School Book Depository — from whose window the shots that killed John F. Kennedy in 1963 were fired — is the most historically dense visit of any host city in the tournament. The perspective from the sixth floor over Dealey Plaza is unsettling in the best sense. Admission: $22 adults. Two blocks away, the Dallas Museum of Art has pre-Columbian, African, and Asian art collections with free admission Fridays 5–9pm.", type:"Historic", affiliateLink:"AFFILIATE_LINK_DAL_SIXTHFLOOR", affiliateLabel:"Book the Sixth Floor Museum" },
    { title:"Fort Worth Stockyards + Kimbell Art Museum", duration:"Full day", desc:"Fort Worth is 45 minutes west and worth the detour. The Stockyards — a repurposed historic cattle district — offer the most authentic Texas experience in the metro: rodeos and a daily cattle drive at 11:30am and 4pm. Twenty minutes by car, the Kimbell Art Museum holds a permanent European-art collection (Caravaggio, El Greco, Rubens) inside a Louis Kahn building that is itself reason enough to visit.", type:"Cultural", affiliateLink:"AFFILIATE_LINK_DAL_FORTWORTH", affiliateLabel:"Fort Worth Stockyards tours" },
    { title:"Deep Ellum — live music", duration:"Evening", desc:"Dallas's live-music neighborhood has forty years of history and more than twenty active venues in eight blocks. For the night between the June 22 and June 27 matches — the gap between Argentina's two games — Deep Ellum has jazz, blues, alt-country, and live rock Tuesday through Sunday. The Trees and Bomb Factory are the venues with the strongest programming during the World Cup period.", type:"Music", affiliateLink:"AFFILIATE_LINK_DAL_DEEPELLUM", affiliateLabel:"Deep Ellum live music guide" },
    { title:"Perot Museum + Klyde Warren Park", duration:"Morning or afternoon", desc:"The Perot Museum in the Arts District is the most ambitious science museum in the US South: eight floors on dinosaurs, geology, physics, and space exploration. Especially recommended for families with children. Admission: $25 adults / $15 children under 12. One block over, Klyde Warren Park — built over a buried freeway — has food trucks, outdoor yoga, and downtown's best sunsets with no admission fee.", type:"Family", affiliateLink:"AFFILIATE_LINK_DAL_PEROT", affiliateLabel:"Book the Perot Museum" },
  ],

  itinerary:[
    { day:1, title:"Arrival and first pulse", subtitle:"Uptown Dallas · Arts District · Deep Ellum", isMatchDay:false, steps:[
      { time:"Arrival",  text:"DART Orange Line from DFW to Downtown Dallas (45 min). The tournament's biggest city in terms of matches — and the most spread out in terms of neighborhoods." },
      { time:"Afternoon",text:"Arts District on foot: Dallas Museum of Art, Klyde Warren Park, downtown's best concentration of museums." },
      { time:"Sunset",   text:"Uptown. McKinney Avenue, the city's densest restaurant street. Klyde Warren Park at sunset." },
      { time:"Evening",  text:"Deep Ellum for live music. Forty years of history, more than twenty active venues in eight blocks." },
    ]},
    { day:2, title:"Match day — Argentina vs. Austria", subtitle:"AT&T Stadium · Mon Jun 22 · 12:00 CT", isMatchDay:true, matchRef:"m3", steps:[
      { time:"H-3:00", text:"Early breakfast — it's a midday match. Eat well before heading to Arlington." },
      { time:"H-2:30", text:"Head to Arlington by Uber or your own car. By 9:30am traffic is already forming in the stadium corridor." },
      { time:"H-1:30", text:"Arrive at AT&T Stadium. The World Cup's biggest stadium with the A/C on." },
      { time:"12:00",  text:"Argentina vs. Austria. Dallas has 250,000 Argentine immigrants — nobody needed to buy a flight to be here." },
      { time:"Post",   text:"Back to Dallas. The Common Table in Uptown for post-match if the result earns it." },
    ]},
    { day:3, title:"Sixth Floor Museum + Fort Worth", subtitle:"Dallas · Fort Worth Stockyards", isMatchDay:false, steps:[
      { time:"Morning",  text:"Sixth Floor Museum. The window from which the shots that killed JFK were fired in 1963. The host city's most historically dense visit." },
      { time:"Midday",   text:"Fort Worth by car or Uber (45 min). Lunch in the Stockyards." },
      { time:"Afternoon",text:"Cattle drive down Main Street at 4pm. Billy Bob's for the evening match broadcast if there is one." },
      { time:"Evening",  text:"Kimbell Art Museum if time remains, or back to Dallas for Deep Ellum." },
    ]},
    { day:4, title:"Match day — Argentina vs. Jordan", subtitle:"AT&T Stadium · Sat Jun 27 · 21:00 CT", isMatchDay:true, matchRef:"m5", steps:[
      { time:"H-4:00", text:"Early dinner in Dallas before 5pm. It's Argentina's night match — the host city's peak demand." },
      { time:"H-2:30", text:"Head to Arlington. By 6:30pm stadium-bound traffic is already formed." },
      { time:"H-1:30", text:"Enter the complex. AT&T Stadium with roof closed concentrates the albiceleste noise of 80,000 people." },
      { time:"21:00",  text:"Argentina vs. Jordan. Primetime. The tournament's biggest stadium on its loudest night." },
      { time:"Post",   text:"Leave immediately if you have Uber. If you have a car, wait 45 minutes inside — I-20 takes a while to clear." },
    ]},
  ],

  lagomTips:[
    "There's no metro to AT&T Stadium. Arlington is the largest US city without public transit. Own car with pre-booked parking, Uber, or charter shuttle are the only three options. Plan transit before planning anything else.",
    "For Argentina's matches (June 22 and 27), the post-match Uber wait can run 20–45 minutes. Request the ride before the final whistle — don't wait for it to end.",
    "Official AT&T Stadium parking has more than 20,000 spaces. Book ahead at the stadium's official site ($50–150 USD by zone). It's the most reliable return option — you can wait inside the grounds.",
    "The July 14 Semifinal is the host city's peak-demand date. Book accommodation and transit months ahead. Hotel prices in Uptown and Victory Park multiply for that date.",
  ],

  matchDayChecklist:[
    "Digital match ticket — FIFA app (no paper version)",
    "Stadium transit confirmed: car + pre-booked parking, Uber, or charter shuttle",
    "ESTA approved or valid B-2 tourist visa",
    "For return Uber: request before the final whistle",
    "Arrive at the stadium 90 min ahead — gates open at H-1:30",
    "Light clothing — the stadium A/C covers the interior; Texas heat applies outside",
    "Hotel reservation confirmed for Argentina match nights and the Semifinal",
    "USD cash or card for parking, food, and Uber",
  ],

  didYouKnow:"AT&T Stadium in Arlington has the world's largest indoor hanging video screen: 49 meters wide by 27 meters tall. The stadium has hosted the Super Bowl, NBA All-Star Game, Gold Cup, and WrestleMania. In July 2026, it will host the World Cup Semifinal — the biggest match in its history.",
  closingNote:"Dallas hosts more matches than any other host city — nine in total, including a Semifinal and two Rounds of 32. The stadium is the World Cup's biggest and Argentina plays here twice in the group stage. No metro reaches it. Parking books out months in advance. LagomPlan gives you the real map, not the one that ignores that Arlington sits between two cities with no transit between them. The rest is Argentina.",
  closingSignature:"Lagomplan · Field Guide · Dallas · World Cup 2026",
  plannerCTA:"Generate my Dallas trip",
}
