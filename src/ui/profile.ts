// The player's record: lifetime totals per Significator, the last two hundred matches in
// detail, the best result against each opponent with each Significator, and Renown, which
// counts accomplishments and never falls. Stored in this browser only. Pure functions
// here; the store does the saving.

import { SIGNIFICATORS, significator } from '../data'
import { RULES_VERSION } from '../engine/rules'
import type { GameState } from '../engine/types'
import type { DeckStamp } from './decks'

export interface MatchRecord {
  id: string // unique per match, so a match is credited once
  when: number // ms since the epoch
  hero: string
  opponent: string
  seat: 'first' | 'second'
  result: 'win' | 'loss' | 'draw'
  rounds: number
  health: [number, number] // hero, opponent, at the end
  version: string // the rules the match was started under
  conceded?: boolean
  deck?: DeckStamp // the list it was played with; absent on records from before decks
}

// The best result in one directional matchup. Expert and the mastery objective are
// reserved for when those exist; nothing awards them yet.
export interface MatchupBest {
  standard?: number // when the first Standard win happened
  expert?: number
  objective?: number
}

export interface HeroTotals {
  games: number
  wins: number
  losses: number
  draws: number
  conceded: number
}

export interface Profile {
  v: 2
  matches: MatchRecord[] // the most recent MAX_MATCHES, oldest first
  best: Record<string, MatchupBest> // `${hero}|${opponent}`
  totals: Record<string, HeroTotals> // lifetime, per Significator, never trimmed
  ids: string[] // credited match ids, so an evicted match cannot be credited again
  abandoned: number // readings replaced before they finished
}

// An unfinished reading, kept so leaving the page does not throw it away.
export interface SavedMatch {
  id: string
  humanSig: string
  aiSig: string
  seat: 'first' | 'second'
  version: string // the rules it was started under
  deck?: DeckStamp & { cards: string[] } // the exact list dealt, kept with the reading
  committed: GameState
  log: string[]
}

export const RENOWN = { standard: 10, expert: 25, objective: 5 } as const
export const MAX_MATCHES = 200
export const MAX_IDS = 1000

// Provisional milestones. The board tops out at 300 on Standard (30 matchups) today.
export const RANKS: { name: string; at: number }[] = [
  { name: 'Initiate', at: 0 },
  { name: 'Reader', at: 30 },
  { name: 'Adept', at: 100 },
  { name: 'Seer', at: 200 },
  { name: 'Oracle', at: 300 },
]

export function emptyProfile(): Profile {
  return { v: 2, matches: [], best: {}, totals: {}, ids: [], abandoned: 0 }
}

export const matchupKey = (hero: string, opponent: string) => `${hero}|${opponent}`

const emptyTotals = (): HeroTotals => ({ games: 0, wins: 0, losses: 0, draws: 0, conceded: 0 })

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
  eligible: boolean // false when the match was started under other rules
  conceded: boolean
}

// Credit one completed match. A match id is credited once, even after its detail has
// left the list; a matchup's Standard win is credited once; Renown needs the current rules.
export function recordMatch(p: Profile, rec: MatchRecord): { profile: Profile; award: Award } {
  const none: Award = { gained: 0, firstClear: false, counted: false, eligible: rec.version === RULES_VERSION, conceded: !!rec.conceded }
  if (p.ids.includes(rec.id)) return { profile: p, award: none }
  const matches = [...p.matches, rec].slice(-MAX_MATCHES)
  const ids = [...p.ids, rec.id].slice(-MAX_IDS)
  const totals = { ...p.totals }
  const t = { ...(totals[rec.hero] ?? emptyTotals()) }
  t.games += 1
  if (rec.result === 'win') t.wins += 1
  else if (rec.result === 'loss') t.losses += 1
  else t.draws += 1
  if (rec.conceded) t.conceded += 1
  totals[rec.hero] = t
  const best = { ...p.best }
  let gained = 0
  let firstClear = false
  if (rec.result === 'win' && none.eligible) {
    const k = matchupKey(rec.hero, rec.opponent)
    const cur = best[k] ?? {}
    if (!cur.standard) {
      best[k] = { ...cur, standard: rec.when }
      gained += RENOWN.standard
      firstClear = true
    }
  }
  return { profile: { ...p, v: 2, matches, ids, totals, best }, award: { ...none, gained, firstClear, counted: true } }
}

// A saved reading replaced before it finished. Not a loss; counted, and disclosed.
export function abandon(p: Profile): Profile {
  return { ...p, abandoned: p.abandoned + 1 }
}

// Finish a reading: the record is built from what the match was started as (its rules
// version included), and from the final table.
export function settleMatch(p: Profile, saved: SavedMatch, final: GameState, now: number, conceded = false): { profile: Profile; award: Award; record: MatchRecord } {
  const me = final.humanPlayer
  const them = me === 0 ? 1 : 0
  const record: MatchRecord = {
    id: saved.id,
    when: now,
    hero: saved.humanSig,
    opponent: saved.aiSig,
    seat: saved.seat,
    result: conceded ? 'loss' : final.winner === 'draw' ? 'draw' : final.winner === me ? 'win' : 'loss',
    rounds: final.round,
    health: [final.players[me].health, final.players[them].health],
    version: saved.version,
    ...(conceded ? { conceded: true } : {}),
    ...(saved.deck ? { deck: { id: saved.deck.id, name: saved.deck.name, rev: saved.deck.rev, starter: saved.deck.starter } } : {}),
  }
  const r = recordMatch(p, record)
  return { ...r, record }
}

