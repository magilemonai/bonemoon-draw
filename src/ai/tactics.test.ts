// A tactical benchmark: positions with one right answer, played by the shipped planner.
// It is a ruler for Standard as much as a target for Expert. A case marked `fails` is a
// known gap, kept so the day the planner finds the line, the suite says so.
import { describe, expect, it } from 'vitest'
import { beginGame, createGame, finalState, runAction } from '../engine/engine'
import { chooseAction } from './ai'
import type { Face, GameState, LaneIndex } from '../engine/types'

function fresh(sigs: [string, string], seed = 11): GameState {
  const g = createGame({ sigs, seed, firstPlayer: 0 })
  const s = finalState(beginGame(g, false), g)
  s.players[0].hand = []
  s.players[1].hand = []
  return s
}
function place(state: GameState, p: 0 | 1, lane: LaneIndex, defId: string, face: Face, damage = 0): GameState {
  const s = structuredClone(state)
  s.players[p].lanes[lane] = {
    uid: s.nextUid++, defId, owner: p, lane, face, damage, permAtk: 0, permHp: 0, tempAtk: 0, tempHp: 0,
    grantedKw: [], removedKw: [], hushed: false, aegis: false, rekindled: false, asleep: false,
    summonedTurn: -1, attacksThisTurn: 0, movedThisTurn: false, onceUsed: [], relics: [],
  }
  return s
}
function spark(state: GameState, p: 0 | 1, n: number): GameState {
  const s = structuredClone(state)
  s.players[p].spark = n
  s.players[p].maxSpark = Math.max(s.players[p].maxSpark, n)
  return s
}
function hand(state: GameState, p: 0 | 1, ...ids: string[]): GameState {
  const s = structuredClone(state)
  for (const id of ids) s.players[p].hand.push({ uid: s.nextUid++, defId: id })
  return s
}
function health(state: GameState, p: 0 | 1, n: number): GameState {
  const s = structuredClone(state)
  s.players[p].health = n
  return s
}
// Play the planner's turn out and return the state when it ends the turn (or the game).
function playTurn(state: GameState, seed = 1): { state: GameState; actions: string[] } {
  let s = state
  const actions: string[] = []
  for (let i = 0; i < 12; i++) {
    const a = chooseAction(s, { seed })
    actions.push(a.type)
    s = finalState(runAction(s, a, false), s)
    if (a.type === 'endTurn' || s.phase === 'over') break
  }
  return { state: s, actions }
}

describe('tactics', () => {
  it('takes lethal when a 4-Attack Figure faces an open lane and the enemy is at 4', () => {
    let s = fresh(['sig-daxon', 'sig-rorik'])
    s = place(s, 0, 1, 'tides-knight', 'upright') // Merrick 4/2
    s = health(s, 1, 4)
    const { state } = playTurn(s)
    expect(state.phase).toBe('over')
    expect(state.winner).toBe(0)
  })

  // Known gap: the planner does not count the burn a full hand takes at the next draw.
  it.fails('does not end the turn at 8 in hand with a cheap card and a draw coming', () => {
    let s = fresh(['sig-luigi', 'sig-daxon'])
    s = hand(s, 0, 'gears-ace', 'gears-ace', 'gears-10', 'gears-10', 'major-21', 'antlers-king', 'antlers-9', 'gears-queen')
    s = spark(s, 0, 2)
    const { state } = playTurn(s)
    expect(state.players[0].hand.length).toBeLessThan(8)
  })

  it('Shazz flips a wounded enemy for the kill rather than trading a body', () => {
    let s = fresh(['sig-shazz', 'sig-daxon'])
    s = place(s, 1, 1, 'gears-4', 'upright', 3) // the Pylon 1/4 with 3 damage: turned over it is 4/1 with 3 wounds, dead
    s = place(s, 0, 1, 'antlers-2', 'reversed') // Voren across from it
    s = spark(s, 0, 2)
    const { state, actions } = playTurn(s)
    expect(actions).toContain('ability')
    expect(state.players[1].lanes[1]).toBeNull()
    expect(state.players[0].lanes[1]).not.toBeNull()
  })

  it('blocks an attacker that would be lethal next turn instead of ending the turn', () => {
    let s = fresh(['sig-daxon', 'sig-rorik'])
    s = place(s, 1, 0, 'suns-knight', 'upright') // Vath across from my empty Past
    s = health(s, 0, 4)
    s = hand(s, 0, 'suns-2') // the Guard Post
    s = spark(s, 0, 2)
    const { state } = playTurn(s)
    expect(state.players[0].lanes.some((f) => f !== null)).toBe(true)
  })

  it('attacks the Significator with a Windborne arrival when the lane across is open', () => {
    let s = fresh(['sig-daxon', 'sig-rorik'])
    s = hand(s, 0, 'suns-2') // Guard Post Reversed: 3/1 Windborne
    s = spark(s, 0, 2)
    s = health(s, 1, 3)
    const { state } = playTurn(s)
    expect(state.phase).toBe('over')
    expect(state.winner).toBe(0)
  })
})
