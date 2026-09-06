// Reproducible AI-vs-AI baseline with telemetry.
//   pnpm baseline                      -> docs/experiments/baseline.{json,md} and docs/BASELINE.md
//   pnpm baseline -- --variant rorik-conditional [--pairs 20] [--beam 5]
// Schedule: all 15 unordered hero pairings x N seed pairs x both seats = 30N games.
// Each hero keeps its own deck order across the seat swap (per-hero deck seeds).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { beginGame, createGame, finalState, mulligan, runAction } from '../src/engine/engine'
import { chooseAction, chooseMulligan } from '../src/ai/ai'
import { RULES } from '../src/engine/rules'
import { SIGNIFICATORS, card } from '../src/data'
import type { GameEvent, GameState, PlayerId } from '../src/engine/types'
import { VARIANTS } from './variants'

const argv = process.argv.slice(2)
const arg = (k: string, d: string) => {
  const i = argv.indexOf(`--${k}`)
  return i >= 0 ? argv[i + 1] : d
}
const variant = arg('variant', 'baseline')
const pairs = Number(arg('pairs', '20'))
const beam = Number(arg('beam', '5'))
const depth = Number(arg('depth', '2')) as 1 | 2
if (!VARIANTS[variant]) throw new Error(`unknown variant ${variant}; known: ${Object.keys(VARIANTS).join(', ')}`)
VARIANTS[variant].apply()

type LethalSource = 'attack' | 'omen' | 'boneMoon' | 'fatigue' | 'ability' | 'other'

interface HeroStats {
  games: number
  wins: number
  firstGames: number
  firstWins: number
  healing: number
  burns: number
  cardsPlayed: number
  uprightPlays: number
  reversedPlays: number
  lostTo: Record<LethalSource, number>
}
const heroes = SIGNIFICATORS.map((s) => s.id)
const stats: Record<string, HeroStats> = {}
for (const h of heroes) stats[h] = { games: 0, wins: 0, firstGames: 0, firstWins: 0, healing: 0, burns: 0, cardsPlayed: 0, uprightPlays: 0, reversedPlays: 0, lostTo: { attack: 0, omen: 0, boneMoon: 0, fatigue: 0, ability: 0, other: 0 } }
const matchup: Record<string, Record<string, { w: number; g: number }>> = {}
for (const a of heroes) {
  matchup[a] = {}
  for (const b of heroes) matchup[a][b] = { w: 0, g: 0 }
}
const cardUse: Record<string, { up: number; rev: number; upWins: number; revWins: number }> = {}
const rounds: number[] = []
let moonGames = 0
let draws = 0
let firstSeatWins = 0
let totalGames = 0
const traces: string[] = []

function hash(a: number, b: number): number {
  let h = (a ^ 0x9e3779b9) | 0
  h = Math.imul(h ^ b, 0x85ebca6b)
  h ^= h >>> 13
  return h | 0
}

