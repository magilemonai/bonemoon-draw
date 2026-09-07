// The Bonemoon Draw: rules engine.
// Pure functions over GameState. runAction() returns a list of steps, each one an
// event plus a snapshot of the state right after it, so the UI can animate in order.

import { card, significator } from '../data'
import { nextRandom, shuffleWithSeed } from './rng'
import { RULES } from './rules'
import {
  activeAuras,
  attackLanes,
  attackOf,
  availableSpark,
  canAttack,
  canMove,
  cardCost,
  emptyLanes,
  faceDef,
  figAt,
  figures,
  hasKw,
  healthOf,
  keywords,
  maxHealthOf,
  moonPhase,
  other,
  playableFaces,
  refOf,
  resolveDefender,
  resolveRef,
  sigRef,
  targetsFor,
  damageReduction,
  sameRef,
} from './queries'
import type {
  Action,
  CardInstance,
  Face,
  FigureInstance,
  GameEvent,
  GameState,
  LaneIndex,
  Op,
  PlayerId,
  Selector,
  Step,
  TargetRef,
  Trigger,
  EffectDef,
} from './types'

export const MAX_HAND = 8
export const MAX_SPARK = 10
export const BONE_MOON_ROUND = 10
export const DECK_SIZE = 30

// ---------------------------------------------------------------------------
// Context: a mutable working copy plus the step log.
// ---------------------------------------------------------------------------

interface Ctx {
  s: GameState
  steps: Step[]
  snapshots: boolean
  // Effect-resolution scratch:
  self?: FigureInstance
  chosen?: TargetRef
  defender?: TargetRef
  mover?: TargetRef
  flipped?: TargetRef
  owner: PlayerId // whose effect is resolving
  echoing?: boolean
  depth: number
}

function emit(c: Ctx, ev: GameEvent) {
  c.steps.push({ ev, state: c.snapshots ? structuredClone(c.s) : c.s })
}

function rnd(c: Ctx): number {
  const r = nextRandom(c.s.seed)
  c.s.seed = r.seed
  return r.value
}

function pick<T>(c: Ctx, arr: T[]): T | undefined {
  if (arr.length === 0) return undefined
  return arr[Math.floor(rnd(c) * arr.length)]
}

function log(c: Ctx, text: string) {
  emit(c, { kind: 'log', text })
}

// ---------------------------------------------------------------------------
// Game creation
// ---------------------------------------------------------------------------

export function createGame(opts: { sigs: [string, string]; seed: number; humanPlayer?: PlayerId; firstPlayer?: PlayerId; deckSeeds?: [number, number] }): GameState {
  let seed = opts.seed
  let uid = 1
  const mk = (p: PlayerId): GameState['players'][0] => {
    const sig = significator(opts.sigs[p])
    const cards: CardInstance[] = sig.deck.filter((id) => id !== sig.cardId).map((defId) => ({ uid: uid++, defId }))
    // A per-player deck seed keeps a hero's deck order fixed across a seat swap (used by the sims).
    const sh = shuffleWithSeed(cards, opts.deckSeeds ? opts.deckSeeds[p] : seed)
    if (!opts.deckSeeds) seed = sh.seed
    return {
      id: p,
      sigId: sig.id,
      health: sig.health,
      maxHealth: sig.health,
      spark: 0,
      maxSpark: 0,
      tempSpark: 0,
      deck: sh.arr,
      hand: [],
      lanes: [null, null, null],
      graveyard: [],
      fatigue: 0,
      abilityUsed: false,
      costNextDiscount: 0,
      omenDiscount: 0,
      handRevealed: false,
      omensCastThisTurn: 0,
      friendlyDeathsThisTurn: 0,
      burnsThisGame: 0,
    }
  }
  const players: [GameState['players'][0], GameState['players'][1]] = [mk(0), mk(1)]
  let first: PlayerId
  if (opts.firstPlayer !== undefined) first = opts.firstPlayer
  else {
    const r = nextRandom(seed)
    seed = r.seed
    first = r.value < 0.5 ? 0 : 1
  }
  const state: GameState = {
    players,
    active: first,
    round: 0,
    turn: 0,
    boneMoonRound: BONE_MOON_ROUND,
    phase: 'main',
    winner: null,
    seed,
    nextUid: uid,
    pending: null,
    humanPlayer: opts.humanPlayer ?? 0,
  }
  // Opening hands: 4 for the first player, 5 for the second.
  for (const p of [0, 1] as PlayerId[]) {
    const n = p === first ? 4 : 5
    for (let i = 0; i < n; i++) {
      const cI = state.players[p].deck.shift()
      if (cI) state.players[p].hand.push(cI)
    }
    if (significator(state.players[p].sigId).id === 'sig-luigi') {
      state.players[p].hand.push({ uid: state.nextUid++, defId: 'tok-brog' })
    }
    if (RULES.secondPlayerSparkToken && p !== first) {
      state.players[p].hand.push({ uid: state.nextUid++, defId: 'tok-spark' })
    }
  }
  return state
}

// Partial mulligan (experiment): set aside any of the drawn opening cards, draw that many
// replacements, then shuffle the set-aside cards back into the deck. Brog is not exchangeable.
export function mulligan(state: GameState, p: PlayerId, setAside: number[]): GameState {
  const s = structuredClone(state)
  const pl = s.players[p]
  const aside: CardInstance[] = []
  for (const uid of setAside) {
    const i = pl.hand.findIndex((h) => h.uid === uid && h.defId !== 'tok-brog')
    if (i >= 0) aside.push(...pl.hand.splice(i, 1))
  }
  for (let i = 0; i < aside.length; i++) {
    const top = pl.deck.shift()
    if (top) pl.hand.push(top)
  }
  const sh = shuffleWithSeed([...pl.deck, ...aside], s.seed)
  pl.deck = sh.arr
  s.seed = sh.seed
  return s
}

