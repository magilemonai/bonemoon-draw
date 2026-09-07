// UI store. Holds the committed game state (truth), the display state (what is drawn
// right now), and a queue of engine steps that plays out with timing so the table
// animates one event at a time. The AI runs through the same queue.

import { create } from 'zustand'
import { beginGame, createGame, finalState, runAction } from '../engine/engine'
import { chooseAction } from '../ai/ai'
import type { Action, Face, GameEvent, GameState, LaneIndex, PlayerId, Step, TargetRef } from '../engine/types'
import { card, significator } from '../data'
import { figureName, other } from '../engine/queries'
import { RULES_VERSION } from '../engine/rules'
import { artSrc } from './art'
import { abandon, checkSaved, loadProfile, saveProfile, settleMatch, type Award, type Profile, type SavedMatch } from './profile'

export type Screen = 'title' | 'choose' | 'battle' | 'codex' | 'rules'

export interface Fx {
  id: number
  kind: 'damage' | 'heal' | 'lunge' | 'flash' | 'banner' | 'spark'
  ref?: TargetRef
  n?: number
  absorbed?: boolean
  text?: string
  sub?: string
  toRef?: TargetRef
  until: number
}

// What the human has selected on the table.
export type Selection =
  | { kind: 'none' }
  | { kind: 'hand'; uid: number; face?: Face; target?: TargetRef } // a hand card, maybe with a face (and Arrive target) chosen
  | { kind: 'figure'; lane: LaneIndex } // one of my figures
  | { kind: 'ability' } // waiting for an ability target
  | { kind: 'inspect'; defId: string; face: Face; uid?: number }

const MATCH_KEY = 'bonemoon.match' // kept from the first release

// A saved reading that cannot continue: started under other rules, or broken.
export interface StaleMatch {
  humanSig: string
  aiSig: string
  round: number
}

function loadMatch(): { saved: SavedMatch | null; stale: StaleMatch | null } {
  try {
    const raw = localStorage.getItem(MATCH_KEY)
    if (!raw) return { saved: null, stale: null }
    const m = JSON.parse(raw) as SavedMatch
    const check = checkSaved(m)
    if (check === 'ok') return { saved: m, stale: null }
    if (check === 'version') return { saved: null, stale: { humanSig: m.humanSig, aiSig: m.aiSig, round: m.committed.round } }
    return { saved: null, stale: null }
  } catch {
    return { saved: null, stale: null }
  }
}

// True when the write took.
function storeMatch(m: SavedMatch | null): boolean {
  try {
    if (m) localStorage.setItem(MATCH_KEY, JSON.stringify(m))
    else localStorage.removeItem(MATCH_KEY)
    return true
  } catch {
    return false
  }
}

const startup = loadMatch()

interface UIState {
  screen: Screen
  committed: GameState | null
  display: GameState | null
  queue: Step[]
  playing: boolean
  fx: Fx[]
  log: string[]
  selection: Selection
  human: PlayerId
  aiSig: string
  humanSig: string
  reduceMotion: boolean
  speed: number // 1 = normal, 2.2 = quick
  reviewing: boolean // the reading is over and the player is looking at the final table
  profile: Profile // the player's record, kept in this browser
  award: Award | null // what the last completed match earned
  savedMatch: SavedMatch | null // the reading in progress, as last saved
  staleMatch: StaleMatch | null // a reading that cannot continue under these rules
  storageOk: boolean // false once a save has failed in this session
  choosePreset: { mine: string; theirs: string } | null // what the choose screen should open with
  uiKit: boolean // public/art/ui/* is present (probed once)
  tableArt: boolean // public/art/table.jpg is present

  goto: (s: Screen) => void
  startGame: (humanSig: string, aiSig: string) => void
  dispatch: (a: Action) => void
  select: (sel: Selection) => void
  inspect: (defId: string, face: Face, uid?: number) => void
  closeInspect: () => void
  tick: () => void
  setSpeed: (n: number) => void
  setReviewing: (v: boolean) => void
  resumeGame: () => void
  concede: () => void
  dismissStale: () => void
  openChoose: (preset?: { mine: string; theirs: string }) => void
  replaceProfile: (p: Profile) => void
}

function storedSpeed(): number {
  try {
    const v = typeof localStorage !== 'undefined' ? localStorage.getItem('bonemoon.speed') : null
    return v ? Number(v) || 1 : 1
  } catch {
    return 1
  }
}

