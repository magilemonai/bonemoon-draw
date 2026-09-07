// Three lessons on fixed positions. Each step says one thing to do, lights up what to
// tap, and checks the table afterwards. The last step of every lesson is an exercise
// with no lights. A lesson plays against a sleeping opponent who only ends turns, and
// nothing from a lesson goes on the record.

import { card } from '../data'
import { beginGame, createGame, finalState } from '../engine/engine'
import { availableSpark, cardCost, emptyLanes } from '../engine/queries'
import type { Action, Face, FigureInstance, GameState, LaneIndex, PlayerId } from '../engine/types'

export type LessonHint =
  | { kind: 'hand'; defId: string }
  | { kind: 'face'; face: Face }
  | { kind: 'slot'; player: PlayerId; lane: LaneIndex }
  | { kind: 'sig'; player: PlayerId }
  | { kind: 'ability' }
  | { kind: 'endTurn' }
  | { kind: 'inspect'; player: PlayerId; lane: LaneIndex }

// What was inspected, for steps that wait on a look rather than a move.
export type InspectTarget = { player: PlayerId; lane: LaneIndex } | 'read' | 'hand'

export interface LessonStep {
  id: string
  say: string // the instruction, in full
  hints?: LessonHint[] | ((s: GameState) => LessonHint[]) // what lights up, read from the table as it is
  allow?: (a: Action, s: GameState) => boolean // which actions the step accepts; anything, when absent
  nudge?: string // said when something else is tried
  done?: (after: GameState, a: Action | null, before: GameState) => boolean
  doneOnInspect?: InspectTarget | 'any'
  free?: boolean // the closing exercise: no lights, no gate
  within?: 'turn' // the step must be finished before the player ends the turn
  missedSay?: string // said when that deadline passes
  stuck?: (s: GameState) => boolean // the position can no longer satisfy the step
  stuckSay?: string
}

export interface Lesson {
  id: string
  title: string
  blurb: string
  sigs: [string, string]
  setup: () => GameState
  steps: LessonStep[]
}

export interface LessonProgress {
  step: number
  complete: boolean
  missed?: boolean // a turn deadline passed; only Retry moves on
}

// ---- Building a position -------------------------------------------------------

function base(sigs: [string, string], seed: number): GameState {
  const g = createGame({ sigs, seed, humanPlayer: 0, firstPlayer: 0 })
  const s = finalState(beginGame(g, false), g)
  s.players[1].hand = []
  return s
}

function figure(s: GameState, p: PlayerId, lane: LaneIndex, defId: string, face: Face, damage = 0): FigureInstance {
  return {
    uid: s.nextUid++,
    defId,
    owner: p,
    lane,
    face,
    damage,
    permAtk: 0,
    permHp: 0,
    tempAtk: 0,
    tempHp: 0,
    grantedKw: [],
    removedKw: [],
    hushed: false,
    aegis: false,
    rekindled: false,
    asleep: false,
    summonedTurn: -1,
    attacksThisTurn: 0,
    movedThisTurn: false,
    onceUsed: [],
    relics: [],
  }
}

function setHand(s: GameState, p: PlayerId, ids: string[]) {
  s.players[p].hand = ids.map((defId) => ({ uid: s.nextUid++, defId }))
}

function setDeckTop(s: GameState, p: PlayerId, ids: string[]) {
  const rest = s.players[p].deck.filter((c) => !ids.includes(c.defId))
  s.players[p].deck = [...ids.map((defId) => ({ uid: s.nextUid++, defId })), ...rest]
}

function setSpark(s: GameState, p: PlayerId, n: number) {
  s.players[p].spark = n
  s.players[p].maxSpark = n
  s.players[p].tempSpark = 0
}

