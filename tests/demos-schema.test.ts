/**
 * tests/demos-schema.test.ts
 *
 * Zod schema + file-level validation for content/demos/<slug>/demo.json:
 * readable errors, placeholder listing, --strict, kind "partner", and the
 * Production review gate. Run: npx tsx tests/demos-schema.test.ts
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'demos-'))
process.env.DEMOS_DIR = TMP // before importing the validator
fs.writeFileSync(path.join(TMP, 'config.json'), JSON.stringify({ reviewers: ['Pili'] }))
const REAL = path.join(process.cwd(), 'content', 'demos')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { validateDemoFolder } = require('../content/guia/demos/validate') as typeof import('../content/guia/demos/validate')

let failed = 0
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) { failed++; console.error(`FAIL ${name}${extra !== undefined ? '\n  ' + JSON.stringify(extra) : ''}`) }
}

const base = () => JSON.parse(fs.readFileSync(path.join(REAL, 'host-me-tender', 'demo.json'), 'utf8'))
function put(slug: string, cfg: unknown, withLogo = true) {
  const dir = path.join(TMP, slug); fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'demo.json'), typeof cfg === 'string' ? cfg : JSON.stringify(cfg))
  if (withLogo) fs.copyFileSync(path.join(REAL, 'host-me-tender', 'logo.png'), path.join(dir, 'logo.png'))
}
const msgs = (r: ReturnType<typeof validateDemoFolder>) => r.errors.map((e) => `${e.path}: ${e.message}`)
const has = (r: ReturnType<typeof validateDemoFolder>, frag: string) => msgs(r).some((m) => m.includes(frag))

// 1. The real demos are valid and list their pending placeholders.
for (const slug of ['host-me-tender', 'dave-nat']) {
  fs.cpSync(path.join(REAL, slug), path.join(TMP, slug), { recursive: true })
  const r = validateDemoFolder(slug)
  ok(`${slug} is valid`, r.errors.length === 0, msgs(r))
}
const hmt = validateDemoFolder('host-me-tender')
ok('hmt lists price + check-out + rules placeholders', ['guide.tours[0].price', 'property.check_out', 'property.rules'].every((p) => hmt.placeholders.some((x) => x.path === p)), hmt.placeholders.map((p) => p.path))
ok('hmt lists implicit [imagen] for tours 1-3 only', [0, 1, 2].every((i) => hmt.placeholders.some((x) => x.path === `guide.tours[${i}].image`)) && !hmt.placeholders.some((x) => x.path === 'guide.tours[3].image'))
ok('hmt lists the pending logo (SVG / high-res)', hmt.placeholders.some((x) => x.path === 'partner.logo_note' && x.message.includes('SVG')), hmt.placeholders.map((p) => p.path))
ok('hmt flags the provisional color', hmt.warnings.some((w) => w.path === 'partner.brand_color'))
ok('hmt warns the 42px logo', hmt.warnings.some((w) => w.path === 'partner.logo' && w.message.includes('42px')))

// 2. --strict turns placeholders into errors; plain mode doesn't.
ok('strict fails hmt on placeholders', validateDemoFolder('host-me-tender', { strict: true }).errors.length > 5)
ok('non-strict passes hmt', validateDemoFolder('host-me-tender').errors.length === 0)

// 3. Production gate: review required, with a valid reviewer + real ISO date.
ok('production needs review', has(validateDemoFolder('host-me-tender', { production: true }), 'review: required to publish to Production'))
ok('preview-only demo needs no review', validateDemoFolder('dave-nat', { production: true }).errors.length === 0)
const withReview = (review: unknown) => { const c = base(); c.slug = 'rv'; c.review = review; put('rv', c); return validateDemoFolder('rv', { production: true }) }
ok('valid review passes', withReview({ by: 'Pili', date: '2026-10-14' }).errors.length === 0, msgs(withReview({ by: 'Pili', date: '2026-10-14' })))
ok('unknown reviewer rejected', has(withReview({ by: 'Elena', date: '2026-10-14' }), 'review.by: must be one of: Pili'))
ok('non-ISO date rejected', has(withReview({ by: 'Pili', date: '14/10/2026' }), 'review.date: must be YYYY-MM-DD'))
ok('impossible date rejected', has(withReview({ by: 'Pili', date: '2026-02-31' }), 'is not a real date'))
ok('future date rejected', has(withReview({ by: 'Pili', date: '2099-01-01' }), 'is in the future'))

// 4. Readable errors with the exact path.
const bad = base()
bad.guide.tours[2].url = 'http://x.com'
bad.partner.brand_color = 'verde'
bad.property.zones = ['roma', 'cdmx']
bad.guide.tours[0].image = 'https://stock.example/pic.jpg'
bad.surprise = 1
put('bad-1', bad)
const b = validateDemoFolder('bad-1')
ok('tour url path', has(b, 'guide.tours[2].url: must be a full https://'), msgs(b))
ok('hex', has(b, 'partner.brand_color: must be #rgb or #rrggbb'))
ok('zone', has(b, 'property.zones[1]: must be one of: condesa, roma, polanco'))
ok('third-party image', has(b, 'own illustrations'))
// Cross-field rules only run once the shape is valid, so they get their own fixtures.
const cross = (mut: (c: any) => void) => { const c = base(); c.slug = 'cross'; mut(c); put('cross', c); return validateDemoFolder('cross') }
ok('link text not in letter', has(cross((c) => { c.guide.host_letter.es.link.text = 'texto que no está' }), "doesn't appear in any paragraph"))
ok('link to a missing tour', has(cross((c) => { c.guide.host_letter.en.link.href = '#tour-9' }), "#tour-9 points to a tour that doesn't exist"))
ok('letter needs both languages', has(cross((c) => { delete c.guide.host_letter.en }), 'needs "en" too'))
ok('unknown key', has(b, 'surprise'))
ok('slug/folder mismatch', (() => { const c = base(); put('folder-x', c); return has(validateDemoFolder('folder-x'), 'must equal the folder name "folder-x"') })())
ok('invalid JSON', (() => { put('broken', '{ nope'); return has(validateDemoFolder('broken'), 'not valid JSON') })())
ok('missing logo file', (() => { const c = base(); c.slug = 'nologo'; put('nologo', c, false); return has(validateDemoFolder('nologo'), 'partner.logo: "logo.png" is not in') })())
ok('cobrand without logo', (() => { const c = base(); c.slug = 'cb'; delete c.partner.logo; put('cb', c, false); return has(validateDemoFolder('cb'), 'cobrand needs partner.logo') })())
ok('city other than cdmx', (() => { const c = base(); c.slug = 'ct'; c.city = 'gdl'; put('ct', c); return has(validateDemoFolder('ct'), 'city: must be "cdmx"') })())

// 6. The documented example (docs/demos/example.demo.json) stays valid, even --strict.
{
  const ex = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'docs', 'demos', 'example.demo.json'), 'utf8'))
  put('kasava-homes', ex)
  const r = validateDemoFolder('kasava-homes', { strict: true, production: true })
  ok('example demo.json is valid under --strict --production', r.errors.length === 0, msgs(r))
  ok('example has no pending placeholders', r.placeholders.length === 0, r.placeholders)
}

// 5. kind "partner": placeholders are always errors.
const partner = base(); partner.slug = 'real'; partner.kind = 'partner'; put('real', partner)
ok('kind partner blocks placeholders', has(validateDemoFolder('real'), 'real partner guides can\'t have any'))

fs.rmSync(TMP, { recursive: true, force: true })
if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('demos-schema: all passed')
