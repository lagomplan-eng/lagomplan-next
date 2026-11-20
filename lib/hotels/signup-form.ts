// lib/hotels/signup-form.ts
//
// Field-level validation and messages for the hotel signup form, in plain words, ES and EN. The rules are the same as
// the server's (lib/hotels/signup.ts): tests/hotel-signup-form.test.ts checks that both agree, so the browser never
// accepts what the server refuses (or the other way round). A server error is mapped back to the field it belongs to.

export type FormLang = 'es' | 'en'

export type FormField =
  | 'hotelName' | 'zone' | 'requestedZone' | 'contactName' | 'email'
  | 'contactPhone' | 'rooms' | 'mapsUrl' | 'terms'

/** Top-to-bottom order in the form: the first field with a problem is the one the page scrolls to. */
export const FIELD_ORDER: FormField[] = [
  'hotelName', 'zone', 'requestedZone', 'contactName', 'email', 'contactPhone', 'rooms', 'mapsUrl', 'terms',
]

export interface FormValues {
  hotelName: string
  zone: string            // '' | 'condesa' | 'roma' | 'polanco' | 'other'
  requestedZone: string
  contactName: string
  email: string
  contactPhone: string
  rooms: string
  contactRole: string
  mapsUrl: string
  terms: boolean
}

export type FormErrors = Partial<Record<FormField, string>>

const MSG: Record<FormLang, Record<string, string>> = {
  es: {
    hotelName: 'Escribe el nombre del hotel',
    zone: 'Elige una zona',
    requestedZone: 'Escribe en qué colonia está tu hotel',
    contactName: 'Escribe tu nombre',
    emailMissing: 'Escribe tu correo electrónico',
    emailInvalid: 'Escribe un correo válido, por ejemplo nombre@hotel.com',
    phoneMissing: 'Escribe un WhatsApp o teléfono',
    phoneInvalid: 'Revisa el número: solo dígitos, por ejemplo 55 1234 5678',
    roomsMissing: 'Escribe el número de habitaciones',
    roomsDigits: 'Solo números, por ejemplo 12',
    roomsRange: 'Escribe un número entre 1 y 5000',
    mapsInvalid: 'Pega el enlace completo, por ejemplo https://maps.app.goo.gl/…',
    terms: 'Acepta los términos para continuar',
  },
  en: {
    hotelName: 'Enter the hotel name',
    zone: 'Choose a zone',
    requestedZone: 'Enter which neighborhood your hotel is in',
    contactName: 'Enter your name',
    emailMissing: 'Enter your email',
    emailInvalid: 'Enter a valid email, for example name@hotel.com',
    phoneMissing: 'Enter a WhatsApp or phone number',
    phoneInvalid: 'Check the number: digits only, for example 55 1234 5678',
    roomsMissing: 'Enter the number of rooms',
    roomsDigits: 'Numbers only, for example 12',
    roomsRange: 'Enter a number between 1 and 5000',
    mapsInvalid: 'Paste the full link, for example https://maps.app.goo.gl/…',
    terms: 'Accept the terms to continue',
  },
}

// Same expressions as the server.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+\d][\d\s().-]{5,39}$/

export function validateForm(v: FormValues, lang: FormLang): FormErrors {
  const m = MSG[lang]
  const e: FormErrors = {}
  if (!v.hotelName.trim()) e.hotelName = m.hotelName
  if (!v.zone) e.zone = m.zone
  else if (v.zone === 'other' && !v.requestedZone.trim()) e.requestedZone = m.requestedZone
  if (!v.contactName.trim()) e.contactName = m.contactName

  const email = v.email.trim()
  if (!email) e.email = m.emailMissing
  else if (!EMAIL_RE.test(email)) e.email = m.emailInvalid

  const phone = v.contactPhone.trim().replace(/\s+/g, ' ')
  if (!phone) e.contactPhone = m.phoneMissing
  else if (!PHONE_RE.test(phone)) e.contactPhone = m.phoneInvalid

  const rooms = v.rooms.trim()
  if (!rooms) e.rooms = m.roomsMissing
  else if (!/^\d+$/.test(rooms)) e.rooms = m.roomsDigits
  else if (Number(rooms) < 1 || Number(rooms) > 5000) e.rooms = m.roomsRange

  const maps = v.mapsUrl.trim()
  if (maps) {
    try {
      const u = new URL(maps)
      if (u.protocol !== 'https:' && u.protocol !== 'http:') e.mapsUrl = m.mapsInvalid
    } catch { e.mapsUrl = m.mapsInvalid }
  }

  if (!v.terms) e.terms = m.terms
  return e
}

/** The first field with a problem, in page order. */
export function firstInvalid(errors: FormErrors): FormField | null {
  return FIELD_ORDER.find((f) => errors[f]) ?? null
}

/**
 * A server error code (lib/hotels/signup.ts) → the field and the message to show next to it. When the browser
 * rules find nothing wrong with the current values (the server is stricter, or the values changed), a generic message
 * for that field is used, so a server refusal is never silent.
 */
export function serverErrorToField(code: string, v: FormValues, lang: FormLang): { field: FormField; message: string } | null {
  const fieldByCode: Record<string, FormField> = {
    hotelName: 'hotelName', zone: 'zone', requestedZone: 'requestedZone', contactName: 'contactName', email: 'email',
    contactPhone: 'contactPhone', rooms: 'rooms', mapsUrl: 'mapsUrl', terms: 'terms',
  }
  const field = fieldByCode[code]
  if (!field) return null
  const m = MSG[lang]
  const fallback: Record<FormField, string> = {
    hotelName: m.hotelName, zone: m.zone, requestedZone: m.requestedZone, contactName: m.contactName,
    email: m.emailInvalid, contactPhone: m.phoneInvalid, rooms: m.roomsDigits, mapsUrl: m.mapsInvalid, terms: m.terms,
  }
  return { field, message: validateForm(v, lang)[field] ?? fallback[field] }
}
