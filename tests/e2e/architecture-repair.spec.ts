import { expect, test } from '@playwright/test';

test('architecture holds the scenario without freezing its healthy packet flow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#architecture');
  const workbench = page.getByTestId('architecture-workbench');
  await workbench.scrollIntoViewIfNeeded();
  await page.getByRole('tab', { name: 'Streaming Data Platform' }).click();
  const diagram = page.getByTestId('architecture-diagram');
  await expect(diagram).toHaveAttribute('data-running', 'true');
  const packet = page.locator('.architecture-flow__desktop .flow-edge.is-active circle').first();
  const before = await packet.evaluate((element) => getComputedStyle(element).offsetDistance);
  await page.waitForTimeout(800);
  const after = await packet.evaluate((element) => getComputedStyle(element).offsetDistance);
  expect(after).not.toBe(before);
  await expect(page.getByRole('tab', { name: 'Streaming Data Platform' })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Resume architecture presentation' }).click();
  await expect(workbench).toHaveAttribute('data-running', 'true');
  await expect(page.locator('.architecture-stage h4')).toHaveText('Stream processing', { timeout: 5000 });
});

test('architecture panel preserves its compact shell across viewport widths', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [1440, 1280, 900, 390]) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    await page.goto('/#architecture');
    await page.locator('.architecture-navigation').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('architecture-workbench')).toHaveAttribute('data-motion', 'reduced');
    await expect(page.locator('.architecture-sidebar')).toBeVisible();
    const background = await page.locator('#architecture').evaluate((element) => getComputedStyle(element, '::before').content);
    expect(background).toBe('none');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(overflow).toBe(false);
    await page.addStyleTag({ content: '.site-header, .skip-link { visibility: hidden !important; }' });
    await page.locator('.architecture-presentation').screenshot({ path: `output/playwright/architecture-repaired-${width}.png` });
  }
});

test('architecture presents all three scenarios autonomously with a real recovery', async ({ page }) => {
  test.setTimeout(70000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#architecture');
  await page.locator('.architecture-presentation').scrollIntoViewIfNeeded();
  await page.mouse.move(900, 450);
  const diagram = page.getByTestId('architecture-diagram');
  await expect(page.getByRole('tab', { name: 'Private LLM / RAG' })).toHaveAttribute('aria-selected', 'true');
  await expect(diagram).toHaveAttribute('data-status', 'rerouted', { timeout: 15000 });
  await expect(diagram).toHaveAttribute('data-route', /inference-b/);
  await expect(page.getByRole('tab', { name: 'Streaming Data Platform' })).toHaveAttribute('aria-selected', 'true', { timeout: 15000 });
  await expect(diagram).toHaveAttribute('data-status', 'rerouted', { timeout: 15000 });
  await expect(diagram).toHaveAttribute('data-route', /worker-b/);
  await expect(page.getByRole('tab', { name: 'Secure Enterprise AI' })).toHaveAttribute('aria-selected', 'true', { timeout: 15000 });
  await expect(diagram).toHaveAttribute('data-status', 'queued', { timeout: 15000 });
  await expect(diagram).toHaveAttribute('data-route', 'enterprise-user>identity>policy');
  await expect(page.locator('.architecture-stage h4')).toHaveText('Inference restored', { timeout: 6000 });
  await expect(diagram).toHaveAttribute('data-route', /private-inference>response/);
});

test('capture historical shell and broken showcase at the same viewport', async ({ page }) => {
  test.skip(process.env.CAPTURE_ARCHITECTURE_REFERENCE !== '1', 'Optional isolated historical comparison.');
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:3102/#architecture');
  await page.locator('.architecture-workbench').scrollIntoViewIfNeeded();
  await page.locator('#architecture').screenshot({ path: 'output/playwright/architecture-reference-847f5cca-1440.png' });
  await page.goto('/#architecture');
  await page.getByTestId('architecture-workbench').scrollIntoViewIfNeeded();
  await page.locator('#architecture').screenshot({ path: 'output/playwright/architecture-before-1440.png' });
});
