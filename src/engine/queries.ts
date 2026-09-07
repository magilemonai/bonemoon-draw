// Read-only helpers over GameState. Used by the engine, the UI, and the AI.
import { card, significator } from '../data'
import type {
  AuraDef,
  CardDef,
  Face,
  FaceDef,
  FigureInstance,
  GameState,
  Keyword,
  LaneIndex,
  MoonPhase,
  PlayerId,
  PlayerState,
  TargetRef,
  TargetSpec,
} from './types'

export const other = (p: PlayerId): PlayerId => (p === 0 ? 1 : 0)

export function faceDef(def: CardDef, face: Face): FaceDef {
  return face === 'upright' ? def.upright : def.reversed
}

export function figureName(fig: FigureInstance): string {
  const def = card(fig.defId)
  const f = faceDef(def, fig.face)
  return f.name ?? def.name
}

export function figures(state: GameState, p: PlayerId): FigureInstance[] {
  return state.players[p].lanes.filter((f): f is FigureInstance => f !== null)
}

export function allFigures(state: GameState): FigureInstance[] {
  return [...figures(state, 0), ...figures(state, 1)]
}

export function figAt(state: GameState, p: PlayerId, lane: LaneIndex): FigureInstance | null {
  return state.players[p].lanes[lane]
}

export function refOf(fig: FigureInstance): TargetRef {
  return { kind: 'figure', player: fig.owner, lane: fig.lane, uid: fig.uid }
}

export function sigRef(p: PlayerId): TargetRef {
  return { kind: 'sig', player: p }
}

export function resolveRef(state: GameState, ref: TargetRef | undefined): FigureInstance | null {
  if (!ref || ref.kind !== 'figure' || ref.lane === undefined) return null
  const f = figAt(state, ref.player, ref.lane)
  if (!f) return null
  if (ref.uid !== undefined && f.uid !== ref.uid) return null // the Figure that was meant has left this lane
  return f
}

// ---- Auras ------------------------------------------------------------------

export interface ActiveAura {
  aura: AuraDef
  source: FigureInstance
}

export function activeAuras(state: GameState, p: PlayerId): ActiveAura[] {
  const out: ActiveAura[] = []
  for (const fig of figures(state, p)) {
    const def = card(fig.defId)
    if (!fig.hushed) {
      for (const a of faceDef(def, fig.face).auras ?? []) out.push({ aura: a, source: fig })
    }
    for (const r of fig.relics) {
      const rd = card(r.defId).relic
      if (!rd) continue
      const rf = r.face === 'upright' ? rd.upright : rd.reversed
      for (const a of rf.auras ?? []) out.push({ aura: a, source: fig })
    }
  }
  return out
}

function adjacent(a: LaneIndex, b: LaneIndex): boolean {
  return Math.abs(a - b) === 1
}

// ---- Stats ------------------------------------------------------------------

export function baseStats(fig: FigureInstance): { atk: number; hp: number } {
  const def = card(fig.defId)
  const a = def.attack ?? 0
  const h = def.health ?? 0
  return fig.face === 'upright' ? { atk: a, hp: h } : { atk: h, hp: a }
}

export function keywords(state: GameState, fig: FigureInstance): Keyword[] {
  const def = card(fig.defId)
  const set = new Set<Keyword>()
  if (!fig.hushed) {
    for (const k of faceDef(def, fig.face).keywords ?? []) set.add(k)
    for (const k of fig.grantedKw) set.add(k)
  }
  for (const r of fig.relics) {
    const rd = card(r.defId).relic
    if (!rd) continue
    const rf = r.face === 'upright' ? rd.upright : rd.reversed
    for (const k of rf.keywords ?? []) set.add(k)
  }
  for (const { aura } of activeAuras(state, fig.owner)) {
    if (aura.kind === 'friendlyFixed') set.add('fixed')
  }
  for (const k of fig.removedKw) set.delete(k)
  // entersReversed only matters at play time and is never a live keyword.
  set.delete('entersReversed')
  return [...set]
}

export function hasKw(state: GameState, fig: FigureInstance, kw: Keyword): boolean {
  return keywords(state, fig).includes(kw)
}

export function attackOf(state: GameState, fig: FigureInstance): number {
  let atk = baseStats(fig).atk + fig.permAtk + fig.tempAtk
  for (const r of fig.relics) {
    const rd = card(r.defId).relic
    if (!rd) continue
    atk += (r.face === 'upright' ? rd.upright : rd.reversed).atk
  }
  for (const { aura, source } of activeAuras(state, fig.owner)) {
    if (aura.kind !== 'stats' || !aura.atk) continue
    if (auraApplies(aura.to, source, fig)) atk += aura.atk
  }
  const sig = significator(state.players[fig.owner].sigId)
  if (sig.id === 'sig-shazz' && fig.face === 'reversed') atk += 1
  return Math.max(0, atk)
}

