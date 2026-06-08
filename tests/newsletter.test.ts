/**
 * tests/newsletter.test.ts
 *
 * Unit suite for lib/newsletter — the pure logic behind POST /api/subscribe
 * (Mailchimp). Focus: email validation and the env-config guard that produces
 * "Server configuration error" when MAILCHIMP_* vars are absent (the failure
 * seen on non-main Vercel previews where the vars are scoped to Preview (main)).
 *
 *   npx tsx tests/newsletter.test.ts
 */

import { isValidNewsletterEmail, readMailchimpConfig, mailchimpMembersUrl } from '../lib/newsletter'

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []
function expectEq<T>(name: string, got: T, expected: T) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  results.push({ name, pass, detail: pass ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}` })
}

// ───────── isValidNewsletterEmail (N-01..N-04) ─────────
expectEq('N-01 accepts a normal address', isValidNewsletterEmail('elena@yahoo.com'), true)
expectEq('N-01b trims + lowercases before checking', isValidNewsletterEmail('  Elena@Yahoo.com  '), true)
expectEq('N-02 rejects missing @', isValidNewsletterEmail('elena.yahoo.com'), false)
expectEq('N-02b rejects missing domain dot', isValidNewsletterEmail('elena@yahoo'), false)
expectEq('N-02c rejects internal whitespace', isValidNewsletterEmail('el ena@yahoo.com'), false)
expectEq('N-03 rejects empty string', isValidNewsletterEmail(''), false)
expectEq('N-04 rejects null/undefined', [isValidNewsletterEmail(null), isValidNewsletterEmail(undefined)], [false, false])

// ───────── readMailchimpConfig (N-05..N-09) — the "Server configuration error" guard ─────────
const FULL = { MAILCHIMP_API_KEY: 'abcdef1234567890-us13', MAILCHIMP_LIST_ID: '71a26fbc9a', MAILCHIMP_TAG: 'homepage' } as any

expectEq('N-05 returns config when key + list present',
  readMailchimpConfig(FULL),
  { apiKey: 'abcdef1234567890-us13', listId: '71a26fbc9a', tag: 'homepage', dc: 'us13' })

expectEq('N-06 parses the datacenter from the key suffix',
  readMailchimpConfig(FULL)?.dc, 'us13')

expectEq('N-07 returns null when API key missing (→ Server configuration error)',
  readMailchimpConfig({ MAILCHIMP_LIST_ID: '71a26fbc9a' } as any), null)

expectEq('N-08 returns null when list id missing (→ Server configuration error)',
  readMailchimpConfig({ MAILCHIMP_API_KEY: 'abcdef-us13' } as any), null)

expectEq('N-08b returns null when both empty strings (the non-main-preview case)',
  readMailchimpConfig({ MAILCHIMP_API_KEY: '', MAILCHIMP_LIST_ID: '' } as any), null)

expectEq('N-09 tag is optional — config still returned without it',
  readMailchimpConfig({ MAILCHIMP_API_KEY: 'k-us5', MAILCHIMP_LIST_ID: 'abc' } as any),
  { apiKey: 'k-us5', listId: 'abc', tag: '', dc: 'us5' })

// ───────── mailchimpMembersUrl (N-10) ─────────
expectEq('N-10 builds the members endpoint URL',
  mailchimpMembersUrl({ apiKey: 'k-us13', listId: '71a26fbc9a', tag: '', dc: 'us13' }),
  'https://us13.api.mailchimp.com/3.0/lists/71a26fbc9a/members')

// ───────── tally + exit ─────────
const passed = results.filter(r => r.pass).length
const failed = results.length - passed
console.log(`\nnewsletter: ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failed) {
  for (const f of results.filter(r => !r.pass)) console.log(`  ✗ ${f.name}\n      ${f.detail}`)
  console.log()
  process.exit(1)
}
process.exit(0)
