// content/guia/agenda/index.ts
//
// Loader for content/guia/cdmx/agenda.json. Server-only (reads the filesystem
// at build time). An invalid file throws with every problem listed, so the
// build fails before anything is published.

import fs from 'node:fs'
import path from 'node:path'
import { agendaSchema, type Agenda } from './schema'

export type { Agenda, AgendaEvent, DayTrip, Category } from './schema'

export const AGENDA_FILE = path.join('content', 'guia', 'cdmx', 'agenda.json')

export function formatAgendaErrors(error: { issues: readonly { path: readonly PropertyKey[]; message: string }[] }): string {
  return error.issues
    .map((i) => `  ${i.path.reduce<string>((acc, k) => typeof k === 'number' ? `${acc}[${k}]` : acc ? `${acc}.${String(k)}` : String(k), '') || '(root)'}: ${i.message}`)
    .join('\n')
}

export function parseAgenda(raw: unknown): Agenda {
  const r = agendaSchema.safeParse(raw)
  if (!r.success) throw new Error(`Invalid ${AGENDA_FILE}:\n${formatAgendaErrors(r.error)}`)
  return r.data
}

let cache: Agenda | null = null
export function loadAgenda(file: string = process.env.AGENDA_FILE ?? path.join(process.cwd(), AGENDA_FILE)): Agenda {
  const useCache = file === (process.env.AGENDA_FILE ?? path.join(process.cwd(), AGENDA_FILE))
  if (useCache && cache) return cache
  let raw: unknown
  try { raw = JSON.parse(fs.readFileSync(file, 'utf8')) } catch (e) { throw new Error(`Cannot read ${AGENDA_FILE}: ${(e as Error).message}`) }
  const parsed = parseAgenda(raw)
  if (useCache) cache = parsed
  return parsed
}
