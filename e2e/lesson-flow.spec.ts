import { expect, test } from '@playwright/test'
import { coach, mySlot, shot, startLesson, theirSlot } from './helpers'

test('lesson 2 advances on the right move, refuses the wrong one, and Retry restores the step', async ({ page }, info) => {
  await startLesson(page, 2)
  await expect(coach(page)).toContainText('Step 1 of 6')
  // The right move: Voren attacks the Pylon.
  await mySlot(page, 1).locator('.card').click()
  await theirSlot(page, 1).locator('.card').click()
  await expect(coach(page)).toContainText('Step 2 of 6')
  await shot(page, info, 'lesson-2-step-2')
  // A wrong move on the inspect step: ending the turn is refused with a nudge.
  await page.getByRole('button', { name: /End your turn/ }).click()
  await expect(page.locator('.lesson-panel-say.is-nudge')).toBeVisible({ timeout: 2000 })
  await expect(coach(page)).toContainText('Step 2 of 6')
  // A selection, then Retry: the step's position comes back with nothing selected.
  await mySlot(page, 1).locator('.card').click()
  await expect(page.locator('.card.is-selected')).toHaveCount(1)
  await page.getByRole('button', { name: /^Retry( this step)?$/ }).first().click()
  await expect(page.locator('.card.is-selected')).toHaveCount(0)
  await expect(coach(page)).toContainText('Step 2 of 6')
  await shot(page, info, 'lesson-2-after-retry')
  // Leaving returns to the list.
  await page.getByRole('button', { name: 'Leave the lesson' }).first().click()
  await expect(page.locator('.lessons')).toBeVisible()
})
