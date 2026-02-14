import { chromium, devices } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...devices['Pixel 5'],
  });
  const page = await context.newPage();
  
  // Initialize page with localStorage
  await page.addInitScript(() => {
    localStorage.setItem('language', 'en');
    localStorage.setItem('filtersCollapsed', '0');
    localStorage.setItem('userLocation', JSON.stringify({
      address: 'Szeged, Hungary',
      lat: 46.253,
      lng: 20.141,
    }));
  });
  
  await page.goto('http://127.0.0.1:4173/');
  await page.waitForTimeout(2000);
  
  // Close settings if open
  const overlay = page.locator('.location-settings-overlay');
  if (await overlay.isVisible()) {
    await overlay.click();
  }
  
  // Scroll down
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: 'mobile-button.png', fullPage: true });
  
  const floatingButton = page.locator('button.position-fixed.bottom-0.end-0');
  const isVisible = await floatingButton.isVisible();
  
  console.log('Button visible:', isVisible);
  
  if (isVisible) {
    const box = await floatingButton.boundingBox();
    console.log('Button position:', box);
  }
  
  await browser.close();
})();
