/**
 * tests/booking.test.ts
 *
 * Smoke + regression suite for lib/planner/booking — the pure helpers
 * powering the "Ya reservé" confirmation flow. Same framework-free
 * pattern as classify-block.test.ts. Run with:
 *
 *   npx tsx tests/booking.test.ts
 *
 * Exit code 0 on all-pass, 1 if anything failed.
 *
 * Coverage:
 *   - sanitizeBookingUrl: scheme allowlist (security), edge inputs,
 *     length cap, whitespace trim, non-string rejection.
 *   - resolveAccommodationIndex: id match, "acc-N" position parsing,
 *     "acc-fallback-*" append, tamper-guard upper bound, empty array.
 */

import {
  sanitizeBookingUrl,
  resolveAccommodationIndex,
} from '../lib/planner/booking'

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []

function expectEq<T>(name: string, got: T, expected: T) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  results.push({
    name,
    pass,
    detail: pass ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`,
  })
}

// ───────── sanitizeBookingUrl ─────────

// Accept paths
expectEq('https URL passes through',
  sanitizeBookingUrl('https://www.booking.com/confirmation/12345'),
  'https://www.booking.com/confirmation/12345')

expectEq('http URL accepted (some legacy confirmation pages)',
  sanitizeBookingUrl('http://example.com/c'),
  'http://example.com/c')

expectEq('whitespace trimmed before validation',
  sanitizeBookingUrl('   https://example.com/  '),
  'https://example.com/')

expectEq('URL with query string + fragment preserved',
  sanitizeBookingUrl('https://example.com/c?id=42&lang=es#section'),
  'https://example.com/c?id=42&lang=es#section')

// Reject paths — security-critical
expectEq('javascript: scheme rejected',
  sanitizeBookingUrl('javascript:alert(1)'),
  undefined)

expectEq('data: scheme rejected',
  sanitizeBookingUrl('data:text/html,<script>alert(1)</script>'),
  undefined)

expectEq('file: scheme rejected',
  sanitizeBookingUrl('file:///etc/passwd'),
  undefined)

expectEq('ftp: scheme rejected',
  sanitizeBookingUrl('ftp://example.com'),
  undefined)

// Reject paths — input shape
expectEq('non-string number → undefined',
  sanitizeBookingUrl(12345),
  undefined)

expectEq('null → undefined',
  sanitizeBookingUrl(null),
  undefined)

expectEq('undefined → undefined',
  sanitizeBookingUrl(undefined),
  undefined)

expectEq('empty string → undefined',
  sanitizeBookingUrl(''),
  undefined)

expectEq('whitespace-only string → undefined',
  sanitizeBookingUrl('   '),
  undefined)

expectEq('relative path (no scheme) → undefined',
  sanitizeBookingUrl('/foo/bar'),
  undefined)

expectEq('bare hostname (no scheme) → undefined',
  sanitizeBookingUrl('example.com'),
  undefined)

expectEq('mixed-case javascript scheme still rejected',
  sanitizeBookingUrl('JavaScript:alert(1)'),
  undefined)

// Length cap — 500 chars after trim. We feed 600 of a valid URL.
const longTail = 'a'.repeat(580)
const longUrl  = `https://example.com/${longTail}`
const sanitizedLong = sanitizeBookingUrl(longUrl)
expectEq('URL longer than 500 chars: defined result',
  typeof sanitizedLong === 'string',
  true)
// After truncation to 500 chars the URL parser still has to accept it,
// which it will because https://example.com/aaa…aaa is structurally valid.
expectEq('URL truncated to <=500 chars (allow for URL.toString normalization)',
  (sanitizedLong ?? '').length <= 500,
  true)

// ───────── resolveAccommodationIndex ─────────

const accSparse = [{ id: 'acc-0', booking: undefined }, { id: 'acc-1' }]

expectEq('match by stored id → returns its position',
  resolveAccommodationIndex(accSparse, 'acc-1'),
  1)

expectEq('"acc-N" with no stored id → parses N as index',
  resolveAccommodationIndex([], 'acc-3'),
  3)

expectEq('"acc-0" on empty array → returns 0 (caller pads)',
  resolveAccommodationIndex([], 'acc-0'),
  0)

expectEq('"acc-fallback-mexico-city" → append (length)',
  resolveAccommodationIndex(accSparse, 'acc-fallback-mexico-city'),
  2)

expectEq('"acc-fallback-*" on empty array → 0',
  resolveAccommodationIndex([], 'acc-fallback-paris'),
  0)

// Tamper guard — "acc-9999" must NOT be honored as a literal position;
// instead it falls through to append. Otherwise an attacker could pad
// trip_data.accommodations to an arbitrary length.
expectEq('out-of-range acc-N falls through to append (tamper guard)',
  resolveAccommodationIndex(accSparse, 'acc-9999'),
  accSparse.length)

expectEq('boundary: acc-49 is honored',
  resolveAccommodationIndex([], 'acc-49'),
  49)

expectEq('boundary: acc-50 falls through to append',
  resolveAccommodationIndex([], 'acc-50'),
  0)

expectEq('negative-looking id with non-matching pattern → append',
  resolveAccommodationIndex(accSparse, 'acc--1'),
  accSparse.length)

// Mixed entries — null/undefined items shouldn't crash findIndex
expectEq('null/undefined entries in array are tolerated',
  resolveAccommodationIndex(
    [null, undefined, { id: 'acc-2' }] as Array<{ id?: string } | null | undefined>,
    'acc-2',
  ),
  2)

// id match wins over "acc-N" position parse
expectEq('id match takes priority over acc-N position parse',
  resolveAccommodationIndex(
    [{ id: 'other' }, { id: 'acc-0' }],
    'acc-0',
  ),
  1)

// ───────── tally + exit ─────────

const passed = results.filter(r => r.pass).length
const failed = results.length - passed
const failures = results.filter(r => !r.pass)

console.log(`\nbooking: ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failures.length) {
  for (const f of failures) {
    console.log(`  ✗ ${f.name}\n      ${f.detail}`)
  }
  console.log()
  process.exit(1)
}
process.exit(0)
