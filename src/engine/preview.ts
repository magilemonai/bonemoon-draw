// The attack as the engine would actually run it, for the interface. The real engine runs
// the attack on a copy, text and Relics included. If nothing random happens and no Read
// opens along the way, the result is exact and the interface can say so. Otherwise the
// plain exchange is reported with the text still to decide.

import { effectsOf, finalState, runAction } from './engine'
import { figAt, healthOf, previewAttack, refOf, resolveRef, sameRef } from './queries'
import type { AttackPreview } from './queries'
import type { FigureInstance, GameState, LaneIndex, Trigger } from './types'

export interface AttackOutcome extends AttackPreview {
  exact: boolean // the numbers are what will happen, not an estimate
  attackerHp: number | null // the attacker's Health afterwards, if it survives
  attackText: boolean // the attacker has text that fires on or after its attack (face or Relic)
  defenderRite: boolean // the defender dies and has a Last Rite
  attackerRite: boolean // the attacker dies and has a Last Rite
}

const ATTACK_TRIGGERS: Trigger[] = ['onAttack', 'afterAttack', 'onDamageDealt', 'onKill']

function hasText(f: FigureInstance, triggers: Trigger[]): boolean {
  return triggers.some((t) => effectsOf(f, t).length > 0)
}

export function attackOutcome(state: GameState, lane: LaneIndex, targetLane: LaneIndex): AttackOutcome {
  const p = state.active
  const attacker = figAt(state, p, lane)
  if (!attacker) throw new Error('no attacker')
  const plain = previewAttack(state, attacker, targetLane)
  const defenderFig = plain.defender.kind === 'figure' ? resolveRef(state, plain.defender) : null
  const base: AttackOutcome = { ...plain, exact: false, attackerHp: null, attackText: hasText(attacker, ATTACK_TRIGGERS), defenderRite: false, attackerRite: false }

  const steps = runAction(state, { type: 'attack', lane, targetLane }, false)
  const after = finalState(steps, state)
  // A random choice moves the seed; a Read leaves a pending choice. Either way the rest is unknown.
  if (after === state || after.seed !== state.seed || after.pending) return base

  const atkRef = refOf(attacker)
  let deals = 0
  let takes = 0
  let shielded = false
  let attackerShielded = false
  for (const st of steps) {
    const ev = st.ev
    if (ev.kind !== 'damage') continue
    if (sameRef(ev.target, plain.defender)) {
      if (ev.absorbed) shielded = true
      else deals += ev.n
    } else if (sameRef(ev.target, atkRef)) {
      if (ev.absorbed) attackerShielded = true
      else takes += ev.n
    }
  }

  const attackerAfter = after.players[p].lanes[lane]
  const attackerAlive = !!attackerAfter && attackerAfter.uid === attacker.uid
  let defenderDies = false
  let defenderRekindles = false
  if (defenderFig) {
    const dAfter = after.players[defenderFig.owner].lanes[defenderFig.lane]
    const alive = !!dAfter && dAfter.uid === defenderFig.uid
    defenderDies = !alive
    defenderRekindles = alive && dAfter.rekindled && !defenderFig.rekindled
  }
  return {
    ...base,
    exact: true,
    deals,
    takes,
    shielded,
    attackerShielded,
    defenderDies,
    defenderRekindles,
    attackerDies: !attackerAlive,
    attackerRekindles: attackerAlive && attackerAfter.rekindled && !attacker.rekindled,
    lethal: after.phase === 'over' && after.winner === p,
    attackerHp: attackerAlive ? healthOf(after, attackerAfter) : null,
    defenderRite: !!defenderFig && defenderDies && hasText(defenderFig, ['lastRite']),
    attackerRite: !attackerAlive && hasText(attacker, ['lastRite']),
  }
}
