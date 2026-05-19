/**
 * supabase/functions/generate-trip/wc-2026-calendar.ts
 *
 * GENERATED FILE — do not edit by hand. Run `node scripts/build-wc-calendar.mjs`
 * to regenerate from lib/worldcup/data/<city>.ts (the editorial source of truth).
 *
 * Flat WC 2026 match calendar consumed by the Edge Fn to layer match
 * awareness into the trip-generation prompt. 90 matches across
 * 16 host cities.
 */

export interface WcMatch {
  /** ISO date YYYY-MM-DD. */
  date:        string
  /** Editorial short form, e.g. "11 Jun". Kept for prompt readability. */
  dateRaw:     string
  /** Spanish 3-letter weekday, e.g. "Jue". */
  day:         string
  /** Local time + timezone, e.g. "14:00 CT". */
  time:        string
  /** City file ID (kebab-case), e.g. "cdmx", "miami". */
  cityId:      string
  /** Display city, e.g. "Ciudad de México". */
  cityDisplay: string
  country:     string
  stadium:     string
  /** Both team names; placeholders ("Por definir") for elimination rounds. */
  teams:       string[]
  /** Convenience: `${teams[0]} vs ${teams[1]}`. */
  teamsLabel:  string
  /** Editorial tag — group letter, round label, or storyline. */
  tag:         string
}

