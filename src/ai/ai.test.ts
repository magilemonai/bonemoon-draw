// The planner should find the lines the design review says a clever player finds.
import { describe, expect, it } from 'vitest'
import { beginGame, createGame, finalState, runAction } from '../engine/engine'
import { chooseAction, planTurn } from './ai'
import type { Face, GameState, LaneIndex } from '../engine/types'

function fresh(sigs: [string, string], seed = 11): GameState {
  const g = createGame({ sigs, seed, firstPlayer: 0 })
  const s = finalState(beginGame(g, false), g)
  // Empty both hands so only the constructed position matters.
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
function giveSpark(state: GameState, p: 0 | 1, n: number): GameState {
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

describe('planner', () => {
  it('Shazz attacks with the Reversed Sentry and then flips it instead of letting it dissolve', () => {
    let s = fresh(['sig-shazz', 'sig-daxon'])
    s = place(s, 0, 1, 'gears-7', 'reversed')
    s = giveSpark(s, 0, 2)
    const plan = planTurn(s, { seed: 1 })
    const kinds = plan.map((a) => a.type)
    expect(kinds.indexOf('attack')).toBeGreaterThanOrEqual(0)
    expect(kinds.indexOf('ability')).toBeGreaterThan(kinds.indexOf('attack'))
  })

  it('moves the Guard out of the way with Brookskippers when that opens lethal', () => {
    let s = fresh(['sig-luigi', 'sig-daxon'])
    s = place(s, 0, 2, 'tides-knight', 'upright') // Merrick 4/2 in Future
    s = place(s, 1, 1, 'suns-2', 'upright') // Guard Post in Present
    s.players[1].health = 4
    s = hand(s, 0, 'tides-2')
    s = giveSpark(s, 0, 2)
    let st = s
    let won = false
    for (let i = 0; i < 6; i++) {
      const a = chooseAction(st, { seed: 1 })
      st = finalState(runAction(st, a, false), st)
      if (st.phase === 'over') {
        won = st.winner === 0
        break
      }
      if (a.type === 'endTurn') break
    }
    expect(won).toBe(true)
  })

  it('does not draw itself into burns when the hand is already full', () => {
    let s = fresh(['sig-lirielle', 'sig-daxon'])
    for (let i = 0; i < 8; i++) s = hand(s, 0, 'antlers-ace')
    s = hand(s, 0, 'gears-8') // Libra Stellae: draw 3 would burn three
    s.players[0].hand = s.players[0].hand.slice(1) // eight cards, one of them the Libra Stellae
    s = giveSpark(s, 0, 5)
    const a = chooseAction(s, { seed: 1 })
    const libra = s.players[0].hand.find((h) => h.defId === 'gears-8')!
    expect(a.type === 'play' && a.uid === libra.uid && a.face === 'upright').toBe(false)
  })

  it('prefers a trade that frees a lane when the hand holds a playable Figure and the board is full', () => {
    let s = fresh(['sig-daxon', 'sig-luigi'])
    s = place(s, 0, 0, 'antlers-ace', 'upright') // 1/1 wisplight
    s = place(s, 0, 1, 'suns-2', 'upright')
    s = place(s, 0, 2, 'suns-2', 'upright')
    s = place(s, 1, 0, 'suns-2', 'upright') // opposite the wisplight: a 1/3 guard it can attack into
    s = hand(s, 0, 'suns-knight') // Vath waits for a lane
    s = giveSpark(s, 0, 6)
    const plan = planTurn(s, { seed: 1 })
    expect(plan.some((a) => a.type === 'attack' && a.lane === 0)).toBe(true)
  })
})
