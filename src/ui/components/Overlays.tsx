import { AnimatePresence, motion } from 'motion/react'
import { card, significator } from '../../data'
import { cardCost } from '../../engine/queries'
import type { GameState } from '../../engine/types'
import { useStore } from '../store'
import { Card } from './Card'
import { ArtImage } from './ArtImage'
import { CardInspect } from './Hero'

export function Banners() {
  const fx = useStore((s) => s.fx)
  const uiKit = useStore((s) => s.uiKit)
  const banners = fx.filter((f) => f.kind === 'banner')
  const flashes = fx.filter((f) => f.kind === 'flash')
  return (
    <>
      <AnimatePresence>
        {banners.slice(-1).map((b) => (
          <motion.div key={b.id} className={`banner ${uiKit ? 'has-ribbon' : ''}`} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.35 }}>
            {uiKit && <ArtImage id="ui/banner" ext="png" className="banner-ribbon" />}
            <span className="banner-rule" />
            <span className="banner-text">{b.text}</span>
            {b.sub && <span className="banner-sub">{b.sub}</span>}
            <span className="banner-rule" />
          </motion.div>
        ))}
      </AnimatePresence>
      <AnimatePresence>
        {flashes.slice(-1).map((b) => (
          <motion.div key={b.id} className="flash" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <span className="flash-text">{b.text}</span>
            {b.sub && <span className={`flash-sub flash-${b.sub}`}>{b.sub}</span>}
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  )
}

export function ReadChooser({ state }: { state: GameState }) {
  const dispatch = useStore((s) => s.dispatch)
  const pend = state.pending
  if (!pend || pend.player !== state.humanPlayer) return null
  return (
    <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="modal read-modal" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="modal-title">Read the cards</div>
        <p className="modal-copy">Keep one. The rest go to the bottom of your deck.</p>
        <div className="read-options">
          {pend.options.map((o) => {
            const def = card(o.defId)
            return (
              <div key={o.uid} className="read-option">
                <Card def={def} face="upright" size="hand" cost={cardCost(state, pend.player, def.id)} onClick={() => dispatch({ type: 'choose', uid: o.uid })} />
                <button type="button" className="btn" onClick={() => dispatch({ type: 'choose', uid: o.uid })}>
                  Keep
                </button>
              </div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function InspectModal({ state }: { state: GameState | null }) {
  const sel = useStore((s) => s.selection)
  const close = useStore((s) => s.closeInspect)
  if (sel.kind !== 'inspect') return null
  const def = card(sel.defId)
  const cost = state ? cardCost(state, state.humanPlayer, def.id) : def.cost
  return (
    <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={close}>
      <motion.div className="modal inspect-modal" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={(e) => e.stopPropagation()}>
        <div className="inspect-head">
          <span className="modal-title">{def.name}</span>
          <button type="button" className="btn-quiet" onClick={close}>
            Close
          </button>
        </div>
        <CardInspect key={`${def.id}-${sel.face}`} def={def} initialFace={sel.face} cost={cost} />
      </motion.div>
    </motion.div>
  )
}

export function RevealedHand({ state }: { state: GameState }) {
  const them = state.players[state.humanPlayer === 0 ? 1 : 0]
  if (!them.handRevealed || them.hand.length === 0) return null
  return (
    <motion.div className="revealed" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <span className="revealed-label">{significator(them.sigId).name}'s hand</span>
      <div className="revealed-cards">
        {them.hand.map((h) => (
          <Card key={h.uid} def={card(h.defId)} face="upright" size="mini" />
        ))}
      </div>
    </motion.div>
  )
}

export function GameOver({ state }: { state: GameState }) {
  const goto = useStore((s) => s.goto)
  const startGame = useStore((s) => s.startGame)
  const humanSig = useStore((s) => s.humanSig)
  const aiSig = useStore((s) => s.aiSig)
  const queue = useStore((s) => s.queue)
  if (state.phase !== 'over' || queue.length > 0) return null
  const win = state.winner === state.humanPlayer
  const who = state.winner === 'draw' ? null : significator(state.players[state.winner!].sigId)
  return (
    <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
      <motion.div className="modal gameover" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.3 }}>
        <div className="modal-title">{state.winner === 'draw' ? 'Both readings end together' : win ? 'The reading is yours' : 'The reading goes against you'}</div>
        <p className="modal-copy">
          {who ? `${who.name}, ${who.title}, holds the table after ${state.round} rounds.` : `Both Significators fell in round ${state.round}.`}
        </p>
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={() => startGame(humanSig, aiSig)}>
            Draw again
          </button>
          <button type="button" className="btn" onClick={() => goto('choose')}>
            Change Significator
          </button>
          <button type="button" className="btn-quiet" onClick={() => goto('title')}>
            Back to the table
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Log() {
  const log = useStore((s) => s.log)
  return (
    <div className="log" aria-live="polite">
      {log.slice(-12).map((l, i) => (
        <div key={`${i}-${l}`} className="log-line">
          {l}
        </div>
      ))}
    </div>
  )
}