let fxId = 1

function durationFor(ev: GameEvent, speed: number): number {
  const base = (() => {
    switch (ev.kind) {
      case 'turnStart':
        return 900
      case 'draw':
        return 220
      case 'played':
        return 500
      case 'summon':
        return 350
      case 'attackStart':
        return 420
      case 'damage':
        return ev.absorbed ? 350 : 380
      case 'heal':
        return 300
      case 'flip':
        return 650
      case 'death':
        return 520
      case 'rekindle':
        return 600
      case 'bounce':
        return 400
      case 'move':
        return 380
      case 'omen':
        return 650
      case 'countered':
        return 700
      case 'boneMoon':
        return 1400
      case 'boneMoonBite':
        return 300
      case 'gameOver':
        return 600
      case 'ability':
        return 350
      case 'read':
        return 200
      case 'reveal':
        return 500
      case 'hush':
        return 400
      case 'buff':
        return 180
      case 'spark':
        return 250
      case 'fatigue':
        return 400
      case 'burn':
        return 350
      case 'log':
        return ev.text ? 120 : 0
    }
  })()
  return base / speed
}

function describe(ev: GameEvent, st: GameState): string | null {
  const nameOf = (p: PlayerId) => significator(st.players[p].sigId).name
  const figName = (ref: TargetRef) => {
    if (ref.kind === 'sig') return nameOf(ref.player)
    const f = ref.lane !== undefined ? st.players[ref.player].lanes[ref.lane] : null
    return f ? figureName(f) : 'a Figure'
  }
  switch (ev.kind) {
    case 'turnStart':
      return `Round ${ev.round}: ${nameOf(ev.player)} reads.`
    case 'played':
      return `${nameOf(ev.player)} plays ${card(ev.defId).name} (${ev.face}).`
    case 'summon':
      return card(ev.defId).token ? `${card(ev.defId).name} appears.` : null
    case 'attackStart':
      return `${figName(ev.attacker)} attacks ${figName(ev.defender)}.`
    case 'damage':
      return ev.absorbed ? `${figName(ev.target)} shrugs it off.` : `${figName(ev.target)} takes ${ev.n}.`
    case 'heal':
      return ev.n > 0 ? `${figName(ev.target)} recovers ${ev.n}.` : null
    case 'flip':
      return `${figName(ev.target)} turns ${ev.face}.`
    case 'death':
      return `${card(ev.defId).name} falls.`
    case 'rekindle':
      return `${figName(ev.target)} rekindles.`
    case 'bounce':
      return `${card(ev.defId).name} returns to hand.`
    case 'move':
      return `${figName({ ...ev.from, lane: ev.to })} moves.`
    case 'omen':
      return null
    case 'countered':
      return `${card(ev.defId).name} is countered. "Worth it."`
    case 'boneMoon':
      return 'The Bone Moon rises.'
    case 'boneMoonBite':
      return `The Bone Moon takes ${ev.n} from ${nameOf(ev.player)}.`
    case 'gameOver':
      return ev.winner === 'draw' ? 'Both readings end together.' : `${nameOf(ev.winner)} wins the reading.`
    case 'ability':
      return `${nameOf(ev.player)} uses ${significator(st.players[ev.player].sigId).abilityName}.`
    case 'read':
      return `${nameOf(ev.player)} reads ${ev.n} cards.`
    case 'reveal':
      return `${nameOf(ev.player)}'s hand is revealed.`
    case 'hush':
      return `${figName(ev.target)} is hushed.`
    case 'fatigue':
      return `${nameOf(ev.player)}'s deck is empty: ${ev.n} damage.`
    case 'burn':
      return `${card(ev.defId).name} burns: ${nameOf(ev.player)}'s hand is full.`
    case 'log':
      return ev.text || null
    default:
      return null
  }
}

