import { useState } from 'react'
import { motion } from 'motion/react'
import { significator } from '../../data'
import { useStore } from '../store'
import { MoonDisc } from '../components/Moon'
import { ArtImage } from '../components/ArtImage'
import { RecordModal } from '../components/Record'
import { completed, favourite, formFor, nextGoal, rankOf, renownOf } from '../profile'

// What the player has done, what to do next, and the reading they left unfinished.
function Standing({ onRecord }: { onRecord: () => void }) {
  const profile = useStore((s) => s.profile)
  const saved = useStore((s) => s.savedMatch)
  const stale = useStore((s) => s.staleMatch)
  const storageOk = useStore((s) => s.storageOk)
  const resume = useStore((s) => s.resumeGame)
  const dismissStale = useStore((s) => s.dismissStale)
  const openChoose = useStore((s) => s.openChoose)
  const renown = renownOf(profile)
  const rank = rankOf(renown)
  const goal = nextGoal(profile)
  const done = completed(profile)
  const fav = favourite(profile)
  const form = fav ? formFor(profile, fav) : null
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
      {stale && (
        <p className="standing-stale">
          The unfinished reading ({significator(stale.humanSig).name} against {significator(stale.aiSig).name}, round {stale.round}) was started under earlier rules and cannot continue. Your record is untouched.{' '}
          <button type="button" className="btn-quiet" onClick={dismissStale}>
            Set it aside
          </button>
        </p>
      )}
      {goal && (
        <button type="button" className="btn standing-goal" onClick={() => openChoose({ mine: goal.hero, theirs: goal.opponent })}>
          {goal.text}
        </button>
      )}
      {done.games > 0 && (
        <p className="standing-form">
          {done.games} reading{done.games === 1 ? '' : 's'} completed, {done.wins} won
          {profile.abandoned > 0 ? `, ${profile.abandoned} left unfinished` : ''}.
          {form && fav ? ` ${significator(fav).name} under these rules: last 10 readings ${form.last.wins} won, the 10 before ${form.before.wins} won.` : ''}
        </p>
      )}
      {done.games === 0 && <p className="standing-form">Renown records what you have done at the table. It never falls.</p>}
      <p className="standing-store">
        {storageOk ? 'Saved in this browser only.' : 'Saving failed in this browser: this session is not being kept.'}{' '}
        <button type="button" className="btn-quiet" onClick={onRecord}>
          Your record
        </button>
      </p>
    </div>
  )
}

export function Title() {
  const goto = useStore((s) => s.goto)
  const saved = useStore((s) => s.savedMatch)
  const [painted, setPainted] = useState(false)
  const [record, setRecord] = useState(false)
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
      <h1 className="title-name">Moonwyld</h1>
      <p className="title-sub">A tarot battler set in Valisar. Every card has two faces. Choose the one you play, and turn the ones they play.</p>
      <div className="title-actions">
        <button type="button" className={`btn ${saved ? '' : 'btn-primary'}`} onClick={() => goto('choose')}>
          {saved ? 'New reading' : 'Begin a reading'}
        </button>
        <button type="button" className="btn" onClick={() => goto('codex')}>
          The Codex
        </button>
        <button type="button" className="btn" onClick={() => goto('rules')}>
          How to play
        </button>
      </div>
      <Standing onRecord={() => setRecord(true)} />
      {record && <RecordModal onClose={() => setRecord(false)} />}
      <p className="title-foot">The stars observe everything that occurs beneath them. They always have.</p>
    </div>
  )
}