export const WC_2026_CALENDAR: WcMatch[] = [
  {
    "date": "2026-06-11",
    "dateRaw": "11 Jun",
    "day": "Jue",
    "time": "14:00 CT",
    "cityId": "cdmx",
    "cityDisplay": "Ciudad de México",
    "country": "México",
    "stadium": "",
    "teams": [
      "México"
    ],
    "teamsLabel": "México",
    "tag": ""
  },
  {
    "date": "2026-06-11",
    "dateRaw": "11 Jun",
    "day": "Jue",
    "time": "21:00 CT",
    "cityId": "guadalajara",
    "cityDisplay": "Guadalajara",
    "country": "México",
    "stadium": "",
    "teams": [
      "Corea del Sur"
    ],
    "teamsLabel": "Corea del Sur",
    "tag": ""
  },
  {
    "date": "2026-06-12",
    "dateRaw": "12 Jun",
    "day": "Vie",
    "time": "18:00 PT",
    "cityId": "los-angeles",
    "cityDisplay": "Los Ángeles",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Estados Unidos"
    ],
    "teamsLabel": "Estados Unidos",
    "tag": ""
  },
  {
    "date": "2026-06-12",
    "dateRaw": "12 Jun",
    "day": "Vie",
    "time": "15:00 ET",
    "cityId": "toronto",
    "cityDisplay": "Toronto",
    "country": "Canadá",
    "stadium": "",
    "teams": [
      "Canadá"
    ],
    "teamsLabel": "Canadá",
    "tag": ""
  },
  {
    "date": "2026-06-13",
    "dateRaw": "13 Jun",
    "day": "Sáb",
    "time": "21:00 ET",
    "cityId": "boston",
    "cityDisplay": "Boston",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Haití"
    ],
    "teamsLabel": "Haití",
    "tag": ""
  },
  {
    "date": "2026-06-13",
    "dateRaw": "13 Jun",
    "day": "Sáb",
    "time": "18:00 ET",
    "cityId": "new-york",
    "cityDisplay": "Nueva York",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Brasil"
    ],
    "teamsLabel": "Brasil",
    "tag": ""
  },
  {
    "date": "2026-06-13",
    "dateRaw": "13 Jun",
    "day": "Sáb",
    "time": "12:00 PT",
    "cityId": "san-francisco",
    "cityDisplay": "San Francisco / Bay Area",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Qatar"
    ],
    "teamsLabel": "Qatar",
    "tag": ""
  },
  {
    "date": "2026-06-13",
    "dateRaw": "13 Jun",
    "day": "Sáb",
    "time": "21:00 PT",
    "cityId": "vancouver",
    "cityDisplay": "Vancouver",
    "country": "Canadá",
    "stadium": "",
    "teams": [
      "Australia"
    ],
    "teamsLabel": "Australia",
    "tag": ""
  },
  {
    "date": "2026-06-14",
    "dateRaw": "14 Jun",
    "day": "Dom",
    "time": "15:00 CT",
    "cityId": "dallas",
    "cityDisplay": "Dallas",
    "country": "EE.UU.",
    "stadium": "",
    "teams": [
      "Países Bajos"
    ],
    "teamsLabel": "Países Bajos",
    "tag": ""
  },
  {
    "date": "2026-06-14",
    "dateRaw": "14 Jun",
    "day": "Dom",
    "time": "12:00 CT",
    "cityId": "houston",
    "cityDisplay": "Houston",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Alemania"
    ],
    "teamsLabel": "Alemania",
    "tag": ""
  },
  {
    "date": "2026-06-14",
    "dateRaw": "14 Jun",
    "day": "Dom",
    "time": "21:00 CT",
    "cityId": "monterrey",
    "cityDisplay": "Monterrey",
    "country": "México",
    "stadium": "",
    "teams": [
      "Túnez"
    ],
    "teamsLabel": "Túnez",
    "tag": ""
  },
  {
    "date": "2026-06-14",
    "dateRaw": "14 Jun",
    "day": "Dom",
    "time": "19:00 ET",
    "cityId": "philadelphia",
    "cityDisplay": "Filadelfia",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Costa de Marfil"
    ],
    "teamsLabel": "Costa de Marfil",
    "tag": ""
  },
  {
    "date": "2026-06-15",
    "dateRaw": "15 Jun",
    "day": "Lun",
    "time": "12:00 ET",
    "cityId": "atlanta",
    "cityDisplay": "Atlanta",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "España"
    ],
    "teamsLabel": "España",
    "tag": ""
  },
  {
    "date": "2026-06-15",
    "dateRaw": "15 Jun",
    "day": "Dom",
    "time": "18:00 PT",
    "cityId": "los-angeles",
    "cityDisplay": "Los Ángeles",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Irán"
    ],
    "teamsLabel": "Irán",
    "tag": ""
  },
  {
    "date": "2026-06-15",
    "dateRaw": "15 Jun",
    "day": "Lun",
    "time": "18:00 ET",
    "cityId": "miami",
    "cityDisplay": "Miami",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Arabia Saudita"
    ],
    "teamsLabel": "Arabia Saudita",
    "tag": ""
  },
  {
    "date": "2026-06-15",
    "dateRaw": "15 Jun",
    "day": "Dom",
    "time": "12:00 PT",
    "cityId": "seattle",
    "cityDisplay": "Seattle",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Bélgica"
    ],
    "teamsLabel": "Bélgica",
    "tag": ""
  },
  {
    "date": "2026-06-16",
    "dateRaw": "16 Jun",
    "day": "Mar",
    "time": "18:00 ET",
    "cityId": "boston",
    "cityDisplay": "Boston",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Playoff IC-2"
    ],
    "teamsLabel": "Playoff IC-2",
    "tag": ""
  },
  {
    "date": "2026-06-16",
    "dateRaw": "16 Jun",
    "day": "Mar",
    "time": "20:00 CT",
    "cityId": "kansas",
    "cityDisplay": "Kansas City",
    "country": "EE.UU.",
    "stadium": "",
    "teams": [
      "Argentina"
    ],
    "teamsLabel": "Argentina",
    "tag": ""
  },
  {
    "date": "2026-06-16",
    "dateRaw": "16 Jun",
    "day": "Mar",
    "time": "15:00 ET",
    "cityId": "new-york",
    "cityDisplay": "Nueva York",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Francia"
    ],
    "teamsLabel": "Francia",
    "tag": ""
  },
  {
    "date": "2026-06-16",
    "dateRaw": "16 Jun",
    "day": "Mar",
    "time": "21:00 PT",
    "cityId": "san-francisco",
    "cityDisplay": "San Francisco / Bay Area",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Austria"
    ],
    "teamsLabel": "Austria",
    "tag": ""
  },
  {
    "date": "2026-06-17",
    "dateRaw": "17 Jun",
    "day": "Mié",
    "time": "21:00 CT",
    "cityId": "cdmx",
    "cityDisplay": "Ciudad de México",
    "country": "México",
    "stadium": "",
    "teams": [
      "Uzbekistán"
    ],
    "teamsLabel": "Uzbekistán",
    "tag": ""
  },
  {
    "date": "2026-06-17",
    "dateRaw": "17 Jun",
    "day": "Mar",
    "time": "15:00 CT",
    "cityId": "dallas",
    "cityDisplay": "Dallas",
    "country": "EE.UU.",
    "stadium": "",
    "teams": [
      "Inglaterra"
    ],
    "teamsLabel": "Inglaterra",
    "tag": ""
  },
  {
    "date": "2026-06-17",
    "dateRaw": "17 Jun",
    "day": "Mié",
    "time": "12:00 CT",
    "cityId": "houston",
    "cityDisplay": "Houston",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Portugal"
    ],
    "teamsLabel": "Portugal",
    "tag": ""
  },
  {
    "date": "2026-06-17",
    "dateRaw": "17 Jun",
    "day": "Mié",
    "time": "19:00 ET",
    "cityId": "toronto",
    "cityDisplay": "Toronto",
    "country": "Canadá",
    "stadium": "",
    "teams": [
      "Ghana"
    ],
    "teamsLabel": "Ghana",
    "tag": ""
  },
  {
    "date": "2026-06-18",
    "dateRaw": "18 Jun",
    "day": "Jue",
    "time": "12:00 ET",
    "cityId": "atlanta",
    "cityDisplay": "Atlanta",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Sudáfrica"
    ],
    "teamsLabel": "Sudáfrica",
    "tag": ""
  },
  {
    "date": "2026-06-18",
    "dateRaw": "18 Jun",
    "day": "Jue",
    "time": "20:00 CT",
    "cityId": "guadalajara",
    "cityDisplay": "Guadalajara",
    "country": "México",
    "stadium": "",
    "teams": [
      "México"
    ],
    "teamsLabel": "México",
    "tag": ""
  },
  {
    "date": "2026-06-18",
    "dateRaw": "18 Jun",
    "day": "Jue",
    "time": "12:00 PT",
    "cityId": "los-angeles",
    "cityDisplay": "Los Ángeles",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Suiza"
    ],
    "teamsLabel": "Suiza",
    "tag": ""
  },
  {
    "date": "2026-06-18",
    "dateRaw": "18 Jun",
    "day": "Jue",
    "time": "12:00 PT",
    "cityId": "vancouver",
    "cityDisplay": "Vancouver",
    "country": "Canadá",
    "stadium": "",
    "teams": [
      "Canadá"
    ],
    "teamsLabel": "Canadá",
    "tag": ""
  },
  {
    "date": "2026-06-19",
    "dateRaw": "19 Jun",
    "day": "Vie",
    "time": "18:00 ET",
    "cityId": "boston",
    "cityDisplay": "Boston",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Escocia"
    ],
    "teamsLabel": "Escocia",
    "tag": ""
  },
  {
    "date": "2026-06-19",
    "dateRaw": "19 Jun",
    "day": "Vie",
    "time": "23:00 CT",
    "cityId": "monterrey",
    "cityDisplay": "Monterrey",
    "country": "México",
    "stadium": "",
    "teams": [
      "Túnez"
    ],
    "teamsLabel": "Túnez",
    "tag": ""
  },
  {
    "date": "2026-06-19",
    "dateRaw": "19 Jun",
    "day": "Vie",
    "time": "21:00 ET",
    "cityId": "philadelphia",
    "cityDisplay": "Filadelfia",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Brasil"
    ],
    "teamsLabel": "Brasil",
    "tag": ""
  },
  {
    "date": "2026-06-19",
    "dateRaw": "19 Jun",
    "day": "Vie",
    "time": "21:00 PT",
    "cityId": "san-francisco",
    "cityDisplay": "San Francisco / Bay Area",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Türkiye"
    ],
    "teamsLabel": "Türkiye",
    "tag": ""
  },
  {
    "date": "2026-06-19",
    "dateRaw": "19 Jun",
    "day": "Vie",
    "time": "12:00 PT",
    "cityId": "seattle",
    "cityDisplay": "Seattle",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Estados Unidos"
    ],
    "teamsLabel": "Estados Unidos",
    "tag": ""
  },
  {
    "date": "2026-06-20",
    "dateRaw": "20 Jun",
    "day": "Sáb",
    "time": "12:00 CT",
    "cityId": "houston",
    "cityDisplay": "Houston",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Países Bajos"
    ],
    "teamsLabel": "Países Bajos",
    "tag": ""
  },
  {
    "date": "2026-06-20",
    "dateRaw": "20 Jun",
    "day": "Sáb",
    "time": "19:00 CT",
    "cityId": "kansas",
    "cityDisplay": "Kansas City",
    "country": "EE.UU.",
    "stadium": "",
    "teams": [
      "Ecuador"
    ],
    "teamsLabel": "Ecuador",
    "tag": ""
  },
  {
    "date": "2026-06-20",
    "dateRaw": "20 Jun",
    "day": "Sáb",
    "time": "16:00 ET",
    "cityId": "toronto",
    "cityDisplay": "Toronto",
    "country": "Canadá",
    "stadium": "",
    "teams": [
      "Alemania"
    ],
    "teamsLabel": "Alemania",
    "tag": ""
  },
  {
    "date": "2026-06-21",
    "dateRaw": "21 Jun",
    "day": "Dom",
    "time": "12:00 ET",
    "cityId": "atlanta",
    "cityDisplay": "Atlanta",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "España"
    ],
    "teamsLabel": "España",
    "tag": ""
  },
  {
    "date": "2026-06-21",
    "dateRaw": "21 Jun",
    "day": "Dom",
    "time": "12:00 PT",
    "cityId": "los-angeles",
    "cityDisplay": "Los Ángeles",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Bélgica"
    ],
    "teamsLabel": "Bélgica",
    "tag": ""
  },
  {
    "date": "2026-06-21",
    "dateRaw": "21 Jun",
    "day": "Dom",
    "time": "18:00 ET",
    "cityId": "miami",
    "cityDisplay": "Miami",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Uruguay"
    ],
    "teamsLabel": "Uruguay",
    "tag": ""
  },
  {
    "date": "2026-06-21",
    "dateRaw": "21 Jun",
    "day": "Dom",
    "time": "18:00 PT",
    "cityId": "vancouver",
    "cityDisplay": "Vancouver",
    "country": "Canadá",
    "stadium": "",
    "teams": [
      "Nueva Zelanda"
    ],
    "teamsLabel": "Nueva Zelanda",
    "tag": ""
  },
  {
    "date": "2026-06-22",
    "dateRaw": "22 Jun",
    "day": "Lun",
    "time": "12:00 CT",
    "cityId": "dallas",
    "cityDisplay": "Dallas",
    "country": "EE.UU.",
    "stadium": "",
    "teams": [
      "Argentina"
    ],
    "teamsLabel": "Argentina",
    "tag": ""
  },
  {
    "date": "2026-06-22",
    "dateRaw": "22 Jun",
    "day": "Lun",
    "time": "20:00 ET",
    "cityId": "new-york",
    "cityDisplay": "Nueva York",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Noruega"
    ],
    "teamsLabel": "Noruega",
    "tag": ""
  },
  {
    "date": "2026-06-22",
    "dateRaw": "22 Jun",
    "day": "Lun",
    "time": "17:00 ET",
    "cityId": "philadelphia",
    "cityDisplay": "Filadelfia",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Francia"
    ],
    "teamsLabel": "Francia",
    "tag": ""
  },
  {
    "date": "2026-06-22",
    "dateRaw": "22 Jun",
    "day": "Lun",
    "time": "20:00 PT",
    "cityId": "san-francisco",
    "cityDisplay": "San Francisco / Bay Area",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Jordania"
    ],
    "teamsLabel": "Jordania",
    "tag": ""
  },
  {
    "date": "2026-06-23",
    "dateRaw": "23 Jun",
    "day": "Mar",
    "time": "16:00 ET",
    "cityId": "boston",
    "cityDisplay": "Boston",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Inglaterra"
    ],
    "teamsLabel": "Inglaterra",
    "tag": ""
  },
  {
    "date": "2026-06-23",
    "dateRaw": "23 Jun",
    "day": "Mar",
    "time": "21:00 CT",
    "cityId": "guadalajara",
    "cityDisplay": "Guadalajara",
    "country": "México",
    "stadium": "",
    "teams": [
      "Colombia"
    ],
    "teamsLabel": "Colombia",
    "tag": ""
  },
  {
    "date": "2026-06-23",
    "dateRaw": "23 Jun",
    "day": "Mar",
    "time": "12:00 CT",
    "cityId": "houston",
    "cityDisplay": "Houston",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Portugal"
    ],
    "teamsLabel": "Portugal",
    "tag": ""
  },
  {
    "date": "2026-06-23",
    "dateRaw": "23 Jun",
    "day": "Mar",
    "time": "19:00 ET",
    "cityId": "toronto",
    "cityDisplay": "Toronto",
    "country": "Canadá",
    "stadium": "",
    "teams": [
      "Panamá"
    ],
    "teamsLabel": "Panamá",
    "tag": ""
  },
  {
    "date": "2026-06-24",
    "dateRaw": "24 Jun",
    "day": "Mié",
    "time": "18:00 ET",
    "cityId": "atlanta",
    "cityDisplay": "Atlanta",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Marruecos"
    ],
    "teamsLabel": "Marruecos",
    "tag": ""
  },
  {
    "date": "2026-06-24",
    "dateRaw": "24 Jun",
    "day": "Mié",
    "time": "20:00 CT",
    "cityId": "cdmx",
    "cityDisplay": "Ciudad de México",
    "country": "México",
    "stadium": "",
    "teams": [
      "Rep. Checa"
    ],
    "teamsLabel": "Rep. Checa",
    "tag": ""
  },
  {
    "date": "2026-06-24",
    "dateRaw": "24 Jun",
    "day": "Mié",
    "time": "18:00 ET",
    "cityId": "miami",
    "cityDisplay": "Miami",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Escocia"
    ],
    "teamsLabel": "Escocia",
    "tag": ""
  },
  {
    "date": "2026-06-24",
    "dateRaw": "24 Jun",
    "day": "Mié",
    "time": "20:00 CT",
    "cityId": "monterrey",
    "cityDisplay": "Monterrey",
    "country": "México",
    "stadium": "",
    "teams": [
      "Sudáfrica"
    ],
    "teamsLabel": "Sudáfrica",
    "tag": ""
  },
  {
    "date": "2026-06-24",
    "dateRaw": "24 Jun",
    "day": "Mié",
    "time": "12:00 PT",
    "cityId": "seattle",
    "cityDisplay": "Seattle",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Bosnia y Herzegovina"
    ],
    "teamsLabel": "Bosnia y Herzegovina",
    "tag": ""
  },
  {
    "date": "2026-06-24",
    "dateRaw": "24 Jun",
    "day": "Mié",
    "time": "12:00 PT",
    "cityId": "vancouver",
    "cityDisplay": "Vancouver",
    "country": "Canadá",
    "stadium": "",
    "teams": [
      "Suiza"
    ],
    "teamsLabel": "Suiza",
    "tag": ""
  },
  {
    "date": "2026-06-25",
    "dateRaw": "25 Jun",
    "day": "Jue",
    "time": "18:00 CT",
    "cityId": "dallas",
    "cityDisplay": "Dallas",
    "country": "EE.UU.",
    "stadium": "",
    "teams": [
      "Japón"
    ],
    "teamsLabel": "Japón",
    "tag": ""
  },
  {
    "date": "2026-06-25",
    "dateRaw": "25 Jun",
    "day": "Jue",
    "time": "18:00 CT",
    "cityId": "kansas",
    "cityDisplay": "Kansas City",
    "country": "EE.UU.",
    "stadium": "",
    "teams": [
      "Túnez"
    ],
    "teamsLabel": "Túnez",
    "tag": ""
  },
  {
    "date": "2026-06-25",
    "dateRaw": "25 Jun",
    "day": "Jue",
    "time": "19:00 PT",
    "cityId": "los-angeles",
    "cityDisplay": "Los Ángeles",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Estados Unidos"
    ],
    "teamsLabel": "Estados Unidos",
    "tag": ""
  },
  {
    "date": "2026-06-25",
    "dateRaw": "25 Jun",
    "day": "Jue",
    "time": "16:00 ET",
    "cityId": "new-york",
    "cityDisplay": "Nueva York",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Ecuador"
    ],
    "teamsLabel": "Ecuador",
    "tag": ""
  },
  {
    "date": "2026-06-25",
    "dateRaw": "25 Jun",
    "day": "Jue",
    "time": "16:00 ET",
    "cityId": "philadelphia",
    "cityDisplay": "Filadelfia",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Curazao"
    ],
    "teamsLabel": "Curazao",
    "tag": ""
  },
  {
    "date": "2026-06-25",
    "dateRaw": "25 Jun",
    "day": "Jue",
    "time": "19:00 PT",
    "cityId": "san-francisco",
    "cityDisplay": "San Francisco / Bay Area",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Paraguay"
    ],
    "teamsLabel": "Paraguay",
    "tag": ""
  },
  {
    "date": "2026-06-26",
    "dateRaw": "26 Jun",
    "day": "Vie",
    "time": "15:00 ET",
    "cityId": "boston",
    "cityDisplay": "Boston",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Noruega"
    ],
    "teamsLabel": "Noruega",
    "tag": ""
  },
  {
    "date": "2026-06-26",
    "dateRaw": "26 Jun",
    "day": "Vie",
    "time": "19:00 CT",
    "cityId": "guadalajara",
    "cityDisplay": "Guadalajara",
    "country": "México",
    "stadium": "",
    "teams": [
      "Uruguay"
    ],
    "teamsLabel": "Uruguay",
    "tag": ""
  },
  {
    "date": "2026-06-26",
    "dateRaw": "26 Jun",
    "day": "Vie",
    "time": "19:00 CT",
    "cityId": "houston",
    "cityDisplay": "Houston",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Cabo Verde"
    ],
    "teamsLabel": "Cabo Verde",
    "tag": ""
  },
  {
    "date": "2026-06-26",
    "dateRaw": "26 Jun",
    "day": "Vie",
    "time": "20:00 PT",
    "cityId": "seattle",
    "cityDisplay": "Seattle",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Egipto"
    ],
    "teamsLabel": "Egipto",
    "tag": ""
  },
  {
    "date": "2026-06-26",
    "dateRaw": "26 Jun",
    "day": "Vie",
    "time": "15:00 ET",
    "cityId": "toronto",
    "cityDisplay": "Toronto",
    "country": "Canadá",
    "stadium": "",
    "teams": [
      "Senegal"
    ],
    "teamsLabel": "Senegal",
    "tag": ""
  },
  {
    "date": "2026-06-26",
    "dateRaw": "26 Jun",
    "day": "Vie",
    "time": "20:00 PT",
    "cityId": "vancouver",
    "cityDisplay": "Vancouver",
    "country": "Canadá",
    "stadium": "",
    "teams": [
      "Nueva Zelanda"
    ],
    "teamsLabel": "Nueva Zelanda",
    "tag": ""
  },
  {
    "date": "2026-06-27",
    "dateRaw": "27 Jun",
    "day": "Sáb",
    "time": "19:30 ET",
    "cityId": "atlanta",
    "cityDisplay": "Atlanta",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "RD Congo"
    ],
    "teamsLabel": "RD Congo",
    "tag": ""
  },
  {
    "date": "2026-06-27",
    "dateRaw": "27 Jun",
    "day": "Sáb",
    "time": "21:00 CT",
    "cityId": "dallas",
    "cityDisplay": "Dallas",
    "country": "EE.UU.",
    "stadium": "",
    "teams": [
      "Argentina"
    ],
    "teamsLabel": "Argentina",
    "tag": ""
  },
  {
    "date": "2026-06-27",
    "dateRaw": "27 Jun",
    "day": "Sáb",
    "time": "21:00 CT",
    "cityId": "kansas",
    "cityDisplay": "Kansas City",
    "country": "EE.UU.",
    "stadium": "",
    "teams": [
      "Argelia"
    ],
    "teamsLabel": "Argelia",
    "tag": ""
  },
  {
    "date": "2026-06-27",
    "dateRaw": "27 Jun",
    "day": "Sáb",
    "time": "19:30 ET",
    "cityId": "miami",
    "cityDisplay": "Miami",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Colombia"
    ],
    "teamsLabel": "Colombia",
    "tag": ""
  },
  {
    "date": "2026-06-27",
    "dateRaw": "27 Jun",
    "day": "Sáb",
    "time": "17:00 ET",
    "cityId": "new-york",
    "cityDisplay": "Nueva York",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Panamá"
    ],
    "teamsLabel": "Panamá",
    "tag": ""
  },
  {
    "date": "2026-06-27",
    "dateRaw": "27 Jun",
    "day": "Sáb",
    "time": "17:00 ET",
    "cityId": "philadelphia",
    "cityDisplay": "Filadelfia",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Croacia"
    ],
    "teamsLabel": "Croacia",
    "tag": ""
  },
  {
    "date": "2026-06-28",
    "dateRaw": "28 Jun",
    "day": "Dom",
    "time": "09:00 PT",
    "cityId": "los-angeles",
    "cityDisplay": "Los Ángeles",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Ronda de 32"
    ],
    "teamsLabel": "Ronda de 32",
    "tag": ""
  },
  {
    "date": "2026-06-29",
    "dateRaw": "29 Jun",
    "day": "Lun",
    "time": "16:30 ET",
    "cityId": "boston",
    "cityDisplay": "Boston",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Ronda de 32"
    ],
    "teamsLabel": "Ronda de 32",
    "tag": ""
  },
  {
    "date": "2026-06-30",
    "dateRaw": "30 Jun",
    "day": "Mar",
    "time": "20:00 CT",
    "cityId": "cdmx",
    "cityDisplay": "Ciudad de México",
    "country": "México",
    "stadium": "",
    "teams": [
      "Ronda de 32"
    ],
    "teamsLabel": "Ronda de 32",
    "tag": ""
  },
  {
    "date": "2026-07-01",
    "dateRaw": "1 Jul",
    "day": "Mié",
    "time": "12:00 ET",
    "cityId": "atlanta",
    "cityDisplay": "Atlanta",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Ronda de 32"
    ],
    "teamsLabel": "Ronda de 32",
    "tag": ""
  },
  {
    "date": "2026-07-02",
    "dateRaw": "2 Jul",
    "day": "Jue",
    "time": "TBD",
    "cityId": "los-angeles",
    "cityDisplay": "Los Ángeles",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Ronda de 32"
    ],
    "teamsLabel": "Ronda de 32",
    "tag": ""
  },
  {
    "date": "2026-07-03",
    "dateRaw": "3 Jul",
    "day": "Vie",
    "time": "13:00 CT",
    "cityId": "dallas",
    "cityDisplay": "Dallas",
    "country": "EE.UU.",
    "stadium": "",
    "teams": [
      "Ronda de 32"
    ],
    "teamsLabel": "Ronda de 32",
    "tag": ""
  },
  {
    "date": "2026-07-04",
    "dateRaw": "4 Jul",
    "day": "Sáb",
    "time": "12:00 CT",
    "cityId": "houston",
    "cityDisplay": "Houston",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Ronda de 16"
    ],
    "teamsLabel": "Ronda de 16",
    "tag": ""
  },
  {
    "date": "2026-07-05",
    "dateRaw": "5 Jul",
    "day": "Dom",
    "time": "19:00 CT",
    "cityId": "cdmx",
    "cityDisplay": "Ciudad de México",
    "country": "México",
    "stadium": "",
    "teams": [
      "Ronda de 16"
    ],
    "teamsLabel": "Ronda de 16",
    "tag": ""
  },
  {
    "date": "2026-07-06",
    "dateRaw": "6 Jul",
    "day": "Lun",
    "time": "14:00 CT",
    "cityId": "dallas",
    "cityDisplay": "Dallas",
    "country": "EE.UU.",
    "stadium": "",
    "teams": [
      "Ronda de 16"
    ],
    "teamsLabel": "Ronda de 16",
    "tag": ""
  },
  {
    "date": "2026-07-07",
    "dateRaw": "7 Jul",
    "day": "Mar",
    "time": "12:00 ET",
    "cityId": "atlanta",
    "cityDisplay": "Atlanta",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Ronda de 16"
    ],
    "teamsLabel": "Ronda de 16",
    "tag": ""
  },
  {
    "date": "2026-07-09",
    "dateRaw": "9 Jul",
    "day": "Jue",
    "time": "16:00 ET",
    "cityId": "boston",
    "cityDisplay": "Boston",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Cuartos de Final"
    ],
    "teamsLabel": "Cuartos de Final",
    "tag": ""
  },
  {
    "date": "2026-07-10",
    "dateRaw": "10 Jul",
    "day": "Vie",
    "time": "12:00 PT",
    "cityId": "los-angeles",
    "cityDisplay": "Los Ángeles",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Cuartos de Final"
    ],
    "teamsLabel": "Cuartos de Final",
    "tag": ""
  },
  {
    "date": "2026-07-11",
    "dateRaw": "11 Jul",
    "day": "Sáb",
    "time": "20:00 CT",
    "cityId": "kansas",
    "cityDisplay": "Kansas City",
    "country": "EE.UU.",
    "stadium": "",
    "teams": [
      "Cuartos de Final"
    ],
    "teamsLabel": "Cuartos de Final",
    "tag": ""
  },
  {
    "date": "2026-07-11",
    "dateRaw": "11 Jul",
    "day": "Sáb",
    "time": "17:00 ET",
    "cityId": "miami",
    "cityDisplay": "Miami",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Semifinal"
    ],
    "teamsLabel": "Semifinal",
    "tag": ""
  },
  {
    "date": "2026-07-14",
    "dateRaw": "14 Jul",
    "day": "Mar",
    "time": "14:00 CT",
    "cityId": "dallas",
    "cityDisplay": "Dallas",
    "country": "EE.UU.",
    "stadium": "",
    "teams": [
      "Semifinal"
    ],
    "teamsLabel": "Semifinal",
    "tag": ""
  },
  {
    "date": "2026-07-15",
    "dateRaw": "15 Jul",
    "day": "Mié",
    "time": "15:00 ET",
    "cityId": "atlanta",
    "cityDisplay": "Atlanta",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Semifinal"
    ],
    "teamsLabel": "Semifinal",
    "tag": ""
  },
  {
    "date": "2026-07-18",
    "dateRaw": "18 Jul",
    "day": "Vie",
    "time": "17:00 ET",
    "cityId": "miami",
    "cityDisplay": "Miami",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "Tercer puesto"
    ],
    "teamsLabel": "Tercer puesto",
    "tag": ""
  },
  {
    "date": "2026-07-19",
    "dateRaw": "19 Jul",
    "day": "Dom",
    "time": "15:00 ET",
    "cityId": "new-york",
    "cityDisplay": "Nueva York",
    "country": "Estados Unidos",
    "stadium": "",
    "teams": [
      "FINAL 🏆"
    ],
    "teamsLabel": "FINAL 🏆",
    "tag": ""
  }
]

/** Substring-match hints for resolving free-form user destinations to host cityIds. */
export const WC_HOST_CITY_HINTS: Record<string, string[]> = {
  "atlanta": ["atlanta"],
  "boston": ["boston"],
  "cdmx": ["cdmx","ciudad de méxico","mexico city","ciudad de mexico"],
  "dallas": ["dallas"],
  "guadalajara": ["guadalajara"],
  "houston": ["houston"],
  "kansas": ["kansas","kansas city"],
  "los-angeles": ["los-angeles","los ángeles","la","los angeles","hollywood"],
  "miami": ["miami"],
  "monterrey": ["monterrey"],
  "new-york": ["new-york","nueva york","nyc","new york","manhattan","brooklyn"],
  "philadelphia": ["philadelphia","filadelfia"],
  "san-francisco": ["san-francisco","san francisco / bay area","sf","san francisco","bay area"],
  "seattle": ["seattle"],
  "toronto": ["toronto"],
  "vancouver": ["vancouver"],
}
