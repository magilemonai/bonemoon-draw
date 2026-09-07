// Every lesson's intended line still works through the engine. If a balance change
// breaks one, this is where it shows.
import { describe, expect, it } from 'vitest'
import { finalState, runAction } from '../engine/engine'
import type { Action } from '../engine/types'
import { LESSONS, afterAction, afterInspect, allowed, hintsFor, isStuck, lessonById, type InspectTarget, type LessonProgress } from './lessons'

function player(lessonId: string) {
  const lesson = lessonById(lessonId)!
  let s = lesson.setup()
  let p: LessonProgress = { step: 0, complete: false }
  const uidOf = (defId: string) => s.players[0].hand.find((h) => h.defId === defId)!.uid
  const act = (a: Action, expectAllowed = true) => {
    const ok = allowed(lesson, p, a, s)
    expect(ok, `${lesson.id} step ${p.step} allows ${a.type}`).toBe(expectAllowed)
    if (!ok) return
    const before = s
    s = finalState(runAction(s, a, false), s)
    p = afterAction(lesson, p, before, s, a)
  }
  // The sleeping opponent: it only ends its turn.
  const opponent = () => {
    expect(s.active).toBe(1)
    const before = s
    s = finalState(runAction(s, { type: 'endTurn' }, false), s)
    p = afterAction(lesson, p, before, s, { type: 'endTurn' })
  }
  const look = (t: InspectTarget) => {
    p = afterInspect(lesson, p, t)
  }
  return { lesson, state: () => s, progress: () => p, uidOf, act, opponent, look }
}

