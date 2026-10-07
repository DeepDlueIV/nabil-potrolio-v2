import { expect, test } from '@playwright/test';

test('cold responsive photo candidate remains decoded after resize', async ({ page, context }, testInfo) => {
  test.setTimeout(60000);
  const network = await context.newCDPSession(page);
  await network.send('Network.enable');
  await network.send('Network.setCacheDisabled', { cacheDisabled: true });
  await network.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 100000 });
  const requests: Array<{ url: string; at: number }> = [];
  page.on('request', (request) => { if (request.url().includes('/_next/image')) requests.push({ url: request.url(), at: Date.now() }); });
  await page.route('**/_next/image*', (route) => route.request().url().includes('experience-systems') ? route.abort() : route.continue());
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('.experience-showcase').scrollIntoViewIfNeeded();
  await expect(page.locator('.experience-showcase')).toHaveAttribute('data-ready', 'true', { timeout: 12000 });
  await page.mouse.move(0, 0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Show experience frame 2' }).click();
  await expect(page.locator('.experience-showcase')).toHaveAttribute('data-frame', '1', { timeout: 12000 });
  const image = page.locator('.experience-photo--current');
  const result = await image.evaluate(async (node) => {
    const photo = node as HTMLImageElement;
    const decodeStart = performance.now();
    await photo.decode();
    return { currentSrc: photo.currentSrc, naturalWidth: photo.naturalWidth, complete: photo.complete, requiredWidth: photo.getBoundingClientRect().width * devicePixelRatio, decodeMs: performance.now() - decodeStart };
  });
  expect(result.complete).toBe(true);
  expect(result.naturalWidth).toBeGreaterThan(0);
  expect(result.currentSrc).toContain('experience-network');
  // После уменьшения viewport браузер вправе повторно использовать больший декодированный кандидат.
  expect(result.naturalWidth).toBeGreaterThanOrEqual(Math.ceil(result.requiredWidth));
  await testInfo.attach('cold-resize-image-diagnostics.json', { body: JSON.stringify({ result, requests }, null, 2), contentType: 'application/json' });
  console.info('Cold resize image:', JSON.stringify(result));
  await page.getByRole('button', { name: 'Show experience frame 3' }).click();
  await expect(page.locator('.experience-showcase')).toHaveAttribute('data-frame', '2', { timeout: 8000 });
  await expect(page.locator('.experience-photo-fallback')).toBeVisible();
  await expect(page.locator('.experience-photo--previous')).toHaveCount(0);
});

test('record automatic hero architecture and photograph presentation', async ({ browser }, testInfo) => {
  test.setTimeout(200000);
  const context = await browser.newContext({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 }, recordVideo: { dir: 'output/playwright/showcase-recordings', size: { width: 1440, height: 900 } } });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://127.0.0.1:3100');
  await page.locator('.rack-scene[data-webgl="active"]').waitFor();
  await page.mouse.move(1050, 350);
  const phases = new Set<string>();
  for (let i = 0; i < 21; i++) { phases.add((await page.locator('.rack-scene').getAttribute('data-phase'))!); await page.waitForTimeout(1000); }
  expect([...phases].sort()).toEqual(['flow', 'inside', 'return', 'system']);
  await page.getByTestId('architecture-workbench').scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const scenarios = new Set<string>();
  for (let i = 0; i < 25; i++) { scenarios.add((await page.locator('.scenario-tabs [aria-selected="true"]').getAttribute('id'))!); await page.waitForTimeout(2000); }
  expect(scenarios.size).toBe(3);
  await page.locator('.experience-showcase').scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const roles = new Set<string>();
  for (let i = 0; i < 18; i++) { roles.add((await page.locator('.experience-showcase').getAttribute('data-frame'))!); await page.waitForTimeout(2000); }
  expect([...roles].sort()).toEqual(['0', '1', '2', '3']);
  const technology = page.getByRole('figure', { name: 'Technology purpose presentation' });
  await technology.scrollIntoViewIfNeeded();
  await page.mouse.move(20, 100);
  const tools = new Set<string>();
  for (let i = 0; i < 19; i++) { tools.add((await technology.locator('h3').textContent())!); await page.waitForTimeout(2000); }
  expect(tools.size).toBe(8);
  expect(errors).toEqual([]);
  const video = page.video();
  await context.close();
  if (video) await testInfo.attach('automatic-presentation.webm', { path: await video.path(), contentType: 'video/webm' });
});
