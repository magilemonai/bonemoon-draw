import { useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../store'
import { MoonDisc } from '../components/Moon'
import { ArtImage } from '../components/ArtImage'

export function Title() {
  const goto = useStore((s) => s.goto)
  const [painted, setPainted] = useState(false)
  return (
    <div className={`title ${painted ? 'has-painting' : ''}`}>
      <div className="title-painting" aria-hidden>
        <ArtImage id="title" onLoad={() => setPainted(true)} />
      </div>
      {!painted && (
        <motion.div className="title-moon" initial={false} animate={{ y: [4, -4, 4] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}>
          <MoonDisc phase="waxing" bone={false} size={132} />
        </motion.div>
      )}
      <h1 className="title-name">
        The Bonemoon Draw
      </h1>
      <p className="title-sub">
        A tarot battler set in Valisar. Every card has two faces. Choose the one you play, and turn the ones they play.
      </p>
      <div className="title-actions">
        <button type="button" className="btn btn-primary" onClick={() => goto('choose')}>
          Begin a reading
        </button>
        <button type="button" className="btn" onClick={() => goto('codex')}>
          The Codex
        </button>
        <button type="button" className="btn" onClick={() => goto('rules')}>
          How to play
        </button>
      </div>
      <p className="title-foot">The stars observe everything that occurs beneath them. They always have.</p>
    </div>
  )
}
