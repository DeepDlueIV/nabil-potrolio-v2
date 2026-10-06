import { expect, test } from '@playwright/test';

test('core content stays present without horizontal overflow', async ({ page }) => {
  const viewports = [
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Intelligence, engineered.' })).toBeVisible();
    await expect(page.getByText('7 years of experience')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${viewport.width}px viewport overflow`).toBeLessThanOrEqual(1);
  }
});

test('interactive architecture, experience, technology, motion, and contact flows remain usable', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:3000' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');

  await page.getByRole('tab', { name: 'Secure Enterprise AI' }).click();
  await page.getByRole('button', { name: 'Pause Private inference' }).click();
  await expect(page.getByRole('status', { name: 'Demo status' })).toContainText('queued');
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByRole('status', { name: 'Demo status' })).toContainText('Ready');

  await page.getByRole('tab', { name: /Show Full-Stack Systems Engineer/ }).click();
  await expect(page.getByRole('heading', { name: 'Full-Stack Systems Engineer' })).toBeVisible();
  await expect(page.getByRole('img', { name: /electronic hardware/i })).toHaveAttribute('src', /experience-hardware/);

  await page.getByRole('button', { name: 'Qdrant' }).click();
  await expect(page.locator('.technology-inspector').getByText('Vector retrieval for semantic context')).toBeVisible();
  await page.getByRole('button', { name: 'View all technologies' }).click();
  await expect(page.getByRole('button', { name: 'ISO 27001' })).toBeVisible();

  const motionControl = page.getByRole('button', { name: 'Reduce motion' });
  await motionControl.click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');

  await page.getByRole('button', { name: 'Discuss Fractional CTO' }).click();
  const dialog = page.getByRole('dialog', { name: 'Start a conversation.' });
  await expect(dialog.getByLabel('Service (optional)')).toHaveValue('fractional-cto');
  await dialog.getByLabel('Your name').fill('Ada Lovelace');
  await dialog.getByLabel('Reply email').fill('ada@example.com');
  await dialog.getByLabel('Task summary').fill('We need to understand where our private inference path is saturating.');
  await dialog.getByRole('button', { name: 'Prepare brief' }).click();
  await expect(dialog.getByRole('status')).toHaveText('Brief copied. Nothing was sent.');
});