function fxFor(ev: GameEvent, st: GameState, now: number, speed: number): Fx[] {
  const d = (ms: number) => now + ms / speed
  switch (ev.kind) {
    case 'damage':
      return [{ id: fxId++, kind: 'damage', ref: ev.target, n: ev.n, absorbed: ev.absorbed, until: d(900) }]
    case 'heal':
      return ev.n > 0 ? [{ id: fxId++, kind: 'heal', ref: ev.target, n: ev.n, until: d(900) }] : []
    case 'attackStart':
      return [{ id: fxId++, kind: 'lunge', ref: ev.attacker, toRef: ev.defender, until: d(420) }]
    case 'turnStart': {
      const name = significator(st.players[ev.player].sigId).name
      const mine = ev.player === st.humanPlayer
      return [{ id: fxId++, kind: 'banner', text: mine ? 'Your reading' : `${name} reads`, sub: `Round ${ev.round}`, until: d(1100) }]
    }
    case 'boneMoon':
      return [{ id: fxId++, kind: 'banner', text: 'The Bone Moon rises', sub: 'Only the chilling white of bone.', until: d(1800) }]
    case 'omen':
      return [{ id: fxId++, kind: 'flash', text: card(ev.defId).name, sub: ev.face, until: d(900) }]
    case 'countered':
      return [{ id: fxId++, kind: 'flash', text: 'Countered', sub: '"Worth it."', until: d(900) }]
    case 'gameOver': {
      const win = ev.winner === st.humanPlayer
      return [{ id: fxId++, kind: 'banner', text: ev.winner === 'draw' ? 'A draw' : win ? 'You win the reading' : 'The reading goes against you', until: d(2500) }]
    }
    case 'spark':
      return [{ id: fxId++, kind: 'spark', ref: { kind: 'sig', player: ev.player }, n: ev.n, until: d(800) }]
    default:
      return []
  }
}

