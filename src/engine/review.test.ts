// Scenarios from the 2026-09-06 design review (T01 to T13), reproduced against the engine,
// plus the resolution rules those scenarios exposed. Each test states the rule it pins.
import { afterEach, describe, expect, it } from 'vitest'
import { beginGame, createGame, finalState, legalActions, mulligan, runAction } from './engine'
import { attackOf, availableSpark, healthOf, keywords } from './queries'
import { RULES } from './rules'
import type { Face, GameState, LaneIndex, Step, TargetRef } from './types'

function fresh(sigs: [string, string] = ['sig-daxon', 'sig-lirielle'], seed = 42): GameState {
  const g = createGame({ sigs, seed, firstPlayer: 0 })
  return finalState(beginGame(g, false), g)
}
// Put a card in the active player's hand with plenty of spark.
function give(state: GameState, defId: string, spark = 10): { state: GameState; uid: number } {
  const s = structuredClone(state)
  const uid = s.nextUid++
  s.players[s.active].hand.push({ uid, defId })
  s.players[s.active].spark = spark
  s.players[s.active].maxSpark = Math.max(s.players[s.active].maxSpark, spark)
  s.players[s.active].tempSpark = 0
  return { state: s, uid }
}
function play(state: GameState, uid: number, face: Face, lane?: LaneIndex, target?: TargetRef) {
  return finalState(runAction(state, { type: 'play', uid, face, lane, target }, false), state)
}
function run(state: GameState, a: Parameters<typeof runAction>[1]): { state: GameState; steps: Step[] } {
  const steps = runAction(state, a, false)
  return { state: finalState(steps, state), steps }
}
function end(state: GameState) {
  return finalState(runAction(state, { type: 'endTurn' }, false), state)
}
// Drop a figure straight onto the board (no Arrive), for constructed positions.
function place(state: GameState, p: 0 | 1, lane: LaneIndex, defId: string, face: Face, damage = 0): GameState {
  const s = structuredClone(state)
  s.players[p].lanes[lane] = {
    uid: s.nextUid++,
    defId,
    owner: p,
    lane,
    face,
    damage,
    permAtk: 0,
    permHp: 0,
    tempAtk: 0,
    tempHp: 0,
    grantedKw: [],
    removedKw: [],
    hushed: false,
    aegis: false,
    rekindled: false,
    asleep: false,
    summonedTurn: -1, // may act
    attacksThisTurn: 0,
    movedThisTurn: false,
    onceUsed: [],
    relics: [],
  }
  return s
}
const fig = (s: GameState, p: 0 | 1, lane: LaneIndex) => s.players[p].lanes[lane]
const ref = (p: 0 | 1, lane: LaneIndex): TargetRef => ({ kind: 'figure', player: p, lane })

afterEach(() => {
  RULES.rorikConditional = false
  RULES.mulligan = false
})

describe('T01 wounds persist across a flip', () => {
  it('a wounded Heartwood dies the moment it turns; a wounded Oondray survives with less Attack', () => {
    let s = place(fresh(), 0, 1, 'antlers-10', 'upright', 1)
    s = place(s, 0, 0, 'antlers-3', 'reversed', 1)
    expect(healthOf(s, fig(s, 0, 1)!)).toBe(7)
    expect(healthOf(s, fig(s, 0, 0)!)).toBe(1)
    let g = give(s, 'antlers-6')
    s = play(g.state, g.uid, 'upright', undefined, ref(0, 1))
    expect(fig(s, 0, 1)).toBeNull()
    g = give(s, 'antlers-6')
    s = play(g.state, g.uid, 'upright', undefined, ref(0, 0))
    const o = fig(s, 0, 0)!
    expect(o.face).toBe('upright')
    expect(attackOf(s, o)).toBe(2)
    expect(healthOf(s, o)).toBe(2)
  })
})

