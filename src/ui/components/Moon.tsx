import { motion } from 'motion/react'
import { drawForecast, moonPhase } from '../../engine/queries'
import type { GameState, MoonPhase } from '../../engine/types'
import { useStore } from '../store'

const PHASE_LABEL: Record<MoonPhase, string> = {
  new: 'New moon',
  waxing: 'Waxing',
  full: 'Full moon',
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

// What the next round holds for the player: the moon, the draws, and any burn.
function forecastText(state: GameState): string {
  const f = drawForecast(state, state.humanPlayer)
  const moon = f.phase === 'full' ? 'a Full Moon' : f.phase === 'new' ? 'a new moon' : `a ${f.phase} moon`
  let s = `Round ${f.round} is ${moon}: you draw ${f.draws}`
  if (f.burns > 0) s += `, and ${f.burns} would burn at this hand size`
  if (f.short > 0) s += `, and the deck is ${f.short} short`
  return s + '.'
}

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
  const turnLabel = over ? 'The reading is over' : pendingMine ? 'Your choice' : myTurn ? (busy ? 'Resolving' : 'End the turn') : 'Their reading'

  return (
    <div className={`moon-dial ${myTurn ? 'is-my-turn' : ''} ${bone ? 'is-bone' : ''}`}>
      <button type="button" className="moon-btn" disabled={!myTurn || busy} onClick={() => dispatch({ type: 'endTurn' })} aria-label={myTurn ? 'End your turn' : 'Waiting'}>
        <MoonDisc phase={phase} bone={bone} size={48} />
        <span className="moon-ring" />
      </button>
      <div className="moon-text">
        <span className="moon-turn">{turnLabel}</span>
        <span className="moon-phase">
          Round {state.round}, {PHASE_LABEL[phase].toLowerCase()}
          {bone ? '. The Bone Moon is up.' : untilBone <= 3 ? `. Bone Moon in ${untilBone}.` : '.'}
        </span>
        {!over && <span className="moon-forecast">{forecastText(state)}</span>}
      </div>
    </div>
  )
}
