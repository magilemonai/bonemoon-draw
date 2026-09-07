import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { card, rankLine } from '../../data'
import { MAX_HAND } from '../../engine/engine'
import { availableSpark, cardCost, drawForecast, playableFaces, previewPlay, targetsFor } from '../../engine/queries'
import type { Face, GameState } from '../../engine/types'
import { useStore } from '../store'
import { Card } from './Card'
import { FlipIn } from './CardBack'
import { Sigil } from '../sigils'
import { useLessonHints } from '../lessonHints'
import { currentStep, lessonById } from '../../tutorial/lessons'

// The hand. On a phone too short to hold the fan under two readable rows of lanes, it is
// tucked: a strip at the foot of the table with every card in miniature, the count, and
// the burn warning. Tapping the strip raises the fan as a sheet; choosing a card lowers it.
export function Hand({ state, tucked = false }: { state: GameState; tucked?: boolean }) {
  const p = state.humanPlayer
  const me = state.players[p]
  const sel = useStore((s) => s.selection)
  const select = useStore((s) => s.select)
  const inspect = useStore((s) => s.inspect)
  const myTurn = state.active === p && !state.pending && state.phase !== 'over'
  const spark = availableSpark(me)
  const fan = useRef<HTMLDivElement>(null)
  const [more, setMore] = useState(0)
  const [open, setOpen] = useState(false)
  const hints = useLessonHints()
  const placing = sel.kind === 'hand' && !!sel.face

  // On a phone the hand scrolls sideways. Count the cards past the right edge so the
  // player knows there are more.
  useEffect(() => {
    const el = fan.current
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

  // The raised sheet lowers itself once a card is on its way to the table, when the hand
  // changes, and whenever there is room for the fan again.
  useEffect(() => {
    if (placing || !tucked) setOpen(false)
  }, [placing, tucked])
  useEffect(() => {
    setOpen(false)
  }, [me.hand.length])

  const playable = myTurn ? me.hand.filter((h) => spark >= cardCost(state, p, h.defId) && playableFaces(state, p, h.defId).length > 0).length : 0
  const forecast = drawForecast(state, p)
  const note = forecast.burns > 0 ? `${forecast.burns} would burn on the next draw` : myTurn ? (playable === 0 ? 'Nothing to play' : `${playable} to play`) : 'Tap to look'

  return (
    <div className={`hand-wrap ${tucked ? 'is-tucked' : ''} ${tucked && open ? 'is-open' : ''}`}>
      {tucked && (
        <button type="button" className="hand-strip" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={`Your hand, ${me.hand.length} of ${MAX_HAND} cards. ${note}`}>
          <span className="hand-strip-thumbs" aria-hidden>
            {me.hand.map((h) => {
              const def = card(h.defId)
              const cost = cardCost(state, p, def.id)
              return (
                <span key={h.uid} className={`hand-thumb suit-${def.suit} ${myTurn && spark < cost ? 'is-poor' : ''}`}>
                  <Sigil def={def} face="upright" />
                  <span className="hand-thumb-cost">{cost}</span>
                </span>
              )
            })}
          </span>
          <span className="hand-strip-text">
            <b>
              Hand {me.hand.length} of {MAX_HAND}
            </b>
            <span className={`hand-strip-note ${forecast.burns > 0 ? 'is-warn' : ''}`}>{note}</span>
          </span>
          <span className="hand-strip-cta">{open ? 'Hide' : 'Show'}</span>
        </button>
      )}
      <div className="hand-sheet">
        {tucked && open && (
          <div className="hand-sheet-head">
            <span>
              Your hand, {me.hand.length} of {MAX_HAND}
            </span>
            <button type="button" className="btn-quiet" onClick={() => setOpen(false)}>
              Hide
            </button>
          </div>
        )}
        <div className={`hand ${myTurn ? 'is-my-turn' : ''}`} aria-label="Your hand" ref={fan}>
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
                  initial={{ opacity: 0, y: -60, x: 40, rotate: 8 }}
                  animate={{ opacity: 1, y: selected ? -22 : 0, x: 0, rotate: selected ? 0 : tilt }}
                  exit={{ opacity: 0, y: -40, scale: 0.9, transition: { duration: 0.25 } }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  style={{ zIndex: selected ? 50 : i + 1 }}
                >
                  <FlipIn>
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
                  </FlipIn>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
      {more > 0 && !tucked && (
        <button type="button" className="hand-more" onClick={() => fan.current?.scrollBy({ left: 180, behavior: 'smooth' })}>
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
  const lesson = useStore((s) => s.lesson)
  const hints = useLessonHints()
  const p = state.humanPlayer
  if (sel.kind !== 'hand' || sel.face) return null
  const inst = state.players[p].hand.find((h) => h.uid === sel.uid)
  if (!inst) return null
  const def = card(inst.defId)
  const faces = playableFaces(state, p, def.id)
  const cost = cardCost(state, p, def.id)
  const affordable = availableSpark(state.players[p]) >= cost
  // In a lesson the sheet sits over the coach, so the step about this card speaks here too.
  const step = lesson ? currentStep(lessonById(lesson.id)!, lesson.progress) : null
  const coach = step && !step.free && hints.some((x) => x.kind === 'face' || (x.kind === 'hand' && x.defId === def.id)) ? (step.do ?? step.say) : null

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
      {coach && (
        <p className="face-chooser-coach" role="status">
          {coach}
        </p>
      )}
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
      <div className="face-chooser-actions" aria-label="Play a face">
        {(['upright', 'reversed'] as Face[]).map((face) => {
          const ok = faces.includes(face) && affordable && !busy
          return (
            <button key={face} type="button" className={`btn ${ok ? 'btn-primary' : ''}`} disabled={!ok} onClick={() => choose(face)}>
              {face === 'upright' ? 'Play Upright' : 'Play Reversed'}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
