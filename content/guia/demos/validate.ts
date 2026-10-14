// content/guia/demos/validate.ts
//
// Validates a demo folder: the Zod schema (schema.ts) plus the checks that need
// the filesystem (folder name = slug, logo exists/size, tour images exist,
// reviewers list). Returns readable issues; never throws on bad content.
// Server/CLI only.

import fs from 'node:fs'
import path from 'node:path'
import { makeDemoSchema, type DemoConfig } from './schema'

/** DEMOS_DIR env overrides the folder (tests use temp fixtures). */
export const DEMOS_DIR = process.env.DEMOS_DIR ?? path.join(process.cwd(), 'content', 'demos')
const MAX_LOGO_BYTES = 300 * 1024
const PLACEHOLDER = /\[[^\]\n]{1,80}\]/g
/** Keys whose values are URLs: brackets there are not placeholders. */
const URL_KEYS = new Set(['url', 'href', 'logo_source_url', 'map_url'])

export interface Issue { path: string; message: string }
export interface Report {
  slug: string
  file: string
  errors: Issue[]
  /** Things worth a look that don't block publishing. */
  warnings: Issue[]
  /** "[bracketed]" values still to fill in. Warnings for demos, errors under --strict / kind "partner". */
  placeholders: Issue[]
  config?: DemoConfig
}
export interface Options {
  /** Placeholders become errors (always on for kind "partner"). */
  strict?: boolean
  /** Publishing to Production: requires a valid editorial review. */
  production?: boolean
}

export function loadReviewers(): string[] {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(DEMOS_DIR, 'config.json'), 'utf8'))
    if (Array.isArray(cfg.reviewers) && cfg.reviewers.every((r: unknown) => typeof r === 'string' && r) && cfg.reviewers.length) return cfg.reviewers
  } catch { /* fall through */ }
  throw new Error('content/demos/config.json › reviewers: must be a non-empty list of names, e.g. { "reviewers": ["Pili"] }')
}

/** "tours[2].url" style path. */
export function fmtPath(p: readonly PropertyKey[]): string {
  return p.reduce<string>((acc, k) => typeof k === 'number' ? `${acc}[${k}]` : acc ? `${acc}.${String(k)}` : String(k), '')
}

export function findPlaceholders(value: unknown, trail: PropertyKey[] = [], out: Issue[] = []): Issue[] {
  if (typeof value === 'string') {
    const hits = value.match(PLACEHOLDER)
    if (hits && !URL_KEYS.has(String(trail[trail.length - 1]))) out.push({ path: fmtPath(trail), message: hits.join(' ') })
  } else if (Array.isArray(value)) value.forEach((v, i) => findPlaceholders(v, [...trail, i], out))
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) findPlaceholders(v, [...trail, k], out)
  return out
}

/** Placeholders the page still renders by DEFAULT because the JSON doesn't say anything about them. */
export function implicitPlaceholders(cfg: DemoConfig): Issue[] {
  const out: Issue[] = []
  const add = (p: string, m: string) => out.push({ path: p, message: `${m} (default — not in the JSON)` })
  if (!cfg.property.house) add('property.house', '[nombre de la propiedad] + 3 × [lugar cercano]')
  if (!cfg.property.check_out) add('property.check_out', '[check-out]')
  if (!cfg.partner.contact?.whatsapp?.href) add('partner.contact.whatsapp.href', cfg.partner.contact?.whatsapp?.label ? 'no number: the button stays disabled' : '[WhatsApp del operador]')
  if (!cfg.guide?.faq?.chefs_at_home) add('guide.faq.chefs_at_home', '[servicio de chef del operador]')
  if (!cfg.guide?.faq?.massages) add('guide.faq.massages', '[masaje recomendado]')
  cfg.guide?.tours?.forEach((t, i) => {
    if (!t.image) add(`guide.tours[${i}].image`, '[imagen]')
    if (!t.min_booking_time) add(`guide.tours[${i}].min_booking_time`, '[tiempo mínimo de reserva]')
  })
  return out
}

function pngHeight(file: string): number | null {
  try {
    const b = fs.readFileSync(file)
    return b.length > 24 && b.toString('ascii', 1, 4) === 'PNG' ? b.readUInt32BE(20) : null
  } catch { return null }
}

