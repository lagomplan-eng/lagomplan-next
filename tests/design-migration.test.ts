/**
 * Home, /guias and the guide pages are built only from the design foundation:
 * no colour literals (hex, rgb/rgba numbers), no one-off font families, no legacy button / label classes,
 * and the shared components are what they import.
 * Print CSS (app/globals.css @media print) is a separate editorial theme and is not covered here.
 */
import fs from 'fs'
import path from 'path'

const root = path.join(__dirname, '..')
let failed = 0
function ok(name: string, cond: boolean, detail = '') {
  if (cond) console.log(`ok   ${name}`)
  else { failed++; console.log(`FAIL ${name}${detail ? ` — ${detail}` : ''}`) }
}
const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '')

const PAGES = [
  'app/[locale]/page.tsx',
  'components/GuidesPreview.tsx',
  'components/examples/ExamplesCta.tsx',
  'components/forms/HeroForm.tsx',
  'components/forms/NewsletterForm.tsx',
  'components/forms/PlacesInput.tsx',
  'components/forms/DateRangePicker.tsx',
  'components/guides/GuidesClient.tsx',
  'components/guides/GuidePageClientV2.tsx',
  'components/guides/GuideHero.tsx',
  'components/guides/GuideSectionHeader.tsx',
  'components/guides/Itinerary.tsx',
  'components/guides/DayCard.tsx',
  'components/guides/HotelsSection.tsx',
  'components/guides/ExperiencesSection.tsx',
  'components/guides/GuideFreeIndicator.tsx',
  'components/guides/GuideTimely.tsx',
  'components/guides/SeasonalEdition.tsx',
  'components/guides/CuratedGuideShareModal.tsx',
  'components/guides/RightColumn/Tips.tsx',
  'components/guides/RightColumn/PlanCTA.tsx',
  'components/guides/RightColumn/Checklist.tsx',
  'components/guides/RightColumn/Transport.tsx',
  'components/newsletter/NewsletterSidebarCard.module.css',
  'components/newsletter/NewsletterEndOfGuide.module.css',
  'components/newsletter/NewsletterPopup.module.css',
]

const read = (f: string) => strip(fs.readFileSync(path.join(root, f), 'utf-8'))
const bad = (re: RegExp) => PAGES.filter(f => re.test(read(f)))

ok('migrated files exist', PAGES.every(f => fs.existsSync(path.join(root, f))))
ok('no hex colour literals', bad(/#[0-9a-fA-F]{3,8}\b/).length === 0, bad(/#[0-9a-fA-F]{3,8}\b/).join(', '))
ok('no rgb()/rgba() colour numbers (use the token channels)', bad(/rgba?\(\s*\d/).length === 0, bad(/rgba?\(\s*\d/).join(', '))
ok('no one-off font families (font-mono / font-display / literal names)', bad(/font-mono|font-display|'DM Mono'|'Fraunces'|'Manrope'|'Playfair/).length === 0, bad(/font-mono|font-display|'DM Mono'|'Fraunces'|'Manrope'|'Playfair/).join(', '))
ok('no legacy button / label classes (btn-solid, btn-outline, sec-label)', bad(/btn-solid|btn-outline|sec-label/).length === 0, bad(/btn-solid|btn-outline|sec-label/).join(', '))
ok('no hardcoded Tailwind colour brackets (bg-[#…], text-[rgb…])', bad(/(?:bg|text|border|from|via|to|fill|stroke|ring)-\[(?:#|rgb)/).length === 0)

const uses = (f: string, names: string[]) => names.every(n => new RegExp(`\\b${n}\\b`).test(read(f)))
ok('home uses PageTitle, SectionTitle, InfoCard, Button', uses('app/[locale]/page.tsx', ['PageTitle', 'SectionTitle', 'InfoCard', 'Button']))
ok('/guias uses PageTitle, SectionTitle, DestinationCard, SearchInput, FilterPanel, Chip, Button', uses('components/guides/GuidesClient.tsx', ['PageTitle', 'SectionTitle', 'DestinationCard', 'SearchInput', 'FilterPanel', 'Chip', 'Button']))
ok('home guides preview uses DestinationCard', uses('components/GuidesPreview.tsx', ['DestinationCard']))
ok('guide hero uses PageTitle, Tag, Button', uses('components/guides/GuideHero.tsx', ['PageTitle', 'Tag', 'Button']))
ok('guide sections use InfoCard and Tag/Button', uses('components/guides/HotelsSection.tsx', ['InfoCard', 'Tag', 'Button']) && uses('components/guides/ExperiencesSection.tsx', ['InfoCard', 'Tag', 'Button']) && uses('components/guides/DayCard.tsx', ['InfoCard', 'Tag']))
ok('/guias filters: no "+ Más" toggle and no showSecondary state (one pattern: inline chips, mobile sheet)', !/showSecondary|\+ Más|\+ More/.test(read('components/guides/GuidesClient.tsx')))

// The PDF stylesheet hooks the guide pages rely on must survive the migration.
const hooks: Record<string, string[]> = {
  'components/guides/GuideHero.tsx': ['data-guide="hero"', 'data-hero="eyebrow"', 'data-hero="subtitle"', 'data-hero="chips"'],
  'components/guides/GuideSectionHeader.tsx': ['data-section'],
  'components/guides/DayCard.tsx': ['data-day="card"', 'data-day="header"', 'data-day="body"', 'data-day="item"'],
  'components/guides/RightColumn/Tips.tsx': ['data-guide="tips"'],
  'components/guides/RightColumn/Checklist.tsx': ['data-guide="checklist"'],
  'components/guides/RightColumn/Transport.tsx': ['data-guide="transport"'],
  'components/guides/RightColumn/PlanCTA.tsx': ['data-guide="plan-cta"'],
}
for (const [f, list] of Object.entries(hooks)) ok(`print hooks kept in ${path.basename(f)}`, list.every(h => fs.readFileSync(path.join(root, f), 'utf-8').includes(h)))

console.log(`design-migration: ${failed === 0 ? 'all passed' : `${failed} failed`}`)
process.exit(failed ? 1 : 0)
