import { expect, test } from '@playwright/test';

for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test(`presentation and smooth navigation work with system motion ${reducedMotion}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
    const scene = page.locator('.rack-scene');
    await expect(scene).toHaveAttribute('data-running', 'true');
    await expect(scene).toHaveAttribute('data-phase', 'inside', { timeout: 10000 });
    await page.evaluate(() => {
      const samples: number[] = [];
      (window as unknown as { motionScrollSamples: number[] }).motionScrollSamples = samples;
      const record = () => { samples.push(scrollY); if (samples.length < 90) requestAnimationFrame(record); };
      requestAnimationFrame(record);
    });
    await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Architecture', exact: true }).click();
    await page.waitForTimeout(1300);
    const samples = await page.evaluate(() => (window as unknown as { motionScrollSamples: number[] }).motionScrollSamples);
    const end = samples.at(-1)!;
    expect(new Set(samples.filter(y => y > 10 && y < end - 10)).size).toBeGreaterThan(5);
    await expect(page.getByTestId('architecture-workbench')).toHaveAttribute('data-running', 'true');
    const packet = page.locator('.architecture-flow__desktop .flow-edge.is-active circle').first();
    const before = await packet.evaluate(node => getComputedStyle(node).offsetDistance);
    await page.waitForTimeout(500);
    expect(await packet.evaluate(node => getComputedStyle(node).offsetDistance)).not.toBe(before);
    await page.getByRole('button', { name: 'Pause animations', exact: true }).click();
    await expect(page.getByTestId('architecture-workbench')).toHaveAttribute('data-running', 'false');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
    await page.getByRole('button', { name: 'Play animations', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
  });
}
