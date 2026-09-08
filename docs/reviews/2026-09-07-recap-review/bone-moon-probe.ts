import { writeFileSync } from 'node:fs'
import { beginGame, createGame, finalState, runAction } from '/Users/cody/Desktop/Games/Valisar Tarot Battler/src/engine/engine.ts'
import { RULES } from '/Users/cody/Desktop/Games/Valisar Tarot Battler/src/engine/rules.ts'
import { replay, recapLines } from '/Users/cody/Desktop/Games/Valisar Tarot Battler/src/ui/recap.ts'
RULES.secondPlayerSparkToken=false
const seed=7, firstPlayer=0
const g=createGame({sigs:['sig-rorik','sig-daxon'],seed,firstPlayer,humanPlayer:0})
let s=finalState(beginGame(g,true),g)
const actions:any[]=[],actual:any[]=[]
while(s.phase!=='over' && actions.length<60){
  const a={type:'endTurn'} as const;actions.push(a)
  const steps=runAction(s,a,true)
  actual.push(...steps)
  s=finalState(steps,s)
}
const trace={humanSig:'sig-rorik',aiSig:'sig-daxon',seed,firstPlayer,actions}
const r=replay(trace)
const meaningful=(x:any)=>!(x.ev.kind==='log' && x.ev.text==='')
const actualEvents=actual.filter(meaningful)
const interesting=r.steps.filter(meaningful).map((x,i)=>({event:x.ev,round:x.state.round,active:x.state.active,actionStartedWith:x.before.active,recapHealth:x.state.players.map(p=>p.health),actualHealth:actualEvents[i]?.state.players.map((p:any)=>p.health)})).filter(x=>x.event.kind==='boneMoonBite'||x.event.kind==='damage'||x.event.kind==='turnStart' && x.round>=7)
const result={description:'Both players only end their turns. Rorik heals passively; all Significator damage comes from the Bone Moon.',final:{round:s.round,winner:s.winner,health:s.players.map(p=>p.health)},lines:recapLines(trace),events:interesting}
writeFileSync('/Users/cody/Desktop/Projects/ArtforValisar/review-60aac1d/bone-moon-probe-results.json',JSON.stringify(result,null,2)+'\n')
console.log(JSON.stringify(result,null,2))
