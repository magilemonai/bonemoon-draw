// The opponent's reading. A short-horizon planner over the real engine: every legal action
// is simulated, the best few are followed one step further, and the board is scored with a
// heuristic that knows about lethal, next-turn threats, dissolving Figures, hand space,
// and lane congestion. Sequences like "attack, then flip" and "move the Guard, then hit
// the face" fall out of the two-step search.

import { card, significator } from '../data'
import { finalState, legalActions, runAction } from '../engine/engine'
import { attackOf, availableSpark, cardCost, figures, hasKw, healthOf, keywords, other, resolveDefender, attackLanes, faceDef, emptyLanes } from '../engine/queries'
import type { Action, FigureInstance, GameState, PlayerId } from '../engine/types'

export interface AiOptions {
  seed?: number
  depth?: 1 | 2 // 2 = follow the best few actions one step further
  beam?: number // how many first actions get a second look
}

const DEFAULTS = { depth: 2 as const, beam: 5 }

// Does this Figure dissolve at the end of its controller's turn (Project Lazarus)?
function diesAtEndOfTurn(f: FigureInstance): boolean {
  const fd = faceDef(card(f.defId), f.face)
  return !f.hushed && !!fd.effects?.some((e) => e.trigger === 'endTurn' && e.ops.some((o) => o.op === 'die'))
}

// Damage the given player's Figures could put on the enemy Significator next turn,
// counting only lanes that reach the face (Guards considered), plus Gale reach.
function faceThreat(state: GameState, p: PlayerId): number {
  let total = 0
  for (const f of figures(state, p)) {
    if (hasKw(state, f, 'dormant') || f.asleep) continue
    const atk = attackOf(state, f)
    if (atk <= 0) continue
    let hitsFace = false
    for (const l of attackLanes(state, f)) {
      const d = resolveDefender(state, f, l)
      if (d.kind === 'sig') {
        hitsFace = true
        break
      }
    }
    if (hitsFace) total += atk
  }
  return total
}

// Rough worth of an effect's ops, for text the planner cannot see paying out this turn.
function opsWorth(ops: { op: string; n?: number }[]): number {
  let w = 0
  for (const o of ops) {
    switch (o.op) {
      case 'damage':
        w += (o.n ?? 1) * 0.8
        break
      case 'heal':
        w += (o.n ?? 1) * 0.5
        break
      case 'draw':
        w += (o.n ?? 1) * 1.2
        break
      case 'summon':
        w += 2
        break
      case 'flip':
      case 'hush':
      case 'destroy':
      case 'bounce':
        w += 1.5
        break
      case 'spark':
        w += (o.n ?? 1) * 0.5
        break
      default:
        w += 0.8
    }
  }
  return w
}

// What a Figure's current face promises beyond its stats: ongoing clauses, Last Rites, engines.
function textValue(f: FigureInstance, kws: string[]): number {
  if (f.hushed) return 0
  const fd = faceDef(card(f.defId), f.face)
  let v = 0
  for (const e of fd.effects ?? []) {
    if (e.trigger === 'startTurn' || e.trigger === 'endTurn') v += opsWorth(e.ops) * 0.7
    else if (e.trigger === 'lastRite') v += opsWorth(e.ops) * 0.45
    else if (e.trigger === 'onFriendlyOmen' || e.trigger === 'onEnemyOmen' || e.trigger === 'onAnyDeath' || e.trigger === 'onKill' || e.trigger === 'onEnemyPlay' || e.trigger === 'onEnemyFlip') v += 1.2
  }
  v += (fd.auras?.length ?? 0) * 1.2
  if (kws.includes('rekindle') && !f.rekindled) v += 1.5
  if (kws.includes('feast')) v += 0.6
  if (kws.includes('gale')) v += 0.6
  if (kws.includes('fixed')) v += 0.3
  return v
}

// Board evaluation from `p`'s point of view. Bigger is better.
export function evaluate(state: GameState, p: PlayerId): number {
  const me = state.players[p]
  const en = state.players[other(p)]
  if (state.phase === 'over') {
    if (state.winner === p) return 10_000
    if (state.winner === other(p)) return -10_000
    return 0
  }
  let score = 0
  score += (me.health - en.health) * 3
  score += Math.min(me.health, 20) * 0.5

  const figVal = (st: GameState, pl: PlayerId) => {
    let v = 0
    for (const f of figures(st, pl)) {
      const atk = attackOf(st, f)
      const hp = healthOf(st, f)
      const kws = keywords(st, f)
      let fv = atk * 1.2 + hp * 1.0 + 1.5
      if (kws.includes('guard')) fv += 1
      if (kws.includes('veiled')) fv += 0.5
      if (kws.includes('dormant')) fv -= atk
      if (f.hushed) fv -= 1.5
      if (f.aegis) fv += 1
      fv += f.relics.length * 1.5
      fv += textValue(f, kws)
      // A Figure that dissolves at the end of this turn is worth only what it can still do now.
      if (diesAtEndOfTurn(f)) fv = f.attacksThisTurn > 0 || st.active !== pl ? 0.3 : atk * 0.6
      v += fv
    }
    return v
  }
  score += figVal(state, p) - figVal(state, other(p))

  // Hand: cards are good, a full hand is a burn waiting to happen.
  score += Math.min(me.hand.length, 7) * 1.4 - Math.min(en.hand.length, 7) * 1.0
  if (me.hand.length >= 8) score -= 3

  // Lane congestion: three bodies and a playable Figure in hand is a stuck hand.
  if (figures(state, p).length === 3) {
    const nextSpark = Math.min(10, me.maxSpark + 1)
    if (me.hand.some((h) => card(h.defId).type === 'figure' && cardCost(state, p, h.defId) <= nextSpark)) score -= 1.5
  }

  // Threats: what can hit each face next turn.
  const theirThreat = faceThreat(state, other(p))
  const myThreat = faceThreat(state, p)
  if (theirThreat >= me.health) score -= 60
  else score -= theirThreat * 0.45
  if (myThreat >= en.health) score += 25
  else score += myThreat * 0.3

  // Unspent spark is mildly wasteful.
  score -= availableSpark(me) * 0.3
  if (me.deck.length === 0) score -= 6
  return score
}

