// The loss recap: a reading played again from exactly how it began and every action, and a
// few factual lines about what decided it. Nothing here guesses at a better move; it counts
// what happened, from the engine's own events, each event read against the state right
// after it. If the reading cannot be played again exactly, the recap says so rather than
// explain a reading that did not happen.
import { beginGame, createGame, finalState, runAction } from '../engine/engine'
import { RULES } from '../engine/rules'
import { card, significator } from '../data'
import type { Action, GameEvent, GameState, PlayerId, TargetRef } from '../engine/types'
import type { Trial } from './profile'
import { shortSigName } from './names'

export interface MatchTrace {
  humanSig: string
  aiSig: string
  seed: number
  cards?: string[] // the human's list as dealt; the starter when absent
  aiCards?: string[] // the opponent's list as dealt; today's starter when absent
  firstPlayer?: PlayerId // only when the seat was forced; absent when the deal chose it
  trial?: Trial // the experiment the reading was played under
  actions: Action[]
  expected?: { winner: PlayerId | 'draw' | null; round: number; health: [number, number] } // how it really ended
}

export interface ReplayStep {
  ev: GameEvent
  state: GameState // right after this event
  before: GameState // at the start of the action this event belongs to
  action: number // which action
}

export interface Replay {
  ok: boolean // the replay is the reading: every action legal, and the end as recorded when the end is known
  steps: ReplayStep[]
  final: GameState
  initial: GameState
}

// Play the reading again. The same seed, the same lists, the seat chosen the same way (a
// forced seat is forced again; a dealt seat is dealt again, which spends the same random
// step), the same experiment, the same actions in copies (the engine may write to an
// action it resolves).
export function replay(t: MatchTrace): Replay {
  const was = RULES.secondPlayerSparkToken
  RULES.secondPlayerSparkToken = t.trial === 'seat-token'
  try {
    const g = createGame({ sigs: [t.humanSig, t.aiSig], seed: t.seed, humanPlayer: 0, firstPlayer: t.firstPlayer, decks: [t.cards, t.aiCards] })
    const opening = beginGame(g, true)
    let s = finalState(opening, g)
    const initial = s
    const steps: ReplayStep[] = []
    let ok = true
    for (let i = 0; i < t.actions.length; i++) {
      if (s.phase === 'over') {
        ok = false
        break
      }
      const before = s
      const st = runAction(s, structuredClone(t.actions[i]), true)
      for (const x of st) {
        if (x.ev.kind === 'log' && x.ev.text.startsWith('Illegal action:')) ok = false
        steps.push({ ev: x.ev, state: x.state, before, action: i })
      }
      s = finalState(st, s)
    }
    if (t.expected && (s.winner !== t.expected.winner || s.round !== t.expected.round || s.players[0].health !== t.expected.health[0] || s.players[1].health !== t.expected.health[1])) ok = false
    return { ok, steps, final: s, initial }
  } finally {
    RULES.secondPlayerSparkToken = was
  }
}

type Cause = { kind: 'attack'; attacker: string; by: PlayerId } | { kind: 'omen'; name: string; by: PlayerId } | { kind: 'ability'; by: PlayerId } | { kind: 'boneMoon' } | { kind: 'fatigue' } | { kind: 'none' }

function figName(st: GameState, ref: TargetRef): string {
  if (ref.kind === 'sig') return shortSigName(st.players[ref.player].sigId, significator(st.players[ref.player].sigId).name)
  const f = ref.lane !== undefined ? st.players[ref.player].lanes[ref.lane] : null
  if (!f) return 'a Figure'
  const def = card(f.defId)
  return (f.face === 'reversed' ? def.reversed.name : def.upright.name) ?? def.name
}

