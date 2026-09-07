import { expect, test } from '@playwright/test'
import { shot, title } from './helpers'

test('the tutorial opens from the title screen', async ({ page }, info) => {
  await title(page)
  await page.getByRole('button', { name: 'Tutorial', exact: true }).click()
  await expect(page.locator('.lessons button').filter({ hasText: /^(Start|Play it again)$/ })).toHaveCount(3)
  await shot(page, info, 'tutorial-from-title')
})

test('the tutorial opens from the character screen', async ({ page }, info) => {
  await title(page)
  await page.getByRole('button', { name: /Begin a reading|New reading/ }).click()
  await expect(page.locator('.choose')).toBeVisible()
  await page.getByRole('button', { name: /Tutorial/ }).first().click()
  await expect(page.locator('.lessons button').filter({ hasText: /^(Start|Play it again)$/ })).toHaveCount(3)
  await shot(page, info, 'tutorial-from-choose')
})
