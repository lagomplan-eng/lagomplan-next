/** tests/hotel-signup-form.test.ts — the form's rules and the server's agree. Run: npx tsx tests/hotel-signup-form.test.ts */
import { FIELD_ORDER, firstInvalid, serverErrorToField, validateForm, type FormValues } from '../lib/hotels/signup-form'
import { validateSignup } from '../lib/hotels/signup'

let failed = 0
const eq = (n: string, g: unknown, w: unknown) => { if (JSON.stringify(g) !== JSON.stringify(w)) { failed++; console.error(`FAIL ${n}: got ${JSON.stringify(g)}, want ${JSON.stringify(w)}`) } }

const ok: FormValues = { hotelName: 'Casa Roma', zone: 'roma', requestedZone: '', contactName: 'Ana', email: 'ana@hotel.com', contactPhone: '55 1234 5678', rooms: '12', contactRole: '', mapsUrl: '', terms: true }
const now = 1_000_000
const server = (v: FormValues) => validateSignup({ ...v, website: '', openedAt: now - 10_000, lang: 'es' }, now)

// Every case: the browser accepts it exactly when the server does, and a refusal names the same field.
const cases: [string, Partial<FormValues>][] = [
  ['valid', {}],
  ['valid with role and maps', { contactRole: 'Gerente', mapsUrl: 'https://maps.app.goo.gl/abc' }],
  ['valid other zone', { zone: 'other', requestedZone: 'Coyoacán' }],
  ['no hotel name', { hotelName: '  ' }],
  ['no zone', { zone: '' }],
  ['other zone without neighborhood', { zone: 'other', requestedZone: '' }],
  ['no contact name', { contactName: '' }],
  ['no email', { email: '' }],
  ['bad email', { email: 'nope' }],
  ['no phone', { contactPhone: '' }],
  ['bad phone', { contactPhone: 'llámame' }],
  ['short phone', { contactPhone: '123' }],
  ['phone with country code', { contactPhone: '+52 (55) 1234-5678' }],
  ['no rooms', { rooms: '' }],
  ['rooms letters', { rooms: 'doce' }],
  ['rooms decimal', { rooms: '12.5' }],
  ['rooms zero', { rooms: '0' }],
  ['rooms too many', { rooms: '5001' }],
  ['rooms max', { rooms: '5000' }],
  ['bad maps link', { mapsUrl: 'no es un enlace' }],
  ['javascript maps link', { mapsUrl: 'javascript:alert(1)' }],
  ['terms not accepted', { terms: false }],
]
for (const [name, patch] of cases) {
  const v = { ...ok, ...patch }
  for (const lang of ['es', 'en'] as const) {
    const client = validateForm(v, lang)
    const srv = server(v)
    eq(`${name} (${lang}): browser and server agree`, Object.keys(client).length === 0, srv.ok === true)
    if (srv.ok === false) {
      // The server names one field; it must be one the browser also flagged.
      eq(`${name} (${lang}): server error ${srv.error} is a flagged field`, srv.error in client, true)
    }
  }
}

// plain-words messages, ES and EN
const empty: FormValues = { hotelName: '', zone: '', requestedZone: '', contactName: '', email: '', contactPhone: '', rooms: '', contactRole: '', mapsUrl: '', terms: false }
const es = validateForm(empty, 'es'), en = validateForm(empty, 'en')
eq('all required fields flagged when empty', Object.keys(es).sort(), ['contactName', 'contactPhone', 'email', 'hotelName', 'rooms', 'terms', 'zone'])
eq('es: rooms missing', es.rooms, 'Escribe el número de habitaciones')
eq('es: phone missing', es.contactPhone, 'Escribe un WhatsApp o teléfono')
eq('es: terms', es.terms, 'Acepta los términos para continuar')
eq('es: rooms with letters', validateForm({ ...ok, rooms: 'doce' }, 'es').rooms, 'Solo números, por ejemplo 12')
eq('en: rooms missing', en.rooms, 'Enter the number of rooms')
eq('en: terms', en.terms, 'Accept the terms to continue')
eq('role and maps are never required', ['contactRole', 'mapsUrl'].some((k) => k in es), false)
eq('no message mixes languages', Object.values(es).some((m) => /Enter|Accept|Choose/.test(m)) || Object.values(en).some((m) => /Escribe|Acepta|Elige/.test(m)), false)
eq('no exclamation marks', [...Object.values(es), ...Object.values(en)].some((m) => m.includes('!')), false)

// scroll target = first problem in page order
eq('first invalid is the top-most', firstInvalid(es), 'hotelName')
eq('first invalid skips valid fields', firstInvalid(validateForm({ ...ok, rooms: '', terms: false }, 'es')), 'rooms')
eq('nothing invalid', firstInvalid({}), null)
eq('field order matches the page (phone and rooms before the optional fields)', FIELD_ORDER.indexOf('rooms') < FIELD_ORDER.indexOf('mapsUrl'), true)

// server errors land next to their field, with a message even when the browser rules see nothing wrong
for (const code of ['hotelName', 'zone', 'requestedZone', 'contactName', 'email', 'contactPhone', 'rooms', 'mapsUrl', 'terms'])
  eq(`server error ${code} maps to field ${code}`, serverErrorToField(code, ok, 'es')?.field, code)
eq('server rooms error with a bad value uses the specific message', serverErrorToField('rooms', { ...ok, rooms: 'x' }, 'es')?.message, 'Solo números, por ejemplo 12')
eq('server error on a value the browser accepts still shows something', (serverErrorToField('rooms', ok, 'en')?.message ?? '').length > 0, true)
eq('unknown server code is not mapped', serverErrorToField('too_fast', ok, 'es'), null)

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('hotel-signup-form: all passed')
