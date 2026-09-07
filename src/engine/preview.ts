// The attack as the engine would actually run it, for the interface. The real engine runs
// the attack on a copy, text and Relics included. If nothing random happens and no Read
// opens along the way, the result is exact and the interface can say so. Otherwise the
// plain exchange is reported with the text still to decide.

import { significator } from '../data'
import { effectsOf, finalState, runAction } from './engine'
import { figAt, figureName, healthOf, previewAttack, refOf, resolveRef, sameRef } from './queries'
import type { AttackPreview } from './queries'
import { LANE_NAMES } from './types'
import type { FigureInstance, GameState, LaneIndex, PlayerId, Step, Trigger } from './types'

// Where a Figure ends up once the attack has resolved.
export type Fate = 'stays' | 'moves' | 'returns' | 'falls' | 'rekindles' | 'rekindlesThenFalls'

export interface AttackOutcome extends AttackPreview {
  exact: boolean // the numbers are what will happen, not an estimate
  attackerFate: Fate
  attackerLane: LaneIndex | null // where the attacker stands afterwards, if on the table
  attackerHp: number | null // the attacker's Health afterwards, if on the table
  defenderFate: Fate | null // null when the defender is the Significator
  defenderHp: number | null
  attackText: boolean // the attacker has text that fires on or after its attack (face or Relic)
  defenderRite: boolean // the defender falls and has a Last Rite
  attackerRite: boolean // the attacker falls and has a Last Rite
}

const ATTACK_TRIGGERS: Trigger[] = ['onAttack', 'afterAttack', 'onDamageDealt', 'onKill']

function hasText(f: FigureInstance, triggers: Trigger[]): boolean {
  return triggers.some((t) => effectsOf(f, t).length > 0)
}

const fell = (f: Fate | null) => f === 'falls' || f === 'rekindlesThenFalls'

// Find a Figure by identity after the dust settles: on the table (moved or not), back in
// hand, or gone. A rekindle along the way is read from the events.
function fateOf(after: GameState, steps: Step[], owner: PlayerId, fig: FigureInstance): { fate: Fate; lane: LaneIndex | null; hp: number | null } {
  const lane = after.players[owner].lanes.findIndex((f) => f?.uid === fig.uid)
  const rekindled = steps.some((st) => st.ev.kind === 'rekindle' && st.ev.target.uid === fig.uid)
  if (lane >= 0) {
    const f = after.players[owner].lanes[lane]!
    const fate: Fate = rekindled ? 'rekindles' : lane !== fig.lane ? 'moves' : 'stays'
    return { fate, lane: lane as LaneIndex, hp: healthOf(after, f) }
  }
  if (after.players[owner].hand.some((h) => h.uid === fig.uid)) return { fate: 'returns', lane: null, hp: null }
  return { fate: rekindled ? 'rekindlesThenFalls' : 'falls', lane: null, hp: null }
}

