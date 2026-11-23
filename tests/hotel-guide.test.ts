/** tests/hotel-guide.test.ts — pure logic of the hotel guide. Run: npx tsx tests/hotel-guide.test.ts */
import { langFromAcceptLanguage } from '../lib/hotels/lang'
import { isCountableScan } from '../lib/hotels/bots'
import { generateHotelCode, isValidHotelCode } from '../lib/hotels/codes'
import { parseHotelEvent } from '../lib/hotels/events'
import { validateSignup } from '../lib/hotels/signup'
import { allow, _resetForTests } from '../lib/hotels/ratelimit'
import { hotelsToCsv, filterHotels } from '../lib/hotels/csv'
import { monthStartMx, weekStartMx, type HotelWithStats } from '../lib/hotels/stats'
import { hotelQrUrl, zoneGuidePath } from '../lib/hotels/links'
import { zoneFromSlug, ZONE_SLUG } from '../content/guia/hotel/zones'
import { HOTEL_SECTION_IDS } from '../content/guia/hotel/config'

let failed = 0
const eq = (n: string, g: unknown, w: unknown) => { if (JSON.stringify(g) !== JSON.stringify(w)) { failed++; console.error(`FAIL ${n}: got ${JSON.stringify(g)}, want ${JSON.stringify(w)}`) } }
const hdrs = (o: Record<string, string>) => ({ get: (k: string) => o[k.toLowerCase()] ?? null })
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'

// language from the phone
eq('es first', langFromAcceptLanguage('es-MX,es;q=0.9,en;q=0.8'), 'es')
eq('en first', langFromAcceptLanguage('en-US,es;q=0.9'), 'en')
eq('q-weighted es', langFromAcceptLanguage('en;q=0.5,es-419;q=0.9'), 'es')
eq('other language -> en', langFromAcceptLanguage('fr-FR,fr;q=0.9'), 'en')
eq('missing -> en', langFromAcceptLanguage(null), 'en')

// scans: real phones count, everything else does not
eq('phone counts', isCountableScan({ method: 'GET', headers: hdrs({ 'user-agent': IPHONE }) }), true)
eq('HEAD never counts', isCountableScan({ method: 'HEAD', headers: hdrs({ 'user-agent': IPHONE }) }), false)
for (const ua of ['WhatsApp/2.23.20 A', 'facebookexternalhit/1.1', 'Slackbot-LinkExpanding 1.0', 'TelegramBot (like TwitterBot)', 'Googlebot/2.1', 'curl/8.1.2', 'Mozilla/5.0 HeadlessChrome/120', 'Mozilla/5.0 (Macintosh) Applebot/0.1', ''])
  eq(`bot: ${ua || '(empty)'}`, isCountableScan({ method: 'GET', headers: hdrs({ 'user-agent': ua }) }), false)
eq('prefetch does not count', isCountableScan({ method: 'GET', headers: hdrs({ 'user-agent': IPHONE, 'sec-purpose': 'prefetch' }) }), false)

// codes
const c = generateHotelCode()
eq('code shape', isValidHotelCode(c), true)
eq('codes differ', new Set(Array.from({ length: 200 }, generateHotelCode)).size, 200)
eq('bad codes', ['', 'ABC', 'abc def', '../x', 'a'.repeat(30)].map(isValidHotelCode), [false, false, false, false, false])

// events: approved-code format + whitelist only
const ok = { code: c, type: 'section_open', section: 'time', lang: 'es' }
eq('section_open ok', parseHotelEvent(ok)?.section, 'time')
eq('every config block is accepted', HOTEL_SECTION_IDS.every((s) => parseHotelEvent({ ...ok, section: s }) !== null), true)
eq('unknown section', parseHotelEvent({ ...ok, section: 'hero; drop table' }), null)
eq('outbound ok', parseHotelEvent({ code: c, type: 'outbound_click', section: 'airalo', lang: 'en' })?.type, 'outbound_click')
eq('outbound with a section id is refused', parseHotelEvent({ code: c, type: 'outbound_click', section: 'time', lang: 'en' }), null)
eq('bad lang', parseHotelEvent({ ...ok, lang: 'fr' }), null)
eq('bad code', parseHotelEvent({ ...ok, code: 'x' }), null)
eq('no extra fields kept', Object.keys(parseHotelEvent({ ...ok, ip: '1.1.1.1', ua: 'x' }) ?? {}).sort(), ['code', 'lang', 'section', 'type'])

// signup
const now = 1_000_000
const form = { hotelName: ' Casa  Roma ', zone: 'roma', contactName: 'Ana', email: 'ANA@Hotel.com', terms: true, website: '', openedAt: now - 10_000, lang: 'es', mapsUrl: '', contactPhone: '+52 55 1234 5678', rooms: '24' }
const r1 = validateSignup(form, now)
eq('valid pending', r1.ok === true && r1.value.zone === 'roma' && r1.value.email === 'ana@hotel.com' && r1.value.hotelName === 'Casa Roma', true)
const r2 = validateSignup({ ...form, zone: 'other', requestedZone: 'Coyoacán' }, now)
eq('other zone -> waitlist shape', r2.ok === true && r2.value.zone === null && r2.value.requestedZone === 'Coyoacán', true)
eq('other zone needs the neighborhood', validateSignup({ ...form, zone: 'other' }, now), { ok: false, error: 'requestedZone' })
eq('honeypot filled', validateSignup({ ...form, website: 'http://spam' }, now), { ok: 'bot' })
eq('too fast is an error the form can show, not a success', validateSignup({ ...form, openedAt: now - 500 }, now), { ok: false, error: 'too_fast' })
eq('missing openedAt is too_fast too', validateSignup({ ...form, openedAt: undefined }, now), { ok: false, error: 'too_fast' })
eq('terms required', validateSignup({ ...form, terms: false }, now), { ok: false, error: 'terms' })
eq('bad email', validateSignup({ ...form, email: 'nope' }, now), { ok: false, error: 'email' })
eq('bad zone', validateSignup({ ...form, zone: 'centro' }, now), { ok: false, error: 'zone' })
eq('javascript: maps url refused', validateSignup({ ...form, mapsUrl: 'javascript:alert(1)' }, now), { ok: false, error: 'mapsUrl' })
eq('https maps ok', validateSignup({ ...form, mapsUrl: 'https://maps.app.goo.gl/abc' }, now).ok, true)

