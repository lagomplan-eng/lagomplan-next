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
