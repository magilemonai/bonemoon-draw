import { useState } from 'react'
import { SIGNIFICATORS, SUIT_NAMES, significator } from '../../data'
import { DECK_SIZE, deckProblems } from '../../engine/deck'
import { useStore } from '../store'
import { ArtImage } from '../components/ArtImage'
import { cleared, heroRecord, matchupKey } from '../profile'
import { decksFor, resolveDeck, starterId } from '../decks'
import { PLAYSTYLE, shortSigName } from '../names'

export function Choose() {
  const goto = useStore((s) => s.goto)
  const startGame = useStore((s) => s.startGame)
  const openBuilder = useStore((s) => s.openBuilder)
  const profile = useStore((s) => s.profile)
  const decks = useStore((s) => s.decks)
  const preset = useStore((s) => s.choosePreset)
  const saved = useStore((s) => s.savedMatch)
  const [mine, setMine] = useState<string>(preset?.mine ?? 'sig-daxon')
  const [theirs, setTheirs] = useState<string>(preset?.theirs ?? 'random')
  const [trial, setTrial] = useState<'' | 'seat-token'>('')
  const [deckId, setDeckId] = useState<string>(preset?.deck ?? starterId(preset?.mine ?? 'sig-daxon'))
  const my = significator(mine)
  const deck = resolveDeck(decks, deckId) ?? resolveDeck(decks, starterId(mine))!
  const problems = deckProblems(mine, deck.cards)
  const ready = problems.length === 0

  const pick = (id: string) => {
    setMine(id)
    if (resolveDeck(decks, deckId)?.sig !== id) setDeckId(starterId(id))
    if (theirs === id) setTheirs('random')
  }

  const begin = () => {
    let opp = theirs
    if (opp === 'random') {
      const pool = SIGNIFICATORS.filter((s) => s.id !== mine)
      opp = pool[Math.floor(Math.random() * pool.length)].id
    }
    startGame(mine, opp, deck.id, undefined, trial ? { trial } : undefined)
  }

  return (
    <div className="choose">
      <div className="choose-head">
        <button type="button" className="btn-quiet" onClick={() => goto('title')}>
          Title screen
        </button>
        <h2>Choose your character</h2>
        <span className="choose-sub">Your Significator is the card that stands for you at the table. Tap one to read about it.</span>
        <button type="button" className="btn choose-learn" onClick={() => goto('lessons')}>
          Tutorial: three short lessons
        </button>
      </div>
      <div className="sig-grid">
        {SIGNIFICATORS.map((s) => {
          const picked = mine === s.id
          const rec = heroRecord(profile, s.id)
          return (
            <button key={s.id} type="button" className={`sig-choice suit-${s.suits[0]} ${picked ? 'is-picked' : ''}`} onClick={() => pick(s.id)} aria-pressed={picked}>
              <div className="sig-choice-portrait">
                <ArtImage id={s.id} />
              </div>
              <div className="sig-choice-body">
                <span className="sig-choice-name">{s.name}</span>
                <span className="sig-choice-title">
                  {s.title}, {SUIT_NAMES[s.suits[0]]} and {SUIT_NAMES[s.suits[1]]}
                </span>
                <span className="sig-choice-style">{PLAYSTYLE[s.id]}</span>
                {rec.games > 0 && (
                  <span className="sig-choice-record">
                    {cleared(profile, s.id).length} of 5 opponents beaten, {rec.wins} of {rec.games} readings won
                  </span>
                )}
                {picked && (
                  <span className="sig-choice-detail">
                    <span>
                      <b>Passive.</b> {s.passive}
                    </span>
                    <span>
                      <b>
                        {s.abilityName} ({s.abilityCost} Spark).
                      </b>{' '}
                      {s.abilityText}
                    </span>
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="choose-foot">
        <div className="choose-picks">
          <label className="choose-opp">
            Deck
            <select value={deck.id} onChange={(e) => setDeckId(e.target.value)} aria-label="Which deck">
              <option value={starterId(mine)}>{my.deckName} (starter)</option>
              {decksFor(decks, mine).map((d) => {
                const ok = deckProblems(mine, d.cards).length === 0
                return (
                  <option key={d.id} value={d.id}>
                    {d.name}
                    {ok ? '' : ` (${d.cards.length} of ${DECK_SIZE}, not ready)`}
                  </option>
                )
              })}
            </select>
          </label>
          <label className="choose-opp">
            Against
            <select value={theirs} onChange={(e) => setTheirs(e.target.value)} aria-label="Which opponent">
              <option value="random">Anyone (the table picks)</option>
              {SIGNIFICATORS.filter((s) => s.id !== mine).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                  {profile.best[matchupKey(mine, s.id)]?.standard ? ' (beaten)' : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="choose-trial">
            <span>Experiment</span>
            <select value={trial} onChange={(e) => setTrial(e.target.value as '' | 'seat-token')} aria-label="Play under an experiment">
              <option value="">Shipped rules</option>
              <option value="seat-token">Seat trial: the second player opens with a Spent Sphere</option>
            </select>
            {trial && <span className="choose-trial-note">An experiment on the seat gap. A reading under a trial is on the record as one and earns no Renown. Afterwards, Play the other seat repeats the same deal from the other side.</span>}
          </label>
          <button type="button" className="btn-quiet" onClick={() => openBuilder(deck.id)}>
            {deck.id === starterId(mine) ? 'Look at this deck' : 'Edit this deck'}
          </button>
        </div>
        <div className="choose-go">
          <span className="choose-summary">
            {shortSigName(mine, my.name)} with {deck.name}
            {theirs === 'random' ? '' : `, against ${shortSigName(theirs)}`}
            {ready ? '' : `. ${problems[0]}`}
          </span>
          <button type="button" className="btn btn-primary btn-big" onClick={begin} disabled={!ready}>
            Play
            {saved ? <small className="btn-note">This replaces the unfinished reading</small> : null}
          </button>
        </div>
      </div>
    </div>
  )
}
