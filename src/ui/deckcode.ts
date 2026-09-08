// A deck as one line of text, to hand to a friend without the whole record:
//   MW1 sig-shazz antlers-2x2 antlers-5x2 ...
// Card ids and counts, nothing else; the game checks the list against the rules on arrival.
import { SIGNIFICATORS, hasCard } from '../data'

export function encodeDeck(sig: string, cards: string[]): string {
  const counts = new Map<string, number>()
  for (const id of cards) counts.set(id, (counts.get(id) ?? 0) + 1)
  const parts = [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([id, n]) => (n === 1 ? id : `${id}x${n}`))
  return `MW1 ${sig} ${parts.join(' ')}`
}

export function decodeDeck(text: string): { sig: string; cards: string[] } | null {
  const parts = text.trim().split(/\s+/)
  if (parts.length < 2 || parts[0] !== 'MW1') return null
  const sig = parts[1]
  if (!SIGNIFICATORS.some((s) => s.id === sig)) return null
  const cards: string[] = []
  for (const p of parts.slice(2)) {
    const m = /^([a-z0-9-]+?)(?:x(\d+))?$/.exec(p)
    if (!m || !hasCard(m[1])) return null
    const n = m[2] ? Number(m[2]) : 1
    if (!(n >= 1 && n <= 30)) return null
    for (let i = 0; i < n; i++) cards.push(m[1])
  }
  if (cards.length > 60) return null
  return { sig, cards }
}
