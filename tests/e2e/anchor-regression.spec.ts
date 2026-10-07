import { expect, test } from '@playwright/test';

test('anchor shows intermediate scroll positions and keeps destination below header', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.locator('.rack-scene[data-webgl="active"]').waitFor();
  await page.evaluate(() => {
    const samples: number[] = [];
    (window as unknown as { scrollSamples: number[] }).scrollSamples = samples;
    const record = () => { samples.push(scrollY); if (samples.length < 90) requestAnimationFrame(record); };
    requestAnimationFrame(record);
  });
  await page.getByRole('link', { name: 'Explore the architecture' }).click();
  await page.waitForTimeout(1300);
  const samples = await page.evaluate(() => (window as unknown as { scrollSamples: number[] }).scrollSamples);
  const end = samples.at(-1)!;
  expect(new Set(samples.filter((y) => y > 10 && y < end - 10)).size).toBeGreaterThan(5);
  await expect(page).toHaveURL(/#architecture$/);
  const top = await page.locator('#architecture').evaluate((node) => node.getBoundingClientRect().top);
  const header = await page.locator('.site-header').evaluate((node) => node.getBoundingClientRect().bottom);
  expect(top).toBeGreaterThanOrEqual(header);
  await page.getByRole('link', { name: 'Technology', exact: true }).click();
  await page.waitForTimeout(150);
  await page.getByRole('link', { name: 'About', exact: true }).click();
  await page.waitForTimeout(1100);
  await expect(page).toHaveURL(/#about$/);
  await page.goBack();
  await expect(page).toHaveURL(/#technology$/);
});