export function attackOutcome(state: GameState, lane: LaneIndex, targetLane: LaneIndex): AttackOutcome {
  const p = state.active
  const attacker = figAt(state, p, lane)
  if (!attacker) throw new Error('no attacker')
  const plain = previewAttack(state, attacker, targetLane)
  const defenderFig = plain.defender.kind === 'figure' ? resolveRef(state, plain.defender) : null
  const estimate: AttackOutcome = {
    ...plain,
    exact: false,
    attackerFate: plain.attackerDies ? 'falls' : plain.attackerRekindles ? 'rekindles' : 'stays',
    attackerLane: lane,
    attackerHp: null,
    defenderFate: defenderFig ? (plain.defenderDies ? 'falls' : plain.defenderRekindles ? 'rekindles' : 'stays') : null,
    defenderHp: null,
    attackText: hasText(attacker, ATTACK_TRIGGERS),
    defenderRite: false,
    attackerRite: false,
  }

  const steps = runAction(state, { type: 'attack', lane, targetLane }, false)
  const after = finalState(steps, state)
  // A random choice moves the seed; a Read leaves a pending choice. Either way the rest is unknown.
  if (after === state || after.seed !== state.seed || after.pending) return estimate

  // Damage totals across the whole attack, and whether any hit was blocked outright.
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

  const mine = fateOf(after, steps, p, attacker)
  const theirs = defenderFig ? fateOf(after, steps, defenderFig.owner, defenderFig) : null
  return {
    ...estimate,
    exact: true,
    deals,
    takes,
    shielded,
    attackerShielded,
    attackerFate: mine.fate,
    attackerLane: mine.lane,
    attackerHp: mine.hp,
    attackerDies: fell(mine.fate),
    attackerRekindles: mine.fate === 'rekindles',
    defenderFate: theirs?.fate ?? null,
    defenderHp: theirs?.hp ?? null,
    defenderDies: !!theirs && fell(theirs.fate),
    defenderRekindles: theirs?.fate === 'rekindles',
    lethal: after.phase === 'over' && after.winner === p,
    defenderRite: !!defenderFig && !!theirs && fell(theirs.fate) && hasText(defenderFig, ['lastRite']),
    attackerRite: fell(mine.fate) && hasText(attacker, ['lastRite']),
  }
}

// Two or three short lines that say what the blow would do. When the outcome is exact the
// numbers already count the text; when it is not, the lines say the text decides.
export function outcomeLines(state: GameState, o: AttackOutcome, onEmptyLane: boolean): string[] {
  const d = o.defender.kind === 'figure' ? resolveRef(state, o.defender) : null
  const note = !o.exact ? 'Its text decides the rest' : o.attackText ? 'Counting its attack text' : o.defenderRite && d ? `Then ${figureName(d)}'s Last Rite` : o.attackerRite ? 'Then its Last Rite' : ''
  const hits = (what: string, n: number, blocked: boolean) => (n === 0 && blocked ? `${what} nothing (blocked)` : blocked ? `${what} ${n} (a hit blocked)` : `${what} ${n}`)
  const at = (hp: number | null) => (hp === null ? '' : ` at ${hp}`)
  const yours = !o.exact
    ? ''
    : o.attackerFate === 'falls'
      ? 'Yours falls'
      : o.attackerFate === 'rekindlesThenFalls'
        ? 'Yours rekindles, then falls'
        : o.attackerFate === 'rekindles'
          ? `Yours rekindles${at(o.attackerHp)}`
          : o.attackerFate === 'moves'
            ? `Yours moves to ${LANE_NAMES[o.attackerLane ?? 0]}${at(o.attackerHp)}`
            : o.attackerFate === 'returns'
              ? 'Yours returns to hand'
              : ''

  if (o.defender.kind === 'sig') {
    const title = significator(state.players[o.defender.player].sigId).title
    const first = `${title} takes ${o.deals}${o.exact ? '' : ' before its text'}`
    return [first, o.exact && o.lethal ? 'Lethal' : yours, o.exact && o.lethal ? '' : note].filter(Boolean)
  }

  const exchange = `${hits('Deals', o.deals, o.shielded)}, ${hits('takes', o.takes, o.attackerShielded)}${o.exact ? '' : ' before its text'}`
  const first = onEmptyLane && o.intercepted && d ? `${figureName(d)} steps in` : exchange
  const its = !o.exact
    ? ''
    : o.defenderFate === 'falls'
      ? 'It falls'
      : o.defenderFate === 'rekindlesThenFalls'
        ? 'It rekindles, then falls'
        : o.defenderFate === 'rekindles'
          ? `It rekindles${at(o.defenderHp)}`
          : o.defenderFate === 'moves'
            ? 'It moves'
            : o.defenderFate === 'returns'
              ? 'It returns to hand'
              : ''
  const outcome = its === 'It falls' && yours === 'Yours falls' ? 'Both fall' : [its, yours].filter(Boolean).join('. ')
  const second = outcome || (onEmptyLane && o.intercepted ? exchange : '')
  return [first, second, note].filter(Boolean)
}
