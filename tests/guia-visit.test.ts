/**
 * tests/guia-visit.test.ts — lib/guia/visit.ts builds rows that satisfy the
 * guide_visits / demo_visits CHECK constraints and never leak raw input.
 *   npx tsx tests/guia-visit.test.ts
 */
import { buildVisit, sanitizeRef, summarizeUserAgent } from '../lib/guia/visit'

let failed = 0
function eq(name: string, got: unknown, exp: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(exp)
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `\n   got ${JSON.stringify(got)}\n   exp ${JSON.stringify(exp)}`}`)
}

// Mirrors the table CHECKs.
const SLUG = /^[a-z0-9][a-z0-9_-]{0,63}$/
const UA = /^(mobile|tablet|desktop|bot|unknown):(chrome|safari|firefox|edge|samsung|other)$/
const REF = /^[a-z0-9_-]{1,32}$/
const ALLOWED = ['lang', 'llegada', 'noches', 'adultos', 'ninos', 'ref']
function satisfiesChecks(r: ReturnType<typeof buildVisit>) {
  return SLUG.test(r.slug) && (r.lang === 'es' || r.lang === 'en') && UA.test(r.ua_summary)
    && r.params_present.every((x) => ALLOWED.includes(x)) && r.params_present.length <= 6
    && (r.ref === null || REF.test(r.ref))
}

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'
const MAC_CHROME = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const MAC_FIREFOX = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0'
const WIN_EDGE = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0'
const ANDROID_CHROME = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
const IPAD = 'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'
const GOOGLEBOT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'

eq('iphone → mobile:safari', summarizeUserAgent(IPHONE), 'mobile:safari')
eq('mac chrome → desktop:chrome', summarizeUserAgent(MAC_CHROME), 'desktop:chrome')
eq('mac firefox → desktop:firefox', summarizeUserAgent(MAC_FIREFOX), 'desktop:firefox')
eq('windows edge → desktop:edge', summarizeUserAgent(WIN_EDGE), 'desktop:edge')
eq('android chrome → mobile:chrome', summarizeUserAgent(ANDROID_CHROME), 'mobile:chrome')
eq('ipad → tablet:safari', summarizeUserAgent(IPAD), 'tablet:safari')
eq('googlebot → bot:other', summarizeUserAgent(GOOGLEBOT), 'bot:other')
eq('empty UA → unknown:other', summarizeUserAgent(''), 'unknown:other')
eq('garbage UA stays in the allowed set', UA.test(summarizeUserAgent('???')), true)

eq('ref ok', sanitizeRef('qr'), 'qr')
eq('ref lowercased', sanitizeRef('WA_Link-1'), 'wa_link-1')
eq('ref too long dropped', sanitizeRef('a'.repeat(33)), null)
eq('ref with spaces/punctuation dropped', sanitizeRef('hello world!'), null)
eq('ref empty dropped', sanitizeRef(''), null)
eq('ref absent', sanitizeRef(null), null)

const full = buildVisit('host-me-tender', 'lang=es&llegada=2026-11-05&noches=3&adultos=2&ninos=2&ref=qr', MAC_CHROME)
eq('full row', full, { slug: 'host-me-tender', lang: 'es', params_present: ['lang', 'llegada', 'noches', 'adultos', 'ninos', 'ref'], ua_summary: 'desktop:chrome', ref: 'qr' })
eq('full row satisfies CHECKs', satisfiesChecks(full), true)
const bare = buildVisit('livin_condesa', '', IPHONE)
eq('bare row defaults to en, no params', bare, { slug: 'livin_condesa', lang: 'en', params_present: [], ua_summary: 'mobile:safari', ref: null })
eq('param VALUES never stored', JSON.stringify(full).includes('2026-11-05'), false)
eq('unknown params ignored', buildVisit('x1', 'utm_source=a&email=me@x.com&noches=2', MAC_CHROME).params_present, ['noches'])
eq('bad lang falls back to en', buildVisit('x1', 'lang=fr', MAC_CHROME).lang, 'en')
eq('hostile ref dropped, row still valid', satisfiesChecks(buildVisit('x1', "ref='; drop table x;--", MAC_CHROME)), true)

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('\nall passed')
