// The planner should find the lines the design review says a clever player finds.
import { describe, expect, it } from 'vitest'
import { beginGame, createGame, finalState, runAction } from '../engine/engine'
import { chooseAction, determinize, planTurn } from './ai'
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

  it('cannot lean on the order of cards nobody has seen', () => {
    let s = fresh(['sig-luigi', 'sig-daxon'])
    s = hand(s, 0, 'gears-8') // Libra Stellae: draw three, so the deck order would matter if it could peek
    s = giveSpark(s, 0, 5)
    const a = structuredClone(s)
    const b = structuredClone(s)
    // Same cards in the deck, two orders. Only the top two differ.
    const rest = a.players[0].deck.slice(2)
    a.players[0].deck = [{ uid: 9001, defId: 'suns-page' }, { uid: 9002, defId: 'major-2' }, ...rest]
    b.players[0].deck = [{ uid: 9002, defId: 'major-2' }, { uid: 9001, defId: 'suns-page' }, ...rest]
    const da = determinize(a, 0, 3).players[0].deck.map((c) => c.uid)
    const db = determinize(b, 0, 3).players[0].deck.map((c) => c.uid)
    expect(da).toEqual(db)
    expect(chooseAction(a, { seed: 1 })).toEqual(chooseAction(b, { seed: 1 }))
    // The enemy's hand is unseen too: the planner's world deals it from the same pool.
    const world = determinize(a, 0, 3)
    expect(world.players[1].hand.length).toBe(a.players[1].hand.length)
    expect(world.players[1].deck.length).toBe(a.players[1].deck.length)
  })

  it('keeps the Read candidate that wins now over the one that fits the curve', () => {
    let s = fresh(['sig-daxon', 'sig-rorik'])
    s = giveSpark(s, 0, 2)
    s.players[0].maxSpark = 6
    s.players[1].health = 2
    const death = s.nextUid++
    const elira = s.nextUid++
    s.pending = { kind: 'read', player: 0, options: [{ uid: death, defId: 'major-13' }, { uid: elira, defId: 'suns-page' }] }
    const a = chooseAction(s, { seed: 1 })
    expect(a).toEqual({ type: 'choose', uid: elira })
    let st = s
    for (let i = 0; i < 4 && st.phase !== 'over'; i++) st = finalState(runAction(st, chooseAction(st, { seed: 1 }), false), st)
    expect(st.phase).toBe('over')
    expect(st.winner).toBe(0)
  })

  it('ends the turn at once when the Bone Moon will finish the enemy', () => {
    let s = fresh(['sig-shazz', 'sig-daxon'])
    s.round = 10
    s.turn = 19
    s.players[1].health = 1
    s = hand(s, 0, 'gears-3') // Yvette, playable, and pointless
    s = giveSpark(s, 0, 2)
    expect(chooseAction(s, { seed: 1 })).toEqual({ type: 'endTurn' })
  })

  it('believes about the enemy deck from public play only, never from its list', () => {
    let s = fresh(['sig-luigi', 'sig-daxon'])
    s = hand(s, 0, 'gears-8')
    s = giveSpark(s, 0, 5)
    const a = structuredClone(s)
    const b = structuredClone(s)
    // Two private lists that have shown the same cards: the enemy's unseen composition differs.
    a.players[1].deck = a.players[1].deck.map((c, i) => (i < 6 ? { ...c, defId: 'suns-king' } : c))
    b.players[1].deck = b.players[1].deck.map((c, i) => (i < 6 ? { ...c, defId: 'tides-ace' } : c))
    const wa = determinize(a, 0, 3)
    const wb = determinize(b, 0, 3)
    expect(wa.players[1].deck.map((c) => c.defId)).toEqual(wb.players[1].deck.map((c) => c.defId))
    expect(wa.players[1].hand.map((c) => c.defId)).toEqual(wb.players[1].hand.map((c) => c.defId))
    expect(wa.players[1].deck.length).toBe(a.players[1].deck.length)
    expect(chooseAction(a, { seed: 1 })).toEqual(chooseAction(b, { seed: 1 }))
    // What has been seen is not dealt again: a Figure on the table leaves the belief pool.
    const c = place(structuredClone(s), 1, 1, 'major-13', 'upright') // Death, a one-of
    const wc = determinize(c, 0, 3)
    expect([...wc.players[1].deck, ...wc.players[1].hand].some((x) => x.defId === 'major-13')).toBe(false)
  })
})
