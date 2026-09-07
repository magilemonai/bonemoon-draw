import { expect, test } from '@playwright/test'
import { buildAndLaunch, shot } from './helpers'

test('a paused reading continues with the same deck, across a reload', async ({ page }, info) => {
  await buildAndLaunch(page, 'Continuity list')
  await page.getByRole('button', { name: 'Pause' }).click()
  await page.getByRole('button', { name: /Continue the reading/ }).click()
  await expect(page.locator('.battle')).toBeVisible()
  await expect(page.locator('.sig-deck')).toContainText('Continuity list')
  await page.reload()
  await page.getByRole('button', { name: /Continue the reading/ }).click()
  await expect(page.locator('.battle')).toBeVisible()
  await expect(page.locator('.sig-deck')).toContainText('Continuity list')
  await shot(page, info, 'continued-reading')
})
