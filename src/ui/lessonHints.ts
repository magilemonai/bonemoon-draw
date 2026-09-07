import { useStore } from './store'
import { hintsFor, lessonById, type LessonHint } from '../tutorial/lessons'

const NONE: LessonHint[] = []

// What the current lesson step lights up, or nothing outside a lesson.
export function useLessonHints(): LessonHint[] {
  const lesson = useStore((s) => s.lesson)
  if (!lesson) return NONE
  const def = lessonById(lesson.id)
  return def ? hintsFor(def, lesson.progress) : NONE
}
