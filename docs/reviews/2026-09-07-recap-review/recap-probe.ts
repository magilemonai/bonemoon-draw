import { writeFileSync } from 'node:fs'
import { isDeepStrictEqual } from 'node:util'
import { beginGame, createGame, finalState, runAction } from '/Users/cody/Desktop/Games/Valisar Tarot Battler/src/engine/engine.ts'
import { chooseAction } from '/Users/cody/Desktop/Games/Valisar Tarot Battler/src/ai/ai.ts'
import { RULES, RULES_VERSION } from '/Users/cody/Desktop/Games/Valisar Tarot Battler/src/engine/rules.ts'
import { recapLines, replay } from '/Users/cody/Desktop/Games/Valisar Tarot Battler/src/ui/recap.ts'
import { emptyProfile, settleMatch } from '/Users/cody/Desktop/Games/Valisar Tarot Battler/src/ui/profile.ts'
import { starterList, cardPoolFor, isLegalDeck } from '/Users/cody/Desktop/Games/Valisar Tarot Battler/src/engine/deck.ts'

const root = '/Users/cody/Desktop/Projects/ArtforValisar/review-60aac1d'
const summary = (s:any) => ({ phase:s.phase, winner:s.winner, round:s.round, turn:s.turn, health:s.players.map((p:any)=>p.health), seed:s.seed })
const hp = (s:any) => s.players.map((p:any)=>p.health)
const out:any[] = []
const custom = starterList('sig-shazz').slice()
const removed = custom.shift()!
const added = cardPoolFor('sig-shazz').find(c=>c.id!==removed && isLegalDeck('sig-shazz',[...custom,c.id]))!.id
custom.push(added)
for (const [seed,trial] of [[4242,false],[7,false],[123,false],[42,false],[4242,true],[7,true],[123,true],[42,true]] as const) {
  RULES.secondPlayerSparkToken = trial
  const g = createGame({sigs:['sig-shazz','sig-daxon'],seed,humanPlayer:0,decks:[custom,undefined]})
  let s=finalState(beginGame(g,true),g)
  const actions:any[]=[]; const events:any[]=[]; const states:any[]=[s]
  while(s.phase!=='over' && actions.length<900) {
    const a=chooseAction(s,{seed})
    const steps=runAction(s,a,true)
    actions.push(a)
    for (const step of steps) events.push({...step,action:actions.length-1})
    s=finalState(steps,s);states.push(s)
  }
  const trace={humanSig:'sig-shazz',aiSig:'sig-daxon',seed,cards:custom,firstPlayer:g.active,actions,...(trial?{trial:'seat-token'}:{})}
  // The store clears the trial before the result component invokes recapLines.
  RULES.secondPlayerSparkToken=false
  const actualReplay=replay(structuredClone(trace))
  const lines=recapLines(structuredClone(trace))
  const errors=actualReplay.steps.filter(x=>x.ev.kind==='log' && x.ev.text.startsWith('Illegal action:')).map(x=>x.ev)
  // Independently isolate the random-seat initialization and trial rules.
  const forced=createGame({sigs:['sig-shazz','sig-daxon'],seed,humanPlayer:0,firstPlayer:g.active,decks:[custom,undefined]})
  let u=finalState(beginGame(forced,true),forced)
  let firstStateMismatch:any=null
  for(let i=0;i<actions.length;i++) {
    if(u.phase==='over')break
    u=finalState(runAction(u,structuredClone(actions[i]),true),u)
    const withoutRng=(x:any)=>({...x,seed:0})
    if(!firstStateMismatch && !isDeepStrictEqual(withoutRng(u),withoutRng(states[i+1]))) firstStateMismatch={actionIndex:i,action:actions[i],original:summary(states[i+1]),replay:summary(u)}
  }
  // Correct initialization, but production recap's event snapshot mode.
  RULES.secondPlayerSparkToken=trial
  const exactTrace={...trace,firstPlayer:undefined}
  const control=replay(structuredClone(exactTrace))
  const controlLines=recapLines(structuredClone(exactTrace))
  const meaningful=(x:any)=>!(x.ev.kind==='log' && x.ev.text==='')
  const actualEvents=events.filter(meaningful)
  const mismatches=control.steps.filter(meaningful).map((x,i)=>({i,x,actual:actualEvents[i]})).filter(({x,actual})=>actual && isDeepStrictEqual(x.ev,actual.ev) && !isDeepStrictEqual(hp(x.state),hp(actual.state)))
  const fatal=events.find(x=>x.ev.kind==='damage' && x.ev.target.kind==='sig' && x.state.players[x.ev.target.player].health<=0)
  let priorHealth:any=null
  if(fatal){const index=events.indexOf(fatal);priorHealth=index?events[index-1].state.players[fatal.ev.target.player].health:g.players[fatal.ev.target.player].health}
  const saved:any={id:`probe-${seed}-${trial}`,humanSig:'sig-shazz',aiSig:'sig-daxon',seat:g.active===0?'first':'second',version:RULES_VERSION,deck:{id:'probe-custom',name:'Recap audit',rev:1,starter:false,cards:custom},committed:s,log:[],seed,firstPlayer:g.active,actions,...(trial?{trial:'seat-token'}:{})}
  const record=settleMatch(emptyProfile(),saved,s,1).record
  const result={seed,trial,customSwap:{removed,added},actions:actions.length,original:summary(s),uiReplay:summary(actualReplay.final),uiReplayExact:isDeepStrictEqual(s,actualReplay.final),illegalReplayActions:errors.length,firstIllegal:errors[0],initialRng:{original:g.seed,forced:forced.seed},firstStateMismatch,lines,controlFinalExact:isDeepStrictEqual(s,control.final),controlLines,eventHealthMismatchCount:mismatches.length,firstEventMismatch:mismatches[0]?{event:mismatches[0].x.ev,actionIndex:mismatches[0].actual.action,actual:hp(mismatches[0].actual.state),recapState:hp(mismatches[0].x.state)}:null,fatal:fatal?{event:fatal.ev,actualPriorHealth:priorHealth,action:actions[fatal.action],precedingEvents:events.slice(Math.max(0,events.indexOf(fatal)-5),events.indexOf(fatal)+2).map(x=>({ev:x.ev,health:hp(x.state),round:x.state.round,active:x.state.active}))}:null,recordDeck:record.deck,recordContainsList:JSON.stringify(record).includes('"cards":')}
  out.push(result)
  writeFileSync(`${root}/recap-probe-results.json`,JSON.stringify(out,null,2)+'\n')
  console.log(JSON.stringify({seed,trial,original:result.original,uiReplay:result.uiReplay,illegal:errors.length,controlExact:result.controlFinalExact,lines,controlLines,priorHealth,eventMismatches:mismatches.length,recordContainsList:result.recordContainsList}))
  writeFileSync(`${root}/trace-${seed}-${trial?'trial':'normal'}.json`,JSON.stringify({trace,expectedFinal:s},null,2)+'\n')
}
RULES.secondPlayerSparkToken=false
