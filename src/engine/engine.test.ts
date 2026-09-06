import { describe, expect, it } from 'vitest'
import { beginGame, createGame, finalState, legalActions, runAction } from './engine'
import { attackOf, healthOf, keywords, figures, cardCost } from './queries'
import { ALL_CARDS, DECK_CARDS, SIGNIFICATORS, card } from '../data'
import type { GameState, LaneIndex } from './types'
import { chooseAction } from '../ai/ai'

function fresh(sigs: [string, string] = ['sig-daxon', 'sig-lirielle'], seed = 42): GameState {
  const g = createGame({ sigs, seed, firstPlayer: 0 })
  return finalState(beginGame(g, false), g)
}

// Put a specific card in the active player's hand and give them the spark to play it.
function give(state: GameState, defId: string, spark = 10): { state: GameState; uid: number } {
  const s = structuredClone(state)
  const uid = s.nextUid++
  s.players[s.active].hand.push({ uid, defId })
  s.players[s.active].spark = spark
  s.players[s.active].maxSpark = spark
  return { state: s, uid }
}

function play(state: GameState, uid: number, face: 'upright' | 'reversed', lane?: LaneIndex, target?: { kind: 'figure' | 'sig'; player: 0 | 1; lane?: LaneIndex }) {
  return finalState(runAction(state, { type: 'play', uid, face, lane, target }, false), state)
}

function end(state: GameState) {
  return finalState(runAction(state, { type: 'endTurn' }, false), state)
}

describe('card data integrity', () => {
  it('has exactly 78 deck cards: 22 majors and 4 suits of 14', () => {
    expect(DECK_CARDS.length).toBe(78)
    expect(DECK_CARDS.filter((c) => c.suit === 'major').length).toBe(22)
    for (const suit of ['suns', 'antlers', 'tides', 'gears'] as const) {
      const cs = DECK_CARDS.filter((c) => c.suit === suit)
      expect(cs.length).toBe(14)
      const ranks = cs.map((c) => c.rank).sort()
      expect(ranks).toEqual(['10', '2', '3', '4', '5', '6', '7', '8', '9', 'ace', 'king', 'knight', 'page', 'queen'])
    }
  })
  it('figures have stats, omens and relics do not', () => {
    for (const c of ALL_CARDS) {
      if (c.type === 'figure') {
        expect(c.attack, c.id).toBeGreaterThanOrEqual(0)
        expect(c.health, c.id).toBeGreaterThan(0)
      } else {
        expect(c.attack, c.id).toBeUndefined()
      }
      if (c.type === 'relic') expect(c.relic, c.id).toBeDefined()
    }
  })
  it('every summon token and every deck entry exists', () => {
    for (const c of ALL_CARDS) {
      for (const face of [c.upright, c.reversed]) {
        for (const e of face.effects ?? []) {
          for (const op of e.ops) {
            if (op.op === 'summon') expect(() => card(op.token), `${c.id} summons ${op.token}`).not.toThrow()
            if (op.op === 'sacrificeThenSummon') expect(() => card(op.token)).not.toThrow()
          }
        }
      }
    }
    for (const s of SIGNIFICATORS) {
      expect(s.deck.length, s.id).toBe(30)
      for (const id of s.deck) expect(() => card(id), `${s.id} deck ${id}`).not.toThrow()
      expect(s.deck.includes(s.cardId), `${s.id} must not carry its own arcana`).toBe(false)
      const counts = new Map<string, number>()
      for (const id of s.deck) counts.set(id, (counts.get(id) ?? 0) + 1)
      for (const [id, n] of counts) {
        const max = card(id).unique ? 1 : 2
        expect(n, `${s.id} has ${n}x ${id}`).toBeLessThanOrEqual(max)
      }
    }
  })
})

