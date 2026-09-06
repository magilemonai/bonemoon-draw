// Procedural card art. Every card gets a hand-drawn-looking sigil built from its
// suit and rank, so the deck reads as one object even before real art is dropped
// into /public/art/<card-id>.png. When that file exists, it replaces the sigil.

import { useState } from 'react'
import type { CardDef, Face } from '../engine/types'
import { artSrc } from './art'

const SUIT_INK: Record<string, string> = {
  suns: '#c9962b',
  antlers: '#4d7f57',
  tides: '#2f7f8f',
  gears: '#a8623a',
  major: '#6e5ab8',
}

const SUIT_WASH: Record<string, [string, string]> = {
  suns: ['#f3e2b0', '#d9b35c'],
  antlers: ['#cfe0c6', '#7fa889'],
  tides: ['#c6e2e6', '#5fa2ad'],
  gears: ['#ead6c0', '#c48a5e'],
  major: ['#d9d3f2', '#8f7fd0'],
}

// A stable pseudo-random from a string so each card's stars land in the same place.
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}
function rand(seed: number) {
  let t = seed
  return () => {
    t = (t + 0x6d2b79f5) | 0
    let x = Math.imul(t ^ (t >>> 15), t | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function Emblem({ suit, size, ink }: { suit: string; size: number; ink: string }) {
  const r = size / 2
  switch (suit) {
    case 'suns': {
      // Sixteen-point Sakazarac sunburst.
      const pts: string[] = []
      for (let i = 0; i < 32; i++) {
        const a = (i / 32) * Math.PI * 2 - Math.PI / 2
        const rad = i % 2 === 0 ? r : r * 0.62
        pts.push(`${(Math.cos(a) * rad).toFixed(2)},${(Math.sin(a) * rad).toFixed(2)}`)
      }
      return (
        <g>
          <polygon points={pts.join(' ')} fill="none" stroke={ink} strokeWidth={1.6} />
          <circle r={r * 0.36} fill="none" stroke={ink} strokeWidth={1.6} />
          <circle r={r * 0.1} fill={ink} />
        </g>
      )
    }
    case 'antlers': {
      const branch = (sx: number) => (
        <path
          d={`M0,${r * 0.9} C0,${r * 0.2} ${sx * r * 0.2},${-r * 0.1} ${sx * r * 0.55},${-r * 0.55}
              M${sx * r * 0.12},${r * 0.28} L${sx * r * 0.5},${r * 0.1}
              M${sx * r * 0.22},${-r * 0.05} L${sx * r * 0.62},${-r * 0.18}
              M${sx * r * 0.36},${-r * 0.32} L${sx * r * 0.75},${-r * 0.5}
              M${sx * r * 0.5},${-r * 0.5} L${sx * r * 0.55},${-r * 0.85}`}
          fill="none"
          stroke={ink}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      )
      return (
        <g>
          {branch(1)}
          {branch(-1)}
          <circle cy={r * 0.92} r={r * 0.08} fill={ink} />
        </g>
      )
    }
    case 'tides': {
      const wave = (y: number, amp: number, op: number) => (
        <path
          d={`M${-r},${y} C${-r * 0.7},${y - amp} ${-r * 0.4},${y + amp} ${-r * 0.1},${y} S${r * 0.5},${y - amp} ${r},${y}`}
          fill="none"
          stroke={ink}
          strokeWidth={1.7}
          opacity={op}
          strokeLinecap="round"
        />
      )
      return (
        <g>
          {wave(-r * 0.35, r * 0.22, 0.7)}
          {wave(0, r * 0.26, 1)}
          {wave(r * 0.35, r * 0.22, 0.7)}
          <circle cy={-r * 0.72} r={r * 0.12} fill="none" stroke={ink} strokeWidth={1.4} />
        </g>
      )
    }
    case 'gears': {
      const teeth = 12
      const pts: string[] = []
      for (let i = 0; i < teeth * 2; i++) {
        const a = (i / (teeth * 2)) * Math.PI * 2
        const rad = i % 2 === 0 ? r : r * 0.8
        pts.push(`${(Math.cos(a) * rad).toFixed(2)},${(Math.sin(a) * rad).toFixed(2)}`)
      }
      return (
        <g>
          <polygon points={pts.join(' ')} fill="none" stroke={ink} strokeWidth={1.6} strokeLinejoin="round" />
          <circle r={r * 0.5} fill="none" stroke={ink} strokeWidth={1.4} />
          <circle r={r * 0.16} fill="none" stroke={ink} strokeWidth={1.4} />
          {[0, 60, 120].map((d) => (
            <line key={d} x1={-r * 0.5} y1={0} x2={r * 0.5} y2={0} transform={`rotate(${d})`} stroke={ink} strokeWidth={1} opacity={0.6} />
          ))}
        </g>
      )
    }
    default: {
      // Major: an eight-point star inside a ring.
      const pts: string[] = []
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 - Math.PI / 2
        const rad = i % 2 === 0 ? r : r * 0.42
        pts.push(`${(Math.cos(a) * rad).toFixed(2)},${(Math.sin(a) * rad).toFixed(2)}`)
      }
      return (
        <g>
          <circle r={r * 1.05} fill="none" stroke={ink} strokeWidth={1.2} opacity={0.6} />
          <polygon points={pts.join(' ')} fill="none" stroke={ink} strokeWidth={1.6} strokeLinejoin="round" />
          <circle r={r * 0.12} fill={ink} />
        </g>
      )
    }
  }
}

function RankMark({ rank, ink }: { rank: string; ink: string }) {
  switch (rank) {
    case 'king':
      return <path d="M-16,10 L-12,-8 L-5,3 L0,-12 L5,3 L12,-8 L16,10 Z" fill="none" stroke={ink} strokeWidth={1.6} strokeLinejoin="round" />
    case 'queen':
      return <path d="M-10,-6 A12,12 0 1 0 10,-6 A9,9 0 1 1 -10,-6 Z" fill="none" stroke={ink} strokeWidth={1.6} />
    case 'knight':
      return <path d="M0,-16 L0,14 M-8,-6 L8,-6 M-3,14 L3,14" fill="none" stroke={ink} strokeWidth={1.8} strokeLinecap="round" />
    case 'page':
      return <path d="M-8,-10 L8,-10 L8,10 L-8,10 Z M-4,-4 L4,-4 M-4,0 L4,0 M-4,4 L1,4" fill="none" stroke={ink} strokeWidth={1.4} />
    default:
      return null
  }
}

// Pip layout for numbered cards: n small marks arranged like a tarot pip card.
function Pips({ n, ink, w, h }: { n: number; ink: string; w: number; h: number }) {
  const cols = n <= 3 ? 1 : 2
  const rows = Math.ceil(n / cols)
  const marks = []
  for (let i = 0; i < n; i++) {
    const c = cols === 1 ? 0.5 : i % 2 === 0 ? 0.32 : 0.68
    const rr = rows === 1 ? 0.5 : 0.2 + (Math.floor(i / cols) / (rows - 1)) * 0.6
    marks.push(<circle key={i} cx={c * w} cy={rr * h} r={Math.max(2.2, w * 0.03)} fill={ink} opacity={0.75} />)
  }
  return <g>{marks}</g>
}

const EXTS = ['jpg', 'png', 'webp']

export function Sigil({ def, face, className }: { def: CardDef; face: Face; className?: string }) {
  const [extIdx, setExtIdx] = useState(0)
  const imgSrc = extIdx < EXTS.length ? artSrc(def.id, EXTS[extIdx]) : null
  const imgOk = imgSrc !== null
  const ink = SUIT_INK[def.suit]
  const [w0, w1] = SUIT_WASH[def.suit]
  const seed = hash(def.id)
  const rnd = rand(seed)
  const W = 200
  const H = 160
  const stars = Array.from({ length: 22 }, () => ({ x: rnd() * W, y: rnd() * H, r: 0.6 + rnd() * 1.4, o: 0.3 + rnd() * 0.6 }))
  const numeric = Number(def.rank)
  const isPip = !Number.isNaN(numeric) && def.suit !== 'major' && numeric >= 2 && numeric <= 10
  const gid = `g-${def.id}`
  const reversed = face === 'reversed'

  return (
    <div className={`sigil ${className ?? ''}`} data-face={face}>
      {imgOk && (
        <img
          className="sigil-img"
          src={imgSrc ?? undefined}
          alt=""
          onError={() => setExtIdx((i) => i + 1)}
          draggable={false}
        />
      )}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="sigil-svg" aria-hidden>
        <defs>
          <radialGradient id={gid} cx="50%" cy={reversed ? '80%' : '30%'} r="80%">
            <stop offset="0%" stopColor={w0} />
            <stop offset="100%" stopColor={w1} />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={`url(#${gid})`} />
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fffaf0" opacity={s.o * 0.7} />
        ))}
        {/* horizon */}
        <path d={`M0,${H * 0.78} Q${W * 0.5},${H * 0.68} ${W},${H * 0.8} L${W},${H} L0,${H} Z`} fill={ink} opacity={0.18} />
        <g transform={`translate(${W / 2}, ${H * 0.46})`} opacity={0.92}>
          <Emblem suit={def.suit} size={def.suit === 'major' ? 74 : 66} ink={ink} />
        </g>
        {isPip && <Pips n={numeric} ink={ink} w={W} h={H} />}
        {!isPip && def.suit !== 'major' && (
          <g transform={`translate(${W / 2}, ${H * 0.86})`}>
            <RankMark rank={def.rank} ink={ink} />
          </g>
        )}
        {def.suit === 'major' && def.numeral && (
          <text x={W / 2} y={H * 0.93} textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontWeight={700} fontSize={22} fill={ink} opacity={0.9}>
            {def.numeral}
          </text>
        )}
      </svg>
    </div>
  )
}

export const suitInk = (suit: string) => SUIT_INK[suit] ?? SUIT_INK.major
