import { AnimatePresence, motion } from 'motion/react'
import { significator } from '../../data'
import { availableSpark, other, sameRef, targetsFor } from '../../engine/queries'
import type { GameState, PlayerId } from '../../engine/types'
import { useStore } from '../store'
import { computeHighlights } from './Board'
import { ArtImage } from './ArtImage'

function Portrait({ sigId, size }: { sigId: string; size: number }) {
  const sig = significator(sigId)
  return (
    <div className="portrait" style={{ width: size, height: size }}>
      <ArtImage id={sig.id} />
      <span className="portrait-numeral">{sig.numeral}</span>
    </div>
  )
}

// The opponent's hand, face down.
function CardBacks({ n }: { n: number }) {
  return (
    <span className="card-backs" aria-label={`${n} cards in hand`}>
      {Array.from({ length: Math.min(n, 8) }, (_, i) => (
        <span key={i} className="card-back" style={{ transform: `rotate(${(i - (Math.min(n, 8) - 1) / 2) * 6}deg)` }}>
          <ArtImage id="card-back" />
        </span>
      ))}
    </span>
  )
}

export function SigPanel({ state, player }: { state: GameState; player: PlayerId }) {
  const pl = state.players[player]
  const sig = significator(pl.sigId)
  const isMine = player === state.humanPlayer
  const sel = useStore((s) => s.selection)
  const select = useStore((s) => s.select)
  const dispatch = useStore((s) => s.dispatch)
  const fx = useStore((s) => s.fx)
  const playing = useStore((s) => s.playing)
  const ref = { kind: 'sig' as const, player }
  const hl = computeHighlights(state, sel)
  const isTarget = hl.targets.some((t) => sameRef(t, ref))
  const myTurn = state.active === state.humanPlayer && !state.pending && state.phase !== 'over'
  const spark = availableSpark(pl)
  const canAbility = isMine && myTurn && !pl.abilityUsed && spark >= sig.abilityCost && (sig.abilityTarget === 'none' || targetsFor(state, player, sig.abilityTarget, { fromAbility: true }).length > 0)
  const sigFx = fx.filter((f) => f.ref && sameRef(f.ref, ref) && (f.kind === 'damage' || f.kind === 'heal' || f.kind === 'spark'))
  const lunge = fx.find((f) => f.kind === 'lunge' && f.toRef && sameRef(f.toRef, ref))
  const hpPct = Math.max(0, Math.min(100, (pl.health / pl.maxHealth) * 100))
  const enemy = state.players[other(player)]

  const onSigClick = () => {
    if (isTarget) {
      if (sel.kind === 'hand' && sel.face) dispatch({ type: 'play', uid: sel.uid, face: sel.face, target: ref })
      else if (sel.kind === 'figure') {
        const atk = state.players[state.humanPlayer].lanes[sel.lane]
        if (atk) dispatch({ type: 'attack', lane: sel.lane, targetLane: atk.lane })
      } else if (sel.kind === 'ability') dispatch({ type: 'ability', target: ref })
    }
  }

  return (
    <div className={`sig ${isMine ? 'sig-mine' : 'sig-theirs'} ${isTarget ? 'is-target' : ''} ${state.active === player ? 'is-active' : ''}`}>
      <motion.button
        type="button"
        className="sig-portrait"
        onClick={onSigClick}
        animate={lunge ? { scale: [1, 0.96, 1], x: [0, isMine ? 0 : 0, 0] } : { scale: 1 }}
        aria-label={`${sig.name}, ${pl.health} health`}
      >
        <Portrait sigId={sig.id} size={isMine ? 52 : 44} />
        <span className="sig-hp" title="Health">
          {pl.health}
        </span>
        <div className="sig-fx">
          <AnimatePresence>
            {sigFx.map((f) => (
              <motion.span
                key={f.id}
                className={`fxnum ${f.kind === 'heal' ? 'fx-heal' : f.kind === 'spark' ? 'fx-spark' : 'fx-dmg'}`}
                initial={{ opacity: 0, y: 6, scale: 0.6 }}
                animate={{ opacity: 1, y: -16, scale: 1 }}
                exit={{ opacity: 0, y: -34 }}
              >
                {f.kind === 'heal' ? `+${f.n}` : f.kind === 'spark' ? `+${f.n} Spark` : `−${f.n}`}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </motion.button>
      <div className="sig-info">
        <div className="sig-nameline">
          <span className="sig-name">{sig.name}</span>
          <span className="sig-title">{sig.title}</span>
        </div>
        <div className="sig-hpbar" aria-hidden>
          <span style={{ width: `${hpPct}%` }} />
        </div>
        <div className="sig-spark" title={`${spark} of ${pl.maxSpark} Spark`}>
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className={`spark-pip ${i < pl.maxSpark ? 'is-max' : ''} ${i < spark ? 'is-lit' : ''} ${i >= pl.maxSpark && i < spark ? 'is-bonus' : ''}`} />
          ))}
          <span className="spark-count">{spark}</span>
        </div>
        <div className="sig-meta">
          {isMine ? (
            <button
              type="button"
              className={`ability ${sel.kind === 'ability' ? 'is-armed' : ''}`}
              disabled={!canAbility || playing}
              title={sig.abilityText}
              onClick={() => {
                if (sig.abilityTarget === 'none') dispatch({ type: 'ability' })
                else select(sel.kind === 'ability' ? { kind: 'none' } : { kind: 'ability' })
              }}
            >
              <span className="ability-name">{sig.abilityName}</span>
              <span className="ability-cost">{sig.abilityCost}</span>
            </button>
          ) : (
            <span className="sig-counts sig-counts-theirs">
              <CardBacks n={pl.hand.length} />
              {enemy && `${pl.hand.length} in hand, ${pl.deck.length} in deck`}
            </span>
          )}
          {isMine && <span className="sig-counts">{pl.deck.length} in deck</span>}
        </div>
      </div>
    </div>
  )
}
