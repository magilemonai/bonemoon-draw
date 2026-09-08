import { expect, test } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { shot, title } from './helpers'

// The same crowded table in both compact treatments, measured after the layout settles.
test('the Card study measures both treatments on one table', async ({ page }, info) => {
  await title(page)
  await page.getByRole('button', { name: 'Card study' }).click()
  await expect(page.locator('.battle.is-study')).toBeVisible()
  const measure = async () => {
    await page.waitForTimeout(1500)
    return page.evaluate(() => {
      const cards = [...document.querySelectorAll('.board .card.size-lane')].map((c) => {
        const art = c.querySelector('.card-face.is-active .card-art')!.getBoundingClientRect()
        return { name: c.querySelector('.card-face.is-active .card-name')!.textContent, width: Math.round(c.getBoundingClientRect().width), art: Math.round(art.height) }
      })
      return { cards, lane: getComputedStyle(document.querySelector('.slot')!).width }
    })
  }
  // One switch names the other treatment: it reads Marks while words are showing.
  const toggle = page.locator('.table-tools').getByRole('button', { name: /^(Words|Marks)$/ })
  if ((await toggle.textContent())?.trim() === 'Words') await toggle.click()
  await expect(toggle).toHaveText('Marks')
  const words = await measure()
  await shot(page, info, 'study-words')
  await toggle.click()
  await expect(toggle).toHaveText('Words')
  const marks = await measure()
  await shot(page, info, 'study-marks')
  mkdirSync(`e2e/evidence/${info.project.name}`, { recursive: true })
  writeFileSync(`e2e/evidence/${info.project.name}/study-layout.json`, JSON.stringify({ viewport: page.viewportSize(), words, marks }, null, 2))
  // The key is a sheet, so the lanes keep their width in both treatments.
  expect(marks.lane).toBe(words.lane)
  const minWords = Math.min(...words.cards.map((c) => c.art))
  const minMarks = Math.min(...marks.cards.map((c) => c.art))
  expect(minMarks).toBeGreaterThan(minWords)
  // A keyword tile opens the key and never selects the card.
  await page.locator('.board .card.size-lane button.kw').first().click()
  await expect(page.locator('.status-modal')).toBeVisible()
  await expect(page.locator('.card.is-selected')).toHaveCount(0)
  await page.locator('.status-modal').getByRole('button', { name: 'Close' }).click()
  // The tools row keeps clear of the opponent's name on a phone.
  const name = await page.locator('.sig-theirs .sig-name').boundingBox()
  const tools = await page.locator('.table-tools').boundingBox()
  if (name && tools && (await page.viewportSize())!.width < 1000) expect(name.x + name.width).toBeLessThanOrEqual(tools.x + 1)
  await toggle.click()
  await expect(toggle).toHaveText('Marks')
})
