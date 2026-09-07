import { expect, type Page, type TestInfo } from '@playwright/test'

export async function title(page: Page) {
  await page.goto('/')
  await expect(page.getByRole('button', { name: /Begin a reading|New reading/ })).toBeVisible()
}

export async function startLesson(page: Page, n: 1 | 2 | 3) {
  await title(page)
  await page.getByRole('button', { name: 'Tutorial', exact: true }).click()
  const starts = page.locator('.lessons button').filter({ hasText: /^(Start|Play it again)$/ })
  await expect(starts).toHaveCount(3)
  await starts.nth(n - 1).click()
  await expect(page.locator('.battle')).toBeVisible()
  await expect(page.locator('.lesson-panel')).toBeVisible()
}

// On a short phone the hand is a strip: raise it before looking for a card.
export async function openHand(page: Page) {
  const strip = page.locator('.hand-strip')
  if (await strip.isVisible()) {
    if (!(await page.locator('.hand-wrap.is-open').isVisible())) {
      await strip.click()
      await expect(page.locator('.hand-wrap.is-open')).toBeVisible()
    }
  }
}

export async function playFace(page: Page, cardName: string, face: 'upright' | 'reversed') {
  await openHand(page)
  await page.locator('.hand-card .card').filter({ hasText: cardName }).first().click()
  await expect(page.locator('.face-chooser')).toBeVisible()
  await page.getByRole('button', { name: `Play ${cardName} ${face}` }).click()
}

export const mySlot = (page: Page, lane: 0 | 1 | 2) => page.locator('.slot:not(.slot-theirs)').nth(lane)
export const theirSlot = (page: Page, lane: 0 | 1 | 2) => page.locator('.slot.slot-theirs').nth(lane)
export const coach = (page: Page) => page.locator('.lesson-panel-head')
export const prompt = (page: Page) => page.locator('.turn-prompt, .targeting-hint').locator('visible=true')

export async function shot(page: Page, info: TestInfo, name: string) {
  await page.screenshot({ path: `e2e/evidence/${info.project.name}/${name}.png` })
}

// Copy a starter, remove and restore one card, name it, and play it.
export async function buildAndLaunch(page: Page, name: string) {
  await title(page)
  await page.getByRole('button', { name: 'Your decks' }).click()
  await page.getByRole('button', { name: 'Copy and edit' }).first().click()
  await expect(page.locator('.builder')).toBeVisible()
  await page.getByLabel('Deck name').fill(name)
  const deckTab = page.getByRole('tab', { name: /deck/i })
  if (await deckTab.isVisible()) await deckTab.click()
  const remove = page.getByRole('button', { name: /^Remove / }).first()
  const cardName = (await remove.getAttribute('aria-label'))!.replace(/^Remove /, '')
  await remove.click()
  await expect(page.getByLabel('Before it can be played')).toBeVisible()
  const cardsTab = page.getByRole('tab', { name: /cards/i })
  if (await cardsTab.isVisible()) await cardsTab.click()
  await page.getByLabel('Search cards, both faces').fill(cardName)
  await page.getByRole('button', { name: `Add ${cardName}` }).first().click()
  await expect(page.getByLabel('Before it can be played')).toBeHidden()
  await page.locator('.builder').getByRole('button', { name: 'Play this deck' }).click()
  await expect(page.locator('.choose')).toBeVisible()
  await page.locator('.choose').getByRole('button', { name: 'Play', exact: true }).click()
  await expect(page.locator('.battle')).toBeVisible()
}
