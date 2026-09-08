import { motion } from 'motion/react'
import type { CardDef, Face, Keyword, RelicInstance } from '../../engine/types'
import { rankLine } from '../../data'
import { card as cardDef } from '../../data'
import { Sigil } from '../sigils'
import { ArtImage } from './ArtImage'
import { useStore } from '../store'
import { displayName, shortName } from '../names'

export { shortName }

export type CardSize = 'lane' | 'hand' | 'full' | 'mini'

export interface CardProps {
  def: CardDef
  face: Face
  size: CardSize
  atk?: number
  hp?: number
  maxHp?: number
  kws?: Keyword[]
  hushed?: boolean
  aegis?: boolean
  asleep?: boolean
  relics?: RelicInstance[]
  wounds?: number // damage carried; shown on table cards so flips can be read at a glance
  cost?: number
  selected?: boolean
  highlight?: 'target' | 'lane' | 'move' | 'none'
  dim?: boolean
  ready?: boolean
  layoutId?: string
  lunge?: number // px to lunge (negative = up)
  onClick?: () => void
  onInspect?: () => void
  showBothFaces?: boolean // codex / inspect
  className?: string
}

export const KW_LABEL: Record<Keyword, string> = {
  guard: 'Guard',
  windborne: 'Windborne',
  veiled: 'Veiled',
  fixed: 'Fixed',
  rekindle: 'Rekindle',
  feast: 'Feast',
  aegis: 'Aegis',
  gale: 'Gale',
  whisper: 'Whisper',
  entersReversed: 'Enters Reversed',
  dormant: 'Dormant',
}

// What each keyword does, in a line, for the key and for a screen reader.
export const KW_DEF: Record<Keyword, string> = {
  guard: 'Attacks aimed at your Significator from an adjacent empty lane hit this Figure instead.',
  windborne: 'Can attack the turn it arrives.',
  veiled: "Can't be targeted by the enemy's Omens or abilities until it attacks.",
  fixed: "Can't be flipped.",
  rekindle: 'The first time this would die, it returns Reversed with 1 Health.',
  feast: 'Damage this deals also heals your Significator.',
  aegis: 'Absorbs the next damage it would take.',
  gale: 'Can attack into any enemy lane.',
  whisper: 'Takes no damage back from Figures it attacks.',
  entersReversed: 'Enters the table Reversed.',
  dormant: "Can't attack.",
}

// The marks treatment: a letter or two for each keyword, with the word as its name.
export const KW_MARK: Record<Keyword, string> = {
  guard: 'G',
  windborne: 'W',
  veiled: 'V',
  fixed: 'F',
  rekindle: 'R',
  feast: 'Fe',
  aegis: 'A',
  gale: 'Ga',
  whisper: 'Wh',
  entersReversed: 'Rv',
  dormant: 'D',
}

// Renders **bold** spans in rules text.
export function RulesText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') ? (
          <b key={i}>{p.slice(2, -2)}</b>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

function printedStats(def: CardDef, face: Face) {
  if (def.type !== 'figure') return null
  const a = def.attack ?? 0
  const h = def.health ?? 0
  return face === 'upright' ? { atk: a, hp: h } : { atk: h, hp: a }
}

