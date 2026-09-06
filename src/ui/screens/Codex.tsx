import { useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { DECK_CARDS, SUIT_NAMES, TOKENS } from '../../data'
import type { Suit } from '../../engine/types'
import { useStore } from '../store'
import { Card } from '../components/Card'
import { InspectModal } from '../components/Overlays'

const RANK_ORDER = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'page', 'knight', 'queen', 'king']

export function Codex() {
  const goto = useStore((s) => s.goto)
  const inspect = useStore((s) => s.inspect)
  const sel = useStore((s) => s.selection)
  const [suit, setSuit] = useState<Suit | 'tokens'>('major')
  const [q, setQ] = useState('')

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
        <span className="codex-sub">Seventy-eight cards. Tap one to read both faces.</span>
      </div>
      <div className="codex-tabs" role="tablist">
        {(['major', 'suns', 'antlers', 'tides', 'gears', 'tokens'] as const).map((s) => (
          <button key={s} type="button" role="tab" aria-selected={suit === s} className={`tab suit-${s} ${suit === s ? 'is-on' : ''}`} onClick={() => setSuit(s)}>
            {s === 'tokens' ? 'Tokens' : SUIT_NAMES[s]}
          </button>
        ))}
        <input className="codex-search" placeholder="Search names and text" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search the codex" />
      </div>
      <div className="codex-grid">
        {cards.map((c) => (
          <Card key={c.id} def={c} face="upright" size="hand" onClick={() => inspect(c.id, 'upright')} />
        ))}
      </div>
      <AnimatePresence>{sel.kind === 'inspect' && <InspectModal key="inspect" state={null} />}</AnimatePresence>
    </div>
  )
}
