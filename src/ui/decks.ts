// Saved decks. A starter list is virtual (never stored); a built deck is stored in this
// browser with a revision that ticks on every change, so a match can say which list and
// which revision it was played with.

import { SIGNIFICATORS, hasCard, significator } from '../data'
import { starterList } from '../engine/deck'

export interface DeckList {
  id: string
  name: string
  sig: string
  cards: string[]
  rev: number
  updated: number
}

export interface DeckStamp {
  id: string
  name: string
  rev: number
  starter: boolean
}

export const STARTER_PREFIX = 'starter:'
export const isStarterId = (id: string) => id.startsWith(STARTER_PREFIX)
export const starterId = (sig: string) => `${STARTER_PREFIX}${sig}`

export function starterDeck(sig: string): DeckList {
  const s = significator(sig)
  return { id: starterId(sig), name: s.deckName, sig, cards: starterList(sig), rev: 0, updated: 0 }
}

export function resolveDeck(decks: DeckList[], id: string): DeckList | null {
  if (isStarterId(id)) {
    const sig = id.slice(STARTER_PREFIX.length)
    return SIGNIFICATORS.some((s) => s.id === sig) ? starterDeck(sig) : null
  }
  return decks.find((d) => d.id === id) ?? null
}

export function stampOf(d: DeckList): DeckStamp {
  return { id: d.id, name: d.name, rev: d.rev, starter: isStarterId(d.id) }
}

export function decksFor(decks: DeckList[], sig: string): DeckList[] {
  return decks.filter((d) => d.sig === sig)
}

function uniqueName(decks: DeckList[], sig: string, base: string): string {
  const taken = new Set(decksFor(decks, sig).map((d) => d.name))
  if (!taken.has(base)) return base
  for (let n = 2; n < 100; n++) if (!taken.has(`${base} ${n}`)) return `${base} ${n}`
  return `${base} ${Date.now()}`
}

// A new deck: a copy of another list, or empty.
export function newDeck(decks: DeckList[], sig: string, from?: DeckList): DeckList {
  const base = from ? (isStarterId(from.id) ? `${from.name}, my way` : `${from.name} copy`) : 'New deck'
  return { id: `d-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`, name: uniqueName(decks, sig, base), sig, cards: from ? from.cards.slice() : [], rev: 1, updated: Date.now() }
}

export function withCards(d: DeckList, cards: string[]): DeckList {
  return { ...d, cards, rev: d.rev + 1, updated: Date.now() }
}

export function withName(d: DeckList, name: string): DeckList {
  return { ...d, name: name.trim() || d.name, updated: Date.now() }
}

export function upsert(decks: DeckList[], d: DeckList): DeckList[] {
  const i = decks.findIndex((x) => x.id === d.id)
  if (i < 0) return [...decks, d]
  const out = decks.slice()
  out[i] = d
  return out
}

export function remove(decks: DeckList[], id: string): DeckList[] {
  return decks.filter((d) => d.id !== id)
}

// ---- Storage --------------------------------------------------------------------

const KEY = 'bonemoon.decks'

export function parseDecks(raw: unknown): DeckList[] | null {
  const p = raw as { v?: number; decks?: unknown } | null
  if (!p || typeof p !== 'object' || !Array.isArray(p.decks)) return null
  const out: DeckList[] = []
  for (const d of p.decks as Partial<DeckList>[]) {
    if (!d || typeof d.id !== 'string' || typeof d.name !== 'string' || typeof d.sig !== 'string' || !Array.isArray(d.cards)) continue
    if (!SIGNIFICATORS.some((s) => s.id === d.sig)) continue
    out.push({ id: d.id, name: d.name, sig: d.sig, cards: (d.cards as unknown[]).filter((c): c is string => typeof c === 'string' && hasCard(c)), rev: typeof d.rev === 'number' ? d.rev : 1, updated: typeof d.updated === 'number' ? d.updated : 0 })
  }
  return out
}

export function loadDecks(): DeckList[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return parseDecks(JSON.parse(raw)) ?? []
  } catch {
    return []
  }
}

export function saveDecks(decks: DeckList[]): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: 1, decks }))
    return true
  } catch {
    return false
  }
}
