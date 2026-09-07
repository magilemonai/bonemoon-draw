import { useStore } from './ui/store'
import { Title } from './ui/screens/Title'
import { Choose } from './ui/screens/Choose'
import { Battle } from './ui/screens/Battle'
import { Codex } from './ui/screens/Codex'
import { Rules } from './ui/screens/Rules'
import { Decks } from './ui/screens/Decks'
import { Builder } from './ui/screens/Builder'
import { Lessons } from './ui/screens/Lessons'

export default function App() {
  const screen = useStore((s) => s.screen)
  return (
    <div className="app">
      <div className="sky" aria-hidden>
        <div className="sky-stars" />
        <svg className="sky-orrery" viewBox="0 0 1000 1000">
          <g fill="none" stroke="#e8c76c" strokeWidth="1">
            <circle cx="500" cy="500" r="300" opacity="0.10" />
            <circle cx="500" cy="500" r="372" opacity="0.07" strokeDasharray="3 9" />
            <circle cx="500" cy="500" r="458" opacity="0.09" />
            {Array.from({ length: 24 }, (_, i) => {
              const a = (i / 24) * Math.PI * 2
              const x1 = 500 + Math.cos(a) * 450
              const y1 = 500 + Math.sin(a) * 450
              const x2 = 500 + Math.cos(a) * (i % 6 === 0 ? 436 : 444)
              const y2 = 500 + Math.sin(a) * (i % 6 === 0 ? 436 : 444)
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity="0.14" />
            })}
          </g>
          <circle cx="800" cy="500" r="4" fill="#e8c76c" opacity="0.25" />
          <circle cx="500" cy="128" r="2.5" fill="#8fd6ff" opacity="0.35" />
        </svg>
      </div>
      {screen === 'title' && <Title />}
      {screen === 'choose' && <Choose />}
      {screen === 'battle' && <Battle />}
      {screen === 'codex' && <Codex />}
      {screen === 'rules' && <Rules />}
      {screen === 'decks' && <Decks />}
      {screen === 'build' && <Builder />}
      {screen === 'lessons' && <Lessons />}
    </div>
  )
}
