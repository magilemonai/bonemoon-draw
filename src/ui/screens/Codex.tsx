import { useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { DECK_CARDS, SUIT_NAMES, TOKENS } from '../../data'
import type { Suit } from '../../engine/types'
import { useStore } from '../store'
import { Card } from '../components/Card'
import { InspectModal } from '../components/Overlays'
import { Sigil } from '../sigils'
import { CardRow } from './Builder'

const RANK_ORDER = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'page', 'knight', 'queen', 'king']

export function Codex() {
  const goto = useStore((s) => s.goto)
  const inspect = useStore((s) => s.inspect)
  const sel = useStore((s) => s.selection)
  const [suit, setSuit] = useState<Suit | 'tokens'>('major')
  const [q, setQ] = useState('')
  const [view, setView] = useState<'paintings' | 'cards' | 'library'>('library')

  const cards = useMemo(() => {
    const pool = suit === 'tokens' ? TOKENS : DECK_CARDS.filter((c) => c.suit === suit)
    const sorted = pool.slice().sort((a, b) => {
      if (a.suit === 'major' && b.suit === 'major') return Number(a.rank) - Number(b.rank)
      return RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank)
    })
    if (!q.trim()) return sorted
    const needle = q.toLowerCase()
    return sorted.filter((c) => `${c.name} ${c.upright.text} ${c.reversed.text} ${c.flavor} ${c.upright.name ?? ''} ${c.reversed.name ?? ''}`.toLowerCase().includes(needle))
  }, [suit, q])

  return (
    <div className="codex">
      <div className="codex-head">
        <button type="button" className="btn-quiet" onClick={() => goto('title')}>
          Back
        </button>
        <h2>The Codex</h2>
        <span className="codex-sub">Seventy-eight cards. Tap one to read both faces, or build a deck from them.</span>
        <button type="button" className="btn" onClick={() => goto('decks')}>
          Build a deck
        </button>
      </div>
      <div className="codex-tabs" role="tablist">
        {(['major', 'suns', 'antlers', 'tides', 'gears', 'tokens'] as const).map((s) => (
          <button key={s} type="button" role="tab" aria-selected={suit === s} className={`tab suit-${s} ${suit === s ? 'is-on' : ''}`} onClick={() => setSuit(s)}>
            {s === 'tokens' ? 'Tokens' : SUIT_NAMES[s]}
          </button>
        ))}
        <input className="codex-search" placeholder="Search names and text" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search the codex" />
        <span className="codex-view" role="group" aria-label="View">
          <button type="button" className={view === 'library' ? 'is-on' : ''} onClick={() => setView('library')}>
            Library
          </button>
          <button type="button" className={view === 'paintings' ? 'is-on' : ''} onClick={() => setView('paintings')}>
            Paintings
          </button>
          <button type="button" className={view === 'cards' ? 'is-on' : ''} onClick={() => setView('cards')}>
            Cards
          </button>
        </span>
      </div>
      {view === 'library' ? (
        <div className="card-rows codex-rows">
          {cards.map((c) => (
            <CardRow key={c.id} def={c} count={0} addWhy={null} readOnly />
          ))}
        </div>
      ) : view === 'cards' ? (
        <div className="codex-grid">
          {cards.map((c) => (
            <Card key={c.id} def={c} face="upright" size="hand" onClick={() => inspect(c.id, 'upright')} />
          ))}
        </div>
      ) : (
        <div className="gallery">
          {cards.map((c) => (
            <button key={c.id} type="button" className={`gallery-tile suit-${c.suit}`} onClick={() => inspect(c.id, 'upright')}>
              <span className="gallery-art">
                <Sigil def={c} face="upright" />
              </span>
              <span className="gallery-name">{c.name}</span>
            </button>
          ))}
        </div>
      )}
      <AnimatePresence>{sel.kind === 'inspect' && <InspectModal key="inspect" state={null} />}</AnimatePresence>
    </div>
  )
}
