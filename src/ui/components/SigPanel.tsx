import { AnimatePresence, motion } from 'motion/react'
import { card, significator } from '../../data'
import { attackLanes, availableSpark, resolveDefender, sameRef, targetsFor } from '../../engine/queries'
import { attackOutcome } from '../../engine/preview'
import type { GameState, PlayerId } from '../../engine/types'
import { useStore } from '../store'
import { computeHighlights } from './Board'
import { ArtImage } from './ArtImage'
import { shortSigName } from '../names'

const HAND_MAX = 8

function Portrait({ sigId, size }: { sigId: string; size: number }) {
  const sig = significator(sigId)
  return (
    <div className="portrait" style={{ width: size, height: size }}>
      <ArtImage id={sig.id} />
    </div>
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

  // What the selected Figure's attack would do to this Significator.
  let previewText: string | null = null
  if (isTarget && sel.kind === 'figure') {
    const atk = state.players[state.humanPlayer].lanes[sel.lane]
    const tl = atk ? attackLanes(state, atk).find((l) => sameRef(resolveDefender(state, atk, l), ref)) : undefined
    if (atk && tl !== undefined) {
      const o = attackOutcome(state, sel.lane, tl)
      previewText = !o.exact ? `Takes ${o.deals} before its text.` : o.lethal ? `Takes ${o.deals}. Lethal.` : `Takes ${o.deals}.`
    }
  }

  const onSigClick = () => {
    if (!isTarget) return
    if (sel.kind === 'hand' && sel.face) {
      const inst = state.players[state.humanPlayer].hand.find((h) => h.uid === sel.uid)
      if (inst && card(inst.defId).type === 'figure') {
        // A Figure's Arrive target: remember it, then ask for the lane.
        select({ ...sel, target: ref })
        return
      }
      dispatch({ type: 'play', uid: sel.uid, face: sel.face, target: ref })
    } else if (sel.kind === 'figure') {
      const atk = state.players[state.humanPlayer].lanes[sel.lane]
      const tl = atk ? attackLanes(state, atk).find((l) => sameRef(resolveDefender(state, atk, l), ref)) : undefined
      if (atk) dispatch({ type: 'attack', lane: sel.lane, targetLane: tl ?? atk.lane })
    } else if (sel.kind === 'ability') dispatch({ type: 'ability', target: ref })
  }

  const handClass = pl.hand.length >= HAND_MAX ? 'is-full' : pl.hand.length === HAND_MAX - 1 ? 'is-near' : ''

  const health = Math.max(0, pl.health)
  return (
    <div className={`sig ${isMine ? 'sig-mine' : 'sig-theirs'} ${isTarget ? 'is-target' : ''} ${state.active === player ? 'is-active' : ''}`}>
      <div className="sig-top">
        <motion.button
          type="button"
          className="sig-portrait"
          onClick={onSigClick}
          animate={lunge ? { scale: [1, 0.96, 1] } : { scale: 1 }}
          aria-label={`${sig.name}, ${health} Health${previewText ? `. ${previewText}` : ''}`}
        >
          <Portrait sigId={sig.id} size={isMine ? 56 : 44} />
          {previewText && (
            <span className="sig-preview" aria-hidden>
              {previewText}
            </span>
          )}
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
        <div className="sig-names">
          {!isMine && <span className="sig-role">Opponent</span>}
          <span className="sig-name" title={`${sig.name}, ${sig.title}`}>
            {isMine ? sig.name : shortSigName(sig.id, sig.name)}
          </span>
          {isMine && <span className="sig-title">{sig.title}</span>}
        </div>
        <span className="sig-health" title="Health">
          <b>{health}</b> <small>Health</small>
        </span>
      </div>
      <div className="sig-hpbar" aria-hidden>
        <span style={{ width: `${hpPct}%` }} />
      </div>
      <div className="sig-numbers">
        <span className="sig-num sig-num-spark" title={pl.tempSpark > 0 ? `${pl.tempSpark} of it only this turn` : undefined}>
          <small>Spark</small>
          <b>
            {spark}
            <span className="sig-num-max"> / {pl.maxSpark}</span>
          </b>
          {pl.tempSpark > 0 && <em>+{pl.tempSpark} this turn</em>}
        </span>
        <span className={`sig-num sig-num-hand ${handClass}`}>
          <small>Hand</small>
          <b>
            {pl.hand.length}
            <span className="sig-num-max"> / {HAND_MAX}</span>
          </b>
        </span>
        <span className="sig-num">
          <small>Deck</small>
          <b>{pl.deck.length}</b>
        </span>
      </div>
      {isMine && (
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
          <span className="ability-cost">{sig.abilityCost} Spark</span>
        </button>
      )}
    </div>
  )
}