export function maxHealthOf(state: GameState, fig: FigureInstance): number {
  let hp = baseStats(fig).hp + fig.permHp + fig.tempHp
  for (const r of fig.relics) {
    const rd = card(r.defId).relic
    if (!rd) continue
    hp += (r.face === 'upright' ? rd.upright : rd.reversed).hp
  }
  for (const { aura, source } of activeAuras(state, fig.owner)) {
    if (aura.kind !== 'stats' || !aura.hp) continue
    if (auraApplies(aura.to, source, fig)) hp += aura.hp
  }
  const sig = significator(state.players[fig.owner].sigId)
  if (sig.id === 'sig-masque' && fig.face === 'upright') hp += 1
  return hp
}

export function healthOf(state: GameState, fig: FigureInstance): number {
  return maxHealthOf(state, fig) - fig.damage
}

function auraApplies(
  to: 'allOtherFriendlyFigures' | 'adjacentFriendly' | 'allFriendlyFigures' | 'reversedFriendly' | 'uprightFriendly',
  source: FigureInstance,
  fig: FigureInstance,
): boolean {
  switch (to) {
    case 'allFriendlyFigures':
      return true
    case 'allOtherFriendlyFigures':
      return source.uid !== fig.uid
    case 'adjacentFriendly':
      return source.uid !== fig.uid && adjacent(source.lane, fig.lane)
    case 'reversedFriendly':
      return fig.face === 'reversed'
    case 'uprightFriendly':
      return fig.face === 'upright'
  }
}

export function damageReduction(state: GameState, fig: FigureInstance): number {
  let n = 0
  for (const { aura, source } of activeAuras(state, fig.owner)) {
    if (aura.kind === 'adjacentDamageReduction' && source.uid !== fig.uid && adjacent(source.lane, fig.lane)) n += aura.n
  }
  return n
}

export function untargetableByEnemyOmens(state: GameState, fig: FigureInstance): boolean {
  for (const { aura, source } of activeAuras(state, fig.owner)) {
    if (aura.kind === 'adjacentUntargetable' && source.uid !== fig.uid && adjacent(source.lane, fig.lane)) return true
  }
  return false
}

export function hasAura(state: GameState, p: PlayerId, kind: AuraDef['kind']): boolean {
  return activeAuras(state, p).some((a) => a.aura.kind === kind)
}

export function holderHasAura(state: GameState, fig: FigureInstance, kind: AuraDef['kind']): boolean {
  return activeAuras(state, fig.owner).some((a) => a.aura.kind === kind && a.source.uid === fig.uid)
}

// ---- Costs ------------------------------------------------------------------

export function cardCost(state: GameState, p: PlayerId, defId: string): number {
  const def = card(defId)
  const me = state.players[p]
  let cost = def.cost
  if (def.type === 'omen') {
    for (const { aura } of activeAuras(state, other(p))) if (aura.kind === 'enemyOmenCost') cost += aura.n
    for (const { aura } of activeAuras(state, p)) if (aura.kind === 'omenCost') cost += aura.n
    cost -= me.omenDiscount
  }
  if (def.type === 'relic') {
    for (const { aura } of activeAuras(state, p)) if (aura.kind === 'relicCost') cost += aura.n
    if (significator(me.sigId).id === 'sig-daxon') cost -= 1
  }
  cost -= me.costNextDiscount
  return Math.max(0, cost)
}

export function availableSpark(pl: PlayerState): number {
  return pl.spark + pl.tempSpark
}

// ---- Moon -------------------------------------------------------------------

export function moonPhase(round: number): MoonPhase {
  const phases: MoonPhase[] = ['new', 'waxing', 'full', 'waning']
  return phases[(round - 1) % 4]
}

export function boneMoonRisen(state: GameState): boolean {
  return state.round >= state.boneMoonRound
}

// ---- Targeting --------------------------------------------------------------

