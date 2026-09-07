import { expect, test } from '@playwright/test'
import { buildAndLaunch, shot } from './helpers'

test('a deck built from a starter launches a reading under its name', async ({ page }, info) => {
  await buildAndLaunch(page, 'Regression list')
  await expect(page.locator('.sig-deck')).toContainText('Regression list')
  await shot(page, info, 'built-deck-in-play')
})
