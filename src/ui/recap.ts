// The loss recap: a reading played again from its seed and its actions, and a few
// factual lines about what decided it. Nothing here guesses at a better move; it counts
// what happened, from the engine's own events.
import { beginGame, createGame, finalState, runAction } from '../engine/engine'
import { card, significator } from '../data'
import type { Action, GameEvent, GameState, PlayerId, TargetRef } from '../engine/types'
import { shortSigName } from './names'

export interface MatchTrace {
  humanSig: string
  aiSig: string
  seed: number
  cards?: string[] // the human's list as dealt; the starter when absent
  firstPlayer?: PlayerId
  actions: Action[]
}

export interface ReplayStep {
  ev: GameEvent
  state: GameState // after the event
  before: GameState // at the start of the action
}

// Play the reading again. Same rules, same list, same deal, same actions: the same reading.
export function replay(t: MatchTrace): { steps: ReplayStep[]; final: GameState } {
  const g = createGame({ sigs: [t.humanSig, t.aiSig], seed: t.seed, humanPlayer: 0, firstPlayer: t.firstPlayer, decks: [t.cards, undefined] })
  let s = finalState(beginGame(g, false), g)
  const steps: ReplayStep[] = []
  for (const a of t.actions) {
    if (s.phase === 'over') break
    const before = s
    const st = runAction(s, a, false)
    for (const x of st) steps.push({ ev: x.ev, state: x.state, before })
    s = finalState(st, s)
  }
  return { steps, final: s }
}

type Blow = { kind: 'attack'; attacker: string } | { kind: 'omen'; name: string } | { kind: 'ability'; player: PlayerId } | { kind: 'boneMoon' } | { kind: 'fatigue' } | { kind: 'other' }

function figName(st: GameState, ref: TargetRef): string {
  if (ref.kind === 'sig') return shortSigName(st.players[ref.player].sigId, significator(st.players[ref.player].sigId).name)
  const f = ref.lane !== undefined ? st.players[ref.player].lanes[ref.lane] : null
  if (!f) return 'a Figure'
  const def = card(f.defId)
  return (f.face === 'reversed' ? def.reversed.name : def.upright.name) ?? def.name
}