const has = (s: GameState, p: PlayerId, defId: string, face?: Face) => s.players[p].lanes.some((f) => f && f.defId === defId && (!face || f.face === face))
const laneOf = (s: GameState, p: PlayerId, defId: string): LaneIndex | null => {
  const i = s.players[p].lanes.findIndex((f) => f?.defId === defId)
  return i >= 0 ? (i as LaneIndex) : null
}
// The cheapest cards the player could play right now, as hand lights.
const playable = (s: GameState, p: PlayerId): LessonHint[] => {
  const spark = availableSpark(s.players[p])
  const lanes = emptyLanes(s, p).length
  const seen = new Set<string>()
  return s.players[p].hand
    .filter((h) => cardCost(s, p, h.defId) <= spark && (card(h.defId).type !== 'figure' || lanes > 0))
    .sort((a, b) => cardCost(s, p, a.defId) - cardCost(s, p, b.defId))
    .filter((h) => (seen.has(h.defId) ? false : (seen.add(h.defId), true)))
    .slice(0, 2)
    .map((h) => ({ kind: 'hand' as const, defId: h.defId }))
}
// No affordable card is left while the hand is still too full: the step cannot be met from here.
const cannotMakeRoom = (target: number) => (s: GameState) => s.active === s.humanPlayer && !s.pending && s.players[0].hand.length > target && playable(s, 0).length === 0
const isPlay = (a: Action, s: GameState, defId: string, face?: Face) => a.type === 'play' && s.players[s.humanPlayer].hand.some((h) => h.uid === a.uid && h.defId === defId) && (!face || a.face === face)
const myTurnAgain = (after: GameState, round: number) => after.active === after.humanPlayer && after.round === round && !after.pending

// ---- The lessons ---------------------------------------------------------------

