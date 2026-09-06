// Core types for The Bonemoon Draw.
// Every card has two faces. Upright is the Spark reading; Reversed is the Dusk reading.

export type Suit = 'suns' | 'antlers' | 'tides' | 'gears' | 'major'
export type CardType = 'figure' | 'omen' | 'relic'
export type Face = 'upright' | 'reversed'
export type PlayerId = 0 | 1
export type LaneIndex = 0 | 1 | 2

export const LANE_NAMES = ['Past', 'Present', 'Future'] as const

export type Keyword =
  | 'guard' // redirects attacks aimed at your Significator from adjacent lanes
  | 'windborne' // may attack the turn it is played
  | 'veiled' // can't be targeted by enemy Omens or abilities until it attacks
  | 'fixed' // can't be flipped
  | 'rekindle' // first death: return Reversed with 1 Health
  | 'feast' // damage this deals heals your Significator
  | 'aegis' // absorbs the next damage instance
  | 'gale' // may attack any enemy lane
  | 'whisper' // takes no damage back from Figures it attacks
  | 'entersReversed' // may only be played Reversed
  | 'dormant' // can't attack

export type Subtype = 'Mortal' | 'Spirit' | 'Machina' | 'Tamori' | 'Shadow' | 'Fae' | 'Beast'

// ---- Targeting -------------------------------------------------------------

export type TargetSpec =
  | 'none'
  | 'enemyFigure'
  | 'friendlyFigure'
  | 'anyFigure'
  | 'enemyAny' // enemy figure or enemy significator
  | 'friendlyAny'
  | 'any'
  | 'friendlyFigureOther' // another friendly figure (not self)

export interface TargetRef {
  kind: 'figure' | 'sig'
  player: PlayerId
  lane?: LaneIndex
  uid?: number // when present, the ref means this exact Figure; a different Figure in the lane does not match
}

// ---- Effect language -------------------------------------------------------

export type Selector =
  | 'self'
  | 'chosen'
  | 'opposite' // enemy figure opposite this one
  | 'oppositeSig' // enemy significator
  | 'ownSig'
  | 'allEnemyFigures'
  | 'allFriendlyFigures'
  | 'allOtherFriendlyFigures'
  | 'allFigures'
  | 'allOtherFigures'
  | 'adjacentFriendly'
  | 'adjacentEnemy'
  | 'randomEnemyFigure'
  | 'randomFriendlyFigure'
  | 'randomEnemyAny'
  | 'reversedEnemyFigures'
  | 'reversedFigures'
  | 'uprightFigures'
  | 'uprightEnemyFigures'
  | 'highestAttackFigure'
  | 'lowHealthOthers' // all other figures with 3 or less health
  | 'lowAttackEnemies' // enemy figures with 3 or less attack
  | 'bothSigs'
  | 'oppositeOfChosen' // enemy figure opposite the chosen friendly figure
  | 'defender' // the figure this one is attacking (onAttack / afterAttack)
  | 'mover' // the figure that just moved (onEnemyMove)
  | 'flipped' // the figure that was just flipped (onEnemyFlip / onAnyFlip)

export type Condition =
  | { kind: 'face'; face: Face }
  | { kind: 'moon'; phase: MoonPhase }
  | { kind: 'oppositeExists' }
  | { kind: 'handAtLeast'; n: number }

export type Op =
  | { op: 'damage'; to: Selector; n: number }
  | { op: 'damagePerHand'; to: Selector } // 1 damage per card in your hand
  | { op: 'damageByAttack'; to: Selector; source: 'self' | 'chosen' } // damage equal to a figure's attack
  | { op: 'stealRandom' } // take a random card from the enemy hand
  | { op: 'ransom'; n: number; dmg: number } // enemy discards n random cards, or takes dmg if they can't
  | { op: 'echoOmen' } // Mordeaux: repeat the omen just cast
  | { op: 'heal'; to: Selector; n: number }
  | { op: 'healFull'; to: Selector }
  | { op: 'draw'; n: number; who?: 'self' | 'enemy' | 'both' }
  | { op: 'drawUntil'; n: number }
  | { op: 'discardRandom'; n: number; who: 'self' | 'enemy' | 'both' }
  | { op: 'flip'; to: Selector }
  | { op: 'setFace'; to: Selector; face: Face }
  | { op: 'buff'; to: Selector; atk?: number; hp?: number }
  | { op: 'tempBuff'; to: Selector; atk?: number; hp?: number } // until end of turn
  | { op: 'grant'; to: Selector; kw: Keyword }
  | { op: 'removeKw'; to: Selector; kw: Keyword }
  | { op: 'hush'; to: Selector }
  | { op: 'destroy'; to: Selector }
  | { op: 'bounce'; to: Selector } // return to owner's hand
  | { op: 'summon'; token: string; where: 'here' | 'adjacentEmpty' | 'anyEmpty' | 'allEmpty' | 'chosenLane'; face?: Face; who?: 'self' | 'enemy' }
  | { op: 'move'; to: Selector; where: 'adjacentEmpty' | 'anyEmpty' }
  | { op: 'spark'; n: number } // this turn only
  | { op: 'maxSpark'; n: number }
  | { op: 'read'; n: number }
  | { op: 'revealHand' }
  | { op: 'sleep'; to: Selector } // can't attack next turn
  | { op: 'costNext'; n: number } // next card this turn costs n less
  | { op: 'omenDiscount'; n: number } // next omen this turn costs n less
  | { op: 'boneMoon'; rounds: number } // rises sooner (0 = now)
  | { op: 'balanceSigs' }
  | { op: 'sacrificeThenSummon'; token: string } // Lovers reversed
  | { op: 'graveToHand' }
  | { op: 'die' } // this figure dies
  | { op: 'detonate' } // this figure dies with no Last Rite
  | { op: 'counterOmenMark' } // marks figure as an active counterspell (handled in engine)

