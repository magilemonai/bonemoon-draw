import { useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { SUIT_NAMES, card, significator } from '../../data'
import { DECK_SIZE, addProblem, cardPoolFor, countOf, deckProblems, deckShape, maxCopies } from '../../engine/deck'
import type { CardDef, Keyword, Suit } from '../../engine/types'
import { useStore } from '../store'
import { InspectModal } from '../components/Overlays'
import { RulesText } from '../components/Card'
import { Sigil } from '../sigils'
import { isStarterId, newDeck, resolveDeck, upsert, withCards, withName, type DeckList } from '../decks'
import { deckRecord } from '../profile'

const RANK_ORDER = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', 'ace', 'page', 'knight', 'queen', 'king']
const KEYWORDS: Keyword[] = ['guard', 'windborne', 'veiled', 'fixed', 'rekindle', 'feast', 'aegis', 'gale', 'whisper', 'dormant']
const KW_LABEL: Record<Keyword, string> = { guard: 'Guard', windborne: 'Windborne', veiled: 'Veiled', fixed: 'Fixed', rekindle: 'Rekindle', feast: 'Feast', aegis: 'Aegis', gale: 'Gale', whisper: 'Whisper', entersReversed: 'Enters Reversed', dormant: 'Dormant' }
const COSTS: { label: string; test: (c: number) => boolean }[] = [
  { label: '0 to 1', test: (c) => c <= 1 },
  { label: '2', test: (c) => c === 2 },
  { label: '3', test: (c) => c === 3 },
  { label: '4', test: (c) => c === 4 },
  { label: '5', test: (c) => c === 5 },
  { label: '6 and up', test: (c) => c >= 6 },
]

function rankKey(c: CardDef): number {
  if (c.suit === 'major') return Number(c.rank)
  const i = RANK_ORDER.indexOf(c.rank)
  return i >= 0 ? i : Number(c.rank) + 1
}

function keywordsOf(c: CardDef): Keyword[] {
  const out = new Set<Keyword>()
  for (const k of c.upright.keywords ?? []) out.add(k)
  for (const k of c.reversed.keywords ?? []) out.add(k)
  for (const k of c.relic?.upright.keywords ?? []) out.add(k)
  for (const k of c.relic?.reversed.keywords ?? []) out.add(k)
  out.delete('entersReversed')
  return [...out]
}

// One card in the browser: art, name, cost, both faces, and how many are in the deck.
export function CardRow({ def, count, onAdd, onRemove, addWhy, readOnly }: { def: CardDef; count: number; onAdd?: () => void; onRemove?: () => void; addWhy: string | null; readOnly?: boolean }) {
  const inspect = useStore((s) => s.inspect)
  const [why, setWhy] = useState(false)
  const stats = def.type === 'figure' ? `${def.attack}/${def.health}` : def.type === 'omen' ? 'Omen' : 'Relic'
  return (
    <div className={`card-row suit-${def.suit} ${count > 0 ? 'is-in' : ''}`}>
      <button type="button" className="card-row-art" onClick={() => inspect(def.id, 'upright')} aria-label={`Inspect ${def.name}`}>
        <Sigil def={def} face="upright" />
      </button>
      <div className="card-row-body">
        <div className="card-row-head">
          <span className="card-row-cost" title="Spark cost">
            {def.cost}
          </span>
          <button type="button" className="card-row-name" onClick={() => inspect(def.id, 'upright')}>
            {def.name}
          </button>
          <span className="card-row-kind">
            {def.suit === 'major' ? def.numeral : SUIT_NAMES[def.suit]}, {stats}
          </span>
        </div>
        <p className="card-row-face">
          <b>Upright</b> <RulesText text={def.upright.text || 'No text.'} />
        </p>
        <p className="card-row-face is-reversed">
          <b>Reversed</b> {def.reversed.name ? <i>{def.reversed.name}. </i> : null}
          <RulesText text={def.reversed.text || 'No text.'} />
        </p>
        {why && addWhy && <p className="card-row-why">{addWhy}</p>}
      </div>
      {!readOnly && (
        <div className="card-row-qty" aria-label={`${count} of ${maxCopies(def)} in the deck`}>
          <button type="button" className="qty-btn" disabled={count === 0} onClick={onRemove} aria-label={`Remove ${def.name}`}>
            −
          </button>
          <span className="qty-count">
            {count}
            <small>of {maxCopies(def)}</small>
          </span>
          <button
            type="button"
            className={`qty-btn ${addWhy ? 'is-off' : ''}`}
            aria-disabled={!!addWhy}
            onClick={() => {
              if (addWhy) setWhy(true)
              else {
                setWhy(false)
                onAdd?.()
              }
            }}
            aria-label={`Add ${def.name}`}
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}

export function Builder() {
  const goto = useStore((s) => s.goto)
  const decks = useStore((s) => s.decks)
  const setDecks = useStore((s) => s.setDecks)
  const buildingId = useStore((s) => s.buildingId)
  const openBuilder = useStore((s) => s.openBuilder)
  const openChoose = useStore((s) => s.openChoose)
  const profile = useStore((s) => s.profile)
  const sel = useStore((s) => s.selection)
  const [q, setQ] = useState('')
  const [suit, setSuit] = useState<Suit | 'all'>('all')
  const [type, setType] = useState<'all' | 'figure' | 'omen' | 'relic'>('all')
  const [cost, setCost] = useState<number>(-1)
  const [kw, setKw] = useState<Keyword | 'all'>('all')
  const [tab, setTab] = useState<'cards' | 'deck'>('cards')

  const deck = buildingId ? resolveDeck(decks, buildingId) : null
  if (!deck) {
    return (
      <div className="builder">
        <div className="choose-head">
          <button type="button" className="btn-quiet" onClick={() => goto('decks')}>
            Your decks
          </button>
          <h2>That deck is gone</h2>
        </div>
      </div>
    )
  }
  const sig = significator(deck.sig)
  const starter = isStarterId(deck.id)
  const pool = cardPoolFor(deck.sig)
  const problems = deckProblems(deck.sig, deck.cards)
  const legal = problems.length === 0
  const shape = deckShape(deck.cards)
  const rec = deckRecord(profile, deck.id)
  const recRev = deckRecord(profile, deck.id, deck.rev)
  const update = (d: DeckList) => setDecks(upsert(decks, d))

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return pool
      .filter((c) => suit === 'all' || c.suit === suit)
      .filter((c) => type === 'all' || c.type === type)
      .filter((c) => cost < 0 || COSTS[cost].test(c.cost))
      .filter((c) => kw === 'all' || keywordsOf(c).includes(kw))
      .filter((c) => !needle || `${c.name} ${c.upright.name ?? ''} ${c.reversed.name ?? ''} ${c.upright.text} ${c.reversed.text}`.toLowerCase().includes(needle))
      .sort((a, b) => (a.suit === b.suit ? rankKey(a) - rankKey(b) : a.suit === 'major' ? 1 : b.suit === 'major' ? -1 : a.suit.localeCompare(b.suit)))
  }, [pool, q, suit, type, cost, kw])

  // The list, grouped by printed cost.
  const grouped = useMemo(() => {
    const byId = new Map<string, number>()
    for (const id of deck.cards) byId.set(id, (byId.get(id) ?? 0) + 1)
    return [...byId.entries()].map(([id, n]) => ({ def: card(id), n })).sort((a, b) => a.def.cost - b.def.cost || a.def.name.localeCompare(b.def.name))
  }, [deck.cards])

  const add = (id: string) => update(withCards(deck, [...deck.cards, id]))
  const removeOne = (id: string) => {
    const i = deck.cards.lastIndexOf(id)
    if (i >= 0) update(withCards(deck, [...deck.cards.slice(0, i), ...deck.cards.slice(i + 1)]))
  }
  const copyToEdit = () => {
    const d = newDeck(decks, deck.sig, deck)
    setDecks(upsert(decks, d))
    openBuilder(d.id)
  }
  const maxCurve = Math.max(1, ...shape.curve)

  const list = (
    <aside className="builder-list" aria-label="The deck">
      <div className="builder-list-head">
        <span className="builder-count">
          {deck.cards.length} <small>of {DECK_SIZE}</small>
        </span>
        <span className="builder-shape">
          Figures {shape.figures}, Omens {shape.omens}, Relics {shape.relics}
        </span>
      </div>
      <div className="builder-curve" aria-label="Cards by printed cost">
        {shape.curve.map((n, i) => (
          <span key={i} className="curve-col" title={`${n} at cost ${i === 8 ? '8 and up' : i}`}>
            <span className="curve-bar" style={{ height: `${(n / maxCurve) * 100}%` }} />
            <span className="curve-n">{n || ''}</span>
            <span className="curve-label">{i === 8 ? '8+' : i}</span>
          </span>
        ))}
      </div>
      <p className="builder-note">Printed costs. {sig.name}'s discounts are not applied.</p>
      {problems.length > 0 && (
        <ul className="builder-problems" aria-label="Before it can be played">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
      <div className="builder-cards">
        {grouped.map(({ def, n }) => (
          <div key={def.id} className={`list-row suit-${def.suit}`}>
            <span className="card-row-cost">{def.cost}</span>
            <button type="button" className="list-row-name" onClick={() => useStore.getState().inspect(def.id, 'upright')}>
              {def.name}
            </button>
            <span className="list-row-n">×{n}</span>
            {!starter && (
              <button type="button" className="qty-btn" onClick={() => removeOne(def.id)} aria-label={`Remove ${def.name}`}>
                −
              </button>
            )}
          </div>
        ))}
        {grouped.length === 0 && <p className="builder-empty">Nothing yet. Add cards from the list.</p>}
      </div>
    </aside>
  )

  return (
    <div className="builder">
      <div className="builder-head">
        <div className="builder-head-row">
          <button type="button" className="btn-quiet" onClick={() => goto('decks')}>
            Your decks
          </button>
          <span className="builder-sig">
            {sig.name}, {SUIT_NAMES[sig.suits[0]]} and {SUIT_NAMES[sig.suits[1]]}
          </span>
        </div>
        <div className="builder-head-row">
          {starter ? (
            <h2 className="builder-name-static">{deck.name}</h2>
          ) : (
            <input className="builder-name" value={deck.name} onChange={(e) => update(withName(deck, e.target.value))} aria-label="Deck name" />
          )}
          <span className="builder-count-inline">
            {deck.cards.length} of {DECK_SIZE}
          </span>
          {rec.games > 0 && (
            <span className="builder-record">
              {rec.wins} of {rec.games} readings won across all revisions
              {recRev.games > 0 ? `; this revision ${recRev.wins} of ${recRev.games}` : '; this revision unplayed'}
            </span>
          )}
        </div>
        <div className="builder-head-row builder-actions">
          {starter ? (
            <button type="button" className="btn btn-primary" onClick={copyToEdit}>
              Copy and edit
            </button>
          ) : null}
          <button type="button" className="btn btn-primary" disabled={!legal} onClick={() => openChoose({ mine: deck.sig, theirs: 'random', deck: deck.id })} title={legal ? '' : problems.join(' ')}>
            Play this deck
          </button>
          {!legal && <span className="builder-blocked">{problems[0]}</span>}
        </div>
      </div>

      <div className="builder-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'cards'} className={`tab ${tab === 'cards' ? 'is-on' : ''}`} onClick={() => setTab('cards')}>
          Cards
        </button>
        <button type="button" role="tab" aria-selected={tab === 'deck'} className={`tab ${tab === 'deck' ? 'is-on' : ''}`} onClick={() => setTab('deck')}>
          Deck {deck.cards.length}/{DECK_SIZE}
        </button>
      </div>

      <div className={`builder-body is-${tab}`}>
        <div className="builder-browser">
          <div className="builder-filters">
            <input className="codex-search" placeholder="Search names and text on both faces" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search cards, both faces" />
            <div className="filter-row" role="group" aria-label="Suit">
              {(['all', sig.suits[0], sig.suits[1], 'major'] as const).map((s) => (
                <button key={s} type="button" className={`chip ${suit === s ? 'is-on' : ''}`} onClick={() => setSuit(s)}>
                  {s === 'all' ? 'All suits' : SUIT_NAMES[s]}
                </button>
              ))}
            </div>
            <div className="filter-row" role="group" aria-label="Type and cost">
              {(['all', 'figure', 'omen', 'relic'] as const).map((t) => (
                <button key={t} type="button" className={`chip ${type === t ? 'is-on' : ''}`} onClick={() => setType(t)}>
                  {t === 'all' ? 'Any type' : t === 'figure' ? 'Figures' : t === 'omen' ? 'Omens' : 'Relics'}
                </button>
              ))}
              <span className="filter-gap" />
              <button type="button" className={`chip ${cost < 0 ? 'is-on' : ''}`} onClick={() => setCost(-1)}>
                Any cost
              </button>
              {COSTS.map((c, i) => (
                <button key={c.label} type="button" className={`chip ${cost === i ? 'is-on' : ''}`} onClick={() => setCost(i)}>
                  {c.label}
                </button>
              ))}
            </div>
            <div className="filter-row" role="group" aria-label="Keyword">
              <button type="button" className={`chip ${kw === 'all' ? 'is-on' : ''}`} onClick={() => setKw('all')}>
                Any keyword
              </button>
              {KEYWORDS.map((k) => (
                <button key={k} type="button" className={`chip ${kw === k ? 'is-on' : ''}`} onClick={() => setKw(k)}>
                  {KW_LABEL[k]}
                </button>
              ))}
            </div>
            <p className="builder-note">
              {shown.length} of {pool.length} cards {sig.name} may use.
            </p>
          </div>
          <div className="card-rows">
            {shown.map((c) => (
              <CardRow key={c.id} def={c} count={countOf(deck.cards, c.id)} addWhy={addProblem(deck.sig, deck.cards, c.id)} onAdd={() => add(c.id)} onRemove={() => removeOne(c.id)} readOnly={starter} />
            ))}
          </div>
        </div>
        {list}
      </div>
      <AnimatePresence>{sel.kind === 'inspect' && <InspectModal key="inspect" state={null} />}</AnimatePresence>
    </div>
  )
}
