// UI store. Holds the committed game state (truth), the display state (what is drawn
// right now), and a queue of engine steps that plays out with timing so the table
// animates one event at a time. The AI runs through the same queue.

import { create } from 'zustand'
import { beginGame, createGame, finalState, runAction } from '../engine/engine'
import { chooseAction } from '../ai/ai'
import type { Action, Face, GameEvent, GameState, LaneIndex, PlayerId, Step, TargetRef } from '../engine/types'
import { card, significator } from '../data'
import { figureName } from '../engine/queries'
import { artSrc } from './art'

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
  speed: number // 1 = normal
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
  speed: 1,
  uiKit: false,
  tableArt: false,

  goto: (screen) => set({ screen, selection: { kind: 'none' } }),
  setSpeed: (speed) => set({ speed }),

  startGame: (humanSig, aiSig) => {
    const seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) | 0
    const g = createGame({ sigs: [humanSig, aiSig], seed, humanPlayer: 0 })
    const steps = beginGame(g, true)
    set({
      committed: finalState(steps, g),
      display: g,
      queue: steps,
      playing: false,
      fx: [],
      log: [],
      selection: { kind: 'none' },
      humanSig,
      aiSig,
      screen: 'battle',
    })
    get().tick()
  },

  dispatch: (a) => {
    const { committed, queue } = get()
    if (!committed || committed.phase === 'over') return
    const steps = runAction(committed, a, true)
    set({ committed: finalState(steps, committed), queue: [...queue, ...steps], selection: { kind: 'none' } })
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