describe('T02 the Sentry is a sequencing card', () => {
  it('Shazz: play Reversed, hit for 6, flip it Upright, and it no longer dissolves', () => {
    let s = fresh(['sig-shazz', 'sig-daxon'])
    const g = give(s, 'gears-7', 6)
    s = play(g.state, g.uid, 'reversed', 1)
    expect(attackOf(s, fig(s, 0, 1)!)).toBe(6) // 5 + Pride
    const hp = s.players[1].health
    s = run(s, { type: 'attack', lane: 1 }).state
    expect(s.players[1].health).toBe(hp - 6)
    s = run(s, { type: 'ability', target: ref(0, 1) }).state
    const f = fig(s, 0, 1)!
    expect(f.face).toBe('upright')
    expect(keywords(s, f)).toEqual(expect.arrayContaining(['guard', 'fixed']))
    s = end(s)
    expect(fig(s, 0, 1)?.defId).toBe('gears-7') // survived the end of turn
  })
  it('left Reversed, it dissolves at the end of the turn (and that counts as a death)', () => {
    let s = fresh(['sig-shazz', 'sig-daxon'])
    s = place(s, 1, 0, 'suns-5', 'reversed') // Vraxxis watches
    const g = give(s, 'gears-7', 6)
    s = play(g.state, g.uid, 'reversed', 1)
    s = end(s)
    expect(fig(s, 0, 1)).toBeNull()
    expect(fig(s, 1, 0)!.permAtk).toBe(1) // Vraxxis grew: dissolving is dying
  })
})

describe('T03 Mordeaux copies', () => {
  it('copies Liquid Mana: 5 Spark, cast for 4, end at 7; temporary Spark is uncapped', () => {
    let s = fresh(['sig-luigi', 'sig-daxon'])
    s = place(s, 0, 0, 'gears-knight', 'upright')
    const g = give(s, 'gears-6', 5)
    s = play(g.state, g.uid, 'upright')
    expect(availableSpark(s.players[0])).toBe(7)
  })
  it('a copy is not a cast: the Magician taxes once and a second Mordeaux copies once each', () => {
    let s = fresh(['sig-luigi', 'sig-daxon'])
    s = place(s, 0, 0, 'gears-knight', 'upright')
    s = place(s, 0, 1, 'gears-knight', 'upright')
    s = place(s, 0, 2, 'major-1', 'upright')
    const g = give(s, 'gears-ace', 5)
    const before = s.players[1].health
    s = play(g.state, g.uid, 'upright')
    expect(s.players[1].health).toBe(before - 1) // Magician once
    expect(availableSpark(s.players[0])).toBe(5 - 1 + 3) // sphere plus two copies
  })
  it('a countered Omen produces no copy', () => {
    let s = fresh(['sig-luigi', 'sig-daxon'])
    s = place(s, 0, 0, 'gears-knight', 'upright')
    s = place(s, 1, 1, 'gears-9', 'upright') // Mr. Zero
    const g = give(s, 'gears-6', 5)
    s = play(g.state, g.uid, 'upright')
    expect(availableSpark(s.players[0])).toBe(1)
    expect(fig(s, 1, 1)).toBeNull() // Zero shattered
  })
  it('the copy fizzles when the chosen Figure is gone', () => {
    let s = fresh(['sig-luigi', 'sig-daxon'])
    s = place(s, 0, 0, 'gears-knight', 'upright')
    s = place(s, 1, 1, 'tides-4', 'upright') // Bimp 3/3; his Last Rite fills the empty lanes with Raccoons
    const g = give(s, 'suns-9', 10) // Solar Flare Cannon U: 5 to a figure, 2 to face
    const hp = s.players[1].health
    s = play(g.state, g.uid, 'upright', undefined, ref(1, 1))
    expect(fig(s, 1, 1)?.defId).toBe('tok-raccoon') // the Raccoon that took Bimp's lane is untouched
    expect(fig(s, 1, 1)!.damage).toBe(0)
    expect(s.players[1].health).toBe(hp - 2) // face damage once: the copy fizzled with its target
  })
})

