/**
 * tests/guide-checklist.test.ts — a checklist item's first word is an icon only when it is an emoji.
 * Before, any first word of 4 characters or fewer ("Una", "Sun", "Cash", "Ropa") was taken as the icon,
 * which rendered "Unamaleta vacía".
 *   npx tsx tests/guide-checklist.test.ts
 */
import { parseChecklistItem } from '../lib/data/guides/adapter'
import { getAllFlatGuides } from '../lib/data/guides'

let failed = 0
const eq = (name: string, got: unknown, want: unknown) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) { failed++; console.error(`FAIL ${name}\n   got:  ${JSON.stringify(got)}\n   want: ${JSON.stringify(want)}`) }
}

eq('"Una maleta vacía…" is plain text, not an icon', parseChecklistItem('Una maleta vacía o plegable para las compras'), { emoji: '•', label: 'Una maleta vacía o plegable para las compras' })
eq('"Sun protection" is plain text', parseChecklistItem('Sun protection for everyone').emoji, '•')
eq('"Cash in small bills" is plain text', parseChecklistItem('Cash in small bills').emoji, '•')
eq('"A light jacket" is plain text', parseChecklistItem('A light jacket').label, 'A light jacket')
eq('a real emoji is still split off', parseChecklistItem('🎒 Mochila ligera'), { emoji: '🎒', label: 'Mochila ligera' })
eq('an emoji with a variation selector is still split off', parseChecklistItem('☀️ Bloqueador solar'), { emoji: '☀️', label: 'Bloqueador solar' })
eq('a bullet character is an icon too', parseChecklistItem('• Pasaportes vigentes').emoji, '•')
eq('a single word is plain text', parseChecklistItem('Pasaporte'), { emoji: '•', label: 'Pasaporte' })

// No item of any guide may have a letter-bearing "icon" (that would eat the first word of the label)
for (const locale of ['es', 'en']) {
  const bad: string[] = []
  for (const { canonical, flat } of getAllFlatGuides(locale)) for (const c of flat.checklist) {
    const { emoji } = parseChecklistItem(c)
    if (/[\p{L}\p{N}]/u.test(emoji)) bad.push(`${canonical}: ${c.slice(0, 40)}`)
  }
  eq(`no guide checklist item (${locale}) loses its first word to a fake icon`, bad, [])
}

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('guide-checklist: all passed')
