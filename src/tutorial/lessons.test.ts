// Every lesson's intended line still works through the engine. If a balance change
// breaks one, this is where it shows.
import { describe, expect, it } from 'vitest'
import { finalState, runAction } from '../engine/engine'
import type { Action } from '../engine/types'
import { LESSONS, afterAction, afterInspect, allowed, lessonById, type InspectTarget, type LessonProgress } from './lessons'

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
    while (hand().length > 6) {
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
})
