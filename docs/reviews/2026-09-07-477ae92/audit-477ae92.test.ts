// Review diagnostics only. This file is outside the production repository.
// Reproduction tests assert existing defects; passing does NOT mean they are fixed.
import { describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { card, DECK_CARDS } from './data'
import { starterList, isLegalDeck, sameList } from './engine/deck'
import { beginGame, createGame, finalState, runAction } from './engine/engine'
import { determinize, chooseAction } from './ai/ai'
import { lessonById, allowed, afterAction, type LessonProgress } from './tutorial/lessons'
import type { Action } from './engine/types'
import { parseProfile, renownOf } from './ui/profile'
import { parseDecks } from './ui/decks'
import { FlipIn } from './ui/components/CardBack'

const id = (name: string) => DECK_CARDS.find(c => c.name === name)!.id
function custom() {
  const list = starterList('sig-masque').slice()
  const removed = ['The Emperor: Izuriel Sakazarac II','Tyserion I, the Golden Blade','Archmage Severyn Caldreth','Ilzaren, the Resplendent King','Vel, the Emberlight','Archivist Esmerelda Gotch','Judgement: The Septor’s Chorus','The Libra Stellae']
  for (const name of removed) {
    const exact = DECK_CARDS.find(c => c.name === name) ?? DECK_CARDS.find(c => c.name.startsWith(name.split(':')[0]) && list.includes(c.id))
    if (!exact || !list.includes(exact.id)) throw new Error('Missing removal '+name)
    list.splice(list.indexOf(exact.id),1)
  }
  list.push(id('Mr. Boscoe'),id('Mr. Boscoe'),id('Mordeaux, the Clockwork Man'),id('Mordeaux, the Clockwork Man'),id('Eldertech Sphere'),id('Eldertech Sphere'),id('The Guard Post'),id('Vraxxis, the Hungering Cinder'))
  return list
}
function lessonPlayer() {
  const l = lessonById('first-reading')!
  let s = l.setup(), p: LessonProgress = {step:0,complete:false}
  const play = (a:Action) => {expect(allowed(l,p,a,s)).toBe(true); const before=s; s=finalState(runAction(s,a,false),s);p=afterAction(l,p,before,s,a)}
  const uid = (def:string) => s.players[0].hand.find(c=>c.defId===def)!.uid
  return {l,play,uid,state:()=>s,progress:()=>p}
}
describe('477ae92 supplemental review diagnostics',()=>{
  it('parses the actual UI export with all three matches, lessons, and 30 cards',()=>{
    const raw=JSON.parse(readFileSync(new URL('../../audit-record-export.json',import.meta.url),'utf8'))
    const p=parseProfile(raw.profile)!,decks=parseDecks({decks:raw.decks})!
    expect(p.matches).toHaveLength(3);expect(renownOf(p)).toBe(10)
    expect(Object.keys(p.lessons!)).toHaveLength(3)
    expect(decks).toHaveLength(1);expect(decks[0].cards).toHaveLength(30)
    expect(isLegalDeck(decks[0].sig,decks[0].cards)).toBe(true)
    const revised=custom();revised.splice(revised.indexOf(id('Vraxxis, the Hungering Cinder')),1,id('Pommeroy'))
    expect(sameList(revised,decks[0].cards)).toBe(true)
  })
  it('FlipIn requests zero duration under reduced motion (component-props check, not live browser)',()=>{
    vi.stubGlobal('window',{matchMedia:()=>({matches:true})})
    try { expect(FlipIn({children:null}).props.transition).toEqual({duration:0}) }
    finally {vi.unstubAllGlobals()}
  })
  it('deals the UI-constructed custom list exactly across 20 seeds',()=>{
    const list=custom();expect(isLegalDeck('sig-masque',list)).toBe(true)
    for(let seed=1;seed<=20;seed++){
      const g=createGame({sigs:['sig-masque','sig-lirielle'],humanPlayer:0,firstPlayer:0,seed,decks:[list,undefined]})
      const s=finalState(beginGame(g,false),g)
      expect(sameList([...s.players[0].hand,...s.players[0].deck].map(c=>c.defId),list)).toBe(true)
    }
  })
  it('the dealt game is independent of later edits to its input list',()=>{
    const list=custom(), original=list.slice()
    const g=createGame({sigs:['sig-masque','sig-lirielle'],humanPlayer:0,firstPlayer:0,seed:3,decks:[list,undefined]})
    list.splice(list.indexOf(id('Vraxxis, the Hungering Cinder')),1,id('Pommeroy'))
    expect(sameList([...g.players[0].hand,...g.players[0].deck].map(c=>c.defId),original)).toBe(true)
  })
  it('20 belief samples and 5 decisions are invariant to legal private composition',()=>{
    const g=createGame({sigs:['sig-lirielle','sig-masque'],firstPlayer:0,seed:42,decks:[undefined,custom()]})
    const a=finalState(beginGame(g,false),g),b=structuredClone(a)
    const other=starterList('sig-masque')
    ;[...b.players[1].hand,...b.players[1].deck].forEach((c,i)=>c.defId=other[i])
    a.players[0].spark=b.players[0].spark=6;a.players[0].maxSpark=b.players[0].maxSpark=6
    for(let seed=1;seed<=20;seed++){
      const aa=determinize(a,0,seed),bb=determinize(b,0,seed)
      expect(aa.players[1].hand).toEqual(bb.players[1].hand)
      expect(aa.players[1].deck).toEqual(bb.players[1].deck)
    }
    for(let seed=1;seed<=5;seed++)expect(chooseAction(a,{seed})).toEqual(chooseAction(b,{seed}))
  })
  it('REPRO: wrong lane is accepted while next hints still point to Present',()=>{
    const t=lessonPlayer();t.play({type:'play',uid:t.uid('suns-2'),face:'reversed',lane:0})
    expect(t.progress().step).toBe(1)
    expect(t.state().players[0].lanes[0]?.defId).toBe('suns-2')
    expect(t.l.steps[1].hints).toContainEqual({kind:'slot',player:0,lane:1})
  })
  it('REPRO: closing deadline can be exceeded without Sword Guy',()=>{
    const t=lessonPlayer();t.play({type:'play',uid:t.uid('suns-2'),face:'reversed',lane:1})
    t.play({type:'attack',lane:1,targetLane:1});t.play({type:'endTurn'});t.play({type:'endTurn'})
    t.play({type:'play',uid:t.uid('tides-3'),face:'upright',lane:0})
    t.play({type:'attack',lane:1,targetLane:1});t.play({type:'endTurn'});t.play({type:'endTurn'})
    t.play({type:'attack',lane:1,targetLane:1})
    expect(t.state().round).toBe(3);expect(t.progress().complete).toBe(true)
  })
  it('the closing exercise accepts the legal Pearl alternative to Sword Guy',()=>{
    const t=lessonPlayer();t.play({type:'play',uid:t.uid('suns-2'),face:'reversed',lane:1})
    t.play({type:'attack',lane:1,targetLane:1});t.play({type:'endTurn'});t.play({type:'endTurn'})
    t.play({type:'play',uid:t.uid('tides-3'),face:'upright',lane:0})
    expect(card('tides-ace').type).toBe('relic')
    t.play({type:'play',uid:t.uid('tides-ace'),face:'reversed',target:{kind:'figure',player:0,lane:1}})
    t.play({type:'attack',lane:1,targetLane:1});expect(t.progress().complete).toBe(true);expect(t.state().round).toBe(2)
  })
})