export type Trigger =
  | 'arrive' // when played
  | 'cast' // omen resolution
  | 'attach' // relic attached
  | 'lastRite' // when this dies
  | 'startTurn' // start of controller's turn
  | 'endTurn' // end of controller's turn
  | 'onAttack' // when this attacks (before damage)
  | 'afterAttack'
  | 'onFlipped' // when this is flipped
  | 'onAnyFlip' // whenever any figure is flipped
  | 'onEnemyFlip' // whenever an enemy figure is flipped
  | 'onAnyDeath'
  | 'onFriendlyDeath'
  | 'onRekindle'
  | 'onEnemyOmen'
  | 'onFriendlyOmen'
  | 'onEnemyRelic'
  | 'onEnemyMove'
  | 'onEnemyPlay'
  | 'onRelicAttached' // a relic attached to this
  | 'onDamageDealt' // this dealt damage to a figure
  | 'onKill'

export interface EffectDef {
  trigger: Trigger
  when?: Condition[]
  ops: Op[]
  oncePerTurn?: boolean
}

// Auras: static, recomputed each time the board changes.
export type AuraDef =
  | { kind: 'stats'; to: 'allOtherFriendlyFigures' | 'adjacentFriendly' | 'allFriendlyFigures' | 'reversedFriendly' | 'uprightFriendly'; atk?: number; hp?: number }
  | { kind: 'enemyOmenCost'; n: number }
  | { kind: 'omenCost'; n: number } // your omens
  | { kind: 'relicCost'; n: number }
  | { kind: 'friendlyFixed' } // all friendly figures are fixed
  | { kind: 'adjacentAegis' }
  | { kind: 'adjacentDamageReduction'; n: number }
  | { kind: 'adjacentUntargetable' }
  | { kind: 'counterOmens' } // Mr. Zero
  | { kind: 'enemyEntersReversed' } // Spirit of Pride
  | { kind: 'enemyNoVeil' }
  | { kind: 'moveAndAttack' } // may move and attack in the same turn

export interface FaceDef {
  name?: string // a face can rename the card (Lorien of the Hand / Lorien Shadowblade)
  text: string // rules text shown to the player
  keywords?: Keyword[]
  effects?: EffectDef[]
  auras?: AuraDef[]
  target?: TargetSpec // what the player must choose when playing this face
  pierceVeil?: boolean // this face's targeting ignores Veiled (Yvette's jailbroken Knock)
}

export interface RelicDef {
  atk: number
  hp: number
  keywords?: Keyword[]
  effects?: EffectDef[] // attached to the holder
  auras?: AuraDef[]
}

export interface CardDef {
  id: string
  name: string
  suit: Suit
  rank: string // 'ace', '2'..'10', 'page', 'knight', 'queen', 'king', or '0'..'21' for majors
  numeral?: string // roman numeral for majors
  type: CardType
  subtype?: Subtype
  cost: number
  attack?: number // printed upright attack (figures)
  health?: number // printed upright health (figures)
  upright: FaceDef
  reversed: FaceDef
  relic?: { upright: RelicDef; reversed: RelicDef }
  flavor: string
  art: string // prompt for image generation
  token?: boolean
  unique?: boolean // major arcana: one copy per deck
}

