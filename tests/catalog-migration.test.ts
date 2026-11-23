/**
 * /experiencias and /hoteles are built from the design foundation (components/design). The old catalog
 * components (CatalogCard, Chip, FilterPanel, PageHeader) are gone, there are no colour literals or
 * inline styles on these pages, and every GA4 call is exactly the one the pages made before.
 */
import fs from 'fs'
import path from 'path'

const root = path.join(__dirname, '..')
let failed = 0
function ok(name: string, cond: boolean, detail = '') {
  if (cond) console.log(`ok   ${name}`)
  else { failed++; console.log(`FAIL ${name}${detail ? ` — ${detail}` : ''}`) }
}
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf-8')
const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '')

const FILES = [
  'components/experiences/ExperiencesHub.tsx',
  'components/hotels/HotelsClient.tsx',
  'components/hotels/NeighborhoodsSection.tsx',
  'components/hotels/SmartFindsSection.tsx',
  'components/hotels/PlannerBridgeCTA.tsx',
  'components/catalog/ResultsBar.tsx',
  'components/catalog/DestinationBanner.tsx',
  'components/catalog/PlanButton.tsx',
  'components/catalog/PlanTray.tsx',
  'app/[locale]/hotels/page.tsx',
  'app/[locale]/experiences/page.tsx',
]
const bad = (re: RegExp) => FILES.filter(f => re.test(strip(read(f))))

ok('replaced catalog components are deleted', ['CatalogCard', 'Chip', 'FilterPanel', 'PageHeader'].every(n => !fs.existsSync(path.join(root, `components/catalog/${n}.tsx`))))
ok('no hex colour literals', bad(/#[0-9a-fA-F]{3,8}\b/).length === 0, bad(/#[0-9a-fA-F]{3,8}\b/).join(', '))
ok('no rgb()/rgba() colour numbers', bad(/rgba?\(\s*\d/).length === 0, bad(/rgba?\(\s*\d/).join(', '))
ok('no inline style colours or fonts', bad(/style=\{\{[^}]*(?:color|background|fontFamily|border)/i).length === 0, bad(/style=\{\{[^}]*(?:color|background|fontFamily|border)/i).join(', '))
ok('no hardcoded Tailwind colour brackets', bad(/(?:bg|text|border|from|via|to|fill|stroke|ring|shadow)-\[(?:#|rgb)/).length === 0, bad(/(?:bg|text|border|from|via|to|fill|stroke|ring|shadow)-\[(?:#|rgb)/).join(', '))
ok('no legacy label classes (sec-label, btn-solid, btn-outline)', bad(/sec-label|btn-solid|btn-outline/).length === 0)

const uses = (f: string, names: string[]) => names.every(n => new RegExp(`\\b${n}\\b`).test(read(f)))
ok('Experiencias uses PageTitle, FilterPanel, Chip, DestinationCard, Button, InfoCard', uses('components/experiences/ExperiencesHub.tsx', ['PageTitle', 'FilterPanel', 'Chip', 'DestinationCard', 'Button', 'InfoCard']))
ok('Hoteles uses PageTitle, FilterPanel, Chip, DestinationCard, Button', uses('components/hotels/HotelsClient.tsx', ['PageTitle', 'FilterPanel', 'Chip', 'DestinationCard', 'Button']))
ok('both pages feed the mobile filter sheet (activeFilters + resultsCount + labels)', ['components/experiences/ExperiencesHub.tsx', 'components/hotels/HotelsClient.tsx'].every(f => /activeFilters=\{activeFilters\}/.test(read(f)) && /resultsCount=\{visible\.length\}/.test(read(f)) && /sheet\.showResults/.test(read(f))))

// GA4: the exact tracking calls of the pages before the migration (copied from main).
const CALLS: Record<string, string[]> = {
  'components/experiences/ExperiencesHub.tsx': [
    'trackBookClick(e, i + 1, lang)', 'trackGuideClick(e, i + 1, lang)', 'trackListView(lang, experiences.length)',
    'trackPlanBook(x, pos, lang)', 'trackPlanChange(now ? \'add\' : \'remove\', entry, next.length, lang)',
    "trackPlanHandoff(slug, count, mixed, 'panel', lang)", "trackPlannerCta(conciergeDestination?.slug ?? null, 'experience_hub', lang)",
    'trackFilterChange(lang, filters, clean, filterExperiences(experiences, clean).length)',
  ],
  'components/hotels/HotelsClient.tsx': [
    'trackHotelBook(h, i + 1, lang)', 'trackHotelFilter(lang, filters, next, filterHotels(hotels, next).length)',
    'trackPlanBook(x, pos, lang)', "trackPlanChange(now ? 'add' : 'remove', entry, next.length, lang)",
    "trackPlanHandoff(slug, count, mixed, 'panel', lang)",
  ],
}
for (const [f, calls] of Object.entries(CALLS)) {
  const src = read(f)
  for (const c of calls) ok(`${path.basename(f)} keeps ${c.split('(')[0]}(…)`, src.includes(c), c)
  const found = (src.match(/\btrack[A-Z][A-Za-z]*\(/g) ?? []).filter(m => m !== 'trackPlan(').length
  ok(`${path.basename(f)} makes no new tracking call`, found === calls.length, `${found} calls, expected ${calls.length}`)
}
ok('PlanTray still reports book and handoff', /onBook\?\.\(e, items\.indexOf\(e\) \+ 1\)/.test(read('components/catalog/PlanTray.tsx')) && /onHandoff\?\.\(dest\.slug, items\.length, dest\.mixed\)/.test(read('components/catalog/PlanTray.tsx')))

console.log(`catalog-migration: ${failed === 0 ? 'all passed' : `${failed} failed`}`)
process.exit(failed ? 1 : 0)
