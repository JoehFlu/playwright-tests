import { test, expect } from '@playwright/test';

test('text-box form submission', async ({ page }) => {

  await page.goto('https://demoqa.com/text-box');

  await page.locator('#userName').fill('John Doe');
  await page.locator('#userEmail').fill('john.doe@example.com');
  await page.locator('#currentAddress').fill('123 Main St');
  await page.locator('#permanentAddress').fill('456 Oak Ave');
  await page.locator('#submit').click();
  

  await page.waitForSelector('#output', { timeout: 10000 });
  
  const output = page.locator('#output');
  await expect(output).toBeVisible();
  await expect(output).toContainText('John Doe');
});