export interface SignificatorDef {
  id: string
  name: string
  title: string // e.g. "The Fool"
  numeral: string
  cardId: string // the major arcana this corresponds to (excluded from that player's deck)
  health: number
  passive: string
  abilityName: string
  abilityText: string
  abilityCost: number
  abilityTarget: TargetSpec
  suits: [Suit, Suit]
  deckName: string
  deck: string[] // card ids (30)
  flavor: string
  art: string
}

// ---- Runtime state ---------------------------------------------------------

export interface CardInstance {
  uid: number
  defId: string
}

export interface RelicInstance {
  uid: number
  defId: string
  face: Face
}

export interface FigureInstance {
  uid: number
  defId: string
  owner: PlayerId
  lane: LaneIndex
  face: Face
  damage: number
  permAtk: number
  permHp: number
  tempAtk: number
  tempHp: number
  grantedKw: Keyword[]
  removedKw: Keyword[]
  hushed: boolean
  aegis: boolean
  rekindled: boolean
  asleep: boolean // can't attack next turn
  summonedTurn: number // global turn counter when this entered play
  attacksThisTurn: number
  movedThisTurn: boolean
  onceUsed: string[] // effect keys already used this turn
  relics: RelicInstance[]
}

export interface PlayerState {
  id: PlayerId
  sigId: string
  health: number
  maxHealth: number
  spark: number
  maxSpark: number
  tempSpark: number
  deck: CardInstance[]
  hand: CardInstance[]
  lanes: (FigureInstance | null)[]
  graveyard: CardInstance[]
  fatigue: number
  abilityUsed: boolean
  costNextDiscount: number
  omenDiscount: number
  handRevealed: boolean
  omensCastThisTurn: number
  friendlyDeathsThisTurn: number // own Figures that died during this player's own turn
  burnsThisGame: number
}

export type MoonPhase = 'new' | 'waxing' | 'full' | 'waning'

export interface PendingChoice {
  kind: 'read'
  player: PlayerId
  options: CardInstance[]
}

export interface GameState {
  players: [PlayerState, PlayerState]
  active: PlayerId
  round: number
  turn: number
  boneMoonRound: number
  phase: 'main' | 'over'
  winner: PlayerId | 'draw' | null
  seed: number
  nextUid: number
  pending: PendingChoice | null
  humanPlayer: PlayerId
}

// ---- Actions ---------------------------------------------------------------

export type Action =
  | { type: 'play'; uid: number; face: Face; lane?: LaneIndex; target?: TargetRef }
  | { type: 'attack'; lane: LaneIndex; targetLane?: LaneIndex }
  | { type: 'move'; lane: LaneIndex; to: LaneIndex }
  | { type: 'ability'; target?: TargetRef }
  | { type: 'choose'; uid: number } // resolve a pending Read
  | { type: 'endTurn' }

// ---- Events (drive the animations) -----------------------------------------

export type GameEvent =
  | { kind: 'turnStart'; player: PlayerId; round: number; moon: MoonPhase }
  | { kind: 'draw'; player: PlayerId; uid: number; defId: string }
  | { kind: 'fatigue'; player: PlayerId; n: number }
  | { kind: 'burn'; player: PlayerId; defId: string }
  | { kind: 'played'; player: PlayerId; uid: number; defId: string; face: Face; lane?: LaneIndex; cardType: CardType }
  | { kind: 'summon'; player: PlayerId; uid: number; defId: string; lane: LaneIndex; face: Face }
  | { kind: 'attackStart'; attacker: TargetRef; defender: TargetRef }
  | { kind: 'damage'; target: TargetRef; n: number; absorbed?: boolean }
  | { kind: 'heal'; target: TargetRef; n: number }
  | { kind: 'flip'; target: TargetRef; face: Face }
  | { kind: 'death'; target: TargetRef; defId: string; uid: number }
  | { kind: 'rekindle'; target: TargetRef }
  | { kind: 'bounce'; target: TargetRef; defId: string }
  | { kind: 'move'; from: TargetRef; to: LaneIndex }
  | { kind: 'hush'; target: TargetRef }
  | { kind: 'buff'; target: TargetRef; atk: number; hp: number }
  | { kind: 'spark'; player: PlayerId; n: number }
  | { kind: 'ability'; player: PlayerId }
  | { kind: 'omen'; player: PlayerId; defId: string; face: Face; target?: TargetRef }
  | { kind: 'countered'; player: PlayerId; defId: string }
  | { kind: 'read'; player: PlayerId; n: number }
  | { kind: 'boneMoon'; round: number }
  | { kind: 'boneMoonBite'; player: PlayerId; n: number }
  | { kind: 'reveal'; player: PlayerId }
  | { kind: 'log'; text: string }
  | { kind: 'gameOver'; winner: PlayerId | 'draw' }

export interface Step {
  ev: GameEvent
  state: GameState
}
