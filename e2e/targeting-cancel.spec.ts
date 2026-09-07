import { expect, test } from '@playwright/test'
import { mySlot, prompt, shot, startLesson } from './helpers'

test('selecting a Figure shows the ask, and Cancel clears it @motion', async ({ page }, info) => {
  await startLesson(page, 2)
  await mySlot(page, 1).locator('.card').click()
  await expect(prompt(page)).toBeVisible()
  await expect(prompt(page)).toContainText(/Voren/)
  await expect(page.locator('.card.is-selected')).toHaveCount(1)
  await shot(page, info, 'targeting-prompt')
  await prompt(page).getByRole('button', { name: 'Cancel' }).click()
  await expect(prompt(page)).toHaveCount(0)
  await expect(page.locator('.card.is-selected')).toHaveCount(0)
})

test('the play sheet closes on Cancel with the coach in place', async ({ page }, info) => {
  await startLesson(page, 2)
  const strip = page.locator('.hand-strip')
  if (await strip.isVisible()) await strip.click()
  await page.locator('.hand-card .card').filter({ hasText: 'Boscoe' }).first().click()
  await expect(page.locator('.face-chooser')).toBeVisible()
  await shot(page, info, 'play-sheet-over-coach')
  await page.locator('.face-chooser').getByRole('button', { name: 'Cancel' }).click()
  await expect(page.locator('.face-chooser')).toBeHidden()
})