describe('turn structure', () => {
  it('starts with 4 cards for the first player and 5 for the second, 1 spark', () => {
    const s = fresh()
    expect(s.players[0].hand.length).toBe(5) // 4 + the first draw
    expect(s.players[1].hand.length).toBe(5)
    expect(s.players[0].maxSpark).toBe(1)
    expect(s.round).toBe(1)
  })
  it('grows spark each turn up to 10 and advances the moon', () => {
    let s = fresh()
    for (let i = 0; i < 24; i++) s = end(s)
    expect(s.players[0].maxSpark).toBe(10)
    expect(s.round).toBe(13)
  })
  it('the Bone Moon bites once it rises', () => {
    let s = fresh()
    const hp0 = s.players[0].health
    for (let i = 0; i < 18; i++) s = end(s) // into round 10
    expect(s.round).toBe(10)
    expect(s.players[0].health).toBeLessThan(hp0)
  })
})

describe('playing figures', () => {
  it('summons into an empty lane and pays spark', () => {
    const { state, uid } = give(fresh(), 'suns-2', 5)
    const s = play(state, uid, 'upright', 1)
    const f = s.players[0].lanes[1]
    expect(f?.defId).toBe('suns-2')
    expect(s.players[0].spark).toBe(3)
    expect(keywords(s, f!)).toContain('guard')
  })
  it('reversed face swaps attack and health', () => {
    const { state, uid } = give(fresh(), 'suns-2', 5)
    const s = play(state, uid, 'reversed', 1)
    const f = s.players[0].lanes[1]!
    expect(attackOf(s, f)).toBe(3)
    expect(healthOf(s, f)).toBe(1)
    expect(keywords(s, f)).toContain('windborne')
  })
  it('Enters Reversed cards cannot be played upright', () => {
    const { state, uid } = give(fresh(), 'antlers-5', 5)
    const s = play(state, uid, 'upright', 0)
    expect(s.players[0].lanes[0]).toBeNull()
    const s2 = play(state, uid, 'reversed', 0)
    expect(s2.players[0].lanes[0]?.face).toBe('reversed')
  })
  it('Arrive effects resolve with their chosen target', () => {
    let { state, uid } = give(fresh(), 'suns-2', 10)
    let s = play(state, uid, 'upright', 0)
    ;({ state, uid } = give(s, 'suns-3', 10))
    s = play(state, uid, 'upright', 1, { kind: 'figure', player: 0, lane: 0 })
    expect(attackOf(s, s.players[0].lanes[0]!)).toBe(3)
  })
})

describe('combat', () => {
  it('summoned figures cannot attack until next turn unless windborne', () => {
    const { state, uid } = give(fresh(), 'suns-2', 5)
    const s = play(state, uid, 'upright', 1)
    expect(legalActions(s).some((a) => a.type === 'attack')).toBe(false)
    const s2 = play(give(fresh(), 'suns-2', 5).state, give(fresh(), 'suns-2', 5).uid, 'reversed', 1)
    expect(legalActions(s2).some((a) => a.type === 'attack')).toBe(true)
  })
  it('attacks hit the figure opposite, or the significator if the lane is empty', () => {
    const { state, uid } = give(fresh(), 'suns-2', 5)
    let s = play(state, uid, 'reversed', 1) // 3/1 windborne
    const hp = s.players[1].health
    s = finalState(runAction(s, { type: 'attack', lane: 1 }, false), s)
    expect(s.players[1].health).toBe(hp - 3)
  })
  it('Guard redirects attacks from adjacent empty lanes', () => {
    let s = fresh()
    // Opponent gets a guard in lane 0; we attack into lane 1.
    s = end(s)
    let g = give(s, 'suns-2', 5)
    s = play(g.state, g.uid, 'upright', 0)
    s = end(s)
    g = give(s, 'suns-2', 5)
    s = play(g.state, g.uid, 'reversed', 1)
    const hp = s.players[1].health
    s = finalState(runAction(s, { type: 'attack', lane: 1 }, false), s)
    expect(s.players[1].health).toBe(hp)
    expect(s.players[1].lanes[0]).toBeNull() // the 1/3 guard took all 3 and fell
  })
})

