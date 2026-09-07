import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { LESSONS, currentStep, lessonById } from '../../tutorial/lessons'

// The lesson's voice at the table: which step, what to do, and the ways out.
export function LessonPanel() {
  const lesson = useStore((s) => s.lesson)
  const retryStep = useStore((s) => s.retryStep)
  const leaveLesson = useStore((s) => s.leaveLesson)
  const startLesson = useStore((s) => s.startLesson)
  const clearNudge = useStore((s) => s.clearNudge)
  const nudge = lesson?.nudge ?? null
  const stepNo = lesson?.progress.step ?? 0
  const [open, setOpen] = useState(true)
  useEffect(() => {
    if (!nudge) return
    const t = window.setTimeout(clearNudge, 2600)
    return () => window.clearTimeout(t)
  }, [nudge, clearNudge])
  // A new step opens the panel again.
  useEffect(() => {
    setOpen(true)
  }, [stepNo])
  if (!lesson) return null
  const def = lessonById(lesson.id)
  if (!def) return null
  const index = LESSONS.findIndex((l) => l.id === def.id)
  const step = currentStep(def, lesson.progress)
  const next = LESSONS[index + 1]

  if (lesson.progress.complete) {
    return (
      <div className="lesson-panel is-complete" role="status">
        <span className="lesson-panel-head">
          Lesson {index + 1} of {LESSONS.length}: {def.title}
        </span>
        <p className="lesson-panel-say">Done. {next ? `Next: ${next.title}.` : 'That is all three. The table is yours.'}</p>
        <div className="lesson-panel-actions">
          {next && (
            <button type="button" className="btn btn-primary" onClick={() => startLesson(next.id)}>
              Next lesson
            </button>
          )}
          <button type="button" className="btn" onClick={leaveLesson}>
            All lessons
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`lesson-panel ${step?.free ? 'is-free' : ''} ${open ? '' : 'is-shut'}`} role="status" aria-live="polite">
      <div className="lesson-panel-top">
        <span className="lesson-panel-head">
          Lesson {index + 1} of {LESSONS.length}: {def.title}. Step {lesson.progress.step + 1} of {def.steps.length}
          {step?.free ? ', on your own' : ''}
        </span>
        <button type="button" className="btn-quiet lesson-panel-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? 'Hide' : 'Show'}
        </button>
      </div>
      {open && <p className="lesson-panel-say">{step?.say}</p>}
      {nudge && <p className="lesson-panel-nudge">{nudge}</p>}
      {open && (
        <div className="lesson-panel-actions">
          <button type="button" className="btn-quiet" onClick={retryStep}>
            Retry this step
          </button>
          <button type="button" className="btn-quiet" onClick={leaveLesson}>
            Leave the lesson
          </button>
        </div>
      )}
    </div>
  )
}
