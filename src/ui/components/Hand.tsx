import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { card } from '../../data'
import { availableSpark, cardCost, playableFaces, previewPlay, targetsFor } from '../../engine/queries'
import type { Face, GameState } from '../../engine/types'
import { useStore } from '../store'
import { Card, RulesText } from './Card'
import { Sigil } from '../sigils'

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
            return (
              <motion.div
                key={h.uid}
                className={`hand-card ${selected ? 'is-selected' : ''} ${!affordable ? 'is-poor' : ''}`}
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
        <span className="face-chooser-cost">
          {cost} Spark{affordable ? '' : ' (not enough)'}
        </span>
        <button type="button" className="btn-quiet" onClick={() => select({ kind: 'none' })}>
          Cancel
        </button>
      </div>
      <div className="face-chooser-body">
        <div className={`face-chooser-hero suit-${def.suit}`}>
          <Sigil def={def} face="upright" />
        </div>
        <div className="face-chooser-faces">
          {(['upright', 'reversed'] as Face[]).map((face) => {
            const fd = face === 'upright' ? def.upright : def.reversed
            const legal = faces.includes(face) && affordable
            const ok = legal && !busy
            const printed = def.type === 'figure' ? { atk: face === 'upright' ? def.attack ?? 0 : def.health ?? 0, hp: face === 'upright' ? def.health ?? 0 : def.attack ?? 0 } : null
            const pv = def.type === 'figure' ? previewPlay(state, p, def.id, face) : null
            const differs = pv && printed && (pv.atk !== printed.atk || pv.hp !== printed.hp)
            return (
              <button key={face} type="button" className={`face-option face-option-${face} ${legal ? '' : 'is-off'} ${legal && busy ? 'is-wait' : ''}`} disabled={!ok} onClick={() => choose(face)}>
                <span className="face-option-label">{face === 'upright' ? 'Upright' : 'Reversed'}</span>
                <span className="face-option-name">{fd.name ?? def.name}</span>
                {printed && (
                  <span className="face-option-stats">
                    {pv ? `${pv.atk} / ${pv.hp}` : `${printed.atk} / ${printed.hp}`}
                    {differs && <small> on your table (printed {printed.atk}/{printed.hp})</small>}
                  </span>
                )}
                <span className="face-option-text">
                  <RulesText text={fd.text || '—'} />
                </span>
                <span className="face-option-hint">{ok ? hint(face) : legal ? 'The table is still settling.' : faces.includes(face) ? '' : 'This card only enters Reversed.'}</span>
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