describe('flipping', () => {
  it('flip keeps damage as a wound and swaps stats', () => {
    let g = give(fresh(), 'antlers-10', 10) // Heartwood 1/8
    let s = play(g.state, g.uid, 'upright', 1)
    const f = s.players[0].lanes[1]!
    f.damage = 1
    g = give(s, 'antlers-6', 10) // Lake Mirrara: flip
    s = play(g.state, g.uid, 'upright', undefined, { kind: 'figure', player: 0, lane: 1 })
    const f2 = s.players[0].lanes[1]
    // 8/1 with 1 damage: dead.
    expect(f2).toBeNull()
  })
  it('Fixed figures do not flip', () => {
    let g = give(fresh(), 'suns-knight', 10)
    let s = play(g.state, g.uid, 'upright', 1)
    g = give(s, 'antlers-6', 10)
    s = play(g.state, g.uid, 'upright', undefined, { kind: 'figure', player: 0, lane: 1 })
    expect(s.players[0].lanes[1]?.face).toBe('upright')
  })
  it('Rekindle returns the figure reversed with 1 health', () => {
    let g = give(fresh(), 'suns-page', 10) // Voss 2/2 rekindle
    let s = play(g.state, g.uid, 'upright', 1)
    g = give(s, 'suns-9', 10) // Solar Flare Cannon 5 dmg... must target enemy; use Eva reversed instead
    // Damage it ourselves via Kojin-free route: use destroy through Mr. Zero reversed? Simplest: Lake Mirrara reversed deals 2 to upright figures.
    g = give(s, 'antlers-6', 10)
    s = play(g.state, g.uid, 'reversed')
    const f = s.players[0].lanes[1]!
    expect(f.face).toBe('reversed')
    expect(f.rekindled).toBe(true)
    expect(healthOf(s, f)).toBe(1)
  })
})

describe('omens and relics', () => {
  it('Eldertech Sphere upright draws and refunds', () => {
    const g = give(fresh(), 'gears-ace', 3)
    const before = g.state.players[0].hand.length
    const s = play(g.state, g.uid, 'upright')
    expect(s.players[0].hand.length).toBe(before) // -1 played +1 drawn
    expect(s.players[0].spark + s.players[0].tempSpark).toBe(3)
  })
  it('relics attach and add stats; Daxon pays 1 less', () => {
    let g = give(fresh(), 'suns-2', 10)
    let s = play(g.state, g.uid, 'upright', 0)
    g = give(s, 'suns-8', 10)
    expect(cardCost(g.state, 0, 'suns-8')).toBe(4)
    s = play(g.state, g.uid, 'upright', undefined, { kind: 'figure', player: 0, lane: 0 })
    const f = s.players[0].lanes[0]!
    expect(attackOf(s, f)).toBe(3)
    expect(healthOf(s, f)).toBe(6)
    expect(f.aegis).toBe(true)
  })
  it('Mr. Zero counters the next enemy omen and shatters', () => {
    let s = fresh()
    let g = give(s, 'gears-9', 10)
    s = play(g.state, g.uid, 'upright', 1)
    s = end(s)
    g = give(s, 'gears-ace', 10)
    const before = s.players[1].hand.length + 1
    s = play(g.state, g.uid, 'upright')
    expect(s.players[1].hand.length).toBe(before - 1) // no draw
    expect(s.players[0].lanes[1]).toBeNull()
  })
  it('Read creates a pending choice that must be resolved', () => {
    const g = give(fresh(), 'gears-page', 10)
    const s = play(g.state, g.uid, 'upright', 0)
    expect(s.pending?.kind).toBe('read')
    expect(s.pending?.options.length).toBe(2)
    const acts = legalActions(s)
    expect(acts.every((a) => a.type === 'choose')).toBe(true)
    const s2 = finalState(runAction(s, acts[0], false), s)
    expect(s2.pending).toBeNull()
  })
})

describe('ai', () => {
  it('plays full games to completion against itself', () => {
    let finished = 0
    for (let seed = 1; seed <= 6; seed++) {
      const sigs = [SIGNIFICATORS[seed % 6].id, SIGNIFICATORS[(seed + 2) % 6].id] as [string, string]
      let s = fresh(sigs, seed)
      let guard = 0
      while (s.phase !== 'over' && guard++ < 600) {
        const a = chooseAction(s, { seed })
        s = finalState(runAction(s, a, false), s)
      }
      if (s.phase === 'over') finished++
      expect(figures(s, 0).length).toBeLessThanOrEqual(3)
    }
    expect(finished).toBe(6)
  })
})
