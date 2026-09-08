import { expect, test } from '@playwright/test'
import { buildAndLaunch, concede, shot } from './helpers'

test('a conceded reading shows its list and the door back into the builder against the same opponent', async ({ page }, info) => {
  await buildAndLaunch(page, 'Recap list')
  await concede(page)
  await expect(page.locator('.recap-deck')).toContainText('Recap list, revision 3')
  await page.waitForTimeout(2500)
  await shot(page, info, 'result-recap')
  await page.getByRole('button', { name: 'Edit this deck' }).click()
  await expect(page.locator('.builder')).toBeVisible()
  await expect(page.locator('.builder').getByRole('button', { name: /Play this deck against/ })).toBeVisible()
})
