/**
 * tests/guide-newsletter-layout.test.ts — the sidebar newsletter card is hidden at the same breakpoint where
 * the guide grid collapses to one column (below it, the card would sit directly above NewsletterEndOfGuide).
 *   npx tsx tests/guide-newsletter-layout.test.ts
 */
import fs from 'node:fs'

let failed = 0
const ok = (name: string, cond: boolean) => { if (!cond) { failed++; console.error(`FAIL ${name}`) } }

const src = fs.readFileSync('components/guides/GuidePageClientV2.tsx', 'utf8')
const collapse = /grid-cols-\[1fr_320px\][^"]*max-\[(\d+)px\]:grid-cols-1/.exec(src)?.[1]
const hide = /className="max-\[(\d+)px\]:hidden">\s*<NewsletterSidebarCard \/>/.exec(src)?.[1]

ok('the grid collapses to one column at a max-width breakpoint', !!collapse)
ok('the sidebar newsletter card is wrapped in a max-width "hidden" class', !!hide)
ok('both use the same breakpoint (960px)', collapse === hide && hide === '960')
ok('the end-of-guide newsletter is not hidden by a breakpoint class', /<div id="newsletter" className="-mt-8 print:hidden[^"]*">\s*<NewsletterEndOfGuide \/>/.test(src) && !/max-\[\d+px\]:hidden[^<]*>\s*<NewsletterEndOfGuide/.test(src))
ok('it has the id the expired seasonal band links to (#newsletter)', /id="newsletter"/.test(src))

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('guide-newsletter-layout: all passed')
