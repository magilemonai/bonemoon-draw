import { beginGame, createGame, finalState, runAction, legalActions } from '/Users/cody/Desktop/Games/Valisar Tarot Battler/src/engine/engine.ts'
import { chooseAction } from '/Users/cody/Desktop/Games/Valisar Tarot Battler/src/ai/ai.ts'
import { card } from '/Users/cody/Desktop/Games/Valisar Tarot Battler/src/data/index.ts'

const g = createGame({ sigs: ['sig-luigi','sig-daxon'], seed: 11, firstPlayer: 0 })
let s = finalState(beginGame(g, false),g)
s.players[0].hand=[]
s.players[1].hand=[]
for(const defId of ['gears-ace','gears-ace','gears-10','gears-10','major-21','antlers-king','antlers-9','gears-queen']) {
  s.players[0].hand.push({uid:s.nextUid++,defId})
}
s.players[0].spark=2
s.players[0].maxSpark=Math.max(s.players[0].maxSpark,2)
const initial=structuredClone(s)
const describe=(a:any,state:any)=>({...a,card:a.uid?state.players[0].hand.find((h:any)=>h.uid===a.uid)?.defId:undefined})
console.log('Initial legal actions',JSON.stringify(legalActions(s).map(a=>describe(a,s))))
for(let i=0;i<12;i++) {
  const a=chooseAction(s,{seed:1})
  const shown=describe(a,s)
  const steps=runAction(s,a,false)
  s=finalState(steps,s)
  console.log(JSON.stringify({action:shown,hand:s.players[0].hand.map(h=>h.defId),spark:s.players[0].spark,events:steps.map(v=>v.ev)}))
  if(a.type==='endTurn'||s.phase==='over')break
}
for(const a of legalActions(initial).filter(a=>a.type==='play')) {
  const after=finalState(runAction(structuredClone(initial),a,false),initial)
  console.log('Alternative immediate result',JSON.stringify({action:describe(a,initial),handCount:after.players[0].hand.length,spark:after.players[0].spark,drawn:after.players[0].hand.map(h=>card(h.defId).name)}))
}
let visited=0, minHand=initial.players[0].hand.length
const seen=new Set<string>()
function walk(state:any,depth=0) {
  if(depth>12||visited>2000||state.phase==='over'||state.active!==0)return
  const key=JSON.stringify(state)
  if(seen.has(key))return
  seen.add(key);visited++
  minHand=Math.min(minHand,state.players[0].hand.length)
  for(const a of legalActions(state)) {
    if(a.type==='endTurn')continue
    walk(finalState(runAction(structuredClone(state),a,false),state),depth+1)
  }
}
walk(initial)
console.log('All reachable own-turn branches',JSON.stringify({visited,minHand}))
let control=structuredClone(initial)
control.players[0].hand[0].defId='gears-2'
for(let i=0;i<12;i++) {
  const a=chooseAction(control,{seed:1})
  const shown=describe(a,control)
  control=finalState(runAction(control,a,false),control)
  console.log('Non-replacing card control',JSON.stringify({action:shown,handCount:control.players[0].hand.length}))
  if(a.type==='endTurn'||control.phase==='over')break
}
