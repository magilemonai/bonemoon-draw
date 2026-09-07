import { describe, expect, it } from 'vitest'
import { DECK_CARDS } from '../data'
import { CARD_ALIAS, displayName, shortName } from './names'

const LIMIT = 20

describe('display aliases', () => {
  const faces = DECK_CARDS.flatMap((c) => [shortName(c.upright.name ?? c.name), shortName(c.reversed.name ?? c.name)])
  it('every alias names a real face', () => {
    for (const key of Object.keys(CARD_ALIAS)) expect(faces, key).toContain(key)
  })
  it('no alias is over the limit', () => {
    for (const [key, alias] of Object.entries(CARD_ALIAS)) expect(alias.length, `${key} -> ${alias}`).toBeLessThanOrEqual(LIMIT)
  })
  it('every face over the limit has an alias', () => {
    for (const f of faces) if (f.length > LIMIT) expect(CARD_ALIAS[f], f).toBeTruthy()
  })
  it('a short name is shown as printed', () => {
    expect(displayName('Death: The Man in Black')).toBe('The Man in Black')
    expect(displayName('Elder Voren Nightbloom')).toBe('Elder Voren')
  })
})
