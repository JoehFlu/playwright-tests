import { expect, test } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const pageUrl = pathToFileURL(path.resolve(process.cwd(), 'index.html')).href;

test('opens the local form page', async ({ page }) => {
  await page.goto(pageUrl);

  await expect(page).toHaveTitle('Student Registration Form');
  await expect(page.getByRole('heading', { name: 'Student Registration Form' })).toBeVisible();
});
