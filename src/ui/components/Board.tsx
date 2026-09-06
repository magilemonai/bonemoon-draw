import { AnimatePresence, motion } from 'motion/react'
import { card } from '../../data'
import { attackLanes, attackOf, canAttack, canMove, healthOf, keywords, maxHealthOf, other, resolveDefender, targetsFor, sameRef, cardCost, playableFaces } from '../../engine/queries'
import type { FigureInstance, GameState, LaneIndex, PlayerId, TargetRef } from '../../engine/types'
import { LANE_NAMES } from '../../engine/types'
import { useStore, type Selection } from '../store'
import { Card } from './Card'
import { significator } from '../../data'
import { ArtImage } from './ArtImage'

// Which slots light up given the current selection?
export function computeHighlights(state: GameState, sel: Selection): { targets: TargetRef[]; lanes: LaneIndex[]; moves: LaneIndex[] } {
  const p = state.humanPlayer
  const me = state.players[p]
  if (state.active !== p || state.pending) return { targets: [], lanes: [], moves: [] }
  switch (sel.kind) {
    case 'hand': {
      if (!sel.face) return { targets: [], lanes: [], moves: [] }
      const inst = me.hand.find((h) => h.uid === sel.uid)
      if (!inst) return { targets: [], lanes: [], moves: [] }
      const def = card(inst.defId)
      const fd = sel.face === 'upright' ? def.upright : def.reversed
      if (def.type === 'figure') {
        // Figures with an Arrive target: choose the target first, then the lane.
        if (fd.target && fd.target !== 'none' && !sel.target) {
          const targets = targetsFor(state, p, fd.target)
          if (targets.length) return { targets, lanes: [], moves: [] }
        }
        const lanes = ([0, 1, 2] as LaneIndex[]).filter((l) => me.lanes[l] === null)
        return { targets: [], lanes, moves: [] }
      }
      if (def.type === 'relic') return { targets: targetsFor(state, p, 'friendlyFigure'), lanes: [], moves: [] }
      if (fd.target && fd.target !== 'none') return { targets: targetsFor(state, p, fd.target, { fromOmen: true }), lanes: [], moves: [] }
      return { targets: [], lanes: [], moves: [] }
    }
    case 'figure': {
      const fig = me.lanes[sel.lane]
      if (!fig) return { targets: [], lanes: [], moves: [] }
      const targets: TargetRef[] = []
      if (canAttack(state, fig)) for (const tl of attackLanes(state, fig)) targets.push(resolveDefender(state, fig, tl))
      const moves: LaneIndex[] = []
      if (canMove(state, fig)) for (const l of [sel.lane - 1, sel.lane + 1] as LaneIndex[]) if (l >= 0 && l <= 2 && me.lanes[l] === null) moves.push(l)
      return { targets, lanes: [], moves }
    }
    case 'ability': {
      const sig = significator(me.sigId)
      return { targets: targetsFor(state, p, sig.abilityTarget, { fromAbility: true }), lanes: [], moves: [] }
    }
    default:
      return { targets: [], lanes: [], moves: [] }
  }
}

// After an Arrive with a target: figure needs both a lane and a target. We collect the
// target first when the card asks for one, then the lane.
export function figureNeedsTarget(state: GameState, defId: string, face: 'upright' | 'reversed'): boolean {
  const def = card(defId)
  const fd = face === 'upright' ? def.upright : def.reversed
  if (def.type !== 'figure' || !fd.target || fd.target === 'none') return false
  return targetsFor(state, state.humanPlayer, fd.target).length > 0
}

