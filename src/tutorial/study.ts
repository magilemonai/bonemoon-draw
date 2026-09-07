// The Card study: one crowded position, for judging the compact card treatments on the
// same table. Shazz against a sleeping Daxon, round six, the Bone Moon a round away,
// keywords on every Figure, wounds, Relics, a buff, an Aegis, and a full hand.
import { beginGame, createGame, finalState } from '../engine/engine'
import type { Face, FigureInstance, GameState, Keyword, LaneIndex, PlayerId, RelicInstance } from '../engine/types'

function figure(s: GameState, p: PlayerId, lane: LaneIndex, defId: string, face: Face, extra: Partial<FigureInstance> = {}): FigureInstance {
  return {
    uid: s.nextUid++,
    defId,
    owner: p,
    lane,
    face,
    damage: 0,
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
    ...extra,
  }
}
function relic(s: GameState, defId: string, face: Face): RelicInstance {
  return { uid: s.nextUid++, defId, face }
}
const kw = (...k: Keyword[]) => k

export function studyState(): GameState {
  const g = createGame({ sigs: ['sig-shazz', 'sig-daxon'], seed: 77, humanPlayer: 0, firstPlayer: 0 })
  const s = finalState(beginGame(g, false), g)
  s.round = 6
  s.boneMoonRound = 7
  const me = s.players[0]
  const them = s.players[1]
  me.health = 14
  them.health = 11
  me.spark = 6
  me.maxSpark = 6
  me.tempSpark = 0
  them.spark = 0
  them.maxSpark = 6
  // Theirs: a wounded Guard carrying a Relic, a Veiled Windborne captain, a buffed general.
  them.lanes[0] = figure(s, 1, 0, 'suns-2', 'upright', { damage: 1, relics: [relic(s, 'suns-8', 'upright')], aegis: true })
  them.lanes[1] = figure(s, 1, 1, 'suns-page', 'reversed', { grantedKw: kw('windborne', 'veiled', 'gale') })
  them.lanes[2] = figure(s, 1, 2, 'suns-knight', 'upright', { permAtk: 2, damage: 2, relics: [relic(s, 'tides-8', 'reversed')] })
  // Mine: Voren Reversed on Guard, the Sentry Reversed and Rekindling, Mordeaux Fixed, buffed, and twice wounded.
  me.lanes[0] = figure(s, 0, 0, 'antlers-2', 'reversed', { grantedKw: kw('guard') })
  me.lanes[1] = figure(s, 0, 1, 'gears-7', 'reversed', { grantedKw: kw('rekindle', 'veiled') })
  me.lanes[2] = figure(s, 0, 2, 'gears-knight', 'upright', { grantedKw: kw('fixed', 'whisper'), permHp: 1, damage: 2 })
  me.hand = ['antlers-6', 'gears-8', 'gears-6', 'gears-9', 'gears-queen', 'gears-10', 'major-8', 'major-10'].map((defId) => ({ uid: s.nextUid++, defId }))
  them.hand = them.deck.splice(0, 5)
  return s
}
