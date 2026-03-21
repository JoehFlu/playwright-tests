import { test, expect } from '@playwright/test';

test('radio-button', async ({ page }) => {
  await page.goto('https://demoqa.com/radio-button', { 
    waitUntil: 'domcontentloaded' 
  });
  
  await page.getByRole('radio', { name: 'Yes' }).check();
  await page.getByRole('radio', { name: 'Impressive' }).check();
});