// Can this saved reading continue under the current rules?
export function checkSaved(saved: unknown, version = RULES_VERSION): 'ok' | 'version' | 'invalid' {
  const m = saved as Partial<SavedMatch> | null
  if (!m || typeof m !== 'object' || !m.committed || m.committed.phase !== 'main' || !m.humanSig || !m.aiSig || !m.id) return 'invalid'
  if (m.version !== version) return 'version'
  return 'ok'
}

// The opponents a Significator has beaten on Standard.
export function cleared(p: Profile, hero: string): string[] {
  return SIGNIFICATORS.filter((s) => s.id !== hero && p.best[matchupKey(hero, s.id)]?.standard).map((s) => s.id)
}

export function heroRecord(p: Profile, hero: string): HeroTotals {
  return p.totals[hero] ?? emptyTotals()
}

export function completed(p: Profile): { games: number; wins: number } {
  let games = 0
  let wins = 0
  for (const t of Object.values(p.totals)) {
    games += t.games
    wins += t.wins
  }
  return { games, wins }
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

// Like against like: one Significator under one rules version, the last ten readings
// against the ten before, and only once there are twenty to compare.
export function formFor(p: Profile, hero: string, version = RULES_VERSION): { last: { games: number; wins: number }; before: { games: number; wins: number } } | null {
  const mine = p.matches.filter((m) => m.hero === hero && m.version === version)
  if (mine.length < 20) return null
  const tally = (ms: MatchRecord[]) => ({ games: ms.length, wins: ms.filter((m) => m.result === 'win').length })
  return { last: tally(mine.slice(-10)), before: tally(mine.slice(-20, -10)) }
}

// Readings with one list, from the detail kept (the last 200). Sample size is the point.
export function deckRecord(p: Profile, deckId: string): { games: number; wins: number; latestRev: number } {
  const mine = p.matches.filter((m) => m.deck?.id === deckId)
  return { games: mine.length, wins: mine.filter((m) => m.result === 'win').length, latestRev: mine.reduce((r, m) => Math.max(r, m.deck?.rev ?? 0), 0) }
}

// The Significator with the most readings on the record, if any.
export function favourite(p: Profile): string | null {
  let best: string | null = null
  let n = 0
  for (const [id, t] of Object.entries(p.totals)) {
    if (t.games > n) {
      n = t.games
      best = id
    }
  }
  return best
}

// ---- Export, import, migration ------------------------------------------------------

const isRecord = (m: unknown): m is MatchRecord => {
  const r = m as Partial<MatchRecord>
  return !!r && typeof r.id === 'string' && typeof r.hero === 'string' && typeof r.opponent === 'string' && (r.result === 'win' || r.result === 'loss' || r.result === 'draw') && typeof r.version === 'string'
}

// Accept a stored or pasted profile, migrating an older shape. Null if it is not a profile.
export function parseProfile(raw: unknown): Profile | null {
  const p = raw as { v?: number; matches?: unknown; best?: unknown; totals?: unknown; ids?: unknown; abandoned?: unknown } | null
  if (!p || typeof p !== 'object' || !Array.isArray(p.matches) || !p.best || typeof p.best !== 'object') return null
  const matches = (p.matches as unknown[]).filter(isRecord)
  const best = p.best as Record<string, MatchupBest>
  if (p.v === 2 && p.totals && typeof p.totals === 'object' && Array.isArray(p.ids)) {
    return { v: 2, matches: matches.slice(-MAX_MATCHES), best, totals: p.totals as Record<string, HeroTotals>, ids: (p.ids as unknown[]).filter((x): x is string => typeof x === 'string').slice(-MAX_IDS), abandoned: typeof p.abandoned === 'number' ? p.abandoned : 0 }
  }
  if (p.v === 1) {
    // The first shape kept only the list. Its totals start from what the list still holds.
    const totals: Record<string, HeroTotals> = {}
    for (const m of matches) {
      const t = totals[m.hero] ?? (totals[m.hero] = emptyTotals())
      t.games += 1
      if (m.result === 'win') t.wins += 1
      else if (m.result === 'loss') t.losses += 1
      else t.draws += 1
    }
    return { v: 2, matches: matches.slice(-MAX_MATCHES), best, totals, ids: matches.map((m) => m.id).slice(-MAX_IDS), abandoned: 0 }
  }
  return null
}

export function exportProfile(p: Profile): string {
  return JSON.stringify(p)
}

// ---- Storage ---------------------------------------------------------------------

const KEY = 'bonemoon.profile' // kept from the first release so records carry over

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyProfile()
    return parseProfile(JSON.parse(raw)) ?? emptyProfile()
  } catch {
    return emptyProfile()
  }
}

// True when the write took. The game plays on either way.
export function saveProfile(p: Profile): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
    return true
  } catch {
    return false
  }
}
