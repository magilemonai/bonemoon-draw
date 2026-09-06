import { ART_INLINE } from '../generated/art-inline'

// Where an art asset lives: the embedded copy (single-file build) or public/art/<id>.jpg.
// Returns null only when the embedded map is in use and lacks the id, which means the file is known to be absent.
export function artSrc(id: string, ext = 'jpg'): string | null {
  const inline = ART_INLINE[id.replace('/', '__')] ?? ART_INLINE[id]
  if (inline) return inline
  if (Object.keys(ART_INLINE).length > 0) return null
  return `${import.meta.env.BASE_URL}art/${id}.${ext}`
}
