import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { ArtImage } from './ArtImage'

// The back of every card in the deck: the painting from the art set, in a card frame.
export function CardBack({ className = '' }: { className?: string }) {
  return (
    <div className={`card-back-face ${className}`} aria-hidden>
      <ArtImage id="card-back" />
      <span className="card-back-rim" />
    </div>
  )
}

// A card that arrives face down and turns over to show its front. The front keeps its own
// upright and reversed faces; this is the turn from the back to whichever of those it is.
export function FlipIn({ children, delay = 0, duration = 0.55, className = '' }: { children: ReactNode; delay?: number; duration?: number; className?: string }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  return (
    <motion.div className={`card-3d ${className}`} initial={{ rotateY: 180 }} animate={{ rotateY: 0 }} transition={reduce ? { duration: 0 } : { duration, delay, ease: [0.2, 0.7, 0.2, 1] }}>
      <div className="card-3d-front">{children}</div>
      <div className="card-3d-back">
        <CardBack />
      </div>
    </motion.div>
  )
}
