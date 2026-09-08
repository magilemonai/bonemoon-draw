import { describe, expect, it } from 'vitest'
import { significator } from '../data'
import { decodeDeck, encodeDeck } from './deckcode'

describe('deck codes', () => {
  it('round-trips a starter list', () => {
    const s = significator('sig-shazz')
    const code = encodeDeck(s.id, s.deck)
    expect(code.startsWith('MW1 sig-shazz ')).toBe(true)
    const back = decodeDeck(code)!
    expect(back.sig).toBe('sig-shazz')
    expect([...back.cards].sort()).toEqual([...s.deck].sort())
  })
  it('refuses anything that is not a code', () => {
    expect(decodeDeck('hello')).toBeNull()
    expect(decodeDeck('MW1 sig-nobody antlers-2')).toBeNull()
    expect(decodeDeck('MW1 sig-shazz nothing-9')).toBeNull()
    expect(decodeDeck('MW1 sig-shazz antlers-2x0')).toBeNull()
  })
})
