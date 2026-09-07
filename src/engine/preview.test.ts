// The interface's previews must say what the engine then does. These pin them together.
import { describe, expect, it } from 'vitest'
import { beginGame, createGame, finalState, runAction } from './engine'
import { attackOf, drawForecast, figAt, healthOf, previewAttack, previewPlay } from './queries'
import type { Face, GameState, LaneIndex } from './types'

function fresh(sigs: [string, string], seed = 5): GameState {
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
function hand(state: GameState, p: 0 | 1, ...ids: string[]): GameState {
  const s = structuredClone(state)
  for (const id of ids) s.players[p].hand.push({ uid: s.nextUid++, defId: id })
  return s
}
function run(state: GameState, a: Parameters<typeof runAction>[1]): GameState {
  return finalState(runAction(state, a, true), state)
}

describe('previews agree with resolution', () => {
  it('a trade: the numbers shown are the numbers dealt', () => {
    let s = fresh(['sig-shazz', 'sig-daxon'])
    s = place(s, 0, 1, 'gears-7', 'reversed') // Sentry Reversed, 5/2, and Shazz adds 1 Attack
    s = place(s, 1, 1, 'suns-2', 'upright') // Guard Post 1/3
    const atk = figAt(s, 0, 1)!
    const pv = previewAttack(s, atk, 1)
    expect(pv.deals).toBe(6)
    expect(pv.takes).toBe(1)
    expect(pv.defenderDies).toBe(true)
    expect(pv.attackerDies).toBe(false)
    const after = run(s, { type: 'attack', lane: 1, targetLane: 1 })
    expect(figAt(after, 1, 1)).toBeNull()
    expect(figAt(after, 0, 1)!.damage).toBe(1)
  })

  it('an open lane: the Significator takes the whole blow, and lethal is called', () => {
    let s = fresh(['sig-daxon', 'sig-rorik'])
    s = place(s, 0, 2, 'tides-knight', 'upright') // Merrick 4/2
    s.players[1].health = 4
    const pv = previewAttack(s, figAt(s, 0, 2)!, 2)
    expect(pv.defender.kind).toBe('sig')
    expect(pv.deals).toBe(4)
    expect(pv.lethal).toBe(true)
    const after = run(s, { type: 'attack', lane: 2, targetLane: 2 })
    expect(after.phase).toBe('over')
    expect(after.winner).toBe(0)
  })

  it('a Guard beside an open lane steps in, and the preview says so', () => {
    let s = fresh(['sig-daxon', 'sig-rorik'])
    s = place(s, 0, 1, 'tides-knight', 'upright') // Merrick 4/2 in Present
    s = place(s, 1, 0, 'suns-2', 'upright') // Guard Post in Past, Present open
    const pv = previewAttack(s, figAt(s, 0, 1)!, 1)
    expect(pv.intercepted).toBe(true)
    expect(pv.defender).toMatchObject({ kind: 'figure', player: 1, lane: 0 })
    expect(pv.deals).toBe(4)
    const after = run(s, { type: 'attack', lane: 1, targetLane: 1 })
    expect(after.players[1].health).toBe(20)
    expect(figAt(after, 1, 0)).toBeNull()
  })

  it('a Figure from hand previews with the hero passive included', () => {
    let s = fresh(['sig-shazz', 'sig-daxon'])
    s = hand(s, 0, 'antlers-2') // Voren, 1/3; Reversed 3/1, and Shazz adds 1
    s.players[0].spark = 5
    const pv = previewPlay(s, 0, 'antlers-2', 'reversed')!
    expect(pv.atk).toBe(4)
    expect(pv.hp).toBe(1)
    const uid = s.players[0].hand[0].uid
    const after = run(s, { type: 'play', uid, face: 'reversed', lane: 1 })
    const f = figAt(after, 0, 1)!
    expect(attackOf(after, f)).toBe(pv.atk)
    expect(healthOf(after, f)).toBe(pv.hp)
  })

  it('the draw forecast knows the Full Moon, Lirielle, and the hand cap', () => {
    let s = fresh(['sig-lirielle', 'sig-daxon'])
    s.round = 2
    s.turn = 3 // Lirielle's turn in round 2; her next turn is round 3, a Full Moon
    for (let i = 0; i < 7; i++) s = hand(s, 0, 'antlers-ace')
    const f = drawForecast(s, 0)
    expect(f.round).toBe(3)
    expect(f.phase).toBe('full')
    expect(f.draws).toBe(3)
    expect(f.burns).toBe(2)
  })

  it('a burn is reported once', () => {
    let s = fresh(['sig-daxon', 'sig-rorik'])
    for (let i = 0; i < 8; i++) s = hand(s, 0, 'suns-ace')
    const toThem = runAction(s, { type: 'endTurn' }, true)
    const mid = finalState(toThem, s)
    const back = runAction(mid, { type: 'endTurn' }, true)
    const burns = back.filter((st) => st.ev.kind === 'burn')
    const burnLogs = back.filter((st) => st.ev.kind === 'log' && /burns/.test(st.ev.text ?? ''))
    expect(burns.length).toBe(1)
    expect(burnLogs.length).toBe(0)
  })
})

// The engine-run outcome: what the interface shows once text and Relics are counted.
import { attackOutcome } from './preview'
import { card } from '../data'

describe('attack outcome', () => {
  it('counts a Relic that turns the defender before the blow (Tidecaller on Merrick)', () => {
    let s = fresh(['sig-luigi', 'sig-masque'])
    s = place(s, 0, 1, 'tides-knight', 'upright') // Merrick 4/2
    s.players[0].lanes[1]!.relics.push({ uid: s.nextUid++, defId: 'tides-8', face: 'upright' }) // +2/+2, attack turns the defender Upright
    s = place(s, 1, 1, 'gears-7', 'reversed') // Sentry Reversed 5/2; Upright it is 2/5
    const o = attackOutcome(s, 1, 1)
    expect(o.exact).toBe(true)
    expect(o.attackText).toBe(true)
    expect(o.deals).toBe(6)
    expect(o.takes).toBe(2)
    expect(o.defenderDies).toBe(true)
    expect(o.attackerDies).toBe(false)
    expect(o.attackerHp).toBe(2)
    const after = run(s, { type: 'attack', lane: 1, targetLane: 1 })
    expect(figAt(after, 1, 1)).toBeNull()
    expect(healthOf(after, figAt(after, 0, 1)!)).toBe(2)
  })

  it('matches the plain exchange when no text is involved', () => {
    let s = fresh(['sig-daxon', 'sig-rorik'])
    s = place(s, 0, 1, 'tides-knight', 'upright') // Merrick 4/2
    s = place(s, 1, 1, 'suns-2', 'upright') // Guard Post 1/3
    const o = attackOutcome(s, 1, 1)
    const pv = previewAttack(s, figAt(s, 0, 1)!, 1)
    expect(o.exact).toBe(true)
    expect([o.deals, o.takes, o.defenderDies, o.attackerDies]).toEqual([pv.deals, pv.takes, pv.defenderDies, pv.attackerDies])
    expect(o.attackerHp).toBe(1)
  })

  it('names a Last Rite and calls lethal on the Significator', () => {
    let s = fresh(['sig-daxon', 'sig-rorik'])
    s = place(s, 0, 2, 'tides-knight', 'upright') // Merrick 4/2
    s = place(s, 1, 2, 'antlers-ace', 'upright') // Wisplight 1/1, Last Rite: draw
    expect(attackOutcome(s, 2, 2).defenderRite).toBe(true)
    s.players[1].lanes[2] = null
    s.players[1].health = 4
    const o = attackOutcome(s, 2, 2)
    expect(o.defender.kind).toBe('sig')
    expect(o.lethal).toBe(true)
  })

  it('stops short of a claim when the attack text rolls dice', () => {
    const def = card('tides-8')
    const saved = structuredClone(def.relic!.upright.effects)
    def.relic!.upright.effects = [{ trigger: 'onAttack', ops: [{ op: 'flip', to: 'randomEnemyFigure' }] }]
    try {
      let s = fresh(['sig-luigi', 'sig-masque'])
      s = place(s, 0, 1, 'tides-knight', 'upright')
      s.players[0].lanes[1]!.relics.push({ uid: s.nextUid++, defId: 'tides-8', face: 'upright' })
      s = place(s, 1, 1, 'gears-7', 'reversed')
      s = place(s, 1, 0, 'suns-2', 'upright')
      const o = attackOutcome(s, 1, 1)
      expect(o.exact).toBe(false)
      expect(o.attackText).toBe(true)
    } finally {
      def.relic!.upright.effects = saved
    }
  })
})
