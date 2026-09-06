import { AnimatePresence } from 'motion/react'
import { other } from '../../engine/queries'
import { useStore } from '../store'
import { Board } from '../components/Board'
import { FaceChooser, Hand } from '../components/Hand'
import { SigPanel } from '../components/SigPanel'
import { MoonDial } from '../components/Moon'
import { Banners, GameOver, InspectModal, Log, ReadChooser, RevealedHand } from '../components/Overlays'
import { useState } from 'react'

export function Battle() {
  const display = useStore((s) => s.display)
  const goto = useStore((s) => s.goto)
  const select = useStore((s) => s.select)
  const sel = useStore((s) => s.selection)
  const [showLog, setShowLog] = useState(false)
  if (!display) return null
  const me = display.humanPlayer
  const them = other(me)
  const targeting = sel.kind === 'ability' || (sel.kind === 'hand' && !!sel.face) || sel.kind === 'figure'

  return (
    <div className={`battle ${display.round >= display.boneMoonRound ? 'is-bone' : ''}`} onClick={(e) => {
      // Tapping the felt clears a selection.
      if ((e.target as HTMLElement).classList.contains('battle') || (e.target as HTMLElement).classList.contains('board')) select({ kind: 'none' })
    }}>
      <div className="table-top">
        <SigPanel state={display} player={them} />
        <div className="table-tools">
          <button type="button" className="btn-quiet" onClick={() => setShowLog((v) => !v)} aria-pressed={showLog}>
            Log
          </button>
          <button type="button" className="btn-quiet" onClick={() => goto('title')}>
            Leave
          </button>
        </div>
      </div>
      <AnimatePresence>{display.players[them].handRevealed && <RevealedHand state={display} />}</AnimatePresence>
      <Board state={display} />
      <div className="table-mid">
        {targeting && (
          <div className="targeting-hint">
            {sel.kind === 'ability' ? 'Choose a target for the ability.' : sel.kind === 'figure' ? 'Choose an attack or a move, or tap the card again to inspect it.' : sel.kind === 'hand' && sel.target ? 'Now choose a lane.' : 'Choose where it goes.'}
            <button type="button" className="btn-quiet" onClick={() => select({ kind: 'none' })}>
              Cancel
            </button>
          </div>
        )}
      </div>
      <div className="table-bottom">
        <SigPanel state={display} player={me} />
        <MoonDial state={display} />
      </div>
      <Hand state={display} />
      <AnimatePresence>{sel.kind === 'hand' && !sel.face && <FaceChooser key="fc" state={display} />}</AnimatePresence>
      {showLog && (
        <div className="log-drawer">
          <div className="log-head">
            <span>The reading so far</span>
            <button type="button" className="btn-quiet" onClick={() => setShowLog(false)}>
              Close
            </button>
          </div>
          <Log />
        </div>
      )}
      <Banners />
      <AnimatePresence>{display.pending && <ReadChooser key="read" state={display} />}</AnimatePresence>
      <AnimatePresence>{sel.kind === 'inspect' && <InspectModal key="inspect" state={display} />}</AnimatePresence>
      <AnimatePresence>{display.phase === 'over' && <GameOver key="over" state={display} />}</AnimatePresence>
    </div>
  )
}
