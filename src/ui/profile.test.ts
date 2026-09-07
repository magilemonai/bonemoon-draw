import { describe, expect, it } from 'vitest'
import { RULES_VERSION } from '../engine/rules'
import { cleared, emptyProfile, heroRecord, nextGoal, rankOf, recentForm, recordMatch, renownOf, type MatchRecord } from './profile'

function rec(over: Partial<MatchRecord>): MatchRecord {
  return { id: over.id ?? `m-${Math.random()}`, when: 1, hero: 'sig-shazz', opponent: 'sig-rorik', seat: 'first', result: 'win', rounds: 8, health: [12, 0], version: RULES_VERSION, ...over }
}

describe('profile', () => {
  it('credits a first Standard win once per matchup and once per match', () => {
    let p = emptyProfile()
    let r = recordMatch(p, rec({ id: 'a' }))
    p = r.profile
    expect(r.award).toEqual({ gained: 10, firstClear: true, counted: true })
    expect(renownOf(p)).toBe(10)
    // The same match again: nothing.
    r = recordMatch(p, rec({ id: 'a' }))
    expect(r.award.counted).toBe(false)
    expect(r.profile).toBe(p)
    // Another win in the same matchup: recorded, no Renown.
    r = recordMatch(p, rec({ id: 'b' }))
    p = r.profile
    expect(r.award).toEqual({ gained: 0, firstClear: false, counted: true })
    expect(p.matches.length).toBe(2)
    expect(renownOf(p)).toBe(10)
  })

  it('never falls on a loss, and a different opponent is a different matchup', () => {
    let p = recordMatch(emptyProfile(), rec({ id: 'a' })).profile
    p = recordMatch(p, rec({ id: 'b', result: 'loss' })).profile
    expect(renownOf(p)).toBe(10)
    const r = recordMatch(p, rec({ id: 'c', opponent: 'sig-daxon' }))
    expect(r.award.gained).toBe(10)
    expect(renownOf(r.profile)).toBe(20)
    expect(cleared(r.profile, 'sig-shazz')).toEqual(['sig-daxon', 'sig-rorik'])
  })

  it('does not credit a win played under other rules', () => {
    const r = recordMatch(emptyProfile(), rec({ id: 'a', version: 'older' }))
    expect(r.award.gained).toBe(0)
    expect(r.profile.matches.length).toBe(1)
  })

  it('ranks and points at the next goal', () => {
    expect(rankOf(0)).toEqual({ name: 'Initiate', next: { name: 'Reader', at: 30 } })
    expect(rankOf(30).name).toBe('Reader')
    expect(rankOf(300)).toEqual({ name: 'Oracle', next: null })
    let p = emptyProfile()
    expect(nextGoal(p)?.text).toMatch(/first 10 Renown/)
    p = recordMatch(p, rec({ id: 'a' })).profile
    const g = nextGoal(p)!
    expect(g.hero).toBe('sig-shazz')
    expect(g.opponent).not.toBe('sig-rorik')
    expect(heroRecord(p, 'sig-shazz')).toEqual({ games: 1, wins: 1 })
  })

  it('reports recent form as counts', () => {
    let p = emptyProfile()
    for (let i = 0; i < 30; i++) p = recordMatch(p, rec({ id: `m${i}`, result: i % 3 === 0 ? 'loss' : 'win' })).profile
    const f = recentForm(p)
    expect(f.last.games).toBe(20)
    expect(f.before.games).toBe(10)
    expect(f.last.wins + f.before.wins).toBe(20)
  })
})
