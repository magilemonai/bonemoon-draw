// Writes docs/DESIGN_REVIEW_PACKET.md: everything an outside designer needs to critique the
// mechanics without touching the repo. Rules, every card's text, the Significators, a fresh
// AI-vs-AI sim, and the questions we want answered. Run: pnpm review-packet

import { readFileSync, writeFileSync } from 'node:fs'
import { ALL_CARDS, SIGNIFICATORS, SUIT_NAMES, card, rankLine } from '../src/data'
import { beginGame, createGame, finalState, runAction } from '../src/engine/engine'
import { chooseAction } from '../src/ai/ai'

const GAMES = 120

// ---- Sim ------------------------------------------------------------------
const wins = new Map<string, { w: number; g: number }>()
const rounds: number[] = []
const plays = new Map<string, number>()
const cardWins = new Map<string, number>()
for (let i = 0; i < GAMES; i++) {
  const a = SIGNIFICATORS[i % SIGNIFICATORS.length]
  const b = SIGNIFICATORS[(i * 7 + 3) % SIGNIFICATORS.length]
  const seed = 5000 + i * 13
  let s = createGame({ sigs: [a.id, b.id], seed })
  s = finalState(beginGame(s, false), s)
  const played: [Set<string>, Set<string>] = [new Set(), new Set()]
  let guard = 0
  while (s.phase !== 'over' && guard++ < 800) {
    const act = chooseAction(s, { seed })
    if (act.type === 'play') {
      const h = s.players[s.active].hand.find((x) => x.uid === act.uid)
      if (h) played[s.active].add(h.defId)
    }
    s = finalState(runAction(s, act, false), s)
  }
  rounds.push(s.round)
  for (const p of [0, 1] as const) {
    const sig = p === 0 ? a : b
    const r = wins.get(sig.id) ?? { w: 0, g: 0 }
    r.g++
    if (s.winner === p) r.w++
    wins.set(sig.id, r)
    for (const id of played[p]) {
      plays.set(id, (plays.get(id) ?? 0) + 1)
      if (s.winner === p) cardWins.set(id, (cardWins.get(id) ?? 0) + 1)
    }
  }
}
const avg = rounds.reduce((x, y) => x + y, 0) / rounds.length
const rows = [...plays.entries()].filter(([, n]) => n >= 8).map(([id, n]) => ({ id, n, wr: (cardWins.get(id) ?? 0) / n })).sort((x, y) => y.wr - x.wr)

// ---- Document ---------------------------------------------------------------
const L: string[] = []
const push = (...s: string[]) => L.push(...s)

