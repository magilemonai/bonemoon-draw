import { significator } from '../../data'
import { useStore } from '../store'
import { LESSONS } from '../../tutorial/lessons'
import { shortSigName } from '../names'

export function Lessons() {
  const goto = useStore((s) => s.goto)
  const startLesson = useStore((s) => s.startLesson)
  const profile = useStore((s) => s.profile)
  const done = profile.lessons ?? {}
  return (
    <div className="lessons">
      <div className="choose-head">
        <button type="button" className="btn-quiet" onClick={() => goto('title')}>
          Title screen
        </button>
        <h2>Tutorial</h2>
        <span className="choose-sub">
          Three short lessons on fixed positions. Each one tells you what to do, lights up where to tap, and ends with a small problem you solve on your own. The opponent only ends turns, and nothing here goes on your record.
        </span>
      </div>
      <div className="lesson-list">
        {LESSONS.map((l, i) => (
          <div key={l.id} className={`lesson-card ${done[l.id] ? 'is-done' : ''}`}>
            <div className="lesson-card-body">
              <span className="lesson-card-n">Lesson {i + 1}</span>
              <span className="lesson-card-title">{l.title}</span>
              <span className="lesson-card-blurb">{l.blurb}</span>
              <span className="lesson-card-meta">
                You play {shortSigName(l.sigs[0], significator(l.sigs[0]).name)} against {shortSigName(l.sigs[1], significator(l.sigs[1]).name)}. {l.steps.length} steps.
                {done[l.id] ? ' Completed.' : ''}
              </span>
            </div>
            <button type="button" className={`btn ${done[l.id] ? '' : 'btn-primary'}`} onClick={() => startLesson(l.id)}>
              {done[l.id] ? 'Play it again' : 'Start'}
            </button>
          </div>
        ))}
      </div>
      <p className="lessons-foot">
        The full rules are on the{' '}
        <button type="button" className="btn-quiet" onClick={() => goto('rules')}>
          How to play
        </button>{' '}
        page.
      </p>
    </div>
  )
}
