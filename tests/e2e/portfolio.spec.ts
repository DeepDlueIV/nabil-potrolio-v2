import { expect, test } from '@playwright/test';

test('core content and screenshots at five target widths', async ({ page }) => {
  test.setTimeout(60000);
  for (const width of [1440, 1280, 768, 390, 360]) {
    const heights: Record<number, number> = { 1440: 900, 1280: 800, 768: 1024, 390: 844, 360: 800 };
    await page.setViewportSize({ width, height: heights[width] });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Intelligence, engineered.' })).toBeVisible();
    await expect(page.getByText('7 years of experience')).toBeVisible();
    await expect(page.getByRole('region', { name: 'Career chronology' }).locator('article')).toHaveCount(4);
    await expect(page.getByRole('region', { name: 'Complete technology stack' }).locator('li')).toHaveCount(34);
    await expect(page.locator('details')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Reduce motion|Reset|Send/i })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await page.locator('.rack-scene[data-webgl="active"]').waitFor({ timeout: 15000 });
    await page.screenshot({ path: `output/playwright/showcase-after-${width}-hero.png` });
    await page.locator('#about').screenshot({ path: `output/playwright/showcase-after-${width}-about.png` });
    await page.locator('#architecture').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `output/playwright/showcase-after-${width}-architecture.png` });
    await page.getByTestId('architecture-diagram').screenshot({ path: `output/playwright/showcase-after-${width}-diagram.png` });
    await page.locator('#experience').scrollIntoViewIfNeeded();
    await page.locator('.experience-showcase[data-ready="true"]').waitFor();
    await page.screenshot({ path: `output/playwright/showcase-after-${width}-experience.png` });
    await page.screenshot({ path: `output/playwright/showcase-after-${width}-full.png`, fullPage: true });
    await page.locator('#technology').screenshot({ path: `output/playwright/showcase-after-${width}-technology.png` });
  }
});

test('native scroll, anchors and browser history', async ({ page }) => {
  await page.goto('/');
  await page.mouse.wheel(0, 240);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
  await page.getByRole('link', { name: 'Explore the architecture' }).click();
  await expect(page).toHaveURL(/#architecture$/);
  await page.getByRole('link', { name: 'Experience', exact: true }).click();
  await expect(page).toHaveURL(/#experience$/);
  await page.goBack();
  await expect(page).toHaveURL(/#architecture$/);
  await page.goForward();
  await expect(page).toHaveURL(/#experience$/);
});

test('manual holds and contact workflow', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:3100' });
  await page.goto('/');
  await page.getByRole('tab', { name: 'Secure Enterprise AI' }).click();
  const architecture = page.locator('#architecture');
  await expect(architecture.getByRole('heading', { name: 'Authenticated request' })).toBeVisible();
  await page.waitForTimeout(3500);
  await expect(architecture.getByRole('heading', { name: 'Authenticated request' })).toBeVisible();
  await architecture.getByRole('button', { name: 'Resume architecture presentation' }).click();
  await expect(architecture.getByRole('heading', { name: 'Policy and inference' })).toBeVisible({ timeout: 4500 });
  await page.getByRole('button', { name: 'Show experience frame 4' }).click();
  await expect(page.locator('.experience-showcase')).toHaveAttribute('data-requested', '3');
  await expect(page.locator('.experience-showcase')).toHaveAttribute('data-frame', '3', { timeout: 8000 });
  await expect(page.locator('.experience-showcase h3')).toHaveText('Full-Stack Systems Engineer');
  await page.locator('.experience-showcase').getByRole('button', { name: 'Resume experience presentation' }).click();
  await expect(page.locator('.experience-showcase').getByRole('button', { name: 'Pause experience presentation' })).toBeFocused();
  await page.getByRole('button', { name: 'Data & streaming', exact: true }).click();
  await expect(page.locator('#technology').getByRole('heading', { name: 'Apache Kafka', exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Complete technology stack' }).getByText('ISO 27001', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Discuss Fractional CTO' }).click();
  const dialog = page.getByRole('dialog', { name: 'Start a conversation.' });
  await expect(dialog.getByLabel('Service (optional)')).toHaveValue('fractional-cto');
  await dialog.getByLabel('Your name').fill('Ada Lovelace');
  await dialog.getByLabel('Reply email').fill('ada@example.com');
  await dialog.getByLabel('Task summary').fill('Review our private inference architecture.');
  await dialog.getByRole('button', { name: 'Prepare brief' }).click();
  await expect(dialog.getByRole('status')).toHaveText('Brief copied. Nothing was sent.');
});

test('visitor can pause motion and use manual rendering', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Pause animations', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await page.getByRole('tab', { name: 'Inside', exact: true }).click();
  await expect(page.locator('.rack-scene')).toHaveAttribute('data-phase', 'inside');
  await page.getByRole('tab', { name: 'Data flow', exact: true }).click();
  await expect(page.locator('.rack-scene')).toHaveAttribute('data-phase', 'flow');
  await page.locator('#architecture').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('architecture-workbench')).toHaveAttribute('data-running', 'false');
});

test('WebGL context loss preserves the manual SVG presentation', async ({ page }) => {
  await page.goto('/');
  await page.locator('.rack-scene[data-webgl="active"]').waitFor();
  await page.locator('.hardware-canvas canvas').evaluate((node) => {
    const canvas = node as HTMLCanvasElement;
    canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
  });
  await expect(page.locator('.rack-scene')).toHaveAttribute('data-webgl', 'fallback');
  await page.getByRole('tab', { name: 'Inside', exact: true }).click();
  await expect(page.getByTestId('compute-poster')).toHaveAttribute('data-phase', 'inside');
  await expect(page.getByTestId('compute-poster')).toBeVisible();
});

test('core chronology and stack do not depend on JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:3100');
  await expect(page.getByRole('region', { name: 'Career chronology' }).locator('article')).toHaveCount(4);
  await expect(page.getByRole('region', { name: 'Complete technology stack' }).locator('li')).toHaveCount(34);
  await expect(page.getByRole('img', { name: 'Nabil Rakdani beside a GPU rig' })).toBeVisible();
  await expect(page.getByTestId('compute-poster')).toBeVisible();
  await context.close();
});
