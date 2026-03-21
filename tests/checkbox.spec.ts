import { test, expect } from '@playwright/test';

test('checkbox', async ({ page }) => {
  await page.goto('https://demoqa.com/checkbox', { 
    waitUntil: 'domcontentloaded' 
  });

  await page.locator('.rc-tree-switcher').click();
  await page.locator('.rc-tree-switcher.rc-tree-switcher_close').first().click();
  await page.locator('.rc-tree-switcher.rc-tree-switcher_close').first().click();
  await page.locator('.rc-tree-switcher.rc-tree-switcher_close').first().click();
  await page.locator('.rc-tree-switcher.rc-tree-switcher_close').first().click();
  await page.locator('.rc-tree-switcher.rc-tree-switcher_close').click();
  await page.getByRole('checkbox', { name: 'Select Home' }).click();
});