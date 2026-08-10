/**
 * supabase/functions/generate-trip/logic.ts
 *
 * Pure request/response-shaping logic pulled out of index.ts so it's
 * importable from a plain Node/tsx test without spinning up Deno or the
 * network — see tests/generate-trip-headcount-currency.test.ts. No Deno
 * globals, no fetch, no side effects. index.ts imports from this file
 * rather than duplicating the definitions.
 */

export type Locale = "es" | "en";

/**
 * Normalizes the raw request body into the `input` shape the rest of the
 * prompt-building code reads. This is the one place the client → server
 * field-name boundary is crossed — get a key wrong here and the value is
 * silently lost (see the `travelers` vs `traveler` regression this guards
 * against).
 */
export function buildInput(body: any): any {
  const rawDays = Number(body.duration_days ?? body.nights ?? 5);
  const duration_days = Math.min(Math.max(rawDays || 5, 1), 35);

  const nights = typeof body.nights === "number"
    ? body.nights
    : Math.max(0, duration_days - 1);
  const overnight = typeof body.overnight === "boolean"
    ? body.overnight
    : nights >= 1;

  const locale: Locale = body.locale === "en" ? "en" : "es";

  return {
    ...body,
    duration_days,
    nights,
    overnight,
    locale,
    start:        typeof body.start === "string" ? body.start : "",
    end:          typeof body.end   === "string" ? body.end   : "",
    // Client sends the party-type category as `traveler` (singular) —
    // `travelers` (plural) is never sent by any caller. Reading the wrong
    // key meant this always fell back to the literal `2`, which silently
    // broke isFamilyTraveler() below regardless of what the user picked.
    travelers:    body.traveler     ?? "pareja",
    travel_style: body.travel_style ?? body.pace   ?? "cultural",
    budget_level: body.budget_level ?? body.budget ?? "medium",
    currency:     body.currency === "USD" ? "USD" : "MXN",
    retryHint:    typeof body.retryHint === "string" ? body.retryHint : undefined,
  };
}

export function isFamilyTraveler(input: any): boolean {
  return input.travelers === "familia";
}

/**
 * Real headcount for the "X person(s)" prompt line — `input.travelers` is
 * the party-type category ("solo"/"pareja"/"familia"/"amigos"), never a
 * number, so it can't be used directly there.
 */
export function computeHeadcount(input: any): number {
  const td = input.traveler_details;
  const isFamily = isFamilyTraveler(input);
  const isAmigos = input.travelers === "amigos";
  const familyAdults   = typeof td?.adults === "number" && td.adults > 0 ? td.adults : 2;
  const familyChildren = Array.isArray(td?.children) ? td.children : [];
  const groupCount = typeof td?.group_count === "number" && td.group_count > 0 ? td.group_count : 2;
  return input.travelers === "solo" ? 1 :
    isFamily ? familyAdults + familyChildren.length :
    isAmigos ? groupCount :
    2; // pareja, and the safety default for any unrecognized value
}

// Rough order-of-magnitude sanity check — not a live FX-rate conversion
// (none is integrated). MXN and USD differ by roughly 18-20x for the same
// real-world price, so a budget_breakdown total that's implausible for the
// REQUESTED currency is a strong signal the model silently drifted to the
// other currency despite the explicit instruction in the prompt. This is
// a metrics signal, not a validation gate — a false positive must never
// fail a generation the user already paid a credit for, so callers only
// ever flag, never reject, on this check.
export function parseRangeUpperBound(range: unknown): number | null {
  if (typeof range !== "string") return null;
  const nums = range.replace(/,/g, "").match(/\d+(\.\d+)?/g);
  if (!nums || nums.length === 0) return null;
  return Math.max(...nums.map(Number));
}

export function isBudgetCurrencySuspect(
  budgetBreakdown: any,
  currency: string,
  nights: number,
  headcount: number,
): boolean {
  const categories = ["accommodation", "food", "activities", "transport"];
  const total = categories.reduce((sum, key) => {
    const upper = parseRangeUpperBound(budgetBreakdown?.[key]?.range);
    return sum + (upper ?? 0);
  }, 0);
  if (total <= 0) return false; // nothing parseable — don't flag on missing data
  const perPersonPerNight = total / Math.max(1, nights) / Math.max(1, headcount);
  // Floor/ceiling picked to clear a worked extreme-low-budget MXN case
  // (a genuine 1-night/1-person rock-bottom trip lands ~$600/night/person,
  // ~4x above the floor) and a luxury USD case (Patagonia Camp-tier
  // lodging alone runs $280-400/night; an opulent full day rarely clears
  // ~$1,600/person/night all-in, comfortably under the ceiling).
  if (currency === "USD") return perPersonPerNight > 2500;
  return perPersonPerNight < 150; // MXN (default)
}
