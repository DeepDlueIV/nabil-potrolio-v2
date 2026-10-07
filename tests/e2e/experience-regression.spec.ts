import { expect, test } from '@playwright/test';

test('experience navigation remains with the decoded visible frame', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  let releaseImage: () => void = () => undefined;
  const imageGate = new Promise<void>((resolve) => { releaseImage = resolve; });
  await page.route('**/_next/image*', async (route) => {
    if (route.request().url().includes('experience-network')) await imageGate;
    await route.continue();
  });
  await page.goto('/');
  const showcase = page.locator('.experience-showcase');
  await showcase.scrollIntoViewIfNeeded();
  await expect(showcase).toHaveAttribute('data-ready', 'true');
  await page.getByRole('button', { name: 'Show experience frame 2' }).click();
  await expect(showcase).toHaveAttribute('data-requested', '1');
  await expect(page.getByRole('button', { name: 'Show experience frame 1' })).toHaveAttribute('aria-pressed', 'true');
  releaseImage();
  await expect(showcase).toHaveAttribute('data-frame', '1');
  await expect(page.getByRole('button', { name: 'Show experience frame 2' })).toHaveAttribute('aria-pressed', 'true');
});

test('experience buttons keep their position through every role and resume', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const showcase = page.locator('.experience-showcase');
  await showcase.scrollIntoViewIfNeeded();
  await expect(showcase).toHaveAttribute('data-ready', 'true');
  const first = page.getByRole('button', { name: 'Show experience frame 1' });
  await first.click();
  const anchor = await first.boundingBox();
  for (let index = 1; index < 4; index += 1) {
    await page.getByRole('button', { name: `Show experience frame ${index + 1}` }).click();
    await expect(showcase).toHaveAttribute('data-frame', String(index));
    const position = await first.boundingBox();
    expect(Math.abs(position!.y - anchor!.y)).toBeLessThanOrEqual(2);
    expect(Math.abs(position!.x - anchor!.x)).toBeLessThanOrEqual(2);
  }
  await page.getByRole('button', { name: 'Resume experience presentation' }).click();
  await expect(showcase).toHaveAttribute('data-frame', '0', { timeout: 12000 });
});

test('experience shows all four decoded roles and repeats without a control click', async ({ page }) => {
  test.setTimeout(55000);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const showcase = page.locator('.experience-showcase');
  await showcase.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  for (const index of [0, 1, 2, 3, 0]) {
    await expect(showcase).toHaveAttribute('data-frame', String(index), { timeout: 12000 });
    await expect(page.getByRole('button', { name: `Show experience frame ${index + 1}` })).toHaveAttribute('aria-pressed', 'true');
    await expect(showcase.locator('.experience-photo--current')).toBeVisible();
    expect(await showcase.locator('.experience-photo--current').evaluate((node) => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0)).toBe(true);
  }
});