export const LESSONS: Lesson[] = [
  {
    id: 'first-reading',
    title: 'Your first reading',
    blurb: 'Choose a face, pay Spark, place a Figure, and strike across an open lane.',
    sigs: ['sig-daxon', 'sig-rorik'],
    setup: () => {
      const s = base(['sig-daxon', 'sig-rorik'], 101)
      setHand(s, 0, ['suns-2', 'tides-3', 'tides-knight'])
      setDeckTop(s, 0, ['suns-ace', 'tides-ace', 'suns-3'])
      setSpark(s, 0, 3)
      return s
    },
    steps: [
      {
        id: 'play',
        say: 'Tap the Guard Post in your hand and choose its Reversed face. Reversed, it is 3/1 and Windborne. Then tap Present to place it. It costs 2 Spark; you have 3.',
        hints: [
          { kind: 'hand', defId: 'suns-2' },
          { kind: 'face', face: 'reversed' },
          { kind: 'slot', player: 0, lane: 1 },
        ],
        allow: (a, s) => isPlay(a, s, 'suns-2', 'reversed'),
        nudge: 'Start with the Guard Post, Reversed.',
        done: (after) => has(after, 0, 'suns-2', 'reversed'),
      },
      {
        id: 'attack',
        say: 'Windborne means it can attack the turn it arrives. Tap the Guard Post, then the open lane across from it. Nothing stands there, so the blow goes to Rorik.',
        hints: (s) => {
          const lane = laneOf(s, 0, 'suns-2')
          return lane === null ? [] : [{ kind: 'slot', player: 0, lane }, { kind: 'slot', player: 1, lane }, { kind: 'sig', player: 1 }]
        },
        allow: (a) => a.type === 'attack',
        nudge: 'Attack with the Guard Post: tap it, then the open lane across from it.',
        done: (after) => after.players[1].health < 20,
      },
      {
        id: 'end',
        say: 'Rorik is at 17. End the turn. The opponent in a lesson only ends turns, and watch what Rorik does as his turn ends.',
        hints: [{ kind: 'endTurn' }],
        allow: (a) => a.type === 'endTurn',
        nudge: 'End the turn.',
        done: (after) => myTurnAgain(after, 2),
      },
      {
        id: 'draw',
        say: 'Rorik healed 1 as his turn ended: that is his passive, and he is at 18. Round 2: you gained a Spark, refilled to 4, and drew a card. Play the Zalian Fisherman Upright into any empty lane: when he arrives, he draws a card.',
        hints: (s) => [{ kind: 'hand', defId: 'tides-3' }, { kind: 'face', face: 'upright' }, ...emptyLanes(s, 0).map((lane) => ({ kind: 'slot' as const, player: 0 as PlayerId, lane }))],
        allow: (a, s) => isPlay(a, s, 'tides-3', 'upright'),
        nudge: 'Play the Zalian Fisherman, Upright.',
        done: (after) => has(after, 0, 'tides-3', 'upright'),
      },
      {
        id: 'solve',
        free: true,
        say: 'On your own now: bring Rorik to 13 or less before this turn ends. The Guard Post alone will not get there. Sword Guy, your ability, gives a friendly Figure +2 Attack for the turn.',
        done: (after) => after.players[1].health <= 13,
        within: 'turn',
        missedSay: 'The turn ended with Rorik above 13. Retry this step and finish him before ending the turn.',
      },
    ],
  },
  {
    id: 'turn-the-fight',
    title: 'Turn the fight',
    blurb: 'Wound a wall, see what turning it over would do, and turn it. Then meet a Figure you cannot pick.',
    sigs: ['sig-shazz', 'sig-daxon'],
    setup: () => {
      const s = base(['sig-shazz', 'sig-daxon'], 202)
      s.players[0].lanes[1] = figure(s, 0, 1, 'antlers-2', 'upright') // Voren 1/3
      s.players[0].lanes[2] = figure(s, 0, 2, 'antlers-3', 'upright') // The Oondray 2/3
      s.players[1].lanes[1] = figure(s, 1, 1, 'gears-4', 'upright') // Null-Zone Pylon 1/4, Guard
      s.players[1].lanes[2] = figure(s, 1, 2, 'antlers-ace', 'reversed') // Wisplight 1/1, Windborne, Veiled
      s.players[1].lanes[0] = figure(s, 1, 0, 'suns-2', 'upright', 1) // Guard Post 1/3 with a wound already
      setHand(s, 0, ['gears-2'])
      setDeckTop(s, 0, ['gears-3', 'antlers-ace'])
      setSpark(s, 0, 2)
      return s
    },
    steps: [
      {
        id: 'wound',
        say: 'Elder Voren stands across from a Null-Zone Pylon, a 1/4 wall. Attack it with Voren: he deals 1 and takes 1. A wound stays on a Figure, even when it turns over.',
        hints: [
          { kind: 'slot', player: 0, lane: 1 },
          { kind: 'slot', player: 1, lane: 1 },
        ],
        allow: (a) => a.type === 'attack' && a.lane === 1,
        nudge: 'Attack the Pylon with Voren, in Present.',
        done: (after) => (after.players[1].lanes[1]?.damage ?? 0) >= 1,
      },
      {
        id: 'inspect',
        say: 'Now inspect the Pylon: tap the small i on its card. Read the comparison. Turned over, it would be 4/0, which is to say dead.',
        hints: [{ kind: 'inspect', player: 1, lane: 1 }],
        allow: () => false,
        nudge: 'Inspect the Pylon first: the small i on its card.',
        doneOnInspect: { player: 1, lane: 1 },
      },
      {
        id: 'flip',
        say: 'Wear a Face turns any Figure over for 2 Spark. Use it on the Pylon.',
        hints: [{ kind: 'ability' }, { kind: 'slot', player: 1, lane: 1 }],
        allow: (a) => a.type === 'ability' && a.target?.kind === 'figure' && a.target.player === 1 && a.target.lane === 1,
        nudge: 'Use Wear a Face on the Pylon.',
        done: (after) => after.players[1].lanes[1] === null,
      },
      {
        id: 'end',
        say: 'The wall is gone. It struck Voren once and never again. End the turn.',
        hints: [{ kind: 'endTurn' }],
        allow: (a) => a.type === 'endTurn',
        nudge: 'End the turn.',
        done: (after) => myTurnAgain(after, 2),
      },
      {
        id: 'veiled',
        say: 'The Wisplight in Future is Veiled: Omens and abilities cannot pick it until it attacks. Select Wear a Face and see that it is not offered. Cancel, then tap the Oondray and attack the Wisplight with it instead.',
        hints: [{ kind: 'slot', player: 0, lane: 2 }],
        allow: (a) => a.type === 'attack' && a.lane === 2,
        nudge: 'Attack the Wisplight with the Oondray, in Future.',
        done: (after) => after.players[1].lanes[2] === null,
      },
      {
        id: 'solve',
        free: true,
        say: 'On your own now: the Guard Post in Past already carries a wound. Kill it before this turn ends. Wear a Face has refreshed.',
        done: (after) => after.players[1].lanes[0] === null,
        within: 'turn',
        missedSay: 'The turn ended with the Guard Post standing. Retry this step.',
      },
    ],
  },
  {
    id: 'read-the-moon',
    title: 'Read the moon',
    blurb: 'Count a Full Moon draw against a full hand, read the stars safely, and watch the Bone Moon rise.',
    sigs: ['sig-lirielle', 'sig-luigi'],
    setup: () => {
      const s = base(['sig-lirielle', 'sig-luigi'], 303)
      s.round = 2
      s.turn = 3
      s.boneMoonRound = 4 // early, so the lesson sees it rise
      setHand(s, 0, ['antlers-ace', 'antlers-3', 'gears-2', 'gears-3', 'gears-6', 'gears-8'])
      setDeckTop(s, 0, ['gears-4', 'antlers-8', 'gears-7', 'antlers-2', 'gears-2', 'antlers-3', 'gears-3'])
      setSpark(s, 0, 5)
      return s
    },
    steps: [
      {
        id: 'room',
        say: 'Look at the turn panel: round 3 is a Full Moon. Everyone draws 2 on a Full Moon, and Lirielle draws 3. Your hand holds 8. With 6 in hand and 3 coming, 1 would burn. Play a card to make room. You have 5 Spark this lesson.',
        hints: (s) => playable(s, 0),
        allow: (a) => a.type === 'play' || a.type === 'choose',
        nudge: 'Play a card first.',
        done: (after) => after.players[0].hand.length <= 5 && !after.pending,
        stuck: cannotMakeRoom(5),
        stuckSay: 'No card you can afford is left, so this position cannot make room. Retry this step.',
      },
      {
        id: 'read',
        say: 'Read the Stars costs 2 Spark: look at the top three cards of your deck and keep one. Use it now.',
        hints: [{ kind: 'ability' }],
        allow: (a) => a.type === 'ability',
        nudge: 'Use Read the Stars.',
        done: (after) => after.pending !== null,
      },
      {
        id: 'look',
        say: 'Three cards. Tap one to read both faces; only Keep commits it. If you know them, keep straight away.',
        allow: () => false,
        nudge: 'Tap a card to read it before you keep one.',
        doneOnInspect: 'read',
        done: (after) => after.pending === null,
      },
      {
        id: 'keep',
        say: 'Keep the one you want. The rest go to the bottom of your deck.',
        allow: (a) => a.type === 'choose',
        nudge: 'Keep one of the three.',
        done: (after) => after.pending === null,
      },
      {
        id: 'count',
        say: 'You kept one, so you are back to 6 in hand: with the Full Moon bringing 3, one would burn again. Play one more card you can afford.',
        hints: (s) => playable(s, 0),
        allow: (a) => a.type === 'play' || a.type === 'choose',
        nudge: 'Play one more card to make room.',
        done: (after) => after.players[0].hand.length <= 5 && !after.pending,
        stuck: cannotMakeRoom(5),
        stuckSay: 'No card you can afford is left, so this position cannot make room. Retry this step.',
      },
      {
        id: 'moon',
        say: 'Five in hand. End the turn and watch the Full Moon draw.',
        hints: [{ kind: 'endTurn' }],
        allow: (a) => a.type === 'endTurn' || a.type === 'attack',
        nudge: 'End the turn.',
        done: (after) => myTurnAgain(after, 3),
      },
      {
        id: 'bone',
        say: 'Three cards came in and nothing burned. Now the Bone Moon. In this lesson it rises on round 4; in a full reading it is round 10. From then on every Significator loses Health at the start of each turn, more each round. Nobody outlasts it. End the turn and feel the first bite.',
        hints: [{ kind: 'endTurn' }],
        done: (after) => myTurnAgain(after, 4) && after.players[0].health < 20,
      },
      {
        id: 'solve',
        free: true,
        say: 'You took 1. Luigi takes his bite at the start of his own turn. On your own now: the next draw is one card and your hand holds 8, so end this turn with 7 or fewer in hand and nothing burns. An Omen needs no lane.',
        done: (_after, a, before) => a?.type === 'endTurn' && before.active === before.humanPlayer && before.players[0].hand.length <= 7,
      },
    ],
  },
]

