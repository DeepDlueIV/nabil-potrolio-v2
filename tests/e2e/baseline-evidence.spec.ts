import { expect, test } from '@playwright/test';

test.skip(process.env.CAPTURE_BASELINE !== '1', 'Optional historical capture; production may change independently.');

test('retain production baseline screenshots before feature deployment', async ({ page }, testInfo) => {
  test.setTimeout(90000);
  const requests: string[] = [];
  page.on('request', (request) => { if (request.url().includes('/_next/image')) requests.push(request.url()); });
  for (const width of [1440, 1280, 768, 390, 360]) {
    await page.setViewportSize({ width, height: width < 720 ? 844 : 900 });
    await page.goto('https://nabil-potrolio-v2.vercel.app');
    await expect(page.getByRole('heading', { name: 'Intelligence, engineered.' })).toBeVisible();
    await page.screenshot({ path: `output/playwright/showcase-before-${width}-full.png`, fullPage: true });
  }
  await page.getByRole('tab', { name: /Show Full-Stack Systems Engineer/ }).click();
  const result = await page.locator('.experience-image img').evaluate(async (node) => {
    const image = node as HTMLImageElement;
    const before = { currentSrc: image.currentSrc, complete: image.complete, naturalWidth: image.naturalWidth };
    const started = performance.now();
    try { await image.decode(); } catch { /* Ошибка загрузки сохраняется в диагностике. */ }
    return { before, after: { currentSrc: image.currentSrc, complete: image.complete, naturalWidth: image.naturalWidth }, decodeMs: performance.now() - started };
  });
  await testInfo.attach('baseline-image-diagnostics.json', { body: JSON.stringify({ result, requests }, null, 2), contentType: 'application/json' });
  console.info('Baseline image:', JSON.stringify(result));
});
