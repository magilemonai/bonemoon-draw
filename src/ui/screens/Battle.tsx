import { AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { card, significator } from '../../data'
import { faceDef, figureName, other, whyNoAttack, whyNoMove } from '../../engine/queries'
import type { GameState } from '../../engine/types'
import { useStore, type Selection } from '../store'
import { Board, figureNeedsTarget } from '../components/Board'
import { FaceChooser, Hand } from '../components/Hand'
import { SigPanel } from '../components/SigPanel'
import { MoonDial } from '../components/Moon'
import { Banners, GameOver, InspectModal, Log, OverStrip, ReadChooser, RevealedHand } from '../components/Overlays'
import { LessonPanel } from '../components/LessonPanel'

// The one line that says what the player is being asked to do right now.
function promptFor(state: GameState, sel: Selection): string | null {
  const me = state.players[state.humanPlayer]
  if (sel.kind === 'ability') return `Choose a target for ${significator(me.sigId).abilityName}.`
  if (sel.kind === 'figure') {
    const fig = me.lanes[sel.lane]
    if (!fig) return null
    const name = figureName(fig)
    const noAttack = whyNoAttack(state, fig)
    const noMove = whyNoMove(state, fig)
    if (!noAttack && !noMove) return `${name}: tap an enemy or an open enemy lane to attack, or a lit lane to move.`
    if (!noAttack) return `${name}: tap an enemy or an open enemy lane to attack. It cannot move, ${noMove}.`
    if (!noMove) return `${name}: tap a lit lane to move. It cannot attack, ${noAttack}.`
    return `${name} is done for this turn, ${noAttack}. Tap it again to inspect.`
  }
  if (sel.kind === 'hand' && sel.face) {
    const inst = me.hand.find((h) => h.uid === sel.uid)
    if (!inst) return null
    const def = card(inst.defId)
    const name = faceDef(def, sel.face).name ?? def.name
    if (def.type === 'figure') {
      if (figureNeedsTarget(state, def.id, sel.face) && !sel.target) return `Choose ${name}'s target.`
      return `${sel.target ? 'Target chosen. ' : ''}Place ${name} in an empty lane.`
    }
    if (def.type === 'relic') return `Choose one of your Figures to carry ${name}.`
    return `Choose a target for ${name}.`
  }
  return null
}

export function Battle() {
  const display = useStore((s) => s.display)
  const goto = useStore((s) => s.goto)
  const select = useStore((s) => s.select)
  const sel = useStore((s) => s.selection)
  const speed = useStore((s) => s.speed)
  const setSpeed = useStore((s) => s.setSpeed)
  const reviewing = useStore((s) => s.reviewing)
  const concede = useStore((s) => s.concede)
  const lesson = useStore((s) => s.lesson)
  const leaveLesson = useStore((s) => s.leaveLesson)
  const casting = useStore((s) => s.fx.some((f) => f.kind === 'flash' && !!f.defId))
  const [showLog, setShowLog] = useState(false)
  const [conceding, setConceding] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  // On a phone the board takes what the panels and the hand leave, so nothing overlaps:
  // the lane width follows the free height. Wide screens size the lanes by height already.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const fit = () => {
      if (window.innerWidth >= 1000) {
        el.style.removeProperty('--cw-lane')
        return
      }
      const h = (sel: string) => el.querySelector(sel)?.getBoundingClientRect().height ?? 0
      const used = h('.table-top') + h('.table-mid') + h('.table-bottom') + h('.hand-wrap') + 30
      const free = el.clientHeight - used
      const w = Math.max(60, Math.min(112, Math.floor((free - 14) / 2 / 1.62)))
      el.style.setProperty('--cw-lane', `${w}px`)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    el.querySelectorAll('.table-top, .table-mid, .table-bottom, .hand-wrap').forEach((n) => ro.observe(n))
    window.addEventListener('resize', fit)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [display?.phase, !!lesson, reviewing])
  // Reviewing the final turn opens the log so the last events are in view.
  useEffect(() => {
    if (reviewing) setShowLog(true)
  }, [reviewing])
  if (!display) return null
  const me = display.humanPlayer
  const them = other(me)
  const prompt = display.active === me && !display.pending && display.phase !== 'over' ? promptFor(display, sel) : null
  const quick = speed > 1

  return (
    <div
      ref={root}
      className={`battle ${display.round >= display.boneMoonRound ? 'is-bone' : ''} ${reviewing ? 'is-reviewing' : ''} ${lesson ? 'is-lesson' : ''} ${casting ? 'is-casting' : ''}`}
      onClick={(e) => {
        // Tapping the felt clears a selection.
        if ((e.target as HTMLElement).classList.contains('battle') || (e.target as HTMLElement).classList.contains('board')) select({ kind: 'none' })
      }}
    >
      <div className="table-top">
        <SigPanel state={display} player={them} />
        <div className="table-tools">
          <button type="button" className={`btn-quiet ${quick ? 'is-on' : ''}`} onClick={() => setSpeed(quick ? 1 : 2.2)} aria-pressed={quick} title="Play out the table's animations faster">
            Quick
          </button>
          <button type="button" className="btn-quiet" onClick={() => setShowLog((v) => !v)} aria-pressed={showLog}>
            Log
          </button>
          {display.phase !== 'over' && !lesson && (
            <button type="button" className="btn-quiet" onClick={() => setConceding(true)} aria-pressed={conceding}>
              Concede
            </button>
          )}
          {lesson ? (
            <button type="button" className="btn-quiet" onClick={leaveLesson}>
              Leave the lesson
            </button>
          ) : (
            <button type="button" className="btn-quiet" onClick={() => goto('title')} title="The reading is kept; continue it from the title screen">
              Pause
            </button>
          )}
        </div>
      </div>
      <AnimatePresence>{display.players[them].handRevealed && <RevealedHand state={display} />}</AnimatePresence>
      <Board state={display} />
      <div className="table-mid">
        {prompt && (
          <div className="targeting-hint" role="status">
            {prompt}
            <button type="button" className="btn-quiet" onClick={() => select({ kind: 'none' })}>
              Cancel
            </button>
          </div>
        )}
      </div>
      {reviewing && display.phase === 'over' && <OverStrip state={display} />}
      {lesson && <LessonPanel />}
      {conceding && display.phase !== 'over' && (
        <div className="modal-scrim" onClick={() => setConceding(false)}>
          <div className="modal concede-modal" role="alertdialog" aria-label="Concede the reading" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Concede the reading?</div>
            <p className="modal-copy">It goes on the record as a loss. Renown never falls.</p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setConceding(false)
                  concede()
                }}
              >
                Concede
              </button>
              <button type="button" className="btn" onClick={() => setConceding(false)}>
                Keep playing
              </button>
            </div>
          </div>
        </div>
      )}
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
