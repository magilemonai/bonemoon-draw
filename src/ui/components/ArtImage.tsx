import { useState } from 'react'
import { ART_INLINE } from '../../generated/art-inline'

const EXTS = ['jpg', 'png', 'webp']

// Loads the embedded copy (single-file build) or public/art/<id>.jpg, then .png, then .webp.
// Renders nothing if none exist.
export function ArtImage({ id, className, alt = '', onLoad }: { id: string; className?: string; alt?: string; onLoad?: () => void }) {
  const [i, setI] = useState(0)
  if (i >= EXTS.length) return null
  const src = ART_INLINE[id] ?? `${import.meta.env.BASE_URL}art/${id}.${EXTS[i]}`
  return <img className={className} src={src} alt={alt} draggable={false} onLoad={onLoad} onError={() => setI((n) => n + 1)} />
}
