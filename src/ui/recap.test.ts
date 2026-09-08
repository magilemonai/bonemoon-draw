import { describe, expect, it } from 'vitest'
import { beginGame, createGame, finalState, runAction } from '../engine/engine'
import { chooseAction } from '../ai/ai'
import type { Action, GameState } from '../engine/types'
import { recapLines, replay } from './recap'

function playOut(seed: number): { actions: Action[]; final: GameState } {
  const g = createGame({ sigs: ['sig-shazz', 'sig-daxon'], seed, humanPlayer: 0 })
  let s = finalState(beginGame(g, false), g)
  const actions: Action[] = []
  let guard = 0
  while (s.phase !== 'over' && guard++ < 900) {
    const a = chooseAction(s, { seed })
    actions.push(a)
    s = finalState(runAction(s, a, false), s)
  }
  return { actions, final: s }
}

describe('the recap', () => {
  it('replays a reading to the same end from its seed and actions', () => {
    const { actions, final } = playOut(4242)
    const r = replay({ humanSig: 'sig-shazz', aiSig: 'sig-daxon', seed: 4242, actions })
    expect(r.final.phase).toBe('over')
    expect(r.final.winner).toBe(final.winner)
    expect(r.final.round).toBe(final.round)
    expect(r.final.players[0].health).toBe(final.players[0].health)
  })

  it('names the blow and keeps to five factual lines', () => {
    const { actions, final } = playOut(4242)
    const lines = recapLines({ humanSig: 'sig-shazz', aiSig: 'sig-daxon', seed: 4242, actions })
    expect(lines.length).toBeGreaterThan(0)
    expect(lines.length).toBeLessThanOrEqual(5)
    expect(lines[0]).toMatch(new RegExp(`^Round ${final.round}: `))
    expect(lines[0]).toMatch(/to 0\.$/)
  })

  it('says nothing for an unfinished reading', () => {
    const { actions } = playOut(7)
    expect(recapLines({ humanSig: 'sig-shazz', aiSig: 'sig-daxon', seed: 7, actions: actions.slice(0, 3) })).toEqual([])
  })
})
