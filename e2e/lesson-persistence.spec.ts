import { expect, test } from '@playwright/test'
import { finishLessonOne, shot, title } from './helpers'

test('a finished lesson keeps its mark across a reload', async ({ page }, info) => {
  await finishLessonOne(page)
  await shot(page, info, 'lesson-1-complete')
  await page.reload()
  await title(page)
  await page.getByRole('button', { name: 'Tutorial', exact: true }).click()
  const starts = page.locator('.lessons button').filter({ hasText: /^(Start|Play it again)$/ })
  await expect(starts.nth(0)).toHaveText('Play it again')
  await expect(starts.nth(1)).toHaveText('Start')
})
