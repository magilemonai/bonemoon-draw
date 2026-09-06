import type { CardDef, SignificatorDef, Suit } from '../engine/types'
import { SUNS } from './cards-suns'
import { ANTLERS } from './cards-antlers'
import { TIDES } from './cards-tides'
import { GEARS } from './cards-gears'
import { MAJORS } from './cards-major'
import { TOKENS } from './tokens'
import { SIGNIFICATORS } from './significators'

export const DECK_CARDS: CardDef[] = [...MAJORS, ...SUNS, ...ANTLERS, ...TIDES, ...GEARS]
export const ALL_CARDS: CardDef[] = [...DECK_CARDS, ...TOKENS]

const byId = new Map<string, CardDef>()
for (const c of ALL_CARDS) {
  if (byId.has(c.id)) throw new Error(`duplicate card id ${c.id}`)
  byId.set(c.id, c)
}

export function card(id: string): CardDef {
  const c = byId.get(id)
  if (!c) throw new Error(`unknown card ${id}`)
  return c
}

export function hasCard(id: string): boolean {
  return byId.has(id)
}

const sigById = new Map(SIGNIFICATORS.map((s) => [s.id, s]))
export function significator(id: string): SignificatorDef {
  const s = sigById.get(id)
  if (!s) throw new Error(`unknown significator ${id}`)
  return s
}

export { SIGNIFICATORS, SUNS, ANTLERS, TIDES, GEARS, MAJORS, TOKENS }

export const SUIT_NAMES: Record<Suit, string> = {
  suns: 'Suns',
  antlers: 'Antlers',
  tides: 'Tides',
  gears: 'Gears',
  major: 'Major Arcana',
}

export const RANK_LABELS: Record<string, string> = {
  ace: 'Ace',
  '2': 'Two',
  '3': 'Three',
  '4': 'Four',
  '5': 'Five',
  '6': 'Six',
  '7': 'Seven',
  '8': 'Eight',
  '9': 'Nine',
  '10': 'Ten',
  page: 'Page',
  knight: 'Knight',
  queen: 'Queen',
  king: 'King',
  token: 'Token',
}

// "Seven of Suns", "Knight of Gears", "XVII" for majors.
export function rankLine(c: CardDef): string {
  if (c.suit === 'major') return c.numeral ?? ''
  if (c.token) return 'Token'
  return `${RANK_LABELS[c.rank] ?? c.rank} of ${SUIT_NAMES[c.suit]}`
}
