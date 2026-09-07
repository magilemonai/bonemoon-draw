import { expect, test } from '@playwright/test'
import { coach, mySlot, playFace, shot, startLesson } from './helpers'

test('a card is played on its Reversed face into a chosen lane @motion', async ({ page }, info) => {
  await startLesson(page, 1)
  await playFace(page, 'The Guard Post', 'reversed')
  await expect(page.locator('.face-chooser')).toBeHidden()
  await mySlot(page, 1).click()
  await expect(mySlot(page, 1).locator('.card')).toContainText('Guard Post')
  await expect(mySlot(page, 1).locator('.card .face-reversed.is-active')).toHaveCount(1)
  await expect(coach(page)).toContainText('Step 2 of 5')
  await shot(page, info, 'guard-post-reversed-in-present')
})