export const useStore = create<UIState>((set, get) => ({
  screen: 'title',
  committed: null,
  display: null,
  queue: [],
  playing: false,
  fx: [],
  log: [],
  selection: { kind: 'none' },
  human: 0,
  aiSig: 'sig-shazz',
  humanSig: 'sig-daxon',
  reduceMotion: typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  speed: storedSpeed(),
  reviewing: false,
  profile: loadProfile(),
  award: null,
  savedMatch: startup.saved,
  staleMatch: startup.stale,
  storageOk: true,
  choosePreset: null,
  uiKit: false,
  tableArt: false,

  goto: (screen) => set({ screen, selection: { kind: 'none' }, reviewing: false, choosePreset: null }),
  openChoose: (preset) => set({ screen: 'choose', selection: { kind: 'none' }, reviewing: false, choosePreset: preset ?? null }),
  dismissStale: () => {
    storeMatch(null)
    set({ staleMatch: null })
  },
  replaceProfile: (profile) => {
    const ok = saveProfile(profile)
    set({ profile, storageOk: ok })
  },
  setSpeed: (speed) => {
    try {
      localStorage.setItem('bonemoon.speed', String(speed))
    } catch {
      // storage is optional
    }
    set({ speed })
  },
  setReviewing: (reviewing) => set({ reviewing, selection: { kind: 'none' } }),

  startGame: (humanSig, aiSig) => {
    const seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) | 0
    const g = createGame({ sigs: [humanSig, aiSig], seed, humanPlayer: 0 })
    const steps = beginGame(g, true)
    const committed = finalState(steps, g)
    const matchId = `${Date.now().toString(36)}-${(seed >>> 0).toString(36)}`
    const seat: 'first' | 'second' = g.active === 0 ? 'first' : 'second'
    const saved: SavedMatch = { id: matchId, humanSig, aiSig, seat, version: RULES_VERSION, committed, log: [] }
    // A reading left unfinished and replaced is counted as abandoned, and disclosed.
    let profile = get().profile
    let storageOk = get().storageOk
    if (get().savedMatch) {
      profile = abandon(profile)
      storageOk = saveProfile(profile) && storageOk
    }
    storageOk = storeMatch(saved) && storageOk
    set({
      committed,
      display: g,
      queue: steps,
      playing: false,
      fx: [],
      log: [],
      selection: { kind: 'none' },
      reviewing: false,
      award: null,
      profile,
      storageOk,
      savedMatch: saved,
      staleMatch: null,
      choosePreset: null,
      humanSig,
      aiSig,
      screen: 'battle',
    })
    get().tick()
  },

  // Give the reading up. It is a loss on the record; Renown never falls.
  concede: () => {
    const { committed, savedMatch, profile } = get()
    if (!committed || committed.phase === 'over') return
    const me = committed.humanPlayer
    const over: GameState = { ...committed, phase: 'over', winner: other(me), pending: null }
    let next = { profile, award: null as Award | null, storageOk: get().storageOk }
    if (savedMatch) {
      const r = settleMatch(profile, savedMatch, over, Date.now(), true)
      next = { profile: r.profile, award: r.award, storageOk: saveProfile(r.profile) && next.storageOk }
    }
    storeMatch(null)
    set({ committed: over, display: over, queue: [], playing: false, fx: [], selection: { kind: 'none' }, reviewing: false, savedMatch: null, ...next })
  },

  // Pick an unfinished reading back up where it was left, with no replay of what happened.
  resumeGame: () => {
    const m = get().savedMatch
    if (!m || checkSaved(m) !== 'ok') return
    set({
      committed: m.committed,
      display: m.committed,
      queue: [],
      playing: false,
      fx: [],
      log: m.log,
      selection: { kind: 'none' },
      reviewing: false,
      award: null,
      humanSig: m.humanSig,
      aiSig: m.aiSig,
      screen: 'battle',
    })
    get().tick()
  },

  dispatch: (a) => {
    const { committed, queue, savedMatch, profile, log } = get()
    if (!committed || committed.phase === 'over') return
    const steps = runAction(committed, a, true)
    const next = finalState(steps, committed)
    set({ committed: next, queue: [...queue, ...steps], selection: { kind: 'none' } })
    if (next.phase === 'over') {
      // A completed match goes on the record once, under the rules it was started with,
      // and the unfinished-match slot clears.
      if (savedMatch) {
        const r = settleMatch(profile, savedMatch, next, Date.now())
        const ok = saveProfile(r.profile)
        set({ profile: r.profile, award: r.award, storageOk: get().storageOk && ok })
      }
      storeMatch(null)
      set({ savedMatch: null })
    } else if (savedMatch) {
      const saved: SavedMatch = { ...savedMatch, committed: next, log: log.slice(-40) }
      const ok = storeMatch(saved)
      set({ savedMatch: saved, storageOk: get().storageOk && ok })
    }
    get().tick()
  },

  select: (selection) => set({ selection }),
  inspect: (defId, face, uid) => set({ selection: { kind: 'inspect', defId, face, uid } }),
  closeInspect: () => set({ selection: { kind: 'none' } }),

  // The animation pump. Plays one step, schedules the next, and wakes the AI when it's their turn.
  tick: () => {
    const st = get()
    if (st.playing) return
    const [step, ...rest] = st.queue
    if (!step) {
      // Queue drained. Is it the AI's turn?
      const c = st.committed
      if (c && c.phase !== 'over' && c.active !== c.humanPlayer && st.screen === 'battle') {
        const a = chooseAction(c, { seed: c.seed })
        // Small human-like pause before the opponent acts.
        set({ playing: true })
        setTimeout(() => {
          set({ playing: false })
          if (get().screen === 'battle') get().dispatch(a)
        }, 550 / st.speed)
      }
      return
    }
    const now = performance.now()
    const speed = st.reduceMotion ? 3 : st.speed
    const newFx = fxFor(step.ev, step.state, now, speed)
    const text = describe(step.ev, step.state)
    set({
      display: step.state,
      queue: rest,
      playing: true,
      fx: [...st.fx.filter((f) => f.until > now), ...newFx],
      log: text ? [...st.log.slice(-79), text] : st.log,
    })
    const wait = durationFor(step.ev, speed)
    setTimeout(() => {
      set({ playing: false })
      get().tick()
    }, wait)
  },
}))

// Probe once for optional art: the UI kit overlays and the table cloth.
if (typeof window !== 'undefined') {
  const probe = (id: string, key: 'uiKit' | 'tableArt') => {
    const src = artSrc(id)
    if (!src) return
    const img = new Image()
    img.onload = () => useStore.setState({ [key]: true } as Partial<UIState>)
    img.src = src
  }
  probe('ui/frame-suns', 'uiKit')
  probe('ui/frame-major', 'uiKit')
  probe('table', 'tableArt')
}

// Expire fx on a timer so damage numbers fade.
if (typeof window !== 'undefined') {
  setInterval(() => {
    const st = useStore.getState()
    if (!st.fx.length) return
    const now = performance.now()
    const live = st.fx.filter((f) => f.until > now)
    if (live.length !== st.fx.length) useStore.setState({ fx: live })
  }, 120)
}