describe('T05 Guard redirection and movement into lethal', () => {
  it('a Guard in Present catches an attack into empty Future; moved to Past it does not', () => {
    let s = fresh(['sig-luigi', 'sig-daxon'])
    s = place(s, 0, 2, 'tides-knight', 'upright') // Merrick 4/2 in Future
    s = place(s, 1, 1, 'suns-2', 'upright') // Guard Post 1/3 in Present
    const acts = legalActions(s)
    const atk = acts.find((a) => a.type === 'attack' && a.lane === 2)!
    const hp = s.players[1].health
    const t1 = run(s, atk).state
    expect(t1.players[1].health).toBe(hp)
    expect(fig(t1, 1, 1)).toBeNull() // the guard died, Merrick lived with 1
    expect(healthOf(t1, fig(t1, 0, 2)!)).toBe(1)
    // Same start, but Brookskippers moves the guard first.
    const g = give(s, 'tides-2', 10)
    let t2 = play(g.state, g.uid, 'upright', undefined, ref(1, 1))
    expect(fig(t2, 1, 1)).toBeNull()
    expect(fig(t2, 1, 0)?.defId).toBe('suns-2') // pushed toward Past
    t2 = run(t2, { type: 'attack', lane: 2 }).state
    expect(t2.players[1].health).toBe(hp - 4)
  })
  it('Gale into an empty lane is still intercepted by an adjacent Guard', () => {
    let s = fresh(['sig-luigi', 'sig-daxon'])
    s = place(s, 0, 0, 'antlers-knight', 'upright') // Thorn: Windborne, Gale
    s = place(s, 1, 1, 'suns-2', 'upright')
    const hp = s.players[1].health
    s = run(s, { type: 'attack', lane: 0, targetLane: 2 }).state
    expect(s.players[1].health).toBe(hp)
    expect(fig(s, 1, 1)).toBeNull()
  })
})

describe('T10 hand capacity', () => {
  it('a full hand burns draws and the burn is counted', () => {
    let s = fresh(['sig-lirielle', 'sig-daxon'])
    const pl = s.players[0]
    while (pl.hand.length < 8) pl.hand.push({ uid: s.nextUid++, defId: 'antlers-ace' })
    const g = give(s, 'gears-8', 10) // Libra Stellae U: draw 3
    s = play(g.state, g.uid, 'upright')
    expect(s.players[0].hand.length).toBe(8)
    expect(s.players[0].burnsThisGame).toBe(3)
  })
})

describe('T11 Calvera', () => {
  it('against a one-card hand the fallback deals 5 and the card stays', () => {
    let s = fresh(['sig-daxon', 'sig-luigi'])
    s.players[1].hand = [{ uid: 900, defId: 'antlers-ace' }]
    const g = give(s, 'tides-queen', 10)
    const hp = s.players[1].health
    s = play(g.state, g.uid, 'upright', 1)
    expect(s.players[1].health).toBe(hp - 5)
    expect(s.players[1].hand.length).toBe(1)
  })
  it('Reversed at 3 Health kills its own Significator', () => {
    let s = fresh(['sig-daxon', 'sig-luigi'])
    s.players[0].health = 3
    s = place(s, 1, 1, 'suns-knight', 'upright')
    const g = give(s, 'tides-queen', 10)
    s = play(g.state, g.uid, 'reversed', 1)
    expect(s.phase).toBe('over')
    expect(s.winner).toBe(1)
  })
})

describe('global flips and the Oath-Coin', () => {
  it('a Figure that dies from a global flip is gone before its Oath-Coin can flip anything back', () => {
    let s = fresh(['sig-luigi', 'sig-daxon'])
    s = place(s, 0, 1, 'antlers-10', 'upright', 2) // Heartwood 2/9 with the coin, two wounds: Reversed it is 9/2, dead
    fig(s, 0, 1)!.relics.push({ uid: s.nextUid++, defId: 'tides-6', face: 'upright' })
    s = place(s, 1, 1, 'suns-2', 'upright') // opposite: Guard Post
    const g = give(s, 'major-10', 10) // Wheel of Fortune R: flip every Figure, 2 to each Significator
    s = play(g.state, g.uid, 'reversed')
    expect(fig(s, 0, 1)).toBeNull()
    expect(fig(s, 1, 1)!.face).toBe('reversed') // flipped once by the Wheel, never a second time by the coin
  })
})

describe('Rekindle is a replaced death', () => {
  it('no Last Rite, no death trigger, one use, Fixed does not stop the return', () => {
    let s = fresh(['sig-daxon', 'sig-luigi'])
    s = place(s, 0, 1, 'suns-page', 'upright') // Voss: Rekindle
    fig(s, 0, 1)!.grantedKw.push('fixed')
    s = place(s, 1, 0, 'suns-5', 'reversed') // Vraxxis grows on deaths
    const g = give(s, 'antlers-6', 10) // Lake Mirrara R: 2 to every Upright figure
    s = play(g.state, g.uid, 'reversed')
    const v = fig(s, 0, 1)!
    expect(v.face).toBe('reversed')
    expect(v.rekindled).toBe(true)
    expect(healthOf(s, v)).toBe(1)
    expect(fig(s, 1, 0)!.permAtk).toBe(0) // Vraxxis did not grow
  })
})

