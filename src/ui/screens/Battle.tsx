import { AnimatePresence } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { card, significator } from '../../data'
import { faceDef, figureName, keywords, other, whyNoAttack, whyNoMove } from '../../engine/queries'
import type { GameState, Keyword } from '../../engine/types'
import { useStore, type Selection } from '../store'
import { Board, figureNeedsTarget } from '../components/Board'
import { KW_DEF, KW_LABEL, KW_MARK } from '../components/Card'
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

const MIN_LANE = 84 // narrower than this and the hand tucks, so the lanes keep their size
const FLOOR_LANE = 72 // tucked and still short: the lanes give way before anything overlaps
const MAX_LANE = 112
const STRIP_H = 50 // the tucked hand
const CARD_RATIO = 1.6
const LANE_GAPS = 16 // the board's padding and the gap between its two rows on a phone

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
  const study = useStore((s) => s.study)
  const cardStyle = useStore((s) => s.cardStyle)
  const setCardStyle = useStore((s) => s.setCardStyle)
  const showStatus = useStore((s) => s.showStatus)
  const openStatus = useStore((s) => s.openStatus)
  const closeStatus = useStore((s) => s.closeStatus)
  const casting = useStore((s) => s.fx.some((f) => f.kind === 'flash' && !!f.defId))
  const [showLog, setShowLog] = useState(false)
  const [conceding, setConceding] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const [tucked, setTucked] = useState(false)
  const tuckedRef = useRef(false)
  const fullHand = useRef(0)
  const fitRef = useRef<() => void>(() => {})
  // On a phone the board takes what the column leaves and the lanes are sized to it. A
  // lane never goes under the width where a card's name, keywords and numbers still read;
  // when the fan would push it there, the hand tucks into a strip instead and the lanes
  // keep their size. Wide screens size the lanes by height already.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const fit = () => {
      if (window.innerWidth >= 1000) {
        el.style.removeProperty('--cw-lane')
        if (tuckedRef.current) {
          tuckedRef.current = false
          setTucked(false)
        }
        return
      }
      const board = el.querySelector('.board')
      const wrap = el.querySelector('.hand-wrap')
      if (!board || !wrap) return
      const boardH = board.getBoundingClientRect().height
      const wrapH = wrap.getBoundingClientRect().height
      if (!tuckedRef.current) fullHand.current = wrapH
      const lane = (h: number) => Math.floor((h - LANE_GAPS) / 2 / CARD_RATIO)
      const withFan = lane(boardH + wrapH - fullHand.current)
      let tuck = false
      let w = Math.min(MAX_LANE, withFan)
      if (withFan < MIN_LANE) {
        tuck = true
        w = Math.max(FLOOR_LANE, Math.min(MAX_LANE, lane(boardH + wrapH - (tuckedRef.current ? wrapH : STRIP_H))))
      }
      el.style.setProperty('--cw-lane', `${w}px`)
      if (tuck !== tuckedRef.current) {
        tuckedRef.current = tuck
        setTucked(tuck)
      }
    }
    fitRef.current = fit
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    el.querySelectorAll('.board, .hand-wrap').forEach((n) => ro.observe(n))
    window.addEventListener('resize', fit)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [display?.phase, !!lesson, reviewing])
  // The strip and the fan are different heights: size the lanes again once the hand has changed shape.
  useLayoutEffect(() => {
    fitRef.current()
  }, [tucked])
  // Reviewing the final turn opens the log so the last events are in view.
  useEffect(() => {
    if (reviewing) setShowLog(true)
  }, [reviewing])
  if (!display) return null
  const me = display.humanPlayer
  const them = other(me)
  const prompt = display.active === me && !display.pending && display.phase !== 'over' ? promptFor(display, sel) : null
  const quick = speed > 1
  // The key: only the marks on the table right now, each with what it does.
  const marks: { mark: string; label: string; cls: string; text: string }[] = []
  if (showStatus) {
    const seen = new Set<Keyword>()
    let relics = false
    for (const pl of [0, 1] as const) for (const f of display.players[pl].lanes) if (f) {
      for (const k of keywords(display, f)) if (k !== 'entersReversed') seen.add(k)
      if (f.relics.length) relics = true
    }
    for (const k of seen) marks.push({ mark: KW_MARK[k], label: KW_LABEL[k], cls: `kw-${k}`, text: KW_DEF[k] })
    if (relics) marks.push({ mark: '+', label: 'Carries a Relic', cls: 'kw-relic', text: 'A Relic attached to the Figure: its numbers and keywords are added to the card. Inspect the card to read it.' })
  }

  return (
    <div
      ref={root}
      className={`battle ${display.round >= display.boneMoonRound ? 'is-bone' : ''} ${reviewing ? 'is-reviewing' : ''} ${lesson ? 'is-lesson' : ''} ${casting ? 'is-casting' : ''} cards-${cardStyle} ${study ? 'is-study' : ''}`}
      onClick={(e) => {
        // Tapping the felt clears a selection.
        if ((e.target as HTMLElement).classList.contains('battle') || (e.target as HTMLElement).classList.contains('board')) select({ kind: 'none' })
      }}
    >
      {lesson && <LessonPanel />}
      <div className="table-top">
        <SigPanel state={display} player={them} />
        <div className="table-tools">
          <button type="button" className={`btn-quiet ${quick ? 'is-on' : ''}`} onClick={() => setSpeed(quick ? 1 : 2.2)} aria-pressed={quick} title="Play out the table's animations faster">
            Quick
          </button>
          <button type="button" className="btn-quiet" onClick={() => setShowLog((v) => !v)} aria-pressed={showLog}>
            Log
          </button>
          {display.phase !== 'over' && !lesson && !study && (
            <button type="button" className="btn-quiet" onClick={() => setConceding(true)} aria-pressed={conceding}>
              Concede
            </button>
          )}
          {study && (
            // One switch that names the other treatment, so the row fits a phone.
            <button type="button" className="btn-quiet" onClick={() => setCardStyle(cardStyle === 'words' ? 'marks' : 'words')} title={`Now showing ${cardStyle}; switch the compact cards`}>
              {cardStyle === 'words' ? 'Marks' : 'Words'}
            </button>
          )}
          {cardStyle === 'marks' && (
            <button type="button" className="btn-quiet" onClick={openStatus} aria-haspopup="dialog">
              Key
            </button>
          )}
          {lesson ? (
            <button type="button" className="btn-quiet" onClick={leaveLesson}>
              Leave the lesson
            </button>
          ) : study ? (
            <button type="button" className="btn-quiet" onClick={() => goto('title')} title="Back to the title screen">
              Leave
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
      {showStatus && (
        <div className="modal-scrim" onClick={closeStatus}>
          <div className="modal status-modal" role="dialog" aria-label="What is on the table" onClick={(e) => e.stopPropagation()}>
            <div className="inspect-head">
              <span className="modal-title">On the table</span>
              <button type="button" className="btn-quiet" onClick={closeStatus} autoFocus>
                Close
              </button>
            </div>
            {marks.length === 0 ? (
              <p className="modal-copy">No keywords on the table right now.</p>
            ) : (
              <dl className="status-list">
                {marks.map((m) => (
                  <div key={m.label} className="status-row">
                    <dt>
                      <span className={`mark ${m.cls}`} aria-hidden>
                        {m.mark}
                      </span>
                      {m.label}
                    </dt>
                    <dd>{m.text}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      )}
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
        <MoonDial state={display} prompt={prompt} onCancel={() => select({ kind: 'none' })} />
      </div>
      <Hand state={display} tucked={tucked} />
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