// Up to five lines, most decisive first, for the human (player 0).
export function recapLines(t: MatchTrace): string[] {
  const { steps, final } = replay(t)
  if (final.phase !== 'over' || steps.length === 0) return []
  const me: PlayerId = 0
  const them: PlayerId = 1
  const iWon = final.winner === me
  const loser: PlayerId = iWon ? them : me
  const you = (p: PlayerId) => (p === me ? 'you' : shortSigName(final.players[p].sigId, significator(final.players[p].sigId).name))
  const lines: string[] = []

  // The blow: whatever was resolving when the loser's Health reached zero.
  let blow: Blow = { kind: 'other' }
  let blowRound = final.round
  let blowFrom = 0
  let hpBefore = final.players[loser].maxHealth
  for (const s of steps) {
    const ev = s.ev
    if (ev.kind === 'attackStart') blow = { kind: 'attack', attacker: figName(s.state, ev.attacker) }
    else if (ev.kind === 'omen') blow = { kind: 'omen', name: card(ev.defId).name }
    else if (ev.kind === 'ability') blow = { kind: 'ability', player: ev.player }
    else if (ev.kind === 'boneMoonBite') blow = { kind: 'boneMoon' }
    else if (ev.kind === 'fatigue') blow = { kind: 'fatigue' }
    else if (ev.kind === 'damage' && ev.target.kind === 'sig' && ev.target.player === loser && s.state.players[loser].health <= 0) {
      blowRound = s.state.round
      blowFrom = hpBefore
      break
    }
    if (ev.kind === 'damage' && ev.target.kind === 'sig' && ev.target.player === loser) hpBefore = s.state.players[loser].health
    if (ev.kind === 'heal' && ev.target.kind === 'sig' && ev.target.player === loser) hpBefore = s.state.players[loser].health
  }
  const who = iWon ? you(them) : 'you'
  const from = blowFrom > 0 ? ` from ${blowFrom}` : ''
  if (final.winner === 'draw') lines.push(`Round ${final.round}: both Significators fell together.`)
  else if (blow.kind === 'attack') lines.push(`Round ${blowRound}: ${blow.attacker}'s attack took ${who}${from} to 0.`)
  else if (blow.kind === 'omen') lines.push(`Round ${blowRound}: ${blow.name} took ${who}${from} to 0.`)
  else if (blow.kind === 'ability') lines.push(`Round ${blowRound}: ${significator(final.players[blow.player].sigId).abilityName} took ${who}${from} to 0.`)
  else if (blow.kind === 'boneMoon') lines.push(`Round ${blowRound}: the Bone Moon's bite took ${who}${from} to 0.`)
  else if (blow.kind === 'fatigue') lines.push(`Round ${blowRound}: an empty deck took ${who}${from} to 0.`)

  // The enemy turn that cost you the most Health.
  let worst = 0
  let worstRound = 0
  let cur = 0
  let curRound = 0
  for (const s of steps) {
    const ev = s.ev
    if (ev.kind === 'turnStart') {
      if (cur > worst) {
        worst = cur
        worstRound = curRound
      }
      cur = 0
      curRound = ev.round
    }
    if (ev.kind === 'damage' && !ev.absorbed && ev.target.kind === 'sig' && ev.target.player === me && s.before.active === them) cur += ev.n
    if (ev.kind === 'boneMoonBite' && ev.player === me) cur += ev.n
  }
  if (cur > worst) {
    worst = cur
    worstRound = curRound
  }
  if (worst >= 3 && !(blow.kind !== 'other' && worstRound === blowRound && !iWon)) lines.push(`Round ${worstRound}: their turn cost you ${worst} Health, the most in the reading.`)

  // Your costliest Figure to fall.
  let costliest: { name: string; cost: number; round: number } | null = null
  for (const s of steps) {
    const ev = s.ev
    if (ev.kind === 'death' && ev.target.kind === 'figure' && ev.target.player === me) {
      const def = card(ev.defId)
      if (!def.token && (!costliest || def.cost > costliest.cost)) costliest = { name: def.name, cost: def.cost, round: s.state.round }
    }
  }
  if (costliest && costliest.cost >= 4) lines.push(`Round ${costliest.round}: ${costliest.name} (${costliest.cost} Spark) fell, your costliest loss.`)

  // Burns and bites.
  const burned = steps.filter((s) => s.ev.kind === 'burn' && s.ev.player === me).map((s) => card((s.ev as { defId: string }).defId).name)
  if (burned.length) lines.push(`Your hand was full for ${burned.length} draw${burned.length === 1 ? '' : 's'}: ${burned.slice(0, 3).join(', ')}${burned.length > 3 ? ' and more' : ''} burned.`)
  const bites = steps.filter((s) => s.ev.kind === 'boneMoonBite' && s.ev.player === me).reduce((n, s) => n + (s.ev as { n: number }).n, 0)
  if (bites > 0 && lines.length < 5) lines.push(`The Bone Moon bit you for ${bites} in all.`)

  // Spark left on the table, and cards that never came down.
  let unspent = 0
  for (const s of steps) if (s.ev.kind === 'turnStart' && s.before.active === me) unspent += s.before.players[me].spark
  if (unspent >= 4 && lines.length < 5) lines.push(`You ended turns with ${unspent} Spark unspent in all.`)
  const held = final.players[me].hand.map((h) => card(h.defId).cost)
  if (held.length >= 3 && lines.length < 5) lines.push(`At the end ${held.length} cards were still in hand; the cheapest cost ${Math.min(...held)}.`)

  return lines.slice(0, 5)
}
