 // supabase/functions/generate-trip/index.ts                                                                 
  import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
  import { WC_2026_CALENDAR, WC_HOST_CITY_HINTS, type WcMatch } from "./wc-2026-calendar.ts";                                          
                                                            
  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");                                                   
                                                                                                                 
  const corsHeaders = {                                                                                          
    "Access-Control-Allow-Origin": "*",                                                                          
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",                        
    "Access-Control-Allow-Methods": "POST, OPTIONS",        
  };                                                                                                           
                                                                                                                 
  type ErrBody = { success: false; code: string; message: string; detail?: unknown };
  const errorResponse = (status: number, code: string, message: string, detail?: unknown) =>                     
    new Response(                                                                                                
      JSON.stringify({ success: false, code, message, detail } satisfies ErrBody),                             
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }                                
    );                                                                                                         
                                                                                                                 
  type Locale = "es" | "en";

  const SYSTEM_PROMPT_ES = `Eres un experto planificador de viajes mexicano con profundo conocimiento de destinos,
  gastronomía, cultura y logística en México.
  Tu tono es cálido y cercano, como un amigo experto que recomienda, no un guía turístico genérico.
  Usas información real: nombres de restaurantes, carreteras, tiempos de manejo, tips locales.

  REGLA DE ALOJAMIENTO (CRÍTICA):
  Si el viaje incluye al menos una noche (overnight === true), DEBES llenar el campo
  "accommodations" con al menos una entrada que cubra TODAS las noches del viaje.
  Recomienda zonas o barrios concretos donde quedarse y explica BREVEMENTE por qué encajan
  con el estilo y los intereses del viajero. NO inventes nombres de hoteles específicos
  ni precios exactos; recomienda zonas y tipo de alojamiento ("hotel boutique en Coyoacán",
  "apartamento en Roma Norte cerca del Bosque"). Las fechas de check-in y check-out vienen
  predeterminadas en el input — úsalas tal cual, no las modifiques.

  Si el viaje es de un solo día (overnight === false), deja "accommodations" como arreglo vacío.

  Cuando el usuario te pida un itinerario, llama a la herramienta emit_trip con los datos completos.
  No respondas con texto, sólo con la llamada a la herramienta.

  IMPORTANTE: Escribe TODO el contenido del itinerario (titles, day_label, objective,
  block titles, block descriptions, neighborhoods, rationales) en español.`;

  const SYSTEM_PROMPT_EN = `You are an expert travel planner with deep knowledge of destinations,
  food, culture, and logistics across Latin America and beyond.
  Your tone is warm and personal — like an experienced friend giving recommendations,
  not a generic tour guide. Use real information: restaurant names, roads, driving times,
  local tips.

  LODGING RULE (CRITICAL):
  If the trip includes at least one overnight (overnight === true), you MUST fill the
  "accommodations" field with at least one entry covering ALL nights of the trip.
  Recommend specific areas or neighborhoods where the traveler should stay and explain
  BRIEFLY why they fit the style and interests. Do NOT invent specific hotel names or
  exact prices; recommend areas and accommodation types ("boutique hotel in the Old
  Town", "apartment near the historic center"). Check-in and check-out dates come
  predetermined in the input — use them as-is, don't modify them.

  If the trip is a single day (overnight === false), leave "accommodations" as an empty array.

  When the user asks for an itinerary, call the emit_trip tool with the complete data.
  Don't reply with text, only with the tool call.

  IMPORTANT: Write ALL itinerary content (titles, day_label, objective, block titles,
  block descriptions, neighborhoods, rationales) in English.`;

  const systemPromptFor = (locale: Locale) =>
    locale === "en" ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_ES;
                                                                                                                 
  const budgetLine = {                                                                                           
    type: "object",                                                                                              
    required: ["label", "range"],                                                                                
    properties: { label: { type: "string" }, range: { type: "string" } },
  };                                                                                                             
                                                                                                               
  // Structured accommodations entity — first-class hotel surface (not regex-extracted).
  // The Edge Function fills city, checkInDate, checkOutDate, nights deterministically
  // before calling Claude (see buildPrompt) so the AI only chooses neighborhood +
  // accommodationType + rationale + priceTier.
  const accommodationItem = {
    type: "object",
    required: ["city", "accommodationType", "rationale", "priceTier", "checkInDate", "checkOutDate", "nights"],
    properties: {
      city:              { type: "string" },
      neighborhood:      { type: "string" },
      accommodationType: { type: "string", enum: ["hotel", "boutique", "hostel", "apartment", "resort", "cabin", "glamping", "unspecified"] },
      rationale:         { type: "string" },
      priceTier:         { type: "string", enum: ["budget", "mid", "upscale", "luxury"] },
      familyFriendly:    { type: "boolean" },
      checkInDate:       { type: "string" },
      checkOutDate:      { type: "string" },
      nights:            { type: "integer" },
    },
  };

  const TRIP_SCHEMA = {
    type: "object",
    required: ["title", "tagline", "hero_tags", "before_you_go", "days", "budget_breakdown", "accommodations"],
    properties: {                                           
      title:   { type: "string" },                                                                             
      tagline: { type: "string" },                                                                               
      hero_tags: {                                                                                             
        type: "object",                                                                                          
        required: ["from", "duration", "travelers", "budget"],
        properties: {                                                                                            
          from:      { type: "string" },                                                                       
          duration:  { type: "string" },                                                                         
          travelers: { type: "string" },
          budget:    { type: "string" },                                                                         
        },                                                                                                       
      },                          
      before_you_go: {                                                                                           
        type: "object",                                     
        required: ["departure_details", "best_time_to_leave", "what_to_pack", "tips"],
        properties: {
          departure_details:  { type: "string" },                                                              
          best_time_to_leave: { type: "string" },                                                                
          what_to_pack:       { type: "array", items: { type: "string" } },                                    
          tips:               { type: "array", items: { type: "string" } },                                      
        },                                                  
      },                                                                                                         
      days: {                                                                                                    
        type: "array",            
        items: {                                                                                                 
          type: "object",                                   
          required: ["day_number", "day_label", "title", "objective", "blocks"],
          properties: {
            day_number: { type: "integer" },                                                                   
            day_label:  { type: "string" },                                                                      
            title:      { type: "string" },
            objective:  { type: "string" },                                                                      
            blocks: {                                                                                            
              type: "array",      
              items: {                                                                                           
                type: "object",                             
                required: ["time", "title", "description", "type"],
                properties: {
                  time:        { type: "string" },                                                             
                  title:       { type: "string" },                                                               
                  description: { type: "string" },
                  type:        { type: "string", enum: ["hotel", "restaurant", "tour", "transfer", "culture", "nature", "free"] },                                                                                                    
                },                                                                                             
              },                                                                                                 
            },                                              
          },                                                                                                     
        },                                                  
      },                                                                                                       
      budget_breakdown: {
        type: "object",
        required: ["accommodation", "food", "activities", "transport", "total"],
        properties: {
          accommodation: budgetLine,
          food:          budgetLine,
          activities:    budgetLine,
          transport:     budgetLine,
          total:         budgetLine,
        },
      },
      // Always present in the output (empty array for same-day trips).
      // Required+empty is intentional: forces the model to acknowledge
      // it considered lodging rather than silently omitting the field.
      accommodations: {
        type: "array",
        items: accommodationItem,
      },
    },
  };                              
                                                                                                                 
  // ── Temporal-context helpers ────────────────────────────────────────────────
  // Pure date math. Derives the season + per-day weekday so the AI can pick
  // climate-appropriate activities (indoor in winter, shaded in summer) and
  // respect day-of-week realities (museum closures, market days). No external
  // data, no API calls — runs entirely off `start` + destination text.

  // Tiny lookup of destinations that fall in the southern hemisphere. Covers
  // the bulk of Lagomplan's relevant non-northern destinations for a Mexico-
  // based audience. Match is substring-based on lowercased destination text.
  const SOUTHERN_HEMISPHERE_HINTS = [
    "argentina", "buenos aires", "patagonia", "mendoza", "bariloche", "ushuaia", "iguazu",
    "uruguay", "montevideo", "punta del este", "colonia del sacramento",
    "chile", "santiago", "valparaíso", "atacama",
    "perú", "peru", "lima", "cusco", "arequipa", "machu picchu",
    "bolivia", "la paz", "sucre", "uyuni",
    "paraguay", "asunción",
    "brasil", "brazil", "río de janeiro", "rio de janeiro", "são paulo", "sao paulo", "salvador", "florianópolis", "florianopolis", "fortaleza",
    "australia", "sydney", "melbourne", "brisbane", "perth",
    "nueva zelanda", "new zealand", "auckland", "wellington", "queenstown",
    "sudáfrica", "south africa", "cape town", "ciudad del cabo", "johannesburgo", "johannesburg",
    "fiji", "tahití", "tahiti", "samoa",
  ];

  function isSouthernHemisphere(destination: string): boolean {
    if (!destination) return false;
    const d = destination.toLowerCase();
    return SOUTHERN_HEMISPHERE_HINTS.some(h => d.includes(h));
  }

  // Month-index → season (0-indexed: Jan = 0). Equinox cutoffs are simplified
  // (always month-boundary). Good enough for prompt context.
  const SEASONS_NORTHERN_ES = [
    "invierno", "invierno", "primavera", "primavera", "primavera",
    "verano", "verano", "verano", "otoño", "otoño", "otoño", "invierno",
  ];
  const SEASONS_NORTHERN_EN = [
    "winter", "winter", "spring", "spring", "spring",
    "summer", "summer", "summer", "autumn", "autumn", "autumn", "winter",
  ];
  const SEASONS_SOUTHERN_ES = [
    "verano", "verano", "otoño", "otoño", "otoño",
    "invierno", "invierno", "invierno", "primavera", "primavera", "primavera", "verano",
  ];
  const SEASONS_SOUTHERN_EN = [
    "summer", "summer", "autumn", "autumn", "autumn",
    "winter", "winter", "winter", "spring", "spring", "spring", "summer",
  ];
  const MONTH_NAMES_ES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  const MONTH_NAMES_EN = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const WEEKDAY_LABELS_ES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const WEEKDAY_LABELS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function buildSeasonLine(start: string, destination: string, locale: Locale): string {
    if (!start) return "";
    const date = new Date(`${start}T00:00:00Z`);
    if (isNaN(date.getTime())) return "";
    const m = date.getUTCMonth();
    const southern = isSouthernHemisphere(destination);
    if (locale === "en") {
      const season = (southern ? SEASONS_SOUTHERN_EN : SEASONS_NORTHERN_EN)[m];
      const hemi   = southern ? "southern hemisphere" : "northern hemisphere";
      return `\n  - Season at destination: ${season} (${hemi}, ${MONTH_NAMES_EN[m]})`;
    }
    const season = (southern ? SEASONS_SOUTHERN_ES : SEASONS_NORTHERN_ES)[m];
    const hemi   = southern ? "hemisferio sur" : "hemisferio norte";
    return `\n  - Estación en destino: ${season} (${hemi}, ${MONTH_NAMES_ES[m]})`;
  }

  function buildDayOfWeekLine(start: string, durationDays: number, locale: Locale): string {
    if (!start || !durationDays || durationDays <= 0) return "";
    const d0 = new Date(`${start}T00:00:00Z`);
    if (isNaN(d0.getTime())) return "";
    // Cap at 14 days printed inline — beyond that the prompt gets noisy.
    const cap = Math.min(durationDays, 14);
    const items: string[] = [];
    const dayWord  = locale === "en" ? "Day"  : "Día";
    const labels   = locale === "en" ? WEEKDAY_LABELS_EN : WEEKDAY_LABELS_ES;
    const moreWord = locale === "en" ? "more" : "más";
    for (let i = 0; i < cap; i++) {
      const d = new Date(d0);
      d.setUTCDate(d0.getUTCDate() + i);
      items.push(`${dayWord} ${i + 1} ${labels[d.getUTCDay()]}`);
    }
    const suffix = durationDays > cap ? ` (… +${durationDays - cap} ${moreWord})` : "";
    const heading = locale === "en" ? "Days of the week" : "Días de la semana";
    return `\n  - ${heading}: ${items.join(" · ")}${suffix}`;
  }

  // ── World Cup 2026 calendar helpers ─────────────────────────────────────────
  // The calendar is generated from lib/worldcup/data/<city>.ts (editorial
  // source of truth) by scripts/build-wc-calendar.mjs. The Edge Fn imports
  // the flat list + a host-city-hint lookup, and only surfaces a prompt block
  // when the trip overlaps a host city during the tournament window.

  function resolveWcCityId(destination: string): string | null {
    if (!destination) return null;
    const d = destination.toLowerCase();
    for (const [cityId, hints] of Object.entries(WC_HOST_CITY_HINTS)) {
      if (hints.some(h => d.includes(h.toLowerCase()))) return cityId;
    }
    return null;
  }

  function findWcMatchesInRange(cityId: string, start: string, end: string): WcMatch[] {
    if (!cityId || !start || !end) return [];
    return WC_2026_CALENDAR.filter(m =>
      m.cityId === cityId && m.date >= start && m.date <= end
    );
  }

  /**
   * Returns the full prompt fragment (data-block line + guidance block) when
   * the destination matches a WC host city AND the trip window overlaps real
   * matches. Empty string otherwise — non-WC trips don't see any of this
   * context, so prompt length stays honest.
   */
  function buildWcContext(destination: string, start: string, end: string, locale: Locale): string {
    if (!destination || !start || !end) return "";
    const cityId = resolveWcCityId(destination);
    if (!cityId) return "";
    const matches = findWcMatchesInRange(cityId, start, end);
    if (matches.length === 0) return "";

    const lines = matches.map(m => {
      const undef = locale === "en" ? "TBD" : "Por definir";
      const teamsLabel = m.teams.some(t => t === "Por definir" || !t)
        ? `${m.tag}`
        : `${m.teamsLabel} — ${m.tag}`;
      return `      · ${m.dateRaw} ${m.day} ${m.time} — ${teamsLabel.replace("Por definir", undef)} (${m.stadium})`;
    }).join("\n");

    if (locale === "en") {
      const plural = matches.length === 1 ? "match" : "matches";
      return `

  FIFA WORLD CUP 2026 (important — the trip falls on a World Cup host city):
  There are ${matches.length} confirmed ${plural} in ${matches[0].cityDisplay} during the stay:
${lines}

  Apply this context when building the itinerary:
    - LODGING: demand and prices are HIGH on match days. If the traveler is
      NOT going to the stadium, suggest booking well in advance or staying
      in neighborhoods away from the venue. If they are, prioritize lodging
      near transit to the stadium.
    - TRANSPORT: match days bring heavy Uber/taxi surge and crowded transit
      around the stadium (3 h before / 2 h after). Suggest leaving with
      buffer time or avoiding the area in those windows.
    - DINING: restaurants near the stadium and in tourist zones fill up
      before/after the match. Suggest reservations in advance or pivoting
      to alternative neighborhoods.
    - IF THE TRAVELER WANTS TO ATTEND: include the match as a "tour" block
      on the corresponding day. Block ~4 h around it (2 h before, 2 h
      after) with no other bookings, and describe the match in the block
      name (e.g. "Match: Mexico vs South Africa at Estadio Banorte").
    - IF NOT ATTENDING: take advantage of the local attention being on the
      stadium to visit normally crowded attractions (museums, viewpoints)
      with shorter lines during the match window.`;
    }

    return `

  COPA MUNDIAL 2026 (importante — el viaje cae en sede mundialista):
  Hay ${matches.length} partido${matches.length === 1 ? "" : "s"} confirmado${matches.length === 1 ? "" : "s"} en ${matches[0].cityDisplay} durante la estancia:
${lines}

  Aplica este contexto al armar el itinerario:
    - HOSPEDAJE: la demanda y el precio son ALTOS en fechas de partido. Si el
      viajero NO va al estadio, sugiere reservar con anticipación o barrios
      alejados del recinto. Si va, hospedaje cerca del transit al estadio.
    - TRANSPORTE: el día de partido hay surge alto en Uber/taxis y saturación
      de transporte público alrededor del estadio (3 h antes / 2 h después).
      Recomienda salir con margen o evitar la zona en esas ventanas.
    - GASTRONOMÍA: restaurantes cerca del estadio y en zonas turísticas se
      llenan antes/después del partido. Sugiere reservar mesa con anticipación
      o pivotar a barrios alternativos.
    - SI EL VIAJERO QUIERE IR AL PARTIDO: incluye el partido como un bloque
      "tour" en el día correspondiente. Bloquea ~4 h alrededor (2 h antes,
      2 h después) sin otros bookings, y describe el partido en el name del
      bloque (ej. "Partido: México vs Sudáfrica en Estadio Banorte").
    - SI NO VA AL PARTIDO: aprovecha que la atención local está en el estadio
      para visitar atracciones tradicionalmente concurridas (museos, miradores)
      con menos cola en la franja del partido.`;
  }

  // ── Multi-city segments ─────────────────────────────────────────────────────
  // When the trip carries a `segments` array (≥2 entries), the prompt switches
  // from single-destination mode to a structured chain. Each segment has its
  // own destination + dates + nights, and accommodations must be emitted one
  // per segment.

  interface TripSegment {
    destination: string;
    startDate:   string;
    endDate:     string;
    nights:      number;
    /** Optional explicit origin for this segment. Persisted by the form
     *  only when the user sets it to something other than the previous
     *  segment's destination (i.e. the chain-implicit value). */
    origin?:     string;
  }

  function isMultiCity(segments: unknown): segments is TripSegment[] {
    return Array.isArray(segments) && segments.length >= 2
      && segments.every(s => s && typeof s === "object"
        && typeof (s as TripSegment).destination === "string"
        && typeof (s as TripSegment).startDate   === "string"
        && typeof (s as TripSegment).endDate     === "string");
  }

  function buildSegmentsContext(segments: TripSegment[], locale: Locale): string {
    if (!segments || segments.length < 2) return "";
    let dayCursor = 1;
    const dayMap: string[] = [];
    const isEN = locale === "en";
    const dayWord = isEN ? "Day" : "Día";
    const daysWord = isEN ? "Days" : "Días";
    const chain = segments.map((s, i) => {
      const where = s.origin
        ? (isEN ? `from ${s.origin} to ${s.destination}` : `de ${s.origin} a ${s.destination}`)
        : s.destination;
      const dayCount = Math.max(1, s.nights || 0);
      const dayStart = dayCursor;
      const dayEnd   = dayCursor + dayCount - 1;
      dayMap.push(dayCount === 1
        ? `      • ${dayWord} ${dayStart} → ${s.destination}`
        : `      • ${daysWord} ${dayStart}–${dayEnd} → ${s.destination}`);
      dayCursor = dayEnd + 1;
      const nightsWord = isEN
        ? (s.nights === 1 ? "night" : "nights")
        : (s.nights === 1 ? "noche" : "noches");
      return `      ${i + 1}) ${where} · ${s.startDate} → ${s.endDate} (${s.nights} ${nightsWord})`;
    }).join("\n");

    if (isEN) {
      return `

  MULTI-CITY (CRITICAL — the trip covers ${segments.length} cities, NOT one):
${chain}

  DAY → CITY MAPPING (use exactly; each day of the itinerary belongs to ONE city):
${dayMap.join("\n")}

  Apply this context when building the itinerary:
    - MULTIPLE CITIES: the itinerary MUST cover all ${segments.length} cities in the
      order shown. Do NOT concentrate all days in a single city.
    - DAY → CITY: each "day" block belongs to the city indicated in the mapping
      above. Restaurants, tours, and neighborhoods must be real and located IN
      that city (don't invent or mix).
    - TRANSITION DAYS: the last day of each segment (except the final one) includes
      transit to the next city as a "transfer" block early + 1-2 optional blocks
      after arrival. No long tours or formal late dinners on transition days.
    - LODGING PER SEGMENT: you MUST emit one entry in "accommodations" PER segment
      (${segments.length} total). See the LODGING BY SEGMENT block.
    - DAY TITLE: include the city in the day's day_label or title (e.g. "Day 4 ·
      Stockholm — first walk") so the user can clearly see where they are.
    - REPEATS: if a city appears more than once (base → side trip → base), the
      second stay should offer different activities. Don't repeat attractions
      or restaurants.`;
    }

    return `

  MULTI-CIUDAD (CRÍTICO — el viaje recorre ${segments.length} ciudades, NO una sola):
${chain}

  MAPEO DÍA → CIUDAD (úsalo exacto; cada día del itinerario pertenece a UNA ciudad):
${dayMap.join("\n")}

  Aplica este contexto al armar el itinerario:
    - CIUDADES MÚLTIPLES: el itinerario DEBE cubrir las ${segments.length} ciudades en el
      orden mostrado. NO concentres todos los días en una sola ciudad.
    - DÍA → CIUDAD: cada bloque "day" pertenece a la ciudad indicada en el mapeo
      de arriba. Restaurantes, tours y barrios deben ser reales y ubicados EN esa
      ciudad (no inventar ni mezclar).
    - DÍAS DE TRANSICIÓN: el último día de cada tramo (excepto el final) incluye
      el traslado a la siguiente ciudad como un bloque "transfer" temprano + 1-2
      bloques opcionales al llegar al destino. Sin tours largos ni cenas formales
      tarde el día de transición.
    - HOSPEDAJE POR TRAMO: DEBES emitir una entrada en "accommodations" POR CADA
      tramo (${segments.length} en total). Ver bloque ALOJAMIENTO POR TRAMO.
    - TÍTULO DEL DÍA: incluye la ciudad en day_label o title del día (ej. "Día 4 ·
      Stockholm — primer paseo") para que el usuario vea claramente dónde está.
    - REPETICIONES: si una ciudad aparece más de una vez (base → escapada → base),
      la segunda estancia debe ofrecer actividades distintas a la primera. No
      repitas atracciones ni restaurantes.`;
  }

  // ── Jet-lag context ─────────────────────────────────────────────────────────
  // Coarse "is this a long-haul flight from Mexico-base?" lookup. The Edge Fn
  // serves a primarily Latin-American audience, so the heuristic assumes
  // Americas-origin; trans-continental destinations get a relaxed-arrival
  // prompt block. Future refinement: factor in true origin continent.

  const LONG_HAUL_HINTS = [
    // Europe
    "paris", "parís", "london", "londres", "madrid", "barcelona", "rome", "roma",
    "amsterdam", "berlin", "berlín", "lisbon", "lisboa", "milan", "milán",
    "vienna", "viena", "prague", "praga", "athens", "atenas", "porto", "oporto",
    "francia", "france", "italia", "italy", "españa", "spain", "alemania", "germany",
    "portugal", "grecia", "greece", "reino unido", "united kingdom",
    // Asia
    "tokyo", "tokio", "kyoto", "osaka", "seoul", "seúl", "beijing", "pekín",
    "shanghai", "shanghái", "bangkok", "singapore", "singapur", "hong kong",
    "taipei", "bali", "dubai", "estambul", "istanbul",
    "japon", "japón", "japan", "china", "tailandia", "thailand", "india",
    "turquía", "turkey", "vietnam", "indonesia",
    // Oceania
    "sydney", "melbourne", "auckland", "wellington",
    "australia", "nueva zelanda", "new zealand",
    // Africa
    "cape town", "ciudad del cabo", "el cairo", "cairo", "marrakech", "casablanca",
    "sudáfrica", "south africa", "marruecos", "morocco", "egipto", "egypt",
  ];

  function isLongHaul(destination: string): boolean {
    if (!destination) return false;
    const d = destination.toLowerCase();
    return LONG_HAUL_HINTS.some(h => d.includes(h));
  }

  function buildJetLagContext(destination: string, origin: string, locale: Locale): string {
    if (!isLongHaul(destination)) return "";
    const defaultOrigin = locale === "en" ? "the Americas" : "México";
    const originLabel = origin && origin.trim() ? origin.trim() : defaultOrigin;
    if (locale === "en") {
      return `

  LONG-HAUL FLIGHT (important):
  The destination implies a long-haul flight from ${originLabel}. Soften
  arrival day to accommodate jet lag:
    - Day 1: at most 3-4 blocks, mostly flexible ("light neighborhood
      stroll", "lunch near the hotel"). Avoid long tours, extensive museums,
      or activities that require high energy or strict-time reservations.
    - Day 1 dinner: reasonable hour (ideally 7:30-8:30 pm), restaurant
      within 15 min of the hotel, calm atmosphere.
    - Day 2: can return to normal intensity.
    - Return day: if the flight is in the afternoon/evening, also lighter
      intensity — leave 4-5 h free before the airport check-out.`;
    }
    return `

  VUELO LARGO (importante):
  El destino implica un vuelo de larga distancia desde ${originLabel}. Suaviza
  el día de llegada para acomodar jet-lag:
    - Día 1: máximo 3-4 bloques, mayormente flexibles ("paseo ligero por el
      barrio", "comida cercana al hotel"). Evita tours largos, museos extensos
      o actividades que requieran energía alta o reservas con hora estricta.
    - Cena del día 1: hora razonable (idealmente 19:30-20:30), restaurante a
      ≤15 minutos del hotel, ambiente tranquilo.
    - Día 2: ya puede tener intensidad normal.
    - Día de regreso: si el vuelo es por la tarde/noche, también de menor
      intensidad — deja 4-5 h libres antes del check-out al aeropuerto.`;
  }

  function buildPrompt(input: any): string {
    const locale: Locale = input.locale === "en" ? "en" : "es";
    const isEN = locale === "en";
    const d = input.duration_days as number;
    const interests = (input.interests || []).join(", ") || (isEN ? "(no preferences)" : "(sin preferencias)");

    // Deterministic lodging context — computed in the calling layer
    // (Next /api/generate-trip) from start/end dates and passed through
    // so the model never invents nights.
    const nights    = typeof input.nights    === "number" ? input.nights    : Math.max(0, d - 1);
    const overnight = typeof input.overnight === "boolean" ? input.overnight : nights >= 1;
    const start     = typeof input.start === "string" ? input.start : "";
    const end       = typeof input.end   === "string" ? input.end   : "";

    // When the previous attempt produced bad output, the calling
    // layer sends a retryHint describing what failed. The retry prompt
    // is tighter — explicit rejection of the prior output shape +
    // diagnosis of what was wrong, so the model has a meaningful chance
    // of doing better on the second pass.
    const isRetryNoAccommodations = input.retryHint === "no_accommodations_emitted";
    const isRetryNoDays           = input.retryHint === "no_days_emitted";
    const isRetry                 = isRetryNoAccommodations || isRetryNoDays;

    // Multi-city: one accommodation REQUIRED per segment. Single-city falls
    // back to the original "at least 1 entry covering all nights" contract.
    const multiCity = isMultiCity(input.segments) ? input.segments as TripSegment[] : null;

    const accommodationsBlock = overnight
      ? multiCity
        ? (isEN ? `
  LODGING BY SEGMENT (REQUIRED):
  This trip has ${multiCity.length} segments. You MUST return "accommodations" with ONE entry
  PER segment (${multiCity.length} total), in the same order as the segments:
${multiCity.map((s, i) => `    Segment ${i + 1}:
      - city:         "${s.destination}"        ← use this exact value
      - checkInDate:  "${s.startDate}"          ← use this exact value
      - checkOutDate: "${s.endDate}"            ← use this exact value
      - nights:       ${s.nights}`).join("\n")}
  Each entry must also include:
    - neighborhood: specific area within that city
    - accommodationType: "hotel" | "boutique" | "hostel" | "apartment" | "resort" | "cabin" | "glamping"
    - rationale: one sentence explaining why it fits the segment and style
    - priceTier: "budget" | "mid" | "upscale" | "luxury"
    - familyFriendly: true | false` : `
  ALOJAMIENTO POR TRAMO (OBLIGATORIO):
  Este viaje tiene ${multiCity.length} tramos. DEBES devolver "accommodations" con UNA entrada
  POR CADA tramo (${multiCity.length} en total), en el mismo orden que los tramos:
${multiCity.map((s, i) => `    Tramo ${i + 1}:
      - city:         "${s.destination}"        ← usa esto exacto
      - checkInDate:  "${s.startDate}"          ← usa esto exacto
      - checkOutDate: "${s.endDate}"            ← usa esto exacto
      - nights:       ${s.nights}`).join("\n")}
  Cada entrada debe incluir además:
    - neighborhood: zona concreta dentro de esa ciudad
    - accommodationType: "hotel" | "boutique" | "hostel" | "apartment" | "resort" | "cabin" | "glamping"
    - rationale: 1 oración explicando por qué encaja con el tramo y el estilo
    - priceTier: "budget" | "mid" | "upscale" | "luxury"
    - familyFriendly: true | false`)
        : (isEN ? `
  LODGING (REQUIRED):
  This trip includes ${nights} night(s). You MUST return "accommodations" with at least 1 entry
  covering ALL nights (from ${start} to ${end}). Each entry:
    - city: "${input.destination}"                ← use this exact value
    - checkInDate: "${start}"                     ← use this exact value
    - checkOutDate: "${end}"                      ← use this exact value
    - nights: ${nights}
    - neighborhood: specific area (e.g. "Old Town", "Marais")
    - accommodationType: "hotel" | "boutique" | "hostel" | "apartment" | "resort" | "cabin" | "glamping"
    - rationale: one sentence explaining why it fits this itinerary and style
    - priceTier: "budget" | "mid" | "upscale" | "luxury"
    - familyFriendly: true | false` : `
  ALOJAMIENTO (OBLIGATORIO):
  Este viaje incluye ${nights} noche(s). DEBES devolver "accommodations" con al menos 1 entrada
  que cubra TODAS las noches (del ${start} al ${end}). Cada entrada:
    - city: "${input.destination}"                ← usa esto exacto
    - checkInDate: "${start}"                     ← usa esto exacto
    - checkOutDate: "${end}"                      ← usa esto exacto
    - nights: ${nights}
    - neighborhood: zona concreta (ej. "Roma Norte", "Coyoacán")
    - accommodationType: "hotel" | "boutique" | "hostel" | "apartment" | "resort" | "cabin" | "glamping"
    - rationale: 1 oración explicando por qué encaja con este itinerario y estilo
    - priceTier: "budget" | "mid" | "upscale" | "luxury"
    - familyFriendly: true | false`)
      : (isEN ? `
  LODGING:
  This is a single-day trip. Return "accommodations": [] (empty array).` : `
  ALOJAMIENTO:
  Este viaje es de un solo día. Devuelve "accommodations": [] (arreglo vacío).`);

    const retryNote = isRetryNoDays
      ? (isEN ? `
  IMPORTANT: The previous generation returned an empty "days" array and was rejected.
  You MUST return exactly ${d} day(s) in the "days" array, each with 4-7 blocks.
  Don't omit the array. Don't leave it empty. Generate real content for each day.
  ` : `
  IMPORTANTE: La generación anterior devolvió un arreglo "days" vacío y fue rechazada.
  DEBES devolver exactamente ${d} día(s) en el arreglo "days", cada uno con 4-7 bloques.
  No omitas el arreglo. No lo dejes vacío. Genera contenido real para cada día.
  `)
      : isRetryNoAccommodations
      ? (isEN ? `
  IMPORTANT: The previous generation did NOT include lodging and was rejected.
  Make sure the "accommodations" array is complete per the rules below.
  ` : `
  IMPORTANTE: La generación anterior NO incluyó alojamiento y fue rechazada.
  Asegúrate de que el arreglo "accommodations" esté completo según las reglas siguientes.
  `)
      : "";

    // Phase 3 — family composition awareness. If traveler_details ships
    // children data, surface it explicitly in the prompt + add a soft
    // guidance block so the AI deliberately adapts venue / pacing / food
    // choices to the family. Kept short on purpose — the user warned us
    // not to overcorrect into "family spam".
    const td = input.traveler_details
    const isFamily   = input.travelers === "familia" && td && Array.isArray(td.children) && td.children.length > 0
    const familyLine = isFamily
      ? (isEN
          ? `\n  - Family composition: ${td.adults ?? 2} adult(s) + ${td.children.length} child(ren) [${td.children.map((c: any) => c?.age ?? "?").join(", ")}]`
          : `\n  - Composición familiar: ${td.adults ?? 2} adulto(s) + ${td.children.length} niño(s) [${td.children.map((c: any) => c?.age ?? "?").join(", ")}]`)
      : "";
    const familyGuidance = isFamily
      ? (isEN ? `

  FAMILY TRIP (important):
  The group includes children. Adapt the itinerary thoughtfully — without overcorrecting
  — so it works for everyone:
    - Restaurants: prioritize kid-friendly options (kids menu, roomy space, not too
      formal at dinner). Keep variety for the adults.
    - Hotels: prioritize family options (connecting rooms, pool, kids' kit).
    - Activities: include 1-2 blocks per day that kids can enjoy (parks, interactive
      experiences, museums with a kids' section). Avoid attractions with obvious age
      restrictions.
    - Pacing: leave room for mid-afternoon rest. Don't push 7 blocks on a day with
      small children — 4-5 is better.
    - Don't make the trip exclusively for kids. It's still a trip for everyone.` : `

  VIAJE FAMILIAR (importante):
  El grupo incluye niños. Adapta el itinerario con criterio — sin exagerar — para que funcione
  para todos:
    - Restaurantes: prioriza opciones kid-friendly (menú infantil, espacios amplios, sin
      ambiente demasiado formal a la cena). Mantén variedad para los adultos.
    - Hoteles: prioriza opciones familiares (cuartos comunicantes, alberca, kit infantil).
    - Actividades: incluye 1-2 bloques por día que niños puedan disfrutar (parques,
      experiencias interactivas, museos con sección infantil). Evita atracciones con
      restricciones de edad evidentes.
    - Pacing: deja espacio para descansos a media tarde. No empujes 7 bloques en un día con
      niños pequeños — 4-5 es mejor.
    - No hagas el viaje exclusivamente para niños. Sigue siendo un viaje para todos.`)
      : "";

    // Temporal context — derived once per prompt, surfaces in the data block.
    const seasonLine    = buildSeasonLine(start, input.destination, locale);
    const weekdaysLine  = buildDayOfWeekLine(start, d, locale);

    // WC 2026 context — only fires when destination is a host city AND the
    // trip window overlaps at least one real match. Empty for non-WC trips.
    const wcContext     = buildWcContext(input.destination, start, end, locale);

    // Multi-city — fires only when input.segments has ≥2 contiguous entries.
    // Empty for single-city trips (the default).
    const segmentsContext = multiCity ? buildSegmentsContext(multiCity, locale) : "";

    // Jet-lag — fires only when destination is on the long-haul hint list
    // (Europe / Asia / Oceania / Africa). Origin is surfaced in the prompt
    // so the AI knows where the relaxed Day 1 is coming from.
    const jetLagContext   = buildJetLagContext(input.destination, input.origin, locale);

    // Layered temporal guidance — fires when we have a real start date.
    // Kept short on purpose; AI is smart enough to act on the structured
    // signal without a wall of instructions.
    const temporalGuidance = start
      ? (isEN ? `

  TEMPORAL CONTEXT (important):
  Apply the season and the days of the week when building the itinerary:
    - Season: prioritize weather-appropriate activities (indoor spaces and
      hot drinks in winter, shade and early starts in summer, layers in
      transition seasons). Reflect appropriate clothing in the packing list.
    - Days of the week: respect typical closures. Many museums close on
      Mondays (especially in Europe); traditional markets are usually
      Saturday or Sunday; banks closed Sunday; some restaurants take a day
      off (Monday or Tuesday is common). Assign each block to the actual
      weekday it falls on.` : `

  CONTEXTO TEMPORAL (importante):
  Aplica la estación y los días de la semana al armar el itinerario:
    - Estación: prioriza actividades apropiadas para el clima (interiores y
      bebidas calientes en invierno, sombra y horarios tempranos en verano,
      capas ligeras en transición). Refleja la ropa adecuada en el packing.
    - Días de la semana: respeta cierres habituales. Muchos museos cierran
      lunes (especialmente en Europa); mercados tradicionales suelen ser
      sábado o domingo; bancos cerrados domingo; algunos restaurantes
      tienen día de descanso (lunes o martes es lo común). Asigna cada
      bloque al día concreto que le toca.`)
      : "";

    // Destination line — multi-city case shows the chain summary so the AI
    // doesn't anchor the whole plan to a single city.
    const destinationLine = multiCity
      ? (isEN
          ? `- Destination: multi-city chain (${multiCity.map(s => s.destination).join(" → ")})`
          : `- Destino: cadena multi-ciudad (${multiCity.map(s => s.destination).join(" → ")})`)
      : (isEN
          ? `- Destination: ${input.destination}`
          : `- Destino: ${input.destination}`);

    if (isEN) {
      const dataLabels = {
        from:      `- From: ${input.origin ?? "(unspecified)"}`,
        duration:  `- Duration: ${d} days${overnight ? ` (${nights} night(s))` : " (no overnight)"}`,
        dates:     `- Dates: ${start || "(unspecified)"} → ${end || "(unspecified)"}`,
        travelers: `- Travelers: ${input.travelers} person(s)`,
        style:     `- Style: ${input.travel_style}`,
        budget:    `- Budget: ${input.budget_level}`,
        interests: `- Interests: ${interests}`,
      };
      const closing = multiCity
        ? `Use real places, restaurants, and routes in each city of the trip (${multiCity.map(s => s.destination).join(" → ")}), following the DAY → CITY MAPPING above. Do NOT concentrate all days in a single city.`
        : `Use real places, restaurants, and routes from ${input.destination}.`;
      return `Generate a travel itinerary with this data:
  ${dataLabels.from}
  ${destinationLine}
  ${dataLabels.duration}
  ${dataLabels.dates}${seasonLine}${weekdaysLine}
  ${dataLabels.travelers}${familyLine}
  ${dataLabels.style}
  ${dataLabels.budget}
  ${dataLabels.interests}
  ${retryNote}${accommodationsBlock}${segmentsContext}${jetLagContext}${familyGuidance}${temporalGuidance}${wcContext}

  BLOCK TYPES (CRITICAL):
  Every block MUST have an exact \`type\` from the enum. Use it deliberately:
    - "hotel"      → check-in, check-out, hotel arrival/departure, in-hotel rest.
    - "restaurant" → any bookable meal: breakfast, lunch, dinner, brunch at a specific
                     restaurant / bistro / café / bakery / market stall / steakhouse /
                     seafood place.
    - "tour"       → attractions, museums, guided tours, experiences, classes,
                     excursions, theme parks, scheduled activities.
    - "transfer"   → flights, airport transfers, taxis, Ubers, buses, trains, ferries,
                     metro, car rentals, shuttles, transport between points.
    - "culture"    → cultural exploration without booking (wandering a neighborhood,
                     plazas, markets as a stroll, viewpoints, exterior of historic
                     buildings).
    - "nature"     → nature exploration without booking (beach, parks, short trails,
                     scenic viewing).
    - "free"       → unstructured free / optional / rest time.

  Key rule: if the block is a meal at a specific place, type MUST be "restaurant",
  NEVER "free", "culture", or "nature". The user must be able to book a table from
  that block.

  Call the emit_trip tool with the complete itinerary. ${closing} Include exactly ${d} day(s). Each day must have 4-7 blocks.`;
    }

    return `Genera un itinerario de viaje con estos datos:
  - Origen: ${input.origin ?? "(no especificado)"}
  ${destinationLine}
  - Duración: ${d} días${overnight ? ` (${nights} noche(s))` : " (sin pernocta)"}
  - Fechas: ${start || "(no especificadas)"} → ${end || "(no especificadas)"}${seasonLine}${weekdaysLine}
  - Viajeros: ${input.travelers} persona(s)${familyLine}
  - Estilo: ${input.travel_style}
  - Presupuesto: ${input.budget_level}
  - Intereses: ${interests}
  ${retryNote}${accommodationsBlock}${segmentsContext}${jetLagContext}${familyGuidance}${temporalGuidance}${wcContext}

  TIPOS DE BLOQUE (CRÍTICO):
  Cada bloque DEBE tener un \`type\` exacto del enum. Úsalo intencionalmente:
    - "hotel"      → check-in, check-out, llegada/salida del hotel, descanso en alojamiento.
    - "restaurant" → cualquier comida bookeable: desayuno, almuerzo, comida, cena, brunch
                     en un restaurante / fonda / taquería / marisquería / parrilla /
                     café / panadería / bistró específico.
    - "tour"       → atracciones, museos, recorridos guiados, experiencias, clases,
                     excursiones, parques temáticos, actividades programadas.
    - "transfer"   → vuelos, traslados al/del aeropuerto, taxis, Uber, autobús, tren,
                     ferry, metro, renta de auto, shuttle, transporte entre puntos.
    - "culture"    → exploración cultural sin booking (callejear por un barrio, plazas,
                     mercados como paseo, miradores, edificios históricos en exterior).
    - "nature"     → exploración natural sin booking (playa, parques, senderos cortos,
                     observación de paisaje).
    - "free"       → tiempo libre / opcional / descanso sin estructura específica.

  Regla clave: si el bloque es una comida en un lugar concreto, type DEBE ser "restaurant",
  NUNCA "free", "culture" o "nature". El usuario debe poder reservar mesa desde ese bloque.

  Llama a la herramienta emit_trip con el itinerario completo. ${multiCity
    ? `Usa lugares, restaurantes y rutas reales en cada ciudad del recorrido (${multiCity.map(s => s.destination).join(" → ")}), respetando el MAPEO DÍA → CIUDAD de arriba. NO concentres todos los días en una sola ciudad.`
    : `Usa lugares, restaurantes y rutas reales de ${input.destination}.`} Incluye exactamente ${d} día(s). Cada día debe tener entre 4 y 7 bloques.`;
  }                                                                                                            
                                                                                                                 
  serve(async (req) => {          
    if (req.method === "OPTIONS") {                                                                              
      return new Response(null, { headers: corsHeaders });  
    }                                                                                                          
                                                                                                                 
    if (req.method !== "POST") {  
      return errorResponse(405, "method_not_allowed", "Only POST is supported");                                 
    }                                                       
                                                                                                               
    const startedAt = Date.now();                                                                                
                                                                                                               
    try {                                                                                                        
      if (!ANTHROPIC_API_KEY) {                             
        console.error("[generate-trip] ANTHROPIC_API_KEY missing");                                              
        return errorResponse(503, "config_missing", "Anthropic API key not configured");
      }                                                                                                        
                                                                                                                 
      let body: any;              
      try {                                                                                                      
        body = await req.json();                            
      } catch {                                                                                                
        return errorResponse(400, "invalid_body", "Request body is not valid JSON");                             
      }                           
                                                                                                                 
      if (!body?.destination) {                                                                                
        return errorResponse(400, "missing_destination", "destination is required");                             
      }                           
                                                                                                                 
      const rawDays = Number(body.duration_days ?? body.nights ?? 5);                                            
      const duration_days = Math.min(Math.max(rawDays || 5, 1), 30);                                           
                                                                                                                 
      // Nights / overnight are deterministic — computed by the calling
      // layer (Next /api/generate-trip) from the date range. The Edge
      // Function only re-derives them if the caller didn't provide them
      // (e.g. direct invocations from tests or legacy clients).
      const nights = typeof body.nights === "number"
        ? body.nights
        : Math.max(0, duration_days - 1);
      const overnight = typeof body.overnight === "boolean"
        ? body.overnight
        : nights >= 1;

      // Locale: 'es' (default) | 'en'. Picks the SYSTEM_PROMPT + every
      // helper's locale-aware branch so an EN-locale client gets an
      // English itinerary, ES gets Spanish. Default 'es' preserves the
      // legacy behavior for any caller that doesn't send the field.
      const locale: Locale = body.locale === "en" ? "en" : "es";

      const input = {
        ...body,
        duration_days,
        nights,
        overnight,
        locale,
        start:        typeof body.start === "string" ? body.start : "",
        end:          typeof body.end   === "string" ? body.end   : "",
        travelers:    body.travelers    ?? 2,
        travel_style: body.travel_style ?? body.pace   ?? "cultural",
        budget_level: body.budget_level ?? body.budget ?? "medium",
        retryHint:    typeof body.retryHint === "string" ? body.retryHint : undefined,
      };

      const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type":      "application/json",
          "x-api-key":         ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 16000,
          system: systemPromptFor(locale),
          tools: [{
            name: "emit_trip",
            description: locale === "en"
              ? "Emit the structured travel itinerary."
              : "Emite el itinerario de viaje estructurado.",
            input_schema: TRIP_SCHEMA,
          }],
          tool_choice: { type: "tool", name: "emit_trip" },
          messages: [{ role: "user", content: buildPrompt(input) }],
        }),
      });
                                  
      const ms = Date.now() - startedAt;                                                                         
                                                                                                               
      if (!claudeRes.ok) {                                                                                       
        const errText = await claudeRes.text().catch(() => "");
        console.error("[generate-trip] claude upstream", claudeRes.status, errText.slice(0, 500));               
        return errorResponse(502, "claude_upstream_failed", `Claude API returned ${claudeRes.status}`, {       
          status: claudeRes.status,                                                                              
          body: errText.slice(0, 500),                                                                           
        });                                                                                                      
      }                                                                                                          
                                                                                                                 
      const claudeData = await claudeRes.json();            
                                                                                                               
      console.log("[generate-trip]", JSON.stringify({                                                            
        stop_reason:   claudeData.stop_reason,
        input_tokens:  claudeData.usage?.input_tokens,                                                           
        output_tokens: claudeData.usage?.output_tokens,                                                        
        ms,                                                                                                      
      }));                                                                                                     
                                                                                                                 
      if (claudeData.stop_reason === "max_tokens") {        
        return errorResponse(502, "llm_truncated", `La respuesta del modelo excedió el límite de tokens. Reduce  
  la duración o los intereses e intenta de nuevo.`, {       
          output_tokens: claudeData.usage?.output_tokens,                                                      
        });                                                                                                      
      }                                                                                                        
                                                                                                                 
      const toolUse = Array.isArray(claudeData.content)     
        ? claudeData.content.find((c: any) => c?.type === "tool_use" && c?.name === "emit_trip")                 
        : null;                                             
                                                                                                               
      if (!toolUse?.input) {                                                                                     
        console.error("[generate-trip] no tool_use in response", JSON.stringify(claudeData).slice(0, 500));    
        return errorResponse(502, "llm_no_tool_use", "El modelo no emitió la estructura esperada", {             
          stop_reason: claudeData.stop_reason,                                                                 
        });                                                                                                      
      }                                                                                                          
                                                                                                                 
      return new Response(                                                                                       
        JSON.stringify({ success: true, trip_data: toolUse.input }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );                                                                                                       
                                                                                                                 
    } catch (err) {                                                                                              
      const message = err instanceof Error ? err.message : String(err);                                          
      console.error("[generate-trip] unhandled", message);                                                       
      return errorResponse(500, "internal", `Internal error: ${message}`);                                     
    }                                                                                                            
  });