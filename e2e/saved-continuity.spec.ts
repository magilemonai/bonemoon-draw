import { expect, test } from '@playwright/test'
import { buildAndLaunch, shot, title } from './helpers'

test('a paused reading keeps the list it was dealt, even after the deck is edited', async ({ page }, info) => {
  await buildAndLaunch(page, 'Continuity list')
  await expect(page.locator('.sig-deck')).toContainText('Continuity list, rev 3')
  await page.getByRole('button', { name: 'Pause' }).click()
  // Edit the deck while the reading waits: one card out, a new revision.
  await page.getByRole('button', { name: 'Your decks' }).click()
  await page.locator('.deck-row').filter({ hasText: 'Continuity list' }).getByRole('button', { name: 'Edit' }).click()
  const deckTab = page.getByRole('tab', { name: /deck/i })
  if (await deckTab.isVisible()) await deckTab.click()
  await page.getByRole('button', { name: /^Remove / }).first().click()
  await page.getByRole('button', { name: 'Your decks' }).first().click()
  await expect(page.locator('.deck-row').filter({ hasText: 'Continuity list' })).toContainText('revision 4')
  await page.getByRole('button', { name: 'Title screen' }).click()
  await page.getByRole('button', { name: /Continue the reading/ }).click()
  await expect(page.locator('.battle')).toBeVisible()
  await expect(page.locator('.sig-deck')).toContainText('Continuity list, rev 3')
  await page.reload()
  await title(page)
  await page.getByRole('button', { name: /Continue the reading/ }).click()
  await expect(page.locator('.battle')).toBeVisible()
  await expect(page.locator('.sig-deck')).toContainText('Continuity list, rev 3')
  await shot(page, info, 'continued-reading-after-edit')
})
