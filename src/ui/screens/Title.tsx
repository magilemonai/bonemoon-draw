import { useState } from 'react'
import { motion } from 'motion/react'
import { significator } from '../../data'
import { useStore } from '../store'
import { MoonDisc } from '../components/Moon'
import { ArtImage } from '../components/ArtImage'
import { nextGoal, rankOf, recentForm, renownOf } from '../profile'

// What the player has done, what to do next, and the reading they left unfinished.
function Standing() {
  const profile = useStore((s) => s.profile)
  const saved = useStore((s) => s.savedMatch)
  const resume = useStore((s) => s.resumeGame)
  const renown = renownOf(profile)
  const rank = rankOf(renown)
  const goal = nextGoal(profile)
  const form = recentForm(profile)
  const played = profile.matches.length
  return (
    <div className="standing" aria-label="Your standing">
      <div className="standing-rank">
        <span className="standing-title">{rank.name}</span>
        <span className="standing-renown">{renown} Renown</span>
        {rank.next && <span className="standing-next">{rank.next.at - renown} to {rank.next.name}</span>}
        {!rank.next && <span className="standing-next">Every opponent beaten with every Significator.</span>}
      </div>
      {saved && (
        <button type="button" className="btn btn-primary standing-continue" onClick={resume}>
          Continue the reading
          <small>
            {significator(saved.humanSig).name} against {significator(saved.aiSig).name}, round {saved.committed.round}
          </small>
        </button>
      )}
      {goal && <p className="standing-goal">{goal.text}</p>}
      {played > 0 && (
        <p className="standing-form">
          {form.before.games >= 20 ? `Last 20 readings: ${form.last.wins} won. The 20 before: ${form.before.wins} won.` : `${played} reading${played === 1 ? '' : 's'} completed, ${form.last.wins + form.before.wins} won.`}
        </p>
      )}
      {played === 0 && <p className="standing-form">Renown records what you have done at the table. It never falls.</p>}
    </div>
  )
}

export function Title() {
  const goto = useStore((s) => s.goto)
  const [painted, setPainted] = useState(false)
  return (
    <div className={`title ${painted ? 'has-painting' : ''}`}>
      <div className="title-painting" aria-hidden>
        <ArtImage id="title" onLoad={() => setPainted(true)} />
      </div>
      {!painted && (
        <motion.div className="title-moon" initial={false} animate={{ y: [4, -4, 4] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}>
          <MoonDisc phase="waxing" bone={false} size={132} />
        </motion.div>
      )}
      <h1 className="title-name">The Bonemoon Draw</h1>
      <p className="title-sub">A tarot battler set in Valisar. Every card has two faces. Choose the one you play, and turn the ones they play.</p>
      <div className="title-actions">
        <button type="button" className="btn btn-primary" onClick={() => goto('choose')}>
          Begin a reading
        </button>
        <button type="button" className="btn" onClick={() => goto('codex')}>
          The Codex
        </button>
        <button type="button" className="btn" onClick={() => goto('rules')}>
          How to play
        </button>
      </div>
      <Standing />
      <p className="title-foot">The stars observe everything that occurs beneath them. They always have.</p>
    </div>
  )
}
