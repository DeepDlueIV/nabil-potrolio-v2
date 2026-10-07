import { createHash } from 'node:crypto';
import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'no-preference' });

const hash = (frame: Buffer) => createHash('sha256').update(frame).digest('hex');

test('faster hero completes a cycle in ten seconds and keeps fallback animation at the same speed', async ({ page }) => {
  await page.goto('/');
  const scene = page.locator('.rack-scene');
  await expect(scene).toHaveAttribute('data-running', 'true');
  const began = Date.now();
  await expect(scene).toHaveAttribute('data-phase', 'inside', { timeout: 3500 });
  const insideAt = Date.now() - began;
  expect(insideAt).toBeLessThan(3000);
  await expect(scene).toHaveAttribute('data-phase', 'flow', { timeout: 4000 });
  const flowAt = Date.now() - began;
  expect(flowAt).toBeLessThan(6500);
  const canvas = page.locator('.hardware-canvas canvas');
  const first = hash(await canvas.screenshot());
  await page.waitForTimeout(350);
  expect(hash(await canvas.screenshot())).not.toBe(first);
  await expect(scene).toHaveAttribute('data-phase', 'return', { timeout: 4000 });
  await expect(scene).toHaveAttribute('data-phase', 'system', { timeout: 3000 });
  expect(Date.now() - began).toBeLessThan(11500);
  await canvas.evaluate(node => (node as HTMLCanvasElement).getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext());
  await expect(scene).toHaveAttribute('data-webgl', 'fallback');
  await page.getByRole('tab', { name: 'System', exact: true }).click();
  expect(await page.locator('.hardware-entry').evaluate(node => getComputedStyle(node).animationDuration)).toBe('2s');
  await page.getByRole('tab', { name: 'Data flow', exact: true }).click();
  expect(await page.locator('.hardware-flow').evaluate(node => getComputedStyle(node).animationDuration)).toBe('3s');
  expect(await page.locator('.hardware-tray').evaluate(node => getComputedStyle(node).transitionDuration)).toBe('0.4s');
});

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