// Start the very first turn (separate so the UI can animate the opening).
export function beginGame(state: GameState, snapshots = true): Step[] {
  const c: Ctx = { s: structuredClone(state), steps: [], snapshots, owner: state.active, depth: 0 }
  startTurn(c)
  return c.steps
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export function runAction(state: GameState, action: Action, snapshots = true): Step[] {
  const c: Ctx = { s: structuredClone(state), steps: [], snapshots, owner: state.active, depth: 0 }
  if (c.s.phase === 'over') return c.steps
  try {
    switch (action.type) {
      case 'play':
        doPlay(c, action)
        break
      case 'attack':
        doAttack(c, action.lane, action.targetLane)
        break
      case 'move':
        doMove(c, action.lane, action.to)
        break
      case 'ability':
        doAbility(c, action.target)
        break
      case 'choose':
        doChoose(c, action.uid)
        break
      case 'endTurn':
        endTurn(c)
        break
    }
  } catch (e) {
    log(c, `Illegal action: ${(e as Error).message}`)
  }
  if (c.steps.length === 0 || c.steps[c.steps.length - 1].state !== c.s) {
    // Guarantee the final step carries the final state.
    c.steps.push({ ev: { kind: 'log', text: '' }, state: c.snapshots ? structuredClone(c.s) : c.s })
  }
  return c.steps
}

export function finalState(steps: Step[], fallback: GameState): GameState {
  return steps.length ? steps[steps.length - 1].state : fallback
}

// ---------------------------------------------------------------------------
// Turn structure
// ---------------------------------------------------------------------------

function startTurn(c: Ctx) {
  const s = c.s
  const p = s.active
  const me = s.players[p]
  s.turn += 1
  s.round = Math.ceil(s.turn / 2) // a round is one turn for each player
  c.owner = p
  emit(c, { kind: 'turnStart', player: p, round: s.round, moon: moonPhase(s.round) })

  me.maxSpark = Math.min(MAX_SPARK, me.maxSpark + 1)
  me.spark = me.maxSpark
  me.tempSpark = 0
  me.abilityUsed = false
  me.costNextDiscount = 0
  me.omenDiscount = 0
  me.omensCastThisTurn = 0
  s.players[0].handRevealed = false
  s.players[1].handRevealed = false
  me.friendlyDeathsThisTurn = 0
  for (const f of figures(s, p)) {
    f.attacksThisTurn = 0
    f.movedThisTurn = false
    f.onceUsed = []
  }

  // Bone Moon. A Significator at 0 loses at once; nothing later in the turn can save them.
  if (s.round >= s.boneMoonRound) {
    const bite = s.round - s.boneMoonRound + 1
    if (s.round === s.boneMoonRound && s.turn % 2 === 1) emit(c, { kind: 'boneMoon', round: s.round })
    emit(c, { kind: 'boneMoonBite', player: p, n: bite })
    dealDamage(c, sigRef(p), bite)
    if (s.phase === 'over') return
  }

  // Seat experiments: applied to the first turn of the game only.
  if (s.turn === 2 && RULES.secondPlayerFirstTurnSpark) me.tempSpark += 1

  // Draw
  let draws = 1
  if (s.turn === 1 && RULES.firstPlayerSkipsFirstDraw) draws = 0
  if (moonPhase(s.round) === 'full') {
    draws += 1
    if (significator(me.sigId).id === 'sig-lirielle') draws += 1
  }
  for (let i = 0; i < draws; i++) {
    drawCard(c, p)
    if (s.phase === 'over') return
  }

  rechargeAegis(c, p)
  fireTrigger(c, 'startTurn', p)
  checkDeaths(c)
  checkGameOver(c)
}

function endTurn(c: Ctx) {
  const s = c.s
  if (s.pending) throw new Error('resolve the pending choice first')
  const p = s.active
  c.owner = p
  fireTrigger(c, 'endTurn', p)
  checkDeaths(c)
  if (significator(s.players[p].sigId).id === 'sig-rorik') {
    if (!RULES.rorikConditional || s.players[p].friendlyDeathsThisTurn > 0) heal(c, sigRef(p), 1)
  }
  for (const f of figures(s, p)) {
    f.tempAtk = 0
    f.tempHp = 0
    f.asleep = false
  }
  checkDeaths(c)
  checkGameOver(c)
  if (s.phase === 'over') return
  s.active = other(p)
  startTurn(c)
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function drawCard(c: Ctx, p: PlayerId) {
  const me = c.s.players[p]
  const top = me.deck.shift()
  if (!top) {
    me.fatigue += 1
    emit(c, { kind: 'fatigue', player: p, n: me.fatigue })
    dealDamage(c, sigRef(p), me.fatigue)
    return
  }
  if (me.hand.length >= MAX_HAND) {
    me.graveyard.push(top)
    me.burnsThisGame += 1
    emit(c, { kind: 'burn', player: p, defId: top.defId })
    return
  }
  me.hand.push(top)
  emit(c, { kind: 'draw', player: p, uid: top.uid, defId: top.defId })
}

// ---------------------------------------------------------------------------
// Playing cards
// ---------------------------------------------------------------------------

function doPlay(c: Ctx, a: { uid: number; face: Face; lane?: LaneIndex; target?: TargetRef }) {
  const s = c.s
  const p = s.active
  if (s.pending) throw new Error('resolve the pending choice first')
  const me = s.players[p]
  const idx = me.hand.findIndex((h) => h.uid === a.uid)
  if (idx < 0) throw new Error('card not in hand')
  const inst = me.hand[idx]
  const def = card(inst.defId)
  if (!playableFaces(s, p, def.id).includes(a.face)) throw new Error('that face cannot be played')
  const cost = cardCost(s, p, def.id)
  if (availableSpark(me) < cost) throw new Error('not enough Spark')
  const face = faceDef(def, a.face)

  // Validate placement / target.
  if (def.type === 'figure') {
    if (a.lane === undefined || me.lanes[a.lane] !== null) throw new Error('needs an empty lane')
  }
  if (def.type === 'relic') {
    if (!a.target || !resolveRef(s, a.target) || a.target.player !== p) throw new Error('relic needs a friendly Figure')
  }
  if (def.type !== 'relic' && face.target && face.target !== 'none') {
    const legal = targetsFor(s, p, face.target, { fromOmen: def.type === 'omen', pierceVeil: face.pierceVeil })
    if (legal.length > 0 && !legal.some((t) => sameRef(t, a.target))) throw new Error('bad target')
    if (legal.length === 0) a.target = undefined
  }
  // From here on the target means this exact Figure, whatever later takes its lane.
  if (a.target?.kind === 'figure') {
    const tf = resolveRef(s, a.target)
    if (tf) a.target = refOf(tf)
  }

  // Pay.
  paySpark(c, p, cost)
  me.costNextDiscount = 0
  if (def.type === 'omen') me.omenDiscount = 0
  me.hand.splice(idx, 1)
  emit(c, { kind: 'played', player: p, uid: inst.uid, defId: def.id, face: a.face, lane: a.lane, cardType: def.type })

  // The Chorus watches.
  fireTrigger(c, 'onEnemyPlay', other(p))

  if (def.type === 'figure') {
    const fig = summon(c, p, def.id, a.lane!, a.face, inst.uid)
    if (fig) {
      c.self = fig
      c.chosen = a.target
      runEffects(c, fig, 'arrive')
      // A Figure that enters with Aegis (its own keyword, or next to Rorik) has it at once;
      // a Figure that brings the aura shields its neighbors at once.
      if (s.players[p].lanes[fig.lane]?.uid === fig.uid) chargeAegisAround(c, fig)
    }
  } else if (def.type === 'omen') {
    castOmen(c, p, inst, a.face, a.target)
  } else if (def.type === 'relic') {
    const holder = resolveRef(s, a.target)!
    holder.relics.push({ uid: inst.uid, defId: def.id, face: a.face })
    emit(c, { kind: 'buff', target: refOf(holder), atk: 0, hp: 0 })
    if (keywords(s, holder).includes('aegis')) holder.aegis = true
    c.self = holder
    runEffects(c, holder, 'onRelicAttached')
    fireTrigger(c, 'onEnemyRelic', other(p))
  }
  checkDeaths(c)
  checkGameOver(c)
}

function paySpark(c: Ctx, p: PlayerId, cost: number) {
  const me = c.s.players[p]
  const fromTemp = Math.min(me.tempSpark, cost)
  me.tempSpark -= fromTemp
  me.spark -= cost - fromTemp
}

function castOmen(c: Ctx, p: PlayerId, inst: CardInstance, face: Face, target: TargetRef | undefined) {
  const s = c.s
  const def = card(inst.defId)
  const me = s.players[p]
  emit(c, { kind: 'omen', player: p, defId: def.id, face, target })

  // Mr. Zero counters the next enemy Omen and shatters.
  const counter = activeAuras(s, other(p)).find((a) => a.aura.kind === 'counterOmens')
  if (counter) {
    emit(c, { kind: 'countered', player: p, defId: def.id })
    me.graveyard.push(inst)
    detonate(c, counter.source)
    return
  }

  c.self = undefined
  c.chosen = target
  c.owner = p
  const f = faceDef(def, face)
  for (const eff of f.effects ?? []) {
    if (eff.trigger === 'cast') runOps(c, eff.ops)
  }
  me.graveyard.push(inst)
  me.omensCastThisTurn += 1

  // Reactions to the cast.
  fireTrigger(c, 'onEnemyOmen', other(p))
  if (!c.echoing) {
    // Mordeaux echoes; the Magician taxes.
    for (const fig of figures(s, p)) {
      const fd = faceDef(card(fig.defId), fig.face)
      if (fig.hushed) continue
      for (const eff of fd.effects ?? []) {
        if (eff.trigger !== 'onFriendlyOmen') continue
        const key = `${fig.uid}:onFriendlyOmen`
        if (eff.oncePerTurn && fig.onceUsed.includes(key)) continue
        if (eff.oncePerTurn) fig.onceUsed.push(key)
        if (eff.ops.some((o) => o.op === 'echoOmen')) {
          if (target?.kind === 'figure' && !resolveRef(s, target)) {
            log(c, `${card(fig.defId).name} tries to repeat ${def.name}, but its target is gone.`)
            continue
          }
          c.echoing = true
          c.chosen = target
          for (const e2 of f.effects ?? []) if (e2.trigger === 'cast') runOps(c, e2.ops)
          c.echoing = false
          log(c, `${card(fig.defId).name} repeats ${def.name}.`)
        } else {
          c.self = fig
          runOps(c, eff.ops)
        }
      }
    }
  }
}

function summon(c: Ctx, p: PlayerId, defId: string, lane: LaneIndex, face: Face, uid?: number): FigureInstance | null {
  const s = c.s
  const me = s.players[p]
  if (me.lanes[lane] !== null) return null
  const def = card(defId)
  if (def.type !== 'figure') return null
  const forcedRev = def.reversed.keywords?.includes('entersReversed') || def.upright.keywords?.includes('entersReversed') || activeAuras(s, other(p)).some((a) => a.aura.kind === 'enemyEntersReversed')
  const fig: FigureInstance = {
    uid: uid ?? s.nextUid++,
    defId,
    owner: p,
    lane,
    face: forcedRev ? 'reversed' : face,
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
    summonedTurn: s.turn,
    attacksThisTurn: 0,
    movedThisTurn: false,
    onceUsed: [],
    relics: [],
  }
  me.lanes[lane] = fig
  emit(c, { kind: 'summon', player: p, uid: fig.uid, defId, lane, face: fig.face })
  if (uid === undefined) chargeAegisAround(c, fig) // a token; a played Figure is charged after its Arrive
  return fig
}

// ---------------------------------------------------------------------------
// Combat and movement
// ---------------------------------------------------------------------------

function doAttack(c: Ctx, lane: LaneIndex, targetLane?: LaneIndex) {
  const s = c.s
  const p = s.active
  const atk = figAt(s, p, lane)
  if (!atk) throw new Error('no attacker')
  if (!canAttack(s, atk)) throw new Error('that Figure cannot attack now')
  const tl = targetLane ?? lane
  if (!attackLanes(s, atk).includes(tl)) throw new Error('cannot attack that lane')
  const defRef = resolveDefender(s, atk, tl)
  c.owner = p
  atk.attacksThisTurn += 1
  emit(c, { kind: 'attackStart', attacker: refOf(atk), defender: defRef })

  // Veiled drops when you strike.
  if (hasKw(s, atk, 'veiled')) atk.removedKw.push('veiled')

  c.self = atk
  c.defender = defRef
  runEffects(c, atk, 'onAttack')
  checkDeaths(c)
  if (s.players[p].lanes[lane]?.uid !== atk.uid) return // attacker vanished mid-swing

  const power = attackOf(s, atk)
  const defender = resolveRef(s, defRef)
  if (defRef.kind === 'figure' && !defender) {
    // The defender left the lane before the blow (a flip killed it, a Last Rite moved things). The attack stops.
    log(c, `${figureNameOf(atk)}'s target is gone. The attack stops.`)
  } else if (defender) {
    const before = healthOf(s, defender)
    dealDamage(c, refOf(defender), power, atk)
    if (!hasKw(s, atk, 'whisper')) {
      dealDamage(c, refOf(atk), attackOf(s, defender), defender)
    }
    c.self = atk
    c.defender = defRef
    runEffects(c, atk, 'onDamageDealt')
    if (before > 0 && healthOf(s, defender) <= 0) {
      checkDeaths(c)
      if (s.players[p].lanes[lane]?.uid === atk.uid) {
        c.self = atk
        runEffects(c, atk, 'onKill')
      }
    }
  } else {
    dealDamage(c, defRef, power, atk)
  }
  checkDeaths(c)
  if (s.players[p].lanes[lane]?.uid === atk.uid) {
    c.self = atk
    c.defender = defRef
    runEffects(c, atk, 'afterAttack')
  }
  checkDeaths(c)
  checkGameOver(c)
}

function doMove(c: Ctx, lane: LaneIndex, to: LaneIndex) {
  const s = c.s
  const p = s.active
  const fig = figAt(s, p, lane)
  if (!fig) throw new Error('no Figure there')
  if (!canMove(s, fig)) throw new Error('that Figure cannot move now')
  if (Math.abs(to - lane) !== 1 || s.players[p].lanes[to] !== null) throw new Error('must move to an adjacent empty lane')
  moveFigure(c, fig, to, true)
  checkDeaths(c)
  checkGameOver(c)
}

function moveFigure(c: Ctx, fig: FigureInstance, to: LaneIndex, voluntary: boolean) {
  const s = c.s
  const me = s.players[fig.owner]
  if (me.lanes[to] !== null) return
  const from = refOf(fig)
  me.lanes[fig.lane] = null
  fig.lane = to
  me.lanes[to] = fig
  if (voluntary) fig.movedThisTurn = true
  emit(c, { kind: 'move', from, to })
  // Grimore does not like it when you run.
  const saveMover = c.mover
  c.mover = refOf(fig)
  fireTrigger(c, 'onEnemyMove', other(fig.owner))
  c.mover = saveMover
}

// ---------------------------------------------------------------------------
// Significator abilities
// ---------------------------------------------------------------------------

function doAbility(c: Ctx, target?: TargetRef) {
  const s = c.s
  const p = s.active
  const me = s.players[p]
  if (s.pending) throw new Error('resolve the pending choice first')
  const sig = significator(me.sigId)
  if (me.abilityUsed) throw new Error('ability already used this turn')
  if (availableSpark(me) < sig.abilityCost) throw new Error('not enough Spark')
  if (sig.abilityTarget !== 'none') {
    const legal = targetsFor(s, p, sig.abilityTarget, { fromAbility: true })
    if (!legal.some((t) => sameRef(t, target))) throw new Error('bad target')
  }
  paySpark(c, p, sig.abilityCost)
  me.abilityUsed = true
  emit(c, { kind: 'ability', player: p })
  c.owner = p
  c.self = undefined
  if (target?.kind === 'figure') {
    const tf = resolveRef(s, target)
    if (tf) target = refOf(tf)
  }
  c.chosen = target
  switch (sig.id) {
    case 'sig-daxon':
      runOps(c, [{ op: 'tempBuff', to: 'chosen', atk: 2 }])
      break
    case 'sig-lirielle':
      runOps(c, [{ op: 'read', n: 3 }])
      break
    case 'sig-luigi': {
      const fig = resolveRef(s, target)
      const n = fig && fig.face === 'reversed' ? 2 : 1
      runOps(c, [{ op: 'damage', to: 'chosen', n }])
      break
    }
    case 'sig-rorik':
      runOps(c, [{ op: 'heal', to: 'chosen', n: 3 }])
      break
    case 'sig-masque':
      runOps(c, [{ op: 'setFace', to: 'chosen', face: 'upright' }, { op: 'grant', to: 'chosen', kw: 'fixed' }])
      break
    case 'sig-shazz':
      runOps(c, [{ op: 'flip', to: 'chosen' }])
      break
  }
  checkDeaths(c)
  checkGameOver(c)
}

// ---------------------------------------------------------------------------
// Pending choices (Read)
// ---------------------------------------------------------------------------

function doChoose(c: Ctx, uid: number) {
  const s = c.s
  const pend = s.pending
  if (!pend) throw new Error('nothing to choose')
  const me = s.players[pend.player]
  const chosen = pend.options.find((o) => o.uid === uid)
  if (!chosen) throw new Error('not an option')
  s.pending = null
  if (me.hand.length < MAX_HAND) {
    me.hand.push(chosen)
    emit(c, { kind: 'draw', player: pend.player, uid: chosen.uid, defId: chosen.defId })
  } else {
    me.graveyard.push(chosen)
  }
  for (const o of pend.options) if (o.uid !== uid) me.deck.push(o)
  log(c, `The rest go to the bottom of the deck.`)
}

// ---------------------------------------------------------------------------
// Damage, healing, death
// ---------------------------------------------------------------------------

function dealDamage(c: Ctx, target: TargetRef, n: number, source?: FigureInstance) {
  const s = c.s
  if (n <= 0) return
  if (target.kind === 'sig') {
    s.players[target.player].health -= n
    emit(c, { kind: 'damage', target, n })
    if (source && hasKw(s, source, 'feast')) heal(c, sigRef(source.owner), n)
    checkGameOver(c)
    return
  }
  const fig = resolveRef(s, target)
  if (!fig) return
  if (fig.aegis) {
    fig.aegis = false
    emit(c, { kind: 'damage', target, n: 0, absorbed: true })
    return
  }
  const reduced = Math.max(0, n - damageReduction(s, fig))
  if (reduced <= 0) {
    emit(c, { kind: 'damage', target, n: 0, absorbed: true })
    return
  }
  fig.damage += reduced
  emit(c, { kind: 'damage', target, n: reduced })
  if (source && hasKw(s, source, 'feast')) heal(c, sigRef(source.owner), reduced)
}

function heal(c: Ctx, target: TargetRef, n: number) {
  const s = c.s
  if (n <= 0) return
  if (target.kind === 'sig') {
    const pl = s.players[target.player]
    const before = pl.health
    pl.health = Math.min(pl.maxHealth, pl.health + n)
    if (pl.health > before) emit(c, { kind: 'heal', target, n: pl.health - before })
    return
  }
  const fig = resolveRef(s, target)
  if (!fig) return
  const before = fig.damage
  fig.damage = Math.max(0, fig.damage - n)
  if (fig.damage < before) emit(c, { kind: 'heal', target, n: before - fig.damage })
}

function flip(c: Ctx, fig: FigureInstance, force = false) {
  const s = c.s
  if (!force && hasKw(s, fig, 'fixed')) return
  fig.face = fig.face === 'upright' ? 'reversed' : 'upright'
  emit(c, { kind: 'flip', target: refOf(fig), face: fig.face })
  if (healthOf(s, fig) <= 0) {
    // Wounds are checked the moment the face turns. A Figure that dies here never fires its flip triggers.
    checkDeaths(c)
    return
  }
  const saveFlipped = c.flipped
  const saveSelf = c.self
  c.flipped = refOf(fig)
  c.self = fig
  runEffects(c, fig, 'onFlipped')
  fireTrigger(c, 'onAnyFlip', 0)
  fireTrigger(c, 'onAnyFlip', 1)
  fireTrigger(c, 'onEnemyFlip', other(fig.owner))
  c.flipped = saveFlipped
  c.self = saveSelf
}

function setFace(c: Ctx, fig: FigureInstance, face: Face) {
  if (fig.face !== face) flip(c, fig)
}

function hush(c: Ctx, fig: FigureInstance) {
  fig.hushed = true
  fig.grantedKw = []
  emit(c, { kind: 'hush', target: refOf(fig) })
}

function detonate(c: Ctx, fig: FigureInstance) {
  // Dies with no Last Rite.
  const s = c.s
  const me = s.players[fig.owner]
  if (me.lanes[fig.lane]?.uid !== fig.uid) return
  me.lanes[fig.lane] = null
  me.graveyard.push({ uid: fig.uid, defId: fig.defId })
  emit(c, { kind: 'death', target: refOf(fig), defId: fig.defId, uid: fig.uid })
  afterDeath(c, fig)
}

function destroy(_c: Ctx, fig: FigureInstance) {
  fig.damage = 9999
}

function checkDeaths(c: Ctx) {
  const s = c.s
  if (c.depth > 12) return
  let any = true
  while (any) {
    any = false
    for (const p of [0, 1] as PlayerId[]) {
      for (const fig of figures(s, p)) {
        if (healthOf(s, fig) > 0) continue
        any = true
        const me = s.players[p]
        if (hasKw(s, fig, 'rekindle') && !fig.rekindled && fig.damage < 9000) {
          // Rekindle: come back Reversed with 1 Health.
          fig.rekindled = true
          fig.face = 'reversed'
          fig.damage = Math.max(0, maxHealthOf(s, fig) - 1)
          fig.removedKw = fig.removedKw.filter((k) => k !== 'veiled')
          emit(c, { kind: 'rekindle', target: refOf(fig) })
          c.self = fig
          runEffects(c, fig, 'onRekindle')
          continue
        }
        if (hasKw(s, fig, 'rekindle') && !fig.rekindled && fig.damage >= 9000) {
          // Destroyed outright still rekindles once. (Destruction is death.)
          fig.rekindled = true
          fig.face = 'reversed'
          fig.damage = Math.max(0, maxHealthOf(s, fig) - 1)
          emit(c, { kind: 'rekindle', target: refOf(fig) })
          c.self = fig
          runEffects(c, fig, 'onRekindle')
          continue
        }
        me.lanes[fig.lane] = null
        const isToken = card(fig.defId).token
        if (!isToken) me.graveyard.push({ uid: fig.uid, defId: fig.defId })
        emit(c, { kind: 'death', target: refOf(fig), defId: fig.defId, uid: fig.uid })
        c.depth += 1
        c.self = fig
        runEffects(c, fig, 'lastRite')
        afterDeath(c, fig)
        c.depth -= 1
      }
    }
  }
}

function afterDeath(c: Ctx, fig: FigureInstance) {
  if (c.s.active === fig.owner) c.s.players[fig.owner].friendlyDeathsThisTurn += 1
  fireTrigger(c, 'onAnyDeath', 0)
  fireTrigger(c, 'onAnyDeath', 1)
  fireTrigger(c, 'onFriendlyDeath', fig.owner)
}

function checkGameOver(c: Ctx) {
  const s = c.s
  if (s.phase === 'over') return
  const d0 = s.players[0].health <= 0
  const d1 = s.players[1].health <= 0
  if (!d0 && !d1) return
  s.phase = 'over'
  s.winner = d0 && d1 ? 'draw' : d0 ? 1 : 0
  emit(c, { kind: 'gameOver', winner: s.winner })
}

// Aegis carried as a keyword (a face, a Relic) or lent by an aura (Rorik) recharges at the
// start of its controller's turn. Granted Aegis (Dawn, Lovers, Soren) is one-shot.
function rechargeAegis(c: Ctx, p: PlayerId) {
  const s = c.s
  const sources = activeAuras(s, p).filter((a) => a.aura.kind === 'adjacentAegis').map((a) => a.source)
  for (const fig of figures(s, p)) {
    if (keywords(s, fig).includes('aegis')) fig.aegis = true
    if (sources.some((src) => src.uid !== fig.uid && Math.abs(src.lane - fig.lane) === 1)) fig.aegis = true
  }
}

// A Figure that has just entered: shield it if it carries Aegis or stands next to a source,
// and shield its neighbors if it is itself a source.
function chargeAegisAround(c: Ctx, fig: FigureInstance) {
  const s = c.s
  const sources = activeAuras(s, fig.owner).filter((a) => a.aura.kind === 'adjacentAegis').map((a) => a.source)
  if (keywords(s, fig).includes('aegis')) fig.aegis = true
  if (sources.some((src) => src.uid !== fig.uid && Math.abs(src.lane - fig.lane) === 1)) fig.aegis = true
  if (sources.some((src) => src.uid === fig.uid)) {
    for (const f of figures(s, fig.owner)) if (f.uid !== fig.uid && Math.abs(f.lane - fig.lane) === 1) f.aegis = true
  }
}

function figureNameOf(fig: FigureInstance): string {
  const def = card(fig.defId)
  return faceDef(def, fig.face).name ?? def.name
}

// ---------------------------------------------------------------------------
// Triggers and effects
// ---------------------------------------------------------------------------

function fireTrigger(c: Ctx, trigger: Trigger, p: PlayerId) {
  const s = c.s
  const saveSelf = c.self
  const saveOwner = c.owner
  for (const fig of figures(s, p).slice()) {
    if (s.players[p].lanes[fig.lane]?.uid !== fig.uid) continue
    c.self = fig
    c.owner = p
    runEffects(c, fig, trigger)
  }
  c.self = saveSelf
  c.owner = saveOwner
}

export function effectsOf(fig: FigureInstance, trigger: Trigger): EffectDef[] {
  const def = card(fig.defId)
  const out: EffectDef[] = []
  if (!fig.hushed) {
    for (const e of faceDef(def, fig.face).effects ?? []) if (e.trigger === trigger) out.push(e)
  }
  for (const r of fig.relics) {
    const rd = card(r.defId).relic
    if (!rd) continue
    const rf = r.face === 'upright' ? rd.upright : rd.reversed
    for (const e of rf.effects ?? []) if (e.trigger === trigger) out.push(e)
  }
  return out
}

function runEffects(c: Ctx, fig: FigureInstance, trigger: Trigger) {
  const effs = effectsOf(fig, trigger)
  if (!effs.length) return
  const saveSelf = c.self
  const saveOwner = c.owner
  c.self = fig
  c.owner = fig.owner
  for (const eff of effs) {
    if (eff.oncePerTurn) {
      const key = `${fig.uid}:${trigger}`
      if (fig.onceUsed.includes(key)) continue
      fig.onceUsed.push(key)
    }
    if (eff.when && !eff.when.every((w) => checkCondition(c, w))) continue
    runOps(c, eff.ops)
  }
  c.self = saveSelf
  c.owner = saveOwner
}

function checkCondition(c: Ctx, w: NonNullable<EffectDef['when']>[number]): boolean {
  const s = c.s
  switch (w.kind) {
    case 'face':
      return c.self?.face === w.face
    case 'moon':
      return moonPhase(s.round) === w.phase
    case 'oppositeExists':
      return !!(c.self && figAt(s, other(c.self.owner), c.self.lane))
    case 'handAtLeast':
      return s.players[c.owner].hand.length >= w.n
  }
}

function select(c: Ctx, sel: Selector): TargetRef[] {
  const s = c.s
  const me = c.owner
  const en = other(me)
  const self = c.self
  const mine = figures(s, me)
  const theirs = figures(s, en)
  switch (sel) {
    case 'self':
      return self ? [refOf(self)] : []
    case 'chosen':
      return c.chosen ? [c.chosen] : []
    case 'opposite': {
      if (!self) return []
      const f = figAt(s, en, self.lane)
      return f ? [refOf(f)] : []
    }
    case 'oppositeOfChosen': {
      const ch = resolveRef(s, c.chosen)
      if (!ch) return []
      const f = figAt(s, other(ch.owner), ch.lane)
      return f ? [refOf(f)] : []
    }
    case 'oppositeSig':
      return [sigRef(en)]
    case 'ownSig':
      return [sigRef(me)]
    case 'bothSigs':
      return [sigRef(0), sigRef(1)]
    case 'allEnemyFigures':
      return theirs.map(refOf)
    case 'allFriendlyFigures':
      return mine.map(refOf)
    case 'allOtherFriendlyFigures':
      return mine.filter((f) => f.uid !== self?.uid).map(refOf)
    case 'allFigures':
      return [...mine, ...theirs].map(refOf)
    case 'allOtherFigures':
      return [...mine, ...theirs].filter((f) => f.uid !== self?.uid).map(refOf)
    case 'adjacentFriendly':
      return self ? mine.filter((f) => Math.abs(f.lane - self.lane) === 1).map(refOf) : []
    case 'adjacentEnemy':
      return self ? theirs.filter((f) => Math.abs(f.lane - self.lane) === 1).map(refOf) : []
    case 'randomEnemyFigure': {
      const f = pick(c, theirs)
      return f ? [refOf(f)] : []
    }
    case 'randomFriendlyFigure': {
      const f = pick(c, mine)
      return f ? [refOf(f)] : []
    }
    case 'randomEnemyAny': {
      const opts: TargetRef[] = [...theirs.map(refOf), sigRef(en)]
      const t = pick(c, opts)
      return t ? [t] : []
    }
    case 'reversedEnemyFigures':
      return theirs.filter((f) => f.face === 'reversed').map(refOf)
    case 'reversedFigures':
      return [...mine, ...theirs].filter((f) => f.face === 'reversed').map(refOf)
    case 'uprightFigures':
      return [...mine, ...theirs].filter((f) => f.face === 'upright').map(refOf)
    case 'uprightEnemyFigures':
      return theirs.filter((f) => f.face === 'upright').map(refOf)
    case 'highestAttackFigure': {
      const all = [...theirs, ...mine] // enemy first on ties
      let best: FigureInstance | undefined
      for (const f of all) if (!best || attackOf(s, f) > attackOf(s, best)) best = f
      return best ? [refOf(best)] : []
    }
    case 'lowHealthOthers':
      return [...mine, ...theirs].filter((f) => f.uid !== self?.uid && healthOf(s, f) <= 3).map(refOf)
    case 'lowAttackEnemies':
      return theirs.filter((f) => attackOf(s, f) <= 3).map(refOf)
    case 'defender':
      return c.defender ? [c.defender] : []
    case 'mover':
      return c.mover ? [c.mover] : []
    case 'flipped':
      return c.flipped ? [c.flipped] : []
  }
}

function runOps(c: Ctx, ops: Op[]) {
  for (const op of ops) {
    if (c.s.phase === 'over') return
    runOp(c, op)
    checkDeaths(c)
  }
}

function runOp(c: Ctx, op: Op) {
  const s = c.s
  const me = c.owner
  const en = other(me)
  const self = c.self
  switch (op.op) {
    case 'damage':
      for (const t of select(c, op.to)) dealDamage(c, t, op.n, self)
      return
    case 'damagePerHand': {
      const n = s.players[me].hand.length
      for (const t of select(c, op.to)) dealDamage(c, t, n, self)
      return
    }
    case 'damageByAttack': {
      const src = op.source === 'self' ? self : resolveRef(s, c.chosen)
      if (!src) return
      const n = attackOf(s, src)
      for (const t of select(c, op.to)) dealDamage(c, t, n, self)
      return
    }
    case 'heal':
      for (const t of select(c, op.to)) heal(c, t, op.n)
      return
    case 'healFull':
      for (const t of select(c, op.to)) heal(c, t, 999)
      return
    case 'draw': {
      const who = op.who ?? 'self'
      const ps: PlayerId[] = who === 'self' ? [me] : who === 'enemy' ? [en] : [me, en]
      for (const p of ps) for (let i = 0; i < op.n; i++) drawCard(c, p)
      return
    }
    case 'drawUntil': {
      while (s.players[me].hand.length < op.n && s.players[me].deck.length > 0) drawCard(c, me)
      return
    }
    case 'discardRandom': {
      const ps: PlayerId[] = op.who === 'self' ? [me] : op.who === 'enemy' ? [en] : [me, en]
      for (const p of ps) {
        const pl = s.players[p]
        for (let i = 0; i < op.n && pl.hand.length > 0; i++) {
          const idx = Math.floor(rnd(c) * pl.hand.length)
          const [gone] = pl.hand.splice(idx, 1)
          pl.graveyard.push(gone)
          log(c, `${card(gone.defId).name} is discarded.`)
        }
      }
      return
    }
    case 'flip': {
      const targets = select(c, op.to)
      if (targets.length <= 1) {
        const f = resolveRef(s, targets[0])
        if (f) flip(c, f)
        return
      }
      // A global flip: every Figure turns at once, wounds are checked, then the survivors'
      // flip triggers fire in lane order (yours first). A Figure that died fires nothing.
      const turned: FigureInstance[] = []
      for (const t of targets) {
        const f = resolveRef(s, t)
        if (!f || hasKw(s, f, 'fixed')) continue
        f.face = f.face === 'upright' ? 'reversed' : 'upright'
        emit(c, { kind: 'flip', target: refOf(f), face: f.face })
        turned.push(f)
      }
      checkDeaths(c)
      for (const f of turned) {
        if (s.players[f.owner].lanes[f.lane]?.uid !== f.uid) continue
        const saveFlipped = c.flipped
        const saveSelf = c.self
        c.flipped = refOf(f)
        c.self = f
        runEffects(c, f, 'onFlipped')
        fireTrigger(c, 'onAnyFlip', 0)
        fireTrigger(c, 'onAnyFlip', 1)
        fireTrigger(c, 'onEnemyFlip', other(f.owner))
        c.flipped = saveFlipped
        c.self = saveSelf
      }
      return
    }
    case 'setFace':
      for (const t of select(c, op.to)) {
        const f = resolveRef(s, t)
        if (f) setFace(c, f, op.face)
      }
      return
    case 'buff':
      for (const t of select(c, op.to)) {
        const f = resolveRef(s, t)
        if (!f) continue
        f.permAtk += op.atk ?? 0
        f.permHp += op.hp ?? 0
        emit(c, { kind: 'buff', target: t, atk: op.atk ?? 0, hp: op.hp ?? 0 })
      }
      return
    case 'tempBuff':
      for (const t of select(c, op.to)) {
        const f = resolveRef(s, t)
        if (!f) continue
        f.tempAtk += op.atk ?? 0
        f.tempHp += op.hp ?? 0
        emit(c, { kind: 'buff', target: t, atk: op.atk ?? 0, hp: op.hp ?? 0 })
      }
      return
    case 'grant':
      for (const t of select(c, op.to)) {
        const f = resolveRef(s, t)
        if (!f) continue
        if (op.kw === 'aegis') f.aegis = true
        else if (!f.grantedKw.includes(op.kw)) f.grantedKw.push(op.kw)
        f.removedKw = f.removedKw.filter((k) => k !== op.kw)
        emit(c, { kind: 'buff', target: t, atk: 0, hp: 0 })
      }
      return
    case 'removeKw':
      for (const t of select(c, op.to)) {
        const f = resolveRef(s, t)
        if (!f) continue
        if (!f.removedKw.includes(op.kw)) f.removedKw.push(op.kw)
        emit(c, { kind: 'buff', target: t, atk: 0, hp: 0 })
      }
      return
    case 'hush':
      for (const t of select(c, op.to)) {
        const f = resolveRef(s, t)
        if (f) hush(c, f)
      }
      return
    case 'destroy':
      for (const t of select(c, op.to)) {
        const f = resolveRef(s, t)
        if (f) destroy(c, f)
      }
      checkDeaths(c)
      return
    case 'bounce':
      for (const t of select(c, op.to)) {
        const f = resolveRef(s, t)
        if (f) bounce(c, f)
      }
      return
    case 'summon': {
      const who: PlayerId = op.who === 'enemy' ? en : me
      const face: Face = op.face ?? 'upright'
      const lanesEmpty = emptyLanes(s, who)
      if (op.where === 'here') {
        if (self && s.players[who].lanes[self.lane] === null) summon(c, who, op.token, self.lane, face)
        else if (lanesEmpty.length) summon(c, who, op.token, lanesEmpty[0], face)
      } else if (op.where === 'adjacentEmpty') {
        const adj = self ? lanesEmpty.filter((l) => Math.abs(l - self.lane) === 1) : lanesEmpty
        const l = adj[0] ?? lanesEmpty[0]
        if (l !== undefined) summon(c, who, op.token, l, face)
      } else if (op.where === 'anyEmpty') {
        // Prefer the middle, then whatever's open.
        const order = ([1, 0, 2] as LaneIndex[]).filter((l) => lanesEmpty.includes(l))
        if (order.length) summon(c, who, op.token, order[0], face)
      } else if (op.where === 'allEmpty') {
        for (const l of lanesEmpty) summon(c, who, op.token, l, face)
      } else if (op.where === 'chosenLane') {
        const l = c.chosen?.lane
        if (l !== undefined && s.players[who].lanes[l] === null) summon(c, who, op.token, l, face)
      }
      return
    }
    case 'move':
      for (const t of select(c, op.to)) {
        const f = resolveRef(s, t)
        if (!f) continue
        const lanesEmpty = emptyLanes(s, f.owner)
        const options = op.where === 'adjacentEmpty' ? lanesEmpty.filter((l) => Math.abs(l - f.lane) === 1) : lanesEmpty
        if (!options.length) continue
        // Your own Figure goes toward Present when it can. An enemy Figure is pushed toward Past
        // when that lane is open, otherwise toward Future.
        const dest = f.owner === me ? (options.includes(1) ? 1 : options[0]) : options[0]
        moveFigure(c, f, dest, false)
      }
      return
    case 'spark':
      s.players[me].tempSpark += op.n
      emit(c, { kind: 'spark', player: me, n: op.n })
      return
    case 'maxSpark':
      s.players[me].maxSpark = Math.max(s.players[me].maxSpark, op.n)
      s.players[me].spark = Math.max(s.players[me].spark, op.n)
      emit(c, { kind: 'spark', player: me, n: op.n })
      return
    case 'read': {
      const pl = s.players[me]
      if (pl.deck.length === 0) return
      if (s.pending) {
        drawCard(c, me)
        return
      }
      const n = Math.min(op.n, pl.deck.length)
      if (n === 1) {
        drawCard(c, me)
        return
      }
      const options = pl.deck.splice(0, n)
      s.pending = { kind: 'read', player: me, options }
      emit(c, { kind: 'read', player: me, n })
      return
    }
    case 'revealHand':
      s.players[en].handRevealed = true
      emit(c, { kind: 'reveal', player: en })
      return
    case 'sleep':
      for (const t of select(c, op.to)) {
        const f = resolveRef(s, t)
        if (f) {
          f.asleep = true
          emit(c, { kind: 'buff', target: t, atk: 0, hp: 0 })
        }
      }
      return
    case 'costNext':
      s.players[me].costNextDiscount += op.n
      return
    case 'omenDiscount':
      s.players[me].omenDiscount += op.n
      return
    case 'boneMoon':
      s.boneMoonRound = Math.min(s.boneMoonRound, s.round + op.rounds)
      emit(c, { kind: 'boneMoon', round: s.boneMoonRound })
      return
    case 'balanceSigs': {
      const a = s.players[0].health
      const b = s.players[1].health
      const avg = Math.floor((a + b) / 2)
      s.players[0].health = avg
      s.players[1].health = avg
      emit(c, { kind: 'heal', target: sigRef(0), n: 0 })
      emit(c, { kind: 'heal', target: sigRef(1), n: 0 })
      log(c, `The scales level: both Significators sit at ${avg}.`)
      return
    }
    case 'sacrificeThenSummon': {
      const f = resolveRef(s, c.chosen)
      if (!f || f.owner !== me) return
      const lane = f.lane
      const pl = s.players[me]
      pl.lanes[lane] = null
      if (!card(f.defId).token) pl.graveyard.push({ uid: f.uid, defId: f.defId })
      emit(c, { kind: 'death', target: refOf(f), defId: f.defId, uid: f.uid })
      c.self = f
      runEffects(c, f, 'lastRite')
      afterDeath(c, f)
      c.self = undefined
      if (pl.lanes[lane] === null) summon(c, me, op.token, lane, 'upright')
      return
    }
    case 'graveToHand': {
      const pl = s.players[me]
      for (let i = pl.graveyard.length - 1; i >= 0; i--) {
        const g = pl.graveyard[i]
        if (card(g.defId).type !== 'figure') continue
        pl.graveyard.splice(i, 1)
        if (pl.hand.length < MAX_HAND) {
          pl.hand.push(g)
          emit(c, { kind: 'draw', player: me, uid: g.uid, defId: g.defId })
        }
        return
      }
      return
    }
    case 'stealRandom': {
      const theirs = s.players[en].hand
      if (!theirs.length) return
      const idx = Math.floor(rnd(c) * theirs.length)
      const [taken] = theirs.splice(idx, 1)
      if (s.players[me].hand.length < MAX_HAND) {
        s.players[me].hand.push(taken)
        emit(c, { kind: 'draw', player: me, uid: taken.uid, defId: taken.defId })
      } else s.players[en].graveyard.push(taken)
      log(c, `Taranis makes off with ${card(taken.defId).name}.`)
      return
    }
    case 'ransom': {
      const pl = s.players[en]
      if (pl.hand.length >= op.n) {
        for (let i = 0; i < op.n; i++) {
          const idx = Math.floor(rnd(c) * pl.hand.length)
          const [gone] = pl.hand.splice(idx, 1)
          pl.graveyard.push(gone)
          log(c, `${card(gone.defId).name} goes over the side.`)
        }
      } else {
        dealDamage(c, sigRef(en), op.dmg, self)
      }
      return
    }
    case 'die':
      if (self) destroy(c, self)
      checkDeaths(c)
      return
    case 'detonate':
      if (self) detonate(c, self)
      return
    case 'echoOmen':
    case 'counterOmenMark':
      return
  }
}

function bounce(c: Ctx, fig: FigureInstance) {
  const s = c.s
  const pl = s.players[fig.owner]
  if (pl.lanes[fig.lane]?.uid !== fig.uid) return
  pl.lanes[fig.lane] = null
  emit(c, { kind: 'bounce', target: refOf(fig), defId: fig.defId })
  if (card(fig.defId).token) return // tokens dissolve instead
  if (pl.hand.length < MAX_HAND) pl.hand.push({ uid: fig.uid, defId: fig.defId })
  else pl.graveyard.push({ uid: fig.uid, defId: fig.defId })
  // Relics fall off and are lost.
}

// ---------------------------------------------------------------------------
// Legal-action enumeration (for the UI hints and the AI)
// ---------------------------------------------------------------------------

export function legalActions(state: GameState): Action[] {
  const s = state
  if (s.phase === 'over') return []
  const p = s.active
  const me = s.players[p]
  const out: Action[] = []
  if (s.pending) {
    for (const o of s.pending.options) out.push({ type: 'choose', uid: o.uid })
    return out
  }
  for (const h of me.hand) {
    const def = card(h.defId)
    const cost = cardCost(s, p, def.id)
    if (availableSpark(me) < cost) continue
    for (const face of playableFaces(s, p, def.id)) {
      const fd = faceDef(def, face)
      if (def.type === 'figure') {
        const lanes = emptyLanes(s, p)
        if (!lanes.length) continue
        const targets = fd.target && fd.target !== 'none' ? targetsFor(s, p, fd.target, { pierceVeil: fd.pierceVeil }) : []
        for (const lane of lanes) {
          if (fd.target && fd.target !== 'none' && targets.length) {
            for (const t of targets) out.push({ type: 'play', uid: h.uid, face, lane, target: t })
          } else out.push({ type: 'play', uid: h.uid, face, lane })
        }
      } else if (def.type === 'relic') {
        for (const f of figures(s, p)) out.push({ type: 'play', uid: h.uid, face, target: refOf(f) })
      } else {
        if (fd.target && fd.target !== 'none') {
          const targets = targetsFor(s, p, fd.target, { fromOmen: true, pierceVeil: fd.pierceVeil })
          if (!targets.length) continue
          for (const t of targets) out.push({ type: 'play', uid: h.uid, face, target: t })
        } else out.push({ type: 'play', uid: h.uid, face })
      }
    }
  }
  for (const f of figures(s, p)) {
    if (canAttack(s, f)) {
      for (const tl of attackLanes(s, f)) out.push({ type: 'attack', lane: f.lane, targetLane: tl })
    }
    if (canMove(s, f)) {
      for (const to of [f.lane - 1, f.lane + 1] as LaneIndex[]) {
        if (to >= 0 && to <= 2 && me.lanes[to] === null) out.push({ type: 'move', lane: f.lane, to })
      }
    }
  }
  const sig = significator(me.sigId)
  if (!me.abilityUsed && availableSpark(me) >= sig.abilityCost) {
    if (sig.abilityTarget === 'none') out.push({ type: 'ability' })
    else for (const t of targetsFor(s, p, sig.abilityTarget, { fromAbility: true })) out.push({ type: 'ability', target: t })
  }
  out.push({ type: 'endTurn' })
  return out
}

// Re-export a few helpers the UI wants in one place.
export { keywords, attackOf, healthOf, maxHealthOf, cardCost, canAttack, canMove, attackLanes, resolveDefender, moonPhase, RULES }
