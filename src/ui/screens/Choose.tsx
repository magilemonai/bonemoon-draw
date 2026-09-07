import { useState } from 'react'
import { SIGNIFICATORS, SUIT_NAMES } from '../../data'
import { useStore } from '../store'
import { ArtImage } from '../components/ArtImage'
import { cleared, heroRecord, matchupKey } from '../profile'

export function Choose() {
  const goto = useStore((s) => s.goto)
  const startGame = useStore((s) => s.startGame)
  const profile = useStore((s) => s.profile)
  const preset = useStore((s) => s.choosePreset)
  const saved = useStore((s) => s.savedMatch)
  const [mine, setMine] = useState<string>(preset?.mine ?? 'sig-daxon')
  const [theirs, setTheirs] = useState<string>(preset?.theirs ?? 'random')
  const my = SIGNIFICATORS.find((s) => s.id === mine)!

  const begin = () => {
    let opp = theirs
    if (opp === 'random') {
      const pool = SIGNIFICATORS.filter((s) => s.id !== mine)
      opp = pool[Math.floor(Math.random() * pool.length)].id
    }
    startGame(mine, opp)
  }

  return (
    <div className="choose">
      <div className="choose-head">
        <button type="button" className="btn-quiet" onClick={() => goto('title')}>
          Back
        </button>
        <h2>Choose your Significator</h2>
        <span className="choose-sub">The card that stands for you at the table. Each comes with its own 30-card reading.</span>
      </div>
      <div className="sig-grid">
        {SIGNIFICATORS.map((s) => (
          <button key={s.id} type="button" className={`sig-choice suit-${s.suits[0]} ${mine === s.id ? 'is-picked' : ''}`} onClick={() => setMine(s.id)}>
            <div className="sig-choice-portrait">
              <ArtImage id={s.id} />
            </div>
            <div className="sig-choice-body">
              <span className="sig-choice-name">{s.name}</span>
              <span className="sig-choice-title">
                {s.numeral}. {s.title}
              </span>
              <span className="sig-choice-deck">
                {s.deckName}: {SUIT_NAMES[s.suits[0]]} and {SUIT_NAMES[s.suits[1]]}
              </span>
              <span className="sig-choice-passive">{s.passive}</span>
              <span className="sig-choice-ability">
                {s.abilityName} ({s.abilityCost}): {s.abilityText}
              </span>
              {heroRecord(profile, s.id).games > 0 && (
                <span className="sig-choice-record">
                  {cleared(profile, s.id).length} of 5 opponents beaten, {heroRecord(profile, s.id).wins} of {heroRecord(profile, s.id).games} readings won
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      <div className="choose-foot">
        <label className="choose-opp">
          Across the table
          <select value={theirs} onChange={(e) => setTheirs(e.target.value)}>
            <option value="random">Anyone (random)</option>
            {SIGNIFICATORS.filter((s) => s.id !== mine).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}, {s.title}
                {profile.best[matchupKey(mine, s.id)]?.standard ? ' (beaten)' : ''}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn btn-primary" onClick={begin}>
          Sit down as {my.name}
          {saved ? <small className="btn-note">This replaces the unfinished reading</small> : null}
        </button>
      </div>
    </div>
  )
}
