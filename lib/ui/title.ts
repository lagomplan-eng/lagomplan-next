/**
 * lib/ui/title.ts
 * Utilities for rendering titles/subtitles/headings per the Lagomplan design
 * system, which says:
 *   - no trailing punctuation (periods, bangs, ellipses) on titles
 *   - no italic
 *   - no serif
 *
 * The no-italic / no-serif rules are enforced globally in app/globals.css.
 * Trailing punctuation is a content concern and has to be stripped per string.
 *
 * Use `stripTitlePunctuation()` when piping translations, CMS content, or any
 * dynamic source into a heading element. Copy authored directly in this repo
 * should also be written without trailing punctuation.
 */

const TRAILING_PUNCT = /[.!?…]+\s*$/

/**
 * Removes trailing terminal punctuation from a title string.
 * Keeps internal punctuation and commas intact.
 *
 * Examples:
 *   "Balance in every trip." → "Balance in every trip"
 *   "No hotels match your search." → "No hotels match your search"
 *   "Lagom — not too little. Just right." → "Lagom — not too little. Just right"
 *   "Your next trip," → "Your next trip,"  (commas preserved — valid mid-phrase)
 */
export function stripTitlePunctuation(value: string): string {
  return value.replace(TRAILING_PUNCT, '')
}
