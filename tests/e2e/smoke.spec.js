import { test, expect } from '@playwright/test';

test('location settings can be closed with cancel', async ({ page }) => {
  await page.goto('/');

  const modal = page.locator('.location-settings-modal');
  if (await modal.isVisible()) {
    await page.locator('.location-settings-modal .settings-btn.cancel').click();
  }

  await page.locator('.settings-trigger-btn').click();
  await expect(modal).toBeVisible();

  await page.locator('.location-settings-modal .settings-btn.cancel').click();
  await expect(modal).toBeHidden();
  await page.waitForTimeout(300);
  await expect(modal).toBeHidden();

  await page.locator('.settings-trigger-btn').click();
  await expect(modal).toBeVisible();
  await page.locator('.settings-trigger-btn').click();
  await expect(modal).toBeHidden();
});

test('floating filter button appears after scrolling past filters', async ({ page }) => {
  await page.goto('/');

  const modal = page.locator('.location-settings-modal');
  if (await modal.isVisible()) {
    await page.locator('.location-settings-modal .settings-btn.cancel').click();
    await expect(modal).toBeHidden();
  }

  const floatingButton = page.locator('.sticky-show-filters');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(floatingButton).toBeVisible();
});

test('wheel on active filter pills does not scroll page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const modal = page.locator('.location-settings-modal');
  if (await modal.isVisible()) {
    await page.locator('.location-settings-modal .settings-btn.cancel').click();
    await expect(modal).toBeHidden();
  }

  const firstFilterBar = page.locator('.filter-bar').first();
  if (!(await firstFilterBar.isVisible())) {
    await page.locator('.filter-summary-toggle').click();
    await expect(firstFilterBar).toBeVisible();
  }

  const chips = page.locator('.filter-chip');
  const chipCount = await chips.count();
  for (let index = 0; index < Math.min(14, chipCount); index += 1) {
    await chips.nth(index).click();
  }

  const pillsRow = page.locator('.active-filters-row');
  await expect(pillsRow).toBeVisible();

  const hasOverflow = await pillsRow.evaluate((element) => element.scrollWidth > element.clientWidth);
  expect(hasOverflow).toBeTruthy();

  await page.evaluate(() => window.scrollTo(0, 120));

  const startPageY = await page.evaluate(() => window.scrollY);

  const box = await pillsRow.boundingBox();
  if (!box) throw new Error('Active pills row is not visible for wheel test');

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(150);

  const endPageY = await page.evaluate(() => window.scrollY);
  expect(Math.abs(endPageY - startPageY)).toBeLessThanOrEqual(1);
});
