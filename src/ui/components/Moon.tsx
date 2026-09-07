import { motion } from 'motion/react'
import { drawForecast, moonPhase } from '../../engine/queries'
import type { GameState, MoonPhase } from '../../engine/types'
import { useStore } from '../store'
import { useLessonHints } from '../lessonHints'

const PHASE_LABEL: Record<MoonPhase, string> = {
  new: 'New moon',
  waxing: 'Waxing',
  full: 'Full Moon',
  waning: 'Waning',
}

// The moon face itself: a disc with a shadow that moves with the phase.
export function MoonDisc({ phase, bone, size = 44 }: { phase: MoonPhase; bone: boolean; size?: number }) {
  const r = size / 2
  // Shadow offset: new = fully covered, full = uncovered.
  const off = phase === 'new' ? 0 : phase === 'waxing' ? r * 0.9 : phase === 'full' ? r * 2.4 : -r * 0.9
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={`moon-disc ${bone ? 'is-bone' : ''}`} aria-hidden>
      <defs>
        <clipPath id={`moonclip-${size}`}>
          <circle cx={r} cy={r} r={r - 1} />
        </clipPath>
      </defs>
      <circle cx={r} cy={r} r={r - 1} className="moon-light" />
      {bone && (
        <g className="moon-craters" clipPath={`url(#moonclip-${size})`}>
          <circle cx={r * 0.7} cy={r * 0.8} r={r * 0.18} />
          <circle cx={r * 1.3} cy={r * 1.2} r={r * 0.26} />
          <circle cx={r * 1.1} cy={r * 0.55} r={r * 0.1} />
        </g>
      )}
      <motion.circle
        cx={r}
        cy={r}
        r={r + 1}
        className="moon-shadow"
        clipPath={`url(#moonclip-${size})`}
        animate={{ cx: r + off }}
        transition={{ type: 'spring', stiffness: 90, damping: 18 }}
        initial={false}
      />
    </svg>
  )
}

// The turn panel: where the reading stands, what the next draw brings, and the one
// button that ends the turn.
export function MoonDial({ state }: { state: GameState }) {
  const dispatch = useStore((s) => s.dispatch)
  const playing = useStore((s) => s.playing)
  const queue = useStore((s) => s.queue)
  const phase = moonPhase(state.round)
  const bone = state.round >= state.boneMoonRound
  const pendingMine = !!state.pending && state.pending.player === state.humanPlayer
  const myTurn = state.active === state.humanPlayer && !state.pending && state.phase !== 'over'
  const busy = playing || queue.length > 0
  const untilBone = state.boneMoonRound - state.round
  const over = state.phase === 'over'
  const who = over ? 'The reading is over' : pendingMine ? 'Your choice' : myTurn ? (busy ? 'Resolving' : 'Your turn') : 'Their turn'
  const lit = useLessonHints().some((h) => h.kind === 'endTurn')
  const f = drawForecast(state, state.humanPlayer)
  const nextMoon = f.phase === 'full' ? 'a Full Moon' : PHASE_LABEL[f.phase].toLowerCase()

  return (
    <div className={`turn-panel ${myTurn ? 'is-my-turn' : ''} ${bone ? 'is-bone' : ''}`}>
      <div className="turn-line">
        <span className="turn-round">
          Round {state.round}, {PHASE_LABEL[phase]}
        </span>
        <span className={`turn-who ${myTurn && !busy ? 'is-mine' : ''}`}>{who}</span>
      </div>
      {!over && (
        <div className="forecast">
          <span className="forecast-draw">
            Next draw: {f.draws} card{f.draws === 1 ? '' : 's'} (round {f.round}, {nextMoon})
          </span>
          {f.burns > 0 && (
            <span className="forecast-warn">
              Hand full: {f.burns} card{f.burns === 1 ? '' : 's'} would burn
            </span>
          )}
          {f.short > 0 && <span className="forecast-warn">The deck is {f.short} short</span>}
        </div>
      )}
      <button type="button" className={`end-turn ${lit ? 'is-lesson' : ''}`} disabled={!myTurn || busy} onClick={() => dispatch({ type: 'endTurn' })} aria-label={myTurn ? 'End your turn' : 'Waiting'}>
        <MoonDisc phase={phase} bone={bone} size={30} />
        <span>{over ? 'Over' : myTurn ? (busy ? 'Resolving' : 'End turn') : 'Waiting'}</span>
      </button>
      <span className="turn-bone">{bone ? 'The Bone Moon is up.' : `Bone Moon in ${untilBone} round${untilBone === 1 ? '' : 's'}`}</span>
    </div>
  )
}
