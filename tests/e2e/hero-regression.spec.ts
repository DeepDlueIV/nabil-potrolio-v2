import { createHash } from 'node:crypto';
import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'no-preference' });

const hash = (frame: Buffer) => createHash('sha256').update(frame).digest('hex');

test('held manual tray transition keeps rendering and pointer changes the angle', async ({ page }) => {
  await page.goto('/');
  await page.locator('.rack-scene[data-webgl="active"]').waitFor();
  const canvas = page.locator('.hardware-canvas canvas');
  await page.getByRole('tab', { name: 'Inside', exact: true }).click();
  await page.waitForTimeout(80);
  const early = hash(await canvas.screenshot());
  await page.waitForTimeout(700);
  const late = hash(await canvas.screenshot());
  expect(early, 'manual hold must not snap the tray to its final position').not.toBe(late);
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Canvas missing');
  await page.mouse.move(box.x + box.width * .9, box.y + box.height * .4);
  await page.waitForTimeout(700);
  expect(hash(await canvas.screenshot()), 'held model still responds to pointer').not.toBe(late);
});
