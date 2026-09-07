import { expect, test } from '@playwright/test'
import { coach, mySlot, playFace, shot, startLesson } from './helpers'

test('Read the Stars opens above the coach, a candidate can be inspected, and Keep commits', async ({ page }, info) => {
  await startLesson(page, 3)
  await playFace(page, 'The Oondray', 'upright')
  await mySlot(page, 0).click()
  await expect(coach(page)).toContainText('Step 2 of 8')
  await page.getByRole('button', { name: /Read the Stars/ }).click()
  const rows = page.locator('.read-head')
  await expect(rows).toHaveCount(3)
  await shot(page, info, 'read-chooser')
  await rows.first().click()
  await expect(page.locator('.inspect-modal')).toBeVisible()
  await page.locator('.inspect-modal').getByRole('button', { name: 'Close' }).click()
  await expect(page.locator('.inspect-modal')).toBeHidden()
  await page.getByRole('button', { name: /^Keep / }).first().click()
  await expect(rows).toHaveCount(0)
  await expect(page.locator('.sig-mine .sig-num-hand b')).toContainText(/^6/)
})
