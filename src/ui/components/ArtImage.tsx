import { useState } from 'react'
import { artSrc } from '../art'

const EXTS = ['jpg', 'png', 'webp']

// Loads the embedded copy (single-file build) or public/art/<id>.<ext>, trying jpg, png, webp.
// Pass `ext` to try one format only (the UI kit is transparent PNG). Renders nothing if absent.
export function ArtImage({ id, className, alt = '', onLoad, ext }: { id: string; className?: string; alt?: string; onLoad?: () => void; ext?: string }) {
  const [i, setI] = useState(0)
  const exts = ext ? [ext] : EXTS
  if (i >= exts.length) return null
  const src = artSrc(id, exts[i])
  if (!src) return null
  return <img className={className} src={src} alt={alt} draggable={false} onLoad={onLoad} onError={() => setI((n) => n + 1)} />
}