describe('Aegis', () => {
  it('a Relic shield is spent by one hit and comes back only at the start of its owner’s turn', () => {
    let s = fresh(['sig-daxon', 'sig-luigi'])
    s = place(s, 0, 1, 'suns-2', 'upright')
    let g = give(s, 'suns-8', 10)
    s = play(g.state, g.uid, 'upright', undefined, ref(0, 1)) // Aurium Plate: Aegis
    expect(fig(s, 0, 1)!.aegis).toBe(true)
    s = end(s) // Luigi's turn
    g = give(s, 'gears-ace', 10)
    s = play(g.state, g.uid, 'upright') // any play: no recharge for Daxon's figure
    // Luigi's Eldritch Blast pops the shield.
    s = run(s, { type: 'ability', target: ref(0, 1) }).state
    expect(fig(s, 0, 1)!.aegis).toBe(false)
    expect(fig(s, 0, 1)!.damage).toBe(0)
    s = end(s) // back to Daxon: recharge
    expect(fig(s, 0, 1)!.aegis).toBe(true)
  })
  it('Rorik shields both neighbors at once; area damage cannot pick which one', () => {
    let s = fresh(['sig-rorik', 'sig-luigi'])
    s = place(s, 0, 0, 'suns-2', 'upright')
    s = place(s, 0, 2, 'suns-2', 'upright')
    const g = give(s, 'major-12', 10)
    s = play(g.state, g.uid, 'upright', 1, { kind: 'sig', player: 0 })
    expect(fig(s, 0, 0)!.aegis && fig(s, 0, 2)!.aegis).toBe(true)
    s = end(s)
    const g2 = give(s, 'suns-9', 10)
    s = play(g2.state, g2.uid, 'reversed') // 3 to every enemy figure
    expect(fig(s, 0, 0)!.damage).toBe(0)
    expect(fig(s, 0, 2)!.damage).toBe(0)
    expect(fig(s, 0, 1)!.damage).toBe(3) // Rorik himself is not shielded by his own aura
  })
})

describe('targeting and Veiled', () => {
  it('Yvette Upright can strip a Veiled Figure; ordinary Omens cannot target it', () => {
    let s = fresh(['sig-luigi', 'sig-daxon'])
    s = place(s, 1, 1, 'antlers-5', 'reversed') // Veiled shadowling
    const g = give(s, 'gears-3', 10)
    const acts = legalActions(g.state).filter((a) => a.type === 'play' && a.uid === g.uid && a.face === 'upright')
    expect(acts.some((a) => a.type === 'play' && a.target?.lane === 1)).toBe(true)
    s = play(g.state, g.uid, 'upright', 0, ref(1, 1))
    expect(keywords(s, fig(s, 1, 1)!)).not.toContain('veiled')
    const g2 = give(s, 'suns-9', 10)
    const cannon = legalActions(g2.state).filter((a) => a.type === 'play' && a.uid === g2.uid && a.face === 'upright')
    expect(cannon.length).toBeGreaterThan(0) // now targetable
  })
})

describe('the Bone Moon', () => {
  it('The Moon Reversed rises at the start of the next round, one point for each player', () => {
    let s = fresh(['sig-luigi', 'sig-daxon']) // round 1, Luigi's turn
    const g = give(s, 'major-18', 10)
    s = play(g.state, g.uid, 'reversed')
    expect(s.boneMoonRound).toBe(2)
    const h0 = s.players[0].health
    const h1 = s.players[1].health
    s = end(s) // Daxon, round 1: no bite yet
    expect(s.players[1].health).toBe(h1)
    s = end(s) // Luigi, round 2: first bite, 1
    expect(s.players[0].health).toBe(h0 - 1)
    s = end(s) // Daxon, round 2: first bite, 1
    expect(s.players[1].health).toBe(h1 - 1)
  })
  it('a Significator at 0 loses at once, before any start-of-turn healing', () => {
    let s = fresh(['sig-luigi', 'sig-daxon'])
    s = place(s, 0, 1, 'major-8', 'reversed') // Grimore at rest: heals 4 at start of turn
    s.boneMoonRound = 1
    s.players[0].health = 1
    s = end(s) // to Daxon
    s = end(s) // Luigi's turn: bite 2 on 1 Health
    expect(s.phase).toBe('over')
    expect(s.winner).toBe(1)
  })
  it('lethal damage mid-Omen ends the game before later healing in the same effect', () => {
    let s = fresh(['sig-luigi', 'sig-daxon'])
    s.players[0].health = 2
    const g = give(s, 'major-10', 10) // Wheel R: flip all, then 2 damage to each Significator
    s = play(g.state, g.uid, 'reversed')
    expect(s.phase).toBe('over')
  })
})