function Slot({ state, owner, lane, fig, isMine }: { state: GameState; owner: PlayerId; lane: LaneIndex; fig: FigureInstance | null; isMine: boolean }) {
  const sel = useStore((s) => s.selection)
  const fx = useStore((s) => s.fx)
  const select = useStore((s) => s.select)
  const inspect = useStore((s) => s.inspect)
  const dispatch = useStore((s) => s.dispatch)
  const playing = useStore((s) => s.playing)
  const uiKit = useStore((s) => s.uiKit)
  const hl = computeHighlights(state, sel)
  const ref: TargetRef = { kind: 'figure', player: owner, lane }
  const isTarget = hl.targets.some((t) => sameRef(t, ref))
  const isLane = isMine && !fig && hl.lanes.includes(lane)
  const isMove = isMine && !fig && hl.moves.includes(lane)
  const myTurn = state.active === state.humanPlayer && !state.pending
  const p = state.humanPlayer

  const slotFx = fx.filter((f) => f.ref && sameRef(f.ref, ref) && (f.kind === 'damage' || f.kind === 'heal'))
  const lungeFx = fx.find((f) => f.kind === 'lunge' && f.ref && sameRef(f.ref, ref))
  const lunge = lungeFx ? (isMine ? -34 : 34) : 0

  const onClick = () => {
    if (playing && !fig) return
    if (isTarget) {
      // Complete the selected action with this figure as the target.
      if (sel.kind === 'hand' && sel.face) {
        const inst = state.players[p].hand.find((h) => h.uid === sel.uid)!
        const def = card(inst.defId)
        if (def.type === 'figure') {
          // Arrive target chosen; now we need a lane. Stash the target on the selection.
          select({ ...sel, target: ref })
          return
        }
        dispatch({ type: 'play', uid: sel.uid, face: sel.face, target: ref })
      } else if (sel.kind === 'figure') {
        const atk = state.players[p].lanes[sel.lane]!
        // Find the lane whose resolved defender is this ref.
        const tl = attackLanes(state, atk).find((l) => sameRef(resolveDefender(state, atk, l), ref))
        dispatch({ type: 'attack', lane: sel.lane, targetLane: tl ?? lane })
      } else if (sel.kind === 'ability') {
        dispatch({ type: 'ability', target: ref })
      }
      return
    }
    if (isLane && sel.kind === 'hand' && sel.face) {
      dispatch({ type: 'play', uid: sel.uid, face: sel.face, lane, target: sel.target })
      return
    }
    if (isMove && sel.kind === 'figure') {
      dispatch({ type: 'move', lane: sel.lane, to: lane })
      return
    }
    if (fig) {
      if (isMine && myTurn) {
        if (sel.kind === 'figure' && sel.lane === lane) inspect(fig.defId, fig.face, fig.uid)
        else select({ kind: 'figure', lane })
      } else {
        inspect(fig.defId, fig.face, fig.uid)
      }
      return
    }
    select({ kind: 'none' })
  }

  const highlight = isTarget ? 'target' : isLane ? 'lane' : isMove ? 'move' : 'none'
  const ready = !!fig && isMine && myTurn && (canAttack(state, fig) || canMove(state, fig))

  return (
    <div className={`slot ${isMine ? 'slot-mine' : 'slot-theirs'} hl-${highlight} ${fig ? 'has-fig' : 'is-empty'}`} id={`slot-${owner}-${lane}`} onClick={fig ? undefined : onClick} role={fig ? undefined : 'button'} tabIndex={fig ? undefined : 0}>
      <span className="slot-name">{LANE_NAMES[lane]}</span>
      {!fig && uiKit && <ArtImage id="ui/lane-mark" ext="png" className="slot-mark" />}
      <AnimatePresence mode="popLayout">
        {fig && (
          <motion.div
            key={fig.uid}
            className="slot-fig"
            initial={{ opacity: 0, scale: 0.7, y: isMine ? 60 : -60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: isMine ? -14 : 14, filter: 'blur(4px)', transition: { duration: 0.45 } }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <Card
              def={card(fig.defId)}
              face={fig.face}
              size="lane"
              atk={attackOf(state, fig)}
              hp={healthOf(state, fig)}
              maxHp={maxHealthOf(state, fig)}
              kws={keywords(state, fig)}
              hushed={fig.hushed}
              aegis={fig.aegis}
              asleep={fig.asleep}
              relics={fig.relics}
              selected={sel.kind === 'figure' && isMine && sel.lane === lane}
              highlight={highlight}
              ready={ready}
              layoutId={`card-${fig.uid}`}
              lunge={lunge}
              onClick={onClick}
              onInspect={() => inspect(fig.defId, fig.face, fig.uid)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="slot-fx">
        <AnimatePresence>
          {slotFx.map((f) => (
            <motion.span
              key={f.id}
              className={`fxnum ${f.kind === 'heal' ? 'fx-heal' : f.absorbed ? 'fx-absorb' : 'fx-dmg'}`}
              initial={{ opacity: 0, y: 8, scale: 0.6 }}
              animate={{ opacity: 1, y: -18, scale: 1 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
            >
              {f.kind === 'heal' ? `+${f.n}` : f.absorbed ? 'Aegis' : `−${f.n}`}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function Board({ state }: { state: GameState }) {
  const me = state.humanPlayer
  const them = other(me)
  const tableArt = useStore((s) => s.tableArt)
  return (
    <div className={`board ${tableArt ? 'has-cloth' : ''}`}>
      {tableArt && <ArtImage id="table" className="board-cloth" />}
      <div className="lane-row lane-row-theirs">
        {([0, 1, 2] as LaneIndex[]).map((l) => (
          <Slot key={l} state={state} owner={them} lane={l} fig={state.players[them].lanes[l]} isMine={false} />
        ))}
      </div>
      <div className="lane-row lane-row-mine">
        {([0, 1, 2] as LaneIndex[]).map((l) => (
          <Slot key={l} state={state} owner={me} lane={l} fig={state.players[me].lanes[l]} isMine />
        ))}
      </div>
    </div>
  )
}

export { cardCost, playableFaces }
