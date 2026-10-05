// supabase/functions/generate-trip/prompt.ts
//
// Pure prompt-building logic: system prompts, tool schemas, and every
// buildXxx() helper that assembles the user-turn prompt text. Extracted
// from index.ts (2026-09-28, HTTP-extraction refactor) so
// generate-trip-worker/index.ts can call Anthropic directly for
// single-city day chunks and front-matter -- the same prompt this file
// builds today via an HTTP round-trip through generate-trip's own
// serve() handler, just called from a different process. No Deno-HTTP
// dependency, no fetch, no side effects -- pure string/schema assembly,
// same spirit as logic.ts alongside it.
//
// generate-trip/index.ts still imports from here too, for its own
// unchanged paths (multi-city sub-chunks, the sync whole-trip call, and
// the front-matter/lean single-city calls when they DO arrive over HTTP
// -- e.g. a direct API caller during local dev). Both callers get the
// exact same prompt for the exact same input; this file is the only
// place that assembly happens now.

import { WC_2026_CALENDAR, WC_HOST_CITY_HINTS, type WcMatch } from "./wc-2026-calendar.ts";
import { isFamilyTraveler, computeHeadcount } from "./logic.ts";

  export type Locale = "es" | "en";

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

  REGLA DE PRESUPUESTO ("budget_breakdown"):
  Cada rango de "budget_breakdown" (accommodation, food, activities, transport) es para
  TODO el grupo de viajeros indicado en "Viajeros", no por persona — si el input dice
  "3 adulto(s) + 1 niño(s)", el rango cubre a las 4 personas juntas, no a una. Usa precios
  reales y típicos del destino y la temporada, no una plantilla genérica. Da un rango
  angosto y realista (ej. "$1,800 - $2,200"), no inflado "por seguridad" — el objetivo es
  que el techo del rango sea un estimado honesto, no un colchón amplio.

  CAMPO "neighborhood" EN CADA BLOQUE (importante):
  Para cada bloque del itinerario, incluye el campo opcional "neighborhood"
  con el nombre del barrio o zona local en minúsculas y sin acentos
  (por ejemplo: "polanco", "coyoacan", "centro historico", "trastevere",
  "ipanema"). Este campo alimenta el cálculo de distancias internas
  (caminar vs traslado entre actividades, cercanía hotel-actividades).
  Si el bloque no tiene una ubicación clara (ej. "tarde libre"), omite
  el campo en lugar de inventar. Usa el mismo barrio cuando varias
  actividades están en la misma zona — la consistencia importa más que
  la precisión absoluta.

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

  BUDGET RULE ("budget_breakdown"):
  Every "budget_breakdown" range (accommodation, food, activities, transport) is for the
  WHOLE group listed under "Travelers", not per person — if the input says "3 adult(s) +
  1 child(ren)", the range covers all 4 people together, not one. Use real, typical prices
  for the destination and season, not a generic template. Give a narrow, realistic range
  (e.g. "$1,800 - $2,200"), not padded "for safety" — the top of the range should be an
  honest estimate, not a wide cushion.

  "neighborhood" FIELD ON EACH BLOCK (important):
  For each itinerary block, include the optional "neighborhood" field with
  the local neighborhood or area name in lowercase, without accents
  (e.g. "polanco", "coyoacan", "centro historico", "trastevere",
  "ipanema"). This field feeds internal distance calculations (walking
  vs transit between activities, hotel-to-activity proximity). If a
  block has no clear location (e.g. "free afternoon"), omit the field
  rather than inventing one. Use the same neighborhood when several
  activities are in the same area — consistency matters more than
  absolute precision.

  When the user asks for an itinerary, call the emit_trip tool with the complete data.
  Don't reply with text, only with the tool call.

  IMPORTANT: Write ALL itinerary content (titles, day_label, objective, block titles,
  block descriptions, neighborhoods, rationales) in English.`;

  export const systemPromptFor = (locale: Locale) =>
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

  export const TRIP_SCHEMA = {
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
              // maxItems 6 (was unbounded, prompt-only "4-7") and
              // description maxLength 320 (was unbounded) -- added
              // 2026-09-28. Wall clock is the slowest of up to 8 concurrent
              // per-day calls, and it's driven almost linearly by output
              // length (confirmed via generation_metrics: 1156 output
              // tokens -> 24.6s, 1578 -> 33.8s). A real trip already
              // sampled ran 6 blocks/day at 254-608 chars/description
              // (avg 424) -- these caps pull that down without cutting a
              // day to a skeleton, and matter more for the LEAN schema
              // (single-city day chunks, up to 8 fired at once, wall clock
              // = the slowest of them) than the full schema, but both
              // reuse this same days/blocks definition so both get it.
              maxItems: 6,
              items: {
                type: "object",
                required: ["time", "title", "description", "type"],
                properties: {
                  time:        { type: "string" },
                  title:       { type: "string" },
                  description: { type: "string", maxLength: 320 },
                  type:        { type: "string", enum: ["hotel", "restaurant", "tour", "transfer", "culture", "nature", "free"] },
                  // Optional neighborhood / area name for the Intelligence
                  // Foundation engine (lib/intelligence.ts inferCoords).
                  // Lowercased local neighborhood label — e.g. "polanco",
                  // "trastevere", "ipanema". Powers per-day walking +
                  // hotel-fit estimates without external geocoding APIs.
                  neighborhood: { type: "string" },
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

  // Lean schema for single-city day chunks beyond the first (worker's
  // generateDayChunk. EVERY single-city day chunk uses this now (front-
  // matter was originally bundled into chunk 0, using the full TRIP_SCHEMA
  // there — but chunk 0 was consistently the slowest call because of that
  // extra front-matter weight, so it's been split into its own concurrent
  // unit, see TRIP_SCHEMA_FRONTMATTER_ONLY below and generateFrontmatter in
  // the worker). Reuses the exact same `days` item schema as TRIP_SCHEMA
  // so downstream parsing (normalizeTripData, chunkDays) doesn't need to
  // know which was used.
  export const TRIP_SCHEMA_DAYS_ONLY = {
    type: "object",
    required: ["days"],
    properties: {
      days: TRIP_SCHEMA.properties.days,
    },
  };

  // Front-matter-only schema — the inverse of TRIP_SCHEMA_DAYS_ONLY. Fired
  // as its own concurrent call (worker's generateFrontmatter/FRONTMATTER_UNIT)
  // alongside the day writers, instead of serialized ahead of them as part
  // of chunk 0. Reuses the exact same field schemas as TRIP_SCHEMA for each
  // of these properties so downstream parsing doesn't need to know which
  // schema produced a given field.
  export const TRIP_SCHEMA_FRONTMATTER_ONLY = {
    type: "object",
    required: ["title", "tagline", "hero_tags", "before_you_go", "budget_breakdown", "accommodations"],
    properties: {
      title:            TRIP_SCHEMA.properties.title,
      tagline:          TRIP_SCHEMA.properties.tagline,
      hero_tags:        TRIP_SCHEMA.properties.hero_tags,
      before_you_go:    TRIP_SCHEMA.properties.before_you_go,
      budget_breakdown: TRIP_SCHEMA.properties.budget_breakdown,
      accommodations:   TRIP_SCHEMA.properties.accommodations,
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

  function buildDayOfWeekLine(start: string, durationDays: number, locale: Locale, startDayLabel: number = 1): string {
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
      // startDayLabel: for a single-city day chunk (durationDays=1), `start`
      // is that chunk's own specific date, but the label must reflect its
      // real position in the trip (e.g. "Día 6"), not always "Día 1" — a
      // day-chunk calling this with durationDays=1 always hit i=0, so
      // without this the label was wrong on every day but the first.
      items.push(`${dayWord} ${startDayLabel + i} ${labels[d.getUTCDay()]}`);
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

  export interface TripSegment {
    destination: string;
    startDate:   string;
    endDate:     string;
    nights:      number;
    /** Optional explicit origin for this segment. Persisted by the form
     *  only when the user sets it to something other than the previous
     *  segment's destination (i.e. the chain-implicit value). */
    origin?:     string;
  }

  export function isMultiCity(segments: unknown): segments is TripSegment[] {
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

  // ── Chunk continuity ────────────────────────────────────────────────────────
  // When the async worker splits a long trip into chunks, each call to this
  // Edge Function only sees its own sub-range. Without the block below, the
  // AI treats every chunk as a standalone trip and re-emits an arrival on
  // day 1 + a departure on the last day — so the assembled itinerary reads
  // "arrive → farewell → arrive again → farewell" instead of a continuous
  // narrative. The fields are forwarded by generate-trip-worker on every
  // chunk; absent on direct sync invocations (no-op).
  function buildChunkContinuityBlock(input: any, locale: Locale): string {
    const segIdx     = typeof input.segment_index   === "number" ? input.segment_index   : null;
    const segTotal   = typeof input.total_segments  === "number" ? input.total_segments  : null;
    const dayOffset  = typeof input.trip_day_offset === "number" ? input.trip_day_offset : null;
    const tripTotal  = typeof input.trip_total_days === "number" ? input.trip_total_days : null;
    // Single-city day chunks (worker's DAYS_PER_CHUNK=1 pipeline) no longer
    // pass previous_day_summary — chunks run concurrently, out of order, so
    // there's no "previous" chunk to summarize. Anti-repetition/continuity
    // comes from the upfront skeleton pre-pass instead: daySkeleton is THIS
    // day's assigned theme/neighborhood/anchor/pace, fullSkeleton is every
    // other day's, so the model can avoid repeating neighborhoods/anchors
    // even though it never sees what those other days actually generated.
    const daySkeleton  = input.day_skeleton && typeof input.day_skeleton === "object" ? input.day_skeleton : null;
    const fullSkeleton = Array.isArray(input.full_skeleton) ? input.full_skeleton : [];
    if (segIdx === null || segTotal === null || segTotal <= 1) return "";

    const isEN    = locale === "en";
    const isFirst = segIdx === 0;
    const isLast  = segIdx === segTotal - 1;
    const startsAtDay = dayOffset !== null ? dayOffset + 1 : null;
    const endsAtDay   = dayOffset !== null ? dayOffset + (input.duration_days as number) : null;

    const rangeLine = (startsAtDay !== null && endsAtDay !== null && tripTotal !== null)
      ? (isEN
          ? `  Your chunk covers trip days ${startsAtDay}–${endsAtDay} of ${tripTotal}.`
          : `  Tu chunk cubre los días ${startsAtDay}–${endsAtDay} del viaje de ${tripTotal} días.`)
      : "";

    // Skeleton-derived continuity (replaces the old previous_day_summary
    // "prevLine"). Two lines: this day's own assigned anchor, and a compact
    // digest of every OTHER day's assignment so the model can avoid
    // repeating the same neighborhood/anchor — it can't see what those
    // other days actually generated (they may not even be generated yet,
    // running concurrently), only what they were ASSIGNED upfront.
    const thisDayLine = daySkeleton
      ? (isEN
          ? `  Your assigned plan for this day: theme "${daySkeleton.theme}", area "${daySkeleton.neighborhood}", anchor "${daySkeleton.anchor}", pace "${daySkeleton.pace}". Your BREAKFAST block MUST be at "${daySkeleton.key_breakfast}", your signature lunch/dinner MUST be at "${daySkeleton.key_restaurant}", and your key activity MUST be at "${daySkeleton.key_site}" — all three were assigned specifically to this day, across the whole trip at once, precisely so no other day uses them. Build the day around this; do not substitute a different place for any of these three, including breakfast.`
          : `  Tu plan asignado para este día: tema "${daySkeleton.theme}", zona "${daySkeleton.neighborhood}", ancla "${daySkeleton.anchor}", ritmo "${daySkeleton.pace}". Tu bloque de DESAYUNO DEBE ser en "${daySkeleton.key_breakfast}", tu comida/cena principal DEBE ser en "${daySkeleton.key_restaurant}", y tu actividad clave DEBE ser en "${daySkeleton.key_site}" — los tres se asignaron específicamente a este día, viendo todo el viaje a la vez, justo para que ningún otro día los use. Arma el día alrededor de esto; no sustituyas ninguno de los tres, incluyendo el desayuno.`)
      : "";

    const otherDaysList = fullSkeleton.filter((d: any) => !daySkeleton || d.day !== daySkeleton.day);
    const otherDaysDigest = otherDaysList
      .map((d: any) => isEN
        ? `Day ${d.day}: ${d.theme} in ${d.neighborhood} (${d.anchor})`
        : `Día ${d.day}: ${d.theme} en ${d.neighborhood} (${d.anchor})`)
      .join(" · ")
      .slice(0, 500);
    const otherDaysLine = otherDaysDigest
      ? (isEN
          ? `  Other days in this trip (avoid repeating the same neighborhood/anchor): ${otherDaysDigest}`
          : `  Otros días de este viaje (evita repetir la misma zona/ancla): ${otherDaysDigest}`)
      : "";

    // Explicit "already claimed" venue list, separate from the theme/anchor
    // digest above — this is the blocking one. Cross-day venue duplicates
    // (confirmed live 2026-09-25, twice: first pass fixed dinner/lunch
    // dupes via key_restaurant; second pass found the SAME pattern on
    // breakfast specifically, because key_restaurant never covered that
    // slot — every day has 2-3 restaurant blocks, only one was assigned).
    // key_restaurant/key_breakfast/key_site are all assigned once, upfront,
    // across the whole trip, so every OTHER day's venues are knowable in
    // advance — list them explicitly and forbid reuse, beyond just this
    // day's own three assigned venues.
    const usedVenues = Array.from(new Set(
      otherDaysList.flatMap((d: any) => [d.key_restaurant, d.key_breakfast, d.key_site]).filter(Boolean)
    ));
    const usedVenuesLine = usedVenues.length > 0
      ? (isEN
          ? `  VENUES ALREADY USED BY OTHER DAYS (do not use any of these for any block, at any time of day — pick a different real place instead): ${usedVenues.join(", ")}.`
          : `  LUGARES YA USADOS POR OTROS DÍAS (no uses ninguno de estos en ningún bloque, a ninguna hora — elige otro lugar real distinto): ${usedVenues.join(", ")}.`)
      : "";

    let intent = "";
    if (isFirst) {
      intent = isEN
        ? `  This is the FIRST chunk of a multi-chunk trip. You own the ARRIVAL on day 1 (jet-lag aware if relevant). Do NOT emit any farewell / departure narrative — that belongs to the LAST chunk only.`
        : `  Este es el PRIMER chunk de un viaje multi-chunk. Tú manejas la LLEGADA en el día 1 (con jet-lag si aplica). NO incluyas despedidas ni narrativa de salida — eso le toca SOLO al último chunk.`;
    } else if (isLast) {
      intent = isEN
        ? `  This is the LAST chunk of a multi-chunk trip. The traveler is already in the destination and continues from an earlier day — do NOT re-emit an arrival, hotel check-in, or "first day" framing. Day 1 of YOUR chunk is a continuation day. The FINAL day MAY include a departure / farewell narrative if a flight or transfer fits.`
        : `  Este es el ÚLTIMO chunk del viaje. El viajero ya está en el destino y continúa desde un día anterior — NO repitas llegada, check-in al hotel ni narrativa de "primer día". El día 1 de TU chunk es un día de continuación. El ÚLTIMO día PUEDE incluir despedida / traslado de salida si el vuelo o el transfer encaja.`;
    } else {
      intent = isEN
        ? `  This is a MIDDLE chunk (${segIdx + 1} of ${segTotal}). The traveler is mid-trip — do NOT emit arrival, hotel check-in, "first day" framing, departure, or farewell. Every day is a continuation. Follow your assigned plan above; vary neighborhoods and activity types from the other days listed so the trip doesn't feel repetitive.`
        : `  Este es un chunk INTERMEDIO (${segIdx + 1} de ${segTotal}). El viajero está a media estancia — NO incluyas llegada, check-in, "primer día", despedida ni salida. Cada día es continuación. Sigue tu plan asignado arriba; varía barrios y tipos de actividad respecto a los otros días listados para que el viaje no se sienta repetitivo.`;
    }

    // Anti-convergence on day-opening phrasing. Confirmed live 2026-09-25:
    // 5 of 7 days in one trip opened their first block with a generic
    // "Arranca/Empieza/Comienza el día" construction — independent
    // concurrent writers defaulting to the same safe opening pattern with
    // nothing telling them not to. You already know your own day number
    // (segIdx+1 above) — leading with it is explicit here so this doesn't
    // depend on the model inferring it from context elsewhere.
    const dayNumberForOpening = startsAtDay ?? (segIdx + 1);
    const openingLine = isEN
      ? `  This is day ${dayNumberForOpening} of the trip. Do NOT open the day's first block with a generic day-start construction ("Start the day...", "Begin day X with...", "Kick off..."). Lead with something specific instead: the venue name, the neighborhood, the dish, or the time — whatever fits the block naturally.`
      : `  Este es el día ${dayNumberForOpening} del viaje. NO abras el primer bloque del día con una construcción genérica de inicio de día ("Arranca el día...", "Empieza el día X con...", "Comienza la jornada..."). Arranca con algo específico en su lugar: el nombre del lugar, el barrio, el platillo, o la hora — lo que encaje naturalmente con el bloque.`;

    const header = isEN
      ? "CHUNK CONTINUITY (critical — this is part of a longer trip):"
      : "CONTINUIDAD DE CHUNK (crítico — esto es parte de un viaje más largo):";

    return `\n\n  ${header}\n${rangeLine ? rangeLine + "\n" : ""}${thisDayLine ? thisDayLine + "\n" : ""}${otherDaysLine ? otherDaysLine + "\n" : ""}${usedVenuesLine ? usedVenuesLine + "\n" : ""}${openingLine}\n${intent}`;
  }

  // computeHeadcount / isBudgetCurrencySuspect now live in ./logic.ts (pure,
  // no Deno deps) so tests/generate-trip-headcount-currency.test.ts can
  // import and exercise them directly without spinning up Deno or the
  // network.

  export function buildPrompt(input: any): string {
    const locale: Locale = input.locale === "en" ? "en" : "es";
    const isEN = locale === "en";
    const isFrontmatterOnly = input.frontmatter_only === true;
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

    // Suppress the accommodations block on non-first single-city chunks. The
    // worker's assembleResult() only keeps the first non-empty accommodation
    // block anyway (single-city dedupe), so asking later chunks to emit a
    // hotel for their sub-range just burns tokens and tempts the AI to weave
    // a check-in narrative into a continuation day.
    const segIdxNum    = typeof input.segment_index  === "number" ? input.segment_index  : null;
    const segTotalNum  = typeof input.total_segments === "number" ? input.total_segments : null;
    const isLaterChunk = segIdxNum !== null && segTotalNum !== null && segTotalNum > 1 && segIdxNum > 0;
    const skipAccommodationsForChunk = isLaterChunk && !multiCity;

    const accommodationsBlock = (overnight && !skipAccommodationsForChunk)
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

    // Phase 3 — family composition awareness. `isFamily` (headcount, always
    // surfaced when the traveler chip is "familia") is deliberately decoupled
    // from `hasChildren` (kid-specific guidance) — without this, a "familia"
    // trip with no children captured in the form sent the AI zero numeric
    // signal at all ("Viajeros: familia persona(s)"), which let group size —
    // and therefore the whole budget_breakdown — drift unanchored. Kept
    // short on purpose — the user warned us not to overcorrect into "family
    // spam".
    const td           = input.traveler_details
    const isFamily     = isFamilyTraveler(input)
    const familyAdults   = typeof td?.adults === "number" && td.adults > 0 ? td.adults : 2
    const familyChildren = Array.isArray(td?.children) ? td.children : []
    const hasChildren     = isFamily && familyChildren.length > 0
    // Real headcount for the "X person(s)" data line — `input.travelers` is
    // the party-type category ("solo"/"pareja"/"familia"/"amigos"), never a
    // number, so it can't be used directly there.
    const headcount = computeHeadcount(input)
    const familyLine = isFamily
      ? (isEN
          ? `\n  - Family composition: ${familyAdults} adult(s)${hasChildren ? ` + ${familyChildren.length} child(ren) [${familyChildren.map((c: any) => c?.age ?? "?").join(", ")}]` : ""}`
          : `\n  - Composición familiar: ${familyAdults} adulto(s)${hasChildren ? ` + ${familyChildren.length} niño(s) [${familyChildren.map((c: any) => c?.age ?? "?").join(", ")}]` : ""}`)
      : "";
    const familyGuidance = hasChildren
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
    const dayLabelOffset = typeof input.trip_day_offset === "number" ? input.trip_day_offset + 1 : 1;
    const weekdaysLine  = buildDayOfWeekLine(start, d, locale, dayLabelOffset);

    // WC 2026 context — only fires when destination is a host city AND the
    // trip window overlaps at least one real match. Empty for non-WC trips.
    const wcContext     = buildWcContext(input.destination, start, end, locale);

    // Multi-city — fires only when input.segments has ≥2 contiguous entries.
    // Empty for single-city trips (the default).
    const segmentsContext = multiCity ? buildSegmentsContext(multiCity, locale) : "";

    // Async-worker chunk continuity. Empty when the trip is a single
    // standalone Edge Fn call (sync path, or async with total_segments=1).
    const chunkContinuity = buildChunkContinuityBlock(input, locale);

    // Jet-lag — fires only when destination is on the long-haul hint list
    // (Europe / Asia / Oceania / Africa). Origin is surfaced in the prompt
    // so the AI knows where the relaxed Day 1 is coming from. Gated to
    // chunk 0 of a chunked trip: chunks 1+ are continuation days with no
    // arrival to soften, so the prompt block would only confuse the model.
    const jetLagContext   = isLaterChunk
      ? ""
      : buildJetLagContext(input.destination, input.origin, locale);

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
        travelers: `- Travelers: ${headcount} person(s)`,
        style:     `- Style: ${input.travel_style}`,
        budget:    `- Budget: ${input.budget_level}`,
        currency:  `- REQUIRED currency for "budget_breakdown": ${input.currency}. Every amount in every range MUST be in ${input.currency} — do not mix currencies or silently convert to another one.`,
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
  ${dataLabels.currency}
  ${dataLabels.interests}
  ${retryNote}${accommodationsBlock}${segmentsContext}${chunkContinuity}${jetLagContext}${familyGuidance}${temporalGuidance}${wcContext}

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

  ${isFrontmatterOnly
    ? `Call the emit_trip_frontmatter tool with ONLY title, tagline, hero_tags, before_you_go, budget_breakdown, and accommodations. Do NOT include a "days" field — another call handles the day-by-day itinerary.`
    : `Call the emit_trip tool with the complete itinerary. ${closing} Include exactly ${d} day(s). Each day must have 4-6 blocks. Keep each block's description to 2-3 sentences (under ~300 characters) -- specific and concrete, not padded.`}`;
    }

    return `Genera un itinerario de viaje con estos datos:
  - Origen: ${input.origin ?? "(no especificado)"}
  ${destinationLine}
  - Duración: ${d} días${overnight ? ` (${nights} noche(s))` : " (sin pernocta)"}
  - Fechas: ${start || "(no especificadas)"} → ${end || "(no especificadas)"}${seasonLine}${weekdaysLine}
  - Viajeros: ${headcount} persona(s)${familyLine}
  - Estilo: ${input.travel_style}
  - Presupuesto: ${input.budget_level}
  - Moneda REQUERIDA para "budget_breakdown": ${input.currency}. Todos los montos en cada rango DEBEN estar en ${input.currency} — no mezcles monedas ni conviertas a otra.
  - Intereses: ${interests}
  ${retryNote}${accommodationsBlock}${segmentsContext}${chunkContinuity}${jetLagContext}${familyGuidance}${temporalGuidance}${wcContext}

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

  ${isFrontmatterOnly
    ? `Llama a la herramienta emit_trip_frontmatter con SOLO title, tagline, hero_tags, before_you_go, budget_breakdown y accommodations. NO incluyas el campo "days" — otra llamada se encarga del itinerario día por día.`
    : `Llama a la herramienta emit_trip con el itinerario completo. ${multiCity
        ? `Usa lugares, restaurantes y rutas reales en cada ciudad del recorrido (${multiCity.map(s => s.destination).join(" → ")}), respetando el MAPEO DÍA → CIUDAD de arriba. NO concentres todos los días en una sola ciudad.`
        : `Usa lugares, restaurantes y rutas reales de ${input.destination}.`} Incluye exactamente ${d} día(s). Cada día debe tener entre 4 y 6 bloques. La descripción de cada bloque: 2-3 oraciones (menos de ~300 caracteres), específica y concreta, sin relleno.`}`;
  }                                                                                                            
                                                                                                                 
