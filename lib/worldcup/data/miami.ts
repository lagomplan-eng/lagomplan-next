import type { CityGuide } from '../types'

const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#0E8B8B'

export const es: CityGuide = {
  id:"mia", city:"Miami", country:"Estados Unidos", state:"Florida", flag:"🇺🇸", accent:ACCENT,
  tags:["Fútbol","Playa","Gastronomía","Semifinal"],
  stadium:{ name:"Miami Stadium (Hard Rock Stadium)", capacity:"~65,000", area:"Miami Gardens — a 25 km al norte del downtown de Miami" },
  headline:"El calor en Miami no es el clima. Es el estado de ánimo permanente de la ciudad.",
  description:"El calor en Miami no es el clima. Es el estado de ánimo permanente de la ciudad. Miami recibe siete partidos, incluyendo una Semifinal el 11 de julio. La afición latinoamericana de Miami no necesita que vuele nadie: hay más comunidades de Suramérica, Centroamérica y el Caribe en esta ciudad que en ningún otro punto de Estados Unidos.",
  scores:[
    { label:"Ambiente",          value:5 },
    { label:"Cultura futbolera", value:4 },
    { label:"Gastronomía",       value:5 },
    { label:"Costo",             value:1 },
  ],
  matches:[
    { id:"m1", date:"15 Jun", day:"Lun", time:"18:00 ET", teams:[{name:"Arabia Saudita",flag:"🇸🇦"},{name:"Uruguay",flag:"🇺🇾"}], stadium:"Hard Rock Stadium", tag:"Grupo H", highlight:false },
    { id:"m2", date:"21 Jun", day:"Dom", time:"18:00 ET", teams:[{name:"Uruguay",flag:"🇺🇾"},{name:"Cabo Verde",flag:"🇨🇻"}], stadium:"Hard Rock Stadium", tag:"Grupo H", highlight:false },
    { id:"m3", date:"24 Jun", day:"Mié", time:"18:00 ET", teams:[{name:"Escocia",flag:"🏴"},{name:"Brasil",flag:"🇧🇷"}], stadium:"Hard Rock Stadium", tag:"Grupo C — el Brasil más fácil de ver del torneo", highlight:true },
    { id:"m4", date:"27 Jun", day:"Sáb", time:"19:30 ET", teams:[{name:"Colombia",flag:"🇨🇴"},{name:"Portugal",flag:"🇵🇹"}], stadium:"Hard Rock Stadium", tag:"Grupo K", highlight:true },
    { id:"m5", date:"3 Jul",  day:"Vie", time:"18:00 ET", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"Hard Rock Stadium", tag:"Ronda de 32 — 1°J vs. 2°H", highlight:false },
    { id:"m6", date:"11 Jul", day:"Sáb", time:"17:00 ET", teams:[{name:"Semifinal",flag:""},{name:"Por definir",flag:""}], stadium:"Hard Rock Stadium", tag:"Semifinal 🏅", highlight:true },
    { id:"m7", date:"18 Jul", day:"Vie", time:"17:00 ET", teams:[{name:"Tercer puesto",flag:""},{name:"Por definir",flag:""}], stadium:"Hard Rock Stadium", tag:"Partido por el Tercer Lugar 🥉", highlight:false },
  ],
  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA",          value:"Miami Stadium (Hard Rock Stadium)" },
      { label:"Aforo",                 value:"~65,000 — configuración FIFA (dosel de techo parcial que da sombra a la mayoría de los asientos)" },
      { label:"Clima (jun–jul)",       value:"Días: 31–34°C · Humedad elevada · Lluvia por las tardes (tormentas breves de 30–60 min) · El dosel del estadio cubre al fanático" },
      { label:"Partidos",              value:"7 confirmados — 4 grupos + 1 Ronda de 32 + 1 Semifinal + 1 Tercer Lugar" },
      { label:"Ubicación del estadio", value:"Miami Gardens — a 25 km al norte del downtown de Miami. No está en la ciudad. No hay subway al estadio." },
      { label:"Aeropuertos",           value:"MIA — Miami International (principal, ~18 km del estadio) · FLL — Fort Lauderdale-Hollywood International (~30 km, vuelos más baratos desde muchos mercados)" },
    ],
    body:"Miami es la ciudad del torneo con más latinoamericanos por metro cuadrado. Las comunidades de Colombia, Venezuela, Cuba, Brasil, Argentina y Uruguay tienen base real en el área metropolitana. Colombia vs. Portugal (27 junio) y Brasil vs. Escocia (24 junio) tienen tribuna local sin que nadie compre un vuelo desde Sudamérica. La Semifinal del 11 de julio convierte a Miami en la ciudad más caliente del torneo, en todos los sentidos.",
    // ⚠️ EDITORIAL NOTE: este body no existe en el .docx fuente — es contenido generado. Requiere validación o reemplazo por texto aprobado.
    lagomNote:"El calor de julio en Miami es diferente al de junio. Para la Semifinal, la temperatura exterior puede superar los 36°C con humedad del 80%. El Hard Rock Stadium no tiene A/C. Usa ropa técnica, hidratación constante y llega con tiempo para las filas de seguridad exteriores.",
  },
  vibe:{
    body:"La diáspora latinoamericana de Miami no espera el Mundial para tener cultura de fútbol. Calle Ocho en Little Havana transmite partidos desde los años 90 con la misma energía que los bares de Buenos Aires. El Wynwood Yard tiene food trucks con banderas de cada país. Para los partidos de Colombia y Brasil, el Design District y Brickell concentran afición que lleva viviendo aquí más tiempo que la mayoría de fanáticos que llegan desde el extranjero.",
    lagomNote:"Para la Semifinal del 11 de julio, los precios en Miami suben a los niveles más altos junto con Nueva York. Reserva hotel y transporte para Colombia-Portugal (27 Jun), Brasil-Escocia (24 Jun) y la Semifinal como un bloque, no por separado.",
  },
  stayNeighborhoods:{
    intro:"Miami tiene un problema estructural para el fan del Mundial: el estadio está en Miami Gardens, al norte, y los barrios interesantes están al sur o al este, cerca del agua. No existe tránsito público directo entre ambos puntos. Esa tensión define la elección de base.",
    items:[
      { kind:"recommended", title:"Base recomendada: Brickell / Wynwood", body:"Brickell es el distrito financiero con la mejor infraestructura hotelera de precio justo en Miami — no barata, pero más razonable que South Beach. Acceso al Metrorail (Brickell Station) para llegar al Metrobus 297 en Golden Glades con transbordo. Wynwood, a diez minutos en Uber, tiene la escena de arte urbano y restaurantes más activa de la ciudad. Para el fan que quiere base logística sin pagar tarifa de South Beach, Brickell es la respuesta." },
      { kind:"alternative", title:"Opción con carácter: La Pequeña Habana (Little Havana)", body:"A ocho minutos en Uber de Brickell, La Pequeña Habana tiene la identidad de barrio más auténtica de Miami: dominó en los parques, cafecito en los colmados y restaurantes cubanos que no ajustan el menú para el turista. La Calle Ocho (SW 8th Street) tiene bares con pantallas que en partidos de Colombia o Uruguay cobran la misma intensidad que un estadio. Acceso al Metrobus hacia el norte desde la misma calle." },
      { kind:"alternative", title:"Glamour con precio: South Beach", body:"El fan que quiere Miami completa — playa, noche, arquitectura Art Deco — paga el precio de estar a 35 minutos del estadio sin tránsito directo. La solución es el Brightline desde MiamiCentral Station (a 15 minutos en Metromover de South Beach) hasta Aventura, y de ahí el shuttle oficial al estadio. No es rápido, pero es predecible. Para la Semifinal o el Tercer Lugar, donde la logística importa más que para grupos, calcula el tiempo con margen." },
      { kind:"avoid", title:"Evitar como base: Miami Gardens (entorno del estadio)", body:"La zona industrial y residencial alrededor del Hard Rock Stadium no tiene oferta de hospedaje ni gastronomía que justifique quedarse ahí entre partidos. Para el Dolphins funciona porque el partido dura tres horas; para una estadía mundialista de varios días, no." },
    ],
  },
  stays:[
    { name:"The Goodtime Hotel", area:"South Beach / Collins Ave", price:"$$$$", priceCAD:"$320–600 USD/noche (periodo mundialista)", tags:["Diseño","Piscina","South Beach"], note:"El hotel de diseño más fotogénico de South Beach: dos piscinas, terraza de cócteles y el mejor ambiente de la zona. Para el fan que quiere South Beach con criterio. A 35 minutos del estadio vía Brightline + rideshare.", best_for:"Carácter", hotel_link:"https://booking.stay22.com/lagomplan/68Xug_cNIX", archetypes: [] },
    { name:"Urbanica The Meridian", area:"South Beach / Art Déco District", price:"$$$", priceCAD:"$180–320 USD/noche (periodo mundialista)", tags:["Smart value","Art Déco","Playa"], note:"Hotel boutique en el distrito Art Déco con acceso directo a la playa en menos de cinco minutos a pie. La opción más honesta del rango medio en Miami: diseño con historia y precio calibrado.", best_for:"Smart value", hotel_link:"https://booking.stay22.com/lagomplan/7gIXLwHXJ9", archetypes: ['Parejas'] },
    { name:"EDITION Miami", area:"Edgewater / Midtown", price:"$$$$", priceCAD:"$500–1,000 USD/noche (periodo mundialista)", tags:["Lujo","Vistas a la bahía","Spa"], note:"El hotel de Ian Schrager a orillas de la bahía de Biscayne, a mitad de camino entre Wynwood y South Beach. Pool deck con vistas al agua, restaurante de Mateu Casañas y habitaciones que compiten con cualquier dirección del torneo en Estados Unidos. La opción que equilibra posición, servicio y acceso logístico al Metrorail en Edgewater.", best_for:"Lujo", hotel_link:"https://booking.stay22.com/lagomplan/ohtkvB_glo", archetypes: ['Parejas'] },
  ],
  logistics:{
    transport:[
      { icon:"✈", title:"Llegar a Miami — MIA", text:"MIA — Miami International Airport está a 18 km del centro y a 30 km del estadio. El Brightline conecta MIA Airport con Brickell y Downtown, requiriendo combinación con rideshare para el estadio. Uber directo desde MIA al estadio: ~35 minutos y $35–55 sin tráfico." },
      { icon:"🚆", title:"Ruta maestra — Brightline + Metrobus 297", text:"La combinación más limpia: Brightline desde MIA Airport o Brickell Station hasta Aventura, luego Metrobus 297 directo al estadio. Total: ~55 minutos desde Brickell. El Brightline opera cada 15–30 minutos con tarjeta sin contacto." },
      { icon:"🚌", title:"Alternativa — Metrobus 297 directo", text:"El Metrobus 297 conecta el centro de Miami con Miami Gardens. La ruta completa desde Brickell usa el Metrorail hasta Golden Glades → Metrobus 297 al estadio. Para el fan alojado en Coral Gables, Coconut Grove o Downtown, la combinación Metrorail + 297 es la opción más predecible en horario de partido." },
      { icon:"⚠️", title:"Error crítico — Uber post-Semifinal", text:"Después de la Semifinal, 65,000 personas salen de una zona sin metro. Los tiempos de espera de Uber post-Semifinal en julio en Miami superan los 60–90 minutos con precios de surge de $80–150. Coordina el regreso en Brightline o Metrobus — o quédate en Miami Gardens hasta que pase el pico.", isWarning:true },
    ],
    timings:[
      { label:"Brickell → Hard Rock Stadium (Brightline + 297)", value:"~55 min" },
      { label:"MIA Airport → estadio (rideshare sin tráfico)", value:"~30 min · con tráfico: 55–75 min" },
      { label:"South Beach → estadio (rideshare)", value:"~40 min sin tráfico" },
      { label:"Downtown Miami → estadio (Metrobus 297)", value:"~50 min" },
    ],
    matchDayCronologia:{
      matchName:"11 Jul · Semifinal",
      steps:[
        { time:"H-4:00", text:"Almuerza antes del mediodía. El calor de julio en Miami a la tarde es el más intenso del torneo." },
        { time:"H-3:00", text:"Brightline desde Brickell hacia Aventura. Sale cada 15–30 minutos." },
        { time:"H-2:00", text:"Metrobus 297 hacia el estadio desde Golden Glades. Llegada con margen para filas de seguridad." },
        { time:"H-1:30", text:"Dentro del estadio. El aire acondicionado en las concesiones y las áreas de circulación interior funciona — aprovéchalo antes del partido." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo." },
        { time:"H+0:00", text:"Semifinal." },
        { time:"H+1:45", text:"Brightline o Metrobus de regreso. No uses rideshare post-Semifinal." },
      ],
    },
    timing:"Miami no tiene metro al estadio. El Brightline + Metrobus 297 es la combinación que resuelve el transporte con el mejor balance. Para la Semifinal, planifica el regreso antes del partido.",
    cost:"Miami es cara y el torneo lo confirma. Brickell o Coconut Grove como base alternativa a South Beach dan mejores precios con buena conexión al Brightline.",
  },
  vibeCards:[
    { title:"FIFA Fan Festival™ — Bayfront Park", type:"Fan fest oficial", typeColor:CORAL, desc:"El Fan Fest de Miami se instala en el Bayfront Park del downtown, frente a la bahía de Biscayne. El telón de fondo — el skyline de Miami, el mar y las palmeras — es el más fotogénico de cualquier Fan Fest del torneo. Gratuito, con pantallas de gran formato y acceso por Metromover desde el Metrorail.", tag:"Sin boleto OK" },
    { title:"Calle Ocho (Little Havana)", type:"Barrio", typeColor:FJORD, desc:"El epicentro cultural latinoamericano de Miami transmite fútbol en sus bares y ventanitas desde los años 90. En días de partido de Colombia, Venezuela o cualquier selección del Caribe, Calle Ocho se cierra informalmente. El ambiente más orgánico de la sede.", tag:"Auténtico" },
    { title:"Wynwood Yard", type:"Food park", typeColor:SAGE, desc:"El mercado al aire libre de Wynwood tiene food trucks con cocina de todos los países que juegan en el torneo, pantallas exteriores orientadas a la calle y la energía de barrio artístico que Wynwood proyecta en cualquier evento cultural.", tag:"Wynwood" },
    { title:"Doral Central Park (Doral)", type:"Watch party", typeColor:PINE, desc:"El parque de Doral — municipio con la mayor comunidad venezolana de Estados Unidos — activa pantallas gigantes para los partidos de Venezuela y los clásicos latinoamericanos. Para Colombia-Portugal, la comunidad colombiana de Doral convierte el parque en algo que ningún Fan Fest oficial puede replicar.", tag:"Venezuela / Colombia" },
    { title:"American Social (Brickell)", type:"Sports bar", typeColor:"#1A3A5C", desc:"El sports bar de referencia de Brickell, con la mayor selección de cervezas artesanales del corredor financiero de Miami y pantallas en cada pared. Para los partidos europeos del torneo, es el punto de reunión de la comunidad anglosajona y europea que vive en Brickell. Qué pedir: Alitas + IPA de Florida.", tag:"Brickell" },
    { title:"Ball & Chain (Little Havana)", type:"Bar histórico", typeColor:"#5A3A2A", desc:"El bar histórico de Little Havana — abierto desde 1935 — combina música en vivo con transmisiones de los partidos del torneo. Para Colombia-Portugal y Brasil-Escocia, tiene afición colombiana y brasileña que viene a ver el partido como si estuviera en casa. Qué pedir: Mojito cubano + croquetas.", tag:"Little Havana" },
  ],
  food:[
    { dish:"Calle Ocho — ventanitas cubanas", where:"Little Havana — café cubano, croquetas y sándwich cubano desde las 7am; la cultura gastronómica más genuina de Miami", price:"$", type:"Ritual" },
    { dish:"Ball & Chain", where:"Little Havana — mojito cubano + ropa vieja + tostones; bar más emblemático de la Calle Ocho, música en vivo y pantalla en días de partido latinoamericano", price:"$$", type:"Pre-partido" },
    { dish:"Clevelander South Beach", where:"South Beach / Collins Avenue — nachos + cóctel tropical; terraza abierta 24h orientada al Ocean Drive, para la Semifinal con el Atlántico de fondo", price:"$$", type:"South Beach" },
    { dish:"Wynwood Yard", where:"Wynwood — food trucks con cocina de todos los países del torneo; pantallas exteriores y energía de barrio artístico", price:"$–$$", type:"Food park" },
    { dish:"Cocina cubana", where:"La Pequeña Habana — ropa vieja, picadillo y arroz con frijoles; la gastronomía cubana más auténtica de Estados Unidos", price:"$$", type:"Local" },
    { dish:"Cocina venezolana", where:"Doral / Hialeah — hallacas, arepas y pabellón criollo en la mayor concentración venezolana de Estados Unidos", price:"$–$$", type:"Excursión" },
  ],
  experiences:[
    { title:"South Beach / Crandon Park (Key Biscayne)", duration:"Mañana o tarde", desc:"South Beach es la postal conocida, pero para familias con niños la mejor opción es Crandon Park en Key Biscayne: playa de aguas calmadas, parque con zonas verdes, canchas de tenis y una laguna con menos corriente que el Atlántico abierto. Acceso en auto o en Uber desde el downtown en 20 minutos. Entrada al parque: $8 por vehículo. Para el día libre entre el 21 y el 24 de junio.", type:"Playa", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver opciones" },
    { title:"Frost Museum of Science + PAMM", duration:"Día completo", desc:"El Frost Museum of Science en el downtown tiene un planetario, un acuario de varios pisos con tiburones y mantarrayas, y exposiciones de ciencia interactiva para todas las edades. Entrada: $34 adultos / $20 menores de 12. A cien metros, el Pérez Art Museum Miami (PAMM) tiene la mejor colección de arte latinoamericano contemporáneo del sudeste de Estados Unidos. Entrada: $20 adultos / gratis menores de 18. Los dos juntos completan un día en el downtown sin automóvil — Metromover llega a las puertas.", type:"Familiar", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver entradas" },
    { title:"Everglades — excursión de día", duration:"Día completo", desc:"A 60 kilómetros al suroeste de Miami, los Everglades son el ecosistema subtropical más grande del hemisferio occidental: caimanes en el agua, aves tropicales en los manglares y una travesía en airboat que no tiene equivalente en ninguna otra sede del torneo. Las excursiones organizadas desde Miami salen desde el amanecer y regresan antes del mediodía — tiempo suficiente para un partido vespertino.", type:"Naturaleza", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Reservar airboat tour" },
    { title:"Jungle Island + Zoo Miami", duration:"Mañana", desc:"Para familias con niños pequeños con actividades al aire libre y sombra controlada: Jungle Island en el downtown (acceso en ferry desde Bayside) tiene pingüinos, flamencos y una tirolesa sobre la bahía. Zoo Miami en el sur es el zoo más grande de la Florida — 45 km cuadrados, jaulas abiertas y temperatura mejor manejada que en la calle por la cobertura vegetal. Ambos abren a las 10am y permiten una mañana completa antes de cualquier partido vespertino.", type:"Familiar", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver opciones" },
  ],
  lagomTips:[
    "El Hard Rock Stadium no tiene aire acondicionado. Para la Semifinal de julio, temperatura exterior puede superar 36°C con humedad del 80%. Ropa técnica, hidratación desde la mañana y protector solar son obligatorios.",
    "Brightline + Metrobus 297 es la ruta correcta al estadio. El rideshare post-Semifinal tiene esperas de 60–90 minutos con precios de surge extremos — planifica el regreso antes de salir.",
    "Colombia-Portugal (27 Jun) y Brasil-Escocia (24 Jun) son los partidos con mayor demanda de afición latinoamericana local. Reserva transporte con anticipación.",
    "Calle Ocho en Little Havana y el parque de Doral dan el contexto cultural real de esta sede. Miami no es solo South Beach — es la capital latinoamericana de Estados Unidos.",
  ],
  matchDayChecklist:[
    "Boleto digital del partido — app FIFA",
    "Ruta Brightline + Metrobus 297 planificada",
    "Agua y electrolitos antes de salir del hotel",
    "Protector solar SPF 50+",
    "Ropa técnica ligera para humedad extrema",
    "Regreso planificado: Brightline, no rideshare post-Semifinal",
    "Reserva hotel para 24 Jun (Brasil), 27 Jun (Colombia) y 11 Jul (Semifinal)",
    "Llegada al estadio 90 min antes — filas exteriores bajo calor",
  ],
  didYouKnow:"Hard Rock Stadium ha albergado cuatro Super Bowls y tres finales de Copa América (1994, 2016, 2024). La Copa América 2024 se jugó aquí con Argentina campeón. El estadio conoce el peso de una final — y la afición latinoamericana de Miami también.",
  closingNote:"Miami recibe al torneo con siete partidos, una Semifinal y la colonia latinoamericana más densa de Estados Unidos como tribuna interna. Brasil y Colombia no viajan a Miami — ya viven ahí. La playa está a 30 minutos del estadio. Calle Ocho lleva 50 años sabiendo cómo celebrar. LagomPlan te da el Brightline correcto, el bar en Little Havana y la razón para llegar tres horas antes de la Semifinal. El Atlántico hace el resto.",
  closingSignature:"Lagomplan · Guía de campo · Miami · Mundial 2026",
  plannerCTA:"Generar mi viaje a Miami",
}

export const en: CityGuide = {
  id:"mia", city:"Miami", country:"United States", state:"Florida", flag:"🇺🇸", accent:ACCENT,
  tags:["Football","Beach","Food","Semifinal"],
  stadium:{ name:"Miami Stadium (Hard Rock Stadium)", capacity:"~65,000", area:"Miami Gardens — 25 km north of downtown Miami" },
  headline:"Heat in Miami isn't weather. It's the city's permanent state of mind. The World Cup only amplifies it.",
  description:"Heat in Miami isn't weather. It's the city's permanent state of mind. Miami hosts seven matches, including a Semifinal on July 11. Miami's Latin American community doesn't need anyone to fly in: there are more South American, Central American, and Caribbean communities in this city than anywhere else in the United States.",
  scores:[
    { label:"Atmosphere",       value:5 },
    { label:"Football culture", value:4 },
    { label:"Food",             value:5 },
    { label:"Cost",             value:1 },
  ],
  matches:[
    { id:"m1", date:"Jun 15", day:"Mon", time:"18:00 ET", teams:[{name:"Saudi Arabia",flag:"🇸🇦"},{name:"Uruguay",flag:"🇺🇾"}], stadium:"Hard Rock Stadium", tag:"Group H", highlight:false },
    { id:"m2", date:"Jun 21", day:"Sun", time:"18:00 ET", teams:[{name:"Uruguay",flag:"🇺🇾"},{name:"Cape Verde",flag:"🇨🇻"}], stadium:"Hard Rock Stadium", tag:"Group H", highlight:false },
    { id:"m3", date:"Jun 24", day:"Wed", time:"18:00 ET", teams:[{name:"Scotland",flag:"🏴"},{name:"Brazil",flag:"🇧🇷"}], stadium:"Hard Rock Stadium", tag:"Group C — the easiest Brazil match to attend in the tournament", highlight:true },
    { id:"m4", date:"Jun 27", day:"Sat", time:"19:30 ET", teams:[{name:"Colombia",flag:"🇨🇴"},{name:"Portugal",flag:"🇵🇹"}], stadium:"Hard Rock Stadium", tag:"Group K", highlight:true },
    { id:"m5", date:"Jul 3",  day:"Fri", time:"18:00 ET", teams:[{name:"Round of 32",flag:""},{name:"TBD",flag:""}], stadium:"Hard Rock Stadium", tag:"Round of 32 — 1°J vs. 2°H", highlight:false },
    { id:"m6", date:"Jul 11", day:"Sat", time:"17:00 ET", teams:[{name:"Semifinal",flag:""},{name:"TBD",flag:""}], stadium:"Hard Rock Stadium", tag:"Semifinal 🏅", highlight:true },
    { id:"m7", date:"Jul 18", day:"Fri", time:"17:00 ET", teams:[{name:"Third place",flag:""},{name:"TBD",flag:""}], stadium:"Hard Rock Stadium", tag:"Third Place Match 🥉", highlight:false },
  ],
  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium",          value:"Miami Stadium (Hard Rock Stadium)" },
      { label:"Capacity",              value:"~65,000 — FIFA configuration (partial canopy that shades the majority of seats)" },
      { label:"Weather (Jun–Jul)",     value:"Days: 31–34°C · High humidity · Afternoon rain (brief 30–60 min storms) · The stadium canopy covers fans" },
      { label:"Matches",               value:"7 confirmed — 4 group stage + 1 Round of 32 + 1 Semifinal + 1 Third Place" },
      { label:"Stadium location",      value:"Miami Gardens — 25 km north of downtown Miami. Not in the city. No subway to the stadium." },
      { label:"Airports",              value:"MIA — Miami International (main, ~18 km from stadium) · FLL — Fort Lauderdale-Hollywood International (~30 km, cheaper flights from many markets)" },
    ],
    body:"Miami is the tournament's city with the most Latin Americans per square meter. Colombian, Venezuelan, Cuban, Brazilian, Argentine, and Uruguayan communities have real roots in the metro area. Colombia vs. Portugal (June 27) and Brazil vs. Scotland (June 24) have a home crowd without anyone buying a flight from South America. The July 11 Semifinal turns Miami into the tournament's hottest city, in every sense.",
    // ⚠️ EDITORIAL NOTE: this body does not exist in the source .docx — it is generated content. Requires validation or replacement with approved text.
    lagomNote:"July heat in Miami is different from June. For the Semifinal, outdoor temperatures can top 36°C with 80% humidity. Hard Rock Stadium has no A/C. Wear technical fabrics, hydrate constantly, and arrive early for the outdoor security queues.",
  },
  vibe:{
    body:"Miami's Latin American diaspora doesn't wait for the World Cup to have football culture. Calle Ocho in Little Havana has been broadcasting matches since the '90s with the same energy as bars in Buenos Aires. Wynwood Yard has food trucks flying every country's flag. For Colombia and Brazil matches, the Design District and Brickell concentrate fans who have lived here longer than most of the fans flying in from abroad.",
    lagomNote:"For the July 11 Semifinal, Miami prices climb to peak-tournament levels alongside New York. Book hotels and transit for Colombia-Portugal (Jun 27), Brazil-Scotland (Jun 24), and the Semifinal as one block, not separately.",
  },
  stayNeighborhoods:{
    intro:"Miami has a structural problem for the World Cup fan: the stadium is in Miami Gardens, to the north, and the interesting neighborhoods are south or east, near the water. There is no direct public transit between the two. That tension defines the choice of base.",
    items:[
      { kind:"recommended", title:"Recommended base: Brickell / Wynwood", body:"Brickell is the financial district with Miami's best fairly-priced hotel infrastructure — not cheap, but more reasonable than South Beach. Metrorail access (Brickell Station) lets you reach the Metrobus 297 at Golden Glades with a transfer. Wynwood, ten minutes by Uber, has the most active street art and restaurant scene in the city. For the fan who wants a logistical base without paying South Beach rates, Brickell is the answer." },
      { kind:"alternative", title:"Character pick: Little Havana (La Pequeña Habana)", body:"Eight minutes by Uber from Brickell, Little Havana has Miami's most authentic neighborhood identity: dominoes in the parks, cafecito at the corner stores, and Cuban restaurants that don't adjust the menu for tourists. SW 8th Street (Calle Ocho) has bars with screens that on Colombia or Uruguay match days hit the same intensity as a stadium. Northbound Metrobus access from the same street." },
      { kind:"alternative", title:"Glamour at a price: South Beach", body:"The fan who wants the full Miami — beach, nightlife, Art Deco architecture — pays the price of being 35 minutes from the stadium with no direct transit. The solution is the Brightline from MiamiCentral Station (15 minutes by Metromover from South Beach) to Aventura, then the official shuttle to the stadium. Not fast, but predictable. For the Semifinal or Third Place match, where logistics matter more than for group games, plan with margin." },
      { kind:"avoid", title:"Avoid as a base: Miami Gardens (around the stadium)", body:"The industrial and residential area around Hard Rock Stadium has no lodging or food offering that justifies staying there between matches. For Dolphins games it works because the match lasts three hours; for a multi-day World Cup stay, no." },
    ],
  },
  stays:[
    { name:"The Goodtime Hotel", area:"South Beach / Collins Ave", price:"$$$$", priceCAD:"$320–600 USD/night (World Cup period)", tags:["Design","Pool","South Beach"], note:"The most photogenic design hotel in South Beach: two pools, cocktail terrace, and the best atmosphere in the area. For the fan who wants South Beach with judgment. 35 minutes to the stadium via Brightline + rideshare.", best_for:"Character", hotel_link:"https://booking.stay22.com/lagomplan/68Xug_cNIX" },
    { name:"Urbanica The Meridian", area:"South Beach / Art Deco District", price:"$$$", priceCAD:"$180–320 USD/night (World Cup period)", tags:["Smart value","Art Deco","Beach"], note:"Boutique hotel in the Art Deco district with direct beach access under five minutes on foot. The most honest mid-range option in Miami: historic design at a calibrated price.", best_for:"Smart value", hotel_link:"https://booking.stay22.com/lagomplan/7gIXLwHXJ9" },
    { name:"EDITION Miami", area:"Edgewater / Midtown", price:"$$$$", priceCAD:"$500–1,000 USD/night (World Cup period)", tags:["Luxury","Bay views","Spa"], note:"Ian Schrager's hotel on the shores of Biscayne Bay, halfway between Wynwood and South Beach. Pool deck with water views, Mateu Casañas restaurant, and rooms that compete with any address in the U.S. tournament. The option that balances position, service, and Metrorail access in Edgewater.", best_for:"Luxury", hotel_link:"https://booking.stay22.com/lagomplan/ohtkvB_glo" },
  ],
  logistics:{
    transport:[
      { icon:"✈", title:"Arriving in Miami — MIA", text:"MIA — Miami International Airport is 18 km from downtown and 30 km from the stadium. The Brightline connects MIA Airport with Brickell and Downtown, requiring a rideshare combo to reach the stadium. Direct Uber from MIA to the stadium: ~35 min and $35–55 without traffic." },
      { icon:"🚆", title:"Master route — Brightline + Metrobus 297", text:"The cleanest combo: Brightline from MIA Airport or Brickell Station to Aventura, then Metrobus 297 direct to the stadium. Total: ~55 minutes from Brickell. Brightline runs every 15–30 minutes with contactless payment." },
      { icon:"🚌", title:"Alternative — Metrobus 297 direct", text:"Metrobus 297 connects central Miami with Miami Gardens. The full route from Brickell uses Metrorail to Golden Glades → Metrobus 297 to the stadium. For fans staying in Coral Gables, Coconut Grove, or Downtown, the Metrorail + 297 combination is the most predictable option on match days." },
      { icon:"⚠️", title:"Critical error — Uber post-Semifinal", text:"After the Semifinal, 65,000 people exit an area without a metro. Uber wait times post-Semifinal in July in Miami top 60–90 minutes with $80–150 surge pricing. Line up your return on Brightline or Metrobus — or stay in Miami Gardens until the peak passes.", isWarning:true },
    ],
    timings:[
      { label:"Brickell → Hard Rock Stadium (Brightline + 297)", value:"~55 min" },
      { label:"MIA Airport → stadium (rideshare, no traffic)", value:"~30 min · with traffic: 55–75 min" },
      { label:"South Beach → stadium (rideshare)", value:"~40 min without traffic" },
      { label:"Downtown Miami → stadium (Metrobus 297)", value:"~50 min" },
    ],
    matchDayCronologia:{
      matchName:"Jul 11 · Semifinal",
      steps:[
        { time:"H-4:00", text:"Eat before noon. July heat in Miami in the afternoon is the tournament's most intense." },
        { time:"H-3:00", text:"Brightline from Brickell to Aventura. Departs every 15–30 minutes." },
        { time:"H-2:00", text:"Metrobus 297 to the stadium from Golden Glades. Arrive with buffer for security lines." },
        { time:"H-1:30", text:"Inside the stadium. Air conditioning in the concessions and interior circulation areas — use it before the match." },
        { time:"H-0:30", text:"In your seat. Digital ticket ready." },
        { time:"H+0:00", text:"Semifinal." },
        { time:"H+1:45", text:"Brightline or Metrobus back. Don't use rideshare post-Semifinal." },
      ],
    },
    timing:"Miami has no metro to the stadium. Brightline + Metrobus 297 is the combination that solves transit with the best balance. For the Semifinal, plan your return before the match.",
    cost:"Miami is expensive and the tournament confirms it. Brickell or Coconut Grove as an alternative base to South Beach give better prices with solid Brightline connection.",
  },
  vibeCards:[
    { title:"FIFA Fan Festival™ — Bayfront Park", type:"Official fan fest", typeColor:CORAL, desc:"Miami's Fan Fest takes over downtown Bayfront Park, facing Biscayne Bay. The backdrop — Miami skyline, sea, palm trees — is the most photogenic of any Fan Fest in the tournament. Free, with big-format screens and access via Metromover from the Metrorail.", tag:"No ticket needed" },
    { title:"Calle Ocho (Little Havana)", type:"Neighborhood", typeColor:FJORD, desc:"Miami's Latin American cultural epicenter has been broadcasting football in its bars and walk-up windows since the '90s. On Colombia, Venezuela, or Caribbean national-team match days, Calle Ocho informally shuts down. The most organic atmosphere in the host city.", tag:"Authentic" },
    { title:"Wynwood Yard", type:"Food park", typeColor:SAGE, desc:"Wynwood's open-air market has food trucks from every country in the tournament, street-facing outdoor screens, and the artistic-neighborhood energy Wynwood projects onto any cultural event.", tag:"Wynwood" },
    { title:"Doral Central Park (Doral)", type:"Watch party", typeColor:PINE, desc:"The park in Doral — the municipality with the largest Venezuelan community in the US — activates giant screens for Venezuela's matches and the Latin American classics. For Colombia-Portugal, Doral's Colombian community turns the park into something no official Fan Fest can replicate.", tag:"Venezuela / Colombia" },
    { title:"American Social (Brickell)", type:"Sports bar", typeColor:"#1A3A5C", desc:"Brickell's benchmark sports bar, with the biggest craft beer selection in Miami's financial corridor and screens on every wall. For the tournament's European matches, it's the meeting point for the Anglo and European community living in Brickell. What to order: wings + Florida IPA.", tag:"Brickell" },
    { title:"Ball & Chain (Little Havana)", type:"Historic bar", typeColor:"#5A3A2A", desc:"Little Havana's historic bar — open since 1935 — combines live music with tournament broadcasts. For Colombia-Portugal and Brazil-Scotland, the Colombian and Brazilian crowd shows up to watch the match as if they were home. What to order: Cuban mojito + croquetas.", tag:"Little Havana" },
  ],
  food:[
    { dish:"Calle Ocho — Cuban walk-ups", where:"Little Havana — Cuban coffee, croquetas, and Cuban sandwich from 7am; Miami's most genuine food culture", price:"$", type:"Ritual" },
    { dish:"Ball & Chain", where:"Little Havana — Cuban mojito + ropa vieja + tostones; Calle Ocho's most emblematic bar, live music and screens on Latin American match days", price:"$$", type:"Pre-match" },
    { dish:"Clevelander South Beach", where:"South Beach / Collins Avenue — nachos + tropical cocktail; outdoor terrace open 24h facing Ocean Drive, for the Semifinal with the Atlantic as backdrop", price:"$$", type:"South Beach" },
    { dish:"Wynwood Yard", where:"Wynwood — food trucks from every country in the tournament; outdoor screens and artistic-neighborhood energy", price:"$–$$", type:"Food park" },
    { dish:"Cuban cooking", where:"Little Havana — ropa vieja, picadillo, rice and beans; the most authentic Cuban food scene in the United States", price:"$$", type:"Local" },
    { dish:"Venezuelan cooking", where:"Doral / Hialeah — hallacas, arepas, and pabellón criollo in the largest Venezuelan concentration in the US", price:"$–$$", type:"Day trip" },
  ],
  experiences:[
    { title:"South Beach / Crandon Park (Key Biscayne)", duration:"Morning or afternoon", desc:"South Beach is the familiar postcard, but for families with children the best option is Crandon Park on Key Biscayne: calm-water beach, green park areas, tennis courts, and a lagoon with less current than the open Atlantic. Access by car or Uber from downtown in 20 minutes. Park entry: $8 per vehicle. For the off day between June 21 and 24.", type:"Beach", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See options" },
    { title:"Frost Museum of Science + PAMM", duration:"Full day", desc:"The Frost Museum of Science downtown has a planetarium, a multi-story aquarium with sharks and rays, and interactive science exhibits for all ages. Admission: $34 adults / $20 under 12. A hundred meters away, the Pérez Art Museum Miami (PAMM) holds the Southeast US's best Latin American contemporary art collection. Admission: $20 adults / free under 18. Both together fill a downtown day without a car — Metromover reaches the doors.", type:"Family", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See tickets" },
    { title:"Everglades — day trip", duration:"Full day", desc:"60 km southwest of Miami, the Everglades are the largest subtropical ecosystem in the Western Hemisphere: alligators in the water, tropical birds in the mangroves, and an airboat ride with no equivalent at any other host city. Organized tours from Miami leave at dawn and return before midday — enough time for an afternoon match.", type:"Nature", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Book airboat tour" },
    { title:"Jungle Island + Zoo Miami", duration:"Morning", desc:"For families with young children who prioritize outdoor activities with controlled shade: Jungle Island downtown (ferry access from Bayside) has penguins, flamingos, and a zipline over the bay. Zoo Miami in the south is Florida's largest zoo — 45 sq km, open-range habitats, and temperature better managed than the street thanks to vegetation coverage. Both open at 10am and allow a full morning before any afternoon match.", type:"Family", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See options" },
  ],
  lagomTips:[
    "Hard Rock Stadium has no air conditioning. For the July Semifinal, outdoor temperatures can top 36°C with 80% humidity. Technical fabrics, morning hydration, and sunscreen are mandatory.",
    "Brightline + Metrobus 297 is the correct route to the stadium. Post-Semifinal rideshare has 60–90 minute waits and extreme surge pricing — plan the return before you leave.",
    "Colombia-Portugal (Jun 27) and Brazil-Scotland (Jun 24) are the matches with the highest local Latin American demand. Book transit ahead.",
    "Calle Ocho in Little Havana and Doral Park give you the real cultural context of this host city. Miami isn't just South Beach — it's the Latin American capital of the United States.",
  ],
  matchDayChecklist:[
    "Digital match ticket — FIFA app",
    "Brightline + Metrobus 297 route planned",
    "Water and electrolytes before leaving the hotel",
    "SPF 50+ sunscreen",
    "Light technical fabrics for extreme humidity",
    "Return planned: Brightline, no rideshare post-Semifinal",
    "Hotel reservation for Jun 24 (Brazil), Jun 27 (Colombia), and Jul 11 (Semifinal)",
    "Arrive at the stadium 90 min ahead — outdoor lines under heat",
  ],
  didYouKnow:"Hard Rock Stadium has hosted four Super Bowls and three Copa América finals (1994, 2016, 2024). The 2024 Copa América final was played here with Argentina as champion. The stadium knows the weight of a final — and so does Miami's Latin American crowd.",
  closingNote:"Miami welcomes the tournament with seven matches, a Semifinal, and the densest Latin American community in the United States as its internal crowd. Brazil and Colombia don't travel to Miami — they already live here. The beach is 30 minutes from the stadium. Calle Ocho has spent 50 years knowing how to celebrate. LagomPlan gives you the right Brightline, the bar in Little Havana, and the reason to arrive three hours before the Semifinal. The Atlantic handles the rest.",
  closingSignature:"Lagomplan · Field Guide · Miami · World Cup 2026",
  plannerCTA:"Generate my Miami trip",
}