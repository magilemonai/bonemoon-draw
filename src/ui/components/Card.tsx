import { motion } from 'motion/react'
import type { CardDef, Face, Keyword, RelicInstance } from '../../engine/types'
import { rankLine } from '../../data'
import { card as cardDef } from '../../data'
import { Sigil } from '../sigils'

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

const KW_LABEL: Record<Keyword, string> = {
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
  const fd = which === 'upright' ? def.upright : def.reversed
  const active = which === props.face
  const stats = active && props.atk !== undefined ? { atk: props.atk, hp: props.hp ?? 0 } : printedStats(def, which)
  const printed = printedStats(def, which)
  const name = fd.name ?? def.name
  const kws = active && props.kws ? props.kws : (fd.keywords ?? []).filter((k) => k !== 'entersReversed')
  const showText = size === 'hand' || size === 'full'
  const rel = active ? props.relics ?? [] : []
  const cost = props.cost ?? def.cost

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
        </div>
        <div className="card-name">{name}</div>
        {size !== 'mini' && (
          <div className="card-text">
            {showText ? (
              <>
                <p>
                  <RulesText text={props.hushed && active ? 'Hushed.' : fd.text || '—'} />
                </p>
                {size === 'hand' && (
                  <div className="card-kws card-kws-hand">
                    {kws.map((k) => (
                      <span key={k} className={`kw kw-${k}`}>
                        {KW_LABEL[k]}
                      </span>
                    ))}
                    {kws.length === 0 && def.type === 'figure' && fd.effects?.length ? <span className="kw kw-type">Has an effect</span> : null}
                  </div>
                )}
              </>
            ) : (
              <div className="card-kws">
                {kws.map((k) => (
                  <span key={k} className={`kw kw-${k}`}>
                    {KW_LABEL[k]}
                  </span>
                ))}
                {rel.map((r) => (
                  <span key={r.uid} className="kw kw-relic" title={cardDef(r.defId).name}>
                    {cardDef(r.defId).name.split(':')[0]}
                  </span>
                ))}
              </div>
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
