import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { card, rankLine } from '../../data'
import { availableSpark, cardCost, playableFaces, previewPlay, targetsFor } from '../../engine/queries'
import type { Face, GameState } from '../../engine/types'
import { useStore } from '../store'
import { Card } from './Card'
import { useLessonHints } from '../lessonHints'

export function Hand({ state }: { state: GameState }) {
  const p = state.humanPlayer
  const me = state.players[p]
  const sel = useStore((s) => s.selection)
  const select = useStore((s) => s.select)
  const inspect = useStore((s) => s.inspect)
  const myTurn = state.active === p && !state.pending && state.phase !== 'over'
  const spark = availableSpark(me)
  const strip = useRef<HTMLDivElement>(null)
  const [more, setMore] = useState(0)
  const hints = useLessonHints()

  // On a phone the hand scrolls sideways. Count the cards past the right edge so the
  // player knows there are more.
  useEffect(() => {
    const el = strip.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      let n = 0
      // A card counts as hidden when more than the fan's overlap sits past the edge.
      el.querySelectorAll('.hand-card').forEach((c) => {
        if (c.getBoundingClientRect().right > r.right + 20) n += 1
      })
      setMore((prev) => (prev === n ? prev : n))
    }
    measure()
    // Cards spring into place, so measure again once they have settled, then keep an eye on it.
    const t = window.setInterval(measure, 600)
    el.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.clearInterval(t)
      el.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [me.hand.length])

  return (
    <div className="hand-wrap">
      <div className={`hand ${myTurn ? 'is-my-turn' : ''}`} aria-label="Your hand" ref={strip}>
        <AnimatePresence initial={false}>
          {me.hand.map((h, i) => {
            const def = card(h.defId)
            const cost = cardCost(state, p, def.id)
            const affordable = spark >= cost
            const selected = sel.kind === 'hand' && sel.uid === h.uid
            const n = me.hand.length
            const mid = (n - 1) / 2
            const tilt = n > 1 ? ((i - mid) / mid) * 6 : 0
            const lit = !selected && hints.some((x) => x.kind === 'hand' && x.defId === def.id)
            return (
              <motion.div
                key={h.uid}
                className={`hand-card ${selected ? 'is-selected' : ''} ${!affordable ? 'is-poor' : ''} ${lit ? 'is-lesson' : ''}`}
                layout
                initial={{ opacity: 0, y: -80, x: 120, rotate: 20 }}
                animate={{ opacity: 1, y: selected ? -22 : 0, x: 0, rotate: selected ? 0 : tilt }}
                exit={{ opacity: 0, y: -40, scale: 0.9, transition: { duration: 0.25 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                style={{ zIndex: selected ? 50 : i + 1 }}
              >
                <Card
                  def={def}
                  face={sel.kind === 'hand' && sel.uid === h.uid && sel.face ? sel.face : 'upright'}
                  size="hand"
                  cost={cost}
                  selected={selected}
                  dim={myTurn && !affordable}
                  layoutId={`card-${h.uid}`}
                  onClick={() => {
                    // One gesture, whatever the table is doing: on your turn a tap opens the
                    // card's choices (commit waits until the table settles); a second tap inspects.
                    if (!myTurn) {
                      inspect(def.id, 'upright', h.uid)
                      return
                    }
                    if (selected) {
                      inspect(def.id, sel.face ?? 'upright', h.uid)
                      return
                    }
                    select({ kind: 'hand', uid: h.uid })
                  }}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
      {more > 0 && (
        <button type="button" className="hand-more" onClick={() => strip.current?.scrollBy({ left: 180, behavior: 'smooth' })}>
          {more} more
        </button>
      )}
    </div>
  )
}

// After tapping a hand card: pick which face you are playing.
export function FaceChooser({ state }: { state: GameState }) {
  const sel = useStore((s) => s.selection)
  const select = useStore((s) => s.select)
  const dispatch = useStore((s) => s.dispatch)
  const busy = useStore((s) => s.playing || s.queue.length > 0)
  const hints = useLessonHints()
  const p = state.humanPlayer
  if (sel.kind !== 'hand' || sel.face) return null
  const inst = state.players[p].hand.find((h) => h.uid === sel.uid)
  if (!inst) return null
  const def = card(inst.defId)
  const faces = playableFaces(state, p, def.id)
  const cost = cardCost(state, p, def.id)
  const affordable = availableSpark(state.players[p]) >= cost

  const choose = (face: Face) => {
    const fd = face === 'upright' ? def.upright : def.reversed
    if (def.type === 'omen') {
      const needs = fd.target && fd.target !== 'none' && targetsFor(state, p, fd.target, { fromOmen: true }).length > 0
      if (!needs) {
        dispatch({ type: 'play', uid: inst.uid, face })
        return
      }
    }
    select({ kind: 'hand', uid: inst.uid, face })
  }

  const hint = (face: Face) => {
    const fd = face === 'upright' ? def.upright : def.reversed
    if (def.type === 'figure') return fd.target && fd.target !== 'none' && targetsFor(state, p, fd.target, { pierceVeil: fd.pierceVeil }).length ? 'Then choose its target, then a lane.' : 'Then choose a lane.'
    if (def.type === 'relic') return 'Then choose one of your Figures to carry it.'
    return fd.target && fd.target !== 'none' && targetsFor(state, p, fd.target, { fromOmen: true }).length ? 'Then choose a target.' : 'Cast now.'
  }

  return (
    <motion.div className="face-chooser" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}>
      <div className="face-chooser-head">
        <span className="face-chooser-title">{def.name}</span>
        <span className="face-chooser-rank">{rankLine(def)}</span>
        <span className="face-chooser-cost">
          {cost} Spark{affordable ? '' : `. Need ${cost - availableSpark(state.players[p])} more`}
        </span>
        <button type="button" className="btn-quiet" onClick={() => select({ kind: 'none' })}>
          Cancel
        </button>
      </div>
      <div className="face-chooser-cards">
        {(['upright', 'reversed'] as Face[]).map((face) => {
          const legal = faces.includes(face) && affordable
          const ok = legal && !busy
          const pv = def.type === 'figure' ? previewPlay(state, p, def.id, face) : null
          const lit = hints.some((x) => x.kind === 'face' && x.face === face)
          const why = !faces.includes(face) ? 'This card only enters Reversed.' : !affordable ? `Need ${cost - availableSpark(state.players[p])} more Spark.` : busy ? 'The table is still settling.' : hint(face)
          return (
            <button key={face} type="button" className={`face-card face-card-${face} ${legal ? '' : 'is-off'} ${lit ? 'is-lesson' : ''}`} disabled={!ok} onClick={() => choose(face)} aria-label={`Play ${def.name} ${face}`}>
              <Card def={def} face={face} size="full" cost={cost} atk={pv?.atk} hp={pv?.hp} />
              <span className={`face-card-label ${ok ? 'is-on' : ''}`}>{face === 'upright' ? 'Play Upright' : 'Play Reversed'}</span>
              <span className="face-card-why">{why}</span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
