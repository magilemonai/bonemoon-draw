import { expect, test, type Page } from '@playwright/test'
import { beginGame, createGame, finalState, runAction } from '../src/engine/engine'
import { RULES } from '../src/engine/rules'
import { chooseAction } from '../src/ai/ai'
import { starterList } from '../src/engine/deck'
import type { Action } from '../src/engine/types'
import { recapLines } from '../src/ui/recap'
import { shot, title } from './helpers'

// A reading played to its natural end: you only end turns, the planner does the rest, and
// the seed in the address makes the deal and the planner's choices the same every time. The
// lines the result screen shows must be the lines the reducer computes in Node for the same
// reading, so a copy edit changes both and a wrong replay changes neither.
function expectedLines(seed: number, trial: boolean): string[] {
  RULES.secondPlayerSparkToken = trial
  try {
    const cards = starterList('sig-shazz')
    const aiCards = starterList('sig-daxon')
    const g = createGame({ sigs: ['sig-shazz', 'sig-daxon'], seed, humanPlayer: 0, decks: [cards.slice(), aiCards.slice()] })
    let s = finalState(beginGame(g, true), g)
    const actions: Action[] = []
    let guard = 0
    while (s.phase !== 'over' && guard++ < 900) {
      const a: Action = s.active === 0 ? { type: 'endTurn' } : chooseAction(s, { seed: s.seed })
      actions.push(structuredClone(a))
      s = finalState(runAction(s, a, true), s)
    }
    const lines = recapLines({ humanSig: 'sig-shazz', aiSig: 'sig-daxon', seed, cards, aiCards, actions, ...(trial ? { trial: 'seat-token' as const } : {}), expected: { winner: s.winner, round: s.round, health: [s.players[0].health, s.players[1].health] } })
    if (!lines) throw new Error('the expected reading could not be replayed')
    return lines
  } finally {
    RULES.secondPlayerSparkToken = false
  }
}

async function playToTheEnd(page: Page, seed: number, trial: boolean) {
  await page.goto(`/?seed=${seed}`)
  await expect(page.getByRole('button', { name: /Begin a reading|New reading/ })).toBeVisible()
  await page.getByRole('button', { name: /Begin a reading|New reading/ }).click()
  await page.locator('.sig-choice').filter({ hasText: 'Shazz' }).click()
  await page.getByLabel('Which opponent').selectOption('sig-daxon')
  if (trial) await page.getByLabel('Play under an experiment').selectOption('seat-token')
  await page.locator('.choose').getByRole('button', { name: 'Play', exact: true }).click()
  await expect(page.locator('.battle')).toBeVisible()
  for (let i = 0; i < 80; i++) {
    if (await page.locator('.gameover').isVisible()) break
    const end = page.locator('.end-turn')
    if ((await end.textContent())?.trim() === 'End turn') await end.click()
    await page.waitForTimeout(400)
  }
  await expect(page.locator('.gameover')).toBeVisible({ timeout: 30_000 })
}

test('a reading played to its end shows the recap the reducer computes', async ({ page }, info) => {
  const expected = expectedLines(4242, false)
  await playToTheEnd(page, 4242, false)
  await expect(page.locator('.recap-lines li')).toHaveCount(expected.length)
  const shown = await page.locator('.recap-lines li').allTextContents()
  expect(shown).toEqual(expected)
  await expect(page.locator('.recap-deck')).toContainText('Something Rotten at the Core')
  await page.waitForTimeout(1500)
  await shot(page, info, 'natural-finish-recap')
  // The door back in: a copy of the starter, one change, the same opponent.
  await page.getByRole('button', { name: 'Edit a copy of this deck' }).click()
  await expect(page.locator('.builder')).toBeVisible()
  const deckTab = page.getByRole('tab', { name: /deck/i })
  if (await deckTab.isVisible()) await deckTab.click()
  const remove = page.getByRole('button', { name: /^Remove / }).first()
  const cardName = (await remove.getAttribute('aria-label'))!.replace(/^Remove /, '')
  await remove.click()
  const cardsTab = page.getByRole('tab', { name: /cards/i })
  if (await cardsTab.isVisible()) await cardsTab.click()
  await page.getByLabel('Search cards, both faces').fill(cardName)
  await page.getByRole('button', { name: `Add ${cardName}` }).first().click()
  await page.locator('.builder').getByRole('button', { name: 'Play this deck against Daxon' }).click()
  await expect(page.locator('.choose')).toBeVisible()
  await expect(page.getByLabel('Which opponent')).toHaveValue('sig-daxon')
  await page.locator('.choose').getByRole('button', { name: 'Play', exact: true }).click()
  await expect(page.locator('.battle')).toBeVisible()
  await expect(page.locator('.sig-deck')).toContainText('my way')
})

test('a reading under the seat trial replays with the trial and says so', async ({ page }, info) => {
  const expected = expectedLines(7, true)
  await playToTheEnd(page, 7, true)
  await expect(page.locator('.recap-deck')).toContainText('under the seat trial')
  await expect(page.locator('.recap-lines li')).toHaveCount(expected.length)
  expect(await page.locator('.recap-lines li').allTextContents()).toEqual(expected)
  await page.waitForTimeout(1500)
  await shot(page, info, 'trial-finish-recap')
  await page.getByRole('button', { name: 'Title screen' }).click()
  await title(page)
  await page.getByRole('button', { name: 'Your record' }).click()
  await expect(page.locator('.record-row').first()).toContainText('seat trial')
})
