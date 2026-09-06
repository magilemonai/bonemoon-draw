// The opponent's reading. A greedy one-step planner over the real engine:
// simulate every legal action, score the result, take the best, repeat.

import { card, significator } from '../data'
import { finalState, legalActions, runAction } from '../engine/engine'
import { attackOf, availableSpark, cardCost, figures, healthOf, keywords, other } from '../engine/queries'
import type { Action, GameState, PlayerId } from '../engine/types'

export interface AiOptions {
  seed?: number
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
      v += fv
    }
    return v
  }
  score += figVal(state, p) - figVal(state, other(p))
  score += me.hand.length * 1.4 - en.hand.length * 1.0
  // Unspent spark is mildly wasteful.
  score -= availableSpark(me) * 0.3
  // Deck exhaustion hurts.
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

export function chooseAction(state: GameState, opts: AiOptions = {}): Action {
  const p = state.active
  const salt = (opts.seed ?? 7) + state.turn * 31
  const actions = legalActions(state)
  if (actions.length === 0) return { type: 'endTurn' }

  // A pending Read: keep the card that best fits next turn's Spark.
  if (state.pending) {
    const nextSpark = Math.min(10, state.players[p].maxSpark + 1)
    let best = actions[0]
    let bestScore = -Infinity
    for (const a of actions) {
      if (a.type !== 'choose') continue
      const def = card(state.pending.options.find((o) => o.uid === a.uid)!.defId)
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

  const base = evaluate(state, p)
  let best: Action = { type: 'endTurn' }
  let bestScore = -Infinity
  let i = 0
  for (const a of actions) {
    i++
    if (a.type === 'endTurn') continue
    const next = simulate(state, a, salt + i)
    let sc = evaluate(next, p) - base
    // Small preferences so the AI plays like a person: develop before attacking, keep the ability for later if nothing to hit.
    if (a.type === 'play') sc += 0.15
    if (a.type === 'move') sc -= 0.4
    if (a.type === 'ability' && sc < 0.5) sc -= 1
    // Look one more step for attacks: does this open lethal or a free kill?
    if (sc > bestScore) {
      bestScore = sc
      best = a
    }
  }
  // Only act if it helps, unless it's a free attack into an empty lane.
  if (bestScore <= 0.05) return { type: 'endTurn' }
  return best
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
