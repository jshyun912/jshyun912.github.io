import { expect, test } from '@playwright/test';

test('folder URL supports browser back and forward', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: '문제풀이 도구' }).click();
	await expect(page).toHaveURL(/\?folder=tools$/);
	await expect(page.getByRole('link', { name: '글자 수 세기' })).toBeVisible();
	await page.goBack();
	await expect(page).toHaveURL('/');
	await expect(page.getByRole('button', { name: '문제풀이 도구' })).toBeVisible();
	await page.goForward();
	await expect(page.getByRole('link', { name: '글자 수 세기' })).toBeVisible();
});

test('visible back control removes folder from the URL', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: '문제풀이 도구' }).click();
	await page.getByRole('button', { name: '← start' }).click();
	await expect(page).toHaveURL('/');
	await expect(page.getByRole('button', { name: '문제풀이 도구' })).toBeVisible();
});

test('direct folder URL opens its tile list', async ({ page }) => {
	await page.goto('/?folder=tools');
	await expect(page.getByRole('heading', { name: '문제풀이 도구' })).toBeVisible();
	await expect(page.getByRole('link', { name: '글자 수 세기' })).toBeVisible();
	await page.getByRole('button', { name: '← start' }).click();
	await expect(page).toHaveURL('/');
});

test('browser back from a tool returns to its folder', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: '문제풀이 도구' }).click();
	await page.getByRole('link', { name: '글자 수 세기' }).click();
	await expect(page.getByRole('heading', { name: '글자 수 세기' })).toBeVisible();
	await page.goBack();
	await expect(page).toHaveURL(/\?folder=tools$/);
	await expect(page.getByRole('link', { name: '글자 수 세기' })).toBeVisible();
});

test('folder navigation restores keyboard focus', async ({ page }) => {
	await page.goto('/');
	await page.keyboard.press('Tab');
	await expect(page.getByRole('button', { name: '문제풀이 도구' })).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(page.getByRole('button', { name: '← start' })).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(page.getByRole('button', { name: '문제풀이 도구' })).toBeFocused();
});

test('reduced motion disables the horizontal transition', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	await expect(page.locator('.view-pane').first()).toHaveCSS('transition-duration', '0s');
});

test('open folder does not retain the hidden home page height', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/?folder=tools');
	await expect(page.getByRole('heading', { name: '문제풀이 도구' })).toBeVisible();
	const height = await page.evaluate(() => document.documentElement.scrollHeight);
	expect(height).toBeLessThanOrEqual(900);
});
