import { test, expect } from '@playwright/test';

async function initPage(page) {
  await page.addInitScript(() => {
    localStorage.setItem('language', 'en');
    localStorage.setItem('filtersCollapsed', '0');
    localStorage.setItem('userLocation', JSON.stringify({
      address: 'Szeged, Hungary',
      lat: 46.253,
      lng: 20.141,
    }));
    localStorage.removeItem('favouritePlaces');
    localStorage.removeItem('favouriteCombos');
  });

  await page.goto('/');
}

async function closeSettingsIfOpen(page) {
  const overlay = page.locator('.location-settings-overlay');
  if (await overlay.isVisible()) {
    await overlay.click();
    await expect(overlay).toBeHidden();
  }
}

test('settings modal toggles from the gear button', async ({ page }) => {
  await initPage(page);
  await closeSettingsIfOpen(page);

  const trigger = page.locator('.location-settings-trigger-btn');
  const panel = page.locator('.location-settings-panel');
  const closeButton = page.locator('.settings-close-btn');

  await trigger.click();
  await expect(panel).toBeVisible();
  await expect(closeButton).toBeVisible();

  await closeButton.click();
  await expect(panel).toBeHidden();

  await trigger.click();
  await expect(panel).toBeVisible();

  await closeButton.click();
  await expect(panel).toBeHidden();
});

test('filters can be selected and cleared', async ({ page }) => {
  await initPage(page);
  await closeSettingsIfOpen(page);

  const firstFilterPill = page.locator('.filters-panel .btn.btn-sm.rounded-pill').first();
  await firstFilterPill.click();

  const activeChips = page.locator('.filters-chip-row .filters-chip');
  await expect(activeChips).toHaveCount(1);

  await page.locator('button:has-text("Clear all")').click();
  await expect(activeChips).toHaveCount(0);
});

test('favourites-only filter limits the list', async ({ page }) => {
  await initPage(page);
  await closeSettingsIfOpen(page);

  const placeCards = page.locator('.place-card');
  await expect(placeCards.first()).toBeVisible();

  await placeCards.first().locator('.place-favourite-btn').click();

  const favouritesToggle = page.locator('input.form-check-input[type="checkbox"]').first();
  await favouritesToggle.check();

  await expect(placeCards).toHaveCount(1);
});

test('surprise button reveals a pick card', async ({ page }) => {
  await initPage(page);
  await closeSettingsIfOpen(page);

  await page.getByRole('button', { name: /surprise me/i }).click();
  await expect(page.locator('#surprise-result')).toBeVisible();
});

test('combo cards expand to show steps', async ({ page }) => {
  await initPage(page);
  await closeSettingsIfOpen(page);

  await page.getByRole('button', { name: /plans/i }).click();

  const firstCombo = page.locator('div[role="button"].card').first();
  await expect(firstCombo).toBeVisible();

  await firstCombo.click();
  await expect(firstCombo.locator('ol')).toBeVisible();
});

test('floating filter button appears after scrolling past filters', async ({ page }) => {
  await initPage(page);
  await closeSettingsIfOpen(page);

  const floatingButton = page.locator('button.position-fixed.bottom-0.end-0');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(floatingButton).toBeVisible();
});

test('wheel on active filter chips does not scroll page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await initPage(page);
  await closeSettingsIfOpen(page);

  const chips = page.locator('.filters-panel .btn.btn-sm.rounded-pill');
  const chipCount = await chips.count();
  for (let index = 0; index < Math.min(14, chipCount); index += 1) {
    await chips.nth(index).click();
  }

  const pillsRow = page.locator('.filters-chip-row');
  await expect(pillsRow).toBeVisible();

  const hasOverflow = await pillsRow.evaluate((element) => element.scrollWidth > element.clientWidth + 1);
  expect(hasOverflow).toBeTruthy();

  await page.evaluate(() => window.scrollTo(0, 120));

  const startPageY = await page.evaluate(() => window.scrollY);
  await pillsRow.evaluate((node) => {
    node.dispatchEvent(new WheelEvent('wheel', {
      deltaY: 600,
      bubbles: true,
      cancelable: true,
    }));
  });

  const endPageY = await page.evaluate(() => window.scrollY);
  expect(Math.abs(endPageY - startPageY)).toBeLessThanOrEqual(1);
});

test('touch scroll starting on a button does not trigger button click', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await initPage(page);
  await closeSettingsIfOpen(page);

  const surpriseButton = page.getByRole('button', { name: /surprise me/i });
  await expect(surpriseButton).toBeVisible();

  await surpriseButton.evaluate((button) => {
    const createTouch = (x, y) => new Touch({
      identifier: 1,
      target: button,
      clientX: x,
      clientY: y,
      pageX: x,
      pageY: y,
      radiusX: 2,
      radiusY: 2,
      rotationAngle: 0,
      force: 1,
    });

    const startTouch = createTouch(20, 20);
    const movedTouch = createTouch(20, 80);

    button.dispatchEvent(new TouchEvent('touchstart', {
      touches: [startTouch],
      targetTouches: [startTouch],
      changedTouches: [startTouch],
      bubbles: true,
      cancelable: true,
    }));

    button.dispatchEvent(new TouchEvent('touchmove', {
      touches: [movedTouch],
      targetTouches: [movedTouch],
      changedTouches: [movedTouch],
      bubbles: true,
      cancelable: true,
    }));
  });

  await surpriseButton.click();
  await expect(page.locator('#surprise-result')).toBeHidden();
});
