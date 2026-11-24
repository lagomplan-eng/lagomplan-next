// lib/hotels/aliases.ts — readable addresses for a few hotels: /g/casa-cuenca behaves exactly like /g/tjc9ckzteq.
//
// Add one line per hotel, by hand: alias (lower case, letters, digits and hyphens) -> the hotel's random code.
// The alias is only a doorway: the guide, the scan, the card and the "Send this guide to my phone" link all use the random
// code (the QR on the card keeps encoding the random code). Nothing here touches the database or the code format rules,
// and nothing is cached: the lookup is a plain object read on every request.
export const HOTEL_ALIASES: Record<string, string> = {
  'casa-cuenca': 'tjc9ckzteq',
}

/** The real hotel code for what is in the address: a listed alias becomes its code, anything else is returned as it came. */
export function resolveHotelCode(fromAddress: string): string {
  const key = fromAddress.toLowerCase()
  return Object.prototype.hasOwnProperty.call(HOTEL_ALIASES, key) ? HOTEL_ALIASES[key] : fromAddress
}

/** The readable alias of a hotel code, or null when it has none (the first one listed, if there are several). */
export function aliasForCode(code: string): string | null {
  return Object.keys(HOTEL_ALIASES).find((alias) => HOTEL_ALIASES[alias] === code) ?? null
}