// WhatsApp/phone and rooms are required; role is optional
const withRole = validateSignup({ ...form, contactRole: ' Gerente ' }, now)
eq('required fields kept', r1.ok === true && r1.value.contactPhone === '+52 55 1234 5678' && r1.value.rooms === 24 && r1.value.contactRole === null, true)
eq('role is optional and trimmed', withRole.ok === true && withRole.value.contactRole === 'Gerente', true)
eq('phone is required', validateSignup({ ...form, contactPhone: '' }, now), { ok: false, error: 'contactPhone' })
eq('phone missing', validateSignup({ ...form, contactPhone: undefined }, now), { ok: false, error: 'contactPhone' })
eq('bad phone', validateSignup({ ...form, contactPhone: 'call me' }, now), { ok: false, error: 'contactPhone' })
eq('rooms is required', [''  , undefined].map((rooms) => (validateSignup({ ...form, rooms }, now) as { error?: string }).error), ['rooms', 'rooms'])
eq('rooms must be a whole number 1..5000', ['0', '5001', '12.5', 'abc'].map((rooms) => (validateSignup({ ...form, rooms }, now) as { error?: string }).error), ['rooms', 'rooms', 'rooms', 'rooms'])
eq('required fields also apply to the waitlist', validateSignup({ ...form, zone: 'other', requestedZone: 'Coyoacán', rooms: '' }, now), { ok: false, error: 'rooms' })

// rate limit
_resetForTests()
eq('limit allows 3 then blocks', [1, 2, 3, 4].map(() => allow('k', 3, 1000, 5)), [true, true, true, false])
eq('window resets', allow('k', 3, 1000, 2000), true)

// csv + filters
const h = (o: Partial<HotelWithStats>): HotelWithStats => ({ id: '1', code: 'abcdefghjk', hotel_name: 'Hotel A', zone: 'roma', requested_zone: null, contact_name: 'Ana', contact_email: 'a@x.com', maps_url: null, status: 'approved', edition: 'free', lang: 'es', notes: null, email_opt_out: false, terms_accepted_at: '2026-01-01', created_at: '2026-01-01T00:00:00Z', approved_at: null, scans_30d: 2, scans_total: 5, last_scan: null, ...o })
const csv = hotelsToCsv([h({ hotel_name: '=HYPERLINK("x")' }), h({ hotel_name: 'Casa, "Sol"' })])
eq('csv formula neutralised', csv.includes(`"'=HYPERLINK(""x"")"`), true)
eq('csv quotes', csv.includes('"Casa, ""Sol"""'), true)
eq('csv rows', csv.trim().split('\n').length, 3)
const rows = [h({ id: '1' }), h({ id: '2', status: 'waitlist', zone: null, hotel_name: 'Otro' }), h({ id: '3', zone: 'polanco', hotel_name: 'Polanco Inn' })]
eq('filter status', filterHotels(rows, { status: 'waitlist' }).map((x) => x.id), ['2'])
eq('filter zone', filterHotels(rows, { zone: 'polanco' }).map((x) => x.id), ['3'])
eq('filter other zone', filterHotels(rows, { zone: 'other' }).map((x) => x.id), ['2'])
eq('search', filterHotels(rows, { q: 'inn' }).map((x) => x.id), ['3'])

// stats windows (Mexico City, UTC-6)
eq('month start', new Date(monthStartMx(Date.parse('2026-11-17T12:00:00Z'))).toISOString(), '2026-11-01T06:00:00.000Z')
eq('month start just after UTC rollover still previous MX month', new Date(monthStartMx(Date.parse('2026-12-01T03:00:00Z'))).toISOString(), '2026-11-01T06:00:00.000Z')
eq('week starts Monday', new Date(weekStartMx(Date.parse('2026-11-18T12:00:00Z'))).toISOString(), '2026-11-16T06:00:00.000Z')

// urls
eq('qr url is the www host (apex redirects)', hotelQrUrl('abcdefghjk'), 'https://www.lagomplan.com/g/abcdefghjk')
eq('zone guide path', zoneGuidePath('roma', { h: 'abcdefghjk', lang: 'es' }), '/guia/cdmx/roma-norte?h=abcdefghjk&lang=es')
eq('slugs', [zoneFromSlug('roma-norte'), zoneFromSlug('roma'), zoneFromSlug('condesa'), ZONE_SLUG.polanco], ['roma', null, 'condesa', 'polanco'])

// ?lang on the short link wins over the phone's language (a link the guest shared keeps their language)
import { resolveLang } from '../lib/hotels/lang'
eq('lang param es beats an English phone', resolveLang('es', 'en-US,en;q=0.9'), 'es')
eq('lang param en beats a Spanish phone', resolveLang('en', 'es-MX,es;q=0.9'), 'en')
eq('no param: the phone decides', resolveLang(null, 'es-MX,es;q=0.9'), 'es')
eq('bad param is ignored', resolveLang('fr', 'es-MX'), 'es')
eq('no param, no header', resolveLang(undefined, undefined), 'en')

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('hotel-guide: all passed')