export function lessonById(id: string): Lesson | null {
  return LESSONS.find((l) => l.id === id) ?? null
}

export function currentStep(lesson: Lesson, p: LessonProgress): LessonStep | null {
  return p.complete ? null : (lesson.steps[p.step] ?? null)
}

export function hintsFor(lesson: Lesson, p: LessonProgress, state: GameState): LessonHint[] {
  const step = currentStep(lesson, p)
  if (!step || step.free || p.missed) return []
  const h = step.hints
  return typeof h === 'function' ? h(state) : (h ?? [])
}

// The current step can no longer be met from this position.
export function isStuck(lesson: Lesson, p: LessonProgress, state: GameState): boolean {
  const step = currentStep(lesson, p)
  return !!step?.stuck && step.stuck(state)
}

// ---- Moving through a lesson: pure, so the store and the tests share it ----------

function advance(lesson: Lesson, p: LessonProgress): LessonProgress {
  const step = p.step + 1
  return { step, complete: step >= lesson.steps.length }
}

// Does the current step accept this action from the player?
export function allowed(lesson: Lesson, p: LessonProgress, a: Action, s: GameState): boolean {
  const step = currentStep(lesson, p)
  if (!step || step.free || !step.allow) return true
  if (a.type === 'choose') return true
  return step.allow(a, s)
}