function FaceView(props: CardProps & { which: Face }) {
  const { def, which, size } = props
  const uiKit = useStore((s) => s.uiKit)
  const marksMode = useStore((s) => s.cardStyle) === 'marks'
  const openStatus = useStore((s) => s.openStatus)
  const fd = which === 'upright' ? def.upright : def.reversed
  const active = which === props.face
  const stats = active && props.atk !== undefined ? { atk: props.atk, hp: props.hp ?? 0 } : printedStats(def, which)
  const printed = printedStats(def, which)
  const compact = size === 'hand' || size === 'lane' || size === 'mini'
  const name = compact ? displayName(fd.name ?? def.name) : fd.name ?? def.name
  const kws = active && props.kws ? props.kws : (fd.keywords ?? []).filter((k) => k !== 'entersReversed')
  const showText = size === 'hand' || size === 'full'
  const rel = active ? props.relics ?? [] : []
  const cost = props.cost ?? def.cost
  // In the marks treatment a compact card's keywords ride the painting's lower edge.
  const marksOnArt = marksMode && compact && size !== 'mini'
  // On a table card each keyword is a control: it opens the key, and never selects the card.
  const kwRow = (cls: string) => (
    <div className={`card-kws ${cls}`}>
      {kws.map((k) =>
        size === 'lane' ? (
          <button
            key={k}
            type="button"
            className={`kw kw-${k}`}
            data-mark={KW_MARK[k]}
            aria-label={`${KW_LABEL[k]}: ${KW_DEF[k]}`}
            title={KW_DEF[k]}
            onClick={(e) => {
              e.stopPropagation()
              openStatus()
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {KW_LABEL[k]}
          </button>
        ) : (
          <span key={k} className={`kw kw-${k}`} data-mark={KW_MARK[k]} title={KW_DEF[k]}>
            {KW_LABEL[k]}
          </span>
        ),
      )}
      {size === 'lane' &&
        rel.map((r) => (
          <span key={r.uid} className="kw kw-relic" data-mark="+" title={cardDef(r.defId).name}>
            {cardDef(r.defId).name.split(':')[0]}
          </span>
        ))}
    </div>
  )

  return (
    <div className={`card-face face-${which} ${active ? 'is-active' : ''}`}>
      <div className="card-inner">
        <div className="card-top">
          <span className="card-cost" title="Spark cost">
            {cost}
          </span>
          <span className="card-rank">{rankLine(def)}</span>
        </div>
        <div className="card-art">
          <Sigil def={def} face={which} />
          {which === 'reversed' && <span className="card-reversed-mark" aria-label="Reversed" />}
          {props.hushed && active && <span className="card-state card-state-hushed">Hushed</span>}
          {props.asleep && active && <span className="card-state card-state-asleep">Asleep</span>}
          {props.aegis && active && <span className="card-aegis" title="Aegis" />}
          {marksOnArt && kwRow('card-kws-art')}
          {active && size === 'lane' && (props.wounds ?? 0) > 0 && (
            <span className="card-wounds" title={`${props.wounds} wound${props.wounds === 1 ? '' : 's'}: kept through a flip`}>
              {props.wounds} wound{props.wounds === 1 ? '' : 's'}
            </span>
          )}
        </div>
        <div className="card-name">{name}</div>
        {size !== 'mini' && (
          <div className="card-text">
            {showText ? (
              <>
                <p>
                  <RulesText text={props.hushed && active ? 'Hushed.' : fd.text || '—'} />
                </p>
                {size === 'hand' && !marksOnArt && kwRow('card-kws-hand')}
              </>
            ) : (
              !marksOnArt && kwRow('')
            )}
            {showText && rel.length > 0 && (
              <div className="card-kws">
                {rel.map((r) => (
                  <span key={r.uid} className="kw kw-relic">
                    {cardDef(r.defId).name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        {size === 'full' && <div className="card-flavor">{def.flavor}</div>}
        {stats && (
          <>
            <span className={`card-stat card-atk ${printed && stats.atk > printed.atk ? 'is-buffed' : ''}`}>{stats.atk}</span>
            <span className={`card-stat card-hp ${props.maxHp !== undefined && stats.hp < props.maxHp ? 'is-hurt' : printed && stats.hp > printed.hp ? 'is-buffed' : ''}`}>
              {stats.hp}
            </span>
          </>
        )}
        {def.type !== 'figure' && <span className="card-type">{def.type === 'omen' ? 'Omen' : 'Relic'}</span>}
        {uiKit && size !== 'mini' && <ArtImage id={`ui/frame-${which === 'reversed' ? 'dusk' : def.suit}`} ext="png" className="card-frame-art" />}
      </div>
    </div>
  )
}

export function Card(props: CardProps) {
  const { def, face, size, selected, highlight = 'none', dim, ready, layoutId, lunge, onClick, className } = props
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  return (
    <motion.div
      layoutId={layoutId}
      layout={!!layoutId}
      className={`card size-${size} suit-${def.suit} ${selected ? 'is-selected' : ''} hl-${highlight} ${dim ? 'is-dim' : ''} ${ready ? 'is-ready' : ''} ${className ?? ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      animate={{ y: lunge ?? 0, scale: lunge ? 1.06 : 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
      initial={false}
    >
      <motion.div
        className="card-flip"
        animate={{ rotateY: face === 'reversed' ? 180 : 0 }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 18 }}
        initial={false}
      >
        <FaceView {...props} which="upright" />
        <FaceView {...props} which="reversed" />
      </motion.div>
      {props.onInspect && (
        <button
          type="button"
          className="card-inspect"
          aria-label={`Inspect ${def.name}`}
          onClick={(e) => {
            e.stopPropagation()
            props.onInspect?.()
          }}
        >
          i
        </button>
      )}
    </motion.div>
  )
}

// Two faces side by side, for inspecting and the codex.
export function CardSpread({ def, cost }: { def: CardDef; cost?: number }) {
  return (
    <div className="card-spread">
      <div className="card-spread-col">
        <div className="card-spread-label">Upright</div>
        <Card def={def} face="upright" size="full" cost={cost} />
      </div>
      <div className="card-spread-col">
        <div className="card-spread-label">Reversed</div>
        <Card def={def} face="reversed" size="full" cost={cost} />
      </div>
    </div>
  )
}