function reseed(state: GameState, salt: number): GameState {
  // Don't let the planner peek at the real random stream.
  return { ...state, seed: (state.seed ^ (salt * 2654435761)) | 0 }
}

function simulate(state: GameState, action: Action, salt: number): GameState {
  const steps = runAction(reseed(state, salt), action, false)
  return finalState(steps, state)
}

function chooseRead(state: GameState, actions: Action[]): Action {
  const p = state.active
  const nextSpark = Math.min(10, state.players[p].maxSpark + 1)
  let best = actions[0]
  let bestScore = -Infinity
  for (const a of actions) {
    if (a.type !== 'choose') continue
    const def = card(state.pending!.options.find((o) => o.uid === a.uid)!.defId)
    const cost = cardCost(state, p, def.id)
    let sc = -Math.abs(cost - nextSpark) + (def.suit === 'major' ? 1 : 0)
    if (cost > nextSpark + 2) sc -= 3
    if (sc > bestScore) {
      bestScore = sc
      best = a
    }
  }
  return best
}

// Small preferences so the AI plays like a person.
function bias(a: Action): number {
  if (a.type === 'play') return 0.15
  if (a.type === 'move') return -0.4
  if (a.type === 'ability') return -0.3
  return 0
}

export function chooseAction(state: GameState, opts: AiOptions = {}): Action {
  const depth = opts.depth ?? DEFAULTS.depth
  const beam = opts.beam ?? DEFAULTS.beam
  const p = state.active
  const salt = (opts.seed ?? 7) + state.turn * 31
  const actions = legalActions(state)
  if (actions.length === 0) return { type: 'endTurn' }
  if (state.pending) return chooseRead(state, actions)

  const base = evaluate(state, p)
  type Cand = { a: Action; next: GameState; score: number }
  const cands: Cand[] = []
  let i = 0
  for (const a of actions) {
    i++
    if (a.type === 'endTurn') continue
    const next = simulate(state, a, salt + i)
    cands.push({ a, next, score: evaluate(next, p) - base + bias(a) })
  }
  if (cands.length === 0) return { type: 'endTurn' }
  cands.sort((x, y) => y.score - x.score)

  // Second step: the best few actions get a look at what they enable, plus the best action of
  // each kind, so a losing-looking trade that frees a lane still gets its second look.
  if (depth >= 2) {
    const second = new Set<Cand>(cands.slice(0, beam))
    for (const kind of ['play', 'attack', 'move', 'ability'] as const) {
      const first = cands.find((c) => c.a.type === kind)
      if (first) second.add(first)
    }
    for (const cnd of second) {
      if (cnd.next.phase === 'over' || cnd.next.active !== p) continue
      const follow = legalActions(cnd.next)
      let bestFollow = 0
      let j = 0
      for (const b of follow) {
        j++
        if (b.type === 'endTurn') continue
        const after = simulate(cnd.next, b, salt + 1000 + i * 17 + j)
        const gain = evaluate(after, p) - evaluate(cnd.next, p) + bias(b)
        if (gain > bestFollow) bestFollow = gain
      }
      cnd.score += bestFollow * 0.9
    }
    cands.sort((x, y) => y.score - x.score)
  }

  const best = cands[0]
  // Only act if it helps.
  if (best.score <= 0.05) return { type: 'endTurn' }
  return best.a
}

// A simple mulligan policy for the sim: set aside cards that cost more than the hand can
// reach by turn three, keeping at most one expensive card.
export function chooseMulligan(state: GameState, p: PlayerId): number[] {
  const hand = state.players[p].hand
  const expensive = hand.filter((h) => card(h.defId).cost >= 5 && h.defId !== 'tok-brog')
  return expensive.slice(1).map((h) => h.uid)
}

// Play out a whole AI turn and return the sequence of actions taken (for tests and sims).
export function planTurn(state: GameState, opts: AiOptions = {}, maxActions = 24): Action[] {
  const actions: Action[] = []
  let s = state
  for (let i = 0; i < maxActions; i++) {
    const a = chooseAction(s, opts)
    actions.push(a)
    if (a.type === 'endTurn') break
    s = finalState(runAction(s, a, false), s)
    if (s.phase === 'over') break
  }
  return actions
}

export function describeAction(state: GameState, a: Action): string {
  const p = state.active
  const me = state.players[p]
  const name = significator(me.sigId).name
  switch (a.type) {
    case 'play': {
      const h = me.hand.find((x) => x.uid === a.uid)
      return h ? `${name} plays ${card(h.defId).name} (${a.face}).` : `${name} plays a card.`
    }
    case 'attack': {
      const f = me.lanes[a.lane]
      return f ? `${card(f.defId).name} attacks.` : 'attack'
    }
    case 'move':
      return `${name} repositions.`
    case 'ability':
      return `${name} uses ${significator(me.sigId).abilityName}.`
    case 'choose':
      return `${name} reads the cards.`
    case 'endTurn':
      return `${name} ends the turn.`
  }
}

export { emptyLanes }
