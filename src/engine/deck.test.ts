import { describe, expect, it } from 'vitest'
import { SIGNIFICATORS, card } from '../data'
import { addProblem, cardPoolFor, deckProblems, deckShape, isLegalDeck, sameList, starterList } from './deck'
import { beginGame, createGame, finalState } from './engine'

describe('deck rules', () => {
  it('every starter list is legal under the rules it teaches', () => {
    for (const s of SIGNIFICATORS) {
      expect(deckProblems(s.id, starterList(s.id)), s.name).toEqual([])
    }
  })

  it('names each problem in the words the builder shows', () => {
    const shazz = 'sig-shazz'
    const list = starterList(shazz)
    expect(deckProblems(shazz, list.slice(0, 24))).toEqual(['24 of 30 cards.'])
    // A third Yvette.
    const three = [...list.filter((id) => id !== 'gears-3').slice(1), 'gears-3', 'gears-3', 'gears-3']
    expect(deckProblems(shazz, three)).toContain('Remove one extra copy of Yvette Mirthwell.')
    // Shazz's own card, The Devil.
    const own = [...list.slice(1), 'major-15']
    expect(deckProblems(shazz, own).some((p) => p.includes("own card"))).toBe(true)
    // A Tides card in a Gears and Antlers deck.
    const off = [...list.slice(1), 'tides-knight']
    expect(deckProblems(shazz, off)[0]).toMatch(/Merrick Blackwater is Tides, outside/)
    // A token.
    expect(deckProblems(shazz, [...list.slice(1), 'tok-brog'])[0]).toMatch(/token/)
    expect(isLegalDeck(shazz, list)).toBe(true)
  })

  it('says why one more copy cannot go in', () => {
    const luigi = 'sig-luigi'
    const list = starterList(luigi)
    const full = list
    expect(addProblem(luigi, full.slice(0, 29), 'tides-knight')).toBeNull()
    expect(addProblem(luigi, full, 'tides-knight')).toMatch(/full at 30/)
    const twoMerricks = ['tides-knight', 'tides-knight']
    expect(addProblem(luigi, twoMerricks, 'tides-knight')).toBe('Only two copies of Merrick Blackwater.')
    expect(addProblem(luigi, ['major-13'], 'major-13')).toBe('Only one copy of a Major Arcana.')
    expect(addProblem(luigi, [], 'major-9')).toMatch(/own card/)
    expect(addProblem(luigi, [], 'suns-2')).toMatch(/Suns/)
    expect(addProblem(luigi, [], 'tok-brog')).toMatch(/token/)
  })

  it('offers each Significator its two suits and every Major but its own', () => {
    const pool = cardPoolFor('sig-daxon')
    expect(pool.some((c) => c.id === 'major-0')).toBe(false)
    expect(pool.every((c) => c.suit === 'major' || c.suit === 'suns' || c.suit === 'tides')).toBe(true)
    expect(pool.some((c) => c.token)).toBe(false)
  })

  it('summarises a list by printed cost and type', () => {
    const shape = deckShape(starterList('sig-daxon'))
    expect(shape.curve.reduce((a, b) => a + b, 0)).toBe(30)
    expect(shape.figures + shape.omens + shape.relics).toBe(30)
    expect(sameList(['a', 'b', 'a'], ['b', 'a', 'a'])).toBe(true)
    expect(sameList(['a', 'b'], ['a', 'a'])).toBe(false)
  })

  it('a game deals exactly the list it is given, and Luigi still gets Brog', () => {
    const list = starterList('sig-luigi').slice()
    const i = list.indexOf('tides-knight')
    list[i] = 'gears-2' // a Mr. Boscoe in place of a Merrick
    const g = createGame({ sigs: ['sig-luigi', 'sig-daxon'], seed: 9, humanPlayer: 0, firstPlayer: 0, decks: [list, undefined] })
    const s = finalState(beginGame(g, false), g)
    const dealt = [...s.players[0].deck, ...s.players[0].hand].map((c) => c.defId).filter((id) => id !== 'tok-brog')
    expect(sameList(dealt, list)).toBe(true)
    expect(s.players[0].hand.some((c) => c.defId === 'tok-brog')).toBe(true)
    // The other seat kept its starter.
    const theirs = [...s.players[1].deck, ...s.players[1].hand].map((c) => c.defId)
    expect(sameList(theirs, starterList('sig-daxon'))).toBe(true)
    expect(card('gears-2').name).toBe('Mr. Boscoe')
  })
})
