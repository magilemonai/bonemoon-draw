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

// The table is settled and it is your turn when the End turn button says just that.
export async function settle(page: Page) {
  await expect(page.locator('.end-turn')).toHaveText(/^End turn$/, { timeout: 20_000 })
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

// Lesson 1 to its end: the Guard Post Reversed into Present, its attack, End turn, the
// Fisherman, then Sword Guy on the Post and the attack that brings Rorik to 13.
export async function finishLessonOne(page: Page) {
  await startLesson(page, 1)
  await playFace(page, 'The Guard Post', 'reversed')
  await mySlot(page, 1).click()
  await expect(coach(page)).toContainText('Step 2 of 5')
  await settle(page)
  await mySlot(page, 1).locator('.card').click()
  await theirSlot(page, 1).click()
  await expect(coach(page)).toContainText('Step 3 of 5')
  await settle(page)
  await page.getByRole('button', { name: /End your turn/ }).click()
  await expect(coach(page)).toContainText('Step 4 of 5', { timeout: 20_000 })
  await settle(page)
  await playFace(page, 'Zalian Fisherman', 'upright')
  await mySlot(page, 0).click()
  await expect(coach(page)).toContainText('Step 5 of 5')
  await settle(page)
  await page.getByRole('button', { name: /Sword Guy/ }).click()
  await mySlot(page, 1).locator('.card').click()
  await settle(page)
  await mySlot(page, 1).locator('.card').click()
  await expect(page.locator('.card.is-selected')).toHaveCount(1)
  await theirSlot(page, 1).click()
  await expect(page.locator('.lesson-panel.is-complete')).toBeVisible({ timeout: 20_000 })
}

// Give up the reading in play; it goes on the record as a conceded loss.
export async function concede(page: Page) {
  await page.getByRole('button', { name: 'Concede', exact: true }).click()
  await page.locator('.concede-modal').getByRole('button', { name: 'Concede', exact: true }).click()
  await expect(page.locator('.gameover')).toBeVisible({ timeout: 15_000 })
}
