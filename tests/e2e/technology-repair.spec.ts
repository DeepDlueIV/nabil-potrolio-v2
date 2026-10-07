import { expect, test } from '@playwright/test';

test('technology runs all eight tools without clicks and keeps one stable group control set', async ({ browser }, testInfo) => {
  test.setTimeout(90000);
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference', recordVideo: { dir: 'output/playwright/repair-recordings', size: { width: 1440, height: 900 } } });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://127.0.0.1:3100');
  const show = page.getByRole('figure', { name: 'Technology purpose presentation' });
  await show.scrollIntoViewIfNeeded();
  await page.mouse.move(1400, 800);
  await expect(show).toHaveAttribute('data-running', 'true');
  const names = ['vLLM', 'CUDA', 'Apache Kafka', 'Qdrant', 'Kubernetes', 'Terraform', 'Vault', 'Prometheus', 'vLLM'];
  const seen: string[] = [];
  for (const name of names) {
    await expect(show.getByRole('heading', { level: 3 })).toHaveText(name, { timeout: 6000 });
    seen.push(name);
    if (seen.length < names.length) await expect(show.getByRole('heading', { level: 3 })).not.toHaveText(name, { timeout: 6000 });
  }
  const path = show.getByRole('list', { name: 'vLLM purpose path' });
  const packet = async () => path.evaluate((node) => getComputedStyle(node, '::after').left);
  const packetBefore = await packet();
  await page.waitForTimeout(700);
  expect(await packet()).not.toBe(packetBefore);
  await page.screenshot({ path: 'output/playwright/technology-repaired-1440.png' });
  const navigation = show.getByRole('navigation', { name: 'Technology presentation groups' });
  await expect(navigation.getByRole('button')).toHaveCount(4);
  await show.getByRole('button', { name: 'Pause technology presentation' }).click();
  await page.mouse.move(1400, 800);
  await expect(show.getByRole('button', { name: 'Resume technology presentation' })).toBeVisible();
  await page.waitForTimeout(5000);
  await expect(show.getByRole('heading', { level: 3 })).toHaveText('vLLM');
  await show.getByRole('button', { name: 'Resume technology presentation' }).click();
  await page.mouse.move(1400, 800);
  await expect(show.getByRole('heading', { level: 3 })).toHaveText('CUDA', { timeout: 6000 });
  const data = navigation.getByRole('button', { name: 'Data & streaming' });
  await data.focus();
  await page.keyboard.press('Enter');
  await expect(show.getByRole('heading', { level: 3 })).toHaveText('Apache Kafka');
  await page.waitForTimeout(5000);
  await expect(show.getByRole('heading', { level: 3 })).toHaveText('Apache Kafka');
  await show.getByRole('button', { name: 'Resume technology presentation' }).focus();
  await page.keyboard.press('Enter');
  await expect(show.getByRole('heading', { level: 3 })).toHaveText('Qdrant', { timeout: 6000 });

  await page.setViewportSize({ width: 390, height: 844 });
  await show.scrollIntoViewIfNeeded();
  const positions: number[] = [];
  for (const [group, tool] of [['Compute', 'vLLM'], ['Data & streaming', 'Apache Kafka'], ['Infrastructure', 'Kubernetes'], ['Security & observability', 'Vault']]) {
    await navigation.getByRole('button', { name: group }).click();
    await expect(show.getByRole('heading', { level: 3 })).toHaveText(tool);
    positions.push(await navigation.evaluate((node) => node.getBoundingClientRect().top - node.closest('figure')!.getBoundingClientRect().top));
  }
  expect(Math.max(...positions) - Math.min(...positions)).toBeLessThanOrEqual(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'output/playwright/technology-repaired-390.png' });
  await expect(page.getByRole('link', { name: 'Source on GitHub' })).toHaveAttribute('href', 'https://github.com/DeepDlueIV/nabil-potrolio-v2');
  await testInfo.attach('technology-observation.json', { body: JSON.stringify({ seen, positions, packetBefore, errors }, null, 2), contentType: 'application/json' });
  expect(errors).toEqual([]);
  const video = page.video();
  await context.close();
  if (video) await testInfo.attach('technology-autoplay.webm', { path: await video.path(), contentType: 'video/webm' });
});
