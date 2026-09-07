import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { significator } from '../../data'
import { RULES_VERSION } from '../../engine/rules'
import { useStore } from '../store'
import { completed, exportProfile, parseProfile, renownOf, type Profile } from '../profile'

function when(ms: number): string {
  try {
    return new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

// The record itself: the last readings, and a way to carry the record to another browser.
export function RecordModal({ onClose }: { onClose: () => void }) {
  const profile = useStore((s) => s.profile)
  const replace = useStore((s) => s.replaceProfile)
  const [pasted, setPasted] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [incoming, setIncoming] = useState<Profile | null>(null)
  const text = exportProfile(profile)
  const done = completed(profile)
  const recent = profile.matches.slice(-20).reverse()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setCopied(false)
      setError('Copy did not work here. Select the text and copy it yourself.')
    }
  }
  const check = () => {
    setError(null)
    setIncoming(null)
    try {
      const p = parseProfile(JSON.parse(pasted))
      if (!p) setError('That is not a Moonwyld record.')
      else setIncoming(p)
    } catch {
      setError('That is not a Moonwyld record.')
    }
  }

  // Rendered at the body so the title screen's painting cannot sit on top of it.
  return createPortal(
    <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose}>
      <motion.div className="modal record-modal" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={(e) => e.stopPropagation()}>
        <div className="inspect-head">
          <span className="modal-title">Your record</span>
          <button type="button" className="btn-quiet" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="modal-copy">
          {done.games} reading{done.games === 1 ? '' : 's'} completed, {done.wins} won, {renownOf(profile)} Renown.
          {profile.abandoned > 0 ? ` ${profile.abandoned} reading${profile.abandoned === 1 ? '' : 's'} left unfinished, not counted.` : ''} Kept in this browser only. The last 200 readings are kept in detail; the totals are for life.
        </p>

        {recent.length > 0 && (
          <div className="record-list" aria-label="Recent readings">
            <div className="record-head">Last {recent.length} reading{recent.length === 1 ? '' : 's'}</div>
            {recent.map((m) => (
              <div key={m.id} className={`record-row is-${m.result}`}>
                <span className="record-when">{when(m.when)}</span>
                <span className="record-who">
                  {significator(m.hero).name} against {significator(m.opponent).name}
                </span>
                <span className="record-meta">
                  {m.seat} seat, round {m.rounds}
                  {m.version !== RULES_VERSION ? ', earlier rules' : ''}
                </span>
                <span className="record-result">{m.conceded ? 'conceded' : m.result === 'win' ? 'won' : m.result === 'loss' ? 'lost' : 'drawn'}</span>
              </div>
            ))}
          </div>
        )}

        <div className="record-io">
          <label className="record-field">
            Carry it to another browser: copy this text
            <textarea readOnly value={text} rows={3} onFocus={(e) => e.currentTarget.select()} />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={copy}>
              {copied ? 'Copied' : 'Copy the record'}
            </button>
          </div>
          <label className="record-field">
            Bring a record here: paste it, then replace
            <textarea value={pasted} rows={3} onChange={(e) => setPasted(e.target.value)} placeholder="Paste a copied record" />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn" disabled={!pasted.trim()} onClick={check}>
              Check it
            </button>
            {incoming && (
              <>
                <span className="record-note">
                  This replaces {done.games} reading{done.games === 1 ? '' : 's'} and {renownOf(profile)} Renown with {completed(incoming).games} and {renownOf(incoming)}.
                </span>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    replace(incoming)
                    setIncoming(null)
                    setPasted('')
                  }}
                >
                  Replace my record
                </button>
              </>
            )}
          </div>
          {error && <p className="record-error">{error}</p>}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
