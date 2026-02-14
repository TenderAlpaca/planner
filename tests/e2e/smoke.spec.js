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

test('floating filter button works on mobile tap (no scroll movement)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await initPage(page);
  await closeSettingsIfOpen(page);

  // Scroll down to make the floating button appear
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  
  const floatingButton = page.locator('button.position-fixed.bottom-0.end-0');
  await expect(floatingButton).toBeVisible();

  // Get the initial scroll position
  const initialScrollY = await page.evaluate(() => window.scrollY);

  // Simulate a mobile tap using touch events that go through the global touch handler
  const clickSuppressed = await floatingButton.evaluate((button) => {
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

    const touch = createTouch(20, 20);

    // Simulate a tap: touchstart -> touchend (no movement)
    button.dispatchEvent(new TouchEvent('touchstart', {
      touches: [touch],
      targetTouches: [touch],
      changedTouches: [touch],
      bubbles: true,
      cancelable: true,
    }));

    button.dispatchEvent(new TouchEvent('touchend', {
      touches: [],
      targetTouches: [],
      changedTouches: [touch],
      bubbles: true,
      cancelable: true,
    }));

    // Browser naturally generates click event after touchend
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    button.dispatchEvent(clickEvent);
    
    return clickEvent.defaultPrevented;
  });

  // Wait a bit for any scrolling animation
  await page.waitForTimeout(1000);

  const finalScrollY = await page.evaluate(() => window.scrollY);

  // The button should work - scroll position should change (go up)
  // If it doesn't work, clickSuppressed will be true and scroll won't happen
  expect(clickSuppressed).toBeFalsy();
  expect(finalScrollY).toBeLessThan(initialScrollY);
  
  // Verify the filters panel is now visible (scrolled to top)
  const filtersPanel = page.locator('.filters-panel');
  await expect(filtersPanel).toBeInViewport();
});

test('floating filter button click is suppressed after scrolling on button', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await initPage(page);
  await closeSettingsIfOpen(page);

  // Scroll down to make the floating button appear
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  
  const floatingButton = page.locator('button.position-fixed.bottom-0.end-0');
  await expect(floatingButton).toBeVisible();

  // Simulate a scroll that starts on the button (touch + move beyond threshold + click)
  const clickSuppressed = await floatingButton.evaluate((button) => {
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
    const movedTouch = createTouch(20, 30); // Move 10px (beyond 8px threshold)

    // Touch start on button
    button.dispatchEvent(new TouchEvent('touchstart', {
      touches: [startTouch],
      targetTouches: [startTouch],
      changedTouches: [startTouch],
      bubbles: true,
      cancelable: true,
    }));

    // Move beyond threshold (simulating scroll)
    button.dispatchEvent(new TouchEvent('touchmove', {
      touches: [movedTouch],
      targetTouches: [movedTouch],
      changedTouches: [movedTouch],
      bubbles: true,
      cancelable: true,
    }));

    // Browser generates click after scroll
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    button.dispatchEvent(clickEvent);
    
    return clickEvent.defaultPrevented;
  });

  // The click should be suppressed because we scrolled
  expect(clickSuppressed).toBeTruthy();
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

  const clickSuppressed = await surpriseButton.evaluate((button) => {
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

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    button.dispatchEvent(clickEvent);
    return clickEvent.defaultPrevented;
  });

  expect(clickSuppressed).toBeTruthy();
  await expect(page.locator('#surprise-result')).toBeHidden();
});
