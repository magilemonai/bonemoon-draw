// Deck building rules. A reading is thirty cards: at most two copies of a Minor, one copy
// of a Major, never the Major that is your own Significator, and Minors only from your
// Significator's two suits. Tokens never sit in a deck. Luigi's Brog is added to his hand
// by the engine and takes no slot.

import { DECK_CARDS, SUIT_NAMES, card, hasCard, significator } from '../data'
import type { CardDef } from './types'

export const DECK_SIZE = 30

export function maxCopies(def: CardDef): number {
  return def.suit === 'major' || def.unique ? 1 : 2
}

// The cards a Significator may build with, in Codex order.
export function cardPoolFor(sigId: string): CardDef[] {
  const sig = significator(sigId)
  return DECK_CARDS.filter((c) => (c.suit === 'major' ? c.id !== sig.cardId : sig.suits.includes(c.suit)))
}

// The published starter list, as the engine deals it.
export function starterList(sigId: string): string[] {
  const sig = significator(sigId)
  return sig.deck.filter((id) => id !== sig.cardId)
}

export function countOf(cards: string[], id: string): number {
  return cards.reduce((n, c) => (c === id ? n + 1 : n), 0)
}

// Why one more copy of a card cannot go in, or null if it can.
export function addProblem(sigId: string, cards: string[], id: string): string | null {
  if (!hasCard(id)) return 'That card does not exist.'
  const def = card(id)
  const sig = significator(sigId)
  if (def.token) return `${def.name} is a token. Tokens are summoned, never drawn.`
  if (def.suit === 'major' && def.id === sig.cardId) return `${def.name} is ${sig.name}'s own card and cannot be in the deck.`
  if (def.suit !== 'major' && !sig.suits.includes(def.suit)) return `${def.name} is ${SUIT_NAMES[def.suit]}. ${sig.name}'s decks use ${SUIT_NAMES[sig.suits[0]]} and ${SUIT_NAMES[sig.suits[1]]}.`
  const have = countOf(cards, id)
  if (have >= maxCopies(def)) return maxCopies(def) === 1 ? `Only one copy of a Major Arcana.` : `Only two copies of ${def.name}.`
  if (cards.length >= DECK_SIZE) return `The deck is full at ${DECK_SIZE}.`
  return null
}

// Everything wrong with a list, in the words the builder shows. Empty when it can be played.
export function deckProblems(sigId: string, cards: string[]): string[] {
  const sig = significator(sigId)
  const out: string[] = []
  if (cards.length !== DECK_SIZE) out.push(`${cards.length} of ${DECK_SIZE} cards.`)
  const seen = new Set<string>()
  for (const id of cards) {
    if (seen.has(id)) continue
    seen.add(id)
    if (!hasCard(id)) {
      out.push(`${id} is not a card in this version.`)
      continue
    }
    const def = card(id)
    const n = countOf(cards, id)
    if (def.token) out.push(`${def.name} is a token and cannot be in a deck.`)
    else if (def.suit === 'major' && def.id === sig.cardId) out.push(`${def.name} is ${sig.name}'s own card. Remove it.`)
    else if (def.suit !== 'major' && !sig.suits.includes(def.suit)) out.push(`${def.name} is ${SUIT_NAMES[def.suit]}, outside ${sig.name}'s suits. Remove it.`)
    else if (n > maxCopies(def)) out.push(n - maxCopies(def) === 1 ? `Remove one extra copy of ${def.name}.` : `Remove ${n - maxCopies(def)} extra copies of ${def.name}.`)
  }
  return out
}

export function isLegalDeck(sigId: string, cards: string[]): boolean {
  return deckProblems(sigId, cards).length === 0
}

// The shape of a list, for the builder's summary. Costs are printed costs; a
// Significator's discounts are not applied.
export function deckShape(cards: string[]): { curve: number[]; figures: number; omens: number; relics: number } {
  const curve = Array.from({ length: 9 }, () => 0) // 0..7 and 8+
  let figures = 0
  let omens = 0
  let relics = 0
  for (const id of cards) {
    if (!hasCard(id)) continue
    const def = card(id)
    curve[Math.min(8, def.cost)] += 1
    if (def.type === 'figure') figures += 1
    else if (def.type === 'omen') omens += 1
    else relics += 1
  }
  return { curve, figures, omens, relics }
}

// Two lists hold the same cards, whatever their order.
export function sameList(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  const x = a.slice().sort()
  const y = b.slice().sort()
  return x.every((id, i) => id === y[i])
}
