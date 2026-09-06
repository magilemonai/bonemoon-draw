// AI-vs-AI balance sim. Run: pnpm sim [games]
import { beginGame, createGame, finalState, runAction } from '../src/engine/engine'
import { chooseAction } from '../src/ai/ai'
import { SIGNIFICATORS, card } from '../src/data'

const games = Number(process.argv[2] ?? 60)
const wins = new Map<string, { w: number; g: number }>()
const rounds: number[] = []
const cardPlays = new Map<string, number>()
const cardWins = new Map<string, number>()
let firstWins = 0
let draws = 0

for (let i = 0; i < games; i++) {
  const a = SIGNIFICATORS[i % SIGNIFICATORS.length]
  const b = SIGNIFICATORS[(i * 7 + 3) % SIGNIFICATORS.length]
  const seed = 1000 + i * 17
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
    const rec = wins.get(sig.id) ?? { w: 0, g: 0 }
    rec.g++
    if (s.winner === p) rec.w++
    wins.set(sig.id, rec)
    for (const id of played[p]) {
      cardPlays.set(id, (cardPlays.get(id) ?? 0) + 1)
      if (s.winner === p) cardWins.set(id, (cardWins.get(id) ?? 0) + 1)
    }
  }
  if (s.winner === 'draw') draws++
  else if (s.winner !== null && ((s.turn % 2 === 1) === (s.winner === s.active))) firstWins++
}

const avg = rounds.reduce((x, y) => x + y, 0) / rounds.length
console.log(`games=${games} avgRounds=${avg.toFixed(1)} min=${Math.min(...rounds)} max=${Math.max(...rounds)} draws=${draws}`)
console.log('Significator win rates:')
for (const [id, r] of wins) console.log(`  ${id.padEnd(14)} ${r.w}/${r.g}  ${((100 * r.w) / r.g).toFixed(0)}%`)
console.log('Cards by win rate when played (min 8 games):')
const rows = [...cardPlays.entries()]
  .filter(([, n]) => n >= 8)
  .map(([id, n]) => ({ id, n, wr: (cardWins.get(id) ?? 0) / n }))
  .sort((x, y) => y.wr - x.wr)
for (const r of rows.slice(0, 10)) console.log(`  + ${card(r.id).name.padEnd(40)} ${(100 * r.wr).toFixed(0)}% (${r.n})`)
for (const r of rows.slice(-10)) console.log(`  - ${card(r.id).name.padEnd(40)} ${(100 * r.wr).toFixed(0)}% (${r.n})`)