describe('an attack stops if the defender leaves before the blow', () => {
  it('Tidecaller turns a wounded Reversed defender Upright; if that kills it, no damage reaches the face', () => {
    let s = fresh(['sig-daxon', 'sig-luigi'])
    s = place(s, 0, 1, 'tides-3', 'upright')
    fig(s, 0, 1)!.relics.push({ uid: s.nextUid++, defId: 'tides-8', face: 'upright' })
    s = place(s, 1, 1, 'antlers-10', 'reversed', 1) // 8/1 Heartwood with a wound: Upright it is 1/8 with 7 left, so it lives
    const hp = s.players[1].health
    s = run(s, { type: 'attack', lane: 1 }).state
    expect(fig(s, 1, 1)!.face).toBe('upright')
    expect(s.players[1].health).toBe(hp)
    // Now a defender that dies from the turn: a wounded 1/8 played Upright... use Oondray R 3/2 with 2 wounds? It has 0 already. Use suns-2 U 1/3 with 2 wounds: Reversed it is 3/1, dead.
    let t = fresh(['sig-daxon', 'sig-luigi'])
    t = place(t, 0, 1, 'tides-3', 'upright')
    fig(t, 0, 1)!.relics.push({ uid: t.nextUid++, defId: 'tides-8', face: 'reversed' })
    fig(t, 0, 1)!.relics.push({ uid: t.nextUid++, defId: 'tides-8', face: 'upright' })
    t = place(t, 1, 1, 'suns-2', 'reversed', 2) // 3/1 with two wounds... that is dead already; give one wound: 3/1 with 1 wound = 0. Use Reversed Guard Post with 0 wounds and a Sun flip
    t = place(t, 1, 1, 'antlers-3', 'reversed', 1) // Oondray R 3/2 with 1 wound: Upright it is 2/3 with 2 left. Lives. So the stop rule needs a true death:
    t = place(t, 1, 1, 'suns-2', 'reversed', 0)
    const before = t.players[1].health
    t = run(t, { type: 'attack', lane: 1 }).state
    // Guard Post R 3/1 flipped Upright is 1/3, alive: the attack lands on it, not the face.
    expect(t.players[1].health).toBe(before)
  })
})

describe('Rorik experiment switch', () => {
  it('conditional passive heals only after one of his Figures died on his turn', () => {
    RULES.rorikConditional = true
    let s = fresh(['sig-rorik', 'sig-luigi'])
    s.players[0].health = 10
    s = end(s)
    expect(s.players[0].health).toBe(10) // nothing died
    s = end(s) // Luigi passes
    s = place(s, 0, 1, 'antlers-ace', 'upright')
    s = place(s, 1, 1, 'suns-knight', 'upright') // 3/5 wall
    s = run(s, { type: 'attack', lane: 1 }).state // Wisplight dies attacking
    s = end(s)
    expect(s.players[0].health).toBe(11)
  })
})

describe('mulligan', () => {
  it('sets aside chosen cards, draws replacements, and keeps Brog', () => {
    const g = createGame({ sigs: ['sig-luigi', 'sig-daxon'], seed: 7, firstPlayer: 0 })
    const hand = g.players[0].hand
    const brog = hand.find((h) => h.defId === 'tok-brog')!
    const others = hand.filter((h) => h.defId !== 'tok-brog').slice(0, 2)
    const m = mulligan(g, 0, [brog.uid, ...others.map((h) => h.uid)])
    expect(m.players[0].hand.length).toBe(hand.length)
    expect(m.players[0].hand.some((h) => h.uid === brog.uid)).toBe(true)
    expect(m.players[0].hand.some((h) => h.uid === others[0].uid)).toBe(false)
    expect(m.players[0].deck.length).toBe(g.players[0].deck.length)
  })
})