export function validateDemoFolder(folder: string, opts: Options = {}): Report {
  const dir = path.join(DEMOS_DIR, folder)
  const file = `content/demos/${folder}/demo.json`
  const r: Report = { slug: folder, file, errors: [], warnings: [], placeholders: [] }
  const err = (p: string, message: string) => r.errors.push({ path: p, message })

  if (!fs.existsSync(path.join(dir, 'demo.json'))) { err('(file)', `${file} doesn't exist`); return r }
  let raw: unknown
  try { raw = JSON.parse(fs.readFileSync(path.join(dir, 'demo.json'), 'utf8')) } catch (e) {
    err('(file)', `not valid JSON — ${(e as Error).message}`); return r
  }

  const parsed = makeDemoSchema(loadReviewers()).safeParse(raw)
  if (!parsed.success) {
    for (const i of parsed.error.issues) err(fmtPath(i.path) || '(root)', i.message)
    return r
  }
  const cfg = parsed.data
  r.config = cfg

  if (cfg.slug !== folder) err('slug', `must equal the folder name "${folder}" (got "${cfg.slug}")`)

  if (cfg.partner.logo) {
    const lf = path.join(dir, cfg.partner.logo)
    if (!fs.existsSync(lf)) err('partner.logo', `"${cfg.partner.logo}" is not in content/demos/${folder}/`)
    else {
      const size = fs.statSync(lf).size
      if (size > MAX_LOGO_BYTES) err('partner.logo', `${Math.round(size / 1024)} kB is over the ${MAX_LOGO_BYTES / 1024} kB limit`)
      const h = pngHeight(lf)
      if (h !== null && h < 64) r.warnings.push({ path: 'partner.logo', message: `only ${h}px tall — will look soft on retina screens (use ≥ 64px or an SVG)` })
    }
  } else {
    r.warnings.push({ path: 'partner.logo', message: 'no logo: the header shows "Lagomplan × Name" and the co-brand layout stays off' })
  }

  cfg.guide?.tours?.forEach((t, i) => {
    if (t.image && !fs.existsSync(path.join(process.cwd(), 'public', t.image))) err(`guide.tours[${i}].image`, `${t.image} doesn't exist in public/`)
  })

  if (cfg.partner.brand_color_provisional) r.warnings.push({ path: 'partner.brand_color', message: `provisional (${cfg.partner.brand_color}) — replace with the brand-guide hex` })
  if (cfg.environments && !cfg.environments.includes('production')) r.warnings.push({ path: 'environments', message: 'preview only: returns 404 on Production' })

  const ph = [...findPlaceholders(cfg), ...implicitPlaceholders(cfg)]
  if (opts.strict || cfg.kind === 'partner') for (const p of ph) err(p.path, `still a placeholder: ${p.message} — ${cfg.kind === 'partner' ? 'real partner guides can\'t have any' : 'blocked by --strict'}`)
  else r.placeholders = ph

  if (opts.production && (cfg.environments ?? ['preview', 'production']).includes('production') && !cfg.review) {
    err('review', 'required to publish to Production: add { "by": "<reviewer>", "date": "YYYY-MM-DD" } after the editorial OK (Preview works without it)')
  }
  return r
}

export function listDemoFolders(): string[] {
  return fs.existsSync(DEMOS_DIR)
    ? fs.readdirSync(DEMOS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
    : []
}

export function formatReport(r: Report): string {
  const lines = [`${r.errors.length ? '✖' : '✔'} ${r.file}`]
  for (const e of r.errors) lines.push(`    ✖ ${e.path} — ${e.message}`)
  for (const w of r.warnings) lines.push(`    ⚠ ${w.path} — ${w.message}`)
  if (r.placeholders.length) {
    lines.push(`    ⏳ ${r.placeholders.length} placeholder${r.placeholders.length === 1 ? '' : 's'} pending:`)
    for (const p of r.placeholders) lines.push(`        ${p.path}  ${p.message}`)
  }
  if (r.config && !r.errors.length) lines.push(`    review: ${r.config.review ? `${r.config.review.by} · ${r.config.review.date}` : 'none yet (Preview only)'}`)
  return lines.join('\n')
}