push('# Moonwyld: design review packet')
push('')
push('A read-only snapshot of the game for an outside designer. It has the full rules, every card, the six playable Significators and their decks, and numbers from an AI-versus-AI simulation. The questions at the end are what we most want an opinion on. Nothing here needs to be edited; a written critique is the deliverable.')
push('')
push('## What we want back')
push('')
push('A critique in plain prose, organized by the questions below, with specific card names and numbers wherever possible. For any change you propose, say what problem it solves and what it might break. Proposals should stay inside the effect language the cards already use (the keywords and triggers you see on the cards); a new keyword is fine if it is defined in one sentence.')
push('')
push('## Questions')
push('')
push('1. **The two faces.** Choosing Upright or Reversed is meant to be the interesting decision on almost every play. Where is that choice obvious (one face is always right)? Which cards have a second face that nobody would ever choose? Which Reversed faces are so much better that the Upright face is dead?')
push('2. **Flipping as a weapon.** Wounds persist across a flip, so flipping a damaged wall kills it. Is that too strong, too niche, or right? Are there enough flip effects, and are they in the right suits?')
push('3. **Three lanes.** Each side holds at most three Figures, attacks go straight across, and Guard only redirects from adjacent empty lanes. Does the lane system create real positional decisions, or does it collapse into "play the biggest thing in the middle"? Is moving (one action, adjacent empty lane only) worth its cost?')
push('4. **The Bone Moon.** It rises on round ten and bites both players harder each round. Is round ten right? Should it scale faster? Is bringing it early (The Moon, Reversed) a real strategy or a gimmick?')
push('5. **Balance across Significators.** The sim below shows Masque, Luigi, and Rorik winning far more than Lirielle, Shazz, and Daxon. The AI is a greedy one-step planner and misplays control and Read-heavy decks, so treat the numbers as a hint. Which decks look weak on paper, and why?')
push('6. **Card-by-card.** Which cards are over- or under-costed for their rank? The rank-to-cost ladder is: Ace 1, Two and Three 2, Four and Five 3, Six and Seven 4, Eight 5, Nine 6, Ten 7, Page 2, Knight 4, Queen 6, King 8. Majors are priced individually.')
push('7. **Significator abilities.** Each is 2 Spark, once a turn, meant to be small. Are any of them too central or too irrelevant? Is any passive doing nothing?')
push('8. **What is missing.** What would a seasoned card-game player expect that is not here (mulligan, a second-player bonus beyond one extra card, a discard outlet, reach for finishing)? What is here that could be cut?')
push('')
push('## Rules')
push('')
push(readFileSync('docs/RULES.md', 'utf8').replace(/^# .*\n/, ''))
push('')
push('## Significators and decks')
push('')
for (const s of SIGNIFICATORS) {
  push(`### ${s.name}, ${s.numeral}. ${s.title}`)
  push('')
  push(`- Health 20. Suits: ${SUIT_NAMES[s.suits[0]]} and ${SUIT_NAMES[s.suits[1]]}. Deck: "${s.deckName}".`)
  push(`- Passive: ${s.passive}`)
  push(`- Ability (${s.abilityCost} Spark, once a turn): ${s.abilityName}. ${s.abilityText}`)
  const counts = new Map<string, number>()
  for (const id of s.deck) counts.set(id, (counts.get(id) ?? 0) + 1)
  push(`- Deck list: ${[...counts.entries()].map(([id, n]) => `${n}x ${card(id).name}`).join('; ')}`)
  push('')
}
push('## Every card')
push('')
push('Format: name, rank, type, cost, printed Attack/Health for Figures. Upright text, then Reversed text (with the Reversed name if it changes). Bold words are keywords defined in the rules.')
push('')
for (const suit of ['major', 'suns', 'antlers', 'tides', 'gears'] as const) {
  push(`### ${suit === 'major' ? 'Major Arcana' : `Suit of ${SUIT_NAMES[suit]}`}`)
  push('')
  for (const c of ALL_CARDS.filter((c) => c.suit === suit && !c.token)) {
    const stats = c.type === 'figure' ? `, ${c.attack}/${c.health}` : ''
    push(`**${c.name}** (${rankLine(c)}, ${c.type}, cost ${c.cost}${stats})`)
    push(`- Upright: ${c.upright.text || 'no text'}`)
    push(`- Reversed${c.reversed.name ? ` (${c.reversed.name})` : ''}: ${c.reversed.text || 'no text'}`)
    if (c.relic) push(`- As a Relic: Upright +${c.relic.upright.atk}/+${c.relic.upright.hp}; Reversed +${c.relic.reversed.atk}/+${c.relic.reversed.hp}.`)
    push('')
  }
}
push('### Tokens')
push('')
for (const c of ALL_CARDS.filter((c) => c.token)) {
  push(`**${c.name}** (token ${c.type}, ${c.attack}/${c.health}). Upright: ${c.upright.text || 'no text'} Reversed: ${c.reversed.text || 'no text'}`)
  push('')
}
push('## Simulation')
push('')
push(`${GAMES} games, a greedy one-step AI playing both sides, every Significator against a rotating opponent. Average length ${avg.toFixed(1)} rounds (shortest ${Math.min(...rounds)}, longest ${Math.max(...rounds)}). The Bone Moon rises in round 10.`)
push('')
push('| Significator | Wins | Games | Rate |')
push('|---|---|---|---|')
for (const [id, r] of wins) push(`| ${SIGNIFICATORS.find((s) => s.id === id)!.name} | ${r.w} | ${r.g} | ${((100 * r.w) / r.g).toFixed(0)}% |`)
push('')
push('Cards by win rate of the player who played them (at least 8 appearances). High is a hint of strength, low a hint of weakness, with the AI caveat above.')
push('')
push('| Card | Win rate | Games played |')
push('|---|---|---|')
for (const r of rows.slice(0, 15)) push(`| ${card(r.id).name} | ${(100 * r.wr).toFixed(0)}% | ${r.n} |`)
push('| ... | | |')
for (const r of rows.slice(-15)) push(`| ${card(r.id).name} | ${(100 * r.wr).toFixed(0)}% | ${r.n} |`)
push('')
writeFileSync('docs/DESIGN_REVIEW_PACKET.md', L.join('\n'))
console.log(`wrote docs/DESIGN_REVIEW_PACKET.md (${GAMES} games simulated, avg ${avg.toFixed(1)} rounds)`)
