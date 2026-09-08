// The replay must be the reading, exactly, or say it cannot be. These cases follow Astra's
// probes of 60aac1d: a dealt seat and a forced one, the seat trial on and off, a custom list,
// actions the engine writes to as it resolves them, and a reading decided by the Bone Moon.
import { isDeepStrictEqual } from 'node:util'
import { afterEach, describe, expect, it } from 'vitest'
import { beginGame, createGame, finalState, runAction } from '../engine/engine'
import { RULES } from '../engine/rules'
import { chooseAction } from '../ai/ai'
import { cardPoolFor, isLegalDeck, starterList } from '../engine/deck'
import type { Action, GameState, PlayerId } from '../engine/types'
import type { MatchTrace } from './recap'
import { recapLines, replay } from './recap'

const custom = (() => {
  const list = starterList('sig-shazz').slice()
  const removed = list.shift()!
  const added = cardPoolFor('sig-shazz').find((c) => c.id !== removed && isLegalDeck('sig-shazz', [...list, c.id]))!.id
  list.push(added)
  return list
})()

// A reading the way the store plays one: the planner on both sides, the actions recorded as
// copies before the engine sees them, the seat dealt or forced, the trial on or off.
function playOut(seed: number, trial: boolean, forced?: PlayerId): { trace: MatchTrace; final: GameState } {
  RULES.secondPlayerSparkToken = trial
  try {
    const g = createGame({ sigs: ['sig-shazz', 'sig-daxon'], seed, humanPlayer: 0, firstPlayer: forced, decks: [custom, undefined] })
    let s = finalState(beginGame(g, true), g)
    const actions: Action[] = []
    let guard = 0
    while (s.phase !== 'over' && guard++ < 900) {
      const a = chooseAction(s, { seed })
      actions.push(structuredClone(a))
      s = finalState(runAction(s, a, true), s)
    }
    const trace: MatchTrace = { humanSig: 'sig-shazz', aiSig: 'sig-daxon', seed, cards: custom, aiCards: starterList('sig-daxon'), firstPlayer: forced, actions, ...(trial ? { trial: 'seat-token' as const } : {}), expected: { winner: s.winner, round: s.round, health: [s.players[0].health, s.players[1].health] } }
    return { trace, final: s }
  } finally {
    RULES.secondPlayerSparkToken = false
  }
}

afterEach(() => {
  RULES.secondPlayerSparkToken = false
})

describe('the replay', () => {
  for (const seed of [4242, 7, 123, 42]) {
    for (const trial of [false, true]) {
      for (const forced of [undefined, 0 as PlayerId, 1 as PlayerId]) {
        it(`is the reading, seed ${seed}${trial ? ', seat trial' : ''}${forced === undefined ? ', seat dealt' : `, seat forced to ${forced}`}`, () => {
          const { trace, final } = playOut(seed, trial, forced)
          // The store clears the trial's rule before the result screen asks for the recap.
          RULES.secondPlayerSparkToken = false
          const r = replay(structuredClone(trace))
          expect(r.ok).toBe(true)
          expect(isDeepStrictEqual(r.final, final)).toBe(true)
          expect(RULES.secondPlayerSparkToken).toBe(false)
          const lines = recapLines(structuredClone(trace))
          expect(lines).not.toBeNull()
          expect(lines!.length).toBeGreaterThan(0)
          expect(lines![0]).toMatch(new RegExp(`^Round ${final.round}: `))
        })
      }
    }
  }

  it('reads each event against the state right after it', () => {
    const { trace } = playOut(42, false)
    const r = replay(trace)
    // Every damage event's own snapshot shows the Health after that damage, and the step
    // before it shows the Health before: the two differ by the damage or the shield.
    let checked = 0
    for (let i = 1; i < r.steps.length; i++) {
      const ev = r.steps[i].ev
      if (ev.kind !== 'damage' || ev.target.kind !== 'sig' || ev.absorbed) continue
      const p = ev.target.player
      const before = (r.steps[i - 1].action === r.steps[i].action ? r.steps[i - 1].state : r.steps[i].before).players[p].health
      const after = r.steps[i].state.players[p].health
      expect(before - after).toBe(ev.n)
      checked++
    }
    expect(checked).toBeGreaterThan(0)
  })

  it('says it cannot when an action is not legal or the end is not as recorded', () => {
    const { trace } = playOut(4242, false)
    const broken = structuredClone(trace)
    broken.actions.splice(3, 0, { type: 'attack', lane: 2, targetLane: 2 })
    expect(replay(broken).ok).toBe(false)
    expect(recapLines(broken)).toBeNull()
    const wrongEnd = structuredClone(trace)
    wrongEnd.expected = { winner: 'draw', round: 99, health: [0, 0] }
    expect(recapLines(wrongEnd)).toBeNull()
    expect(recapLines({ ...trace, actions: trace.actions.slice(0, 3), expected: undefined })).toEqual([])
  })
})

describe('the recap', () => {
  it('counts the Bone Moon once, as the Bone Moon, and never as their turn', () => {
    // Both players only end their turns. All Significator damage comes from the Bone Moon.
    const g = createGame({ sigs: ['sig-rorik', 'sig-daxon'], seed: 7, firstPlayer: 0, humanPlayer: 0 })
    let s = finalState(beginGame(g, true), g)
    const actions: Action[] = []
    let bitten = 0
    while (s.phase !== 'over' && actions.length < 60) {
      const a: Action = { type: 'endTurn' }
      actions.push(a)
      const steps = runAction(s, a, true)
      // The Health Rorik actually lost to each bite, from the engine's own snapshots.
      let prev = s
      for (const st of steps) {
        if (st.ev.kind === 'damage' && st.ev.target.kind === 'sig' && st.ev.target.player === 0) bitten += Math.max(0, prev.players[0].health - Math.max(0, st.state.players[0].health))
        prev = st.state
      }
      s = finalState(steps, s)
    }
    const lines = recapLines({ humanSig: 'sig-rorik', aiSig: 'sig-daxon', seed: 7, firstPlayer: 0, actions })!
    expect(lines).not.toBeNull()
    expect(lines.some((l) => /their turn cost you/.test(l))).toBe(false)
    expect(lines[0]).toMatch(/^Round \d+: the Bone Moon's bite took Daxon from \d+ to 0\.$/)
    expect(lines).toContain(`The Bone Moon bit you for ${bitten} in all.`)
  })

  it('keeps to five factual lines that end in full stops', () => {
    const { trace } = playOut(4242, false)
    const lines = recapLines(trace)!
    expect(lines.length).toBeLessThanOrEqual(5)
    for (const l of lines) expect(l).toMatch(/\.$/)
  })
})