function playGame(sigs: [string, string], seed: number, deckSeeds: [number, number]): void {
  let s: GameState = createGame({ sigs, seed, firstPlayer: 0, deckSeeds })
  if (RULES.mulligan) {
    for (const p of [0, 1] as PlayerId[]) s = mulligan(s, p, chooseMulligan(s, p))
  }
  s = finalState(beginGame(s, false), s)
  const played: Record<PlayerId, { defId: string; face: 'upright' | 'reversed' }[]> = { 0: [], 1: [] }
  const healing: [number, number] = [0, 0]
  let lethal: LethalSource = 'other'
  let guard = 0
  const trace: string[] = []
  while (s.phase !== 'over' && guard++ < 900) {
    const act = chooseAction(s, { seed, depth, beam })
    const steps = runAction(s, act, false)
    let marker: LethalSource = 'other'
    for (const st of steps) {
      const ev: GameEvent = st.ev
      if (ev.kind === 'attackStart') marker = 'attack'
      else if (ev.kind === 'omen') marker = 'omen'
      else if (ev.kind === 'boneMoonBite') marker = 'boneMoon'
      else if (ev.kind === 'fatigue') marker = 'fatigue'
      else if (ev.kind === 'ability') marker = 'ability'
      else if (ev.kind === 'played') {
        played[ev.player].push({ defId: ev.defId, face: ev.face })
        if (traces.length < 3) trace.push(`r${st.state.round} p${ev.player} plays ${card(ev.defId).name} (${ev.face})`)
      } else if (ev.kind === 'heal' && ev.target.kind === 'sig') healing[ev.target.player] += ev.n
      else if (ev.kind === 'damage' && ev.target.kind === 'sig' && st.state.players[ev.target.player].health <= 0) lethal = marker
    }
    s = finalState(steps, s)
  }
  totalGames++
  rounds.push(s.round)
  if (s.round >= s.boneMoonRound) moonGames++
  if (s.winner === 'draw' || s.winner === null) draws++
  else if (s.winner === 0) firstSeatWins++
  for (const p of [0, 1] as PlayerId[]) {
    const h = stats[sigs[p]]
    h.games++
    if (p === 0) h.firstGames++
    const won = s.winner === p
    if (won) {
      h.wins++
      if (p === 0) h.firstWins++
    } else if (s.winner !== 'draw' && s.winner !== null) h.lostTo[lethal]++
    h.healing += healing[p]
    h.burns += s.players[p].burnsThisGame
    h.cardsPlayed += played[p].length
    for (const c of played[p]) {
      if (c.face === 'upright') h.uprightPlays++
      else h.reversedPlays++
      const cu = (cardUse[c.defId] ??= { up: 0, rev: 0, upWins: 0, revWins: 0 })
      if (c.face === 'upright') {
        cu.up++
        if (won) cu.upWins++
      } else {
        cu.rev++
        if (won) cu.revWins++
      }
    }
    const opp = sigs[p === 0 ? 1 : 0]
    matchup[sigs[p]][opp].g++
    if (won) matchup[sigs[p]][opp].w++
  }
  if (traces.length < 3) traces.push(`${sigs[0]} vs ${sigs[1]} seed ${seed}: ${s.winner === 'draw' ? 'draw' : 'winner ' + sigs[s.winner!]} in round ${s.round} by ${lethal}\n  ` + trace.slice(0, 14).join('\n  '))
}

const t0 = Date.now()
let pairIndex = 0
for (let i = 0; i < heroes.length; i++) {
  for (let j = i + 1; j < heroes.length; j++) {
    pairIndex++
    for (let k = 0; k < pairs; k++) {
      const seed = 20260906 + pairIndex * 104729 + k * 7919
      const sA = hash(seed, i + 1)
      const sB = hash(seed, j + 1)
      playGame([heroes[i], heroes[j]], seed, [sA, sB])
      playGame([heroes[j], heroes[i]], seed + 1, [sB, sA])
    }
    process.stderr.write(`pairing ${pairIndex}/15 done (${totalGames} games, ${((Date.now() - t0) / 1000).toFixed(0)}s)\n`)
  }
}

// ---- Report ------------------------------------------------------------------
const name = (id: string) => SIGNIFICATORS.find((s) => s.id === id)!.name
const pct = (w: number, g: number) => (g ? `${((100 * w) / g).toFixed(0)}%` : 'n/a')
const avgRounds = rounds.reduce((a, b) => a + b, 0) / rounds.length
const hist: Record<string, number> = {}
for (const r of rounds) {
  const b = r <= 6 ? '5 to 6' : r <= 8 ? '7 to 8' : r <= 10 ? '9 to 10' : r <= 12 ? '11 to 12' : '13 and up'
  hist[b] = (hist[b] ?? 0) + 1
}
const lethalTotals: Record<LethalSource, number> = { attack: 0, omen: 0, boneMoon: 0, fatigue: 0, ability: 0, other: 0 }
for (const h of heroes) for (const k of Object.keys(lethalTotals) as LethalSource[]) lethalTotals[k] += stats[h].lostTo[k]