describe('lessons', () => {
  it('are three, each ending with an exercise', () => {
    expect(LESSONS.map((l) => l.id)).toEqual(['first-reading', 'turn-the-fight', 'read-the-moon'])
    for (const l of LESSONS) {
      expect(l.steps[l.steps.length - 1].free).toBe(true)
      expect(l.steps.every((st) => st.say.length > 20)).toBe(true)
    }
  })

  it('your first reading: place, strike, end, draw, then bring Rorik to 13', () => {
    const t = player('first-reading')
    t.act({ type: 'endTurn' }, false) // not yet: the step wants the Guard Post
    t.act({ type: 'play', uid: t.uidOf('suns-2'), face: 'reversed', lane: 1 })
    expect(t.progress().step).toBe(1)
    t.act({ type: 'attack', lane: 1, targetLane: 1 })
    expect(t.state().players[1].health).toBe(17)
    expect(t.progress().step).toBe(2)
    t.act({ type: 'endTurn' })
    t.opponent()
    expect(t.progress().step).toBe(3)
    t.act({ type: 'play', uid: t.uidOf('tides-3'), face: 'upright', lane: 0 })
    expect(t.progress().step).toBe(4)
    // Rorik healed to 18 at the end of his turn. The Guard Post alone reaches 15; Sword Guy makes it 13.
    expect(t.state().players[1].health).toBe(18)
    t.act({ type: 'ability', target: { kind: 'figure', player: 0, lane: 1 } })
    t.act({ type: 'attack', lane: 1, targetLane: 1 })
    expect(t.state().players[1].health).toBe(13)
    expect(t.progress().complete).toBe(true)
  })

  it('turn the fight: wound, inspect, flip, then the Veiled Wisplight, then the wounded Guard Post', () => {
    const t = player('turn-the-fight')
    t.act({ type: 'attack', lane: 2, targetLane: 2 }, false) // the Oondray is for later
    t.act({ type: 'attack', lane: 1, targetLane: 1 })
    expect(t.state().players[1].lanes[1]?.damage).toBe(1)
    expect(t.progress().step).toBe(1)
    t.act({ type: 'ability', target: { kind: 'figure', player: 1, lane: 1 } }, false) // look first
    t.look({ player: 1, lane: 0 }) // the wrong card does not count
    expect(t.progress().step).toBe(1)
    t.look({ player: 1, lane: 1 })
    expect(t.progress().step).toBe(2)
    t.act({ type: 'ability', target: { kind: 'figure', player: 1, lane: 1 } })
    expect(t.state().players[1].lanes[1]).toBeNull()
    expect(t.progress().step).toBe(3)
    t.act({ type: 'endTurn' })
    t.opponent()
    expect(t.progress().step).toBe(4)
    t.act({ type: 'attack', lane: 2, targetLane: 2 })
    expect(t.state().players[1].lanes[2]).toBeNull()
    expect(t.progress().step).toBe(5)
    // The exercise: the wounded Guard Post in Past. Wear a Face has refreshed.
    t.act({ type: 'ability', target: { kind: 'figure', player: 1, lane: 0 } })
    expect(t.state().players[1].lanes[0]).toBeNull()
    expect(t.progress().complete).toBe(true)
  })

  it('read the moon: make room, read, look, keep, make room again, draw three, feel the bite, end light', () => {
    const t = player('read-the-moon')
    expect(t.state().players[0].hand.length).toBe(6)
    t.act({ type: 'ability' }, false) // room first
    t.act({ type: 'play', uid: t.uidOf('antlers-3'), face: 'upright', lane: 0 })
    expect(t.progress().step).toBe(1)
    t.act({ type: 'ability' })
    expect(t.state().pending).not.toBeNull()
    expect(t.progress().step).toBe(2)
    t.act({ type: 'endTurn' }, false) // the look step accepts nothing but a keep
    t.look('hand') // looking at the wrong thing does not count
    expect(t.progress().step).toBe(2)
    t.look('read')
    expect(t.progress().step).toBe(3)
    t.act({ type: 'choose', uid: t.state().pending!.options[0].uid })
    expect(t.progress().step).toBe(4)
    expect(t.state().players[0].hand.length).toBe(6)
    t.act({ type: 'play', uid: t.uidOf('antlers-ace'), face: 'upright', lane: 1 })
    expect(t.progress().step).toBe(5)
    expect(t.state().players[0].hand.length).toBeLessThanOrEqual(5)
    t.act({ type: 'endTurn' })
    t.opponent()
    expect(t.state().round).toBe(3)
    expect(t.state().players[0].burnsThisGame).toBe(0)
    expect(t.progress().step).toBe(6)
    t.act({ type: 'endTurn' })
    t.opponent()
    expect(t.state().round).toBe(4)
    expect(t.state().players[0].health).toBe(19)
    expect(t.progress().step).toBe(7)
    // The exercise: end with six or fewer in hand.
    const hand = () => t.state().players[0].hand
    while (hand().length > 7) {
      const lane = t.state().players[0].lanes.findIndex((f) => f === null)
      const cheap = hand().find((h) => ['antlers-ace', 'gears-2', 'gears-3', 'antlers-3'].includes(h.defId))
      const mana = hand().find((h) => h.defId === 'gears-6') // Liquid Mana, an Omen: no lane needed
      if (lane >= 0 && cheap) t.act({ type: 'play', uid: cheap.uid, face: 'upright', lane: lane as 0 | 1 | 2 })
      else if (mana) t.act({ type: 'play', uid: mana.uid, face: 'upright' })
      else throw new Error('no way to make room')
      if (t.state().pending) t.act({ type: 'choose', uid: t.state().pending!.options[0].uid })
    }
    t.act({ type: 'endTurn' })
    expect(t.progress().complete).toBe(true)
  })

  it('read the moon: keeping before looking does not stall the lesson', () => {
    const t = player('read-the-moon')
    t.act({ type: 'play', uid: t.uidOf('antlers-3'), face: 'upright', lane: 0 })
    t.act({ type: 'ability' })
    expect(t.progress().step).toBe(2)
    t.act({ type: 'choose', uid: t.state().pending!.options[0].uid }) // a keep is always allowed
    expect(t.progress().step).toBe(4) // past 'look' and 'keep', on to counting again
  })

  it('your first reading: the lights follow where the Guard Post really went', () => {
    const t = player('first-reading')
    t.act({ type: 'play', uid: t.uidOf('suns-2'), face: 'reversed', lane: 0 }) // Past, not the suggested Present
    expect(t.progress().step).toBe(1)
    const lit = hintsFor(t.lesson, t.progress(), t.state())
    expect(lit).toContainEqual({ kind: 'slot', player: 0, lane: 0 })
    expect(lit).toContainEqual({ kind: 'slot', player: 1, lane: 0 })
    expect(lit).not.toContainEqual({ kind: 'slot', player: 0, lane: 1 })
    t.act({ type: 'attack', lane: 0, targetLane: 0 })
    expect(t.progress().step).toBe(2)
  })

  it('your first reading: the closing deadline is real, and the Pearl line is a fair answer', () => {
    const line = () => {
      const t = player('first-reading')
      t.act({ type: 'play', uid: t.uidOf('suns-2'), face: 'reversed', lane: 1 })
      t.act({ type: 'attack', lane: 1, targetLane: 1 })
      t.act({ type: 'endTurn' })
      t.opponent()
      t.act({ type: 'play', uid: t.uidOf('tides-3'), face: 'upright', lane: 0 })
      expect(t.progress().step).toBe(4)
      return t
    }
    // Attack without Sword Guy, end the turn: the exercise is missed, and a later attack does not rescue it.
    const a = line()
    a.act({ type: 'attack', lane: 1, targetLane: 1 })
    a.act({ type: 'endTurn' })
    expect(a.progress().missed).toBe(true)
    a.opponent()
    a.act({ type: 'attack', lane: 1, targetLane: 1 })
    expect(a.progress().complete).toBe(false)
    expect(hintsFor(a.lesson, a.progress(), a.state())).toEqual([])
    // Kaipo's Pearl Reversed on the Guard Post, then the attack: 18 minus 5 is 13, in the same turn.
    const b = line()
    b.act({ type: 'play', uid: b.uidOf('tides-ace'), face: 'reversed', target: { kind: 'figure', player: 0, lane: 1 } })
    b.act({ type: 'attack', lane: 1, targetLane: 1 })
    expect(b.state().players[1].health).toBe(13)
    expect(b.progress().complete).toBe(true)
    expect(b.state().round).toBe(2)
  })

  it('read the moon: a stall is named, and the lights only point at cards you can play', () => {
    const t = player('read-the-moon')
    t.act({ type: 'play', uid: t.uidOf('antlers-ace'), face: 'upright', lane: 0 }) // the Wisplight, for 1
    t.act({ type: 'ability' })
    t.act({ type: 'choose', uid: t.state().pending!.options[0].uid })
    expect(t.progress().step).toBe(4)
    expect(t.state().players[0].spark).toBe(2)
    // Yvette Reversed spends the last Spark. Nothing affordable is left: stuck, and said so.
    t.act({ type: 'play', uid: t.uidOf('gears-3'), face: 'reversed', lane: 1 })
    if (t.state().pending) t.act({ type: 'choose', uid: t.state().pending!.options[0].uid })
    expect(t.progress().step).toBe(4)
    expect(isStuck(t.lesson, t.progress(), t.state())).toBe(true)
    expect(hintsFor(t.lesson, t.progress(), t.state())).toEqual([])
  })
})

// A phone's coach shows the action alone. Every step has one, and it is short enough to
// read in two lines at 390 wide.
describe('the phone line', () => {
  it('every step has a do line under 92 characters that ends in a full stop', () => {
    for (const lesson of LESSONS) {
      for (const step of lesson.steps) {
        expect(step.do, `${lesson.id}/${step.id} has a do line`).toBeTruthy()
        expect(step.do!.length, `${lesson.id}/${step.id} do line length`).toBeLessThanOrEqual(92)
        expect(step.do!.endsWith('.'), `${lesson.id}/${step.id} ends with a full stop`).toBe(true)
      }
    }
  })
})
