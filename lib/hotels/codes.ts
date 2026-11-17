// lib/hotels/codes.ts — the short, unguessable code a hotel's QR carries.
import { randomBytes } from 'crypto'

// No 0/o/1/l/i: the code is also typed by hand sometimes.
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789'
export const CODE_LENGTH = 10
const CODE_RE = /^[a-z0-9]{8,12}$/

export function generateHotelCode(): string {
  const bytes = randomBytes(CODE_LENGTH)
  let out = ''
  for (let i = 0; i < CODE_LENGTH; i++) out += ALPHABET[bytes[i] % ALPHABET.length]
  return out
}

export function isValidHotelCode(v: unknown): v is string {
  return typeof v === 'string' && CODE_RE.test(v)
}
