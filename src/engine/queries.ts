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
  return { kind: 'figure', player: fig.owner, lane: fig.lane }
}

export function sigRef(p: PlayerId): TargetRef {
  return { kind: 'sig', player: p }
}

export function resolveRef(state: GameState, ref: TargetRef | undefined): FigureInstance | null {
  if (!ref || ref.kind !== 'figure' || ref.lane === undefined) return null
  return figAt(state, ref.player, ref.lane)
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

export function targetsFor(state: GameState, p: PlayerId, spec: TargetSpec, opts?: { self?: FigureInstance; fromOmen?: boolean; fromAbility?: boolean }): TargetRef[] {
  const enemy = other(p)
  const out: TargetRef[] = []
  const enemyFigs = figures(state, enemy).filter((f) => {
    if (hasKw(state, f, 'veiled')) return false
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
