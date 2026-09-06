import { useState } from 'react'
import { SIGNIFICATORS, SUIT_NAMES, card } from '../../data'
import { useStore } from '../store'
import { Card } from '../components/Card'

export function Choose() {
  const goto = useStore((s) => s.goto)
  const startGame = useStore((s) => s.startGame)
  const [mine, setMine] = useState<string>('sig-daxon')
  const [theirs, setTheirs] = useState<string>('random')
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
            <div className="sig-choice-card">
              <Card def={card(s.cardId)} face="upright" size="mini" />
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
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn btn-primary" onClick={begin}>
          Sit down as {my.name}
        </button>
      </div>
    </div>
  )
}