export function targetsFor(state: GameState, p: PlayerId, spec: TargetSpec, opts?: { self?: FigureInstance; fromOmen?: boolean; fromAbility?: boolean; pierceVeil?: boolean }): TargetRef[] {
  const enemy = other(p)
  const out: TargetRef[] = []
  const enemyFigs = figures(state, enemy).filter((f) => {
    if (!opts?.pierceVeil && hasKw(state, f, 'veiled')) return false
    if (opts?.fromOmen && untargetableByEnemyOmens(state, f)) return false
    return true
  })
  const myFigs = figures(state, p)
  switch (spec) {
    case 'none':
      return []
    case 'enemyFigure':
      return enemyFigs.map(refOf)
    case 'friendlyFigure':
      return myFigs.map(refOf)
    case 'friendlyFigureOther':
      return myFigs.filter((f) => f.uid !== opts?.self?.uid).map(refOf)
    case 'anyFigure':
      return [...myFigs.map(refOf), ...enemyFigs.map(refOf)]
    case 'enemyAny':
      out.push(...enemyFigs.map(refOf), sigRef(enemy))
      return out
    case 'friendlyAny':
      out.push(...myFigs.map(refOf), sigRef(p))
      return out
    case 'any':
      out.push(...myFigs.map(refOf), ...enemyFigs.map(refOf), sigRef(p), sigRef(enemy))
      return out
  }
}

export function sameRef(a: TargetRef | undefined, b: TargetRef | undefined): boolean {
  if (!a || !b) return false
  return a.kind === b.kind && a.player === b.player && (a.kind === 'sig' || a.lane === b.lane)
}

// ---- Attack legality --------------------------------------------------------

export function canAttack(state: GameState, fig: FigureInstance): boolean {
  if (state.active !== fig.owner) return false
  if (state.pending) return false
  if (fig.attacksThisTurn > 0) return false
  if (fig.asleep) return false
  const kws = keywords(state, fig)
  if (kws.includes('dormant')) return false
  if (fig.summonedTurn === state.turn && !kws.includes('windborne')) return false
  if (fig.movedThisTurn && !holderHasAura(state, fig, 'moveAndAttack')) return false
  if (attackOf(state, fig) <= 0) return false
  return true
}

export function canMove(state: GameState, fig: FigureInstance): boolean {
  if (state.active !== fig.owner) return false
  if (state.pending) return false
  if (fig.movedThisTurn) return false
  if (fig.attacksThisTurn > 0 && !holderHasAura(state, fig, 'moveAndAttack')) return false
  const lanes = state.players[fig.owner].lanes
  return [fig.lane - 1, fig.lane + 1].some((l) => l >= 0 && l < 3 && lanes[l] === null)
}

// Which enemy lanes may this figure attack into? (Returns lanes; an empty lane means the Significator.)
export function attackLanes(state: GameState, fig: FigureInstance): LaneIndex[] {
  if (hasKw(state, fig, 'gale')) return [0, 1, 2]
  return [fig.lane]
}

// Resolve what an attack into `lane` actually hits, after Guard redirection.
export function resolveDefender(state: GameState, attacker: FigureInstance, lane: LaneIndex): TargetRef {
  const enemy = other(attacker.owner)
  const direct = figAt(state, enemy, lane)
  if (direct) return refOf(direct)
  // Empty lane: a Guard in an adjacent lane steps in.
  for (const l of [lane - 1, lane + 1]) {
    if (l < 0 || l > 2) continue
    const g = figAt(state, enemy, l as LaneIndex)
    if (g && hasKw(state, g, 'guard')) return refOf(g)
  }
  return sigRef(enemy)
}

export function isEmptyLane(state: GameState, p: PlayerId, lane: LaneIndex): boolean {
  return state.players[p].lanes[lane] === null
}

export function emptyLanes(state: GameState, p: PlayerId): LaneIndex[] {
  return ([0, 1, 2] as LaneIndex[]).filter((l) => isEmptyLane(state, p, l))
}

export function playableFaces(state: GameState, p: PlayerId, defId: string): Face[] {
  const def = card(defId)
  const forced =
    def.upright.keywords?.includes('entersReversed') ||
    def.reversed.keywords?.includes('entersReversed') ||
    (def.type === 'figure' && hasAura(state, other(p), 'enemyEntersReversed'))
  return forced ? ['reversed'] : ['upright', 'reversed']
}

// ---------------------------------------------------------------------------
// Previews for the interface. These mirror the engine's arithmetic so what a player
// reads before committing is what resolves. If dealDamage, doAttack, or the draw step
// in engine.ts changes, change these with it.
// ---------------------------------------------------------------------------

const MAX_HAND = 8 // mirrors engine.ts

export interface Stats {
  atk: number
  hp: number
}

