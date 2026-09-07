import { useStore } from './store'
import { hintsFor, lessonById, type LessonHint } from '../tutorial/lessons'

const NONE: LessonHint[] = []

// What the current lesson step lights up, read from the table as it stands.
export function useLessonHints(): LessonHint[] {
  const lesson = useStore((s) => s.lesson)
  const state = useStore((s) => s.committed)
  if (!lesson || !state) return NONE
  const def = lessonById(lesson.id)
  return def ? hintsFor(def, lesson.progress, state) : NONE
}