const L: string[] = []
L.push(`# ${variant === 'baseline' ? 'Baseline' : `Experiment: ${variant}`}`)
L.push('')
L.push(`${VARIANTS[variant].summary}`)
L.push('')
L.push(`${totalGames} games: 15 hero pairings, ${pairs} seed pairs each, both seats, each hero keeping its own deck order across the seat swap. Planner depth ${depth}, beam ${beam}. Run on ${new Date().toISOString().slice(0, 10)} in ${((Date.now() - t0) / 1000).toFixed(0)} seconds.`)
L.push('')
L.push(`Average length ${avgRounds.toFixed(1)} rounds. ${draws} draws. First seat won ${pct(firstSeatWins, totalGames - draws)} of decided games. The Bone Moon was up at the end of ${pct(moonGames, totalGames)} of games.`)
L.push('')
L.push('## Heroes')
L.push('')
L.push('| Hero | Win rate | Games | First seat | Second seat | Heal per game | Burns per game | Upright plays | Reversed plays |')
L.push('|---|---|---|---|---|---|---|---|---|')
for (const h of heroes) {
  const st = stats[h]
  const second = st.games - st.firstGames
  L.push(`| ${name(h)} | ${pct(st.wins, st.games)} | ${st.games} | ${pct(st.firstWins, st.firstGames)} | ${pct(st.wins - st.firstWins, second)} | ${(st.healing / st.games).toFixed(1)} | ${(st.burns / st.games).toFixed(2)} | ${pct(st.uprightPlays, st.uprightPlays + st.reversedPlays)} | ${pct(st.reversedPlays, st.uprightPlays + st.reversedPlays)} |`)
}
L.push('')
L.push('## Matchups (row hero win rate against column hero, both seats combined)')
L.push('')
L.push(`| | ${heroes.map((h) => name(h).split(' ')[0]).join(' | ')} |`)
L.push(`|---|${heroes.map(() => '---').join('|')}|`)
for (const a of heroes) L.push(`| ${name(a).split(' ')[0]} | ${heroes.map((b) => (a === b ? '' : pct(matchup[a][b].w, matchup[a][b].g))).join(' | ')} |`)
L.push('')
L.push('## Game length')
L.push('')
for (const k of ['5 to 6', '7 to 8', '9 to 10', '11 to 12', '13 and up']) L.push(`- Rounds ${k}: ${hist[k] ?? 0}`)
L.push('')
L.push('## How games ended (the blow that took the loser to zero)')
L.push('')
for (const k of Object.keys(lethalTotals) as LethalSource[]) L.push(`- ${k}: ${lethalTotals[k]}`)
L.push('')
L.push('Per hero, what they lost to:')
L.push('')
L.push('| Hero | attack | omen | Bone Moon | fatigue | ability | other |')
L.push('|---|---|---|---|---|---|---|')
for (const h of heroes) {
  const l = stats[h].lostTo
  L.push(`| ${name(h)} | ${l.attack} | ${l.omen} | ${l.boneMoon} | ${l.fatigue} | ${l.ability} | ${l.other} |`)
}
L.push('')
L.push('## Face usage by card (plays and win rate when played on that face; at least 10 plays)')
L.push('')
L.push('| Card | Upright plays | Upright win | Reversed plays | Reversed win |')
L.push('|---|---|---|---|---|')
const rows = Object.entries(cardUse)
  .filter(([, u]) => u.up + u.rev >= 10)
  .sort((x, y) => y[1].up + y[1].rev - (x[1].up + x[1].rev))
for (const [id, u] of rows) L.push(`| ${card(id).name} | ${u.up} | ${pct(u.upWins, u.up)} | ${u.rev} | ${pct(u.revWins, u.rev)} |`)
L.push('')
L.push('## Sample traces (first 14 plays)')
L.push('')
for (const t of traces) L.push('```', t, '```', '')

mkdirSync('docs/experiments', { recursive: true })
const json = { variant, summary: VARIANTS[variant].summary, games: totalGames, pairs, depth, beam, avgRounds, draws, firstSeatWins, moonGames, stats, matchup, cardUse, hist, lethalTotals }
writeFileSync(`docs/experiments/${variant}.json`, JSON.stringify(json, null, 2) + '\n')

// Delta against the baseline, if one exists and this is not it.
if (variant !== 'baseline' && existsSync('docs/experiments/baseline.json')) {
  const base = JSON.parse(readFileSync('docs/experiments/baseline.json', 'utf8'))
  L.push('## Change against the baseline')
  L.push('')
  L.push(`Average length ${base.avgRounds.toFixed(1)} to ${avgRounds.toFixed(1)} rounds.`)
  L.push('')
  L.push('| Hero | Baseline | This run | Change |')
  L.push('|---|---|---|---|')
  for (const h of heroes) {
    const b = base.stats[h]
    const n = stats[h]
    const br = (100 * b.wins) / b.games
    const nr = (100 * n.wins) / n.games
    L.push(`| ${name(h)} | ${br.toFixed(0)}% | ${nr.toFixed(0)}% | ${nr - br >= 0 ? '+' : ''}${(nr - br).toFixed(0)} |`)
  }
  L.push('')
  L.push(`With ${stats[heroes[0]].games} games per hero, a swing under about 7 points is inside the noise.`)
  L.push('')
}
writeFileSync(`docs/experiments/${variant}.md`, L.join('\n'))
if (variant === 'baseline') writeFileSync('docs/BASELINE.md', L.join('\n'))
console.log(L.slice(0, 20).join('\n'))