// A Figure from hand as it would stand on this player's table right now: hero passive,
// Relics it would not yet have, and auras included. Uses the first empty lane, so an
// adjacency aura may differ if the player picks another lane.
export function previewPlay(state: GameState, p: PlayerId, defId: string, face: Face): (Stats & { lane: LaneIndex }) | null {
  const def = card(defId)
  if (def.type !== 'figure') return null
  const lane = emptyLanes(state, p)[0] ?? 1
  const s = structuredClone(state)
  const fig: FigureInstance = {
    uid: -1,
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
    summonedTurn: state.turn,
    attacksThisTurn: 0,
    movedThisTurn: false,
    onceUsed: [],
    relics: [],
  }
  s.players[p].lanes[lane] = fig
  return { atk: attackOf(s, fig), hp: healthOf(s, fig), lane }
}

export interface AttackPreview {
  defender: TargetRef
  intercepted: boolean // a Guard stepped in front of the Significator
  deals: number // what the defender takes after Aegis and damage reduction
  shielded: boolean // the defender's Aegis takes the blow
  takes: number // what the attacker takes back
  attackerShielded: boolean
  defenderDies: boolean
  defenderRekindles: boolean
  attackerDies: boolean
  attackerRekindles: boolean
  lethal: boolean // the Significator would fall
}

// The plain exchange of an attack into `lane`, before any onAttack or Last Rite text.
export function previewAttack(state: GameState, attacker: FigureInstance, lane: LaneIndex): AttackPreview {
  const defender = resolveDefender(state, attacker, lane)
  const power = attackOf(state, attacker)
  const base: AttackPreview = {
    defender,
    intercepted: false,
    deals: power,
    shielded: false,
    takes: 0,
    attackerShielded: false,
    defenderDies: false,
    defenderRekindles: false,
    attackerDies: false,
    attackerRekindles: false,
    lethal: false,
  }
  if (defender.kind === 'sig') return { ...base, lethal: power >= state.players[defender.player].health }
  const d = resolveRef(state, defender)
  if (!d) return base
  const shielded = d.aegis && power > 0
  const deals = shielded ? 0 : Math.max(0, power - damageReduction(state, d))
  const back = hasKw(state, attacker, 'whisper') ? 0 : attackOf(state, d)
  const attackerShielded = attacker.aegis && back > 0
  const takes = attackerShielded ? 0 : Math.max(0, back - damageReduction(state, attacker))
  const defenderDies = deals >= healthOf(state, d)
  const attackerDies = takes >= healthOf(state, attacker)
  return {
    ...base,
    intercepted: defender.lane !== lane,
    deals,
    shielded,
    takes,
    attackerShielded,
    defenderDies,
    defenderRekindles: defenderDies && hasKw(state, d, 'rekindle') && !d.rekindled,
    attackerDies,
    attackerRekindles: attackerDies && hasKw(state, attacker, 'rekindle') && !attacker.rekindled,
  }
}

// Why a Figure cannot attack right now, or null if it can.
export function whyNoAttack(state: GameState, fig: FigureInstance): string | null {
  if (canAttack(state, fig)) return null
  if (fig.attacksThisTurn > 0) return 'it has attacked already'
  if (fig.asleep) return 'it is asleep'
  const kws = keywords(state, fig)
  if (kws.includes('dormant')) return 'it is Dormant'
  if (fig.summonedTurn === state.turn && !kws.includes('windborne')) return 'it arrived this turn'
  if (fig.movedThisTurn) return 'it moved this turn'
  if (attackOf(state, fig) <= 0) return 'it has no Attack'
  return 'it cannot attack now'
}

// Why a Figure cannot move right now, or null if it can.
export function whyNoMove(state: GameState, fig: FigureInstance): string | null {
  if (canMove(state, fig)) return null
  if (fig.movedThisTurn) return 'it has moved already'
  if (fig.attacksThisTurn > 0) return 'it attacked this turn'
  return 'there is no empty lane beside it'
}

export interface DrawForecast {
  round: number
  phase: MoonPhase
  draws: number
  burns: number // cards that would burn at the current hand size
  short: number // draws the deck cannot supply
}

// The next time this player starts a turn: the round, the moon, how many cards come,
// and how many would burn if the hand stays this size.
export function drawForecast(state: GameState, p: PlayerId): DrawForecast {
  const me = state.players[p]
  const round = state.active === p || state.turn % 2 === 0 ? state.round + 1 : state.round
  const phase = moonPhase(round)
  let draws = 1
  if (phase === 'full') {
    draws += 1
    if (me.sigId === 'sig-lirielle') draws += 1
  }
  const fromDeck = Math.min(draws, me.deck.length)
  return { round, phase, draws, burns: Math.max(0, me.hand.length + fromDeck - MAX_HAND), short: draws - fromDeck }
}
