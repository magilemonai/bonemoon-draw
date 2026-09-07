// The player's record: every completed match, the best result against each opponent with
// each Significator, and Renown, which counts accomplishments and never falls. Stored in
// this browser only. Pure functions here; the store does the saving.

import { SIGNIFICATORS, significator } from '../data'
import { RULES_VERSION } from '../engine/rules'

export interface MatchRecord {
  id: string // unique per match, so a match is credited once
  when: number // ms since the epoch
  hero: string
  opponent: string
  seat: 'first' | 'second'
  result: 'win' | 'loss' | 'draw'
  rounds: number
  health: [number, number] // hero, opponent, at the end
  version: string // the rules the match was played under
}

// The best result in one directional matchup. Expert and the mastery objective are
// reserved for when those exist; nothing awards them yet.
export interface MatchupBest {
  standard?: number // when the first Standard win happened
  expert?: number
  objective?: number
}

export interface Profile {
  v: 1
  matches: MatchRecord[] // oldest first
  best: Record<string, MatchupBest> // `${hero}|${opponent}`
}

export const RENOWN = { standard: 10, expert: 25, objective: 5 } as const
export const MAX_MATCHES = 200

// Provisional milestones. The board tops out at 300 on Standard (30 matchups) today.
export const RANKS: { name: string; at: number }[] = [
  { name: 'Initiate', at: 0 },
  { name: 'Reader', at: 30 },
  { name: 'Adept', at: 100 },
  { name: 'Seer', at: 200 },
  { name: 'Oracle', at: 300 },
]

export function emptyProfile(): Profile {
  return { v: 1, matches: [], best: {} }
}

export const matchupKey = (hero: string, opponent: string) => `${hero}|${opponent}`

export function matchupRenown(b: MatchupBest | undefined): number {
  if (!b) return 0
  let n = b.expert ? RENOWN.expert : b.standard ? RENOWN.standard : 0
  if (b.objective) n += RENOWN.objective
  return n
}

export function renownOf(p: Profile): number {
  return Object.values(p.best).reduce((n, b) => n + matchupRenown(b), 0)
}

export function rankOf(renown: number): { name: string; next: { name: string; at: number } | null } {
  let cur = RANKS[0]
  let next: { name: string; at: number } | null = null
  for (const r of RANKS) {
    if (renown >= r.at) cur = r
    else {
      next = r
      break
    }
  }
  return { name: cur.name, next }
}

export interface Award {
  gained: number
  firstClear: boolean // the first Standard win in this matchup
  counted: boolean // false when the match was already credited
}

// Credit one completed match. Eligible: a normal match under the shipped rules. A match id
// is credited once; a matchup's Standard win is credited once.
export function recordMatch(p: Profile, rec: MatchRecord): { profile: Profile, award: Award } {
  if (p.matches.some((m) => m.id === rec.id)) return { profile: p, award: { gained: 0, firstClear: false, counted: false } }
  const matches = [...p.matches, rec].slice(-MAX_MATCHES)
  const best = { ...p.best }
  let gained = 0
  let firstClear = false
  if (rec.result === 'win' && rec.version === RULES_VERSION) {
    const k = matchupKey(rec.hero, rec.opponent)
    const cur = best[k] ?? {}
    if (!cur.standard) {
      best[k] = { ...cur, standard: rec.when }
      gained += RENOWN.standard
      firstClear = true
    }
  }
  return { profile: { v: 1, matches, best }, award: { gained, firstClear, counted: true } }
}

// The opponents a Significator has beaten on Standard.
export function cleared(p: Profile, hero: string): string[] {
  return SIGNIFICATORS.filter((s) => s.id !== hero && p.best[matchupKey(hero, s.id)]?.standard).map((s) => s.id)
}

export function heroRecord(p: Profile, hero: string): { games: number; wins: number } {
  const mine = p.matches.filter((m) => m.hero === hero)
  return { games: mine.length, wins: mine.filter((m) => m.result === 'win').length }
}

// One specific thing to do next: the most-played Significator's next unbeaten opponent,
// then any Significator with an opponent left.
export function nextGoal(p: Profile): { hero: string; opponent: string; text: string } | null {
  const byPlay = SIGNIFICATORS.map((s) => ({ id: s.id, games: heroRecord(p, s.id).games })).sort((a, b) => b.games - a.games)
  for (const h of byPlay) {
    const done = new Set(cleared(p, h.id))
    const opp = SIGNIFICATORS.find((s) => s.id !== h.id && !done.has(s.id))
    if (opp) {
      const hero = significator(h.id)
      const first = done.size === 0 && h.games === 0
      return {
        hero: h.id,
        opponent: opp.id,
        text: first ? `Beat ${opp.name} as ${hero.name} for your first ${RENOWN.standard} Renown.` : `Beat ${opp.name} as ${hero.name} for ${RENOWN.standard} Renown. ${done.size} of 5 opponents beaten so far.`,
      }
    }
  }
  return null
}

// Recent form, shown only as counts: the last 20 completed matches and the 20 before them.
export function recentForm(p: Profile): { last: { games: number; wins: number }; before: { games: number; wins: number } } {
  const tally = (ms: MatchRecord[]) => ({ games: ms.length, wins: ms.filter((m) => m.result === 'win').length })
  const last = p.matches.slice(-20)
  const before = p.matches.slice(-40, -20)
  return { last: tally(last), before: tally(before) }
}

// ---- Storage ---------------------------------------------------------------------

const KEY = 'bonemoon.profile'

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyProfile()
    const p = JSON.parse(raw) as Profile
    if (p?.v !== 1 || !Array.isArray(p.matches) || typeof p.best !== 'object') return emptyProfile()
    return p
  } catch {
    return emptyProfile()
  }
}

export function saveProfile(p: Profile): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    // storage is optional; the game plays without it
  }
}
