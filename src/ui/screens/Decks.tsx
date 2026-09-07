import { useState } from 'react'
import { SIGNIFICATORS, SUIT_NAMES } from '../../data'
import { DECK_SIZE, deckProblems } from '../../engine/deck'
import { useStore } from '../store'
import { ArtImage } from '../components/ArtImage'
import { decksFor, newDeck, remove, starterDeck, upsert, type DeckList } from '../decks'
import { deckRecord } from '../profile'

function DeckRow({ deck, starter }: { deck: DeckList; starter: boolean }) {
  const decks = useStore((s) => s.decks)
  const setDecks = useStore((s) => s.setDecks)
  const openBuilder = useStore((s) => s.openBuilder)
  const openChoose = useStore((s) => s.openChoose)
  const profile = useStore((s) => s.profile)
  const [confirm, setConfirm] = useState(false)
  const problems = deckProblems(deck.sig, deck.cards)
  const legal = problems.length === 0
  const rec = deckRecord(profile, deck.id)
  return (
    <div className={`deck-row ${legal ? '' : 'is-incomplete'}`}>
      <div className="deck-row-main">
        <span className="deck-row-name">{deck.name}</span>
        <span className="deck-row-meta">
          {deck.cards.length} of {DECK_SIZE} cards{starter ? ', the starter list' : `, revision ${deck.rev}`}
          {legal ? '' : `. ${problems[0]}`}
          {rec.games > 0 ? `. ${rec.wins} of ${rec.games} readings won with it` : ''}
        </span>
      </div>
      <div className="deck-row-actions">
        <button type="button" className="btn btn-primary" disabled={!legal} onClick={() => openChoose({ mine: deck.sig, theirs: 'random', deck: deck.id })}>
          Play
        </button>
        <button type="button" className="btn" onClick={() => openBuilder(deck.id)}>
          {starter ? 'Look' : 'Edit'}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            const d = newDeck(decks, deck.sig, deck)
            setDecks(upsert(decks, d))
            openBuilder(d.id)
          }}
        >
          {starter ? 'Copy and edit' : 'Duplicate'}
        </button>
        {!starter && !confirm && (
          <button type="button" className="btn-quiet" onClick={() => setConfirm(true)}>
            Delete
          </button>
        )}
        {!starter && confirm && (
          <>
            <button type="button" className="btn" onClick={() => setDecks(remove(decks, deck.id))}>
              Delete {deck.name}
            </button>
            <button type="button" className="btn-quiet" onClick={() => setConfirm(false)}>
              Keep it
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export function Decks() {
  const goto = useStore((s) => s.goto)
  const decks = useStore((s) => s.decks)
  const setDecks = useStore((s) => s.setDecks)
  const openBuilder = useStore((s) => s.openBuilder)
  return (
    <div className="decks">
      <div className="choose-head">
        <button type="button" className="btn-quiet" onClick={() => goto('title')}>
          Title screen
        </button>
        <h2>Your decks</h2>
        <span className="choose-sub">
          Thirty cards from your Significator's two suits and the Major Arcana. Two copies of a Minor at most, one of a Major, never your own card. Every starter can be copied and changed.
        </span>
      </div>
      {SIGNIFICATORS.map((s) => (
        <section key={s.id} className={`deck-group suit-${s.suits[0]}`} aria-label={`${s.name}'s decks`}>
          <div className="deck-group-head">
            <div className="portrait" style={{ width: 44, height: 44 }}>
              <ArtImage id={s.id} />
            </div>
            <div className="deck-group-title">
              <span className="deck-group-name">{s.name}</span>
              <span className="deck-group-suits">
                {SUIT_NAMES[s.suits[0]]} and {SUIT_NAMES[s.suits[1]]}
              </span>
            </div>
            <button
              type="button"
              className="btn"
              onClick={() => {
                const d = newDeck(decks, s.id)
                setDecks(upsert(decks, d))
                openBuilder(d.id)
              }}
            >
              New empty deck
            </button>
          </div>
          <DeckRow deck={starterDeck(s.id)} starter />
          {decksFor(decks, s.id).map((d) => (
            <DeckRow key={d.id} deck={d} starter={false} />
          ))}
        </section>
      ))}
    </div>
  )
}