// Up to five lines, most decisive first, for the human (player 0). Null when the reading
// cannot be played again exactly; empty when it is not over.
export function recapLines(t: MatchTrace): string[] | null {
  const r = replay(t)
  if (!r.ok) return null
  const { steps, final } = r
  if (final.phase !== 'over' || steps.length === 0) return []
  const me: PlayerId = 0
  const them: PlayerId = 1
  const iWon = final.winner === me
  const loser: PlayerId = iWon ? them : me
  const nameOf = (p: PlayerId) => shortSigName(final.players[p].sigId, significator(final.players[p].sigId).name)
  const lines: string[] = []

  // One pass over the events. The turn's owner comes from turnStart; the cause of a damage
  // event is whatever was resolving in the same action, and resets with each action.
  let owner: PlayerId = r.initial.active
  let cause: Cause = { kind: 'none' }
  let lastAction = -1
  let prev: GameState = r.initial
  let blow: { cause: Cause; round: number; from: number } | null = null
  const lostToThem: Record<number, number> = {} // round -> Health I lost to their actions on their turn
  let bites = 0
  for (const s of steps) {
    if (s.action !== lastAction) {
      lastAction = s.action
      cause = { kind: 'none' }
      prev = s.before
    }
    const ev = s.ev
    if (ev.kind === 'turnStart') owner = ev.player
    else if (ev.kind === 'attackStart') cause = { kind: 'attack', attacker: figName(prev, ev.attacker), by: ev.attacker.player }
    else if (ev.kind === 'omen') cause = { kind: 'omen', name: card(ev.defId).name, by: ev.player }
    else if (ev.kind === 'ability') cause = { kind: 'ability', by: ev.player }
    else if (ev.kind === 'boneMoonBite') cause = { kind: 'boneMoon' }
    else if (ev.kind === 'fatigue') cause = { kind: 'fatigue' }
    else if (ev.kind === 'damage' && ev.target.kind === 'sig' && !ev.absorbed) {
      const p = ev.target.player
      const before = prev.players[p].health
      const after = s.state.players[p].health
      const lost = Math.max(0, before - Math.max(0, after))
      if (p === me && lost > 0) {
        if (cause.kind === 'boneMoon') bites += lost
        else if (owner === them && (cause.kind === 'attack' || cause.kind === 'omen' || cause.kind === 'ability') && cause.by === them) lostToThem[s.state.round] = (lostToThem[s.state.round] ?? 0) + lost
      }
      if (p === loser && after <= 0 && !blow) blow = { cause, round: s.state.round, from: before }
    }
    prev = s.state
  }

  const who = iWon ? nameOf(them) : 'you'
  if (final.winner === 'draw') lines.push(`Round ${final.round}: both Significators fell together.`)
  else if (blow) {
    const from = blow.from > 0 ? ` from ${blow.from}` : ''
    const c = blow.cause
    if (c.kind === 'attack') lines.push(`Round ${blow.round}: ${c.attacker}'s attack took ${who}${from} to 0.`)
    else if (c.kind === 'omen') lines.push(`Round ${blow.round}: ${c.name} took ${who}${from} to 0.`)
    else if (c.kind === 'ability') lines.push(`Round ${blow.round}: ${significator(final.players[c.by].sigId).abilityName} took ${who}${from} to 0.`)
    else if (c.kind === 'boneMoon') lines.push(`Round ${blow.round}: the Bone Moon's bite took ${who}${from} to 0.`)
    else if (c.kind === 'fatigue') lines.push(`Round ${blow.round}: an empty deck took ${who}${from} to 0.`)
    else lines.push(`Round ${blow.round}: ${who === 'you' ? 'you were' : `${who} was`} taken${from} to 0.`)
  }

  // The enemy turn whose actions cost you the most Health. Not the blow's round when you lost.
  let worstRound = 0
  let worst = 0
  for (const [rd, n] of Object.entries(lostToThem)) if (n > worst) {
    worst = n
    worstRound = Number(rd)
  }
  if (worst >= 3 && !(blow && !iWon && worstRound === blow.round)) lines.push(`Round ${worstRound}: their turn cost you ${worst} Health, the most in the reading.`)

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

  // Burns, and the Bone Moon's total.
  const burned = steps.filter((s) => s.ev.kind === 'burn' && s.ev.player === me).map((s) => card((s.ev as { defId: string }).defId).name)
  if (burned.length) lines.push(`Your hand was full for ${burned.length} draw${burned.length === 1 ? '' : 's'}: ${burned.slice(0, 3).join(', ')}${burned.length > 3 ? ' and more' : ''} burned.`)
  if (bites > 0 && lines.length < 5) lines.push(`The Bone Moon bit you for ${bites} in all.`)

  // Spark left on the table, and cards that never came down.
  let unspent = 0
  for (let i = 0; i < t.actions.length; i++) {
    const a = t.actions[i]
    if (a.type !== 'endTurn') continue
    const first = steps.find((s) => s.action === i)
    if (first && first.before.active === me) unspent += first.before.players[me].spark
  }
  if (unspent >= 4 && lines.length < 5) lines.push(`You ended turns with ${unspent} Spark unspent in all.`)
  const held = final.players[me].hand.map((h) => card(h.defId).cost)
  if (held.length >= 3 && lines.length < 5) lines.push(`At the end ${held.length} cards were still in hand; the cheapest cost ${Math.min(...held)}.`)

  return lines.slice(0, 5)
}