// After an action (the player's or the sleeping opponent's) has resolved.
export function afterAction(lesson: Lesson, p: LessonProgress, before: GameState, after: GameState, a: Action | null): LessonProgress {
  if (p.missed) return p
  let cur = p
  // A step that had to finish this turn, and did not: the deadline passed.
  const step = currentStep(lesson, p)
  if (step?.within === 'turn' && a?.type === 'endTurn' && before.active === before.humanPlayer && !(step.done && step.done(after, a, before))) return { ...p, missed: true }
  for (let guard = 0; guard < lesson.steps.length; guard++) {
    const step = currentStep(lesson, cur)
    if (!step || !step.done || !step.done(after, a, before)) return cur
    cur = advance(lesson, cur)
    // Only a step that reads the same table can complete on the same action.
    a = null
  }
  return cur
}

// After the player inspected something.
export function afterInspect(lesson: Lesson, p: LessonProgress, target: InspectTarget): LessonProgress {
  const step = currentStep(lesson, p)
  if (!step || !step.doneOnInspect) return p
  const want = step.doneOnInspect
  const hit = want === 'any' || (typeof want === 'string' ? want === target : typeof target !== 'string' && want.player === target.player && want.lane === target.lane)
  return hit ? advance(lesson, p) : p
}

export const cardName = (id: string) => card(id).name
