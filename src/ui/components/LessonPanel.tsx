import { useEffect, useRef, useState } from 'react'
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
  const [expanded, setExpanded] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!nudge) return
    const t = window.setTimeout(clearNudge, 2600)
    return () => window.clearTimeout(t)
  }, [nudge, clearNudge])
  // A new step opens the panel again, folded to its first lines.
  useEffect(() => {
    setOpen(true)
    setExpanded(false)
  }, [stepNo])
  if (!lesson) return null
  const def = lessonById(lesson.id)
  if (!def) return null
  const index = LESSONS.findIndex((l) => l.id === def.id)
  const step = currentStep(def, lesson.progress)
  const next = LESSONS[index + 1]
  const trouble = lesson.progress.missed ? (step?.missedSay ?? 'That turn ended before the step was done. Retry this step.') : lesson.stuck ? (step?.stuckSay ?? 'This position cannot finish the step. Retry this step.') : null

  if (lesson.progress.complete) {
    return (
      <div className="lesson-panel is-complete" role="status" ref={box}>
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
    <div className={`lesson-panel ${step?.free ? 'is-free' : ''} ${open ? '' : 'is-shut'} ${trouble ? 'is-trouble' : ''}`} role="status" aria-live="polite" ref={box}>
      <div className="lesson-panel-top">
        <span className="lesson-panel-head">
          Lesson {index + 1} of {LESSONS.length}: {def.title}. Step {lesson.progress.step + 1} of {def.steps.length}
          {step?.free ? ', on your own' : ''}
        </span>
        <button type="button" className="btn-quiet lesson-panel-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? 'Hide' : 'Show'}
        </button>
      </div>
      {open && !trouble && (
        <p className={`lesson-panel-say ${expanded ? '' : 'is-folded'}`} onClick={() => setExpanded((v) => !v)}>
          {step?.say}
        </p>
      )}
      {open && !trouble && (
        <button type="button" className="btn-quiet lesson-panel-more" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
          {expanded ? 'Less' : 'More'}
        </button>
      )}
      {trouble && <p className="lesson-panel-nudge">{trouble}</p>}
      {nudge && !trouble && <p className="lesson-panel-nudge">{nudge}</p>}
      {open && (expanded || !!trouble) && (
        <div className="lesson-panel-actions">
          <button type="button" className={trouble ? 'btn btn-primary' : 'btn-quiet'} onClick={retryStep}>
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
