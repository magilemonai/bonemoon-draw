import { useMemo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { card, significator } from '../../data'
import { attackOf, cardCost, faceDef, healthOf, keywords, previewPlay } from '../../engine/queries'
import type { Face, GameState } from '../../engine/types'
import { useStore } from '../store'
import { recapLines } from '../recap'
import { newDeck, resolveDeck, starterDeck, upsert } from '../decks'
import { Card, RulesText } from './Card'
import { FlipIn } from './CardBack'
import { Sigil } from '../sigils'
import { isLegalDeck } from '../../engine/deck'
import { ArtImage } from './ArtImage'
import { CardInspect, type LiveInfo, type Stats } from './Hero'
import { shortName } from './Card'

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
          <motion.div key={b.id} className={`flash ${b.defId ? 'has-card' : ''}`} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.25 }}>
            {b.defId && (
              <div className="flash-card">
                <FlipIn duration={0.5}>
                  <Card def={card(b.defId)} face={b.face ?? 'upright'} size="full" />
                </FlipIn>
              </div>
            )}
            <span className="flash-text">{b.text}</span>
            {b.sub && <span className={`flash-sub flash-${b.sub}`}>{b.sub}</span>}
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  )
}

// A Read: the player keeps one of the cards shown. Tapping a card inspects it; only the
// Keep button commits, so nobody keeps a card by accident while reading it.
export function ReadChooser({ state }: { state: GameState }) {
  const dispatch = useStore((s) => s.dispatch)
  const inspect = useStore((s) => s.inspect)
  const pend = state.pending
  if (!pend || pend.player !== state.humanPlayer) return null
  return (
    <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="modal read-modal" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="modal-title">Your choice: keep one</div>
        <p className="modal-copy">The rest go to the bottom of your deck. Tap a card to read it in full.</p>
        <div className="read-options">
          {pend.options.map((o, i) => {
            const def = card(o.defId)
            const cost = cardCost(state, pend.player, def.id)
            const kind = def.type === 'figure' ? `${def.attack}/${def.health}` : def.type === 'omen' ? 'Omen' : 'Relic'
            return (
              <div key={o.uid} className={`read-option suit-${def.suit}`}>
                <button type="button" className="read-head" onClick={() => inspect(def.id, 'upright', o.uid)} aria-label={`Inspect ${def.name}`}>
                  <FlipIn delay={0.15 + i * 0.22}>
                    <span className="read-thumb">
                      <Sigil def={def} face="upright" />
                    </span>
                  </FlipIn>
                  <span className="read-title">
                    <span className="read-name">{def.name}</span>
                    <span className="read-kind">
                      {cost} Spark, {kind}
                    </span>
                  </span>
                </button>
                <div className="read-text">
                  <span className="rt-up">
                    <b>Upright</b> <RulesText text={def.upright.text || 'No text.'} />
                  </span>
                  <span className="rt-rev">
                    <b>Reversed</b> <RulesText text={def.reversed.text || 'No text.'} />
                  </span>
                </div>
                <button type="button" className="btn btn-primary read-keep" onClick={() => dispatch({ type: 'choose', uid: o.uid })}>
                  Keep {shortName(def.name)}
                </button>
              </div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

interface CompareCol {
  label: string
  face: Face
  stats: Stats | null // null when the Figure is Fixed
  sub: string
  dead?: boolean
}

function Compare({ a, b }: { a: CompareCol; b: CompareCol }) {
  const col = (c: CompareCol) => (
    <div className={`compare-col for-${c.face} ${c.dead ? 'is-dead' : ''}`}>
      <span className="compare-label">{c.label}</span>
      {c.stats ? (
        <span className="compare-stats" aria-label={`${c.stats.atk} Attack, ${c.stats.hp} Health`}>
          <span className="c-stat">
            <b className="c-atk">{c.stats.atk}</b>
            <small>Attack</small>
          </span>
          <span className="c-stat">
            <b className="c-hp">{c.stats.hp}</b>
            <small>Health</small>
          </span>
        </span>
      ) : (
        <span className="compare-fixed">Fixed</span>
      )}
      {c.sub && <span className="compare-sub">{c.sub}</span>}
    </div>
  )
  return (
    <div className="inspect-compare">
      {col(a)}
      <span className="compare-sep" aria-hidden />
      {col(b)}
    </div>
  )
}

export function InspectModal({ state }: { state: GameState | null }) {
  const sel = useStore((s) => s.selection)
  const close = useStore((s) => s.closeInspect)
  if (sel.kind !== 'inspect') return null
  const def = card(sel.defId)
  const cost = state ? cardCost(state, state.humanPlayer, def.id) : def.cost

  // A specific copy: on the table, say what it is now and what a flip would do; in the
  // hand, say what each face would be on the player's table.
  let live: LiveInfo | undefined
  let compare: { a: CompareCol; b: CompareCol } | null = null
  if (state && sel.uid !== undefined && def.type === 'figure') {
    for (const pl of state.players) {
      for (const f of pl.lanes) {
        if (!f || f.uid !== sel.uid) continue
        const otherFace: Face = f.face === 'upright' ? 'reversed' : 'upright'
        const now = { atk: attackOf(state, f), hp: healthOf(state, f) }
        const flipped = { ...f, face: otherFace }
        const then = { atk: attackOf(state, flipped), hp: healthOf(state, flipped) }
        const fixed = keywords(state, f).includes('fixed')
        const notes: LiveInfo['notes'] = {}
        if (faceDef(def, otherFace).effects?.some((e) => e.trigger === 'arrive')) notes[otherFace] = 'Arrive does not fire on a flip.'
        if (f.hushed) notes[f.face] = 'Hushed: this text is switched off.'
        else if (faceDef(def, f.face).effects?.some((e) => e.trigger === 'arrive')) notes[f.face] = 'Its Arrive has already happened.'
        live = { stats: { [f.face]: now, [otherFace]: then }, notes }
        const wounds = f.damage
        compare = {
          a: { label: 'On the table', face: f.face, stats: now, sub: wounds ? `${wounds} wound${wounds === 1 ? '' : 's'}, kept through a flip` : 'unwounded' },
          b: fixed
            ? { label: 'Turned over', face: otherFace, stats: null, sub: 'it cannot be turned' }
            : { label: 'Turned over', face: otherFace, stats: then, sub: then.hp <= 0 ? 'it dies' : 'it lives', dead: then.hp <= 0 },
        }
      }
    }
    if (!compare) {
      const inHand = state.players[state.humanPlayer].hand.some((h) => h.uid === sel.uid)
      if (inHand) {
        const u = previewPlay(state, state.humanPlayer, def.id, 'upright')
        const r = previewPlay(state, state.humanPlayer, def.id, 'reversed')
        if (u && r) {
          live = { stats: { upright: u, reversed: r } }
          compare = {
            a: { label: 'Upright, on your table', face: 'upright', stats: u, sub: '' },
            b: { label: 'Reversed, on your table', face: 'reversed', stats: r, sub: '' },
          }
        }
      }
    }
  }

  return (
    <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={close}>
      <motion.div className="modal inspect-modal" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={(e) => e.stopPropagation()}>
        <div className="inspect-head">
          <span className="modal-title">{def.name}</span>
          <button type="button" className="btn-quiet" onClick={close}>
            Close
          </button>
        </div>
        {compare && <Compare a={compare.a} b={compare.b} />}
        <CardInspect key={`${def.id}-${sel.face}`} def={def} initialFace={sel.face} cost={cost} live={live} />
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

function resultLine(state: GameState): string {
  const who = state.winner === 'draw' ? null : significator(state.players[state.winner!].sigId)
  return who ? `${who.name}, ${who.title}, holds the table after ${state.round} rounds.` : `Both Significators fell in round ${state.round}.`
}

// What the record says about this match. Renown counts accomplishments and never falls.
function AwardLine({ state }: { state: GameState }) {
  const award = useStore((s) => s.award)
  const humanSig = useStore((s) => s.humanSig)
  const aiSig = useStore((s) => s.aiSig)
  const storageOk = useStore((s) => s.storageOk)
  if (!award || !award.counted) return null
  const win = state.winner === state.humanPlayer
  const opp = significator(aiSig).name
  const hero = significator(humanSig).name
  const kept = storageOk ? '' : ' Saving failed in this browser, so this will not be kept.'
  if (award.conceded) return <p className="award">Conceded. A loss on the record. Renown never falls.{kept}</p>
  if (award.firstClear) {
    return (
      <p className="award">
        <b>+{award.gained} Renown.</b> First win over {opp} as {hero}.{kept}
      </p>
    )
  }
  if (win && !award.eligible) return <p className="award">Won under earlier rules: on the record, no Renown.{kept}</p>
  if (win) return <p className="award">Already on the record: {hero} over {opp}. Renown unchanged.{kept}</p>
  return <p className="award">Recorded. Renown never falls.{kept}</p>
}

// The rematch plays the finished reading's own list again, never a starter in its place.
function RematchButton({ className = 'btn btn-primary' }: { className?: string }) {
  const rematch = useStore((s) => s.rematch)
  const lastDeck = useStore((s) => s.lastDeck)
  const humanSig = useStore((s) => s.humanSig)
  const lesson = useStore((s) => s.lesson)
  if (lesson) return null
  const legal = !!lastDeck && isLegalDeck(humanSig, lastDeck.cards)
  return (
    <button type="button" className={className} onClick={rematch} disabled={!legal} title={legal ? '' : 'That list is not legal under these rules'}>
      Draw again
      {lastDeck ? <small className="btn-note">{lastDeck.starter ? lastDeck.name : `${lastDeck.name}, revision ${lastDeck.rev}`}</small> : null}
    </button>
  )
}

// The recap and the way back into the list: what decided the reading, which list it was,
// and the door to edit it and play the same opponent again.
function Recap() {
  const last = useStore((s) => s.lastMatch)
  const decks = useStore((s) => s.decks)
  const setDecks = useStore((s) => s.setDecks)
  const openBuilder = useStore((s) => s.openBuilder)
  const startGame = useStore((s) => s.startGame)
  const lines = useMemo(() => (last ? recapLines(last) : []), [last])
  if (!last) return null
  const deck = last.deck
  const edit = () => {
    if (!deck) return
    const existing = deck.starter ? null : resolveDeck(decks, deck.id)
    if (existing) {
      openBuilder(existing.id, last.aiSig)
      return
    }
    // A starter, or a deck since deleted: edit a copy of the list as it was played.
    const from = deck.starter ? starterDeck(last.humanSig) : { id: deck.id, name: deck.name, sig: last.humanSig, cards: deck.cards, rev: deck.rev, updated: 0 }
    const d = newDeck(decks, last.humanSig, from)
    setDecks(upsert(decks, d))
    openBuilder(d.id, last.aiSig)
  }
  const otherSeat = () => startGame(last.humanSig, last.aiSig, undefined, deck, { seed: last.seed, firstPlayer: last.seat === 'first' ? 1 : 0, trial: last.trial })
  return (
    <div className="recap">
      {deck && (
        <p className="recap-deck">
          Played with {deck.name}
          {deck.starter ? '' : `, revision ${deck.rev}`}
          {last.trial === 'seat-token' ? ', under the seat trial' : ''}.
        </p>
      )}
      {lines.length > 0 && (
        <ul className="recap-lines" aria-label="What decided it">
          {lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      )}
      <div className="recap-actions">
        {deck && (
          <button type="button" className="btn" onClick={edit}>
            {deck.starter ? 'Edit a copy of this deck' : 'Edit this deck'}
          </button>
        )}
        <button type="button" className="btn-quiet" onClick={otherSeat} title="The same list and the same deal, from the other seat">
          Play the other seat
        </button>
      </div>
    </div>
  )
}

export function GameOver({ state }: { state: GameState }) {
  const goto = useStore((s) => s.goto)
  const queue = useStore((s) => s.queue)
  const reviewing = useStore((s) => s.reviewing)
  const setReviewing = useStore((s) => s.setReviewing)
  if (state.phase !== 'over' || queue.length > 0 || reviewing) return null
  const win = state.winner === state.humanPlayer
  return (
    <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
      <motion.div className={`modal gameover ${win ? 'is-win' : 'is-loss'}`} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.3 }}>
        <div className="gameover-moon" aria-hidden />
        <div className="modal-title">{state.winner === 'draw' ? 'Both readings end together' : win ? 'The reading is yours' : 'The reading goes against you'}</div>
        <p className="modal-copy">{resultLine(state)}</p>
        <AwardLine state={state} />
        <Recap />
        <div className="modal-actions">
          <RematchButton />
          <button type="button" className="btn" onClick={() => setReviewing(true)}>
            Review the final turn
          </button>
          <button type="button" className="btn" onClick={() => goto('choose')}>
            Change Significator
          </button>
          <button type="button" className="btn-quiet" onClick={() => goto('title')}>
            Title screen
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// After "Review the final turn": the table stays as it ended, the log is open, and the
// ways out sit in a strip instead of a modal.
export function OverStrip({ state }: { state: GameState }) {
  const goto = useStore((s) => s.goto)
  return (
    <div className="over-strip" role="status">
      <span className="over-strip-text">{resultLine(state)} Tap any card to inspect it.</span>
      <AwardLine state={state} />
      <RematchButton />
      <button type="button" className="btn-quiet" onClick={() => goto('choose')}>
        Change Significator
      </button>
      <button type="button" className="btn-quiet" onClick={() => goto('title')}>
        Title screen
      </button>
    </div>
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
