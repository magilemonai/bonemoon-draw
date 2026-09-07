import { describe, expect, it } from 'vitest'
import { beginGame, createGame, finalState } from '../engine/engine'
import { RULES_VERSION } from '../engine/rules'
import { abandon, checkSaved, cleared, completed, emptyProfile, formFor, heroRecord, nextGoal, parseProfile, rankOf, recordMatch, renownOf, settleMatch, type MatchRecord, type SavedMatch } from './profile'

function rec(over: Partial<MatchRecord>): MatchRecord {
  return { id: over.id ?? `m-${Math.random()}`, when: 1, hero: 'sig-shazz', opponent: 'sig-rorik', seat: 'first', result: 'win', rounds: 8, health: [12, 0], version: RULES_VERSION, ...over }
}

describe('profile', () => {
  it('credits a first Standard win once per matchup and once per match', () => {
    let p = emptyProfile()
    let r = recordMatch(p, rec({ id: 'a' }))
    p = r.profile
    expect(r.award).toMatchObject({ gained: 10, firstClear: true, counted: true, eligible: true })
    expect(renownOf(p)).toBe(10)
    r = recordMatch(p, rec({ id: 'a' }))
    expect(r.award.counted).toBe(false)
    expect(r.profile).toBe(p)
    r = recordMatch(p, rec({ id: 'b' }))
    p = r.profile
    expect(r.award).toMatchObject({ gained: 0, firstClear: false, counted: true })
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

  it('records a win played under other rules without Renown, and says why', () => {
    const r = recordMatch(emptyProfile(), rec({ id: 'a', version: 'older' }))
    expect(r.award).toMatchObject({ gained: 0, counted: true, eligible: false })
    expect(r.profile.matches.length).toBe(1)
    expect(heroRecord(r.profile, 'sig-shazz').wins).toBe(1)
  })

  it('keeps lifetime totals past the two hundred kept in detail, and never credits an evicted match again', () => {
    let p = recordMatch(emptyProfile(), rec({ id: 'shazz-1' })).profile
    for (let i = 0; i < 200; i++) p = recordMatch(p, rec({ id: `daxon-${i}`, hero: 'sig-daxon', opponent: 'sig-rorik', result: i % 2 ? 'win' : 'loss' })).profile
    expect(p.matches.length).toBe(200)
    expect(p.matches.some((m) => m.id === 'shazz-1')).toBe(false)
    expect(heroRecord(p, 'sig-shazz')).toMatchObject({ games: 1, wins: 1 })
    expect(heroRecord(p, 'sig-daxon').games).toBe(200)
    expect(completed(p)).toEqual({ games: 201, wins: 101 })
    const again = recordMatch(p, rec({ id: 'shazz-1' }))
    expect(again.award.counted).toBe(false)
    expect(renownOf(again.profile)).toBe(20)
  })

  it('settles a reading with the rules it was started under, not the rules of the day', () => {
    const g = createGame({ sigs: ['sig-daxon', 'sig-rorik'], seed: 3, humanPlayer: 0, firstPlayer: 0 })
    const s = finalState(beginGame(g, false), g)
    const over = { ...s, phase: 'over' as const, winner: 0 as const }
    const saved: SavedMatch = { id: 'm1', humanSig: 'sig-daxon', aiSig: 'sig-rorik', seat: 'first', version: 'older-rules', committed: s, log: [] }
    const r = settleMatch(emptyProfile(), saved, over, 5)
    expect(r.record.version).toBe('older-rules')
    expect(r.record.result).toBe('win')
    expect(r.award).toMatchObject({ gained: 0, eligible: false, counted: true })
    const current = settleMatch(emptyProfile(), { ...saved, version: RULES_VERSION }, over, 5)
    expect(current.award.gained).toBe(10)
    const conceded = settleMatch(emptyProfile(), { ...saved, version: RULES_VERSION }, s, 5, true)
    expect(conceded.record).toMatchObject({ result: 'loss', conceded: true })
    expect(conceded.award.conceded).toBe(true)
    expect(heroRecord(conceded.profile, 'sig-daxon').conceded).toBe(1)
  })

  it('refuses to continue a reading from other rules, or a broken one', () => {
    const g = createGame({ sigs: ['sig-daxon', 'sig-rorik'], seed: 3, humanPlayer: 0 })
    const saved: SavedMatch = { id: 'm1', humanSig: 'sig-daxon', aiSig: 'sig-rorik', seat: 'first', version: RULES_VERSION, committed: g, log: [] }
    expect(checkSaved(saved)).toBe('ok')
    expect(checkSaved({ ...saved, version: 'older' })).toBe('version')
    expect(checkSaved({ ...saved, version: undefined })).toBe('version')
    expect(checkSaved({ ...saved, committed: { ...g, phase: 'over' } })).toBe('invalid')
    expect(checkSaved(null)).toBe('invalid')
  })

  it('counts an abandoned reading apart from the completed ones', () => {
    const p = abandon(recordMatch(emptyProfile(), rec({ id: 'a' })).profile)
    expect(p.abandoned).toBe(1)
    expect(completed(p)).toEqual({ games: 1, wins: 1 })
  })

  it('ranks and points at the next goal from lifetime play', () => {
    expect(rankOf(0)).toEqual({ name: 'Initiate', next: { name: 'Reader', at: 30 } })
    expect(rankOf(300)).toEqual({ name: 'Oracle', next: null })
    let p = emptyProfile()
    expect(nextGoal(p)?.text).toMatch(/first 10 Renown/)
    p = recordMatch(p, rec({ id: 'a' })).profile
    const g = nextGoal(p)!
    expect(g.hero).toBe('sig-shazz')
    expect(g.opponent).not.toBe('sig-rorik')
  })

  it('compares form only like against like', () => {
    let p = emptyProfile()
    for (let i = 0; i < 20; i++) p = recordMatch(p, rec({ id: `old-${i}`, result: 'loss', version: 'older', seat: 'second' })).profile
    for (let i = 0; i < 20; i++) p = recordMatch(p, rec({ id: `new-${i}`, hero: 'sig-daxon', result: 'win' })).profile
    expect(formFor(p, 'sig-shazz')).toBeNull() // twenty readings, none under the current rules
    expect(formFor(p, 'sig-daxon')).toEqual({ last: { games: 10, wins: 10 }, before: { games: 10, wins: 10 } })
    expect(formFor(p, 'sig-shazz', 'older')).toEqual({ last: { games: 10, wins: 0 }, before: { games: 10, wins: 0 } })
  })

  it('migrates the first shape and rejects what is not a record', () => {
    const v1 = { v: 1, matches: [rec({ id: 'a' }), rec({ id: 'b', result: 'loss', hero: 'sig-daxon' }), { nonsense: true }], best: { 'sig-shazz|sig-rorik': { standard: 1 } } }
    const p = parseProfile(v1)!
    expect(p.v).toBe(2)
    expect(p.matches.length).toBe(2)
    expect(p.ids).toEqual(['a', 'b'])
    expect(heroRecord(p, 'sig-shazz')).toMatchObject({ games: 1, wins: 1 })
    expect(heroRecord(p, 'sig-daxon')).toMatchObject({ games: 1, losses: 1 })
    expect(renownOf(p)).toBe(10)
    expect(parseProfile({ hello: 'there' })).toBeNull()
    expect(parseProfile('text')).toBeNull()
    expect(parseProfile(p)).toEqual(p)
  })
})
