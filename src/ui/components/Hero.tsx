import { useState } from 'react'
import { motion } from 'motion/react'
import type { CardDef, Face } from '../../engine/types'
import { rankLine } from '../../data'
import { Sigil } from '../sigils'
import { RulesText } from './Card'

// The painting, large. Square, with the Reversed treatment available as a toggle.
export function HeroArt({ def, face, onFace, showToggle = true }: { def: CardDef; face: Face; onFace?: (f: Face) => void; showToggle?: boolean }) {
  return (
    <div className={`hero suit-${def.suit}`}>
      <motion.div className="hero-frame" animate={{ rotate: face === 'reversed' ? 180 : 0 }} transition={{ type: 'spring', stiffness: 90, damping: 16 }} initial={false}>
        <Sigil def={def} face="upright" className="hero-sigil" />
        {face === 'reversed' && <div className="hero-dusk" aria-hidden />}
      </motion.div>
      <div className="hero-caption">
        <span className="hero-rank">{rankLine(def)}</span>
        {showToggle && onFace && (
          <span className="hero-toggle" role="group" aria-label="Which face to show">
            <button type="button" className={face === 'upright' ? 'is-on' : ''} onClick={() => onFace('upright')}>
              Upright
            </button>
            <button type="button" className={face === 'reversed' ? 'is-on' : ''} onClick={() => onFace('reversed')}>
              Reversed
            </button>
          </span>
        )}
      </div>
    </div>
  )
}

// One face's reading as a parchment strip: name, stats, keywords, text.
export function FacePanel({ def, face, active, cost }: { def: CardDef; face: Face; active?: boolean; cost?: number }) {
  const fd = face === 'upright' ? def.upright : def.reversed
  const atk = face === 'upright' ? def.attack : def.health
  const hp = face === 'upright' ? def.health : def.attack
  return (
    <div className={`face-panel face-panel-${face} ${active ? 'is-active' : ''}`}>
      <div className="face-panel-head">
        <span className="face-panel-label">{face === 'upright' ? 'Upright' : 'Reversed'}</span>
        <span className="face-panel-name">{fd.name ?? def.name}</span>
        {def.type === 'figure' ? (
          <span className="face-panel-stats">
            <span className="face-panel-atk">{atk}</span>
            <span className="face-panel-hp">{hp}</span>
          </span>
        ) : (
          <span className="face-panel-type">
            {def.type === 'omen' ? 'Omen' : 'Relic'}
            {cost !== undefined ? `, ${cost} Spark` : ''}
          </span>
        )}
      </div>
      <p className="face-panel-text">
        <RulesText text={fd.text || 'No text.'} />
      </p>
    </div>
  )
}

// Hero plus both faces plus flavor: the full inspection.
export function CardInspect({ def, initialFace = 'upright', cost }: { def: CardDef; initialFace?: Face; cost?: number }) {
  const [face, setFace] = useState<Face>(initialFace)
  return (
    <div className="inspect">
      <HeroArt def={def} face={face} onFace={setFace} />
      <div className="inspect-side">
        <div className="inspect-faces">
          <FacePanel def={def} face="upright" active={face === 'upright'} cost={cost} />
          <FacePanel def={def} face="reversed" active={face === 'reversed'} cost={cost} />
        </div>
        <p className="inspect-flavor">{def.flavor}</p>
      </div>
    </div>
  )
}
